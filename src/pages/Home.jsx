import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { getAllMovies } from '../data/movies';
import './Home.css';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
    const [movies, setMovies] = React.useState(() => getAllMovies());
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const navigate = useNavigate();

    const filteredMovies = searchQuery
        ? movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : movies;

    const [currentMovieIndex, setCurrentMovieIndex] = React.useState(0);
    // Prioritize visually stunning movies or top rated ones
    const featuredMovies = React.useMemo(() => {
        if (movies.length === 0) return [];
        return movies.filter(m => m.rating >= 8.5); // Filter for highly rated movies
    }, [movies]);

    // Safety check: if hero index is out of bounds, reset to 0
    const safeHeroIndex = currentMovieIndex >= featuredMovies.length ? 0 : currentMovieIndex;
    const featuredMovie = featuredMovies[safeHeroIndex];

    React.useEffect(() => {
        if (searchQuery || featuredMovies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [searchQuery, featuredMovies.length]);

    const handleWatchTrailer = () => {
        if (featuredMovie?.trailer) {
            window.open(featuredMovie.trailer, '_blank');
        } else {
            alert('Trailer not available for this movie yet!');
        }
    };

    // Remove the Loading movies div

    return (
        <div className="home-page">
            {/* Hero Section - Only show when not searching and movie exists */}
            {!searchQuery && featuredMovie && (
                <section
                    className="hero"
                    style={{
                        backgroundImage: `url(${featuredMovie.backdrop})`,
                        backgroundColor: '#0a0a0a' // Fallback color
                    }}
                >
                    <div className="hero-overlay"></div>
                    <div className="container hero-content" key={featuredMovie.id}>
                        <span className="featured-badge">Featured Movie</span>
                        <h1 className="hero-title">{featuredMovie.title}</h1>
                        <p className="hero-synopsis">{featuredMovie.synopsis}</p>
                        <div className="hero-actions">
                            <button className="btn btn-primary" onClick={handleWatchTrailer}>
                                <Play size={20} fill="currentColor" /> Watch Trailer
                            </button>
                            <button className="btn btn-ghost" onClick={() => navigate(`/movie/${featuredMovie.id}`)}>More Details</button>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content */}
            <section className="container section-movies">
                <h2 className="section-title">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Now'}
                </h2>
                {filteredMovies.length > 0 ? (
                    <div className="movies-grid">
                        {filteredMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No movies found matching your search.</p>
                        <button className="btn btn-ghost" onClick={() => window.location.href = '/'}>Clear Search</button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
