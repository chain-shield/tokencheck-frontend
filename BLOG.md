# Blog (MDX) Publishing + Automation (n8n)

## Goal
Enable a Markdown/MDX blog for this Next.js app, where marketing can publish by having **n8n generate an MDX file** and push it to GitHub. CI should run automatically, and production deploy should happen when the post is merged.

---

## Publishing flow (what Marketing does)
1. Write/provide content (prompt, outline, draft) to the n8n workflow.
2. n8n generates an MDX post.
3. n8n creates/updates a Git branch (recommended: `bot/blog`).
4. n8n commits the post to: `content/blog/<slug>.mdx`
5. n8n opens a Pull Request into `develop`.
6. GitHub Actions runs **lint + tests + build** on the PR.
7. After approval, merge the PR.
8. Push to `develop` triggers the existing **Cloud Run deploy** workflow.

> Recommendation: do **not** auto-deploy directly from `bot/blog`. Deploy only from `develop` after review.

---

## Required MDX file format
Each post must start with YAML frontmatter.

**Required fields**
- `title` (string)
- `description` (string)
- `date` (ISO-8601, e.g. `2026-02-23`)

**Optional fields**
- `author` (string)
- `tags` (array of strings)
- `published` (boolean; set `false` to hide the post from the blog index)
- `draft` (boolean; alias for `published: false`)

Example template:

    ---
    title: "My Post Title"
    description: "1–2 sentence summary for previews and SEO"
    date: "2026-02-23"
    author: "ChainShield"
    tags: ["security", "audits"]
	    published: true
    ---

    ## Heading

    Your content here.

**Slug rules**
- Only lowercase letters, numbers, and hyphens: `my-post-title`
- File path must be: `content/blog/my-post-title.mdx`

---

## n8n setup (high level)
Your n8n workflow needs to:

1. **Compute slug** from the post title
   - Lowercase
   - Replace spaces with `-`
   - Strip non-alphanumeric/hyphen

2. **Clone repo**
   - Repo: `chain-shield/tokencheck-frontend`
   - Base branch: `develop`

3. **Create/update branch**
   - Branch name: `bot/blog`
   - Reset it to `develop` each run (recommended) so the PR is clean.

4. **Write file**
   - Create/overwrite: `content/blog/<slug>.mdx`

5. **Commit + push**
   - Commit message example: `blog: add <slug>`
   - Push to `bot/blog`

6. **Open Pull Request**
   - From: `bot/blog`
   - Into: `develop`
   - Title example: `Blog: <title>`

### Credentials (pick one)
- **GitHub App (recommended)**: best security + revocable permissions.
- **PAT (classic) or fine-grained token**: easiest to start; store in n8n Credentials.

Minimum permissions needed:
- Contents: read/write
- Pull requests: read/write (only if n8n creates PRs)

---

## GitHub Actions behavior (in this repo)
- `.github/workflows/blog-ci.yml` (added) runs on:
  - push to `bot/blog`
  - PRs targeting `develop`

It runs:
- `npm ci`
- `npm run lint`
- `npm test`
- `NEXT_TSCONFIG=tsconfig.build.json npm run build`

Deployment:
- `.github/workflows/deploy-to-cloud-run.yml` deploys **on push to `develop`**.

---

## Engineering spec (MDX blog implementation)
This repo does **not** yet render MDX posts. The intended implementation:

1. Create routes
   - `app/blog/page.tsx` (index)
   - `app/blog/[slug]/page.tsx` (post page)

2. Read posts from disk
   - Directory: `content/blog/*.mdx`

3. Parse frontmatter + compile MDX
   - Suggested dependencies (requires npm install):
     - `gray-matter` (frontmatter)
     - `next-mdx-remote` (MDX compilation for App Router / RSC)
     - `remark-gfm` (optional, tables/task lists)

4. Add "Blog" link to header
   - Navbar should link to `/blog`.

If you want, I can implement the full MDX rendering once you approve the dependency installs.

