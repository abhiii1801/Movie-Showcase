//sidebar.jsx
import React, { useState, useEffect } from 'react';
import { ListGroup, Badge, Spinner, Button } from 'react-bootstrap';
import { FaFilm, FaFire, FaStar, FaCalendarAlt, FaTheaterMasks } from 'react-icons/fa';
import axios from 'axios';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar({ setSelectedGenre, activeGenre }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/genres')
      .then((response) => {
        if (response.data && response.data.genres) {
          setGenres(response.data.genres);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching genres:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleGenreClick = (genre) => setSelectedGenre(genre);

  const getCategoryIcon = (name) => {
    if (!name) return <FaFire />;
    const lowerName = name.toLowerCase();
    if (lowerName.includes('action')) return <FaFilm />;
    if (lowerName.includes('comedy')) return <FaTheaterMasks />;
    return <FaFilm />;
  };

  return (
    <aside className="bg-dark text-white " style={{ width: '280px', minHeight: '100vh', padding: '20px' }}>
      <h5 className="mb-4 text-danger text-uppercase">Explore Genres</h5>
      {loading ? (
        <Spinner animation="border" variant="danger" />
      ) : error ? (
        <p>Error loading genres</p>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Button
              key={genre.id}
              variant={activeGenre?.id === genre.id ? 'danger' : 'outline-light'}
              onClick={() => handleGenreClick(genre)}
              className="d-flex align-items-center gap-2 px-3 py-2"
            >
              {getCategoryIcon(genre.name)}
              {genre.name}
            </Button>
          ))}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
