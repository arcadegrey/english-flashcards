export function applyInitialTheme() {
  try {
    document.documentElement.classList.toggle('dark', localStorage.getItem('flashcards_theme') === 'dark')
  } catch {
    document.documentElement.classList.remove('dark')
  }
}
