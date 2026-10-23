# Verification Demo Specification

## Safety boundary

This is a visual demo only. It must never access a camera, request a real identity document, upload a real file, call a verification vendor, or claim a real identity decision. Every screen includes a small `DEMO — no real documents are collected` label.

## Entry

Profile drawer > workspace pending card > “See demo verification”. The route is `/app/verification/demo`. The user can exit at any step without losing account state.

## Step 1: Explain

Title: “Verification protects the marketplace.” Explain that a real product would use an approved verification provider. CTA: “View demo flow”. Secondary: “Not now”.

## Step 2: Fake document sample

Show two prebuilt fake tiles: `DEMO ID FRONT` and `DEMO ID BACK`. The user chooses a sample; no file input exists. Show quality checks as mock progress: Image quality, Text extraction, Security checks.

## Step 3: Fake selfie/liveness

Show a stylised placeholder avatar, not a human likeness. Label: `DEMO SELFIE`. Mock checks: Liveness, Face match. No camera permission request.

## Step 4: Result variants

Provide a visible demo selector only for development: Passed, Manual review, Mismatch, Rejected. In the user-facing flow, the default is Manual review. Each result has a specific explanation.

Passed: “Demo checks passed. This is not real verification.”
Manual review: “The demo needs a human reviewer.” CTA: Request manual review.
Mismatch: “The name did not match in this demo.” CTA: Request manual review.
Rejected: “The demo document could not be accepted.” CTA: Return to profile.

## Step 5: Manual review

Show status Pending review, expected mock response window “24–48 hours in this demo”, assigned role Verification reviewer, and an audit event. Do not promise a real decision time.

## Step 6: Completion

Return to the relevant workspace card with status Pending or Verified demo. The workspace must not become genuinely verified because of this demo. Use a `demoVerified` flag separate from production `verificationState`.

## Required tests

Verify no file input, camera API, network upload, real ID strings, or provider call exists. Verify DEMO label appears on every step. Verify exit, back, retry, manual review, and all result variants work.