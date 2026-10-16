interface Props {
    page: number;
    lastPage: number;
    onChange: (p: number) => void;
}

export default function Pagination({ page, lastPage, onChange }: Props) {
    if (lastPage <= 1) return null;
    return (
        <div className="pagination">
            <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
            <span>Page {page} of {lastPage}</span>
            <button disabled={page >= lastPage} onClick={() => onChange(page + 1)}>Next</button>
        </div>
    );
}