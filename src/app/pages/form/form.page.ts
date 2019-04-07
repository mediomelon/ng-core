import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormBase } from '@mediomelon/ng-core';

@Component({
    selector: 'form',
    templateUrl: './form.page.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPage extends FormBase {

    constructor(formBuilder: FormBuilder) {
        super();
        this.form = formBuilder.group({
            
        });
    }
}