import { exampleApplication, loanOffers, mayaProfile } from '@/src/data/demoData';
import {
  calculateMonthlyPayment,
  calculatePaymentBurden,
  calculateTotalInterest,
  calculateTotalRepayment,
  classifyPaymentBurden,
  compareLoanOffers,
  estimateReadiness,
  generateRepaymentSchedule,
  generateStatusTimeline,
} from '@/src/lib/lendingEngine';

function offerById(id: string) {
  const offer = loanOffers.find((item) => item.id === id);

  if (!offer) {
    throw new Error(`Missing test offer: ${id}`);
  }

  return offer;
}

describe('lendingEngine', () => {
  it('calculates monthly payment with APR amortization', () => {
    expect(calculateMonthlyPayment(1000, 18, 12)).toBe(91.68);
    expect(calculateMonthlyPayment(900, 0, 4)).toBe(225);
  });

  it('calculates total repayment and total interest', () => {
    const totalRepayment = calculateTotalRepayment(91.68, 12);

    expect(totalRepayment).toBe(1100.16);
    expect(calculateTotalInterest(totalRepayment, 1000)).toBe(100.16);
  });

  it('calculates and classifies payment burden', () => {
    expect(calculatePaymentBurden(120, 2400)).toBe(0.05);
    expect(classifyPaymentBurden(0.05)).toBe('Light');
    expect(classifyPaymentBurden(0.08)).toBe('Manageable');
    expect(classifyPaymentBurden(0.12)).toBe('Needs caution');
    expect(classifyPaymentBurden(0.2)).toBe('High burden');
  });

  it('estimates readiness directionally without official score claims', () => {
    const creditBuilder = estimateReadiness(mayaProfile, offerById('credit-builder'));
    const emergencyFlex = estimateReadiness(mayaProfile, offerById('emergency-flex'));

    expect(creditBuilder.level).toBe('Ready to compare');
    expect(creditBuilder.directionalRisk).toBe('Helps');
    expect(emergencyFlex.level).toBe('High caution');
    expect(emergencyFlex.directionalRisk).toBe('Significant risk');
  });

  it('generates a repayment schedule with principal, interest, and balance', () => {
    const schedule = generateRepaymentSchedule(offerById('personal-starter'), '2026-06-15');

    expect(schedule).toHaveLength(12);
    expect(schedule[0]).toMatchObject({
      installment: 1,
      dueDate: '2026-07-15',
      payment: 91.68,
      interest: 15,
    });
    expect(schedule[11].remainingBalance).toBe(0);
  });

  it('compares loan offers for payment, cost, burden, and readiness', () => {
    const comparison = compareLoanOffers(
      [offerById('personal-starter'), offerById('credit-builder')],
      mayaProfile
    );

    expect(comparison).toHaveLength(2);
    expect(comparison[0]).toMatchObject({
      name: 'Personal Starter Loan',
      monthlyPayment: 91.68,
      paymentBurdenLevel: 'Light',
    });
    expect(comparison[1].pros).toContain('Lower synthetic APR than the other demo options.');
  });

  it('generates application status timeline state', () => {
    const timeline = generateStatusTimeline(exampleApplication);

    expect(timeline.map((item) => item.state)).toEqual([
      'complete',
      'complete',
      'complete',
      'current',
      'locked',
      'locked',
    ]);
    expect(timeline[3].title).toBe('Documents pending');
  });
});
