import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';

import { IdField } from './base';
import { EntityStoreState, ID, UIState } from './state';

export abstract class EntityStore<
    E = any,
    UI extends UIState = any
> extends IdField {
    protected _state$: BehaviorSubject<EntityStoreState<E, UI>>;

    public state$: Observable<EntityStoreState<E, UI>>;

    constructor(
        initialState: EntityStoreState,
        idField?: Extract<keyof E, string>
    ) {
        super(idField);
        this._state$ = new BehaviorSubject(initialState);
        this.state$ = this._state$.asObservable();
    }

    fetch(id: ID) {
        const state = this.getState();

        const newState = produce<EntityStoreState>(state, draft => {
            const { uiEntities } = draft;

            const uiEntity: UI = uiEntities[id] || this.createInitialUIState();

            uiEntity.loading = true;
            uiEntity.error = null;

            uiEntities[id] = uiEntity;
        });

        this.setState(newState);
    }

    fetchSuccess(id: ID, payload: E) {
        const state = this.getState();

        const newState = produce<EntityStoreState>(state, draft => {
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

        const newState = produce<EntityStoreState>(state, draft => {
            const { uiEntities } = draft;

            const uiEntity: UI = uiEntities[id];

            uiEntity.loading = false;
            uiEntity.error = error;
        });

        this.setState(newState);
    }

    fetchAll() {
        const state = this.getState();

        const newState = produce<EntityStoreState>(state, draft => {
            draft.loaded = false;
            draft.loading = true;
            draft.error = null;
        });

        this.setState(newState);
    }

    fetchAllSuccess(items: E[]) {
        const state = this.getState();

        const newState = produce<EntityStoreState>(state, draft => {
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
        });

        this.setState(newState);
    }

    fetchAllError(error: any) {
        const state = this.getState();

        const newState = produce<EntityStoreState>(state, draft => {
            draft.loading = false;
            draft.error = error;
        });

        this.setState(newState);
    }

    insert(entity: E) {
        const state = this.getState();

        const newState = produce<EntityStoreState>(state, draft => {
            const { entities, uiEntities, ids } = draft;

            const { [this.idField]: id } = entity as any;

            entities[id] = entity;

            if (!uiEntities[id]) uiEntities[id] = this.createInitialUIState();

            ids.push(id);
        });

        this.setState(newState);
    }

    remove(idToRemove: ID) {
        const state = this.getState();

        const newState = produce<EntityStoreState<E, UI>>(state, draft => {
            const { entities, uiEntities, ids } = draft;

            delete entities[idToRemove];
            delete uiEntities[idToRemove];

            draft.ids = ids.filter(id => id != idToRemove);
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

    protected setState(state: EntityStoreState) {
        this._state$.next(state);
    }
}
