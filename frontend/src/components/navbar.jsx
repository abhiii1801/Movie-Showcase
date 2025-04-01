//navbar.jsx
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Form, Button, InputGroup } from 'react-bootstrap';
import { FaSearch, FaFilm, FaUserCircle } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavigationBar({ setMovies, setLoading, setError }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, settoken] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    settoken(storedToken);
    setIsLoggedIn(!!storedToken);
  }, []);
  
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem('token');
    alert('Logged Out');
    window.location.reload(); 
    navigate('/')
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setExpanded(false);

    axios.get(`http://localhost:5000/search_movie/${encodeURIComponent(query)}`)
      .then(response => {
        setMovies(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movie:', error);
        setLoading(false);
        setError(error);
      });
  };

  return (
    <Navbar 
      bg="black" 
      variant="dark" 
      expand="lg" 
      sticky="top" 
      expanded={expanded}
      onToggle={setExpanded}
      className="shadow-sm py-3"
      fixed='top'
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaFilm className="text-danger me-2" size={24} />
          <span className="fw-bold">Movie Showcase</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-search" />
        
        <Navbar.Collapse id="navbar-search">
          <Form 
            className="d-flex mx-auto my-2 my-lg-0" 
            style={{ maxWidth: '600px' }} 
            onSubmit={handleSearch}
          >
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search for movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0"
              />
              <Button 
                variant="danger" 
                type="submit" 
                className="d-flex align-items-center"
              >
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>
          
          <div className="d-flex align-items-center ms-lg-3 mt-3 mt-lg-0">
            {isLoggedIn ? (
                <>
                  <Button 
                    variant="outline-secondary" 
                    className="d-flex align-items-center"
                    as={Link} 
                    to="/account"
                  >
                    <FaUserCircle className="me-2" />
                    My Favorites
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    className="d-flex align-items-center ml-2"
                    as = {Link}
                    onClick={handleSignout}
                  >
                    <FaUserCircle className="me-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline-secondary" 
                    className="d-flex align-items-center"
                    as={Link} 
                    to="/login"
                  >
                    <FaUserCircle className="me-2" />
                    Login
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    className="d-flex align-items-center ml-2"
                    as={Link} 
                    to="/signup"
                  >
                    <FaUserCircle className="me-2" />
                    Signup
                  </Button>
                </>
              )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;