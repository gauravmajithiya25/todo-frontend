import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createTodo,
    updateTodo,
    deleteTodo,
    restoreTodo,
    forceDeleteTodo,
} from '../api/todos';
import { todoKeys } from '../lib/queryKeys';
import type { Todo, Paginated } from '../types/todo';

type ListCache = Paginated<Todo>;

// CREATE
export const useCreateTodo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createTodo,
        onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.lists() }),
    });
};

// UPDATE (edit title/description)
export const useUpdateTodo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateTodo,
        onSuccess: (todo) => {
            qc.setQueryData(todoKeys.detail(todo.id), todo);
            qc.invalidateQueries({ queryKey: todoKeys.lists() });
        },
    });
};

// TOGGLE (optimistic)
export const useToggleTodo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (todo: Todo) =>
            updateTodo({ id: todo.id, is_completed: !todo.is_completed }),
        onMutate: async (todo) => {
            await qc.cancelQueries({ queryKey: todoKeys.lists() });
            const snapshot = qc.getQueriesData<ListCache>({ queryKey: todoKeys.lists() });
            qc.setQueriesData<ListCache>({ queryKey: todoKeys.lists() }, (old) =>
                old && {
                    ...old,
                    data: old.data.map((t) =>
                        t.id === todo.id ? { ...t, is_completed: !t.is_completed } : t
                    ),
                }
            );
            return { snapshot };
        },
        onError: (_e, _todo, ctx) => {
            ctx?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
        },
        onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.lists() }),
    });
};

// DELETE (soft delete, optimistic)
export const useDeleteTodo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteTodo,
        onMutate: async (id: number) => {
            await qc.cancelQueries({ queryKey: todoKeys.lists() });
            const snapshot = qc.getQueriesData<ListCache>({ queryKey: todoKeys.lists() });
            qc.setQueriesData<ListCache>({ queryKey: todoKeys.lists() }, (old) =>
                old && { ...old, data: old.data.filter((t) => t.id !== id) }
            );
            return { snapshot };
        },
        onError: (_e, _id, ctx) => {
            ctx?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: todoKeys.lists() });
            qc.invalidateQueries({ queryKey: todoKeys.trashedAll() });
        },
    });
};

// RESTORE (optimistic removal from trash)
export const useRestoreTodo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: restoreTodo,
        onMutate: async (id: number) => {
            await qc.cancelQueries({ queryKey: todoKeys.trashedAll() });
            const snapshot = qc.getQueriesData<ListCache>({ queryKey: todoKeys.trashedAll() });
            qc.setQueriesData<ListCache>({ queryKey: todoKeys.trashedAll() }, (old) =>
                old && { ...old, data: old.data.filter((t) => t.id !== id) }
            );
            return { snapshot };
        },
        onError: (_e, _id, ctx) => {
            ctx?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: todoKeys.trashedAll() });
            qc.invalidateQueries({ queryKey: todoKeys.lists() });
        },
    });
};

// FORCE DELETE (permanent, no optimistic update)
export const useForceDeleteTodo = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: forceDeleteTodo,
        onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.trashedAll() }),
    });
};