import { combineLatest, Observable } from 'rxjs';
import { auditTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Page, Pagination, StateWithUI } from '../models';
import { EntityListStore } from './entity-list.store';
import { EntityListStoreState, EntityMapState, UIState } from './state';

export abstract class EntityListQuery<
    E = any,
    UI extends UIState = any,
    F = any
> {
    constructor(private __store__: EntityListStore<E, UI, F>) {}

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

    selectTotal(): Observable<number> {
        return this.selectPagination().pipe(
            map(state => state.total),
            distinctUntilChanged()
        );
    }

    selectFilters(): Observable<F> {
        return this.selectPagination().pipe(
            map(state => state.filters),
            distinctUntilChanged()
        );
    }

    selectPageIndex(): Observable<number> {
        return this.selectPagination().pipe(
            map(state => state.page.index),
            distinctUntilChanged()
        );
    }

    selectPageSize(): Observable<number> {
        return this.selectPagination().pipe(
            map(state => state.page.size),
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

    selectEntity(id: number): Observable<E> {
        return this.selectEntitiesMap().pipe(
            map(entities => entities[id]),
            distinctUntilChanged()
        );
    }

    selectUIEntity(id: number): Observable<UI> {
        return this.selectUIEntitiesMap().pipe(
            map(entities => entities[id]),
            distinctUntilChanged()
        );
    }

    selectUIEntityLoaded(id: number): Observable<boolean> {
        return this.selectUIEntity(id).pipe(
            map(entity => (entity ? entity.loaded : false)),
            distinctUntilChanged()
        );
    }

    selectUIEntityLoading(id: number): Observable<boolean> {
        return this.selectUIEntity(id).pipe(
            map(entity => (entity ? entity.loading : false)),
            distinctUntilChanged()
        );
    }

    selectUIEntityError(id: number): Observable<any> {
        return this.selectUIEntity(id).pipe(
            map(entity => (entity ? entity.error : null)),
            distinctUntilChanged()
        );
    }

    getEntity(id: number): E {
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

    getUIEntity(id: number): UI {
        return this.getState().uiEntities[id];
    }

    getUIEntityLoaded(id: number): boolean {
        const entity = this.getUIEntity(id);
        return entity ? entity.loaded : false;
    }

    getUIEntityError(id: number): boolean {
        const entity = this.getUIEntity(id);
        return entity ? entity.error : null;
    }

    protected selectIds(): Observable<number[]> {
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

    protected selectPagination(): Observable<Pagination<F>> {
        return this.__store__.state$.pipe(
            map(state => state.pagination),
            distinctUntilChanged()
        );
    }

    protected getState(): EntityListStoreState<E, UI, F> {
        return this.__store__.getState();
    }
}
