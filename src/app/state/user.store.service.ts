import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { UserService } from '../services/user.service';
import { UserStore } from './user.store';

@Injectable({
    providedIn: 'root',
})
export class UserStoreService {
    constructor(private userService: UserService, private store: UserStore) {}

    getAll() {
        this.store.fetchPage();
        return this.userService.getAll().pipe(
            tap(
                users =>
                    this.store.fetchPageSuccess({
                        items: users,
                        total: users.length,
                    }),
                error => this.store.fetchPageError(error)
            )
        );
    }

    get(id: number) {
        this.store.fetch(id);

        return this.userService
            .get(id)
            .pipe(
                tap(
                    user => this.store.fetchSuccess(id, user),
                    error => this.store.fetchError(id, error)
                )
            );
    }
}
