import { ToeflSelectionView } from './pageComponents'
import { TOEFL_UNKNOWN_LEVEL } from '../../utils/vocabularyCatalog.js'
import { speak } from '../../utils/speech'

export function renderVocabularyDirectoryPage({ navigation, catalog, account, shell }) {
  const commonProps = {
    isPreparing: navigation.vocabularyPreparing,
    preparationError: navigation.vocabularyPreparationError,
    onRetryPreparation: navigation.retryVocabularyPreparation,
    syncing: account.syncState === 'syncing',
    onSyncAccount: account.handleHomeSync,
    navItems: shell.selectionNavItems,
    topbarProps: shell.selectionTopbarProps,
    active: "words",
  }
  switch (navigation.view) {
    case 'toeflLevels':
      return (
        <ToeflSelectionView {...commonProps}
          mode="level"
          title="托福词汇分级"
          subtitle="先选择 Level，再进入对应 List；也可以直接学习全部托福词汇。"
          items={catalog.toeflGrouping.levels}
          totalCount={catalog.toeflGrouping.total}
          onBack={navigation.handleBackToHome}
          onSelect={navigation.handleToeflLevelSelect}
          onSelectAll={navigation.handleStartAllToefl}
          onSpeakIntro={() => speak('TOEFL vocabulary. Choose a level, then choose a list to start.', { rate: 1 })}
          selectAllLabel="学习全部托福词汇"
          vocabularyLabel="托福词汇"
          listLabel="托福 List"
          selectionKind="toefl-level"
        />
      )
    case 'toeflLists': {
      const levelLabel =
        navigation.selectedToeflLevel === TOEFL_UNKNOWN_LEVEL ? '未分级' : `Level ${navigation.selectedToeflLevel}`
      const totalForLevel = catalog.toeflListsForSelectedLevel.reduce((sum, item) => sum + item.count, 0)
      return (
        <ToeflSelectionView {...commonProps}
          mode="list"
          title={levelLabel}
          subtitle="选择 List 开始学习，或者直接学习当前 Level 全部词汇。"
          items={catalog.toeflListsForSelectedLevel}
          totalCount={totalForLevel}
          onBack={() => navigation.setView('toeflLevels')}
          onSelect={navigation.handleToeflListSelect}
          onSelectAll={navigation.handleStartCurrentLevel}
          onSpeakIntro={() => speak(`${levelLabel}. Choose a list to start, or study all words in this level.`, { rate: 1 })}
          selectAllLabel={`学习${levelLabel}全部词汇`}
          vocabularyLabel="托福词汇"
          listLabel="托福 List"
          selectionKind="toefl-list"
        />
      )
    }
    case 'ieltsTopics':
      return (
        <ToeflSelectionView {...commonProps}
          mode="level"
          title="雅思词汇主题"
          subtitle="先选择主题，再进入对应 List；也可以直接学习全部雅思词汇。"
          items={catalog.ieltsGrouping.topics}
          totalCount={catalog.ieltsGrouping.total}
          onBack={navigation.handleBackToHome}
          onSelect={navigation.handleIeltsTopicSelect}
          onSelectAll={navigation.handleStartAllIelts}
          onSpeakIntro={() => speak('IELTS vocabulary. Choose a topic, then choose a list to start.', { rate: 1 })}
          selectAllLabel="学习全部雅思词汇"
          vocabularyLabel="雅思词汇"
          listLabel="雅思主题"
          selectionKind="ielts-topic"
        />
      )
    case 'ieltsLists': {
      const topicLabel =
        catalog.ieltsGrouping.topics.find((item) => item.key === navigation.selectedIeltsTopic)?.label || '未分主题'
      const totalForTopic = catalog.ieltsListsForSelectedTopic.reduce((sum, item) => sum + item.count, 0)
      return (
        <ToeflSelectionView {...commonProps}
          mode="list"
          title={topicLabel}
          subtitle="选择 List 开始学习，或者直接学习当前主题全部词汇。"
          items={catalog.ieltsListsForSelectedTopic}
          totalCount={totalForTopic}
          onBack={() => navigation.setView('ieltsTopics')}
          onSelect={navigation.handleIeltsListSelect}
          onSelectAll={navigation.handleStartCurrentIeltsTopic}
          onSpeakIntro={() => speak(`${topicLabel}. Choose a list to start, or study all words in this topic.`, { rate: 1 })}
          selectAllLabel={`学习${topicLabel}全部词汇`}
          vocabularyLabel="雅思词汇"
          listLabel="雅思 List"
          selectionKind="ielts-list"
        />
      )
    }
    default:
      return null
  }
}
