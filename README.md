# CrestLend

**Tagline:** Borrow with clarity.

CrestLend is a standalone Expo React Native mobile app for a simulated lending experience. It belongs to the CreditCrest product family, but it is separate from CreditCrest AI:

- **CrestLend:** application-first lending app experience.
- **CreditCrest AI:** education, calculators, simulation, and methodology.

CreditCrest AI links used throughout the app:

- https://creditcrest-ai.vercel.app/
- https://creditcrest-ai.vercel.app/lending-lab
- https://creditcrest-ai.vercel.app/calculator-hub
- https://creditcrest-ai.vercel.app/methodology

## Problem

Borrowers often need to understand monthly payment, APR, repayment burden, documents, and application status before they are ready to interact with real lenders. Product teams also need a safe sandbox for testing lending UX without collecting sensitive data or implying real approval.

## Solution

CrestLend provides a polished Android-first mobile demo where users can browse synthetic loans, compare offers, estimate repayment, walk through a simulated application, review document requirements, track status, and jump to CreditCrest AI for education.

## Features

- Mobile-first onboarding with clear Demo Mode disclosure
- Home dashboard for synthetic borrower Maya
- Synthetic loan marketplace
- 2-3 offer comparison with principal, APR, term, monthly payment, total repayment, total interest, payment burden, funding speed, readiness, pros, and cons
- Multi-step simulated application with Zod validation
- Locked document checklist with upload-disabled messaging
- Application status timeline
- Repayment schedule with due dates, principal, interest, remaining balance, early payoff note, and missed payment warning
- Help screen linking to CreditCrest AI education pages
- Compliance/disclosure screen
- Deterministic local lending engine in `src/lib/lendingEngine.ts`
- Unit tests for core calculations and status logic

## Tech Stack

- Expo React Native
- TypeScript
- Expo Router
- React Native StyleSheet components
- Expo Linear Gradient
- Zod
- Jest with `jest-expo`
- ESLint with `eslint-config-expo`

## How To Run Locally

```sh
npm install
npm run lint
npm run typecheck
npm test
npx expo start
```

Android-first commands:

```sh
npm run android
```

## Demo Mode Explanation

CrestLend is a sandbox app. All profiles, offers, APRs, status events, document requirements, and repayment schedules are synthetic. The app uses local mock data and local state only.

Maya is the preserved demo borrower:

- Estimated monthly income: $2,400
- Current monthly obligations: $430
- Current credit utilization: 49%
- Recent inquiries: 1
- Payment history caution: one late payment 10 months ago

## Compliance Boundaries

CrestLend does **not**:

- Collect real SSNs
- Collect bank credentials
- Collect credit bureau credentials
- Collect identity documents
- Collect sensitive financial identifiers
- Upload or store real documents
- Approve or deny real users
- Show real lender offers
- Guarantee approval
- Predict official credit score changes
- Match borrowers with real lenders

All application screens say Demo Mode or Simulated Application.

## Future Production Roadmap

Future production work would require:

- Licensed lender partner API
- Identity verification
- Open banking
- Credit bureau soft-pull provider
- Secure document upload
- Underwriting engine
- Payment processor
- Privacy and security program
- Licensing and partner compliance review
- APR disclosures and consent workflows
- Monitoring, audit logging, and incident response

## Google Play Readiness Notes

CrestLend is configured as an Expo Android-first app with package name `com.creditcrest.crestlend`. Before any Google Play release, the app would still need production-grade app icons, privacy disclosures, data safety form review, content policy review, accessibility QA, security testing, and compliance review for any real financial-services functionality.

For the current demo, no paid APIs or lender integrations are required.
