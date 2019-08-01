import { FormControl } from '@angular/forms';

import { alphaWithSpaceValidator } from './alpha-with-space';

describe('Alpha With Space Validator', () => {
    it('should return null for a falsy value', () => {
        expect(alphaWithSpaceValidator(new FormControl(''))).toBeNull();
        expect(alphaWithSpaceValidator(new FormControl(null))).toBeNull();
        expect(alphaWithSpaceValidator(new FormControl(undefined))).toBeNull();
    });

    it('should return an error object for values with digits or special characters', () => {
        expect(alphaWithSpaceValidator(new FormControl('test1'))).toEqual({
            alphaWithSpace: true,
        });
        expect(alphaWithSpaceValidator(new FormControl('1test'))).toEqual({
            alphaWithSpace: true,
        });
        expect(alphaWithSpaceValidator(new FormControl('test@'))).toEqual({
            alphaWithSpace: true,
        });
        expect(alphaWithSpaceValidator(new FormControl('te_st'))).toEqual({
            alphaWithSpace: true,
        });
        expect(alphaWithSpaceValidator(new FormControl('t|est'))).toEqual({
            alphaWithSpace: true,
        });
        expect(alphaWithSpaceValidator(new FormControl('test?'))).toEqual({
            alphaWithSpace: true,
        });
    });

    it('should return null for values with only alphabet characters or spaces', () => {
        expect(alphaWithSpaceValidator(new FormControl('ecarin'))).toBeNull();
        expect(
            alphaWithSpaceValidator(new FormControl('test test'))
        ).toBeNull();
        expect(alphaWithSpaceValidator(new FormControl('tést'))).toBeNull();
        expect(
            alphaWithSpaceValidator(new FormControl('test tést'))
        ).toBeNull();
    });
});
