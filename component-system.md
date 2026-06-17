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
- ModuleCard text, metadata, and arrow affordance remain real DOM.

--------------------------------
# BUTTONS
<PrimaryButton>
<SecondaryButton>
<IconButton>

Button rules:
- Primary buttons use the primary blue-purple gradient.
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
- Training center modules: four ModuleCards for 背单词 / 做阅读 / 今日复习 / 做测试, using consistent card surfaces and generated assets for icon/art.
- On mobile, 背单词 opens the existing word-category picker instead of immediately starting all-word learning.

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

Do not use generated images for:
- buttons
- text
- navigation
- progress values
- stats numbers
- full-page screenshots
