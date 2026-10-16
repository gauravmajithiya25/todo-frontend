import { useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoFilters from './components/TodoFilters';
import TodoList from './components/TodoList';
import TrashList from './components/TrashList';
import { useDebounce } from './hooks/useDebounce';
import type { TodoFilters as Filters } from './types/todo';

export default function App() {
  const [view, setView] = useState<'todos' | 'trash'>('todos');
  const [status, setStatus] = useState<Filters['status']>('all');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const search = useDebounce(searchInput, 300);

  const filters: Filters = { status, search, page };

  return (
    <div className="app">
      <header className="top">
        <h1>My todos</h1>
        <div className="tabs">
          <button className={view === 'todos' ? 'tab active' : 'tab'} onClick={() => setView('todos')}>
            Todos
          </button>
          <button className={view === 'trash' ? 'tab active' : 'tab'} onClick={() => setView('trash')}>
            Trash
          </button>
        </div>
      </header>

      {view === 'todos' ? (
        <>
          <TodoForm />
          <TodoFilters
            status={status}
            search={searchInput}
            onStatus={(s) => { setStatus(s); setPage(1); }}
            onSearch={(s) => { setSearchInput(s); setPage(1); }}
          />
          <TodoList filters={filters} onPage={setPage} />
        </>
      ) : (
        <TrashList />
      )}
    </div>
  );
}