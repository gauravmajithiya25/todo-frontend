export interface Todo {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface TodoFilters {
    status: 'all' | 'active' | 'completed';
    search: string;
    page: number;
}

export interface Paginated<T> {
    data: T[];
    meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export type CreateTodoInput = Pick<Todo, 'title'> & Partial<Pick<Todo, 'description' | 'due_date'>>;
export type UpdateTodoInput = Partial<Omit<Todo, 'id' | 'created_at' | 'updated_at'>>;