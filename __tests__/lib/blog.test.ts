import { format } from 'date-fns';

import { parseBlogDateOrThrow } from '@/lib/blog';

describe('parseBlogDateOrThrow', () => {
  it('normalizes YYYY-MM-DD frontmatter dates to the intended local calendar day at noon', () => {
    const parsed = parseBlogDateOrThrow('2026-06-11');

    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(5);
    expect(parsed.getDate()).toBe(11);
    expect(parsed.getHours()).toBe(12);
    expect(format(parsed, 'MMM d, yyyy')).toBe('Jun 11, 2026');
  });

  it('rejects impossible calendar dates', () => {
    expect(() => parseBlogDateOrThrow('2026-02-30')).toThrow('Invalid blog post date: 2026-02-30');
  });
});
