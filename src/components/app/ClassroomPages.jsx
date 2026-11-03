import { ClassroomView, WordAssignmentSession } from './pageComponents'
import AppLayout from '../layout/AppLayout'

// Pure page assembly: return the original page element without another React wrapper.
export function renderClassroomPage({ navigation, catalog, account, shell }) {
  switch (navigation.view) {
    case 'classroom':
      return (
        <ClassroomView
          key={account.authUser?.id || 'guest'}
          user={account.authUser}
          navItems={shell.selectionNavItems}
          topbarProps={shell.selectionTopbarProps}
          onAuthOpen={() => account.setShowAuthModal(true)}
          onProfileUpdated={account.handleClassroomProfileUpdated}
          onSync={account.handleManualSync}
          initialVocabulary={catalog.vocabulary}
          onStartAssignment={navigation.handleStartReadingAssignment}
        />
      )
    case 'wordAssignment':
      return navigation.activeWordAssignment ? (
        <WordAssignmentSession
          key={`${account.authUser?.id}:${navigation.activeWordAssignment.id}`}
          assignment={navigation.activeWordAssignment}
          userId={account.authUser?.id}
          navItems={shell.selectionNavItems}
          topbarProps={shell.selectionTopbarProps}
          onBack={() => {
            navigation.setActiveWordAssignment(null)
            navigation.setView(navigation.assignmentReturnView)
          }}
        />
      ) : (
        <AppLayout title="班级作业" navItems={shell.selectionNavItems} topbarProps={shell.selectionTopbarProps}>
          <div className="classroom-panel">
            <p>请从任务列表重新进入作业。</p>
            <button type="button" className="exam-back-button" onClick={() => navigation.setView('studyHub')}>
              返回今日计划
            </button>
          </div>
        </AppLayout>
      )
    default:
      return null
  }
}
