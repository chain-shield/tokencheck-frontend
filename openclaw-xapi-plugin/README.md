# OpenClaw X API Plugin

Repo-backed OpenClaw plugin that gives `neo` native X tools:

- `x_search_posts`
- `x_get_post`
- `x_post`
- `x_reply`

It supports two write modes:

- Recommended for your own automation: OAuth 1.0a API key + access token signing
- Optional: OAuth 2.0 user tokens with refresh support

## Recommended env file

Default location:

`~/.openclaw/secrets/x-api.env`

### Read-only search

```bash
X_BEARER_TOKEN=...
```

### Recommended write path: OAuth 1.0a

```bash
X_API_KEY=...
X_API_KEY_SECRET=...
X_ACCESS_TOKEN=...
X_ACCESS_TOKEN_SECRET=...
```

### Optional write path: OAuth 2.0

```bash
X_CLIENT_ID=...
X_CLIENT_SECRET=...
X_OAUTH2_ACCESS_TOKEN=...
X_OAUTH2_REFRESH_TOKEN=...
X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT=2026-04-20T23:59:59.000Z
X_OAUTH2_REDIRECT_URI=http://127.0.0.1:8788/x/callback
```

## One-time OAuth 1.0a bootstrap with PIN

This is the simplest path for a personal bot because it does not require an OAuth 2.0 callback flow.

1. Make sure your X app permissions are at least `Read and write`.
2. Put `X_API_KEY` and `X_API_KEY_SECRET` in your env file.
3. Run:

```bash
node "/Users/apmfree/Desktop/CHAIN SHIELD/tokencheck_ai/openclaw-xapi-plugin/scripts/bootstrap-oauth1-pin.mjs"
```

That helper will:

- open the X authorize page
- ask you for the PIN shown by X
- exchange it for `X_ACCESS_TOKEN` and `X_ACCESS_TOKEN_SECRET`
- write those values into the env file

## Optional OAuth 2.0 bootstrap

1. Add the exact callback URL below to your X app settings:

`http://127.0.0.1:8788/x/callback`

2. Make sure your X app has these scopes at minimum:

- `tweet.read`
- `users.read`
- `tweet.write`
- `offline.access`

3. Put `X_CLIENT_ID`, `X_CLIENT_SECRET`, and `X_OAUTH2_REDIRECT_URI` in your env file.

4. Run:

```bash
node "/Users/apmfree/Desktop/CHAIN SHIELD/tokencheck_ai/openclaw-xapi-plugin/scripts/bootstrap-oauth2.mjs"
```

That helper will:

- open the X authorize page
- catch the callback locally
- exchange the code for tokens
- write `X_OAUTH2_ACCESS_TOKEN`, `X_OAUTH2_REFRESH_TOKEN`, and `X_OAUTH2_ACCESS_TOKEN_EXPIRES_AT` into the env file
- let the running gateway pick up the new tokens on the next X tool call

## OpenClaw wiring

```bash
openclaw config set plugins.load.paths '["/Users/apmfree/Desktop/CHAIN SHIELD/tokencheck_ai/openclaw-xapi-plugin"]' --strict-json
openclaw config set plugins.entries.xapi '{"enabled":true,"config":{"envFile":"/Users/apmfree/.openclaw/secrets/x-api.env","allowWrites":true,"authMode":"oauth1","persistRefreshedTokens":true}}' --strict-json
```

Then restart the gateway.
