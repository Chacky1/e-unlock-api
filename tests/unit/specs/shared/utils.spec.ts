import { slugify } from '../../../../src/shared/utils';

describe('utils', () => {
  describe('slugify', () => {
    it('should slugify a standard string', () => {
      const str = 'This is a string';
      const slug = slugify(str);
      expect(slug).toBe('this-is-a-string');
    });

    it('should slugify a string with special characters', () => {
      const str = 'This is a string with special characters:!@#$%^&*()+';
      const slug = slugify(str);
      expect(slug).toBe('this-is-a-string-with-special-characters');
    });

    it('should slugify a string with numbers', () => {
      const str = 'This is a string with numbers: 1234567890';
      const slug = slugify(str);
      expect(slug).toBe('this-is-a-string-with-numbers-1234567890');
    });
  });
});
