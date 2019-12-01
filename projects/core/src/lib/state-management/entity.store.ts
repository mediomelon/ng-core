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
        this.setState((draft: EntityStoreState) => {
            const { uiEntities } = draft;

            const uiEntity: UI = uiEntities[id] || this.createInitialUIState();

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

    fetchAll() {
        this.setState(draft => {
            draft.loaded = false;
            draft.loading = true;
            draft.error = null;
        });
    }

    fetchAllSuccess(items: E[]) {
        this.setState((draft: EntityStoreState) => {
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
    }

    fetchAllError(error: any) {
        this.setState(draft => {
            draft.loading = false;
            draft.error = error;
        });
    }

    insert(entityOrEntities: E | E[]) {
        this.setState((draft: EntityStoreState) => {
            const { entities, uiEntities, ids } = draft;

            const payload: E[] = Array.isArray(entityOrEntities)
                ? entityOrEntities
                : [entityOrEntities];

            payload.forEach(entity => {
                const { [this.idField]: id } = entity as any;

                entities[id] = entity;

                if (!uiEntities[id])
                    uiEntities[id] = this.createInitialUIState();

                ids.push(id);
            });
        });
    }

    remove(idToRemove: ID) {
        this.setState(draft => {
            const { entities, uiEntities, ids } = draft;

            delete entities[idToRemove];
            delete uiEntities[idToRemove];

            draft.ids = ids.filter(id => id != idToRemove);
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

    protected setState(producer: (draft: EntityStoreState<E, UI>) => void) {
        const prevState = this.getState();
        const nextValue = produce(prevState, producer);
        this._state$.next(nextValue);
    }
}
