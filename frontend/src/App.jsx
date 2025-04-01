// App.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetails'
import AccountPage from './pages/AccountPage'
import AuthPage from './pages/AuthPage'

function App() {
  const token = localStorage.getItem('token');
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:movie_id" element={<MovieDetailPage />} />
          <Route path="/login" element={<AuthPage isSignup={false} />} />
          <Route path="/signup" element={<AuthPage isSignup={true} />} />
          <Route path="/account" element={token ? <AccountPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
  );
}

export default App;