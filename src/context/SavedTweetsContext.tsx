import React, { createContext, useContext, useState, useCallback } from 'react';
import { SavedTweet } from '../services/supabase';
import { getSavedTweets, saveTweet as saveTweetService, deleteSavedTweet as deleteTweetService, updateTweet as updateTweetService } from '../services/tweets';

interface SavedTweetsContextType {
  tweets: SavedTweet[];
  isLoading: boolean;
  loadTweets: () => Promise<void>;
  saveTweet: (content: string, sourceText?: string) => Promise<void>;
  updateTweet: (id: number, content: string) => Promise<void>;
  deleteTweet: (id: number) => Promise<void>;
}

const SavedTweetsContext = createContext<SavedTweetsContextType | undefined>(undefined);

export function SavedTweetsProvider({ children }: { children: React.ReactNode }) {
  const [tweets, setTweets] = useState<SavedTweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTweets = useCallback(async () => {
    try {
      setIsLoading(true);
      const savedTweets = await getSavedTweets();
      setTweets(savedTweets);
    } catch (error) {
      console.error('Failed to load tweets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveTweet = useCallback(async (content: string, sourceText?: string) => {
    try {
      const savedTweet = await saveTweetService(content, sourceText);
      if (savedTweet) {
        setTweets(prev => [savedTweet, ...prev]);
      }
    } catch (error) {
      console.error('Failed to save tweet:', error);
      throw error;
    }
  }, []);

  const updateTweet = useCallback(async (id: number, content: string) => {
    try {
      const updatedTweet = await updateTweetService(id, content);
      if (updatedTweet) {
        setTweets(prev => prev.map(tweet => 
          tweet.id === id ? updatedTweet : tweet
        ));
      }
    } catch (error) {
      console.error('Failed to update tweet:', error);
      throw error;
    }
  }, []);

  const deleteTweet = useCallback(async (id: number) => {
    try {
      await deleteTweetService(id);
      setTweets(prev => prev.filter(tweet => tweet.id !== id));
    } catch (error) {
      console.error('Failed to delete tweet:', error);
      throw error;
    }
  }, []);

  React.useEffect(() => {
    loadTweets();
  }, [loadTweets]);

  return (
    <SavedTweetsContext.Provider value={{ tweets, isLoading, loadTweets, saveTweet, updateTweet, deleteTweet }}>
      {children}
    </SavedTweetsContext.Provider>
  );
}

export function useSavedTweets() {
  const context = useContext(SavedTweetsContext);
  if (context === undefined) {
    throw new Error('useSavedTweets must be used within a SavedTweetsProvider');
  }
  return context;
} 