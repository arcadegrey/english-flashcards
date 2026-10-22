import { createContext, useContext } from 'react';

export const ExamHistoryContext = createContext(null);
export const useExamHistory = () => useContext(ExamHistoryContext);
