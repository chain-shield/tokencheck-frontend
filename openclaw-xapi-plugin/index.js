import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function definePluginEntry({ id, name, description, register }) {
  return {
    id,
    name,
    description,
    register,
    get configSchema() {
      return {};
    }
  };
}

function jsonResult(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2)
      }
    ],
    details: payload
  };
}

function toolInputError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function toSnakeCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function readStringParam(params, key, options = {}) {
  const raw = params?.[key] ?? params?.[toSnakeCase(key)];
  if (typeof raw !== "string") {
    if (options.required) throw toolInputError(`${options.label ?? key} required`);
    return undefined;
  }
  const value = options.trim === false ? raw : raw.trim();
  if (!value && !options.allowEmpty) {
    if (options.required) throw toolInputError(`${options.label ?? key} required`);
    return undefined;
  }
  return value;
}

function readNumberParam(params, key, options = {}) {
  const raw = params?.[key] ?? params?.[toSnakeCase(key)];
  let value;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    value = raw;
  } else if (typeof raw === "string" && raw.trim()) {
    const parsed = Number(raw.trim());
    if (Number.isFinite(parsed)) value = parsed;
  }
  if (value === undefined) {
    if (options.required) throw toolInputError(`${options.label ?? key} required`);
    return undefined;
  }
  return options.integer ? Math.trunc(value) : value;
}

function readBooleanParam(params, key) {
  const raw = params?.[key] ?? params?.[toSnakeCase(key)];
  return typeof raw === "boolean" ? raw : undefined;
}

function expandHome(value) {
  if (typeof value !== "string") return value;
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}

function parseEnvFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8");
  const values = {};
  for (const line of raw.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    if (!key) continue;
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

function resolvePluginConfig(config) {
  const authMode = typeof config?.authMode === "string" && ["auto", "oauth2", "oauth1"].includes(config.authMode)
    ? config.authMode
    : "auto";
  return {
    envFile: expandHome(typeof config?.envFile === "string" && config.envFile.trim() ? config.envFile.trim() : "~/.openclaw/secrets/x-api.env"),
    baseUrl: typeof config?.baseUrl === "string" && config.baseUrl.trim() ? config.baseUrl.trim().replace(/\/+$/u, "") : "https://api.x.com",
    tokenUrl: typeof config?.tokenUrl === "string" && config.tokenUrl.trim() ? config.tokenUrl.trim().replace(/\/+$/u, "") : "https://api.x.com/2/oauth2/token",
    allowWrites: config?.allowWrites === true,
    authMode,
    persistRefreshedTokens: config?.persistRefreshedTokens !== false,
    defaultSearchMaxResults: Number.isInteger(config?.defaultSearchMaxResults) ? Math.max(1, Math.min(20, config.defaultSearchMaxResults)) : 10
  };
}

function resolveSecrets(config) {
  return {
    ...parseEnvFile(config.envFile),
    ...process.env
  };
}

function requireSecret(secrets, key, contextLabel) {
  const value = secrets?.[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  throw new Error(`${contextLabel} requires ${key} in the configured env file or process environment.`);
}

function optionalSecret(secrets, key) {
  const value = secrets?.[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  return undefined;
}

function parseExpiry(value) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const trimmed = value.trim();
  if (/^\d+$/u.test(trimmed)) {
    const numeric = Number(trimmed);
    if (numeric > 0) return numeric > 1_000_000_000_000 ? numeric : numeric * 1000;
  }
  const parsed = Date.parse(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function hasOAuth2Signals(secrets) {
  return Boolean(
    optionalSecret(secrets, "X_CLIENT_ID")
    || optionalSecret(secrets, "X_OAUTH2_ACCESS_TOKEN")
    || optionalSecret(secrets, "X_OAUTH2_REFRESH_TOKEN")
    || optionalSecret(secrets, "X_CLIENT_SECRET")
  );
}

function shouldUseOAuth2(config, secrets) {
  if (config.authMode === "oauth2") return true;
  if (config.authMode === "oauth1") return false;
  return hasOAuth2Signals(secrets);
}

function percentEncode(value) {
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function buildSearchQueryParams(rawParams, pluginConfig) {
  const requestedMaxResults = readNumberParam(rawParams, "maxResults", { integer: true });
  const sliceMaxResults = requestedMaxResults === undefined
    ? pluginConfig.defaultSearchMaxResults
    : Math.max(1, Math.min(20, requestedMaxResults));
  const apiMaxResults = Math.max(10, Math.min(100, sliceMaxResults));
  const params = new URLSearchParams({
    query: readStringParam(rawParams, "query", { required: true }),
    "tweet.fields": "created_at,author_id,conversation_id,in_reply_to_user_id,lang,public_metrics,source",
    expansions: "author_id",
    "user.fields": "username,name,verified,public_metrics,profile_image_url",
    max_results: String(apiMaxResults)
  });
  for (const [toolKey, apiKey] of [
    ["sinceId", "since_id"],
    ["untilId", "until_id"],
    ["startTime", "start_time"],
    ["endTime", "end_time"],
    ["nextToken", "next_token"]
  ]) {
    const value = readStringParam(rawParams, toolKey);
    if (value) params.set(apiKey, value);
  }
  return { params, sliceMaxResults };
}

function normalizePostData(post, userMap) {
  const author = post?.author_id ? userMap.get(post.author_id) : undefined;
  return {
    id: post?.id,
    text: post?.text,
    createdAt: post?.created_at,
    authorId: post?.author_id,
    authorUsername: author?.username,
    authorName: author?.name,
    verified: author?.verified,
    conversationId: post?.conversation_id,
    inReplyToUserId: post?.in_reply_to_user_id,
    lang: post?.lang,
    source: post?.source,
    publicMetrics: post?.public_metrics,
    url: post?.id && author?.username ? `https://x.com/${author.username}/status/${post.id}` : undefined
  };
}

function extractPostId(value) {
  if (!value) throw toolInputError("post id or X status URL required");
  const trimmed = value.trim();
  if (/^\d{1,19}$/u.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    const match = parsed.pathname.match(/\/status\/(\d{1,19})/u);
    if (match?.[1]) return match[1];
  } catch {}
  throw toolInputError("Could not parse a Post ID from the provided value.");
}

async function parseXResponse(response) {
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }
  if (response.ok) return payload;
  const details = Array.isArray(payload?.errors)
    ? payload.errors.map((entry) => entry?.detail || entry?.title).filter(Boolean).join(" | ")
    : payload?.detail || payload?.title || payload?.error || payload?.raw;
  throw new Error(`X API ${response.status}: ${details || response.statusText}`);
}

function buildBasicAuthHeader(clientId, clientSecret) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

async function refreshOAuth2AccessToken(config, secrets) {
  const clientId = requireSecret(secrets, "X_CLIENT_ID", "OAuth 2.0 refresh");
  const refreshToken = requireSecret(secrets, "X_OAUTH2_REFRESH_TOKEN", "OAuth 2.0 refresh");
  const clientSecret = optionalSecret(secrets, "X_CLIENT_SECRET");
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "openclaw-xapi-plugin/0.2.0"
  };
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });
  if (clientSecret) headers.Authorization = buildBasicAuthHeader(clientId, clientSecret);
  else body.set("client_id", clientId);

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers,
    body: body.toString(),
    signal: AbortSignal.timeout(30_000)
  });
  const payload = await parseXResponse(response);
  const accessToken = payload?.access_token;
  if (typeof accessToken !== "string" || !accessToken.trim()) {
    throw new Error("OAuth 2.0 refresh succeeded but did not return an access token.");
  }
  const updatedSecrets = {
    ...secrets,
    X_OAUTH2_ACCESS_TOKEN: accessToken.trim()
  };
  if (typeof payload?.refresh_token === "string" && payload.refresh_token.trim()) {
    updatedSecrets.X_OAUTH2_REFRESH_TOKEN = payload.refresh_token.trim();
  }
  if (typeof payload?.expires_in === "number" && Number.isFinite(payload.expires_in)) {
    updatedSecrets.X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT = new Date(Date.now() + payload.expires_in * 1000).toISOString();
  } else {
    delete updatedSecrets.X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT;
  }
  if (config.persistRefreshedTokens && config.envFile) {
    const persisted = {
      X_OAUTH2_ACCESS_TOKEN: updatedSecrets.X_OAUTH2_ACCESS_TOKEN
    };
    if (updatedSecrets.X_OAUTH2_REFRESH_TOKEN) persisted.X_OAUTH2_REFRESH_TOKEN = updatedSecrets.X_OAUTH2_REFRESH_TOKEN;
    if (updatedSecrets.X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT) {
      persisted.X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT = updatedSecrets.X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT;
    }
    writeEnvUpdates(config.envFile, persisted);
  }
  return {
    token: updatedSecrets.X_OAUTH2_ACCESS_TOKEN,
    secrets: updatedSecrets,
    refreshed: true
  };
}

