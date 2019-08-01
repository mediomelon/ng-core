import { COGNITO_PASSWORD_REGEX } from './password';

describe('Cognito Password Regex', () => {
    it('should reject empty password', () => {
        const password = '';
        expect(COGNITO_PASSWORD_REGEX.test(password)).toBe(false);
    });

    it('should reject password with only spaces', () => {
        const password = '     ';
        expect(COGNITO_PASSWORD_REGEX.test(password)).toBe(false);
    });

    it('should reject password with spaces', () => {
        const password = ' Lorem 12 ';
        expect(COGNITO_PASSWORD_REGEX.test(password)).toBe(false);
    });

    it('should reject password with only letters', () => {
        const password = 'Lorem';
        expect(COGNITO_PASSWORD_REGEX.test(password)).toBe(false);
    });

    it('should reject password with only numbers', () => {
        const password = '27648762';
        expect(COGNITO_PASSWORD_REGEX.test(password)).toBe(false);
    });

    it('should reject alphanumeric password without special characters', () => {
        const password = '2Lorem12';
        expect(COGNITO_PASSWORD_REGEX.test(password)).toBe(false);
    });

    it('should reject password with only special characters', () => {
        const password = '!"#$%&/()=?¡¨*+´{ñ_:Ñ[;:<>?/~`-';
        expect(COGNITO_PASSWORD_REGEX.test(password)).toBe(false);
    });

    it('should accept alphanumeric password with special characters', () => {
        const password = '@!"#Lorem"$$%%12&&%(/%&)((=))(/';
        expect(COGNITO_PASSWORD_REGEX.test(password)).toBe(true);
    });
});
