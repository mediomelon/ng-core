import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';

import { Page, PaginationPayload } from '../models';
import { IdField } from './base';
import { EntityListStoreState, ID, UIState } from './state';

export abstract class EntityListStore<
    E = any,
    UI extends UIState = any,
    F = any
> extends IdField {
    protected _state$: BehaviorSubject<EntityListStoreState<E, UI, F>>;

    public state$: Observable<EntityListStoreState<E, UI, F>>;

    constructor(
        initialState: EntityListStoreState,
        idField?: Extract<keyof E, string>
    ) {
        super(idField);
        this._state$ = new BehaviorSubject(initialState);
        this.state$ = this._state$.asObservable();
    }

    fetch(id: ID) {
        const state = this.getState();

        const newState = produce<EntityListStoreState>(state, draft => {
            const { uiEntities } = draft;

            const uiEntity: UI = uiEntities[id] || this.createInitialUIState();

            uiEntity.loaded = false;
            uiEntity.loading = true;
            uiEntity.error = null;

            uiEntities[id] = uiEntity;
        });

        this.setState(newState);
    }

    fetchSuccess(id: ID, payload: E) {
        const state = this.getState();

        const newState = produce<EntityListStoreState>(state, draft => {
            const { entities, uiEntities } = draft;

            const uiEntity: UI = uiEntities[id];

            entities[id] = payload;
            uiEntity.loaded = true;
            uiEntity.loading = false;
        });

        this.setState(newState);
    }

    fetchError(id: ID, error: any) {
        const state = this.getState();

        const newState = produce<EntityListStoreState>(state, draft => {
            const { uiEntities } = draft;

            const uiEntity: UI = uiEntities[id];

            uiEntity.loading = false;
            uiEntity.error = error;
        });

        this.setState(newState);
    }

    fetchPageWithFilters(payload: F) {
        const state = this.getState();

        const newState = produce<EntityListStoreState>(state, draft => {
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

        const newState = produce<EntityListStoreState>(state, draft => {
            draft.loaded = false;
            draft.loading = true;
            draft.error = null;
            if (page) draft.pagination.page = page;
        });

        this.setState(newState);
    }

    fetchPageSuccess({ items, total }: PaginationPayload<E[]>) {
        const state = this.getState();

        const newState = produce<EntityListStoreState>(state, draft => {
            const ids: ID[] = [];

            const { entities, uiEntities } = draft;

            items.forEach(item => {
                const { [this.idField]: id } = item as any;

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

        const newState = produce<EntityListStoreState>(state, draft => {
            draft.loading = false;
            draft.error = error;
        });

        this.setState(newState);
    }

    insert(entityOrEntities: E | E[]) {
        const state = this.getState();

        const newState = produce<EntityListStoreState>(state, draft => {
            const { entities, uiEntities, ids, pagination } = draft;

            const payload: E[] = Array.isArray(entityOrEntities)
                ? entityOrEntities
                : [entityOrEntities];

            payload.forEach(entity => {
                const { [this.idField]: id } = entity as any;

                entities[id] = entity;

                if (!uiEntities[id])
                    uiEntities[id] = this.createInitialUIState();

                pagination.total++;

                if (ids.length < pagination.page.size) ids.push(id);
            });
        });

        this.setState(newState);
    }

    remove(idToRemove: ID) {
        const state = this.getState();

        const newState = produce<EntityListStoreState<E, UI>>(state, draft => {
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

    protected setState(state: EntityListStoreState) {
        this._state$.next(state);
    }
}
