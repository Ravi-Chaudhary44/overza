import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { MatchProvider } from './context/MatchContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import LiveMatchViewer from './pages/LiveMatchViewer';
import ScorerPanel from './pages/ScorerPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import MatchHistory from './pages/MatchHistory';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import './styles/App.css';
import './styles/tailwind.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <SocketProvider>
          <AuthProvider>
            <MatchProvider>
              <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                <Navbar />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/live/:matchId" element={<LiveMatchViewer />} />
                    <Route path="/live" element={<LiveMatchViewer />} />
                    <Route path="/scorer" element={<ScorerPanel />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/history" element={<MatchHistory />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#1f2937',
                      color: '#fff',
                    },
                    success: {
                      style: {
                        background: '#22c55e',
                      },
                    },
                    error: {
                      style: {
                        background: '#ef4444',
                      },
                    },
                  }}
                />
              </div>
            </MatchProvider>
          </AuthProvider>
        </SocketProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;