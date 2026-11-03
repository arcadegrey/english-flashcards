import { WordCollectionView } from './pageComponents'
import { COLLECTION_PRACTICE_SOURCES } from '../../../shared/collectionPractice.js'

export function renderWordCollectionPage({ navigation, learning, catalog, overview, account, shell }) {
  const commonProps = {
    onBack: navigation.handleBackToHome,
    onHome: navigation.handleBackToStudyHub,
    onOpenMode: navigation.handleOpenModeFromCollection,
    onSyncAccount: account.handleHomeSync,
    onOpenReading: navigation.handleOpenReadingList,
    navItems: shell.selectionNavItems,
    topbarProps: shell.selectionTopbarProps,
    practiceSource: Object.hasOwn(COLLECTION_PRACTICE_SOURCES, navigation.view) ? navigation.view : undefined,
    practiceOwner: navigation.collectionPractice.owner,
    onStartPractice: navigation.collectionPractice.open,
    practiceBusy: Boolean(navigation.collectionPractice.preparation?.loading),
    practiceError: navigation.collectionPractice.preparation?.error || '',
  }
  switch (navigation.view) {
    case 'savedWords':
      return <WordCollectionView {...commonProps}
        title="我的收藏"
        subtitle={account.authUser?.id ? '收藏独立于学习状态，随账号同步。取消收藏不会删除学习记录。' : '访客收藏仅保存在当前设备，登录后可随学习进度合并到账号。'}
        words={overview.savedWordList}
        wordIds={Object.entries(learning.wordBookmarks).filter(([, entry]) => entry.saved).map(([id]) => id)}
        loading={catalog.savedWordsLoading}
        emptyTitle={catalog.savedWordsLoading ? '正在准备收藏' : catalog.savedWordsError ? '收藏词汇暂不可用' : '还没有收藏'}
        emptyHint={catalog.savedWordsLoading ? '正在加载收藏词汇…' : catalog.savedWordsError || '还没有收藏，点击单词卡右上角的星标即可保存。'}
        statusMessage={catalog.savedWordsLoading ? '正在加载完整词库…' : catalog.savedWordsError || (overview.unavailableSavedCount ? `${overview.unavailableSavedCount} 个收藏词暂时无法匹配，收藏记录已保留。` : '')}
        onRetry={catalog.savedWordsError || (overview.unavailableSavedCount && !catalog.fullVocabularyLoadedRef.current) ? navigation.handleOpenSavedWords : undefined}
        onMarkAsUnknown={learning.setWordAsLearned}
        onMarkAsMastered={learning.setWordAsMastered}
        active="words"
        progressLabel="收藏词汇"
      />
    case 'todayReview':
      return (
        <WordCollectionView {...commonProps}
          title="今日复习"
          subtitle="这些是今天需要回顾的已学习或已标记认识的单词"
          words={overview.todayReviewWordList}
          mode={navigation.mode}
          emptyHint="今天没有到期复习词，保持得很好。"
          onMarkAsUnknown={learning.setWordAsLearned}
          onMarkAsMastered={learning.setWordAsMastered}
          progressLabel="今日复习"
          active="review"
          emptyArtSrc="/images/ui-assets/training-card-review-blue-v1.png"
        />
      )
    case 'wrongWords':
      return (
        <WordCollectionView {...commonProps}
          title="错题本"
          subtitle="这里会展示你在测验、填空、拼写中答错过的单词"
          words={overview.wrongWordList}
          wordIds={learning.wrongWords}
          mode={navigation.mode}
          emptyHint="错题本暂时是空的，答错的词会自动出现在这里。"
          onMarkAsUnknown={learning.setWordAsLearned}
          onMarkAsMastered={learning.setWordAsMastered}
          progressLabel="待巩固"
          active="review"
          emptyArtSrc="/images/ui-assets/training-card-review-blue-v1.png"
        />
      )
    case 'learnedWords':
      return (
        <WordCollectionView {...commonProps}
          title="已学习单词"
          subtitle="这里会展示你标记为“已学习”的所有单词"
          words={overview.learnedWordList}
          wordIds={learning.learnedWords}
          mode={navigation.mode}
          emptyHint="你还没有已学习单词，先进入学习模式标记一些吧。"
          onMarkAsUnknown={learning.setWordAsLearned}
          onMarkAsMastered={navigation.markLearnedWordAsMastered}
          masteredActionLabel="认识了"
          active="words"
          emptyArtSrc="/images/ui-assets/category-all-words-blue-v1.png"
        />
      )
    case 'masteredWords':
      return (
        <WordCollectionView {...commonProps}
          title="认识标记"
          subtitle="来自自评或练习结果的认识标记，不代表已验证长期记忆；仍按计划复习。"
          words={overview.masteredWordList}
          wordIds={learning.masteredWords}
          mode={navigation.mode}
          emptyHint="还没有认识标记，可在学习或练习中记录。"
          onMarkAsUnknown={navigation.markMasteredWordAsLearned}
          onMarkAsMastered={learning.setWordAsMastered}
          active="words"
          emptyArtSrc="/images/ui-assets/training-card-review-blue-v1.png"
        />
      )
    default:
      return null
  }
}
