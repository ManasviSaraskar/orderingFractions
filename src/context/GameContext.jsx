import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  score: 0,
  stars: 0,
  currentScene: 'intro', // intro, s1_learn, s1_sim, s2_learn, s2_sim, s3_learn, s3_sim, p1, p2, p3, victory
  scenesCompleted: [],
  practiceScores: { level1: null, level2: null, level3: null },
  badges: [],
  sessionStartTime: Date.now()
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'ADVANCE_SCENE':
      return { ...state, currentScene: action.payload };
    case 'ADD_SCORE':
      return { ...state, score: state.score + action.payload.points, stars: state.stars + action.payload.stars };
    case 'ADD_BADGE':
      if (state.badges.includes(action.payload)) return state;
      return { ...state, badges: [...state.badges, action.payload] };
    case 'RECORD_PRACTICE_SCORE':
      return { 
        ...state, 
        practiceScores: { ...state.practiceScores, [action.payload.level]: action.payload.score }
      };
    case 'COMPLETE_SCENE':
      if (state.scenesCompleted.includes(action.payload)) return state;
      return { ...state, scenesCompleted: [...state.scenesCompleted, action.payload] };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
