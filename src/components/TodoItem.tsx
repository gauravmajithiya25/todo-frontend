import { useState } from 'react';
import type { Todo } from '../types/todo';
import { useToggleTodo, useUpdateTodo, useDeleteTodo } from '../hooks/useTodoMutations';

export default function TodoItem({ todo }: { todo: Todo }) {
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);

    const toggle = useToggleTodo();
    const update = useUpdateTodo();
    const remove = useDeleteTodo();

    const save = () => {
        if (!title.trim()) return;
        update.mutate({ id: todo.id, title }, { onSuccess: () => setEditing(false) });
    };

    return (
        <li className="item">
            <label className="todo-check">
                <input
                    type="checkbox"
                    checked={todo.is_completed}
                    onChange={() => toggle.mutate(todo)}
                    aria-label={todo.is_completed ? 'Mark as active' : 'Mark as complete'}
                />
                <span className="checkmark" aria-hidden="true" />
            </label>

            {editing ? (
                <div className="item-edit">
                    <input
                        className="edit-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        aria-label="Todo title"
                    />
                    <button onClick={save} disabled={update.isPending || !title.trim()}>Save</button>
                    <button className="ghost" onClick={() => { setEditing(false); setTitle(todo.title); }}>
                        Cancel
                    </button>
                </div>
            ) : (
                <>
                    <span className={todo.is_completed ? 'title done' : 'title'}>{todo.title}</span>
                    <div className="item-actions">
                        <button className="ghost" onClick={() => setEditing(true)}>Edit</button>
                        <button className="danger" onClick={() => remove.mutate(todo.id)}>Delete</button>
                    </div>
                </>
            )}
        </li>
    );
}