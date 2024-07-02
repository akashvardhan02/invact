import React, { useState } from 'react';
import ResultCard from './ResultCard';

const Add = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null); // State to store selected movie details

    const onChange = e => {
        const inputValue = e.target.value;
        setQuery(inputValue);

        if (inputValue.trim() === "") {
            setResults([]);
            return;
        }

        fetch(`https://api.themoviedb.org/3/search/movie?api_key=7600c228921a910e7c880b34de351384&language=en-US&page=1&include_adult=false&query=${encodeURIComponent(inputValue)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.results && !data.errors) {
                    setResults(data.results);
                } else {
                    setResults([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setResults([]);
            });
    };

    // Function to fetch movie details by ID
    const fetchMovieDetails = (movieId) => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_KEY}&append_to_response=videos,images`)
            .then((res) => res.json())
            .then((data) => {
                setSelectedMovie(data); // Update selectedMovie state with fetched data
            })
            .catch((error) => {
                console.error('Error fetching movie details:', error);
            });
    };

    // Render details for selected movie
    const renderSelectedMovie = () => {
        if (selectedMovie) {
            return (
                <div className="selected-movie">
                    <h2>{selectedMovie.title}</h2>
                    <p>{selectedMovie.overview}</p>
                    {/* Render videos and images here if needed */}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="add-page">
            <div className="container">
                <div className="add-content">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Search movie"
                            value={query}
                            onChange={onChange}
                        />
                    </div>
                    {results && results.length > 0 && (
                        <ul className="results">
                            {results.map((movie) => (
                                <li key={movie.id}>
                                    <ResultCard
                                        movie={movie}
                                        onSelect={() => fetchMovieDetails(movie.id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                    {results && results.length === 0 && (
                        <p>No results found.</p>
                    )}
                    {renderSelectedMovie()}
                </div>
            </div>
        </div>
    );
};

export default Add;
