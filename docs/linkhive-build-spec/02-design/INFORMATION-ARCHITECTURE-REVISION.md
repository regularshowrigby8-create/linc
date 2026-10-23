# Information Architecture Revision — One Workspace at a Time

## Correction

The previous visual previews placed Customer Service, Qualification / Jobs, Collaboration, and Supply on one screen. That is rejected because it creates cognitive overload and makes the product look like four unrelated applications at once.

## New rule

A user enters one workspace at a time. The active workspace owns the page, language, query, filters, cards, and primary action. Other workspaces do not appear as cards on the active home screen.

## First screen after login

Show only the user’s first registered workspace. If the user has registered for multiple workspaces, show the last-used workspace only. Provide a small profile/menu control labelled “Switch workspace” rather than showing all workspace cards.

## Workspace switching

Open the profile drawer or workspace switcher. List only registered workspaces. Unregistered workspaces appear under “Add workspace” and are not mixed into the active product screen. Selecting a workspace navigates to that workspace’s home route and resets only workspace-specific filters; global account state remains.

## Active workspace layout

One header, one purpose statement, one main query, one filter control, one result stream, and one primary action. Maximum visible content on first load: two result cards plus one optional saved/recent section. No dashboard mosaic.

## Mobile navigation

Bottom navigation contains only: current workspace Home, Requests, Messages, Profile. If the workspace has an additional core area, it is opened from the workspace header or profile drawer, not added as a fifth crowded tab.

## Desktop navigation

The left rail shows the current workspace name and four global utilities: Home, Requests, Messages, Profile. Workspace switching is a single button at the top of the rail. Do not show four simultaneous workspace tiles.

## Query design

Each workspace has one plain-language query with an optional filter drawer. The page should not show every possible filter until the user opens Filters. Applied filters appear as compact chips beneath the query.

## Separate sections

Customer Service, Qualification / Jobs, Collaboration, and Supply each receive separate route screens and separate simplified previews. Shared components may be reused, but the screen content must not mix.

## Acceptance

A first-time user can understand the purpose of the current screen in five seconds. A user can switch workspace in two taps or fewer after opening the profile/menu control. At 375px width, no screen contains four workspace cards or more than two primary result cards above the first scroll.
