import { renderDashboardPage } from './DashboardPages'
import { renderLearningPage } from './LearningPages'
import { renderClassroomPage } from './ClassroomPages'
import { renderVocabularyDirectoryPage } from './VocabularyDirectoryPage'
import { renderWordCollectionPage } from './WordCollectionPage'

// Keep the real page element at this position so route groups do not add a
// remount boundary. Feature hooks still own all state and async operations.
export default function AppPages(features) {
  switch (features.navigation.view) {
    case 'studyHub':
    case 'home':
    case 'planSettings':
    case 'statistics':
      return renderDashboardPage(features)
    case 'learn':
    case 'readingSession':
    case 'examPractice':
      return renderLearningPage(features)
    case 'classroom':
    case 'wordAssignment':
      return renderClassroomPage(features)
    case 'toeflLevels':
    case 'toeflLists':
    case 'ieltsTopics':
    case 'ieltsLists':
      return renderVocabularyDirectoryPage(features)
    case 'savedWords':
    case 'todayReview':
    case 'wrongWords':
    case 'learnedWords':
    case 'masteredWords':
      return renderWordCollectionPage(features)
    default:
      return null
  }
}
