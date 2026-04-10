const { buildPrompt } = require('../lib/prompt');

const input = {
  title: 'Angelschein Bayern Guide',
  primaryKeyword: 'Angelschein Bayern',
  secondaryKeywords: ['Fischerprüfung Bayern', 'Angelschein Bayern bestehen'],
};

describe('buildPrompt', () => {
  it('includes the post title', () => {
    expect(buildPrompt(input)).toContain('Angelschein Bayern Guide');
  });

  it('includes the primary keyword', () => {
    expect(buildPrompt(input)).toContain('Angelschein Bayern');
  });

  it('includes all secondary keywords', () => {
    const result = buildPrompt(input);
    expect(result).toContain('Fischerprüfung Bayern');
    expect(result).toContain('Angelschein Bayern bestehen');
  });

  it('specifies the word count range', () => {
    expect(buildPrompt(input)).toContain('650–850');
  });

  it('instructs markdown-only output', () => {
    expect(buildPrompt(input)).toContain('nur Markdown-Text');
  });
});
