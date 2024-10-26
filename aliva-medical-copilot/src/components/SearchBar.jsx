import React, { useState } from 'react';

const SearchBar = () => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log('Search query:', query);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for medical terms, codes, or treatments..."
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default SearchBar;