import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/movie/${movie.id}`} className="movie-card">
            <div className="movie-poster-wrapper">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="movie-poster"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/500x750?text=No+Poster";
                    }}
                />
                <div className="movie-overlay">
                    <button className="btn btn-primary">View Details</button>
                </div>
            </div>
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-meta">
                    <span className="movie-year">{movie.year}</span>
                    <div className="movie-rating">
                        <Star size={14} className="star-icon" fill="currentColor" />
                        <span>{movie.rating}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
