import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { FormPage } from './form.page';

const COMMON_IMPORTS = [
    ReactiveFormsModule
];

const COMMON_DECLARATIONS = [FormPage];

@NgModule({
    imports: [COMMON_IMPORTS],
    declarations: [COMMON_DECLARATIONS],
    exports: [COMMON_DECLARATIONS]
})
export class FormModule{}