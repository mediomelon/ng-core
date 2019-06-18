import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { EntitySubmitStore } from './entity-submit.store';
import { EntitySubmitStoreState } from './state';

export abstract class EntitySubmitQuery<
    S extends EntitySubmitStoreState = EntitySubmitStoreState
> {
    constructor(private __store__: EntitySubmitStore<S>) {}

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

    protected getState(): EntitySubmitStoreState {
        return this.__store__.getState();
    }
}
