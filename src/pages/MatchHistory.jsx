import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaSearch } from 'react-icons/fa';
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
    const searchLower = searchTerm.toLowerCase();

    const filtered = matches.filter(match =>
      match.teamA?.name?.toLowerCase().includes(searchLower) ||
      match.teamB?.name?.toLowerCase().includes(searchLower) ||
      match.venue?.toLowerCase().includes(searchLower) ||
      match.matchId?.toLowerCase().includes(searchLower)
    );

    setFilteredMatches(filtered);
  }, [searchTerm, matches]);

  const fetchMatches = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });

      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await axios.get(
        `https://overza-backend.onrender.com/api/matches?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const matchesData = Array.isArray(response.data.matches)
        ? response.data.matches
        : [];

      setMatches(matchesData);
      setFilteredMatches(matchesData);
      setTotalPages(response.data.pages || 1);

      setStats({
        total: response.data.total || matchesData.length,
        completed: matchesData.filter(m => m.status === 'completed').length,
        live: matchesData.filter(m => m.status === 'live').length,
        upcoming: matchesData.filter(m => m.status === 'upcoming').length
      });
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      setMatches([]);
      setFilteredMatches([]);
      setStats({ total: 0, completed: 0, live: 0, upcoming: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <FaHistory className="text-3xl text-cricket-green mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Match History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Past matches and statistics
              </p>
            </div>
          </div>

          {user && (
            <div className="text-right">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Scorer</p>
              <p className="font-semibold text-cricket-green">
                {user.username}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Live" value={stats.live} />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="Upcoming" value={stats.upcoming} />
        </div>

        {/* Search & Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by team, venue or match ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'live', 'completed'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg ${
                    filter === type
                      ? 'bg-cricket-green text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Match List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading matches..." />
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map(match => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <FaHistory className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No match history found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
    <div className="text-3xl font-bold text-cricket-green">{value}</div>
    <div className="text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

export default MatchHistory;
