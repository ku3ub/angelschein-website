'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const { getNextPending, markPublished } = require('./lib/queue');
const { buildFrontmatter, wrapPost } = require('./lib/formatter');
const { buildPrompt } = require('./lib/prompt');
const { fetchImage } = require('./lib/unsplash');

const QUEUE_PATH = path.join(__dirname, '../_data/post-queue.json');
const POSTS_DIR = path.join(__dirname, '../_posts');

async function main() {
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const topic = getNextPending(queue);
  if (!topic) {
    console.log('No pending posts in queue. Exiting.');
    return;
  }
  console.log(`Generating: "${topic.title}"`);

  const imageUrl = await fetchImage(topic.unsplashQuery, process.env.UNSPLASH_ACCESS_KEY);
  console.log(`Image URL: ${imageUrl}`);

  const client = new Anthropic();
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: buildPrompt(topic) }],
  });
  const body = message.content[0].text;

  const date = new Date().toISOString().split('T')[0];
  const frontmatter = buildFrontmatter({
    title: topic.title,
    date,
    description: topic.description,
    slug: topic.slug,
    image: imageUrl,
  });
  const postContent = wrapPost(frontmatter, body);

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const filename = `${date}-${topic.slug}.md`;
  fs.writeFileSync(path.join(POSTS_DIR, filename), postContent);
  console.log(`Written: _posts/${filename}`);

  markPublished(queue, topic.slug, date, filename);
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
  console.log('Queue updated. Done.');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
