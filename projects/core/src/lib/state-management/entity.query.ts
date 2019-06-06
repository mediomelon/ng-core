import { combineLatest, Observable } from 'rxjs';
import { auditTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Pagination, StateWithUI } from '../models';
import { EntityListStore, EntityMapState } from './entity.store';

export abstract class EntityListQuery<E = any, UI = any, F = any> {
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
            )
        );
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
}
