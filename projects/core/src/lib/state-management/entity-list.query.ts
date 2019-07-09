import { combineLatest, Observable } from 'rxjs';
import { select } from 'rxjs-augment/operators';
import { auditTime } from 'rxjs/operators';

import { Page, Pagination, StateWithUI } from '../models';
import { EntityListStore } from './entity-list.store';
import { EntityListStoreState, EntityMapState, ID, UIState } from './state';

export abstract class EntityListQuery<
    E = any,
    UI extends UIState = any,
    F = any
> {
    constructor(private __store__: EntityListStore<E, UI, F>) {}

    selectLoaded(): Observable<boolean> {
        return this.__store__.state$.pipe(select(state => state.loaded));
    }

    selectLoading(): Observable<boolean> {
        return this.__store__.state$.pipe(select(state => state.loading));
    }

    selectError(): Observable<any> {
        return this.__store__.state$.pipe(select(state => state.error));
    }

    selectTotal(): Observable<number> {
        return this.selectPagination().pipe(select(state => state.total));
    }

    selectFilters(): Observable<F> {
        return this.selectPagination().pipe(select(state => state.filters));
    }

    selectPageIndex(): Observable<number> {
        return this.selectPagination().pipe(select(state => state.page.index));
    }

    selectPageSize(): Observable<number> {
        return this.selectPagination().pipe(select(state => state.page.size));
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

    getPage(): Page {
        return this.getState().pagination.page;
    }

    getPageIndex(): number {
        return this.getPage().index;
    }

    getPageSize(): number {
        return this.getPage().size;
    }

    getFilters(): F {
        return this.getState().pagination.filters;
    }

    getTotal(): number {
        return this.getState().pagination.total;
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

    protected selectPagination(): Observable<Pagination<F>> {
        return this.__store__.state$.pipe(select(state => state.pagination));
    }

    protected getState(): EntityListStoreState<E, UI, F> {
        return this.__store__.getState();
    }
}
