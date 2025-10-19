import React, { useState, useEffect, useCallback } from 'react';
import type { Friend, FriendsData } from './types';
import { 
  getFriendsData, 
  updateMyStatus, 
  updateProfile,
  getCurrentUserSession,
  setCurrentUserSession,
  clearCurrentUserSession,
} from './services/apiService';
import FriendCard from './components/FriendCard';
import StatusUpdateForm from './components/StatusUpdateForm';
import StatusHistoryModal from './components/StatusHistoryModal';
import { LogoutIcon, UserIcon, PhotoIcon } from './components/icons';

// --- Login Components ---

interface LoginCardProps {
    friend: Friend;
    onLogin: (userId: 'friend1' | 'friend2', name: string, avatarUrl: string) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ friend, onLogin }) => {
    const isPlaceholder = friend.name === 'Friend 1' || friend.name === 'Friend 2';
    const [name, setName] = useState(isPlaceholder ? '' : friend.name);
    const [avatarUrl, setAvatarUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(friend.id, name, avatarUrl);
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl shadow-lg w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center mb-2">Login as...</h2>
            <div className="flex flex-col items-center mb-4">
                <img src={avatarUrl || friend.avatarUrl} alt={friend.name} className="w-24 h-24 rounded-full border-4 border-slate-600 mb-2" />
                <p className="text-xl font-semibold">{isPlaceholder ? 'Available Slot' : friend.name}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor={`name-${friend.id}`} className="block text-sm font-medium text-slate-400 mb-1">
                        Your Name
                    </label>
                    <div className="relative">
                        <UserIcon className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            id={`name-${friend.id}`}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor={`avatar-${friend.id}`} className="block text-sm font-medium text-slate-400 mb-1">
                        Avatar URL (Optional)
                    </label>
                    <div className="relative">
                        <PhotoIcon className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                         <input
                            id={`avatar-${friend.id}`}
                            type="text"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="e.g., https://picsum.photos/200"
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed transition-colors"
                    disabled={!name.trim()}
                >
                    {isPlaceholder ? 'Claim Spot & Login' : `Login as ${name}`}
                </button>
            </form>
        </div>
    );
};


interface LoginProps {
  onLogin: (userId: 'friend1' | 'friend2', name: string, avatarUrl: string) => void;
  friendsData: FriendsData | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, friendsData }) => {
  if (!friendsData) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
            <p className="text-center text-lg">Loading login options...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
       <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome to Friend Connect
          </h1>
          <p className="text-slate-400 mt-2">Choose a profile to log in or set up a new one.</p>
        </header>
        <div className="flex flex-col md:flex-row gap-8">
            <LoginCard friend={friendsData.friend1} onLogin={onLogin} />
            <LoginCard friend={friendsData.friend2} onLogin={onLogin} />
        </div>
    </div>
  );
}


// --- Main App Component ---

export default function App() {
  const [friendsData, setFriendsData] = useState<FriendsData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<'friend1' | 'friend2' | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [historyModalFriend, setHistoryModalFriend] = useState<Friend | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFriendsData();
      setFriendsData(data);
    } catch (err) {
      setError('Failed to load friend data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const sessionUserId = getCurrentUserSession();
    if (sessionUserId) {
        setCurrentUserId(sessionUserId);
    }
    loadData();
  }, [loadData]);

  const handleLogin = async (userId: 'friend1' | 'friend2', name: string, avatarUrl: string) => {
    try {
      await updateProfile(userId, name, avatarUrl);
      setCurrentUserSession(userId);
      setCurrentUserId(userId);
      await loadData();
    } catch(err) {
      setError('Failed to login.');
      console.error(err);
    }
  };
  
  const handleLogout = () => {
    clearCurrentUserSession();
    setCurrentUserId(null);
  };

  const handleUpdateStatus = async (newStatusText: string) => {
    if (!friendsData || !newStatusText.trim() || !currentUserId) return;

    try {
      const updatedFriend = await updateMyStatus(currentUserId, newStatusText);
      setFriendsData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          [currentUserId]: updatedFriend,
        }
      });
    } catch (err) {
      setError('Failed to update status.');
      console.error(err);
    }
  };

  if (!currentUserId) {
    return <Login onLogin={handleLogin} friendsData={friendsData} />;
  }

  const me = friendsData?.[currentUserId];
  const friend = friendsData?.[currentUserId === 'friend1' ? 'friend2' : 'friend1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Friend Connect
            </h1>
            <p className="text-slate-400 mt-2">Stay in sync with your best friend.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-red-600/80 transition-colors"
            aria-label="Logout"
          >
            <LogoutIcon className="w-5 h-5"/>
            <span className="hidden sm:inline font-semibold">Logout</span>
          </button>
        </header>

        {isLoading && !friendsData && <p className="text-center text-lg">Loading connection...</p>}
        {error && <p className="text-center text-red-500 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        
        {me && friend && (
          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <FriendCard
                friend={me}
                isCurrentUser={true}
                onShowHistory={() => setHistoryModalFriend(me)}
              />
              <FriendCard
                friend={friend}
                isCurrentUser={false}
                onShowHistory={() => setHistoryModalFriend(friend)}
              />
            </div>

            <StatusUpdateForm
                onSubmit={handleUpdateStatus}
              />
          </main>
        )}
      </div>

      {historyModalFriend && (
        <StatusHistoryModal
          friendName={historyModalFriend.name}
          history={historyModalFriend.statusHistory}
          onClose={() => setHistoryModalFriend(null)}
        />
      )}
    </div>
  );
}