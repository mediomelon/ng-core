import { ValidatorFn, Validators } from '@angular/forms';

import { COGNITO_PASSWORD_REGEX } from '../regex';
import { ALPHA_WITH_SPACE_REGEX } from '../regex/apha-with-space';

export const alphaWithSpaceValidator: ValidatorFn = Validators.pattern(
    ALPHA_WITH_SPACE_REGEX
);

export const cognitoPasswordValidator: ValidatorFn = Validators.pattern(
    COGNITO_PASSWORD_REGEX
);

export const cognitoPasswordValidators = (
    minLength: number,
    maxLength: number
): ValidatorFn[] => [
    Validators.required,
    Validators.minLength(minLength),
    Validators.maxLength(maxLength),
    cognitoPasswordValidator,
];
