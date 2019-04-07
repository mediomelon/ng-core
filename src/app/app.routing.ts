import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormModule } from './pages/form/form.module';
import { FormPage } from './pages/form/form.page';

const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'form'
}, {
    path: 'form',
    pathMatch: 'full',
    component: FormPage
}];

const COMMON_IMPORTS = [
    FormModule
];

@NgModule({
    imports: [RouterModule.forRoot(routes), COMMON_IMPORTS],
    exports: [RouterModule, COMMON_IMPORTS]
})
export class AppRoutingModule {}