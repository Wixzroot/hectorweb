# Security Specification for Hector Host

## Data Invariants
1. A Plan must have a title, price, category, and at least one feature.
2. Feedbacks must have a rating between 1 and 5.
3. Only authenticated users with the 'admin' role can modify config, plans, and testimonials.
4. Anonymous users can submit feedback.
5. All IDs must match `^[a-zA-Z0-9_\-]+$`.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: Attempt to update `config/site` as an unauthenticated user.
2. **Identity Spoofing**: Attempt to update `plans/plan1` as a regular authenticated user (not admin).
3. **Privilege Escalation**: Attempt to create a document in `admins/` as a non-admin to become an admin.
4. **Invalid Schema**: Create a Plan with price as a number (rule expects string).
5. **Shadow Fields**: Update a Plan and inject `isFree: true`.
6. **State Shortcutting**: Bypass validation helper by updating only one field in a restricted action.
7. **Resource Poisoning**: Create a feedback with a 1MB message string.
8. **Resource Poisoning**: Create a plan with a 2KB document ID.
9. **Terminal State Locking**: (N/A for this app, but checking if we can modify a 'completed' status if we had one).
10. **PII Leak**: Read `admins/` collection as a non-admin.
11. **Relational Orphan**: Create a plan pointing to a non-existent category (if strict).
12. **Denial of Wallet**: Deeply recursive list query on feedbacks.

## Security Rules Draft (DRAFT_firestore.rules)
(Followed by real rules later)
