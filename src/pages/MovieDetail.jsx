import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllMovies } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { Star, Clock, Calendar, MessageSquare, Play } from 'lucide-react';
import './MovieDetail.css';

const MovieDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const storedMovies = getAllMovies();
    const movie = storedMovies.find(m => m.id === parseInt(id));

    const [reviews, setReviews] = useState(() => {
        const allReviews = JSON.parse(localStorage.getItem('reviews')) || [];
        return allReviews.filter(r => r.movieId === parseInt(id));
    });
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    if (!movie) return <div className="container" style={{ paddingTop: '100px' }}>Movie not found</div>;

    const handleSubmitReview = (e) => {
        e.preventDefault();
        const review = {
            id: Date.now(),
            user: user?.username || "Guest User",
            movieId: parseInt(id),
            rating: newReview.rating,
            comment: newReview.comment,
            date: "Just now"
        };

        // Save to global reviews list
        const allReviews = JSON.parse(localStorage.getItem('reviews')) || [];
        const updatedAllReviews = [review, ...allReviews];
        localStorage.setItem('reviews', JSON.stringify(updatedAllReviews));

        // Update local state
        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
    };

    return (
        <div className="movie-detail-page">
            <div
                className="detail-hero"
                style={{
                    backgroundImage: `url(${movie.backdrop})`,
                    backgroundColor: '#0a0a0a' // Fallback color
                }}
            >
                <div className="detail-overlay"></div>
                <div className="container detail-content">
                    <div className="detail-poster-wrapper">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="detail-poster"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/500x750?text=No+Poster";
                            }}
                        />
                    </div>
                    <div className="detail-info">
                        <h1 className="detail-title">{movie.title}</h1>
                        <div className="detail-meta">
                            <span className="meta-item"><Calendar size={16} /> {movie.year}</span>
                            <span className="meta-item"><Star size={16} className="text-accent" fill="currentColor" /> {movie.rating}</span>
                            <span className="meta-item"><Clock size={16} /> {movie.runtime || 'N/A'}</span>
                            <span className="meta-item"><MessageSquare size={16} /> {reviews.length} Reviews</span>
                            <span className="meta-item badge">{movie.genre || 'Genre'}</span>
                        </div>
                        <div className="detail-meta-secondary">
                            <p><strong>Director:</strong> {movie.director || 'Unknown'}</p>
                            {movie.trailer && (
                                <button className="btn btn-primary trailer-btn" onClick={() => window.open(movie.trailer, '_blank')}>
                                    <Play size={18} fill="currentColor" /> Watch Trailer
                                </button>
                            )}
                        </div>


                        <div className="detail-section">
                            <h3>Synopsis</h3>
                            <p>{movie.synopsis}</p>
                        </div>

                        <div className="detail-section">
                            <h3>Cast</h3>
                            <div className="cast-list">
                                {movie.cast.map((actor, index) => (
                                    <span key={index} className="cast-badge">{actor}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container reviews-section">
                <h2 className="section-title">Reviews</h2>

                <div className="reviews-container">
                    <div className="review-form glass">
                        <h3>Write a Review</h3>
                        <form onSubmit={handleSubmitReview}>
                            <div className="form-group">
                                <label>Rating</label>
                                <div className="star-rating-input">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`star-btn ${newReview.rating >= star ? 'active' : ''}`}
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                        >
                                            <Star fill={newReview.rating >= star ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    placeholder="Share your thoughts..."
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Review</button>
                        </form>
                    </div>

                    <div className="reviews-list">
                        {reviews.map(review => (
                            <div key={review.id} className="review-card glass">
                                <div className="review-header">
                                    <span className="review-user">{review.user}</span>
                                    <div className="review-rating">
                                        <Star size={14} fill="currentColor" className="text-accent" />
                                        <span>{review.rating}</span>
                                    </div>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MovieDetail;
