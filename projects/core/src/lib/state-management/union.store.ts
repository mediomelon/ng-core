import produce from 'immer';
import { BehaviorSubject, Observable } from 'rxjs';

import { ID, UIState, UnionEntity, UnionStoreState } from './state';

const defaultState: UnionStoreState = {
    entities: {},
    uiEntities: {},
};

export abstract class UnionStore {
    protected _state$: BehaviorSubject<UnionStoreState>;

    public state$: Observable<UnionStoreState>;

    constructor(initialState?: UnionStoreState) {
        this._state$ = new BehaviorSubject(
            initialState ? initialState : defaultState
        );
        this.state$ = this._state$.asObservable();
    }

    fetchAll(id: ID) {
        this.setState(draft => {
            const { uiEntities } = draft;

            const uiEntity: UIState =
                uiEntities[id] || this.createInitialUIState();

            uiEntity.loaded = false;
            uiEntity.loading = true;
            uiEntity.error = null;

            uiEntities[id] = uiEntity;
        });
    }

    fetchAllSuccess(id: ID, ids: ID[]) {
        this.setState(draft => {
            const { entities, uiEntities } = draft;
            const uiEntity = uiEntities[id];

            entities[id] = {
                id,
                ids,
            };

            uiEntity.loaded = true;
            uiEntity.loading = false;

            uiEntities[id] = uiEntity;
        });
    }

    fetchAllError(id: ID, error: any) {
        this.setState(draft => {
            const { uiEntities } = draft;

            const uiEntity = uiEntities[id];

            uiEntity.loading = false;
            uiEntity.error = error;
        });
    }

    insert(id: ID, idOrIds: ID | ID[]) {
        this.setState(draft => {
            const { entities, uiEntities } = draft;

            const entity: UnionEntity = (entities[id] as UnionEntity) || {
                id,
                ids: [],
            };

            const payload: ID[] = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

            entity.ids = [...entity.ids, ...payload];

            entities[id] = entity;

            if (!uiEntities[id]) uiEntities[id] = this.createInitialUIState();
        });
    }

    remove(unionId: ID, idToRemove: ID) {
        this.setState(draft => {
            const { entities } = draft;
            const entity = entities[unionId];

            entity.ids = entity.ids.filter(id => id != idToRemove);
        });
    }

    removeUnion(id: ID) {
        this.setState(draft => {
            const { entities, uiEntities } = draft;

            delete entities[id];
            delete uiEntities[id];
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

    protected setState(producer: (draft: UnionStoreState) => void) {
        const prevState = this.getState();
        const nextValue = produce(prevState, producer);
        this._state$.next(nextValue);
    }
}
