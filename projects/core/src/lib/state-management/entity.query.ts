import { combineLatest, Observable } from 'rxjs';
import { select } from 'rxjs-augment/operators';
import { auditTime } from 'rxjs/operators';

import { StateWithUI } from '../models';
import { EntityStore } from './entity.store';
import { EntityMapState, EntityStoreState, ID, UIState } from './state';

export abstract class EntityQuery<E = any, UI extends UIState = any> {
    constructor(private __store__: EntityStore<E, UI>) {}

    selectLoaded(): Observable<boolean> {
        return this.__store__.state$.pipe(select(state => state.loaded));
    }

    selectLoading(): Observable<boolean> {
        return this.__store__.state$.pipe(select(state => state.loading));
    }

    selectError(): Observable<any> {
        return this.__store__.state$.pipe(select(state => state.error));
    }

    selectEntities(): Observable<E[]> {
        return this.selectIds().pipe(
            select(ids => ids.map(id => this.getEntity(id)))
        );
    }

    selectEntitiesWithUI(): Observable<StateWithUI<E, UI>[]> {
        return combineLatest(
            this.selectIds(),
            this.selectEntitiesMap(),
            this.selectUIEntitiesMap()
        ).pipe(
            auditTime(0),
            select(([ids, entities, uiEntities]) =>
                ids.map(id => ({
                    state: entities[id],
                    ui: uiEntities[id],
                }))
            )
        );
    }

    selectEntity(id: ID): Observable<E> {
        return this.selectEntitiesMap().pipe(select(entities => entities[id]));
    }

    selectUIEntity(id: ID): Observable<UI> {
        return this.selectUIEntitiesMap().pipe(
            select(entities => entities[id])
        );
    }

    selectUIEntityLoaded(id: ID): Observable<boolean> {
        return this.selectUIEntity(id).pipe(
            select(entity => (entity ? entity.loaded : false))
        );
    }

    selectUIEntityLoading(id: ID): Observable<boolean> {
        return this.selectUIEntity(id).pipe(
            select(entity => (entity ? entity.loading : false))
        );
    }

    selectUIEntityError(id: ID): Observable<any> {
        return this.selectUIEntity(id).pipe(
            select(entity => (entity ? entity.error : null))
        );
    }

    getEntity(id: ID): E {
        return this.getState().entities[id];
    }

    getError(): any {
        return this.getState().error;
    }

    getLoaded(): boolean {
        return this.getState().loaded;
    }

    getUIEntity(id: ID): UI {
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

    protected selectIds(): Observable<ID[]> {
        return this.__store__.state$.pipe(select(state => state.ids));
    }

    protected selectEntitiesMap(): Observable<EntityMapState<E>> {
        return this.__store__.state$.pipe(select(state => state.entities));
    }

    protected selectUIEntitiesMap(): Observable<EntityMapState<UI>> {
        return this.__store__.state$.pipe(select(state => state.uiEntities));
    }

    protected getState(): EntityStoreState<E, UI> {
        return this.__store__.getState();
    }
}
