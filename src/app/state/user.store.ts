import { Injectable } from '@angular/core';
import produce from 'immer';
import { EntityListStore, EntityListStoreState, UIState } from 'projects/core/src/public-api';

import { User } from '../models/user';

export interface UserUI extends UIState {
    isOpen: boolean;
}

const initialState: EntityListStoreState<User> = {
    entities: {},
    uiEntities: {},
    ids: [],
    error: null,
    loaded: false,
    loading: false,
    pagination: {
        page: {
            index: 0,
            size: 20,
        },
        total: null,
    },
};

@Injectable({
    providedIn: 'root',
})
export class UserStore extends EntityListStore<User, UserUI> {
    constructor() {
        super(initialState);
    }

    toggleOpen(id: number) {
        const state = this.getState();

        const newState = produce(state, draft => {
            draft.uiEntities[id].isOpen = !draft.uiEntities[id].isOpen;
        });

        this.setState(newState);
    }

    createInitialUIState(): UserUI {
        return {
            loaded: false,
            loading: false,
            error: null,
            isOpen: false,
        };
    }
}
