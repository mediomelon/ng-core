import { ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

export abstract class FormBase<T = any> {
    @Input() isSubmitting: boolean;

    @Output('onSubmit') _submit = new EventEmitter<T>();

    @ViewChild(FormGroupDirective, { static: true })
    ngForm: FormGroupDirective;

    @ViewChild('submitButton', { static: true }) button: ElementRef;

    form: FormGroup;

    onSubmit(): void {
        if (this.isFormValid()) this._submit.emit(this.getFormValue());
    }

    submit(): void {
        if (!this.button || !this.button.nativeElement) return;

        this.button.nativeElement.click();
    }

    reset(value?: any) {
        this.ngForm.resetForm(value);
    }

    isFormValid(): boolean {
        return this.form.valid;
    }

    isFormInvalid(): boolean {
        return this.form.invalid;
    }

    isFormPending(): boolean {
        return this.form.pending;
    }

    getFormValue(): T {
        return this.form.value;
    }

    shouldDisable(): boolean {
        return (
            this.isSubmitting ||
            ((this.isFormInvalid() || this.isFormPending()) &&
                (this.ngForm ? this.ngForm.submitted : true))
        );
    }
}
