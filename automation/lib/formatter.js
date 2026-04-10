'use strict';

function buildFrontmatter({ title, date, description, slug, image }) {
  return [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `date: ${date}`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `slug: ${slug}`,
    `image: "${image}"`,
    '---',
  ].join('\n');
}

function wrapPost(frontmatter, body) {
  return `${frontmatter}\n\n${body.trim()}\n`;
}

module.exports = { buildFrontmatter, wrapPost };
