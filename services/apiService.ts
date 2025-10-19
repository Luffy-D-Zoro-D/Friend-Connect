import type { Friend, FriendsData, Status } from '../types';

const DB_KEY = 'friendConnectData';
const SESSION_KEY = 'friendConnectSession';

// Initialize the DB in localStorage if it doesn't exist
const initializeDb = () => {
  if (localStorage.getItem(DB_KEY)) {
    return;
  }
  const now = new Date();
  const initialDb: FriendsData = {
    friend1: {
      id: 'friend1',
      name: 'Friend 1',
      avatarUrl: 'https://picsum.photos/seed/friend1/200',
      currentStatus: {
        id: 's1-init',
        text: 'Ready to connect!',
        timestamp: now,
      },
      statusHistory: [
        { id: 's1-init', text: 'Ready to connect!', timestamp: now },
      ],
    },
    friend2: {
      id: 'friend2',
      name: 'Friend 2',
      avatarUrl: 'https://picsum.photos/seed/friend2/200',
      currentStatus: {
        id: 's2-init',
        text: 'Waiting for a friend...',
        timestamp: now,
      },
      statusHistory: [
        { id: 's2-init', text: 'Waiting for a friend...', timestamp: now },
      ],
    },
  };
  localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
};

// Always initialize on module load
initializeDb();

const getDb = (): FriendsData => {
  const data = localStorage.getItem(DB_KEY);
  // Re-hydrate dates from string format
  return JSON.parse(data!, (key, value) => {
    if (key === 'timestamp') return new Date(value);
    return value;
  });
};

const saveDb = (data: FriendsData) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// API functions
export const getFriendsData = async (): Promise<FriendsData> => {
  return Promise.resolve(getDb());
};

export const updateMyStatus = async (userId: 'friend1' | 'friend2', newStatusText: string): Promise<Friend> => {
  const db = getDb();

  const newStatus: Status = {
    id: `s-${Date.now()}`,
    text: newStatusText,
    timestamp: new Date(),
  };

  db[userId] = {
    ...db[userId],
    currentStatus: newStatus,
    statusHistory: [newStatus, ...db[userId].statusHistory],
  };
  
  saveDb(db);
  
  return Promise.resolve(db[userId]);
};

export const updateProfile = async (userId: 'friend1' | 'friend2', name: string, avatarUrl: string): Promise<Friend> => {
    const db = getDb();
    
    db[userId] = {
        ...db[userId],
        name: name || db[userId].name,
        avatarUrl: avatarUrl || db[userId].avatarUrl,
    };
    
    saveDb(db);
    return Promise.resolve(db[userId]);
};


// Session Management
export const getCurrentUserSession = (): 'friend1' | 'friend2' | null => {
  return localStorage.getItem(SESSION_KEY) as 'friend1' | 'friend2' | null;
};

export const setCurrentUserSession = (userId: 'friend1' | 'friend2') => {
  localStorage.setItem(SESSION_KEY, userId);
};

export const clearCurrentUserSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
