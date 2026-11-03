import { lazy } from 'react'
import { loadLearningView } from '../../utils/learningViewLoader.js'
import { loadHomeView, loadStatisticsView, loadCollectionView, loadReadingView, loadExamView, loadPlanView, loadCollectionPracticeView, loadCollectionAssessmentView } from '../../utils/pageViewLoader.js'

// Stable lazy component types shared by the pure page-assembly functions.
// Existing preparation loaders still own requests, stylesheet retries and reuse.
export const HomeScreen = lazy(loadHomeView)
export const Statistics = lazy(loadStatisticsView)
export const WordCollectionView = lazy(loadCollectionView)
export const LearningView = lazy(loadLearningView)
export const ReadingSessionView = lazy(loadReadingView)
export const ExamPracticeView = lazy(loadExamView)
export const PlanSettingsView = lazy(loadPlanView)
export const ClassroomView = lazy(() => import('../ClassroomView'))
export const WordAssignmentSession = lazy(() => import('../classroom/WordAssignmentSession'))
export const ToeflSelectionView = lazy(() => import('../ToeflSelectionView'))
export const CollectionPracticeView = lazy(loadCollectionPracticeView)
export const CollectionAssessmentPage = lazy(loadCollectionAssessmentView)
