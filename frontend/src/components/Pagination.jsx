export default function Pagination({
    total,
    limit,
    offset,
    onPageChange
}) {

    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    const changePage = (newOffset) => {
        setOffset(newOffset);
    };

    return (

        <div className="flex justify-center items-center gap-4 mt-4">

            <button
                disabled={offset === 0}
                onClick={() => onPageChange(offset - limit)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Prev
            </button>

            <span>
                Page {currentPage} / {totalPages}
            </span>

            <button
                disabled={offset + limit >= total}
                onClick={() => onPageChange(offset + limit)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
                Next
            </button>

        </div>

    );
}