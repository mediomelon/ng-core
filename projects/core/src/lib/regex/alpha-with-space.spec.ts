import { ALPHA_WITH_SPACE_REGEX } from './apha-with-space';

describe('Alpha With Space Regex', () => {
    it('should reject empty string', () => {
        const name = '';
        expect(ALPHA_WITH_SPACE_REGEX.test(name)).toBe(false);
    });

    it('should reject string with digits or special characters', () => {
        expect(ALPHA_WITH_SPACE_REGEX.test('test1')).toBe(false);
        expect(ALPHA_WITH_SPACE_REGEX.test('1test')).toBe(false);
        expect(ALPHA_WITH_SPACE_REGEX.test('test@')).toBe(false);
        expect(ALPHA_WITH_SPACE_REGEX.test('te_st')).toBe(false);
        expect(ALPHA_WITH_SPACE_REGEX.test('t|est')).toBe(false);
        expect(ALPHA_WITH_SPACE_REGEX.test('test?')).toBe(false);
        expect(ALPHA_WITH_SPACE_REGEX.test('"test"')).toBe(false);
    });

    it('should acce0t string with alphabet characters or spaces', () => {
        expect(ALPHA_WITH_SPACE_REGEX.test('test')).toBe(true);
        expect(ALPHA_WITH_SPACE_REGEX.test('test test')).toBe(true);
    });

    it('should accept string with accents', () => {
        expect(ALPHA_WITH_SPACE_REGEX.test('tést')).toBe(true);
        expect(ALPHA_WITH_SPACE_REGEX.test('test tést')).toBe(true);
    });
});
