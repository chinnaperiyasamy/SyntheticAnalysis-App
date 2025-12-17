import React, { useState, useCallback } from 'react';
import { Dataset, AnalysisStatus, AIAnalysisResult } from './types';
import { parseCSV } from './services/csvService';
import { analyzeMetrics } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { MetricChart } from './components/MetricChart';
import { PercentileChart } from './components/PercentileChart';
import { AIAnalysis } from './components/AIAnalysis';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { ICONS, APP_NAME } from './constants';

const App: React.FC = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const parsedData = parseCSV(content, file.name);
        setDataset(parsedData);
        setAiResult(null); // Reset previous analysis
        setAnalysisStatus(AnalysisStatus.IDLE);
      } catch (err) {
        console.error(err);
        alert("Failed to parse CSV. Please ensure it has a valid format.");
      }
    };
    reader.readAsText(file);
  }, []);

  const handleRunAnalysis = async () => {
    if (!dataset) return;
    
    setAnalysisStatus(AnalysisStatus.LOADING);
    try {
      const result = await analyzeMetrics(dataset.summaries);
      setAiResult(result);
      setAnalysisStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setAnalysisStatus(AnalysisStatus.ERROR);
      alert("Failed to generate AI analysis. Please check your API key and try again.");
    }
  };

  const reset = () => {
    setDataset(null);
    setAiResult(null);
    setAnalysisStatus(AnalysisStatus.IDLE);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <ICONS.Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {APP_NAME}
            </h1>
          </div>
          {dataset && (
            <Button variant="ghost" size="sm" onClick={reset} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
              Reset Data
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {!dataset ? (
          <div className="max-w-2xl mx-auto mt-20 animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Analyze System Performance</h2>
              <p className="text-slate-400">Upload your metrics CSV file to visualize performance bottlenecks and get AI-driven insights instantly.</p>
            </div>
            <FileUpload onFileSelect={handleFileSelect} />
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-slate-500">
                <div className="p-4 bg-slate-800/30 rounded-lg">
                    <ICONS.Server className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <span className="text-sm">Resource Usage</span>
                </div>
                 <div className="p-4 bg-slate-800/30 rounded-lg">
                    <ICONS.Activity className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <span className="text-sm">Percentile Stats</span>
                </div>
                 <div className="p-4 bg-slate-800/30 rounded-lg">
                    <ICONS.Zap className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <span className="text-sm">Gemini AI Insights</span>
                </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dataset.summaries.slice(0, 4).map((summary) => (
                <Card key={summary.metric} className="bg-slate-800/60">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider truncate" title={summary.metric}>
                        {summary.metric}
                     </span>
                     <ICONS.Activity className="w-4 h-4 text-slate-500" />
                   </div>
                   <div className="text-2xl font-bold text-white mb-1">
                      {summary.avg.toFixed(2)} <span className="text-xs font-normal text-slate-500">avg</span>
                   </div>
                   <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden mt-2">
                      <div 
                        className="bg-blue-500 h-full rounded-full" 
                        style={{ width: `${Math.min(100, (summary.avg / (summary.max || 1)) * 100)}%` }} 
                      />
                   </div>
                   <div className="flex justify-between mt-2 text-xs text-slate-400">
                      <span>Max: {summary.max}</span>
                      <span>P99: {summary.p99}</span>
                   </div>
                </Card>
              ))}
            </div>

            {/* AI Analysis Section */}
            <AIAnalysis 
              result={aiResult} 
              isLoading={analysisStatus === AnalysisStatus.LOADING} 
              onAnalyze={handleRunAnalysis} 
            />

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card title="Time Series Metrics">
                  <MetricChart data={dataset.data} numericColumns={dataset.numericColumns} />
                </Card>
              </div>
              <div className="lg:col-span-1">
                <Card title="Distribution (P95, P99, Max)">
                  <PercentileChart summaries={dataset.summaries} />
                </Card>
              </div>
            </div>

            {/* Detailed Table (Optional view) */}
            <Card title="Raw Data Summary">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-slate-700 bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-400">Metric</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-400">Min</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-400">Average</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-400">P95</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-400">P99</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-400">Max</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {dataset.summaries.map((s) => (
                                <tr key={s.metric} className="hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-200">{s.metric}</td>
                                    <td className="px-6 py-4 text-slate-400">{s.min}</td>
                                    <td className="px-6 py-4 text-blue-400 font-medium">{s.avg}</td>
                                    <td className="px-6 py-4 text-slate-400">{s.p95}</td>
                                    <td className="px-6 py-4 text-slate-400">{s.p99}</td>
                                    <td className="px-6 py-4 text-slate-400">{s.max}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
