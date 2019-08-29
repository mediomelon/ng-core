import { Observable } from 'rxjs';
import { select } from 'rxjs-augmented/operators';

import { EntityMapState, ID, UIState, UnionEntity, UnionStoreState } from './state';
import { UnionStore } from './union.store';

export abstract class UnionQuery {
    constructor(private __store__: UnionStore) {}

    selectEntitiesMap(): Observable<EntityMapState<UnionEntity>> {
        return this.__store__.state$.pipe(select(state => state.entities));
    }

    selectUIEntitiesMap(): Observable<EntityMapState<UIState>> {
        return this.__store__.state$.pipe(select(state => state.uiEntities));
    }

    selectEntity(id: ID): Observable<UnionEntity> {
        return this.selectEntitiesMap().pipe(select(entities => entities[id]));
    }

    selectUIEntity(id: ID): Observable<UIState> {
        return this.selectUIEntitiesMap().pipe(
            select(entities => entities[id])
        );
    }

    selectEntityIds(id: ID): Observable<ID[]> {
        return this.selectEntity(id).pipe(
            select(entity => (entity ? entity.ids : []))
        );
    }

    selectEntityLoaded(id: ID): Observable<boolean> {
        return this.selectUIEntity(id).pipe(
            select(uiEntity => (uiEntity ? uiEntity.loaded : false))
        );
    }

    selectEntityError(id: ID): Observable<any> {
        return this.selectUIEntity(id).pipe(
            select(uiEntity => (uiEntity ? uiEntity.error : null))
        );
    }

    selectEntityLoading(id: ID): Observable<boolean> {
        return this.selectUIEntity(id).pipe(
            select(uiEntity => (uiEntity ? uiEntity.loading : false))
        );
    }

    shouldFetch(id: number): boolean {
        const loaded = this.getUIEntityLoaded(id);
        const error = this.getUIEntityError(id);

        return !loaded || !!error;
    }

    getUIEntity(id: ID): UIState {
        return this.getState().uiEntities[id];
    }

    getUIEntityLoaded(id: ID): boolean {
        const entity = this.getUIEntity(id);
        return entity ? entity.loaded : false;
    }

    getUIEntityError(id: ID): boolean {
        const entity = this.getUIEntity(id);
        return entity ? entity.error : null;
    }

    protected getState(): UnionStoreState {
        return this.__store__.getState();
    }
}
