import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaTrophy, FaCalendar, FaFilter, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/common/LoadingSpinner'; 
import MatchCard from '../components/match/MatchCard';

const MatchHistory = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    live: 0,
    upcoming: 0
  });

  useEffect(() => {
    fetchMatches();
  }, [page, filter]);

  useEffect(() => {
  
    const filtered = matches.filter(match => {
      const searchLower = searchTerm.toLowerCase();
      return (
        match.teamA.name.toLowerCase().includes(searchLower) ||
        match.teamB.name.toLowerCase().includes(searchLower) ||
        match.venue?.toLowerCase().includes(searchLower) ||
        match.matchId.toLowerCase().includes(searchLower)
      );
    });
    setFilteredMatches(filtered);
  }, [searchTerm, matches]);

const fetchMatches = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '12',
      status: filter === 'all' ? '' : filter
    });

    console.log('Fetching matches with params:', params.toString());
    
    const response = await axios.get(`/api/matches?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000 
    });

    console.log('Full response:', response);
    console.log('Response data:', response.data);
    console.log('Response status:', response.status);
    
   
    if (!response.data) {
      throw new Error('Empty response from server');
    }
    
  
    if (response.data.success === false) {
      throw new Error(response.data.message || 'Request failed');
    }
    
    
    const matchesArray = Array.isArray(response.data.matches) 
      ? response.data.matches 
      : [];
    
    setMatches(matchesArray);
    setTotalPages(response.data.pages || 1);
    
    if (response.data.stats && typeof response.data.stats === 'object') {
      setStats(response.data.stats);
    } else {
   
      setStats({
        total: response.data.total || 0,
        completed: matchesArray.filter(m => m.status === 'completed').length,
        live: matchesArray.filter(m => m.status === 'live').length,
        upcoming: matchesArray.filter(m => m.status === 'upcoming').length
      });
    }
     
  } catch (error) {
    console.error('Failed to fetch matches:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config?.url
    });
    
    setMatches([]);
    setStats({ total: 0, completed: 0, live: 0, upcoming: 0 });
    
   
  } finally {
    setLoading(false);
  }
};;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-3 bg-cricket-green/10 rounded-xl mr-4">
                <FaHistory className="text-3xl text-cricket-green" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Match History</h1>
                <p className="text-gray-600 dark:text-gray-400">Past matches and statistics</p>
              </div>
            </div>
            
            {user && (
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400">Scorer</p>
                <p className="text-lg font-semibold text-cricket-green">{user.username}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-cricket-green mb-2">{stats.total}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Matches</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">{stats.live}</div>
            <div className="text-gray-600 dark:text-gray-400">Live Now</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">{stats.completed}</div>
            <div className="text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.upcoming}</div>
            <div className="text-gray-600 dark:text-gray-400">Upcoming</div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by team name, venue, or match ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cricket-green focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all'
                    ? 'bg-cricket-green text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('live')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'live'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Live
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'completed'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </motion.div>

        {/* Matches Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading matches..." />
          </div>
        ) : filteredMatches.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {filteredMatches.map((match, index) => (
                <MatchCard key={match._id} match={match} />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
          >
            <FaHistory className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {searchTerm ? 'No matches found' : 'No Match History'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search terms or filters'
                : 'Start scoring matches to build your history!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};


export default MatchHistory;



