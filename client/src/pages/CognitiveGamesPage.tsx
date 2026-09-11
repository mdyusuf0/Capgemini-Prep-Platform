import React, { useState } from 'react';
import { Brain, Shuffle, Move, Calculator, Search, Lightbulb, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import GeoSudoGame from '../components/games/GeoSudoGame';
import SpacioGame from '../components/games/SpacioGame';
import GridChallengeGame from '../components/games/GridChallengeGame';
import MotionChallengeGame from '../components/games/MotionChallengeGame';
import SwitchChallengeGame from '../components/games/SwitchChallengeGame';
import DigitChallengeGame from '../components/games/DigitChallengeGame';

const games = [
  { id: 'grid', title: 'Grid Challenge', desc: 'Working memory, visual attention & multitasking', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'switch', title: 'Switch Challenge', desc: 'Sequence deduction & permutation transformation', icon: Shuffle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'motion', title: 'Motion Challenge', desc: 'Optimal pathfinding & spatial planning with obstacles', icon: Move, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'digit', title: 'Digit Challenge', desc: 'Numerical speed, mental arithmetic & operator logic', icon: Calculator, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'deductive', title: 'Geo-Sudo (Deductive)', desc: 'Latin-square symbol uniqueness & deductive elimination', icon: Search, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'inductive', title: 'Spacio (Inductive)', desc: 'Geometric matrix rule discovery & shape rotation', icon: Lightbulb, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

export default function CognitiveGamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === 'grid') return <GridChallengeGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'switch') return <SwitchChallengeGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'digit') return <DigitChallengeGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'motion') return <MotionChallengeGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'deductive') return <GeoSudoGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'inductive') return <SpacioGame onBack={() => setActiveGame(null)} />;

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 mb-3">
          <span>🎮 Procedural Cognitive Simulator</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Game-Based Cognitive Assessment</h1>
        <p className="text-gray-400 max-w-3xl">
          Capgemini Exceller uses 4 interactive mini-games (from this 6-game pool) in Round 1.3 to evaluate cognitive speed, working memory, spatial reasoning, and deduction. Practice unlimited procedurally generated variants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <motion.div
              key={game.id}
              whileHover={{ y: -4 }}
              className="bg-[#1e1e2e] border border-gray-800 hover:border-gray-700 rounded-xl p-6 flex flex-col items-start transition-all shadow-lg"
            >
              <div className={`p-4 rounded-lg mb-4 ${game.bg}`}>
                <Icon className={`w-8 h-8 ${game.color}`} />
              </div>
              <h2 className="text-xl font-bold mb-1">{game.title}</h2>
              <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">{game.desc}</p>
              
              <div className="w-full flex justify-between items-center mt-auto pt-4 border-t border-gray-800/80">
                <div className="text-xs text-gray-500">
                  <span className="block font-medium">Platform</span>
                  <span className="text-gray-300">Aon / CoCubes Pattern</span>
                </div>
                <button
                  onClick={() => setActiveGame(game.id)}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Simulation</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
