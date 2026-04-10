'use strict';

function getNextPending(queue) {
  return queue.find(item => item.status === 'pending') ?? null;
}

function markPublished(queue, slug, publishedDate, filename) {
  const item = queue.find(i => i.slug === slug);
  if (!item) throw new Error(`Slug not found in queue: ${slug}`);
  item.status = 'published';
  item.publishedDate = publishedDate;
  item.filename = filename;
}

module.exports = { getNextPending, markPublished };
