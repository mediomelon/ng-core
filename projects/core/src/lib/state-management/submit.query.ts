import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { SubmitStoreState } from './state';
import { SubmitStore } from './submit.store';

export abstract class SubmitQuery<
    S extends SubmitStoreState = SubmitStoreState
> {
    constructor(private __store__: SubmitStore<S>) {}

    selectSubmitting(): Observable<boolean> {
        return this.__store__.state$.pipe(
            map(state => state.submitting),
            distinctUntilChanged()
        );
    }

    selectError(): Observable<any> {
        return this.__store__.state$.pipe(
            map(state => state.error),
            distinctUntilChanged()
        );
    }

    protected getState(): SubmitStoreState {
        return this.__store__.getState();
    }
}
