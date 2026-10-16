import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useCreateTodo } from '../hooks/useTodoMutations';

export default function TodoForm() {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const create = useCreateTodo();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        create.mutate(
            { title },
            {
                onSuccess: () => setTitle(''),
                onError: (err) => {
                    if (isAxiosError(err) && err.response?.status === 422) {
                        setError(err.response.data.errors?.title?.[0] ?? 'Invalid input');
                    } else {
                        setError('Something went wrong. Try again.');
                    }
                },
            }
        );
    };

    return (
        <form onSubmit={submit} className="todo-form">
            <div className="row">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                />
                <button type="submit" disabled={create.isPending}>
                    {create.isPending ? 'Adding...' : 'Add'}
                </button>
            </div>
            {error && <p className="error">{error}</p>}
        </form>
    );
}