const { buildFrontmatter, wrapPost } = require('../lib/formatter');

const sample = {
  title: 'Angelschein Bayern Guide',
  date: '2026-04-09',
  description: 'Alles zum Angelschein Bayern.',
  slug: 'angelschein-bayern-guide',
  image: 'https://images.unsplash.com/photo-abc123',
};

describe('buildFrontmatter', () => {
  it('starts and ends with ---', () => {
    const lines = buildFrontmatter(sample).split('\n');
    expect(lines[0]).toBe('---');
    expect(lines[lines.length - 1]).toBe('---');
  });

  it('includes all required fields', () => {
    const result = buildFrontmatter(sample);
    expect(result).toContain('title: "Angelschein Bayern Guide"');
    expect(result).toContain('date: 2026-04-09');
    expect(result).toContain('slug: angelschein-bayern-guide');
    expect(result).toContain('image: "https://images.unsplash.com/photo-abc123"');
  });

  it('escapes double quotes in title', () => {
    const result = buildFrontmatter({ ...sample, title: 'Guide: "Bayern"' });
    expect(result).toContain('\\"Bayern\\"');
  });
});

describe('wrapPost', () => {
  it('joins frontmatter and body with a blank line', () => {
    const fm = '---\ntitle: test\n---';
    const body = '# Hello\n\nContent.';
    const result = wrapPost(fm, body);
    expect(result).toBe(fm + '\n\n# Hello\n\nContent.\n');
  });

  it('trims leading/trailing whitespace from body', () => {
    const result = wrapPost('---\n---', '  content   ');
    expect(result.endsWith('content\n')).toBe(true);
  });
});
