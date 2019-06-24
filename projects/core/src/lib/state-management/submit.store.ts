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
        const state = this.getState();

        const newState = produce(state, draft => {
            draft.submitting = true;
            draft.error = null;
        });

        this.setState(newState);
    }

    submitSuccess() {
        const state = this.getState();

        const newState = produce(state, draft => {
            draft.submitting = false;
        });

        this.setState(newState);
    }

    submitError(payload: any) {
        const state = this.getState();

        const newState = produce(state, draft => {
            draft.submitting = false;
            draft.error = payload;
        });

        this.setState(newState);
    }

    getState() {
        return this._state$.getValue();
    }

    protected setState(state: S) {
        this._state$.next(state);
    }
}
