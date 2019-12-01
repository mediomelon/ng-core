import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';

import { SubmitStoreState } from './state';

export abstract class SubmitStore<
    S extends SubmitStoreState = SubmitStoreState
> {
    protected _state$: BehaviorSubject<S>;

    public state$: Observable<S>;

    constructor(initialState: S) {
        this._state$ = new BehaviorSubject(initialState);
        this.state$ = this._state$.asObservable();
    }

    submit() {
        this.setState(draft => {
            draft.submitting = true;
            draft.error = null;
        });
    }

    submitSuccess() {
        this.setState(draft => {
            draft.submitting = false;
        });
    }

    submitError(payload: any) {
        this.setState(draft => {
            draft.submitting = false;
            draft.error = payload;
        });
    }

    getState() {
        return this._state$.getValue();
    }

    protected setState(producer: (draft: S) => void) {
        const prevState = this.getState();
        const nextValue = produce(prevState, producer);
        this._state$.next(nextValue);
    }
}
