import { Injectable } from '@angular/core';
import { EntityListState, EntityListStore } from 'projects/core/src/lib/state-management/entity.store';

import { User } from '../models/user';

const initialState: EntityListState<User, {}> = {
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
export class UserStore extends EntityListStore<User> {
    constructor() {
        super(initialState);
    }

    createInitialUIState() {
        return {};
    }
}
