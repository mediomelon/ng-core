import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StateManagementPage } from './state-management.page';

const COMMON_IMPORTS = [CommonModule, MatProgressSpinnerModule];

const COMMON_DECLARATIONS = [StateManagementPage];

@NgModule({
    imports: [COMMON_IMPORTS],
    declarations: [COMMON_DECLARATIONS],
    exports: [COMMON_DECLARATIONS],
})
export class StateManagementModule {}
