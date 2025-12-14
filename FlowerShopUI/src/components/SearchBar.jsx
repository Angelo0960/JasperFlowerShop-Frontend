export default function SearchBar({
    value = "",
    onChange,
    onClear,
    placeholder = "Search products...",
}) {
    const showClear = Boolean(value);

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                {showClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        title="Clear search"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {showClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                >
                    Clear Search
                </button>
            )}
        </div>
    );
}

