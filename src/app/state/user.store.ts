import { Injectable } from '@angular/core';
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

    createInitialUIState(): UserUI {
        return {
            loaded: false,
            loading: false,
            error: null,
            isOpen: false,
        };
    }
}
