'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Route {
  path: string;
  name: string;
  desc: string;
  confidence: number;
}

interface ModelMetrics {
  accuracy: number;
  loss: number;
  epochs: number;
}

export default function NotFound() {
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [predictions, setPredictions] = useState<Route[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({ accuracy: 0, loss: 1.0, epochs: 0 });
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [trainingComplete, setTrainingComplete] = useState(false);

  const availableRoutes: Route[] = [
    { path: '/', name: 'Home', desc: 'Main landing page', confidence: 0 },
    { path: '/blog', name: 'Blog', desc: 'AI/ML articles and insights', confidence: 0 },
    { path: '/newsletter', name: 'Newsletter', desc: 'Weekly AI updates', confidence: 0 },
    { path: '/notes', name: 'Notes', desc: 'CS/AI study notes', confidence: 0 }
  ];

  const trainingSteps = [
    "Initializing neural network architecture...",
    "Loading route embeddings...",
    "Computing URL similarity vectors...",
    "Training attention mechanism...",
    "Fine-tuning transformer layers...",
    "Evaluating model performance...",
    "Generating route predictions..."
  ];

  useEffect(() => {
    if (isTraining && currentEpoch < 7) {
      const timeout = setTimeout(() => {
        const newAccuracy = Math.min(0.95, 0.1 + (currentEpoch * 0.12) + Math.random() * 0.05);
        const newLoss = Math.max(0.05, 1.0 - (currentEpoch * 0.13) - Math.random() * 0.02);
        
        setModelMetrics({
          accuracy: newAccuracy,
          loss: newLoss,
          epochs: currentEpoch + 1
        });

        setDebugLog(prev => [...prev, 
          `[EPOCH ${currentEpoch + 1}] ${trainingSteps[currentEpoch]}`,
          `[METRICS] Accuracy: ${(newAccuracy * 100).toFixed(1)}% | Loss: ${newLoss.toFixed(4)}`
        ]);

        if (currentEpoch === 6) {
          // Generate final predictions with confidence scores
          const finalPredictions = availableRoutes.map(route => ({
            ...route,
            confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
          })).sort((a, b) => b.confidence - a.confidence);
          
          setPredictions(finalPredictions);
          setTrainingComplete(true);
          setDebugLog(prev => [...prev, 
            `[SUCCESS] Model training completed!`,
            `[INFERENCE] Generated ${finalPredictions.length} route predictions`
          ]);
        }

        setCurrentEpoch(prev => prev + 1);
      }, 1200);

      return () => clearTimeout(timeout);
    }
  }, [isTraining, currentEpoch]);

  const startTraining = () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setPredictions([]);
    setTrainingComplete(false);
    setDebugLog([
      `[ERROR] RouteNotFoundException: "${typeof window !== 'undefined' ? window.location.pathname : '/unknown'}"`,
      `[INIT] Starting AI model training for route prediction...`
    ]);
  };

  const resetModel = () => {
    setIsTraining(false);
    setCurrentEpoch(0);
    setPredictions([]);
    setTrainingComplete(false);
    setModelMetrics({ accuracy: 0, loss: 1.0, epochs: 0 });
    setDebugLog([]);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-primary-text)] p-4">
      <div className="max-w-6xl mx-auto">
        {/* AI Model Header */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-t-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-[var(--color-error)] rounded-full"></div>
              <div className="w-3 h-3 bg-[var(--color-warning)] rounded-full"></div>
              <div className="w-3 h-3 bg-[var(--color-success)] rounded-full"></div>
            </div>
            <div className="bg-[var(--color-border)] px-3 py-1 rounded text-sm text-[var(--color-secondary-text)]">
              🧠 RoutePredictor.py - Neural Network Debugger
            </div>
          </div>
          <div className="text-[var(--color-secondary-text)] text-sm">
            TensorFlow 2.15 | PyTorch 2.0
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border-x border-b border-[var(--color-border)] rounded-b-lg p-6">
          {/* Error Display */}
          <div className="bg-[var(--color-error-bg)] border border-[var(--color-error)] rounded-lg p-4 mb-6">
            <h1 className="text-2xl font-bold text-[var(--color-error)] mb-2 font-mono flex items-center">
              🚨 RouteNotFoundException
            </h1>
            <div className="bg-gray-900 rounded p-3 font-mono text-sm text-green-400">
              <div className="text-red-400">
                <span className="text-gray-500">Traceback (most recent call last):</span>
              </div>
              <div className="text-red-400">
                <span className="text-gray-500">  File "router.py", line 42, in find_route</span>
              </div>
              <div className="text-red-400 bg-red-900 bg-opacity-20 px-2">
                RouteNotFoundException: No matching route found for "{typeof window !== 'undefined' ? window.location.pathname : '/unknown'}"
              </div>
              <div className="text-yellow-400 mt-2">
                💡 Suggestion: Train AI model to predict similar routes
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Training Console */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--color-accent)] flex items-center">
                  🤖 Neural Network Training
                </h2>
                {!isTraining && !trainingComplete && (
                  <button
                    onClick={startTraining}
                    className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
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

              {/* Model Architecture Visualization */}
              <div className="bg-gray-900 border border-[var(--color-border)] rounded-lg p-4 mb-4">
                <div className="text-green-400 font-mono text-sm mb-3">Model Architecture:</div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-blue-400">
                    <span>Input Layer:</span>
                    <span>[URL_EMBEDDING: 512]</span>
                  </div>
                  <div className="flex justify-between text-purple-400">
                    <span>Transformer:</span>
                    <span>[ATTENTION_HEADS: 8]</span>
                  </div>
                  <div className="flex justify-between text-yellow-400">
                    <span>Dense Layer:</span>
                    <span>[HIDDEN_SIZE: 256]</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Output Layer:</span>
                    <span>[ROUTES: 4]</span>
                  </div>
                </div>
              </div>

              {/* Training Metrics */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 mb-4">
                <h3 className="text-[var(--color-secondary-text)] font-semibold mb-3">Training Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accuracy</span>
                      <span className="text-[var(--color-success)]">{(modelMetrics.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                      <div 
                        className="bg-[var(--color-success)] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${modelMetrics.accuracy * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Loss</span>
                      <span className="text-[var(--color-error)]">{modelMetrics.loss.toFixed(4)}</span>
                    </div>
                    <div className="w-full bg-[var(--color-border)] rounded-full h-2">
                      <div 
                        className="bg-[var(--color-error)] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(1 - modelMetrics.loss) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-[var(--color-secondary-text)]">
                    Epochs: {modelMetrics.epochs}/7
                  </div>
                </div>
              </div>

              {/* Debug Console */}
              <div className="bg-gray-900 border border-[var(--color-border)] rounded-lg p-4 h-64 overflow-y-auto">
                {debugLog.length === 0 ? (
                  <div className="text-gray-500 italic">
                    Training logs will appear here...
                    <br />
                    Click "Train Model" to start neural network training
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
                        line.includes('EPOCH') ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {line}
                      </span>
                    </div>
                  ))
                )}
                {isTraining && !trainingComplete && (
                  <div className="flex items-center text-blue-400 text-sm">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2"></div>
                    Training neural network... Epoch {currentEpoch}/7
                  </div>
                )}
              </div>
            </div>

            {/* AI Predictions */}
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-info)] mb-4 flex items-center">
                🎯 AI Route Predictions
              </h2>
              
              {predictions.length === 0 ? (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 text-center text-[var(--color-secondary-text)]">
                  <div className="text-4xl mb-4">🧠</div>
                  <p>Neural network is analyzing...</p>
                  <p className="text-sm mt-2">Train the model to generate route predictions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-[var(--color-secondary-text)] mb-4">
                    Routes ranked by confidence score:
                  </div>
                  {predictions.map((route, index) => (
                    <Link href={route.path} key={route.path}>
                      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-lg p-4 transition-all duration-200 hover:shadow-lg group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-[var(--color-accent)] group-hover:text-[var(--color-accent-hover)]">
                            {route.name}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-mono text-[var(--color-success)]">
                              {(route.confidence * 100).toFixed(1)}%
                            </div>
                            <div className="text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </div>
                          </div>
                        </div>
                        <div className="text-[var(--color-secondary-text)] text-sm mb-2">
                          {route.desc}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-[var(--color-secondary-text)] font-mono">
                            {route.path}
                          </div>
                          <div className="w-20 bg-[var(--color-border)] rounded-full h-2">
                            <div 
                              className="bg-[var(--color-success)] h-2 rounded-full"
                              style={{ width: `${route.confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <h3 className="text-lg font-semibold text-[var(--color-accent)] mb-4">
              🚀 Navigation
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/">
                <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  🏠 Home
                </button>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="bg-[var(--color-border)] hover:bg-gray-400 text-[var(--color-primary-text)] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ⬅️ Back
              </button>
            </div>
          </div>

          {/* AI Fun Fact */}
          <div className="mt-6 bg-[var(--color-info-bg)] border border-[var(--color-info)] rounded-lg p-4">
            <p className="text-[var(--color-info)] text-sm">
              <span className="font-semibold">AI Fact:</span> This neural network uses transformer architecture 
              similar to GPT models to understand URL patterns and predict relevant routes! 🤖
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}