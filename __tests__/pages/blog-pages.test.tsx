import React from 'react';

import { render, screen } from '../utils';
import BlogIndexPage from '@/app/blog/page';
import BlogPostPage from '@/app/blog/[slug]/page';
import { compileMDX } from 'next-mdx-remote/rsc';
import { getAllPublishedBlogPosts, getBlogPostBySlug } from '@/lib/blog';

jest.mock('@/components/analytics/page-view-tracker', () => ({
  PageViewTracker: () => null,
}));

jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: jest.fn(),
}));

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/lib/blog', () => ({
  getAllPublishedBlogPosts: jest.fn(),
  getBlogPostBySlug: jest.fn(),
  getAllBlogSlugs: jest.fn().mockResolvedValue(['vault-hardening']),
}));

const mockedCompileMDX = jest.mocked(compileMDX);
const mockedGetAllPublishedBlogPosts = jest.mocked(getAllPublishedBlogPosts);
const mockedGetBlogPostBySlug = jest.mocked(getBlogPostBySlug);

describe('Blog marketing pages', () => {
  beforeEach(() => {
    mockedGetAllPublishedBlogPosts.mockResolvedValue([
      {
        slug: 'vault-hardening',
        title: 'Vault Hardening Playbook',
        description: 'How to reduce high-severity launch risk before mainnet.',
        date: new Date('2026-03-10'),
        author: 'ChainShield Research',
        tags: ['Security', 'DeFi'],
      },
      {
        slug: 'post-fix-review',
        title: 'Why Post-Fix Review Matters',
        description: 'The fastest way to validate remediation quality before redeploy.',
        date: new Date('2026-03-18'),
        author: 'ChainShield Research',
        tags: ['Audits'],
      },
    ]);

    mockedGetBlogPostBySlug.mockResolvedValue({
      frontmatter: {
        title: 'Vault Hardening Playbook',
        description: 'How to reduce high-severity launch risk before mainnet.',
        date: 'March 10, 2026',
        author: 'ChainShield Research',
        tags: ['Security', 'DeFi'],
      },
      content: '# Mock content',
    });

    mockedCompileMDX.mockResolvedValue({
      content: <div>Mock article body</div>,
      frontmatter: { title: 'Vault Hardening Playbook' },
    } as never);
  });

  it('renders the redesigned blog index', async () => {
    render((await BlogIndexPage()) as React.ReactElement);

    expect(screen.getByText(/ChainShield Journal/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured article/i)).toBeInTheDocument();
    expect(screen.getByText(/Vault Hardening Playbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Why Post-Fix Review Matters/i)).toBeInTheDocument();
  });

  it('renders the redesigned blog post page', async () => {
    render((await BlogPostPage({ params: { slug: 'vault-hardening' } })) as React.ReactElement);

    expect(screen.getByText(/Research note/i)).toBeInTheDocument();
    expect(screen.getByText(/Vault Hardening Playbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock article body/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Request Security Quote/i })).toBeInTheDocument();
  });
});
