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
        this.setState((draft: EntityListStoreState) => {
            const { uiEntities } = draft;

            const uiEntity: UI = uiEntities[id] || this.createInitialUIState();

            uiEntity.loaded = false;
            uiEntity.loading = true;
            uiEntity.error = null;

            uiEntities[id] = uiEntity;
        });
    }

    fetchSuccess(id: ID, payload: E) {
        this.setState(draft => {
            const { entities, uiEntities } = draft;

            const uiEntity: UI = uiEntities[id];

            entities[id] = payload;
            uiEntity.loaded = true;
            uiEntity.loading = false;
        });
    }

    fetchError(id: ID, error: any) {
        this.setState(draft => {
            const { uiEntities } = draft;

            const uiEntity: UI = uiEntities[id];

            uiEntity.loading = false;
            uiEntity.error = error;
        });
    }

    fetchPageWithFilters(payload: F) {
        this.setState(draft => {
            draft.loaded = false;
            draft.loading = true;
            draft.error = null;
            draft.pagination.page.index = 0;
            draft.pagination.filters = payload;
        });
    }

    fetchPage(page?: Page) {
        this.setState(draft => {
            draft.loaded = false;
            draft.loading = true;
            draft.error = null;
            if (page) draft.pagination.page = page;
        });
    }

    fetchPageSuccess({ items, total }: PaginationPayload<E[]>) {
        this.setState((draft: EntityListStoreState) => {
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
    }

    fetchPageError(error: any) {
        this.setState(draft => {
            draft.loading = false;
            draft.error = error;
        });
    }

    insert(entityOrEntities: E | E[]) {
        this.setState((draft: EntityListStoreState) => {
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
    }

    remove(idToRemove: ID) {
        this.setState(draft => {
            const { entities, uiEntities, pagination, ids } = draft;

            delete entities[idToRemove];
            delete uiEntities[idToRemove];

            draft.ids = ids.filter(id => id != idToRemove);

            if (pagination.total > 0) pagination.total--;
        });
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

    protected setState(
        producer: (draft: EntityListStoreState<E, UI, F>) => void
    ) {
        const prevState = this.getState();
        const nextValue = produce(prevState, producer);
        this._state$.next(nextValue);
    }
}
