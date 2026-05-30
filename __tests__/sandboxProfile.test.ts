import { loanOffers, mayaProfile } from '@/src/data/demoData';
import { simulatedApplicationSchema } from '@/src/lib/applicationValidation';
import { calculatePaymentBurden, estimateReadiness } from '@/src/lib/lendingEngine';
import {
  createMayaSandboxProfile,
  createSandboxProfileFromDraft,
  mapBorrowingGoalToOfferId,
  mapBorrowingGoalToPurpose,
} from '@/src/lib/sandboxProfile';

function offerById(id: string) {
  const offer = loanOffers.find((item) => item.id === id);

  if (!offer) {
    throw new Error(`Missing test offer: ${id}`);
  }

  return offer;
}

describe('sandbox borrower profiles', () => {
  it('defaults to the Maya demo profile', () => {
    const profile = createMayaSandboxProfile();

    expect(profile).toMatchObject({
      id: mayaProfile.id,
      name: 'Maya',
      borrowerStatus: 'Demo profile',
      profileSource: 'maya-demo',
      desiredLoanAmount: 1500,
      preferredMonthlyPayment: 140,
    });
  });

  it('custom profile values affect payment burden and readiness', () => {
    const offer = offerById('personal-starter');
    const cautiousProfile = createSandboxProfileFromDraft({
      borrowingGoal: 'Compare options',
      desiredLoanAmount: 1000,
      estimatedMonthlyIncome: 800,
      currentMonthlyObligations: 430,
      preferredMonthlyPayment: 80,
      employmentCategory: 'Contractor',
      creditEducationComfort: 'Just starting',
    });
    const preparedProfile = createSandboxProfileFromDraft({
      borrowingGoal: 'Compare options',
      desiredLoanAmount: 1000,
      estimatedMonthlyIncome: 6000,
      currentMonthlyObligations: 200,
      preferredMonthlyPayment: 200,
      employmentCategory: 'W-2 employee',
      creditEducationComfort: 'Confident',
    });

    const monthlyPayment = 91.68;

    expect(calculatePaymentBurden(monthlyPayment, cautiousProfile.estimatedMonthlyIncome)).toBe(
      0.1146
    );
    expect(calculatePaymentBurden(monthlyPayment, preparedProfile.estimatedMonthlyIncome)).toBe(
      0.0153
    );
    expect(estimateReadiness(cautiousProfile, offer).level).toBe('High caution');
    expect(estimateReadiness(preparedProfile, offer).level).toBe('Ready to compare');
  });

  it('application flow validates with a custom local sandbox profile', () => {
    const profile = createSandboxProfileFromDraft({
      borrowingGoal: 'Build credit',
      desiredLoanAmount: 500,
      estimatedMonthlyIncome: 3200,
      currentMonthlyObligations: 250,
      preferredMonthlyPayment: 100,
      employmentCategory: 'Student',
      creditEducationComfort: 'Somewhat familiar',
    });

    const result = simulatedApplicationSchema.safeParse({
      purpose: mapBorrowingGoalToPurpose(profile.borrowingGoal),
      requestedAmount: profile.desiredLoanAmount,
      applicantName: profile.name,
      profileMode: 'Synthetic demo profile',
      monthlyIncome: profile.estimatedMonthlyIncome,
      employmentType: profile.employmentCategory,
      selectedOfferId: mapBorrowingGoalToOfferId(profile.borrowingGoal),
      demoConsentAccepted: true,
    });

    expect(result.success).toBe(true);
  });
});
