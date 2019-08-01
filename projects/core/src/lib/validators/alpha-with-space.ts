import { AbstractControl, ValidatorFn } from '@angular/forms';

import { ALPHA_WITH_SPACE_REGEX } from '../regex';

export const alphaWithSpaceValidator: ValidatorFn = ({
    value,
}: AbstractControl) => {
    if (!value) return null;

    return ALPHA_WITH_SPACE_REGEX.test(value) ? null : { alphaWithSpace: true };
};
