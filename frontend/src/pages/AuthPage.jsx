//authpage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';

function AuthPage({ isSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const url = isSignup ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';
      const response = await axios.post(url, { username, password });
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
        window.location.reload();
      } else {
        setError(response.data.message || 'An error occurred');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center bg-dark text-light" 
      style={{ minHeight: '100vh', width: '100%' }}
    >
      <Card className="bg-dark text-light border-danger" style={{ width: '400px' }}>
        <Card.Header className="bg-danger text-white text-center">
          <h3 className="mb-0">{isSignup ? 'Create Account' : 'Welcome Back'}</h3>
        </Card.Header>
        <Card.Body className="px-4 py-4">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="username">
              <Form.Label className="text-danger">Username</Form.Label>
              <Form.Control 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                className="bg-dark text-light border-danger"
                placeholder="Enter your username"
              />
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="password">
              <Form.Label className="text-danger">Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="bg-dark text-light border-danger"
                placeholder="Enter your password"
              />
            </Form.Group>
            
            <Button 
              variant="danger" 
              type="submit" 
              className="w-100 py-2 mt-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isSignup ? 'Creating Account...' : 'Logging In...'}
                </>
              ) : (
                isSignup ? 'Sign Up' : 'Login'
              )}
            </Button>
          </Form>
          
          <div className="mt-4 text-center">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <a href={isSignup ? '/login' : '/signup'} className="text-danger text-decoration-none">
                {isSignup ? 'Login here' : 'Sign up here'}
              </a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AuthPage;