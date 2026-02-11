import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaTrophy, 
  FaEdit, 
  FaSave,
  FaTimes,
  FaBaseballBall,
  FaHistory,
  FaChartLine
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useMatch } from '../context/MatchContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const { getLiveMatches } = useMatch();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    phone: '',
  });
  const [stats, setStats] = useState({
    totalMatches: 0,
    liveMatches: 0,
    completedMatches: 0,
    totalRunsScored: 0,
    totalWickets: 0,
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchStats();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.user);
      setEditForm({
        username: response.data.user.username,
        email: response.data.user.email,
        phone: response.data.user.phone || '',
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/matches/scorer-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
      setRecentMatches(response.data.recentMatches || []);
    } catch (error) {
     
      setStats({
        totalMatches: 12,
        liveMatches: 1,
        completedMatches: 11,
        totalRunsScored: 2456,
        totalWickets: 89,
      });
      setRecentMatches([]);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      
      setEditForm({
        username: profile.username,
        email: profile.email,
        phone: profile.phone || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!editForm.username.trim() || !editForm.email.trim()) {
      toast.error('Username and email are required');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/update-profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
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
                <FaUser className="text-3xl text-cricket-green" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Profile</h1>

              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/history')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <FaHistory className="inline mr-2" /> History
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-cricket-green/10 rounded-full flex items-center justify-center mr-4">
                    <FaUser className="text-3xl text-cricket-green" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile?.username}
                    </h2>
                    
                  </div>
                </div>
                <button
                  onClick={handleEditToggle}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center ${
                    isEditing 
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                      : 'bg-cricket-green hover:bg-cricket-darkGreen text-white'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <FaTimes className="mr-2" /> Cancel
                    </>
                  ) : (
                    <>
                      <FaEdit className="mr-2" /> Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <FaEnvelope className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 dark:text-white">{profile?.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <FaPhone className="text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        placeholder="+91 9876******"
                        className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {profile?.phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatDate(profile?.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Save Button (when editing) */}
                {isEditing && (
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSaveProfile}
                      disabled={updating}
                      className="w-full bg-cricket-green hover:bg-cricket-darkGreen text-white py-3 rounded-lg font-semibold flex items-center justify-center"
                    >
                      {updating ? (
                        <>
                          <div className="inline-block">
  <LoadingSpinner size="sm" color="white" showText={false} />
</div>
                          <span className="ml-2">Saving...</span>
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            Recent Matches
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FaHistory className="mr-3 text-cricket-green" /> Recent Matches
              </h3>
              
              {recentMatches.length > 0 ? (
                <div className="space-y-4">
                  {recentMatches.slice(0, 5).map((match) => (
                    <div
                      key={match._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {match.teamA.name} vs {match.teamB.name}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <FaCalendarAlt className="mr-2" />
                          {formatDate(match.startTime)}
                          <span className="mx-2">•</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            match.status === 'live' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          }`}>
                            {match.status === 'live' ? 'LIVE' : 'COMPLETED'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/live/${match.matchId}`)}
                        className="px-3 py-1 bg-cricket-green hover:bg-cricket-darkGreen text-white rounded-lg text-sm"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBaseballBall className="text-4xl text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No matches scored yet</p>
                  <button
                    onClick={() => navigate('/scorer')}
                    className="mt-4 px-4 py-2 bg-cricket-green hover:bg-cricket-darkGreen text-white rounded-lg"
                  >
                    Start Your First Match
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-8">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
            >
              
              
              
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/scorer')}
                  className="w-full text-left p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-cricket-green rounded-lg mr-3">
                      <FaBaseballBall className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Start New Match</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Begin scoring a new match</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/live')}
                  className="w-full text-left p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500 rounded-lg mr-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Watch Live Matches</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">View ongoing matches</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/history')}
                  className="w-full text-left p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-500 rounded-lg mr-3">
                      <FaHistory className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Match History</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">View past matches</p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Scorer ID</h4>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <code className="font-mono text-cricket-green">{profile?._id}</code>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Account Type</h4>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <span className={`px-3 py-1 rounded-full ${
                  profile?.isAdmin 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                  {profile?.isAdmin ? 'Administrator' : 'Standard Scorer'}
                </span>
              </div>
            </div>
          </div>
          
          
        </motion.div>
      </div>
    </div>
  );
};


export default Profile;
