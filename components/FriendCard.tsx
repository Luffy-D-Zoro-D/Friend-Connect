import React from 'react';
import type { Friend } from '../types';

interface FriendCardProps {
  friend: Friend;
  isCurrentUser: boolean;
  onShowHistory: () => void;
}

export default function FriendCard({ friend, isCurrentUser, onShowHistory }: FriendCardProps) {
  const cardClasses = `
    relative p-6 rounded-2xl shadow-lg transition-all duration-300
    bg-slate-800 border border-slate-700
    cursor-pointer hover:bg-slate-700/70 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]
  `;

  return (
    <div className={cardClasses} onClick={onShowHistory}>
      {isCurrentUser && (
        <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          You
        </span>
      )}
      <div className="flex items-center space-x-4">
        <img src={friend.avatarUrl} alt={friend.name} className="w-20 h-20 rounded-full border-4 border-slate-600" />
        <div>
          <h2 className="text-2xl font-bold text-white">{friend.name}</h2>
          <p className="text-sm text-slate-400">is currently...</p>
        </div>
      </div>
      <div className="mt-4 p-4 bg-slate-900/70 rounded-lg min-h-[80px] flex items-center justify-center">
        <p className="text-lg text-center font-medium text-purple-300 animate-pulse-live">
          {friend.currentStatus.text}
        </p>
      </div>
    </div>
  );
}
