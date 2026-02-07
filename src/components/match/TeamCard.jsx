import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaUser, 
  FaCrown, 
  FaPlus, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaBaseballBall,
  FaChartLine,
  FaTrophy
} from 'react-icons/fa';

const TeamCard = ({ 
  team, 
  isBatting = false,
  isWinner = false,
  isEditable = false,
  onUpdate = null,
  showStats = false,
  className = '',
  onClick = null
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: team?.name || '',
    players: team?.players || []
  });
  const [newPlayer, setNewPlayer] = useState('');

  const handleEditToggle = () => {
    if (isEditing) {
     
      setEditData({
        name: team?.name || '',
        players: team?.players || []
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editData);
    }
    setIsEditing(false);
  };

  const handleAddPlayer = () => {
    if (!newPlayer.trim()) return;
    
    setEditData(prev => ({
      ...prev,
      players: [...prev.players, newPlayer.trim()]
    }));
    setNewPlayer('');
  };

  const handleRemovePlayer = (index) => {
    setEditData(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }));
  };

  const calculateTeamStats = () => {
    if (!team) return null;
    
   
    return {
      totalRuns: Math.floor(Math.random() * 500) + 200,
      totalWickets: Math.floor(Math.random() * 10),
      highestScore: Math.floor(Math.random() * 150) + 50,
      winRate: Math.floor(Math.random() * 100)
    };
  };

  const stats = calculateTeamStats();

  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border
        ${isBatting ? 'border-cricket-green' : 'border-gray-200 dark:border-gray-700'}
        ${isWinner ? 'ring-2 ring-yellow-500' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Team Header */}
      <div className={`p-6 ${isBatting ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-cricket-green focus:outline-none text-gray-900 dark:text-white"
                placeholder="Team Name"
              />
            ) : (
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                {team?.name || 'Team Name'}
                {isBatting && (
                  <span className="ml-2 px-2 py-1 bg-cricket-green text-white text-xs rounded-full">
                    Batting
                  </span>
                )}
                {isWinner && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">
                    <FaTrophy className="inline mr-1" /> Winner
                  </span>
                )}
              </h3>
            )}
            
            <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
              <FaUsers className="mr-2" />
              <span>
                {isEditing ? editData.players.length : team?.players?.length || 0} players
              </span>
            </div>
          </div>
          
          {isEditable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditToggle();
              }}
              className={`p-2 rounded-lg ${
                isEditing 
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isEditing ? <FaTimes /> : <FaEdit />}
            </button>
          )}
        </div>
      </div>

      {/* Players List */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <FaUser className="mr-2 text-cricket-green" />
          Players
        </h4>
        
        {isEditing ? (
          <div className="space-y-3">
            {/* Add Player Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                placeholder="Add player name..."
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
              />
              <button
                onClick={handleAddPlayer}
                className="px-3 py-2 bg-cricket-green hover:bg-cricket-darkGreen text-white rounded-lg"
              >
                <FaPlus />
              </button>
            </div>
            
            {/* Players List */}
            {editData.players.length > 0 ? (
              <div className="space-y-2">
                {editData.players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-cricket-green/10 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-cricket-green text-sm" />
                      </div>
                      <span className="text-gray-900 dark:text-white">{player}</span>
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No players added yet
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {team?.players?.length > 0 ? (
  <div className="space-y-2 max-h-64 overflow-y-auto">
    {team.players.map((player, index) => (
      <div
        key={index}
        className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {index + 1}
          </span>
        </div>
        <span className="text-gray-900 dark:text-white">
          {player}
          {index === 0 && (
            <span className="ml-2 text-yellow-500">
              <FaCrown className="inline" />
            </span>
          )}
        </span>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
    No players information
  </p>
)}

          </div>
        )}

        {/* Team Stats */}
        {showStats && stats && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <FaChartLine className="mr-2 text-blue-500" />
              Team Statistics
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Runs</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.totalRuns}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Wickets</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {stats.totalWickets}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Highest Score</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {stats.highestScore}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.winRate}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {isEditing && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-cricket-green hover:bg-cricket-darkGreen text-white py-2 rounded-lg font-semibold flex items-center justify-center"
            >
              <FaSave className="mr-2" /> Save Changes
            </button>
            <button
              onClick={handleEditToggle}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};


export const TeamCardWithCaptain = ({ team, onCaptainSelect, captain }) => {
  const [showCaptainSelect, setShowCaptainSelect] = useState(false);

  const handleCaptainSelect = (playerName) => {
    if (onCaptainSelect) {
      onCaptainSelect(playerName);
    }
    setShowCaptainSelect(false);
  };

  return (
    <TeamCard
      team={team}
      isEditable={false}
      showStats={false}
      onClick={() => setShowCaptainSelect(!showCaptainSelect)}
    >
      {/* Captain Selection Overlay */}
      {showCaptainSelect && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Select Captain
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {team?.players?.map((player, index) => (
                <button
                  key={index}
                  onClick={() => handleCaptainSelect(player)}
                  className={`w-full text-left p-3 rounded-lg flex items-center ${
                    captain === player
                      ? 'bg-cricket-green text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FaUser className="mr-3" />
                  <span>{player}</span>
                  {captain === player && (
                    <FaCrown className="ml-auto text-yellow-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Captain Badge */}
      {captain && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <FaCrown className="text-yellow-500 mr-2" />
            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
              Captain: {captain}
            </span>
          </div>
        </div>
      )}
    </TeamCard>
  );
};


export const TeamCardForSetup = ({ 
  team, 
  onChange, 
  title = "Team Setup",
  isRequired = true 
}) => {
  const [localTeam, setLocalTeam] = useState(team || { name: '', players: [] });
  const [newPlayer, setNewPlayer] = useState('');

  const handleTeamNameChange = (name) => {
    const updated = { ...localTeam, name };
    setLocalTeam(updated);
    if (onChange) onChange(updated);
  };

  const handleAddPlayer = () => {
    if (!newPlayer.trim()) return;
    const updated = {
      ...localTeam,
      players: [...localTeam.players, newPlayer.trim()]
    };
    setLocalTeam(updated);
    setNewPlayer('');
    if (onChange) onChange(updated);
  };

  const handleRemovePlayer = (index) => {
    const updated = {
      ...localTeam,
      players: localTeam.players.filter((_, i) => i !== index)
    };
    setLocalTeam(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {title} {isRequired && <span className="text-red-500">*</span>}
      </h3>
      
      {/* Team Name Input */}
      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
          Team Name
        </label>
        <input
          type="text"
          value={localTeam.name}
          onChange={(e) => handleTeamNameChange(e.target.value)}
          placeholder="Enter team name..."
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cricket-green focus:border-transparent"
          required={isRequired}
        />
      </div>

      {/* Players Management */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
          Players ({localTeam.players.length})
        </label>
        
        {/* Add Player */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="Add player name..."
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cricket-green focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
          />
          <button
            onClick={handleAddPlayer}
            className="px-4 py-3 bg-cricket-green hover:bg-cricket-darkGreen text-white rounded-xl font-semibold flex items-center"
          >
            <FaPlus className="mr-2" /> Add
          </button>
        </div>

        {/* Players List */}
        {localTeam.players.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {localTeam.players.map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-cricket-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-cricket-green">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-gray-900 dark:text-white">{player}</span>
                </div>
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <FaUsers className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No players added yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Add players using the input above
            </p>
          </div>
        )}

        {/* Players Count */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {localTeam.players.length} player{localTeam.players.length !== 1 ? 's' : ''} added
          </p>
          {localTeam.players.length > 11 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              ⚠️ Maximum 11 players recommended
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;

