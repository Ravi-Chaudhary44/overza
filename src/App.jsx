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
import AnimatedCircleImage from './components/common/AnimatedCircleImage';
import logo from './assets/images/og-image.png';
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  
  const LoadingScreen = () => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="relative">
        <AnimatedCircleImage
          src={logo}
          alt="OverZa Logo"
          size={150}
          borderWidth={4}
          colors={["#22c55e", "#b806d4"]}
          rotationDuration={3}
          showGlow={true}
          intensity={0.6}
          className="mb-8"
          imageClassName="p-3"
        />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-gray-800"></div>
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Over<span className="text-green-500">Za</span>
        </h1>
        <p className="text-gray-300 text-lg font-medium tracking-wider">
          CRICKET SCORER
        </p>
      </div>

      
      <div className="mt-10 flex space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>

    
      <div className="mt-8 w-48 md:w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-purple-600 rounded-full"
          style={{
            animation: 'loadingBar 2s ease-in-out forwards'
          }}
        ></div>
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }
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
