import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const DEFAULT_ENV_FILE = "~/.openclaw/secrets/x-api.env";
const DEFAULT_REDIRECT_URI = "http://127.0.0.1:8788/x/callback";
const DEFAULT_SCOPES = ["tweet.read", "users.read", "tweet.write", "offline.access"];

function expandHome(value) {
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}

function parseEnvFile(filePath) {
  const resolved = expandHome(filePath);
  if (!fs.existsSync(resolved)) return {};
  const raw = fs.readFileSync(resolved, "utf8");
  const values = {};
  for (const line of raw.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function formatEnvValue(value) {
  return JSON.stringify(String(value ?? ""));
}

function writeEnvUpdates(filePath, updates) {
  const resolved = expandHome(filePath);
  const existing = fs.existsSync(resolved) ? fs.readFileSync(resolved, "utf8").split(/\r?\n/u) : [];
  const nextLines = [];
  const handledKeys = new Set();
  for (const line of existing) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/u);
    if (!match) {
      nextLines.push(line);
      continue;
    }
    const key = match[1];
    if (!Object.prototype.hasOwnProperty.call(updates, key)) {
      nextLines.push(line);
      continue;
    }
    if (handledKeys.has(key)) continue;
    nextLines.push(`${key}=${formatEnvValue(updates[key])}`);
    handledKeys.add(key);
  }
  for (const [key, value] of Object.entries(updates)) {
    if (handledKeys.has(key)) continue;
    nextLines.push(`${key}=${formatEnvValue(value)}`);
  }
  const nextContent = nextLines.join("\n").replace(/\n*$/u, "\n");
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const tempPath = `${resolved}.tmp`;
  fs.writeFileSync(tempPath, nextContent, { mode: 0o600 });
  fs.renameSync(tempPath, resolved);
  try {
    fs.chmodSync(resolved, 0o600);
  } catch {}
}

function sha256Base64Url(input) {
  return crypto.createHash("sha256").update(input).digest("base64url");
}

function buildBasicAuthHeader(clientId, clientSecret) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

function openInBrowser(url) {
  const child = spawn("open", [url], {
    detached: true,
    stdio: "ignore"
  });
  child.unref();
}

async function exchangeCodeForTokens({ tokenUrl, code, codeVerifier, redirectUri, clientId, clientSecret }) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  const body = new URLSearchParams({
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code_verifier: codeVerifier
  });
  if (clientSecret) headers.Authorization = buildBasicAuthHeader(clientId, clientSecret);
  else body.set("client_id", clientId);

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers,
    body: body.toString(),
    signal: AbortSignal.timeout(30_000)
  });
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    const detail = payload?.error_description || payload?.detail || payload?.error || response.statusText;
    throw new Error(`Token exchange failed (${response.status}): ${detail}`);
  }
  return payload;
}

async function waitForCallback({ redirectUri, authorizeUrl, tokenUrl, clientId, clientSecret, codeVerifier, expectedState }) {
  const parsed = new URL(redirectUri);
  const port = Number(parsed.port || (parsed.protocol === "https:" ? 443 : 80));
  const host = parsed.hostname;
  const pathname = parsed.pathname || "/";

  if (!(host === "127.0.0.1" || host === "localhost")) {
    throw new Error(`bootstrap-oauth2 only auto-listens on localhost/127.0.0.1 callbacks. Current redirect URI: ${redirectUri}`);
  }

  return await new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const requestUrl = new URL(req.url, `${parsed.protocol}//${req.headers.host}`);
        if (requestUrl.pathname !== pathname) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        const state = requestUrl.searchParams.get("state");
        const code = requestUrl.searchParams.get("code");
        const error = requestUrl.searchParams.get("error");
        if (error) {
          res.statusCode = 400;
          res.end(`X returned an error: ${error}`);
          server.close();
          reject(new Error(`Authorization failed: ${error}`));
          return;
        }
        if (!state || state !== expectedState) {
          res.statusCode = 400;
          res.end("State mismatch");
          server.close();
          reject(new Error("State mismatch in OAuth callback."));
          return;
        }
        if (!code) {
          res.statusCode = 400;
          res.end("Missing code");
          server.close();
          reject(new Error("Missing authorization code in callback."));
          return;
        }
        const payload = await exchangeCodeForTokens({
          tokenUrl,
          code,
          codeVerifier,
          redirectUri,
          clientId,
          clientSecret
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("X OAuth complete. You can return to Codex/OpenClaw now.");
        server.close();
        resolve(payload);
      } catch (error) {
        res.statusCode = 500;
        res.end(`OAuth bootstrap failed: ${error.message}`);
        server.close();
        reject(error);
      }
    });
    server.listen(port, host, () => {
      console.log(`Listening for X OAuth callback on ${redirectUri}`);
      console.log(`Opening authorize URL in browser...`);
      console.log(authorizeUrl);
      openInBrowser(authorizeUrl);
    });
    server.on("error", reject);
  });
}

async function main() {
  const envFile = process.argv[2] ? expandHome(process.argv[2]) : expandHome(DEFAULT_ENV_FILE);
  const env = {
    ...parseEnvFile(envFile),
    ...process.env
  };
  const clientId = env.X_CLIENT_ID;
  const clientSecret = env.X_CLIENT_SECRET;
  const redirectUri = env.X_OAUTH2_REDIRECT_URI || DEFAULT_REDIRECT_URI;
  const scope = env.X_OAUTH2_SCOPES || DEFAULT_SCOPES.join(" ");

  if (!clientId) {
    throw new Error(`Missing X_CLIENT_ID in ${envFile}`);
  }

  const codeVerifier = crypto.randomBytes(48).toString("base64url");
  const codeChallenge = sha256Base64Url(codeVerifier);
  const state = crypto.randomBytes(24).toString("hex");
  const authorizeUrl = new URL("https://x.com/i/oauth2/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", scope);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  console.log(`Using env file: ${envFile}`);
  console.log(`Make sure this exact callback URL is allowed in your X app settings: ${redirectUri}`);
  console.log(`Requested scopes: ${scope}`);

  const payload = await waitForCallback({
    redirectUri,
    authorizeUrl: authorizeUrl.toString(),
    tokenUrl: "https://api.x.com/2/oauth2/token",
    clientId,
    clientSecret,
    codeVerifier,
    expectedState: state
  });

  const updates = {
    X_OAUTH2_ACCESS_TOKEN: payload.access_token,
    X_OAUTH2_REDIRECT_URI: redirectUri
  };
  if (typeof payload.refresh_token === "string" && payload.refresh_token) {
    updates.X_OAUTH2_REFRESH_TOKEN = payload.refresh_token;
  }
  if (typeof payload.expires_in === "number" && Number.isFinite(payload.expires_in)) {
    updates.X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT = new Date(Date.now() + payload.expires_in * 1000).toISOString();
  }
  writeEnvUpdates(envFile, updates);

  console.log("\nSaved OAuth 2.0 tokens:");
  console.log(`- X_OAUTH2_ACCESS_TOKEN`);
  if (updates.X_OAUTH2_REFRESH_TOKEN) console.log(`- X_OAUTH2_REFRESH_TOKEN`);
  if (updates.X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT) console.log(`- X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT`);
  console.log("\nThe running OpenClaw gateway should pick up the updated env file on the next X tool call.");
  console.log("Restarting the gateway is optional if you want a clean reload.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
