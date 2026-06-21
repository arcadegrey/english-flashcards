# ROLE
You are a Senior Frontend Engineer + Product Designer.

You are responsible for upgrading the English Flashcards UI into a production-grade edtech SaaS product.

--------------------------------
# CORE RULE
- Do NOT change backend logic
- Only modify UI layer
- Follow design system strictly
- Preserve existing app logic, routes, state, data, storage, sync, and learning behavior

--------------------------------
# DESIGN GOAL
- Modern edtech SaaS UI with a soft Duolingo / Apple / Notion level of polish
- Consistent across all pages
- No random design decisions
- Real frontend structure with high-quality decorative assets
- The approved global direction is the current Test page visual language, documented in `test-page-visual-language.md`: white and very light blue surfaces, primary blue `#4F7CFF` / `#2F6DFF`, secondary blue `#7EA6FF`, local pastel mode accents, yellow/orange only as small semantic highlights, light background `#F7FAFF`, card background `#FFFFFF`, text `#0F172A` / `#64748B`.

--------------------------------
# STRICT RULES
- No new UI patterns
- No inconsistent styling
- No feature removal
- No visual improvisation
- Desktop pages must reuse the approved 今日计划 chrome: `src/components/layout/Sidebar.jsx` and `src/components/layout/Topbar.jsx`, normally through `AppLayout`. Do not create page-local desktop navigation bars or topbars.
- Desktop topbar visible slots must stay identical to 今日计划: title/subtitle on the left, calendar, theme toggle, notification, and `Aa` account chip on the right. Page-specific search, sync, mode menus, filters, or progress controls belong inside page content panels, not in the global topbar.
- Do NOT replace UI with static screenshots
- Interactive elements must remain real components
- Generated images are decorative assets only

--------------------------------
# HYBRID UI RULE
Use real frontend components for:
- layout
- sidebar
- topbar
- buttons
- text
- navigation
- cards
- progress rings and bars
- stats
- hover, click, and responsive states

Use generated image assets only for:
- hero illustrations
- card-side illustrations
- soft 3D icons
- decorative background shapes
- empty-state illustrations
- module artwork

--------------------------------
# HOMEPAGE DESIGN LANGUAGE
- Left sidebar + top header + hero card + status cards + stats strip
- Homepage hero may use the established premium gradient language.
- Homepage and Training Center should be aligned toward the Test page visual language: white/tinted panels, soft blue borders, strong blue only for selected/primary states, and decorative 3D assets used sparingly.
- Training Center hero may use a blue gradient banner and a right-side soft 3D blue "Aa" flashcard asset with subtle yellow highlights, but surrounding panels/cards should follow the Test page's clean white-blue card system.
- Review and new-word cards use real text and actions with decorative side illustrations
- Stats use real numbers and labels with matching soft 3D icon assets
- Keep the page premium, calm, airy, and commercially polished

--------------------------------
# TRAINING CENTER RULES
- Preserve the current hierarchy: hero -> four main module cards -> inline word/reading picker panels -> motivation band -> Daily Progress.
- Training Center does not include a search bar. Keep the first content after the shared topbar as the hero/module flow; do not reintroduce keyword search unless it becomes a product requirement.
- Main modules are 背单词 / 做阅读 / 今日复习 / 做测试, implemented with real `ModuleCard` components.
- 背单词 opens the word category panel; 做阅读 opens the reading category panel.
- The 阅读 navigation entry also returns to Training Center and opens the reading category panel. Do not recreate or route to a standalone reading list page.
- Reading level cards and article rows must use `src/components/reading/ReadingPicker.jsx`; do not duplicate that UI in page-local components.
- Reading article sessions use `ReadingSessionView` with the shared `AppLayout` chrome. Do not restore the old local reading topbar; page-specific actions such as 返回列表、显示翻译、朗读全文、同步进度 and QuickMenu belong in the content workspace.
- Reading article sessions should visually follow the approved word-learning direction: blue-white goal strip, large rounded reading card, compact metadata chips, right-side learning status on desktop, and real bottom action buttons.
- Do not restore deleted legacy word UI components such as `CategorySelector.jsx`, old `components/Progress.jsx`, or generic `Card.jsx`.
- Word categories are real compact ModuleCards with decorative blue/yellow 3D assets: 全部单词 / 日常常用 / 四级核心 / 六级核心 / 托福词汇 / 雅思词汇.
- Do not use emoji for production module/category icons. Use generated transparent PNG assets from `public/images/ui-assets/`.
- Keep yellow as accent only: bookmark tabs, stars, sparkles, active indicator, or tiny highlights.
- The login area should read as a clear login/register button; current avatar mark is `Aa`, not emoji.

--------------------------------
# MOBILE HOMEPAGE RULES
- Mobile uses the same real component system, not a separate screenshot or mock.
- Mobile app shell uses a compact topbar with avatar, title, calendar, theme toggle, and notification actions.
- Mobile bottom navigation is a floating real nav with four primary destinations: 今日 / 训练 / 统计 / 我的.
- Status cards stack vertically; card text, progress, buttons, and stats remain real components.
- Module cards use decorative PNG assets only for icon/art roles; do not use emoji as production module icons.
- The training-center module grid uses consistent card surfaces; do not make one module visually louder unless it represents a real selected state.
- When navigating from a scrolled mobile section to another app view, reset page scroll to the top.

--------------------------------
# MOBILE WORD LEARNING RULES
- Mobile word-learning mode uses a dedicated clean study chrome, not the generic mobile app shell.
- Mobile word-learning top area is: back button, 背单词 title, progress pill, then 今日目标 progress strip.
- Mobile word-learning content is only the word card and three bottom actions: 不认识 / 显示提示 / 认识了.
- Do not show desktop side status on mobile word-learning: 学习进度, 连续打卡, 剩余词汇 summary, or 坚持每天进步.
- Keep the bottom actions horizontal on mobile and reserve safe-area space.

--------------------------------
# OUTPUT
Return only changed files and verification status.
