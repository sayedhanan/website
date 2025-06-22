'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

interface Route {
  path: string;
  name: string;
  desc: string;
  confidence: number;
  tags: string[];
}

interface ModelMetrics {
  accuracy: number;
  loss: number;
  epochs: number;
  learningRate: number;
  trainingTime: number;
}

interface TrainingPhase {
  name: string;
  duration: number;
  color: string;
}

export default function NotFound() {
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [predictions, setPredictions] = useState<Route[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({ 
    accuracy: 0, 
    loss: 1.0, 
    epochs: 0, 
    learningRate: 0.001,
    trainingTime: 0
  });
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [trainingStartTime, setTrainingStartTime] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('/unknown');

  const availableRoutes: Route[] = [
    { 
      path: '/', 
      name: 'Home', 
      desc: 'Main landing page with portfolio overview', 
      confidence: 0,
      tags: ['portfolio', 'about', 'landing']
    },
    { 
      path: '/blog', 
      name: 'Blog', 
      desc: 'AI/ML articles, insights, and technical deep-dives', 
      confidence: 0,
      tags: ['articles', 'ai', 'machine-learning', 'tutorials']
    },
    { 
      path: '/newsletter', 
      name: 'Newsletter', 
      desc: 'Weekly AI updates and industry insights', 
      confidence: 0,
      tags: ['updates', 'ai-news', 'weekly', 'insights']
    },
    { 
      path: '/notes', 
      name: 'Notes', 
      desc: 'CS/AI study notes and research documentation', 
      confidence: 0,
      tags: ['study', 'notes', 'computer-science', 'research']
    },
    { 
      path: '/projects', 
      name: 'Projects', 
      desc: 'Showcase of AI/ML projects and experiments', 
      confidence: 0,
      tags: ['projects', 'portfolio', 'ai', 'experiments']
    }
  ];

  const trainingPhases: TrainingPhase[] = [
    { name: "Initializing neural architecture", duration: 1000, color: "text-blue-400" },
    { name: "Loading route embeddings", duration: 800, color: "text-purple-400" },
    { name: "Computing similarity vectors", duration: 1200, color: "text-yellow-400" },
    { name: "Training attention layers", duration: 1500, color: "text-green-400" },
    { name: "Fine-tuning parameters", duration: 1000, color: "text-cyan-400" },
    { name: "Validating model performance", duration: 800, color: "text-pink-400" },
    { name: "Generating predictions", duration: 600, color: "text-orange-400" }
  ];

  // Get current URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.pathname);
    }
  }, []);

  // Enhanced training simulation with realistic phases
  useEffect(() => {
    if (isTraining && currentPhase < trainingPhases.length) {
      const phase = trainingPhases[currentPhase];
      
      const timeout = setTimeout(() => {
        // Update metrics with more realistic progression
        const progress = (currentPhase + 1) / trainingPhases.length;
        const newAccuracy = Math.min(0.96, 0.12 + (progress * 0.8) + (Math.random() * 0.04 - 0.02));
        const newLoss = Math.max(0.03, 1.2 - (progress * 1.1) + (Math.random() * 0.06 - 0.03));
        const newLearningRate = 0.001 * Math.pow(0.95, currentPhase);
        const trainingTime = Date.now() - trainingStartTime;
        
        setModelMetrics({
          accuracy: newAccuracy,
          loss: newLoss,
          epochs: currentPhase + 1,
          learningRate: newLearningRate,
          trainingTime
        });

        setDebugLog(prev => [...prev.slice(-12), // Keep last 12 logs for better performance
          `[PHASE ${currentPhase + 1}] ${phase.name}...`,
          `[METRICS] Acc: ${(newAccuracy * 100).toFixed(1)}% | Loss: ${newLoss.toFixed(4)} | LR: ${newLearningRate.toFixed(6)}`
        ]);

        if (currentPhase === trainingPhases.length - 1) {
          // Generate smarter predictions based on URL similarity
          const finalPredictions = generateSmartPredictions(currentUrl);
          setPredictions(finalPredictions);
          setTrainingComplete(true);
          setDebugLog(prev => [...prev, 
            `[SUCCESS] Training completed in ${(trainingTime / 1000).toFixed(1)}s`,
            `[INFERENCE] Generated ${finalPredictions.length} route predictions with semantic similarity`
          ]);
        }

        setCurrentPhase(prev => prev + 1);
      }, phase.duration);

      return () => clearTimeout(timeout);
    }
  }, [isTraining, currentPhase, trainingStartTime, currentUrl]);

  // Smart prediction generation based on URL patterns
  const generateSmartPredictions = useCallback((url: string): Route[] => {
    const urlLower = url.toLowerCase();
    
    return availableRoutes.map(route => {
      let confidence = 0.7 + Math.random() * 0.25; // Base confidence
      
      // Boost confidence based on URL similarity
      if (urlLower.includes('blog') || urlLower.includes('article') || urlLower.includes('post')) {
        if (route.path.includes('blog')) confidence = Math.min(0.98, confidence + 0.2);
        if (route.path.includes('notes')) confidence = Math.min(0.95, confidence + 0.15);
      }
      
      if (urlLower.includes('project') || urlLower.includes('work') || urlLower.includes('portfolio')) {
        if (route.path.includes('project')) confidence = Math.min(0.98, confidence + 0.2);
        if (route.path === '/') confidence = Math.min(0.92, confidence + 0.1);
      }
      
      if (urlLower.includes('about') || urlLower.includes('me') || urlLower.includes('bio')) {
        if (route.path === '/') confidence = Math.min(0.98, confidence + 0.25);
      }
      
      // Tag-based similarity boost
      route.tags.forEach(tag => {
        if (urlLower.includes(tag)) {
          confidence = Math.min(0.98, confidence + 0.1);
        }
      });
      
      return { ...route, confidence };
    }).sort((a, b) => b.confidence - a.confidence);
  }, []);

  const startTraining = () => {
    setIsTraining(true);
    setCurrentPhase(0);
    setCurrentEpoch(0);
    setPredictions([]);
    setTrainingComplete(false);
    setTrainingStartTime(Date.now());
    setModelMetrics({ accuracy: 0, loss: 1.0, epochs: 0, learningRate: 0.001, trainingTime: 0 });
    setDebugLog([
      `[ERROR] RouteNotFoundException: "${currentUrl}"`,
      `[INIT] Initializing RoutePredictor v2.0...`,
      `[DATASET] Loading ${availableRoutes.length} route embeddings`
    ]);
  };

  const resetModel = () => {
    setIsTraining(false);
    setCurrentPhase(0);
    setCurrentEpoch(0);
    setPredictions([]);
    setTrainingComplete(false);
    setModelMetrics({ accuracy: 0, loss: 1.0, epochs: 0, learningRate: 0.001, trainingTime: 0 });
    setDebugLog([]);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.8) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.8) return 'Medium';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-primary-text)] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced AI Model Header */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-[var(--color-error)] rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-[var(--color-warning)] rounded-full"></div>
              <div className={`w-3 h-3 rounded-full ${trainingComplete ? 'bg-[var(--color-success)]' : 'bg-gray-400'}`}></div>
            </div>
            <div className="bg-[var(--color-border)] px-3 py-1 rounded text-sm text-[var(--color-secondary-text)]">
              🧠 RoutePredictor v2.0 - Semantic Route Intelligence
            </div>
          </div>
          <div className="text-[var(--color-secondary-text)] text-sm flex items-center space-x-4">
            <span>TensorFlow 2.15</span>
            <span>•</span>
            <span>Transformer Architecture</span>
            {isTraining && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Training</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border-x border-b border-[var(--color-border)] rounded-b-lg p-6">
          {/* Enhanced Error Display */}
          <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)] rounded-lg p-4 mb-6">
            <h1 className="text-2xl font-bold text-[var(--color-error)] mb-3 font-mono flex items-center">
              <span className="animate-bounce mr-2">🚨</span>
              RouteNotFoundException
            </h1>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <div className="text-red-400 mb-2">
                <span className="text-gray-500">Traceback (most recent call last):</span>
              </div>
              <div className="text-red-400 mb-1">
                <span className="text-gray-500">  File "semantic_router.py", line 127, in resolve_route</span>
              </div>
              <div className="text-red-400 bg-red-900 bg-opacity-30 px-3 py-1 rounded mb-3">
                RouteNotFoundException: No semantic match found for "{currentUrl}"
              </div>
              <div className="text-yellow-400 flex items-center">
                <span className="mr-2">💡</span>
                <span>AI Suggestion: Training neural network for intelligent route prediction...</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Enhanced Training Console */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--color-accent)] flex items-center">
                  🤖 Neural Network Training
                  {isTraining && (
                    <div className="ml-2 flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </h2>
                {!isTraining && !trainingComplete && (
                  <button
                    onClick={startTraining}
                    className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105 active:scale-95"
                  >
                    <span>▶️</span>
                    <span>Train Model</span>
                  </button>
                )}
                {trainingComplete && (
                  <button
                    onClick={resetModel}
                    className="bg-[var(--color-warning)] hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🔄 Retrain
                  </button>
                )}
              </div>

              {/* Enhanced Model Architecture */}
              <div className="bg-gray-900 border border-[var(--color-border)] rounded-lg p-4 mb-4">
                <div className="text-green-400 font-mono text-sm mb-3 flex items-center">
                  <span>Model Architecture:</span>
                  {isTraining && (
                    <div className="ml-2 text-xs text-blue-400">
                      {trainingPhases[Math.min(currentPhase, trainingPhases.length - 1)]?.name}
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400">Input Layer:</span>
                    <span className="text-gray-300">[URL_EMBEDDING: 512]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400">Transformer:</span>
                    <span className="text-gray-300">[HEADS: 8, LAYERS: 6]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400">Attention:</span>
                    <span className="text-gray-300">[SEMANTIC_DIM: 256]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-400">Output Layer:</span>
                    <span className="text-gray-300">[ROUTES: {availableRoutes.length}]</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Training Metrics */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 mb-4">
                <h3 className="text-[var(--color-secondary-text)] font-semibold mb-3">Training Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accuracy</span>
                      <span className="text-[var(--color-success)] font-mono">{(modelMetrics.accuracy * 100).toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${modelMetrics.accuracy * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Loss</span>
                      <span className="text-[var(--color-error)] font-mono">{modelMetrics.loss.toFixed(4)}</span>
                    </div>
                    <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${modelMetrics.loss * 50}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-[var(--color-secondary-text)]">
                    <div>
                      <span>Epochs: </span>
                      <span className="font-mono">{modelMetrics.epochs}/{trainingPhases.length}</span>
                    </div>
                    <div>
                      <span>Learning Rate: </span>
                      <span className="font-mono">{modelMetrics.learningRate.toFixed(6)}</span>
                    </div>
                  </div>
                  {trainingComplete && (
                    <div className="text-sm text-[var(--color-success)]">
                      Training completed in {(modelMetrics.trainingTime / 1000).toFixed(1)}s
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Debug Console */}
              <div className="bg-gray-900 border border-[var(--color-border)] rounded-lg p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                {debugLog.length === 0 ? (
                  <div className="text-gray-500 italic text-center py-8">
                    <div className="text-2xl mb-2">🤖</div>
                    <div>Neural network ready for training</div>
                    <div className="text-sm mt-1">Click "Train Model" to start AI-powered route discovery</div>
                  </div>
                ) : (
                  debugLog.map((line, index) => (
                    <div key={index} className="mb-1 text-xs">
                      <span className="text-gray-500">
                        {new Date().toLocaleTimeString()}
                      </span>
                      <span className={`ml-2 ${
                        line.includes('ERROR') ? 'text-red-400' :
                        line.includes('SUCCESS') ? 'text-green-400' :
                        line.includes('METRICS') ? 'text-cyan-400' :
                        line.includes('PHASE') ? trainingPhases[currentPhase - 1]?.color || 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {line}
                      </span>
                    </div>
                  ))
                )}
                {isTraining && !trainingComplete && (
                  <div className="flex items-center text-blue-400 text-sm mt-2 animate-pulse">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2"></div>
                    Training neural network... Phase {currentPhase + 1}/{trainingPhases.length}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced AI Predictions */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-info)] mb-4 flex items-center">
                🎯 AI Route Predictions
                {predictions.length > 0 && (
                  <span className="ml-2 text-sm bg-[var(--color-info)] text-white px-2 py-1 rounded-full">
                    {predictions.length}
                  </span>
                )}
              </h2>
              
              {predictions.length === 0 ? (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 text-center text-[var(--color-secondary-text)]">
                  <div className="text-6xl mb-4">🧠</div>
                  <p className="text-lg mb-2">Neural network is analyzing...</p>
                  <p className="text-sm">Train the model to generate intelligent route predictions</p>
                  {!isTraining && !trainingComplete && (
                    <button
                      onClick={startTraining}
                      className="mt-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Start AI Training
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-[var(--color-secondary-text)] mb-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded p-3">
                    <div className="flex items-center justify-between">
                      <span>Routes ranked by semantic similarity to "{currentUrl}"</span>
                      <span className="text-xs text-[var(--color-info)]">Confidence Score</span>
                    </div>
                  </div>
                  {predictions.map((route, index) => (
                    <Link href={route.path} key={route.path}>
                      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-[var(--color-accent)] group-hover:text-[var(--color-accent-hover)]">
                            #{index + 1} {route.name}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(route.confidence)} bg-opacity-20`}>
                              {getConfidenceLabel(route.confidence)}
                            </span>
                            <div className={`text-sm font-mono font-bold ${getConfidenceColor(route.confidence)}`}>
                              {(route.confidence * 100).toFixed(1)}%
                            </div>
                            <div className="text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </div>
                          </div>
                        </div>
                        <div className="text-[var(--color-secondary-text)] text-sm mb-3">
                          {route.desc}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-[var(--color-secondary-text)] font-mono bg-gray-800 px-2 py-1 rounded">
                            {route.path}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-[var(--color-border)] rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                  route.confidence >= 0.9 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                                  route.confidence >= 0.8 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                  'bg-gradient-to-r from-orange-500 to-orange-400'
                                }`}
                                style={{ width: `${route.confidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {route.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-[var(--color-border)] px-2 py-1 rounded text-[var(--color-secondary-text)]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <h3 className="text-lg font-semibold text-[var(--color-accent)] mb-4 flex items-center">
              🚀 Quick Navigation
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/">
                <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95">
                  🏠 Home
                </button>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="bg-[var(--color-border)] hover:bg-gray-400 text-[var(--color-primary-text)] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                ⬅️ Back
              </button>
              <Link href="/blog">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95">
                  📝 Blog
                </button>
              </Link>
            </div>
          </div>

          {/* Enhanced AI Fun Fact */}
          <div className="mt-6 bg-gradient-to-r from-[var(--color-info-bg)] to-blue-900 bg-opacity-20 border border-[var(--color-info)] rounded-lg p-4">
            <p className="text-[var(--color-info)] text-sm">
              <span className="font-semibold">🤖 AI Architecture:</span> This route predictor uses a transformer-based 
              neural network with semantic embeddings to understand URL patterns and predict the most relevant pages 
              based on contextual similarity - similar to how modern search engines work!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}