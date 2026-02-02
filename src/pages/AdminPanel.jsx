import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getAllMovies } from '../data/movies';
import { Plus, Trash2, Film, Star, Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import './Admin.css';

const AdminPanel = () => {
    const { user } = useAuth();
    const [movies, setMovies] = useState(() => getAllMovies());
    const [newMovie, setNewMovie] = useState({
        title: '', year: '', rating: '', runtime: '', genre: '',
        director: '', cast: '', synopsis: '', poster: '', backdrop: '', trailer: ''
    });
    const [editingId, setEditingId] = useState(null);

    if (user?.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const castArray = Array.isArray(newMovie.cast)
            ? newMovie.cast
            : newMovie.cast.split(',').map(s => s.trim());

        if (editingId) {
            const updatedMovies = movies.map(m =>
                m.id === editingId ? { ...newMovie, id: editingId, cast: castArray, rating: parseFloat(newMovie.rating) } : m
            );
            setMovies(updatedMovies);
            localStorage.setItem('movies', JSON.stringify(updatedMovies));
            setEditingId(null);
            alert('Movie updated successfully!');
        } else {
            const id = movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1;
            const movieToAdd = {
                ...newMovie,
                id,
                cast: castArray,
                rating: parseFloat(newMovie.rating)
            };
            const updatedMovies = [movieToAdd, ...movies];
            setMovies(updatedMovies);
            localStorage.setItem('movies', JSON.stringify(updatedMovies));
            alert('Movie added successfully!');
        }

        setNewMovie({
            title: '', year: '', rating: '', runtime: '', genre: '',
            director: '', cast: '', synopsis: '', poster: '', backdrop: '', trailer: ''
        });
    };

    const handleEditClick = (movie) => {
        setEditingId(movie.id);
        setNewMovie({
            ...movie,
            cast: movie.cast.join(', ')
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewMovie({
            title: '', year: '', rating: '', runtime: '', genre: '',
            director: '', cast: '', synopsis: '', poster: '', backdrop: '', trailer: ''
        });
    };

    const handleDeleteMovie = (id) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            const updatedMovies = movies.filter(m => m.id !== id);
            setMovies(updatedMovies);
            localStorage.setItem('movies', JSON.stringify(updatedMovies));
        }
    };

    const handleResetMovies = () => {
        if (window.confirm('This will delete all movies and restore the default Tamil collection. Proceed?')) {
            localStorage.removeItem('movies');
            const data = getAllMovies();
            setMovies(data);
            window.location.reload();
        }
    };

    return (
        <div className="admin-page container">
            <div className="admin-header">
                <h1 className="section-title">Admin Management</h1>
                <button onClick={handleResetMovies} className="btn btn-ghost reset-btn">Reset All Movies</button>
            </div>

            <div className="admin-grid">
                {/* Movie Form */}
                <div className={`admin-card glass ${editingId ? 'edit-mode' : ''}`}>
                    <h3>
                        {editingId ? <ImageIcon size={20} /> : <Plus size={20} />}
                        {editingId ? ' Edit Movie Details' : ' Add New Tamil Movie'}
                    </h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-row">
                            <input type="text" placeholder="Movie Title" value={newMovie.title} onChange={e => setNewMovie({ ...newMovie, title: e.target.value })} required />
                            <input type="text" placeholder="Year" value={newMovie.year} onChange={e => setNewMovie({ ...newMovie, year: e.target.value })} required />
                        </div>
                        <div className="form-row">
                            <input type="number" step="0.1" placeholder="Rating (e.g. 8.5)" value={newMovie.rating} onChange={e => setNewMovie({ ...newMovie, rating: e.target.value })} required />
                            <input type="text" placeholder="Runtime (e.g. 2h 45m)" value={newMovie.runtime} onChange={e => setNewMovie({ ...newMovie, runtime: e.target.value })} required />
                        </div>
                        <input type="text" placeholder="Genre (e.g. Action, Drama)" value={newMovie.genre} onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })} required />
                        <input type="text" placeholder="Director" value={newMovie.director} onChange={e => setNewMovie({ ...newMovie, director: e.target.value })} required />
                        <input type="text" placeholder="Cast (comma separated)" value={newMovie.cast} onChange={e => setNewMovie({ ...newMovie, cast: e.target.value })} required />
                        <textarea placeholder="Synopsis" value={newMovie.synopsis} onChange={e => setNewMovie({ ...newMovie, synopsis: e.target.value })} required />
                        <input type="url" placeholder="Poster URL" value={newMovie.poster} onChange={e => setNewMovie({ ...newMovie, poster: e.target.value })} required />
                        <input type="url" placeholder="Backdrop URL" value={newMovie.backdrop} onChange={e => setNewMovie({ ...newMovie, backdrop: e.target.value })} required />
                        <input type="url" placeholder="Trailer URL" value={newMovie.trailer} onChange={e => setNewMovie({ ...newMovie, trailer: e.target.value })} />
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update Movie' : 'Add Movie'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="btn btn-ghost">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Movie List Management */}
                <div className="admin-card glass">
                    <h3><Film size={20} /> Manage Existing Movies</h3>
                    <div className="admin-movie-list">
                        {movies.map(movie => (
                            <div key={movie.id} className="admin-movie-item">
                                <img src={movie.poster} alt={movie.title} className="small-poster" />
                                <div className="admin-movie-info">
                                    <h4>{movie.title}</h4>
                                    <p>{movie.year} • {movie.rating} <Star size={12} fill="currentColor" /></p>
                                </div>
                                <div className="admin-item-actions">
                                    <button onClick={() => handleEditClick(movie)} className="edit-btn" title="Edit Movie">
                                        <Plus size={18} style={{ transform: 'rotate(45deg)' }} /> {/* Using Plus rotated as a generic edit feel, or just text */}
                                    </button>
                                    <button onClick={() => handleDeleteMovie(movie.id)} className="delete-btn" title="Delete Movie">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
