import React from 'react';
import { Star, User } from 'lucide-react';
import { getAllMovies } from '../data/movies';
import './Reviews.css';

const Reviews = () => {
    const [movies, setMovies] = React.useState(() => getAllMovies());
    const recentReviews = JSON.parse(localStorage.getItem('reviews')) || [];

    const getMovie = (id) => movies.find(m => m.id === id);

    return (
        <div className="reviews-page container">
            <div className="reviews-header">
                <h1 className="section-title">Community Reviews</h1>
                <p className="reviews-subtitle">See what others are saying about the latest hits.</p>
            </div>

            <div className="reviews-feed">
                {recentReviews.map(review => {
                    const movie = getMovie(review.movieId);
                    return (
                        <div key={review.id} className="feed-card glass">
                            <div className="feed-card-header">
                                <div className="user-info">
                                    <div className="avatar">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <span className="username">{review.user}</span>
                                        <span className="review-date">{review.date}</span>
                                    </div>
                                </div>
                                <div className="review-rating">
                                    <Star size={16} fill="currentColor" className="text-accent" />
                                    <span>{review.rating}/5</span>
                                </div>
                            </div>

                            <div className="feed-content">
                                {movie && (
                                    <div className="reviewed-movie">
                                        <img src={movie.poster} alt={movie.title} className="tiny-poster" onError={(e) => e.target.style.display = 'none'} />
                                        <span className="movie-name">{movie.title}</span>
                                    </div>
                                )}
                                <p>"{review.content || review.comment}"</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Reviews;
