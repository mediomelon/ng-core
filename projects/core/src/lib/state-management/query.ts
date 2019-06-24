import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { StoreState } from './state';
import { Store } from './store';

export abstract class Query<S = any, UI = any> {
    constructor(private __store__: Store<S, UI>) {}

    selectLoaded(): Observable<boolean> {
        return this.__store__.state$.pipe(
            map(state => state.loaded),
            distinctUntilChanged()
        );
    }

    selectLoading(): Observable<boolean> {
        return this.__store__.state$.pipe(
            map(state => state.loading),
            distinctUntilChanged()
        );
    }

    selectError(): Observable<any> {
        return this.__store__.state$.pipe(
            map(state => state.error),
            distinctUntilChanged()
        );
    }

    selectState(): Observable<S> {
        return this.__store__.state$.pipe(
            map(state => state.state),
            distinctUntilChanged()
        );
    }

    getLoaded(): boolean {
        return this.getState().loaded;
    }

    getError(): boolean {
        return this.getState().error;
    }

    protected selectUIState(): Observable<UI> {
        return this.__store__.state$.pipe(
            map(state => state.ui),
            distinctUntilChanged()
        );
    }

    protected getState(): StoreState<S, UI> {
        return this.__store__.getState();
    }
}
