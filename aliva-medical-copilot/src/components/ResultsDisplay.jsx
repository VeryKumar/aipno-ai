import React from 'react';

const ResultsDisplay = ({ results }) => {
    return (
        <div>
            <h2>Results</h2>
            {results.length === 0 ? (
                <p>No results found. Try a different search query.</p>
            ) : (
                <ul>
                    {results.map((result) => (
                        <li key={result.id}>
                            <h3>{result.title}</h3>
                            <p>{result.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResultsDisplay;