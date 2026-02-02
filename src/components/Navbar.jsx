import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Menu, X, User, LogOut, Settings, Calendar, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllMovies } from '../data/movies';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const allMovies = getAllMovies();

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 0) {
            const filtered = allMovies.filter(m =>
                m.title.toLowerCase().includes(query.toLowerCase()) ||
                m.genre.toLowerCase().includes(query.toLowerCase()) ||
                m.director.toLowerCase().includes(query.toLowerCase()) ||
                m.cast.some(actor => actor.toLowerCase().includes(query.toLowerCase()))
            ).slice(0, 5); // Limit to 5 suggestions
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };


    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="navbar glass">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    <Film className="logo-icon" />
                    <span className="logo-text">Cine<span className="text-secondary">Review</span></span>
                </Link>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/reviews" className="nav-link">Reviews</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="nav-link text-accent" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                    )}
                    {/* Mobile Only Auth Links */}
                    <div className="mobile-auth-links">
                        {user ? (
                            <>
                                <span className="nav-link mobile-user">User: {user.username}</span>
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="nav-link logout-btn">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        )}
                    </div>
                </div>

                <div className="nav-actions">
                    <div className="search-bar-container">
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search movies, cast, genre..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearch}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                            />
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="search-suggestions glass">
                                {suggestions.map(movie => (
                                    <Link
                                        key={movie.id}
                                        to={`/movie/${movie.id}`}
                                        className="suggestion-item"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setShowSuggestions(false);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <img src={movie.poster} alt={movie.title} className="suggestion-poster" />
                                        <div className="suggestion-info">
                                            <span className="suggestion-title">{movie.title}</span>
                                            <div className="suggestion-meta">
                                                <span>{movie.year}</span>
                                                <span className="dot">•</span>
                                                <span className="suggestion-genre">{movie.genre.split(',')[0]}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {user ? (
                        <div className="user-profile">
                            <span className="user-name">{user.username}</span>
                            <button onClick={logout} className="nav-icon-btn" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-ghost login-btn">Login</Link>
                    )}

                    <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
