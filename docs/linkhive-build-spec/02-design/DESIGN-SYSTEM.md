# LinkHive Design System

## Design movement

Trustworthy civic marketplace: calm, practical, human, and globally aware. Avoid bank-like heaviness, generic SaaS gradients, and ecommerce clutter.

## Brand essence

LinkHive helps people find the right connection and move from need to agreement. Personality: practical, fair, connected.

## Colour tokens

Use CSS variables only. Primary ink `#14213D`; muted ink `#536174`; canvas `#F7F8FA`; surface `#FFFFFF`; border `#E3E8EF`; signature hive colour `#F2B84B`; signature deep hive `#B87313`; success `#198754`; warning `#B7791F`; danger `#C0392B`; information `#2563EB`; disabled `#A7B0BE`.

Never use raw colour values outside the token file. Do not use red for normal emphasis. Red means danger, blocked, or failed.

## Typography

Use a system sans stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Body 16px/1.5. Small label 12px/1.35. Caption 13px/1.4. H1 32px/1.1 desktop and 28px/1.15 mobile. H2 24px/1.2. H3 18px/1.25. Button text 14px/1.2, weight 700.

## Spacing

Use a 4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Default page padding 16px mobile, 24px tablet, 32px desktop. Card gap 12px mobile and 16px desktop. Maximum reading width 720px. Maximum app content width 1200px.

## Shape and elevation

Card radius 16px. Button radius 10px. Input radius 10px. Pill radius 999px. Use one subtle shadow only: `0 8px 24px rgba(20,33,61,.08)`. Prefer borders over stacked shadows.

## Layout

Mobile-first. At 375px width the main page must fit without horizontal scrolling. Bottom navigation is fixed on mobile with safe-area padding. Desktop uses a left workspace rail and a content column. Do not use a centered dashboard grid as the only structure; use a content stream with purposeful sections.

## Signature elements

Use a small honeycomb mark or six-dot cluster as a replaceable logo placeholder. Use a left-edge coloured workspace rail. Use status chips with text, never colour alone.

## Interaction

Every interactive element has hover, focus-visible, pressed, disabled, and loading behavior where relevant. Focus ring: 3px `rgba(37,99,235,.28)` plus 1px information border. Motion is 150–220ms ease-out. Respect `prefers-reduced-motion`.

## Components

Required primitives: Button, IconButton, TextInput, Select, Textarea, Checkbox, Chip, Badge, Card, Avatar, Drawer, Modal, Toast, Tabs, ProgressStepper, EmptyState, ErrorState, Skeleton, ListingCard, RequestCard, QuoteCard, WorkspaceShell, BottomNav, DesktopRail.

## Content rules

Use plain English, sentence case, and direct actions. Primary CTAs use verbs: “Find a provider”, “Create a listing”, “Send request”, “Accept request”, “Compare quotes”. Never use “Click here”. Every estimate says “Estimated”. Every future capability says “Not available yet”.

## Responsive breakpoints

Base: 0–639px. Tablet: 640–1023px. Desktop: 1024px and above. At base, one column and bottom navigation. At tablet, two-column detail layouts where safe. At desktop, rail plus content and optional right detail panel.