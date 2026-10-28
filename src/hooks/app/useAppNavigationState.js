import { useState, useRef } from 'react'

// Own shared view and study-selection state; browser history mirrors these values.
export function useAppNavigationState() {
  const [view, setView] = useState('studyHub')
  const [mode, setMode] = useState('learn')
  const [examScope, setExamScope] = useState('all')
  const [examPreparing, setExamPreparing] = useState(false)
  const [examPreparationError, setExamPreparationError] = useState(null)
  const examRequestRef = useRef(0)
  const planRequestRef = useRef(0)
  const [assessmentBackTarget, setAssessmentBackTarget] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedToeflLevel, setSelectedToeflLevel] = useState('')
  const [selectedToeflList, setSelectedToeflList] = useState('')
  const [selectedIeltsTopic, setSelectedIeltsTopic] = useState('')
  const [selectedIeltsList, setSelectedIeltsList] = useState('')
  const [selectedReadingId, setSelectedReadingId] = useState(null)
  const [activeReadingAssignment, setActiveReadingAssignment] = useState(null)
  const [activeWordAssignment, setActiveWordAssignment] = useState(null)
  const [readingRetry, setReadingRetry] = useState(null)
  const [assignmentReturnView, setAssignmentReturnView] = useState('studyHub')
  const [homePanelRequest, setHomePanelRequest] = useState({ panel: '', nonce: 0 })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffledWords, setShuffledWords] = useState([])
  const pendingStartWordIdRef = useRef(null)

  return {
    view, setView, mode, setMode, examScope, setExamScope, examPreparing, setExamPreparing,
    examPreparationError, setExamPreparationError, examRequestRef, planRequestRef, assessmentBackTarget,
    setAssessmentBackTarget, selectedCategory, setSelectedCategory, selectedToeflLevel, setSelectedToeflLevel,
    selectedToeflList, setSelectedToeflList, selectedIeltsTopic, setSelectedIeltsTopic, selectedIeltsList,
    setSelectedIeltsList, selectedReadingId, setSelectedReadingId, activeReadingAssignment,
    setActiveReadingAssignment, activeWordAssignment, setActiveWordAssignment, readingRetry, setReadingRetry,
    assignmentReturnView, setAssignmentReturnView, homePanelRequest, setHomePanelRequest, currentIndex,
    setCurrentIndex, shuffledWords, setShuffledWords, pendingStartWordIdRef,
  }
}
