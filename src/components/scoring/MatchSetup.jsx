import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBaseballBall, FaExclamationTriangle } from 'react-icons/fa';

export const MatchSetup = ({ onCreateMatch }) => {
  const [teamA, setTeamA] = useState({ name: '', players: [] });
  const [teamB, setTeamB] = useState({ name: '', players: [] });
  const [toss, setToss] = useState({ winner: '', decision: 'bat' });
  const [venue, setVenue] = useState('');
  const [totalOvers, setTotalOvers] = useState(5);
  const [matchType, setMatchType] = useState('limited');
  const [step, setStep] = useState(1);
  

  const [playerInputs, setPlayerInputs] = useState({
    teamA: '',
    teamB: ''
  });
  

  const [errors, setErrors] = useState({
    teamA: '',
    teamB: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
   
    if (teamA.players.length > 11) {
      setErrors(prev => ({ ...prev, teamA: 'Maximum 11 players allowed' }));
      setStep(1);
      return;
    }
    if (teamB.players.length > 11) {
      setErrors(prev => ({ ...prev, teamB: 'Maximum 11 players allowed' }));
      setStep(1);
      return;
    }
    
    const matchData = {
      teamA,
      teamB,
      toss,
      venue,
      totalOvers,
      matchType
    };
    
    onCreateMatch(matchData);
  };

  const handleTeamChange = (team, field, value) => {
    if (team === 'A') {
      setTeamA(prev => ({ ...prev, [field]: value }));
    } else {
      setTeamB(prev => ({ ...prev, [field]: value }));
    }
  };

 
  const handlePlayerInputChange = (team, value) => {
   
    setPlayerInputs(prev => ({
      ...prev,
      [team === 'A' ? 'teamA' : 'teamB']: value
    }));

   
    setErrors(prev => ({ ...prev, [team === 'A' ? 'teamA' : 'teamB']: '' }));

   
    const playersArray = value
      .split(',')
      .map(p => p.trim())
      .filter(p => p !== '');

    
    if (playersArray.length > 11) {
     
      const limitedPlayers = playersArray.slice(0, 11);
      
      if (team === 'A') {
        setTeamA(prev => ({ ...prev, players: limitedPlayers }));
        setErrors(prev => ({ ...prev, teamA: 'Maximum 11 players allowed. Only first 11 will be used.' }));
      } else {
        setTeamB(prev => ({ ...prev, players: limitedPlayers }));
        setErrors(prev => ({ ...prev, teamB: 'Maximum 11 players allowed. Only first 11 will be used.' }));
      }
      
      
      const limitedInput = limitedPlayers.join(', ');
      setPlayerInputs(prev => ({
        ...prev,
        [team === 'A' ? 'teamA' : 'teamB']: limitedInput
      }));
    } else {
      if (team === 'A') {
        setTeamA(prev => ({ ...prev, players: playersArray }));
      } else {
        setTeamB(prev => ({ ...prev, players: playersArray }));
      }
    }
  };

  
  const getPlayerInputValue = (team) => {
    const players = team === 'A' ? teamA.players : teamB.players;
    const rawInput = playerInputs[team === 'A' ? 'teamA' : 'teamB'];
    
   
    if (rawInput !== undefined && rawInput !== '') {
      return rawInput;
    }
    return players.join(', ');
  };

  
  const handleNextStep = () => {
    let hasErrors = false;
    const newErrors = { teamA: '', teamB: '' };

   
    if (!teamA.name.trim()) {
      hasErrors = true;
    }
    if (!teamB.name.trim()) {
      hasErrors = true;
    }

    
    if (teamA.players.length > 11) {
      newErrors.teamA = 'Maximum 11 players allowed';
      hasErrors = true;
    }
    if (teamB.players.length > 11) {
      newErrors.teamB = 'Maximum 11 players allowed';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      setStep(step + 1);
    } else {
    
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  
  const getPlayerCountColor = (count) => {
    if (count === 0) return 'text-gray-500';
    if (count <= 11) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cricket-green/10 rounded-full mb-4">
            <FaBaseballBall className="text-4xl text-cricket-green" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Setup New Match
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter match details to start scoring
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= num 
                    ? 'bg-cricket-green text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-24 h-1 mx-2 ${
                    step > num 
                      ? 'bg-cricket-green' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Team Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Team A Name *
                    </label>
                    <input
                      type="text"
                      value={teamA.name}
                      onChange={(e) => handleTeamChange('A', 'name', e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-cricket-green focus:border-transparent ${
                        !teamA.name && errors.teamA 
                          ? 'border-red-300 dark:border-red-700' 
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                      placeholder="Enter Team A name"
                      required
                    />
                    {!teamA.name && (
                      <p className="text-sm text-red-500 mt-1">Team name is required</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-700 dark:text-gray-300 font-medium">
                        Team A Players (comma separated)
                      </label>
                      <span className={`text-sm font-medium ${getPlayerCountColor(teamA.players.length)}`}>
                        {teamA.players.length}/11 players
                      </span>
                    </div>
                    <textarea
                      value={getPlayerInputValue('A')}
                      onChange={(e) => handlePlayerInputChange('A', e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-cricket-green focus:border-transparent ${
                        errors.teamA 
                          ? 'border-red-300 dark:border-red-700' 
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                      placeholder="Player1, Player2, Player3..."
                      rows="4"
                    />
                    <div className="flex items-start gap-2 mt-1">
                      {errors.teamA && (
                        <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <p className={`text-sm ${
                        errors.teamA ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {errors.teamA || (
                          <>
                            {teamA.players.length === 0 
                              ? 'Add player names separated by commas (e.g., Virat Kohli, MS Dhoni)' 
                              : teamA.players.length < 11 
                                ? `${11 - teamA.players.length} more players can be added`
                                : 'Maximum 11 players reached'}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Team B Name *
                    </label>
                    <input
                      type="text"
                      value={teamB.name}
                      onChange={(e) => handleTeamChange('B', 'name', e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-cricket-green focus:border-transparent ${
                        !teamB.name && errors.teamB 
                          ? 'border-red-300 dark:border-red-700' 
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                      placeholder="Enter Team B name"
                      required
                    />
                    {!teamB.name && (
                      <p className="text-sm text-red-500 mt-1">Team name is required</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-700 dark:text-gray-300 font-medium">
                        Team B Players (comma separated)
                      </label>
                      <span className={`text-sm font-medium ${getPlayerCountColor(teamB.players.length)}`}>
                        {teamB.players.length}/11 players
                      </span>
                    </div>
                    <textarea
                      value={getPlayerInputValue('B')}
                      onChange={(e) => handlePlayerInputChange('B', e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-cricket-green focus:border-transparent ${
                        errors.teamB 
                          ? 'border-red-300 dark:border-red-700' 
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                      placeholder="Player1, Player2, Player3..."
                      rows="4"
                    />
                    <div className="flex items-start gap-2 mt-1">
                      {errors.teamB && (
                        <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <p className={`text-sm ${
                        errors.teamB ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {errors.teamB || (
                          <>
                            {teamB.players.length === 0 
                              ? 'Add player names separated by commas (e.g., Virat Kohli, MS Dhoni)' 
                              : teamB.players.length < 11 
                                ? `${11 - teamB.players.length} more players can be added`
                                : 'Maximum 11 players reached'}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Validation summary */}
              {(errors.teamA || errors.teamB) && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <FaExclamationTriangle />
                    <span className="font-medium">Please fix the following issues:</span>
                  </div>
                  <ul className="mt-2 text-sm text-red-600 dark:text-red-300 list-disc list-inside space-y-1">
                    {errors.teamA && <li>Team A: {errors.teamA}</li>}
                    {errors.teamB && <li>Team B: {errors.teamB}</li>}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`px-8 py-3 rounded-xl font-semibold transition-colors ${
                    !teamA.name || !teamB.name || teamA.players.length === 0 || teamB.players.length === 0
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-cricket-green hover:bg-cricket-darkGreen text-white'
                  }`}
                  disabled={!teamA.name || !teamB.name || teamA.players.length === 0 || teamB.players.length === 0}
                >
                  Next: Toss Details →
                </button>
              </div>
            </motion.div>
          )}

        
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Toss & Match Details
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Who won the toss? *
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setToss({ ...toss, winner: teamA.name })}
                      className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all ${
                        toss.winner === teamA.name
                          ? 'border-cricket-green bg-cricket-green/10 text-cricket-green'
                          : 'border-gray-200 dark:border-gray-700 hover:border-cricket-green'
                      }`}
                    >
                      {teamA.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setToss({ ...toss, winner: teamB.name })}
                      className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all ${
                        toss.winner === teamB.name
                          ? 'border-cricket-green bg-cricket-green/10 text-cricket-green'
                          : 'border-gray-200 dark:border-gray-700 hover:border-cricket-green'
                      }`}
                    >
                      {teamB.name}
                    </button>
                  </div>
                </div>

                {toss.winner && (
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      {toss.winner} chose to: *
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setToss({ ...toss, decision: 'bat' })}
                        className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all ${
                          toss.decision === 'bat'
                            ? 'border-cricket-green bg-cricket-green/10 text-cricket-green'
                            : 'border-gray-200 dark:border-gray-700 hover:border-cricket-green'
                        }`}
                      >
                        🏏 Bat First
                      </button>
                      <button
                        type="button"
                        onClick={() => setToss({ ...toss, decision: 'bowl' })}
                        className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-all ${
                          toss.decision === 'bowl'
                            ? 'border-cricket-green bg-cricket-green/10 text-cricket-green'
                            : 'border-gray-200 dark:border-gray-700 hover:border-cricket-green'
                        }`}
                      >
                        🎯 Bowl First
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Venue / Location
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cricket-green focus:border-transparent"
                    placeholder="e.g., Local Ground, Park Name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Match Type
                  </label>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cricket-green focus:border-transparent"
                  >
                    <option value="limited">Limited Overs</option>
                    <option value="test">Test Match</option>
                    <option value="friendly">Friendly Match</option>
                  </select>
                </div>

                {matchType === 'limited' && (
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Overs per innings
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={totalOvers}
                        onChange={(e) => setTotalOvers(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-2xl font-bold text-cricket-green min-w-[60px]">
                        {totalOvers}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Select number of overs per team (1-20)
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:border-gray-400 dark:hover:border-gray-500"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!toss.winner) {
                      alert('Please select toss winner');
                      return;
                    }
                    setStep(3);
                  }}
                  className="bg-cricket-green hover:bg-cricket-darkGreen text-white px-8 py-3 rounded-xl font-semibold"
                >
                  Next: Review →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Review & Start Match
              </h3>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Team A: {teamA.name}</h4>
                    <p className="text-sm text-cricket-green mb-1">
                      {teamA.players.length} Players
                    </p>
                    {teamA.players.length > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {teamA.players.slice(0, 5).join(', ')}
                        {teamA.players.length > 5 && ` +${teamA.players.length - 5} more`}
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Team B: {teamB.name}</h4>
                    <p className="text-sm text-cricket-green mb-1">
                      {teamB.players.length} Players
                    </p>
                    {teamB.players.length > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {teamB.players.slice(0, 5).join(', ')}
                        {teamB.players.length > 5 && ` +${teamB.players.length - 5} more`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Toss Winner</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{toss.winner}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Decision</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {toss.decision === 'bat' ? 'Batting First' : 'Bowling First'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Venue</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{venue || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Match Type</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {matchType === 'limited' ? 'Limited Overs' : 
                         matchType === 'test' ? 'Test Match' : 'Friendly Match'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Overs</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{totalOvers}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:border-gray-400 dark:hover:border-gray-500"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-cricket-green hover:bg-cricket-darkGreen text-white px-8 py-3 rounded-xl font-semibold flex items-center"
                >
                  <FaBaseballBall className="mr-2" /> Start Match
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </motion.div>
  );
};