//homepage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { FaStar, FaCalendarAlt } from 'react-icons/fa';
import Sidebar from '../components/SideBar'
import NavigationBar from '../components/navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  useEffect(() => {
    setLoading(true);
    const endpoint = selectedGenre
      ? `http://localhost:5000/movies_by_genre/${selectedGenre.id}`
      : 'http://localhost:5000/popular_movies';

    axios.get(endpoint)
      .then(response => {
        const movieData = response.data;
        setMovies(movieData);
        
        if (movieData.length > 0) {
          const moviesWithBackdrop = movieData.filter(m => m.backdrop_path);
          if (moviesWithBackdrop.length > 0) {
            setFeaturedMovie(moviesWithBackdrop[0]);
          } else {
            setFeaturedMovie(movieData[0]);
          }
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setLoading(false);
        setError(error);
      });
  }, [selectedGenre]);

  const addToFavorites = async (movie) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/add_favorite', 
        { 
          movie_id: movie.id,
          movie_title: movie.title,
          movie_ratings: movie.vote_average,
          poster_url: movie.poster_path ? `${imageBaseUrl}${posterSize}${movie.poster_path}` : null
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert(error.response?.data?.message || 'Failed to add to favorites');
    }
  };


  const imageBaseUrl = "https://image.tmdb.org/t/p/";
  const backdropSize = "w1280";
  const posterSize = "w500";

  return (
    <div className="movie-app-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <NavigationBar setMovies={setMovies} setLoading={setLoading} setError={setError} />
      
      <div className="d-flex">
        <Sidebar setSelectedGenre={setSelectedGenre} activeGenre={selectedGenre} />
        
        <main className="flex-grow-1 ">
          {featuredMovie && !loading && (
            <div 
              className="position-relative mb-4" 
              style={{ 
                backgroundImage: featuredMovie.backdrop_path 
                  ? `url(${imageBaseUrl}${backdropSize}${featuredMovie.backdrop_path})`
                  : 'linear-gradient(to right, #434343 0%, #000000 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '500px'
              }}
            >
              <div className="position-absolute w-100 h-100" style={{ 
                background: 'linear-gradient(to bottom, rgba(18,18,18,0.4) 0%, rgba(18,18,18,0.8) 80%, rgba(18,18,18,1) 100%)' 
              }}></div>
              
              <Container className="position-relative h-100">
                <div className="row h-100 align-items-end">
                  <div className="col-md-8 text-white pb-5">
                    <h1 className="display-4 fw-bold">{featuredMovie.title}</h1>
                    <div className="d-flex align-items-center mb-3">
                      <span className="badge bg-warning text-dark me-2">
                        <FaStar className="me-1" />
                        {featuredMovie.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                      {featuredMovie.release_date && (
                        <span className="badge bg-secondary me-2">
                          <FaCalendarAlt className="me-1" />
                          {featuredMovie.release_date.substring(0, 4)}
                        </span>
                      )}
                      {featuredMovie.genre_ids && featuredMovie.genre_ids.slice(0, 2).map(genreId => {
                        const genre = selectedGenre?.id === genreId ? selectedGenre : null;
                        return genre ? (
                          <span key={genre.id} className="badge bg-primary me-2">{genre.name}</span>
                        ) : null;
                      })}
                    </div>
                    <p className="lead mb-4">
                      {featuredMovie.overview?.length > 250 
                        ? `${featuredMovie.overview.substring(0, 250)}...` 
                        : featuredMovie.overview}
                    </p>
                    <Button 
                      variant="danger" 
                      as={Link}
                      to={`/movie/${featuredMovie.id}`}
                      className="me-2"
                    >
                      View Details
                    </Button>
                    
                  </div>
                </div>
              </Container>
            </div>
          )}

          <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-white mb-0">
                {selectedGenre ? `${selectedGenre.name} Movies` : 'Popular Movies'}
              </h2>
            </div>

            {loading ? (
              <div className="text-center my-5 py-5">
                <Spinner animation="border" variant="danger" size="lg" />
                <p className="text-white mt-3">Loading movies...</p>
              </div>
            ) : error ? (
              <div className="text-center my-5 py-5">
                <div className="alert alert-danger">
                  Error fetching movies: {error.message}
                </div>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center my-5 py-5">
                <div className="alert alert-warning">
                  No movies found. Try another category or search.
                </div>
              </div>
            ) : (
              <Row className="g-4">
                {movies.map(movie => (
                  <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                    <Card className="movie-card h-100 bg-dark text-white border-0 shadow">
                      <div className="position-relative overflow-hidden" style={{ height: '380px' }}>
                        {movie.poster_path ? (
                          <Card.Img 
                            variant="top" 
                            src={`${imageBaseUrl}${posterSize}${movie.poster_path}`} 
                            alt={movie.title}
                            className="h-100 w-100"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="h-100 w-100 d-flex align-items-center justify-content-center bg-secondary">
                            No Poster Available
                          </div>
                        )}
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-warning text-dark">
                            <FaStar className="me-1" />
                            {movie.vote_average?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="text-truncate">{movie.title}</Card.Title>
                        <Card.Text className="text-muted">
                          {movie.release_date?.substring(0, 4) || 'N/A'}
                        </Card.Text>
                        <Button 
                          variant="outline-danger" 
                          className=""
                          as={Link}
                          to={`/movie/${movie.id}`}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          className="mt-2"
                          onClick={() => addToFavorites(movie)}
                        >
                          Add to Favorites 🤍 
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </main>
      </div>
    </div>
  );
}

export default HomePage;