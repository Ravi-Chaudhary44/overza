import React from 'react';
import { FaCalendar, FaMapMarkerAlt, FaTrophy, FaUsers, FaClock, FaBaseballBall } from 'react-icons/fa';

const MatchInfo = ({ match }) => {
  if (!match) return null;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getDuration = () => {
    if (!match.startTime) return 'Not started';
    
    const start = new Date(match.startTime);
    const now = new Date();
    const diffMs = now - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
  };
  
  const getMatchTypeLabel = () => {
    switch (match.matchType) {
      case 'limited': return `Limited Overs (${match.totalOvers} overs)`;
      case 'test': return 'Test Match';
      case 'friendly': return 'Friendly Match';
      case 't20': return 'T20 Match';
      case 'odi': return 'ODI Match';
      default: return match.matchType;
    }
  };
  
  const infoItems = [
    {
      icon: FaCalendar,
      label: 'Started',
      value: formatDate(match.startTime)
    },
    {
      icon: FaClock,
      label: 'Duration',
      value: getDuration()
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Venue',
      value: match.venue || 'Local Ground'
    },
    {
      icon: FaBaseballBall,
      label: 'Match Type',
      value: getMatchTypeLabel()
    },
    {
      icon: FaTrophy,
      label: 'Toss',
      value: `${match.toss.winner} won and chose to ${match.toss.decision}`
    }
  ];
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Match Information</h3>
      
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <item.icon className="text-gray-400 mt-1" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
              <p className="font-medium text-gray-900 dark:text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Teams Summary */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Teams</h4>
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">{match.teamA.name}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {match.teamA.players?.length || 0} players
              </span>
            </div>
            {match.teamA.players && match.teamA.players.length > 0 && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Players: {match.teamA.players.slice(0, 3).join(', ')}
                {match.teamA.players.length > 3 && '...'}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">{match.teamB.name}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {match.teamB.players?.length || 0} players
              </span>
            </div>
            {match.teamB.players && match.teamB.players.length > 0 && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Players: {match.teamB.players.slice(0, 3).join(', ')}
                {match.teamB.players.length > 3 && '...'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Match ID */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">Match ID</p>
        <p className="font-mono font-bold text-cricket-green text-sm">{match.matchId}</p>
      </div>
    </div>
  );
};

export default MatchInfo;