const { getNextPending, markPublished } = require('../lib/queue');

describe('getNextPending', () => {
  it('returns null for empty queue', () => {
    expect(getNextPending([])).toBeNull();
  });

  it('returns null when all items are published', () => {
    expect(getNextPending([{ status: 'published', slug: 'a' }])).toBeNull();
  });

  it('returns first pending item', () => {
    const queue = [
      { status: 'published', slug: 'a' },
      { status: 'pending', slug: 'b', title: 'B' },
      { status: 'pending', slug: 'c', title: 'C' },
    ];
    expect(getNextPending(queue)).toEqual({ status: 'pending', slug: 'b', title: 'B' });
  });
});

describe('markPublished', () => {
  it('sets status, publishedDate, and filename on matching item', () => {
    const queue = [{ status: 'pending', slug: 'test-post' }];
    markPublished(queue, 'test-post', '2026-04-09', '2026-04-09-test-post.md');
    expect(queue[0].status).toBe('published');
    expect(queue[0].publishedDate).toBe('2026-04-09');
    expect(queue[0].filename).toBe('2026-04-09-test-post.md');
  });

  it('throws if slug is not found in queue', () => {
    expect(() => markPublished([], 'missing', '2026-04-09', 'f.md')).toThrow('Slug not found in queue: missing');
  });
});