async function resolveOAuth2AccessToken(config, secrets) {
  const accessToken = optionalSecret(secrets, "X_OAUTH2_ACCESS_TOKEN");
  const expiryMs = parseExpiry(optionalSecret(secrets, "X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT"));
  const hasRefreshToken = Boolean(optionalSecret(secrets, "X_OAUTH2_REFRESH_TOKEN"));
  const expiresSoon = expiryMs !== undefined && expiryMs <= Date.now() + 60_000;
  if (accessToken && !expiresSoon) {
    return { token: accessToken, secrets, refreshed: false };
  }
  if (hasRefreshToken) {
    return await refreshOAuth2AccessToken(config, secrets);
  }
  if (accessToken) {
    return { token: accessToken, secrets, refreshed: false };
  }
  throw new Error("OAuth 2.0 user-context requests require X_OAUTH2_ACCESS_TOKEN or X_OAUTH2_REFRESH_TOKEN.");
}

async function xOAuth2Request(config, secrets, { method, requestPath, searchParams, jsonBody }) {
  let tokenState = await resolveOAuth2AccessToken(config, secrets);
  const execute = async (accessToken) => {
    const url = new URL(requestPath, config.baseUrl);
    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        url.searchParams.set(key, value);
      }
    }
    return await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "openclaw-xapi-plugin/0.2.0",
        ...jsonBody ? { "Content-Type": "application/json" } : {}
      },
      ...jsonBody ? { body: JSON.stringify(jsonBody) } : {},
      signal: AbortSignal.timeout(30_000)
    });
  };

  let response = await execute(tokenState.token);
  if (response.status === 401 && optionalSecret(tokenState.secrets, "X_OAUTH2_REFRESH_TOKEN")) {
    tokenState = await refreshOAuth2AccessToken(config, tokenState.secrets);
    response = await execute(tokenState.token);
  }
  return {
    payload: await parseXResponse(response),
    secrets: tokenState.secrets
  };
}

function buildOAuth1Header({ method, url, consumerKey, consumerSecret, accessToken, accessTokenSecret }) {
  const nonce = crypto.randomBytes(16).toString("hex");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0"
  };
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
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessTokenSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(signatureBaseString).digest("base64");
  const headerParams = {
    ...oauthParams,
    oauth_signature: signature
  };
  return "OAuth " + Object.entries(headerParams)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${percentEncode(key)}=\"${percentEncode(value)}\"`)
    .join(", ");
}

