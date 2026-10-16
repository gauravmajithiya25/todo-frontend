import { useTodos } from '../hooks/useTodos';
import type { TodoFilters } from '../types/todo';
import TodoItem from './TodoItem';
import Pagination from './Pagination';

interface Props {
    filters: TodoFilters;
    onPage: (p: number) => void;
}

export default function TodoList({ filters, onPage }: Props) {
    const { data, isPending, isError, error, refetch, isPlaceholderData } = useTodos(filters);

    if (isPending) return <p className="muted">Loading todos...</p>;

    if (isError) {
        return (
            <div className="error-box">
                <p>Failed to load: {error.message}</p>
                <button onClick={() => refetch()}>Retry</button>
            </div>
        );
    }

    if (data.data.length === 0) {
        return <p className="muted">No todos found. Add one above.</p>;
    }

    return (
        <>
            <ul className="list" style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
                {data.data.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
            <Pagination
                page={data.meta.current_page}
                lastPage={data.meta.last_page}
                onChange={onPage}
            />
        </>
    );
}