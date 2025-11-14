import type { List } from "../../../core/types/domain";

export interface ListRepository {
    createList(list: List): Promise<void>;
    getList(id: string): Promise<List>;
    updateList(list: List): Promise<void>;
    deleteList(id: string): Promise<void>;
    getLists(): Promise<List[]>;
}