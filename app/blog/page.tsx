import Link from 'next/link';
import { format } from 'date-fns';

import { getAllPublishedBlogPosts } from '@/lib/blog';

/**
 * Blog index page
 *
 * - Reads posts from `content/blog/*.mdx`
 * - Statically generated at build time (new posts require a rebuild/deploy)
 */
export const dynamic = 'force-static';

export default async function BlogIndexPage() {
  const posts = await getAllPublishedBlogPosts();

  return (
    <main className="container mx-auto px-4 py-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-3 text-muted-foreground">
          ChainShield updates and technical notes.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-lg border p-6">
          <h2 className="text-lg font-medium">No posts yet</h2>
          <p className="mt-2 text-muted-foreground">
            New posts will appear here once marketing commits an MDX file to{' '}
            <code>content/blog</code> and it’s merged to <code>develop</code>.
          </p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4">
          {posts.map((post) => (
            <li key={post.slug} className="rounded-lg border p-6">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xl font-semibold tracking-tight hover:underline"
                >
                  {post.title}
                </Link>

                <div className="text-sm text-muted-foreground">
                  {format(post.date, 'MMM d, yyyy')}
                  {post.author ? ` • ${post.author}` : ''}
                </div>

                {post.description ? (
                  <p className="mt-2 text-muted-foreground">{post.description}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

