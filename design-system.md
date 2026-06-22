# DESIGN SYSTEM

## Source Of Truth

The current Test page is the approved global visual benchmark. Use `test-page-visual-language.md` for detailed page rhythm and card language.

## Colors

- Primary: `#4F7CFF`
- Primary active: `#2F6DFF`
- Secondary: `#7EA6FF`
- Accent yellow: `#FFC857`
- Background: `#F7FAFF`
- Card: `#FFFFFF`
- Text: `#0F172A`
- Muted text: `#64748B`

Semantic accents:

- Blue: active, reading, selected, primary progress
- Green: success and mastered states
- Orange/yellow: streaks, goals, stars, bookmark tabs, tiny highlights
- Violet/cyan: local mode accents only

Rules:

- Large page surfaces stay white, light blue, or softly tinted white.
- Strong blue is reserved for primary buttons, selected cards, active nav, progress, and key status pills.
- Yellow is an accent only, never a dominant surface.
- Avoid dark admin chrome, heavy borders, random accent colors, and page-wide one-off palettes.

## Spacing

Use the existing scale:

```text
8 / 16 / 24 / 32 / 48
```

## Typography

- Page title: 28-32px bold
- Hero title: 44-56px bold
- Card title: 20-24px bold
- Subtitle: 18-22px
- Body: 14-16px

Rules:

- Hero title is the largest text on the page.
- Card headings must be clearly smaller than hero headings.
- Metadata and helper text should not compete with section titles.
- Use strong weights sparingly.

## Shape And Elevation

- Large panels: 20-24px radius
- Inner cards: 18-22px radius
- Nav/buttons: 12-14px radius
- Shadows: soft blue-tinted shadows only
- Borders: subtle tinted 1px borders when definition is needed
- Hover: slight lift, stronger border, slightly stronger shadow

Avoid nested card stacks, oversized decorative blobs, saturated full-card backgrounds outside deliberate hero banners, and heavy dividing lines.

## Shared Chrome

Desktop:

- Use `Sidebar.jsx` and `Topbar.jsx` through `AppLayout`.
- Sidebar labels: 今日计划 / 训练中心 / 单词 / 阅读 / 复习 / 测试 / 统计.
- Sidebar owns the shared bottom “连续学习” card.
- Topbar slots stay fixed: title/subtitle, calendar, theme toggle, notification, `Aa` account chip.
- Page-specific controls stay inside content panels.

Mobile:

- Use shared `MobileTopbar` and floating `MobileBottomNav`.
- Bottom nav destinations: 今日 / 训练 / 统计 / 我的.
- Mobile word-learning is the only exception and uses the dedicated study chrome.

## Assets

Generated assets must be transparent PNGs and may only be used for:

- hero illustrations
- card-side illustrations
- module/category artwork
- stat icons
- empty-state artwork
- decorative background details

Generated assets must not contain Chinese text, progress values, buttons, navigation, stats numbers, or interactive UI.

Production module/category icons should use assets from `public/images/ui-assets/`, not emoji.

## Key Surface Rules

- Training Center keeps: hero -> four modules -> inline word/reading picker panels -> motivation band -> Daily Progress.
- Training Center has no search bar.
- Reading sessions use the blue-white learning surface: goal strip, large reading card, compact metadata chips, desktop status aside, real bottom actions.
- Word collection pages use shared `AppLayout`; tools live inside the content panel.
- Exam sessions use: control card -> thin progress bar -> centered answer card.
- Auth modal stays a real form with email verification flow, stat cards, segmented login/register, and status/error text.
