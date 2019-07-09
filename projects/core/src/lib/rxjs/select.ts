import { Observable, pipe, UnaryFunction } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export function select<T, R>(
    fn: (state: T) => R
): UnaryFunction<Observable<T>, Observable<R>> {
    return pipe(
        map(fn),
        distinctUntilChanged()
    );
}
