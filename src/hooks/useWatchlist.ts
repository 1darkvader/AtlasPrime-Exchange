import { useState, useEffect } from "react";

const WATCHLIST_KEY = "atlasprime_watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      } else {
        // Default watchlist
        setWatchlist(["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"]);
      }
    } catch (error) {
      console.error("Error loading watchlist:", error);
      setWatchlist(["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
      } catch (error) {
        console.error("Error saving watchlist:", error);
      }
    }
  }, [watchlist, loading]);

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist((prev) => [...prev, symbol]);
      return true;
    }
    return false;
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol);
  };

  const toggleWatchlist = (symbol: string) => {
    if (isInWatchlist(symbol)) {
      removeFromWatchlist(symbol);
      return false;
    } else {
      addToWatchlist(symbol);
      return true;
    }
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  const reorderWatchlist = (fromIndex: number, toIndex: number) => {
    const newWatchlist = [...watchlist];
    const [moved] = newWatchlist.splice(fromIndex, 1);
    newWatchlist.splice(toIndex, 0, moved);
    setWatchlist(newWatchlist);
  };

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    reorderWatchlist,
  };
}
