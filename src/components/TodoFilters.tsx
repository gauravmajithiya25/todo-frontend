import type { TodoFilters as Filters } from '../types/todo';

interface Props {
    status: Filters['status'];
    search: string;
    onStatus: (s: Filters['status']) => void;
    onSearch: (s: string) => void;
}

const tabs: Filters['status'][] = ['all', 'active', 'completed'];

export default function TodoFilters({ status, search, onStatus, onSearch }: Props) {
    return (
        <div className="filters">
            <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search todos"
            />
            <div className="tabs">
                {tabs.map((t) => (
                    <button
                        key={t}
                        className={t === status ? 'tab active' : 'tab'}
                        onClick={() => onStatus(t)}
                    >
                        {t[0].toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
}