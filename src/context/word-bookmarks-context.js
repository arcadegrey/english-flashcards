import { createContext, useContext } from 'react';

export const WordBookmarksContext = createContext(null);
export const useWordBookmarks = () => useContext(WordBookmarksContext);
