import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';

import { StoreState } from './state';

export abstract class Store<S = any, UI = any> {
    protected _state$: BehaviorSubject<StoreState<S, UI>>;

    public state$: Observable<StoreState<S, UI>>;

    constructor(initialState: StoreState<S, UI>) {
        this._state$ = new BehaviorSubject(initialState);
        this.state$ = this._state$.asObservable();
    }

    fetch() {
        const state = this.getState();

        const newState = produce(state, draft => {
            draft.loading = true;
            draft.error = null;
        });

        this.setState(newState);
    }

    fetchSuccess(payload: S) {
        const state = this.getState();

        const newState = produce<StoreState>(state, draft => {
            draft.loaded = true;
            draft.loading = false;
            draft.state = payload;
        });

        this.setState(newState);
    }

    fetchError(payload: any) {
        const state = this.getState();

        const newState = produce(state, draft => {
            draft.loading = true;
            draft.error = payload;
        });

        this.setState(newState);
    }

    getState() {
        return this._state$.getValue();
    }

    protected setState(state: StoreState<S, UI>) {
        this._state$.next(state);
    }
}
