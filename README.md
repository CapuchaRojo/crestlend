# CrestLend

**Tagline:** Borrow with clarity.

CrestLend is a standalone Expo React Native mobile app for a production-oriented sandbox lending experience. It belongs to the CreditCrest product family, but it is separate from CreditCrest AI:

- **CrestLend:** helps users compare, organize, and manage lending journeys in a sandbox environment.
- **CreditCrest AI:** helps users understand the financial concepts behind those lending decisions through education, calculators, simulation, and methodology.

CreditCrest AI links used throughout the app:

- https://creditcrest-ai.vercel.app/
- https://creditcrest-ai.vercel.app/lending-lab
- https://creditcrest-ai.vercel.app/calculator-hub
- https://creditcrest-ai.vercel.app/methodology

## Problem

Borrowers often need to understand monthly payment, APR, repayment burden, documents, and application status before they are ready to interact with real lenders. Product teams also need a serious sandbox for testing production-style lending UX without collecting sensitive data, implying real approval, or activating regulated workflows.

## Solution

CrestLend provides a polished Android-first mobile sandbox where users can browse synthetic loans, compare offers, estimate repayment, walk through a simulated application, review document requirements, track status, and jump to CreditCrest AI for financial education. The app is structured for future partner integration while keeping all live lending features inactive.

## Features

- Mobile-first onboarding with clear sandbox disclosure
- Home dashboard for synthetic borrower Maya
- Synthetic loan marketplace
- 2-3 offer comparison with principal, APR, term, monthly payment, total repayment, total interest, payment burden, funding speed, readiness, pros, and cons
- Multi-step simulated application with Zod validation
- Locked document checklist with upload-disabled messaging
- Application status timeline
- Repayment schedule with due dates, principal, interest, remaining balance, early payoff note, and missed payment warning
- Prominent CreditCrest AI education links in Help, loan comparison, application review, and repayment schedule
- Compliance/disclosure screen
- Future partner-ready capability surfaces for lender APIs, identity verification, secure document upload, open banking, bureau soft pulls, and payment processing
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

## Sandbox Mode Explanation

CrestLend is a sandbox app with production-oriented UX. All profiles, offers, APRs, status events, document requirements, and repayment schedules are synthetic. The app uses local mock data and local state only.

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

All application screens say Demo Mode, Sandbox, or Simulated Application.

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

CrestLend is configured as an Expo Android-first app with package name `com.creditcrest.crestlend`. Before any Google Play release, the app would still need production-grade app icons, accessibility QA, security testing, and compliance review for any financial-services functionality.

Google Play readiness checklist:

- Privacy policy required before release.
- Data safety form required in Play Console, even for apps that do not collect user data.
- Financial features declaration required for apps published on Google Play, including testing tracks.
- Personal-loan policy review required before any real personal-loan feature, offer, lead generation, repayment, or partner handoff.
- No real loan claims, lender matching, approvals, denials, funding, servicing, or repayment processing until CrestLend is appropriately licensed, partnered, reviewed, and approved for the target market.
- Store listing and in-app copy must continue to match actual data collection and sharing behavior.

Policy references:

- Google Play Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play Financial Services: https://support.google.com/googleplay/android-developer/answer/16322411
- Google Play Financial features declaration: https://support.google.com/googleplay/android-developer/answer/13849271

For the current demo, no paid APIs or lender integrations are required.

## Screenshots ##

<img width="2820" height="1614" alt="Screenshot_30-5-2026_174130_localhost" src="https://github.com/user-attachments/assets/241183db-02b6-4510-9a82-996dfedc50e5" />
