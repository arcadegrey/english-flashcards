import config from './readingCatalog.json'

// Generated from the canonical articles. Unique English tokens retain the exact
// vocabulary lookup rules without placing prose, translations or quizzes in startup.
export const preparedReadings = config.entries
export const readingMetadata = preparedReadings.map(entry => entry.article)
export const READING_CONTENT_VERSION = config.version
