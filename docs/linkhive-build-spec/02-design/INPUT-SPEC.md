# Input and Query Specification

## Common input rules

Every field has a visible label, optional/required indicator, helper text when needed, validation message, and accessible error association. Never validate only on blur; validate on submit and preserve user input. Trim whitespace. Do not accept invisible-only text. Use realistic examples, not lorem ipsum.

## Registration

Name: required, 2–80 characters. Email: required, valid format. Password: required, minimum 8 characters, show/hide control. Account type: Personal or Business. Business name appears only when Business is selected. Submit label: Create account.

Errors: “Enter your name.” “Enter a valid email address.” “Use at least 8 characters.” “Choose Personal or Business.” “Enter the business name.”

## Workspace registration

Prompt: “What do you want to use LinkHive for first?” Options: I need a service, I offer a service, I have qualifications, I need a collaborator, I need supplies, I supply products. The selection maps to one or more workspace registrations and never silently creates verification.

## Search query prompts

Customer Service placeholder: “What do you need help with?”
Qualification / Jobs: “What qualified person or opportunity are you looking for?”
Collaboration: “What kind of partner or capacity do you need?”
Supply: “What product, quantity, and delivery location do you need?”

Search suggestions are mock-only and deterministic: cleaning, graphic design, massage service, qualified assistant, bulk packaging, local delivery, translation, website development.

## Listing creation: common fields

Title required, 5–80 characters. Description required, 20–1,000 characters. Location required unless Remote is selected. Reach required: Local, South Africa-wide, International. Availability required. Price mode required: Starting price, Quote required, Price range. Include/exclude fields optional but omitted when blank. Language optional. Contact visibility uses profile setting.

## Customer Service fields

Service category required. Service type: Remote, In-person, Hybrid. Duration optional. Starting price optional. Service boundaries required for regulated or sensitive category. Prompt: “What exactly will the customer receive?”

## Qualification / Jobs fields

Qualification title required. Institution optional in prototype. Qualification level required. Certificate status: Not verified, Pending, Verified. Opportunity type: Employment, Contract, Project, Referral, Other. Experience is optional and must never be required. Prompt: “What are you qualified or prepared to help with?”

## Collaboration fields

Category required. Request/offer required. Title required. Desired participants required. Description required. Date/time and duration required before scheduling. Location or remote required. Equipment responsibility required. Supervision responsibility required. Price or quote method required. Prompt: “What must each party agree to before work begins?”

## Supply request fields

Product required. Quantity required and numeric greater than zero. Single item or bulk required. Buyer location required. Delivery target required. Acceptable alternatives optional. Budget optional. Prompt: “What can be replaced if the first supplier or route is unavailable?”

## Connection request wizard

Step 1 Reason: required, 10–500 characters. Step 2 Desired outcome: optional. Step 3 Timing: optional. Step 4 Location/boundaries: optional. Review shows all entered values before Send request.

Reason examples: “I need three quotes for a local event.” “I want to understand whether you can provide this remotely.” “I am looking for a qualified person for a short project.”

## Report form

Reason required select from the approved categories. Details required, 20–1,000 characters. Checkbox: “I understand this report is reviewed and false/spam reports may be restricted.” Submit: Report for review.

## Agreement acceptance

Show every required agreement field in read-only review. Checkbox required: “I have reviewed the scope and responsibilities.” Buttons: Accept terms, Go back and edit. No payment acceptance exists.

## Notification settings

Channels: In-app, Email, SMS, WhatsApp, Push. Essential safety, security, and verification notices are locked on. Non-essential channels have toggles. Each toggle updates state immediately and shows “Notification preference saved.”