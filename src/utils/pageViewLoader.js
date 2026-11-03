import { createLearningViewLoader, loadLearningView, withStylesheetRetry } from './learningViewLoader.js'

const page = importer => createLearningViewLoader(withStylesheetRetry(importer))

// The intent path and React.lazy must reuse the exact same promise.
export const loadHomeView = page(() => import('../components/HomeScreen.jsx'))
export const loadStatisticsView = page(() => import('../components/Statistics.jsx'))
export const loadCollectionView = page(() => import('../components/WordCollectionView.jsx'))
export const loadReadingView = page(() => import('../components/ReadingSessionView.jsx'))
export const loadExamView = page(() => import('../components/ExamPracticeView.jsx'))
export const loadPlanView = page(() => import('../components/PlanSettingsView.jsx'))
export const loadCollectionPracticeView = page(() => import('../components/assessment/CollectionPracticeView.jsx'))
export const loadCollectionAssessmentView = page(() => import('../components/assessment/CollectionAssessmentPage.jsx'))

const loaders = { home: loadHomeView, statistics: loadStatisticsView, collection: loadCollectionView,
  readingSession: loadReadingView, examPractice: loadExamView, planSettings: loadPlanView,
  learn: loadLearningView, assessment: () => loadLearningView('quiz') }
export function prepareNavigation(key) {
  if (key.startsWith('reading:')) {
    // One article plus the fixed ~48 KiB gzip public lookup, shared by all
    // articles. No full study pool, examples, audio or account API requests.
    return Promise.all([loadReadingView(), import('../data/readingDelivery.js')
      .then(module => module.loadReadingArticle.prefetch(key.slice(8))),
    import('../data/readingVocabulary.js').then(module => module.loadReadingVocabulary.prefetch())])
  }
  return loaders[key]?.()
}
