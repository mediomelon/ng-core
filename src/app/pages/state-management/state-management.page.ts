import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UserQuery } from 'src/app/state/user.query';
import { UserStoreService } from 'src/app/state/user.store.service';

@Component({
    selector: 'state-management',
    templateUrl: './state-management.page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateManagementPage implements OnInit {
    isLoading$ = this.query.selectLoading().pipe(tap(console.log));

    emails$ = this.query.selectEmails();

    entities$ = this.query.selectEntitiesWithUI();

    constructor(
        private storeService: UserStoreService,
        private query: UserQuery
    ) {}

    ngOnInit() {
        this.storeService.getAll().subscribe();
    }
}
