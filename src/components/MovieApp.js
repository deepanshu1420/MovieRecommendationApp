import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSearch } from 'react-icons/ai';
import './MovieApp.css';

const MovieRecommendations = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [page, setPage] = useState(1); // ✅ track pagination

  // Fetch Genres
  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get(
        'https://api.themoviedb.org/3/genre/movie/list',
        { params: { api_key: '0fa2853e7c4d6c8f146aba861c5e4a06' } }
      );
      setGenres(response.data.genres);
    };
    fetchGenres();
  }, []);

  // Fetch Movies (Search or Bollywood Discover)
  useEffect(() => {
    const fetchMovies = async () => {
      const endpoint = searchQuery
        ? 'https://api.themoviedb.org/3/search/movie'
        : 'https://api.themoviedb.org/3/discover/movie';

      const response = await axios.get(endpoint, {
        params: {
          api_key: '0fa2853e7c4d6c8f146aba861c5e4a06',
          query: searchQuery || undefined,
          sort_by: searchQuery ? undefined : sortBy,
          with_genres: searchQuery ? undefined : selectedGenre,
          page: page,
          region: searchQuery ? undefined : 'IN',
          with_original_language: searchQuery ? undefined : 'hi',
        },
      });

      if (page === 1) setMovies(response.data.results);
      else setMovies((prev) => [...prev, ...response.data.results]); // append for Load More
    };
    fetchMovies();
  }, [searchQuery, sortBy, selectedGenre, page]);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleSortChange = (event) => setSortBy(event.target.value);
  const handleGenreChange = (event) => setSelectedGenre(event.target.value);

  const handleSearchSubmit = async () => {
    setPage(1); // reset to page 1 when searching
    const response = await axios.get(
      'https://api.themoviedb.org/3/search/movie',
      { params: { api_key: '0fa2853e7c4d6c8f146aba861c5e4a06', query: searchQuery } }
    );
    setMovies(response.data.results);
  };

  const toggleDescription = (movieId) =>
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);

  const loadMoreMovies = () => setPage((prev) => prev + 1); // ✅ Load more

  return (
    <div>
      <h1>MovieHouse</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button onClick={handleSearchSubmit} className="search-button">
          <AiOutlineSearch />
        </button>
      </div>
      <div className="filters">
        <label htmlFor="sort-by">Sort By:</label>
        <select id="sort-by" value={sortBy} onChange={handleSortChange}>
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
        </select>
        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>
      <div className="movie-wrapper">
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/fallback-poster.png'
              }
              alt={movie.title}
            />
            <h2>{movie.title}</h2>
            <p className="rating">Rating: {movie.vote_average}</p>
            {expandedMovieId === movie.id ? (
              <p>{movie.overview}</p>
            ) : (
              <p>{movie.overview?.substring(0, 150)}...</p>
            )}
            <button onClick={() => toggleDescription(movie.id)} className="read-more">
              {expandedMovieId === movie.id ? 'Show Less' : 'Read More'}
            </button>
          </div>
        ))}
      </div>
      {/* ✅ Load More Button */}
      <div className="load-more-container">
        <button className="load-more-btn" onClick={loadMoreMovies}>
          Load More
        </button>
      </div>
    </div>
  );
};

export default MovieRecommendations;
