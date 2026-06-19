# COMPONENT SYSTEM

--------------------------------
# APP SHELL
<AppLayout>
<Sidebar>
<Topbar>
<MobileTopbar>
<MobileBottomNav>
<Content>

--------------------------------
# CARDS
<BaseCard>
<HeroCard>
<ModuleCard>
<StatCard>
<StatusCard>

Card rules:
- Cards own structure, spacing, radius, elevation, and responsive behavior.
- Decorative images may be passed into cards, but card text/actions stay real components.
- Do not create one-off card markup for new pages.
- ModuleCard supports `iconSrc` and `artSrc` for decorative PNG assets. Prefer these over emoji in production UI.
- ModuleCard also supports `variant`, which adds an `is-{variant}` class for visual tuning only. It must not change routing or learning behavior.
- ModuleCard automatically marks cards with decorative art using `has-art`; CSS can use this to position text and illustrations without adding one-off markup.
- ModuleCard text, metadata, and arrow affordance remain real DOM.

--------------------------------
# BUTTONS
<PrimaryButton>
<SecondaryButton>
<IconButton>

Button rules:
- Primary buttons use the current primary blue gradient.
- Secondary buttons use a soft tinted or white surface.
- Status/action pills inside cards must share one rounded soft style.
- Buttons must remain real button elements.
- Theme toggle uses <IconButton> and the existing theme context; do not create a separate theme state.

--------------------------------
# PROGRESS
<CircularProgress>
<LinearProgress>

Progress rules:
- Progress values are real CSS/SVG/frontend state, never baked into images.
- Circular progress is used in the hero core progress widget.
- Linear progress is used in task/status cards.

--------------------------------
# MODULES
<VocabularyModule>
<ReadingModule>
<ReviewModule>
<TestModule>

Homepage modules:
- HeroCard: left copy, center progress/action widget, right decorative asset.
- PlanStatusCards: review and new-word cards with real text/actions and decorative assets.
- StatsRow: real stat values with generated icon assets.
- Training center modules: four ModuleCards for 背单词 / 做阅读 / 今日复习 / 做测试, using consistent white card surfaces and generated English-learning assets for art.
- Training center word categories: six ModuleCards for 全部单词 / 日常常用 / 四级核心 / 六级核心 / 托福词汇 / 雅思词汇. They use compact blue/yellow category art and real text/count/arrow.
- On mobile, 背单词 opens the existing word-category picker instead of immediately starting all-word learning.
- On desktop and mobile, 做阅读 opens the inline reading category picker instead of jumping to the old reading list first.
- StatsRow is a unified Daily Progress component with a title section, three real stats, aligned icon/value/label groups, and subtle dividers.

--------------------------------
# RULE
Only use these components.
No custom UI allowed.

--------------------------------
# ASSET RULE
Generated assets are allowed only as props or decorative children of system components:
- hero illustration
- card-side illustration
- stat icon
- empty-state artwork
- module artwork
- training-center category artwork

Do not use generated images for:
- buttons
- text
- navigation
- progress values
- stats numbers
- full-page screenshots
