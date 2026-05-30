import { z } from 'zod';

import { mayaProfile } from '@/src/data/demoData';
import type {
  BorrowerProfile,
  BorrowingGoal,
  CreditEducationComfort,
  EmploymentType,
  LoanPurpose,
} from '@/src/types/lending';

export const borrowingGoalOptions: BorrowingGoal[] = [
  'Build credit',
  'Cover emergency cost',
  'Finance purchase',
  'Repair vehicle',
  'Compare options',
];

export const employmentCategoryOptions: EmploymentType[] = [
  'W-2 employee',
  'Contractor',
  'Student',
  'Not listed',
];

export const creditEducationComfortOptions: CreditEducationComfort[] = [
  'Just starting',
  'Somewhat familiar',
  'Confident',
];

export const sandboxOnboardingSchema = z.object({
  borrowingGoal: z.enum(borrowingGoalOptions),
  desiredLoanAmount: z.coerce
    .number()
    .min(100, 'Use a sandbox amount of at least $100.')
    .max(3000, 'Sandbox loan amounts are capped at $3,000.'),
  estimatedMonthlyIncome: z.coerce
    .number()
    .min(500, 'Use a demo monthly income of at least $500.')
    .max(10000, 'Use a reasonable sandbox monthly income value.'),
  currentMonthlyObligations: z.coerce
    .number()
    .min(0, 'Existing obligations cannot be negative.')
    .max(8000, 'Use a reasonable sandbox obligation value.'),
  preferredMonthlyPayment: z.coerce
    .number()
    .min(25, 'Choose a comfort payment of at least $25.')
    .max(2500, 'Use a reasonable monthly payment comfort value.'),
  employmentCategory: z.enum(employmentCategoryOptions),
  creditEducationComfort: z.enum(creditEducationComfortOptions),
});

export type SandboxOnboardingDraft = z.infer<typeof sandboxOnboardingSchema>;

export const mayaOnboardingDraft: SandboxOnboardingDraft = {
  borrowingGoal: mayaProfile.borrowingGoal,
  desiredLoanAmount: mayaProfile.desiredLoanAmount,
  estimatedMonthlyIncome: mayaProfile.estimatedMonthlyIncome,
  currentMonthlyObligations: mayaProfile.currentMonthlyObligations,
  preferredMonthlyPayment: mayaProfile.preferredMonthlyPayment,
  employmentCategory: mayaProfile.employmentCategory,
  creditEducationComfort: mayaProfile.creditEducationComfort,
};

export function createMayaSandboxProfile(): BorrowerProfile {
  return {
    ...mayaProfile,
    profileSource: 'maya-demo',
    borrowerStatus: 'Demo profile',
  };
}

export function createSandboxProfileFromDraft(draft: SandboxOnboardingDraft): BorrowerProfile {
  const parsed = sandboxOnboardingSchema.parse(draft);

  return {
    ...mayaProfile,
    id: 'local-sandbox-profile',
    name: 'Sandbox borrower',
    borrowerStatus: 'Local sandbox profile',
    borrowingGoal: parsed.borrowingGoal,
    desiredLoanAmount: parsed.desiredLoanAmount,
    estimatedMonthlyIncome: parsed.estimatedMonthlyIncome,
    currentMonthlyObligations: parsed.currentMonthlyObligations,
    preferredMonthlyPayment: parsed.preferredMonthlyPayment,
    employmentCategory: parsed.employmentCategory,
    creditEducationComfort: parsed.creditEducationComfort,
    profileSource: 'custom-sandbox',
  };
}

export function createOnboardingDraftFromProfile(profile: BorrowerProfile): SandboxOnboardingDraft {
  return {
    borrowingGoal: profile.borrowingGoal,
    desiredLoanAmount: profile.desiredLoanAmount,
    estimatedMonthlyIncome: profile.estimatedMonthlyIncome,
    currentMonthlyObligations: profile.currentMonthlyObligations,
    preferredMonthlyPayment: profile.preferredMonthlyPayment,
    employmentCategory: profile.employmentCategory,
    creditEducationComfort: profile.creditEducationComfort,
  };
}

export function mapBorrowingGoalToPurpose(goal: BorrowingGoal): LoanPurpose {
  if (goal === 'Build credit') {
    return 'Credit building';
  }

  if (goal === 'Cover emergency cost') {
    return 'Emergency buffer';
  }

  if (goal === 'Finance purchase') {
    return 'Device purchase';
  }

  if (goal === 'Repair vehicle') {
    return 'Auto repair';
  }

  return 'Personal expense';
}

export function mapBorrowingGoalToOfferId(goal: BorrowingGoal): string {
  if (goal === 'Build credit') {
    return 'credit-builder';
  }

  if (goal === 'Cover emergency cost') {
    return 'emergency-flex';
  }

  if (goal === 'Finance purchase') {
    return 'device-financing';
  }

  if (goal === 'Repair vehicle') {
    return 'auto-repair';
  }

  return 'personal-starter';
}
