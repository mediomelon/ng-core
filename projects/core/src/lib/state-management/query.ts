import { Observable } from 'rxjs';
import { select } from 'rxjs-augmented/operators';

import { StoreState } from './state';
import { Store } from './store';

export abstract class Query<S = any, UI = any> {
    constructor(private __store__: Store<S, UI>) {}

    selectLoaded(): Observable<boolean> {
        return this.__store__.state$.pipe(select(state => state.loaded));
    }

    selectLoading(): Observable<boolean> {
        return this.__store__.state$.pipe(select(state => state.loading));
    }

    selectError(): Observable<any> {
        return this.__store__.state$.pipe(select(state => state.error));
    }

    selectState(): Observable<S> {
        return this.__store__.state$.pipe(select(state => state.state));
    }

    getLoaded(): boolean {
        return this.getState().loaded;
    }

    getError(): boolean {
        return this.getState().error;
    }

    protected selectUIState(): Observable<UI> {
        return this.__store__.state$.pipe(select(state => state.ui));
    }

    protected getState(): StoreState<S, UI> {
        return this.__store__.getState();
    }
}
