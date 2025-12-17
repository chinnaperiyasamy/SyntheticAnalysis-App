import React from 'react';
import { AIAnalysisResult } from '../types';
import { ICONS } from '../constants';

interface AIAnalysisProps {
  result: AIAnalysisResult | null;
  isLoading: boolean;
  onAnalyze: () => void;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ result, isLoading, onAnalyze }) => {
  if (!result && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
        <ICONS.Zap className="w-10 h-10 text-amber-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-200 mb-2">Unlock AI Insights</h3>
        <p className="text-slate-400 text-center max-w-md mb-6">
          Use Gemini AI to analyze your metric patterns, detect anomalies, and receive optimization recommendations.
        </p>
        <button 
          onClick={onAnalyze}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2 px-6 rounded-full shadow-lg shadow-blue-900/30 transition-all transform hover:scale-105"
        >
          Generate Analysis
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-800 rounded-xl border border-slate-700 animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300">Consulting Gemini...</p>
      </div>
    );
  }

  if (!result) return null;

  const severityColor = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
  }[result.severity] || "bg-slate-700 text-slate-300";

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-900/50 to-slate-800 p-6 border-b border-slate-700 flex justify-between items-start">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
                <ICONS.Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white">AI Analysis Report</h3>
                <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
            </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${severityColor}`}>
          {result.severity} Severity
        </span>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h4>
          <p className="text-slate-200 leading-relaxed">{result.summary}</p>
        </div>

        <div>
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Recommendations</h4>
            <ul className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">
                            {idx + 1}
                        </span>
                        <span className="text-slate-300 text-sm">{rec}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};
