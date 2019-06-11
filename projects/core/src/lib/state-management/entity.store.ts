import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Page, Pagination, PaginationPayload } from '../models';

export interface UIState {
    loaded: boolean;
    loading: boolean;
    error: any;
}

export interface EntityMapState<T> {
    [id: number]: T;
}

export interface EntityListState<E = any, UI extends UIState = any, F = any> {
    entities: EntityMapState<E>;
    uiEntities: EntityMapState<UI>;
    loaded: boolean;
    loading: boolean;
    error: any;
    ids: number[];
    pagination: Pagination<F>;
}

export abstract class EntityListStore<
    E = any,
    UI extends UIState = any,
    F = any
> {
    protected _state$: BehaviorSubject<EntityListState<E, UI, F>>;

    public state$: Observable<EntityListState<E, UI, F>>;

    constructor(initialState: EntityListState) {
        this._state$ = new BehaviorSubject(initialState);
        this.state$ = this._state$.asObservable();
    }

    fetch(id: number) {
        const state = this.getState();

        const newState = produce<EntityListState>(state, draft => {
            const { uiEntities } = draft;

            const uiEntity: UI = uiEntities[id] || this.createInitialUIState();

            uiEntity.loading = true;
            uiEntity.error = null;

            uiEntities[id] = uiEntity;
        });

        this.setState(newState);
    }

    fetchSuccess(id: number, payload: E) {
        const state = this.getState();

        const newState = produce<EntityListState>(state, draft => {
            const { entities, uiEntities } = draft;

            const uiEntity: UI = uiEntities[id];

            entities[id] = payload;
            uiEntity.loaded = true;
            uiEntity.loading = false;
        });

        this.setState(newState);
    }

    fetchError(id: number, error: any) {
        const state = this.getState();

        const newState = produce<EntityListState>(state, draft => {
            const { uiEntities } = draft;

            const uiEntity: UI = uiEntities[id];

            uiEntity.loading = false;
            uiEntity.error = error;
        });

        this.setState(newState);
    }

    fetchPageWithFilters(payload: F) {
        const state = this.getState();

        const newState = produce<EntityListState>(state, draft => {
            draft.loaded = false;
            draft.loading = true;
            draft.error = null;
            draft.pagination.page.index = 0;
            draft.pagination.filters = payload;
        });

        this.setState(newState);
    }

    fetchPage(page?: Page) {
        const state = this.getState();

        const newState = produce<EntityListState>(state, draft => {
            draft.loaded = false;
            draft.loading = true;
            draft.error = null;
            if (page) draft.pagination.page = page;
        });

        this.setState(newState);
    }

    fetchPageSuccess({ items, total }: PaginationPayload<E[]>) {
        const state = this.getState();

        const newState = produce<EntityListState>(state, draft => {
            const ids: number[] = [];

            const { entities, uiEntities } = draft;

            items.forEach(item => {
                const { id } = item as any;

                ids.push(id);

                entities[id] = item;

                const uiEntity: UI =
                    uiEntities[id] || this.createInitialUIState();
                uiEntity.loaded = true;

                uiEntities[id] = uiEntity;
            });

            draft.loaded = true;
            draft.loading = false;
            draft.ids = ids;
            draft.pagination.total = total;
        });

        this.setState(newState);
    }

    fetchPageError(error: any) {
        const state = this.getState();

        const newState = produce<EntityListState>(state, draft => {
            draft.loading = false;
            draft.error = error;
        });

        this.setState(newState);
    }

    insert(entity: E) {
        const state = this.getState();

        const newState = produce<EntityListState>(state, draft => {
            const { entities, uiEntities, ids, pagination } = draft;

            const { id } = entity as any;

            entities[id] = entity;

            if (!uiEntities[id]) uiEntities[id] = this.createInitialUIState();

            pagination.total++;

            if (ids.length < pagination.page.size) ids.push(id);
        });

        this.setState(newState);
    }

    remove(idToRemove: number) {
        const state = this.getState();

        const newState = produce<EntityListState<E, UI>>(state, draft => {
            const { entities, uiEntities, pagination, ids } = draft;

            delete entities[idToRemove];
            delete uiEntities[idToRemove];

            draft.ids = ids.filter(id => id != idToRemove);

            if (pagination.total > 0) pagination.total--;
        });

        this.setState(newState);
    }

    getState() {
        return this._state$.getValue();
    }

    protected createInitialUIState(): UIState {
        return {
            loaded: false,
            loading: false,
            error: null,
        };
    }

    protected setState(state: EntityListState) {
        this._state$.next(state);
    }
}
