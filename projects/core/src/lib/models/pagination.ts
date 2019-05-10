export interface Page {
    index: number;
    size?: number;
}

export interface Pagination<T = any> {
    page: Page;
    total: number;
    filters?: T;
}

export interface PaginationPayload<T> {
    total: number;
    items: T
}