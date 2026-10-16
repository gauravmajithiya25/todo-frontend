import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getTodos, getTodo, getTrashedTodos } from '../api/todos';
import { todoKeys } from '../lib/queryKeys';
import type { TodoFilters } from '../types/todo';

// 1. List query: filters + pagination live inside the key
export const useTodos = (filters: TodoFilters) =>
    useQuery({
        queryKey: todoKeys.list(filters),
        queryFn: () => getTodos(filters),
        placeholderData: keepPreviousData, // no flicker when changing page/filter
    });

// 2. Detail query: only runs when an id exists
export const useTodo = (id: number | null) =>
    useQuery({
        queryKey: todoKeys.detail(id!),
        queryFn: () => getTodo(id!),
        enabled: id !== null,
    });

export const useTrashedTodos = (page: number) =>
    useQuery({
        queryKey: todoKeys.trashed(page),
        queryFn: () => getTrashedTodos(page),
        placeholderData: keepPreviousData,
    });