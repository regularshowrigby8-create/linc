# Exact Menu and Navigation Specification

## Global top bar

Mobile top bar, left to right: menu/profile icon, current workspace name, optional search icon, notification bell, avatar. Desktop: LinkHive wordmark, workspace rail, search, notifications, language selector, avatar.

## Profile drawer options

Always show: My profile, Account settings, Notification settings, Language, Help and safety, Sign out.

Show registered workspaces as active: Customer Service, Qualification / Jobs, Collaboration, Supply. Show unregistered workspaces as hidden behind “Add workspace”. When opened, an unregistered workspace card says “Register to unlock” and displays the required verification step. Do not put unregistered workspaces in the main navigation.

Account settings options: Personal details, Business details if business account, Location, Contact visibility, Password, Sessions, Delete/deactivate account. Payment, wallet, currency, and payout entries must be visibly disabled with “Not available in this prototype.”

Help and safety options: Safety tips, Report a problem, Report a user or listing, Blocked users, Community rules, Terms placeholder, Privacy placeholder. Legal links must not invent legal text.

## Customer Service menus

Primary actions: Find a service, Create a service listing, My requests, Saved listings.

Filters: Search words, service category, location, distance, local/global, availability, price/quote, verified only, response time, rating, delivery/remote, language.

Sort: Best match, Lowest price, Lowest estimated total, Nearest, Fastest response, Highest verification, Highest rating, Available soonest.

## Qualification / Jobs menus

Primary actions: Find an opportunity, Create qualification profile, My requests, Saved profiles.

Filters: Search words, qualification category, qualification level, location, local/global, remote/on-site, availability, verified qualification, employer/business, engagement type, language.

Sort: Best match, Closest, Verified first, Lowest stated cost, Fastest response, Highest rating.

## Collaboration menus

Primary actions: Find collaborators, Create collaboration request, My groups, Invitations, Agreements.

Filters: Collaboration category, provider/business, location, local/global, capacity, date range, group size, verified business, availability, remote/on-site.

Sort: Best match, Available soonest, Closest, Verified first, Lowest quote, Highest rating.

## Supply menus

Primary actions: Find products, Create sourcing request, My quotes, Saved suppliers.

Filters: Single item/bulk, category, supplier location, buyer location, local/South Africa-wide/international, quantity/MOQ, estimated total, delivery time, supplier verification, quote confidence, returns available.

Sort: Best match, Lowest product price, Lowest estimated total, Fastest delivery, Nearest supplier, Verified first, Highest confidence.

## Query behavior

Every filter has a label, current value, clear action, and applied-filter chip. “Clear all” resets filters but never deletes the user’s typed search. Enter submits search. Escape closes filter drawers and modals. Mobile filters open in a full-height drawer with Apply and Reset buttons. Desktop filters are a left column or popover.

## Disabled option behavior

Payments, wallet, currency, cash-out, real document upload, real provider connection, and live legal automation are not clickable capabilities. Render them as disabled rows with an explanation, not as active buttons.