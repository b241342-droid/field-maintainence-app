'use client';
import { useState } from 'react';
import { Bot, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function AIAssistant({ equipmentType, description }) {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSuggest = async () => {
    if (!description || !equipmentType) {
      setError('Both equipment type and description must be filled to get AI suggestions.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/ai/suggest', {
        description,
        equipmentType
      });
      setSuggestion(res.data.suggestion);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to get suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl p-6 border border-indigo-100/60 shadow-inner">
      <div className="flex items-center gap-3 mb-5 text-indigo-900">
        <div className="bg-indigo-100 p-2 rounded-xl">
          <Bot className="w-5 h-5 text-indigo-700" />
        </div>
        <h3 className="font-semibold text-lg">Gemini AI Assistant</h3>
      </div>
      
      {!suggestion ? (
        <button
          onClick={handleSuggest}
          disabled={isLoading || !description || !equipmentType}
          className="flex items-center justify-center w-full sm:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-md"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {isLoading ? 'Generating Analysis...' : 'Generate Repair Plan'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="prose prose-sm md:prose-base prose-indigo max-w-none text-slate-700 bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-indigo-200/50 shadow-sm whitespace-pre-wrap leading-relaxed">
            {suggestion}
          </div>
          <button
            onClick={() => setSuggestion('')}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-2 py-1 transition-colors"
          >
            Clear analysis
          </button>
        </div>
      )}
      
      {error && (
        <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg mt-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
