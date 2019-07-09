import { Observable } from 'rxjs';
import { mapUntilChanged } from 'rxjs-augment/operators';

import { SubmitStoreState } from './state';
import { SubmitStore } from './submit.store';

export abstract class SubmitQuery<
    S extends SubmitStoreState = SubmitStoreState
> {
    constructor(private __store__: SubmitStore<S>) {}

    selectSubmitting(): Observable<boolean> {
        return this.__store__.state$.pipe(
            mapUntilChanged(state => state.submitting)
        );
    }

    selectError(): Observable<any> {
        return this.__store__.state$.pipe(
            mapUntilChanged(state => state.error)
        );
    }

    protected getState(): SubmitStoreState {
        return this.__store__.getState();
    }
}
