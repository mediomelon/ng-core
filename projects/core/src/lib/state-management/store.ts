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
        this.setState(draft => {
            draft.loading = true;
            draft.error = null;
        });
    }

    fetchSuccess(payload: S) {
        this.setState(draft => {
            draft.loaded = true;
            draft.loading = false;
            draft.state = payload;
        });
    }

    fetchError(payload: any) {
        this.setState(draft => {
            draft.loading = false;
            draft.error = payload;
        });
    }

    getState() {
        return this._state$.getValue();
    }

    protected setState(producer: (draft: StoreState<S, UI>) => void) {
        const prevState = this.getState();
        const nextValue = produce(prevState, producer);
        this._state$.next(nextValue);
    }
}
