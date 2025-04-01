//accountpage.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import NavigationBar from '../components/navbar';

function AccountPage() {
  const [user, setUser] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const userResponse = await axios.get('http://localhost:5000/get_account', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const favoritesResponse = await axios.get('http://localhost:5000/get_favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(userResponse.data);
        setFavorites(favoritesResponse.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRemoveFavorite = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/favorites/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(favorites.filter(movie => movie.movie_id !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove from favorites');
    }
  };

  const imageBaseUrl = "https://image.tmdb.org/t/p/";
  const posterSize = "w342";

  return (
    <div className="bg-dark text-light min-vh-100">
      <NavigationBar />
      <div className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-2">Loading your profile...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <div className="mb-5 border-bottom border-danger pb-4">
              <h2 className="text-danger">Welcome, {user.username || 'User'}</h2>
            </div>

            <div className="mb-4">
              <h3 className="text-danger mb-4">Your Favorites</h3>
              {favorites.length === 0 ? (
                <div className="text-center py-5 bg-dark border border-danger rounded">
                  <p className="mb-3">You haven't added any favorites yet!</p>
                  <Button variant="danger" href="/">Browse Movies</Button>
                </div>
              ) : (
                <Row xs={1} md={2} lg={4} className="g-4">
                  {favorites.map(movie => (
                    <Col key={movie.movie_id}>
                      <Card className="h-100 bg-dark text-light border-danger movie-card">
                        <div className="position-relative">
                          <Card.Img 
                            variant="top" 
                            src={movie.poster_path ? `${imageBaseUrl}${posterSize}${movie.poster_path}` : '/api/placeholder/342/513'}
                            alt={movie.title}
                            className="movie-poster"
                            style={{ objectFit: "cover" }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-danger">{movie.vote_average || 'N/A'}</span>
                          </div>
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="text-truncate">{movie.title}</Card.Title>
                          <div className="mt-auto">
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              className="w-100"
                              onClick={() => handleRemoveFavorite(movie.movie_id)}
                            >
                              Remove from Favorites
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AccountPage;
