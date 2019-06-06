import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';

import { Page, Pagination, PaginationPayload } from '../models';

export interface EntityMapState<T> {
    [id: number]: T;
}

export interface EntityListState<E = any, UI = any, F = any> {
    entities: EntityMapState<E>;
    uiEntities: EntityMapState<UI>;
    loaded: boolean;
    loading: boolean;
    error: any;
    ids: number[];
    pagination: Pagination<F>;
}

export abstract class EntityListStore<E = any, UI = any, F = any> {
    protected _state$: BehaviorSubject<EntityListState<E, UI, F>>;

    public state$: Observable<EntityListState<E, UI, F>>;

    constructor(initialState: EntityListState) {
        this._state$ = new BehaviorSubject(initialState);
        this.state$ = this._state$.asObservable();
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

                if (!uiEntities[id])
                    uiEntities[id] = this.createInitialUIState();
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

    getState() {
        return this._state$.getValue();
    }

    abstract createInitialUIState(): UI;

    protected setState(state: EntityListState) {
        this._state$.next(state);
    }
}
