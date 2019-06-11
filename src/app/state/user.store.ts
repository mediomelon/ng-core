import { Injectable } from '@angular/core';
import { EntityListState, EntityListStore, UIState } from 'projects/core/src/lib/state-management/entity.store';

import { User } from '../models/user';

export interface UserUI extends UIState {
    isOpen: boolean;
}

const initialState: EntityListState<User> = {
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
