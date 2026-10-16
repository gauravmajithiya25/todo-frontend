import type { TodoFilters } from '../types/todo';

export const todoKeys = {
    all: ['todos'] as const,
    lists: () => [...todoKeys.all, 'list'] as const,
    list: (filters: TodoFilters) => [...todoKeys.lists(), filters] as const,
    details: () => [...todoKeys.all, 'detail'] as const,
    detail: (id: number) => [...todoKeys.details(), id] as const,
    trashed: (page: number) => [...todoKeys.all, 'trashed', page] as const,
    trashedAll: () => [...todoKeys.all, 'trashed'] as const,
};