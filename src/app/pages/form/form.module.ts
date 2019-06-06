import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { FormPage } from './form.page';

const COMMON_IMPORTS = [ReactiveFormsModule, MatInputModule, MatButtonModule];

const COMMON_DECLARATIONS = [FormPage];

@NgModule({
    imports: [COMMON_IMPORTS],
    declarations: [COMMON_DECLARATIONS],
    exports: [COMMON_DECLARATIONS],
})
export class FormModule {}
