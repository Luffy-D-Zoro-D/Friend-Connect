
import React from 'react';
import type { Status } from '../types';
import { ClockIcon, CloseIcon } from './icons';

interface StatusHistoryModalProps {
  friendName: string;
  history: Status[];
  onClose: () => void;
}

// A simple time ago function
const timeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};


export default function StatusHistoryModal({ friendName, history, onClose }: StatusHistoryModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold">{friendName}'s History</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          <ul className="space-y-4">
            {history.map((status) => (
              <li key={status.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full ring-2 ring-gray-600"></div>
                </div>
                <div>
                  <p className="font-semibold text-white">{status.text}</p>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <ClockIcon className="w-4 h-4 mr-1.5" />
                    <span>{timeAgo(status.timestamp)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