async function xOAuth1WriteRequest(config, secrets, body) {
  const consumerKey = requireSecret(secrets, "X_API_KEY", "OAuth 1.0a write operations");
  const consumerSecret = requireSecret(secrets, "X_API_KEY_SECRET", "OAuth 1.0a write operations");
  const accessToken = requireSecret(secrets, "X_ACCESS_TOKEN", "OAuth 1.0a write operations");
  const accessTokenSecret = requireSecret(secrets, "X_ACCESS_TOKEN_SECRET", "OAuth 1.0a write operations");
  const url = new URL("/2/tweets", config.baseUrl);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: buildOAuth1Header({
        method: "POST",
        url,
        consumerKey,
        consumerSecret,
        accessToken,
        accessTokenSecret
      }),
      "Content-Type": "application/json",
      "User-Agent": "openclaw-xapi-plugin/0.2.0"
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000)
  });
  return { payload: await parseXResponse(response), secrets };
}

async function xReadRequest(config, secrets, requestPath, searchParams) {
  const appBearerToken = optionalSecret(secrets, "X_BEARER_TOKEN");
  if (appBearerToken) {
    const url = new URL(requestPath, config.baseUrl);
    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        url.searchParams.set(key, value);
      }
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${appBearerToken}`,
        "User-Agent": "openclaw-xapi-plugin/0.2.0"
      },
      signal: AbortSignal.timeout(30_000)
    });
    return await parseXResponse(response);
  }
  if (shouldUseOAuth2(config, secrets)) {
    const { payload } = await xOAuth2Request(config, secrets, {
      method: "GET",
      requestPath,
      searchParams
    });
    return payload;
  }
  throw new Error("Read operations require X_BEARER_TOKEN, or an OAuth 2.0 user token set (X_CLIENT_ID plus X_OAUTH2_ACCESS_TOKEN/X_OAUTH2_REFRESH_TOKEN).");
}

async function xWriteRequest(config, secrets, body) {
  if (!config.allowWrites) {
    throw new Error("Write operations are disabled. Set plugins.entries.xapi.config.allowWrites=true to enable live posting and replies.");
  }
  if (shouldUseOAuth2(config, secrets)) {
    return await xOAuth2Request(config, secrets, {
      method: "POST",
      requestPath: "/2/tweets",
      jsonBody: body
    });
  }
  return await xOAuth1WriteRequest(config, secrets, body);
}

function createXSearchPostsTool(pluginConfig) {
  return {
    name: "x_search_posts",
    label: "X Search Posts",
    description: "Search recent X posts using the official X API.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "string", description: "X query string, for example `from:ChainShieldAI -is:retweet`." },
        maxResults: { type: "integer", minimum: 1, maximum: 20, description: "How many posts to return locally (1-20)." },
        sinceId: { type: "string", description: "Only return posts newer than this post ID." },
        untilId: { type: "string", description: "Only return posts older than this post ID." },
        startTime: { type: "string", description: "UTC ISO timestamp lower bound." },
        endTime: { type: "string", description: "UTC ISO timestamp upper bound." },
        nextToken: { type: "string", description: "Pagination token from a previous search response." }
      },
      required: ["query"]
    },
    execute: async (_toolCallId, rawParams) => {
      const config = resolvePluginConfig(pluginConfig);
      const secrets = resolveSecrets(config);
      const { params, sliceMaxResults } = buildSearchQueryParams(rawParams, config);
      const payload = await xReadRequest(config, secrets, "/2/tweets/search/recent", params);
      const userMap = new Map((payload?.includes?.users ?? []).map((user) => [user.id, user]));
      const posts = Array.isArray(payload?.data)
        ? payload.data.map((post) => normalizePostData(post, userMap)).slice(0, sliceMaxResults)
        : [];
      return jsonResult({
        query: params.get("query"),
        returned: posts.length,
        meta: payload?.meta ?? {},
        posts
      });
    }
  };
}

function createXGetPostTool(pluginConfig) {
  return {
    name: "x_get_post",
    label: "X Get Post",
    description: "Look up a single X post by ID or status URL using the official X API.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        postIdOrUrl: { type: "string", description: "A numeric post ID or an https://x.com/.../status/... URL." }
      },
      required: ["postIdOrUrl"]
    },
    execute: async (_toolCallId, rawParams) => {
      const config = resolvePluginConfig(pluginConfig);
      const secrets = resolveSecrets(config);
      const postId = extractPostId(readStringParam(rawParams, "postIdOrUrl", { required: true }));
      const params = new URLSearchParams({
        "tweet.fields": "created_at,author_id,conversation_id,in_reply_to_user_id,lang,public_metrics,source",
        expansions: "author_id",
        "user.fields": "username,name,verified,public_metrics,profile_image_url"
      });
      const payload = await xReadRequest(config, secrets, `/2/tweets/${postId}`, params);
      const userMap = new Map((payload?.includes?.users ?? []).map((user) => [user.id, user]));
      return jsonResult({
        post: payload?.data ? normalizePostData(payload.data, userMap) : null
      });
    }
  };
}

function createXPostTool(pluginConfig) {
  return {
    name: "x_post",
    label: "X Create Post",
    description: "Publish a new X post using the official X API.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", description: "Post text to publish." },
        dryRun: { type: "boolean", description: "If true, validate the request body without posting." }
      },
      required: ["text"]
    },
    execute: async (_toolCallId, rawParams) => {
      const config = resolvePluginConfig(pluginConfig);
      const text = readStringParam(rawParams, "text", { required: true });
      const dryRun = readBooleanParam(rawParams, "dryRun") === true;
      const body = { text };
      if (dryRun) {
        return jsonResult({
          dryRun: true,
          request: body
        });
      }
      const secrets = resolveSecrets(config);
      const { payload } = await xWriteRequest(config, secrets, body);
      return jsonResult({
        dryRun: false,
        post: payload?.data ? {
          id: payload.data.id,
          text: payload.data.text,
          url: payload.data.id ? `https://x.com/i/web/status/${payload.data.id}` : undefined
        } : payload
      });
    }
  };
}

