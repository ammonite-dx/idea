import { CardRecord } from './types';

export type Category = {
    id: string;
    name: string;
    count?: number;
    records?: CardRecord[];
};

export type PageDefinition = {
    page: number;
    categories: Category[];
};

export type PaginationStructure = {
    totalPages: number;
    pageDefinitions: PageDefinition[];
};