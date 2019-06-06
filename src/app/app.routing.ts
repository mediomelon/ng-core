import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormModule } from './pages/form/form.module';
import { FormPage } from './pages/form/form.page';
import { StateManagementModule } from './pages/state-management/state-management.module';
import { StateManagementPage } from './pages/state-management/state-management.page';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'form',
    },
    {
        path: 'form',
        component: FormPage,
    },
    {
        path: 'state-management',
        component: StateManagementPage,
    },
];

const COMMON_IMPORTS = [FormModule, StateManagementModule];

@NgModule({
    imports: [RouterModule.forRoot(routes), COMMON_IMPORTS],
    exports: [RouterModule, COMMON_IMPORTS],
})
export class AppRoutingModule {}