function createXReplyTool(pluginConfig) {
  return {
    name: "x_reply",
    label: "X Reply",
    description: "Reply to an X post using the official X API.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        text: { type: "string", description: "Reply text to publish." },
        inReplyToPostIdOrUrl: { type: "string", description: "A numeric post ID or https://x.com/.../status/... URL to reply to." },
        dryRun: { type: "boolean", description: "If true, validate the request body without posting." }
      },
      required: ["text", "inReplyToPostIdOrUrl"]
    },
    execute: async (_toolCallId, rawParams) => {
      const config = resolvePluginConfig(pluginConfig);
      const text = readStringParam(rawParams, "text", { required: true });
      const inReplyToPostId = extractPostId(readStringParam(rawParams, "inReplyToPostIdOrUrl", { required: true }));
      const dryRun = readBooleanParam(rawParams, "dryRun") === true;
      const body = {
        text,
        reply: {
          in_reply_to_tweet_id: inReplyToPostId
        }
      };
      if (dryRun) {
        return jsonResult({
          dryRun: true,
          request: body
        });
      }
      const secrets = resolveSecrets(config);
      const { payload } = await xWriteRequest(config, secrets, body);
      return jsonResult({
        dryRun: false,
        reply: payload?.data ? {
          id: payload.data.id,
          text: payload.data.text,
          inReplyToPostId,
          url: payload.data.id ? `https://x.com/i/web/status/${payload.data.id}` : undefined
        } : payload
      });
    }
  };
}

const plugin = definePluginEntry({
  id: "xapi",
  name: "X API Plugin",
  description: "Official X API search, read, post, and reply tools for OpenClaw.",
  register(api) {
    const pluginConfig = api.pluginConfig ?? api.config?.plugins?.entries?.xapi?.config;
    api.registerTool(createXSearchPostsTool(pluginConfig));
    api.registerTool(createXGetPostTool(pluginConfig));
    api.registerTool(createXPostTool(pluginConfig));
    api.registerTool(createXReplyTool(pluginConfig));
  }
});

export default plugin;
