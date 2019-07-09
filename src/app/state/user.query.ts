import { Injectable } from '@angular/core';
import { EntityListQuery } from 'projects/core/src/lib/state-management/entity-list.query';
import { combineLatest } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';

import { User } from '../models/user';
import { UserStore } from './user.store';

@Injectable({
    providedIn: 'root',
})
export class UserQuery extends EntityListQuery<User> {
    constructor(private store: UserStore) {
        super(store);
    }

    selectEmails() {
        return combineLatest(this.selectIds(), this.selectEntitiesMap()).pipe(
            auditTime(0),
            map(([ids, entities]) => ids.map(id => entities[id].email))
        );
    }
}
