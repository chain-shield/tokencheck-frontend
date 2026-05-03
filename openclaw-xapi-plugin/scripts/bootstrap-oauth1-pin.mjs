import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawn } from "node:child_process";

const DEFAULT_ENV_FILE = "~/.openclaw/secrets/x-api.env";

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

function percentEncode(value) {
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function parseFormEncoded(text) {
  const params = new URLSearchParams(text);
  return Object.fromEntries(params.entries());
}

function openInBrowser(url) {
  const child = spawn("open", [url], {
    detached: true,
    stdio: "ignore"
  });
  child.unref();
}

function buildOAuth1Header({ method, url, consumerKey, consumerSecret, token, tokenSecret, extraOAuthParams = {} }) {
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_version: "1.0",
    ...extraOAuthParams
  };
  if (token) oauthParams.oauth_token = token;

  const signatureParams = [];
  for (const [key, value] of url.searchParams.entries()) {
    signatureParams.push([percentEncode(key), percentEncode(value)]);
  }
  for (const [key, value] of Object.entries(oauthParams)) {
    signatureParams.push([percentEncode(key), percentEncode(value)]);
  }
  signatureParams.sort(([leftKey, leftValue], [rightKey, rightValue]) => {
    if (leftKey === rightKey) return leftValue.localeCompare(rightValue);
    return leftKey.localeCompare(rightKey);
  });
  const normalizedParams = signatureParams.map(([key, value]) => `${key}=${value}`).join("&");
  const normalizedUrl = `${url.protocol}//${url.host}${url.pathname}`;
  const signatureBaseString = [
    method.toUpperCase(),
    percentEncode(normalizedUrl),
    percentEncode(normalizedParams)
  ].join("&");
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret ?? "")}`;
  const signature = crypto.createHmac("sha1", signingKey).update(signatureBaseString).digest("base64");

  return "OAuth " + Object.entries({
    ...oauthParams,
    oauth_signature: signature
  })
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${percentEncode(key)}=\"${percentEncode(value)}\"`)
    .join(", ");
}

async function signedPostForm({ url, consumerKey, consumerSecret, token, tokenSecret, extraOAuthParams = {} }) {
  const endpoint = new URL(url);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: buildOAuth1Header({
        method: "POST",
        url: endpoint,
        consumerKey,
        consumerSecret,
        token,
        tokenSecret,
        extraOAuthParams
      }),
      "User-Agent": "openclaw-xapi-plugin/0.3.0"
    },
    signal: AbortSignal.timeout(30_000)
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`OAuth 1.0a request failed (${response.status}): ${text || response.statusText}`);
  }
  return parseFormEncoded(text);
}

async function main() {
  const envFile = process.argv[2] ? expandHome(process.argv[2]) : expandHome(DEFAULT_ENV_FILE);
  const env = {
    ...parseEnvFile(envFile),
    ...process.env
  };
  const consumerKey = env.X_API_KEY;
  const consumerSecret = env.X_API_KEY_SECRET;
  if (!consumerKey || !consumerSecret) {
    throw new Error(`Missing X_API_KEY or X_API_KEY_SECRET in ${envFile}`);
  }

  console.log(`Using env file: ${envFile}`);
  console.log("Requesting OAuth 1.0a request token with PIN-based auth (oauth_callback=oob)...");

  const requestTokenPayload = await signedPostForm({
    url: "https://api.x.com/oauth/request_token",
    consumerKey,
    consumerSecret,
    extraOAuthParams: {
      oauth_callback: "oob"
    }
  });

  const requestToken = requestTokenPayload.oauth_token;
  const requestTokenSecret = requestTokenPayload.oauth_token_secret;
  if (!requestToken || !requestTokenSecret) {
    throw new Error("X did not return an OAuth request token and secret.");
  }

  const authorizeUrl = `https://api.x.com/oauth/authorize?oauth_token=${encodeURIComponent(requestToken)}`;
  console.log("\nOpening X authorization page in your browser:");
  console.log(authorizeUrl);
  openInBrowser(authorizeUrl);
  console.log("\nAfter you approve the app, X will show you a PIN.");

  const rl = readline.createInterface({ input, output });
  const pin = (await rl.question("Paste the X PIN here: ")).trim();
  rl.close();
  if (!pin) {
    throw new Error("PIN is required.");
  }

  const accessTokenPayload = await signedPostForm({
    url: "https://api.x.com/oauth/access_token",
    consumerKey,
    consumerSecret,
    token: requestToken,
    tokenSecret: requestTokenSecret,
    extraOAuthParams: {
      oauth_verifier: pin
    }
  });

  const accessToken = accessTokenPayload.oauth_token;
  const accessTokenSecret = accessTokenPayload.oauth_token_secret;
  if (!accessToken || !accessTokenSecret) {
    throw new Error("X did not return an OAuth access token and secret.");
  }

  writeEnvUpdates(envFile, {
    X_ACCESS_TOKEN: accessToken,
    X_ACCESS_TOKEN_SECRET: accessTokenSecret
  });

  console.log("\nSaved OAuth 1.0a credentials:");
  console.log("- X_ACCESS_TOKEN");
  console.log("- X_ACCESS_TOKEN_SECRET");
  console.log("\nThe running OpenClaw gateway should pick up the updated env file on the next X write tool call.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
