import { Pagination } from '../models';

export interface UIState {
    loaded: boolean;
    loading: boolean;
    error: any;
}

export interface EntityMapState<T> {
    [id: string]: T;
}

export interface EntityStoreState<E = any, UI extends UIState = any> {
    entities: EntityMapState<E>;
    uiEntities: EntityMapState<UI>;
    loaded: boolean;
    loading: boolean;
    error: any;
    ids: ID[];
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
    ids: ID[];
    pagination: Pagination<F>;
}

export interface SubmitStoreState {
    submitting: boolean;
    error: any;
}

export interface StoreState<S = any, UI = any> {
    loaded: boolean;
    loading: boolean;
    error: any;
    state: S;
    ui?: UI;
}

export type ID = number | string;

export interface UnionEntity {
    id: ID;
    ids: ID[];
}

export interface UnionStoreState {
    entities: EntityMapState<UnionEntity>;
    uiEntities: EntityMapState<UIState>;
}
