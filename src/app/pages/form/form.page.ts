import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormBase } from '@mediomelon/ng-core';

@Component({
    selector: 'form-page',
    templateUrl: './form.page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPage extends FormBase {
    constructor(formBuilder: FormBuilder) {
        super();
        this.form = formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }
}
