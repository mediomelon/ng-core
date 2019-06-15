import { Pagination } from '../models';

export interface UIState {
    loaded: boolean;
    loading: boolean;
    error: any;
}

export interface EntityMapState<T> {
    [id: number]: T;
}

export interface EntityStoreState<E = any, UI extends UIState = any> {
    entities: EntityMapState<E>;
    uiEntities: EntityMapState<UI>;
    loaded: boolean;
    loading: boolean;
    error: any;
    ids: number[];
}

export interface EntityListStoreState<
    E = any,
    UI extends UIState = any,
    F = any
> {
    entities: EntityMapState<E>;
    uiEntities: EntityMapState<UI>;
    loaded: boolean;
    loading: boolean;
    error: any;
    ids: number[];
    pagination: Pagination<F>;
}
