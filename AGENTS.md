# Tokencheck Frontend Agent Guide

## Scope
- This workspace is for `chain-shield/tokencheck-frontend` only.
- Use GitHub MCP only against `chain-shield/tokencheck-frontend`.
- Do not review, merge, deploy, or edit any other repository from this workspace or session.

## Primary Tasks
- Review pull requests for correctness, regressions, missing tests, and CI risk.
- Check GitHub Actions status and inspect failing job logs before merging.
- If CI or deploy fails, reproduce locally when possible, fix the issue, push the repair branch, and re-check Actions.

## Local Validation
Run these before pushing or merging when they are relevant:
- `npm run lint`
- `npm test`
- `NEXT_TSCONFIG=tsconfig.build.json npm run build`

## Branch And Deploy Map
- `develop` pushes trigger `.github/workflows/deploy-to-cloud-run.yml`.
- `master` pushes trigger `.github/workflows/deploy-to-k8.yml`.
- After merge, watch the matching deploy workflow until it succeeds or has a clear failing step.

## Deployment Expectations
- Prefer fixing the branch that owns the broken deploy rather than making unrelated changes.
- Use GitHub MCP for PR metadata, reviews, checks, workflow runs, and merge actions.
- Use local git for code changes, test runs, commits, and pushes from this checkout.

## Safety
- Merge and deploy automation is allowed for this repository.
- Do not change secrets or cloud configuration unless the task specifically requires it.
- If a deploy fails because of missing GitHub or GCP secrets, or because of external infra state, gather the useful logs and report the blocker clearly.
