import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useAudio } from '../context/AudioContext';
import { generateLevelQuestions } from '../utils/questionGenerator';
import QuestionCard from '../components/practice/QuestionCard';
import MCQQuestion from '../components/practice/MCQQuestion';
import TrueFalseQuestion from '../components/practice/TrueFalseQuestion';
import DragOrderQuestion from '../components/practice/DragOrderQuestion';
import CharacterSpeech from '../components/layout/CharacterSpeech';
import { toDecimal } from '../utils/fractionMath';

export default function PracticeLevel({ level }) {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { playCorrect, playWrong } = useAudio();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    dispatch({ type: 'ADVANCE_SCENE', payload: `p${level}` });
    // Generate questions for this session
    const generated = generateLevelQuestions(level, Date.now());
    setQuestions(generated);
  }, [level, dispatch]);

  const currentQ = questions[currentIndex];

  const handleAnswer = (answer) => {
    let isCorrect = false;
    
    if (currentQ.type === 'MCQ') {
      isCorrect = answer.n === currentQ.correct.n && answer.d === currentQ.correct.d;
    } else if (currentQ.type === 'TRUE_FALSE') {
      isCorrect = answer === currentQ.correct;
    } else if (currentQ.type === 'WORD_PROBLEM') {
      isCorrect = answer === currentQ.correct;
    } else if (currentQ.type === 'DRAG_ORDER') {
      isCorrect = answer.every((f, i) => f.n === currentQ.correct[i].n && f.d === currentQ.correct[i].d);
    } else if (currentQ.type === 'NUMBER_LINE') {
      // Simplified validation for MVP
      isCorrect = true; 
    }

    if (isCorrect) {
      playCorrect();
      const points = attempts === 0 ? 10 : 5;
      dispatch({ type: 'ADD_SCORE', payload: { points, stars: 1 } });
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setAttempts(0);
        setShowHint(false);
      } else {
        setIsComplete(true);
      }
    } else {
      playWrong();
      setAttempts(prev => prev + 1);
      if (attempts === 0) {
        setShowHint(true);
      } else {
        // Move on after 2 attempts
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setAttempts(0);
          setShowHint(false);
        } else {
          setIsComplete(true);
        }
      }
    }
  };

  const handleLevelComplete = () => {
    dispatch({ type: 'RECORD_PRACTICE_SCORE', payload: { level: `level${level}`, score: 100 } });
    if (level < 3) {
      navigate(`/practice-${level + 1}`);
    } else {
      navigate('/victory');
    }
  };

  if (!currentQ) return <div className="text-3xl">Loading...</div>;

  if (isComplete) {
    return (
      <div className="card-container text-center animate-fade-in">
        <h2 className="text-success mb-6">Level {level} Complete!</h2>
        <button className="btn-primary" onClick={handleLevelComplete}>
          {level < 3 ? 'Next Level' : 'To The Crystal Castle!'}
        </button>
      </div>
    );
  }

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'MCQ':
      case 'WORD_PROBLEM':
        return <MCQQuestion question={currentQ} onAnswer={handleAnswer} />;
      case 'TRUE_FALSE':
        return <TrueFalseQuestion onAnswer={handleAnswer} />;
      case 'DRAG_ORDER':
        return <DragOrderQuestion question={currentQ} onAnswer={handleAnswer} />;
      default:
        return <div>Unsupported Question Type</div>;
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-32">
      <div className="mb-4 text-xl font-bold text-gray-500">
        Question {currentIndex + 1} of {questions.length}
      </div>
      
      <QuestionCard title={`Level ${level} Challenge`} questionText={currentQ.questionText}>
        {renderQuestion()}
      </QuestionCard>

      {showHint && (
        <CharacterSpeech 
          character="Leon" 
          text="Oops! Try again — look at the numbers carefully." 
          position="bottom-left"
        />
      )}
    </div>
  );
}
