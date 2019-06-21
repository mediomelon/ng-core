import { combineLatest, Observable } from 'rxjs';
import { auditTime, distinctUntilChanged, map } from 'rxjs/operators';

import { StateWithUI } from '../models';
import { EntityStore } from './entity.store';
import { EntityMapState, EntityStoreState, ID, UIState } from './state';

export abstract class EntityQuery<E = any, UI extends UIState = any> {
    constructor(private __store__: EntityStore<E, UI>) {}

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

    selectEntities(): Observable<E[]> {
        return this.selectIds().pipe(
            map(ids => ids.map(id => this.getEntity(id))),
            distinctUntilChanged()
        );
    }

    selectEntitiesWithUI(): Observable<StateWithUI<E, UI>[]> {
        return combineLatest(
            this.selectIds(),
            this.selectEntitiesMap(),
            this.selectUIEntitiesMap()
        ).pipe(
            auditTime(0),
            map(([ids, entities, uiEntities]) =>
                ids.map(id => ({
                    state: entities[id],
                    ui: uiEntities[id],
                }))
            ),
            distinctUntilChanged()
        );
    }

    selectEntity(id: ID): Observable<E> {
        return this.selectEntitiesMap().pipe(
            map(entities => entities[id]),
            distinctUntilChanged()
        );
    }

    selectUIEntity(id: ID): Observable<UI> {
        return this.selectUIEntitiesMap().pipe(
            map(entities => entities[id]),
            distinctUntilChanged()
        );
    }

    selectUIEntityLoaded(id: ID): Observable<boolean> {
        return this.selectUIEntity(id).pipe(
            map(entity => (entity ? entity.loaded : false)),
            distinctUntilChanged()
        );
    }

    selectUIEntityLoading(id: ID): Observable<boolean> {
        return this.selectUIEntity(id).pipe(
            map(entity => (entity ? entity.loading : false)),
            distinctUntilChanged()
        );
    }

    selectUIEntityError(id: ID): Observable<any> {
        return this.selectUIEntity(id).pipe(
            map(entity => (entity ? entity.error : null)),
            distinctUntilChanged()
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
        return this.__store__.state$.pipe(
            map(state => state.ids),
            distinctUntilChanged()
        );
    }

    protected selectEntitiesMap(): Observable<EntityMapState<E>> {
        return this.__store__.state$.pipe(
            map(state => state.entities),
            distinctUntilChanged()
        );
    }

    protected selectUIEntitiesMap(): Observable<EntityMapState<UI>> {
        return this.__store__.state$.pipe(
            map(state => state.uiEntities),
            distinctUntilChanged()
        );
    }

    protected getState(): EntityStoreState<E, UI> {
        return this.__store__.getState();
    }
}
