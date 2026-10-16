import { useState } from 'react';
import { useTrashedTodos } from '../hooks/useTodos';
import { useRestoreTodo, useForceDeleteTodo } from '../hooks/useTodoMutations';
import Pagination from './Pagination';

export default function TrashList() {
    const [page, setPage] = useState(1);
    const { data, isPending, isError } = useTrashedTodos(page);
    const restore = useRestoreTodo();
    const forceDelete = useForceDeleteTodo();

    if (isPending) return <p className="muted">Loading trash...</p>;
    if (isError) return <p className="error">Failed to load trash.</p>;
    if (data.data.length === 0) return <p className="muted">Trash is empty.</p>;

    return (
        <>
            <ul className="list">
                {data.data.map((todo) => (
                    <li key={todo.id} className="item">
                        <span className="title done">{todo.title}</span>
                        <button onClick={() => restore.mutate(todo.id)}>Restore</button>
                        <button
                            className="danger"
                            onClick={() => {
                                if (window.confirm('Delete forever? This cannot be undone.')) {
                                    forceDelete.mutate(todo.id);
                                }
                            }}
                        >
                            Delete forever
                        </button>
                    </li>
                ))}
            </ul>
            <Pagination page={data.meta.current_page} lastPage={data.meta.last_page} onChange={setPage} />
        </>
    );
}