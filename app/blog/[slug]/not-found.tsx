import Link from 'next/link';

export default function BlogPostNotFound() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Post not found</h1>
        <p className="mt-3 text-muted-foreground">
          This blog post doesn’t exist (or hasn’t been published yet).
        </p>
        <Link href="/blog" className="mt-6 inline-block underline underline-offset-4">
          Back to Blog
        </Link>
      </div>
    </main>
  );
}
