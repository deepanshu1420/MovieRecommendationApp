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
  const [page, setPage] = useState(1);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/genre/movie/list',
          { params: { api_key: '0fa2853e7c4d6c8f146aba861c5e4a06' } }
        );
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch movies (discover or search)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const endpoint = searchQuery
          ? 'https://api.themoviedb.org/3/search/movie'
          : 'https://api.themoviedb.org/3/discover/movie';

        const response = await axios.get(endpoint, {
          params: {
            api_key: '0fa2853e7c4d6c8f146aba861c5e4a06',
            query: searchQuery || undefined,
            sort_by: searchQuery ? undefined : sortBy,
            with_genres: searchQuery ? undefined : selectedGenre,
            page,
            region: searchQuery ? undefined : 'IN',
            with_original_language: searchQuery ? undefined : 'hi',
          },
        });

        if (page === 1) setMovies(response.data.results);
        else setMovies((prev) => [...prev, ...response.data.results]);
      } catch (err) {
        console.error('Error fetching movies:', err);
      }
    };

    fetchMovies();
  }, [searchQuery, sortBy, selectedGenre, page]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const handleGenreChange = (e) => setSelectedGenre(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset pagination on new search
  };

  const toggleDescription = (id) =>
    setExpandedMovieId(expandedMovieId === id ? null : id);

  const loadMoreMovies = () => setPage((prev) => prev + 1);

  return (
    <div>
      <h1>MovieHouse</h1>

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <AiOutlineSearch />
        </button>
      </form>

      {/* Filters */}
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
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Movie Grid */}
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
            <p>
              {expandedMovieId === movie.id
                ? movie.overview
                : `${movie.overview?.substring(0, 150)}...`}
            </p>
            <button
              className="read-more"
              onClick={() => toggleDescription(movie.id)}
            >
              {expandedMovieId === movie.id ? 'Show Less' : 'Read More'}
            </button>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="load-more-container">
        <button className="load-more-btn" onClick={loadMoreMovies}>
          Load More
        </button>
      </div>
    </div>
  );
};

export default MovieRecommendations;
