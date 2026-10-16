import { api } from './client';
import type { Todo, TodoFilters, Paginated, CreateTodoInput, UpdateTodoInput } from '../types/todo';

export const getTodos = async (f: TodoFilters): Promise<Paginated<Todo>> => {
    const { data } = await api.get('/todos', {
        params: {
            page: f.page,
            search: f.search || undefined,
            status: f.status === 'all' ? undefined : f.status,
        },
    });
    return data;
};

export const getTodo = async (id: number): Promise<Todo> =>
    (await api.get(`/todos/${id}`)).data.data;

export const createTodo = async (input: CreateTodoInput): Promise<Todo> =>
    (await api.post('/todos', input)).data.data;

export const updateTodo = async ({ id, ...input }: UpdateTodoInput & { id: number }): Promise<Todo> =>
    (await api.put(`/todos/${id}`, input)).data.data;

export const deleteTodo = async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`);
};
export const getTrashedTodos = async (page: number): Promise<Paginated<Todo>> =>
    (await api.get('/todos/trashed', { params: { page } })).data;

export const restoreTodo = async (id: number): Promise<Todo> =>
    (await api.patch(`/todos/${id}/restore`)).data.data;

export const forceDeleteTodo = async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}/force`);
};