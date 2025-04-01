//moviedetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from '../components/navbar';

const MovieDetailPage = () => {
  const { movie_id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/movie_details/${movie_id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch movie data (Status: ${response.status})`);
        }
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setError(error.message || 'Failed to load movie data');
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movie_id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-dark text-light" style={{ height: "100vh" }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="bg-dark text-light min-vh-100 p-5">
        <NavigationBar />
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Error!</h4>
            <p>{error || 'Failed to load movie data'}</p>
            <hr />
            <p className="mb-0">Please try again later or check if the movie ID is correct.</p>
          </div>
        </div>
      </div>
    );
  }

  const imageBaseUrl = "https://image.tmdb.org/t/p/";
  const backdropSize = "w1280";
  const posterSize = "w500";
  const profileSize = "w185";

  // Helper function to handle missing data
  const displayValue = (value, suffix = '') => {
    if (value === undefined || value === null || value === '') {
      return 'N/A';
    }
    return `${value}${suffix}`;
  };

  return (
    <div className="container-fluid px-0 bg-dark text-light">
      <NavigationBar />
      {/* Header with backdrop */}
      <div 
        className="position-relative mb-4" 
        style={{ 
          backgroundImage: movie.backdrop_path ? `url(${imageBaseUrl}${backdropSize}${movie.backdrop_path})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          backgroundColor: movie.backdrop_path ? 'transparent' : '#222'
        }}
      >
        <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}></div>
        <div className="container position-relative h-100">
          <div className="row h-100 align-items-center">
            <div className="col-md-4 text-center">
              {movie.poster_path ? (
                <img 
                  src={`${imageBaseUrl}${posterSize}${movie.poster_path}`} 
                  alt={movie.title} 
                  className="img-fluid rounded shadow" 
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <div className="bg-secondary rounded shadow d-flex justify-content-center align-items-center" 
                     style={{ height: '400px', width: '100%' }}>
                  <p className="text-light">No Poster Available</p>
                </div>
              )}
            </div>
            <div className="col-md-8 text-light">
              <h1>{displayValue(movie.title)} <span className="text-muted fs-4 text-light-50">
                {movie.release_date ? `(${new Date(movie.release_date).getFullYear()})` : ''}
              </span></h1>
              <div className="mb-3">
                <span className="badge bg-danger me-2">{movie.vote_average ? `${movie.vote_average}/10` : 'No Rating'}</span>
                {movie.genres && movie.genres.length > 0 ? (
                  movie.genres.map(genre => (
                    <span key={genre.id} className="badge bg-danger me-2">{genre.name}</span>
                  ))
                ) : (
                  <span className="badge bg-secondary me-2">No Genres</span>
                )}
                <span className="badge bg-danger">{displayValue(movie.runtime, ' min')}</span>
              </div>
              <p className="fs-5 fst-italic">{displayValue(movie.tagline)}</p>
              <p className="fs-6">{displayValue(movie.overview)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="container mb-4">
        <ul className="nav nav-tabs border-danger">
          <li className="nav-item">
            <button 
              className={`nav-link border-0 ${activeTab === 'overview' ? 'active bg-danger text-white' : 'text-danger'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link border-0 ${activeTab === 'cast' ? 'active bg-danger text-white' : 'text-danger'}`}
              onClick={() => setActiveTab('cast')}
            >
              Cast
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link border-0 ${activeTab === 'photos' ? 'active bg-danger text-white' : 'text-danger'}`}
              onClick={() => setActiveTab('photos')}
            >
              Photos
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link border-0 ${activeTab === 'videos' ? 'active bg-danger text-white' : 'text-danger'}`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
          </li>
        </ul>
      </div>

      {/* Content based on active tab */}
      <div className="container">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="row">
            <div className="col-md-8">
              <h3 className="text-danger">Synopsis</h3>
              <p>{displayValue(movie.overview)}</p>
              
              <h3 className="mt-4 text-danger">Details</h3>
              <div className="row">
                <div className="col-md-6">
                  <p><strong className="text-danger">Original Title:</strong> {displayValue(movie.original_title)}</p>
                  <p><strong className="text-danger">Status:</strong> {displayValue(movie.status)}</p>
                  <p><strong className="text-danger">Release Date:</strong> {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong className="text-danger">Original Language:</strong> {movie.original_language ? movie.original_language.toUpperCase() : 'N/A'}</p>
                  <p><strong className="text-danger">Budget:</strong> {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</p>
                  <p><strong className="text-danger">Revenue:</strong> {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <h3 className="text-danger">Production Companies</h3>
              {movie.production_companies && movie.production_companies.length > 0 ? (
                <div className="d-flex flex-wrap gap-3 mt-3">
                  {movie.production_companies.map(company => (
                    <div key={company.id} className="text-center">
                      {company.logo_path ? (
                        <img 
                          src={`${imageBaseUrl}w92${company.logo_path}`} 
                          alt={company.name} 
                          className="img-fluid mb-2 bg-white p-1 rounded" 
                          style={{ maxHeight: '50px', maxWidth: '100px' }}
                        />
                      ) : (
                        <div className="border border-danger rounded p-2 mb-2">{company.name}</div>
                      )}
                      <p className="small">{company.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No production companies information available</p>
              )}
            </div>
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === 'cast' && (
          <div>
            <h3 className="mb-4 text-danger">Cast</h3>
            {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 ? (
              <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4">
                {movie.credits.cast.map(person => (
                  <div key={person.id} className="col">
                    <div className="card h-100 bg-dark text-light border-danger">
                      <img 
                        src={person.profile_path ? `${imageBaseUrl}${profileSize}${person.profile_path}` : '/api/placeholder/185/278'} 
                        className="card-img-top" 
                        alt={person.name}
                        style={{ height: '278px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h6 className="card-title">{person.name}</h6>
                        <p className="card-text small text-muted">{displayValue(person.character)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-secondary">No cast information available</div>
            )}
          </div>
        )}

        {/* Photos Tab - Grid Layout Instead of Carousel */}
        {activeTab === 'photos' && (
          <div>
            <h3 className="mb-4 text-danger">Photos</h3>
            {movie.images && movie.images.backdrops && movie.images.backdrops.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {movie.images.backdrops.map((image, index) => (
                  <div key={index} className="col">
                    <div className="card bg-dark border-danger">
                      <img
                        className="card-img-top"
                        src={`${imageBaseUrl}${backdropSize}${image.file_path}`}
                        alt={`Backdrop ${index + 1}`}
                      />
                      <div className="card-footer bg-dark text-center">
                        <small className="text-light">Image {index + 1}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-secondary">No photos available</div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div>
            <h3 className="mb-4 text-danger">Videos & Trailers</h3>
            {movie.videos && movie.videos.results && movie.videos.results.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {movie.videos.results.map(video => (
                  <div key={video.id} className="col">
                    <div className="card h-100 bg-dark text-light border-danger">
                      <div className="ratio ratio-16x9">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.key}`}
                          title={video.name}
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{displayValue(video.name)}</h5>
                        <p className="card-text">
                          <span className="badge bg-danger me-2">{displayValue(video.type)}</span>
                          <small className="text-muted">
                            {video.published_at 
                              ? `Published: ${new Date(video.published_at).toLocaleDateString()}` 
                              : 'No publish date'}
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-secondary">No videos available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;