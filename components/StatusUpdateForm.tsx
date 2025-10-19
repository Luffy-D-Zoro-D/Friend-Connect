
import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons';

interface StatusUpdateFormProps {
  currentStatus: string;
  onSubmit: (newStatus: string) => void;
  onGetSuggestion: () => Promise<string>;
  isGenerating: boolean;
}

export default function StatusUpdateForm({ onSubmit, onGetSuggestion, isGenerating }: StatusUpdateFormProps) {
  const [newStatus, setNewStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await onSubmit(newStatus);
    setNewStatus('');
    setIsSubmitting(false);
  };

  const handleSuggestionClick = async () => {
    const suggestion = await onGetSuggestion();
    if (suggestion) {
      setNewStatus(suggestion);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-center">What are you up to?</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            placeholder="e.g., Working on a project..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-4 pr-28 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            maxLength={50}
          />
          <button
            type="button"
            onClick={handleSuggestionClick}
            disabled={isGenerating}
            className="absolute inset-y-0 right-0 flex items-center px-3 m-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed transition-colors"
          >
            <SparklesIcon className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="ml-2 text-sm font-semibold">{isGenerating ? '...' : 'Suggest'}</span>
          </button>
        </div>
        <button
          type="submit"
          disabled={!newStatus.trim() || isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Updating...' : 'Update Status'}
        </button>
      </form>
    </div>
  );
}
