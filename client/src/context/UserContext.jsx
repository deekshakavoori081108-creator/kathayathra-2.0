import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserDashboard } from '../services/api';
import { soundManager } from '../utils/audio';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('katha_yatra_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to initial demo user (id: 1)
    return {
      id: 1,
      username: "Arjun Explorer",
      age_group: "9-12",
      selected_tracks: ["The Epic Ramayana", "Mysteries of Ancient Egypt", "Myths of Ancient Greece"],
      total_stars: 4
    };
  });

  const [soundEnabled, setSoundEnabled] = useState(!soundManager.isMuted());
  const [celebrationData, setCelebrationData] = useState(null);

  // Sync user with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('katha_yatra_user', JSON.stringify(user));
    }
  }, [user]);

  // Refresh user data from backend
  const refreshUser = async () => {
    if (user && user.id) {
      try {
        const data = await getUserDashboard(user.id);
        if (data && data.user) {
          setUser(prev => ({
            ...prev,
            ...data.user,
            total_stars: data.stats ? data.stats.totalStars : data.user.total_stars
          }));
        }
      } catch (e) {
        console.warn("Could not refresh user dashboard:", e.message);
      }
    }
  };

  const toggleSound = () => {
    const nextState = soundManager.toggleSound();
    setSoundEnabled(nextState);
  };

  const triggerStoryUnlock = (story) => {
    soundManager.playUnlockFanfare();
    setCelebrationData(story);
  };

  const closeCelebration = () => {
    setCelebrationData(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        soundEnabled,
        toggleSound,
        celebrationData,
        triggerStoryUnlock,
        closeCelebration
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
