import type {
  ApplicationStatus,
  BorrowerProfile,
  DirectionalRisk,
  LoanApplication,
  LoanComparisonResult,
  LoanOffer,
  PaymentBurdenLevel,
  ReadinessEstimate,
  ReadinessLevel,
  RepaymentScheduleItem,
  StatusTimelineItem,
} from '@/src/types/lending';

const STATUS_ORDER: ApplicationStatus[] = [
  'started',
  'profile_reviewed',
  'terms_estimated',
  'documents_pending',
  'final_review',
  'demo_complete',
];

const STATUS_COPY: Record<ApplicationStatus, Pick<StatusTimelineItem, 'title' | 'description'>> = {
  started: {
    title: 'Started',
    description: 'Maya opened a simulated application and selected a loan purpose.',
  },
  profile_reviewed: {
    title: 'Profile reviewed',
    description: 'Demo profile factors were checked without real bureau or identity data.',
  },
  terms_estimated: {
    title: 'Terms estimated',
    description: 'Synthetic APR, payment, and repayment totals were calculated locally.',
  },
  documents_pending: {
    title: 'Documents pending',
    description: 'Checklist is visible, but uploads are disabled in demo mode.',
  },
  final_review: {
    title: 'Final review',
    description: 'Future partner review would happen here in a production app.',
  },
  demo_complete: {
    title: 'Demo complete',
    description: 'The simulated application has reached the end of the sandbox flow.',
  },
};

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function roundRatio(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

export function calculateMonthlyPayment(principal: number, apr: number, months: number): number {
  if (principal <= 0 || months <= 0) {
    return 0;
  }

  const monthlyRate = apr / 100 / 12;

  if (monthlyRate === 0) {
    return roundMoney(principal / months);
  }

  const compound = (1 + monthlyRate) ** months;
  return roundMoney((principal * monthlyRate * compound) / (compound - 1));
}

export function calculateTotalRepayment(monthlyPayment: number, months: number): number {
  if (monthlyPayment <= 0 || months <= 0) {
    return 0;
  }

  return roundMoney(monthlyPayment * months);
}

export function calculateTotalInterest(totalRepayment: number, principal: number): number {
  return roundMoney(Math.max(totalRepayment - principal, 0));
}

export function calculatePaymentBurden(monthlyPayment: number, monthlyIncome: number): number {
  if (monthlyPayment <= 0 || monthlyIncome <= 0) {
    return 0;
  }

  return roundRatio(monthlyPayment / monthlyIncome);
}

export function classifyPaymentBurden(burden: number): PaymentBurdenLevel {
  if (burden <= 0.05) {
    return 'Light';
  }

  if (burden <= 0.1) {
    return 'Manageable';
  }

  if (burden <= 0.15) {
    return 'Needs caution';
  }

  return 'High burden';
}

function mapScoreToRisk(score: number): DirectionalRisk {
  if (score <= 0) {
    return 'Helps';
  }

  if (score <= 2) {
    return 'Neutral';
  }

  if (score <= 4) {
    return 'Slight risk';
  }

  return 'Significant risk';
}

function mapScoreToReadiness(score: number): ReadinessLevel {
  if (score <= 2) {
    return 'Ready to compare';
  }

  if (score <= 4) {
    return 'Needs caution';
  }

  return 'High caution';
}

export function estimateReadiness(profile: BorrowerProfile, offer: LoanOffer): ReadinessEstimate {
  const monthlyPayment = calculateMonthlyPayment(offer.principal, offer.apr, offer.months);
  const paymentBurden = calculatePaymentBurden(monthlyPayment, profile.estimatedMonthlyIncome);
  const totalDebtLoad = roundRatio(
    (profile.currentMonthlyObligations + monthlyPayment) / profile.estimatedMonthlyIncome
  );
  const burdenLevel = classifyPaymentBurden(paymentBurden);
  const reasons: string[] = [];
  let score = 0;

  if (paymentBurden > 0.15) {
    score += 3;
    reasons.push('Estimated payment is a high share of demo monthly income.');
  } else if (paymentBurden > 0.1) {
    score += 2;
    reasons.push('Estimated payment needs extra monthly budget caution.');
  } else if (paymentBurden > 0.05) {
    score += 1;
    reasons.push('Estimated payment is manageable but still adds obligation.');
  } else {
    reasons.push('Estimated payment is a light share of demo monthly income.');
  }

  if (totalDebtLoad > 0.4) {
    score += 3;
    reasons.push('Total demo obligations would be elevated after this payment.');
  } else if (totalDebtLoad > 0.3) {
    score += 1;
    reasons.push('Total demo obligations should be watched before borrowing.');
  }

  if (profile.currentCreditUtilization >= 50) {
    score += 1;
    reasons.push('Credit utilization is near a caution zone in the Maya profile.');
  }

  if (profile.recentInquiries >= 2) {
    score += 1;
    reasons.push('Recent inquiries may add friction in a real lender review.');
  }

  if (profile.paymentHistoryCaution.length > 0) {
    score += 1;
    reasons.push('Payment history has a caution note in the synthetic profile.');
  }

  if (offer.apr >= 30) {
    score += 3;
    reasons.push('APR is high in this synthetic offer, increasing total repayment.');
  } else if (offer.apr === 0) {
    score -= 1;
    reasons.push('Zero APR keeps the demo repayment cost simpler.');
  }

  if (offer.secured) {
    score -= 1;
    reasons.push('Secured structure may reduce borrowing cost but requires a demo deposit.');
  }

  return {
    level: mapScoreToReadiness(score),
    directionalRisk: mapScoreToRisk(score),
    burdenLevel,
    paymentBurden,
    totalDebtLoad,
    reasons,
  };
}

function addMonths(startDate: Date, monthsToAdd: number): Date {
  return new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth() + monthsToAdd,
      startDate.getUTCDate()
    )
  );
}

function normalizeStartDate(startDate: string | Date): Date {
  if (typeof startDate === 'string') {
    const [year, month, day] = startDate.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  return new Date(
    Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate())
  );
}

export function generateRepaymentSchedule(
  offer: LoanOffer,
  startDate: string | Date
): RepaymentScheduleItem[] {
  const monthlyPayment = calculateMonthlyPayment(offer.principal, offer.apr, offer.months);
  const monthlyRate = offer.apr / 100 / 12;
  const normalizedStartDate = normalizeStartDate(startDate);
  let remainingBalance = offer.principal;

  return Array.from({ length: offer.months }, (_, index) => {
    const installment = index + 1;
    const interest = roundMoney(remainingBalance * monthlyRate);
    const scheduledPayment =
      installment === offer.months ? roundMoney(remainingBalance + interest) : monthlyPayment;
    const principalPayment = roundMoney(Math.min(scheduledPayment - interest, remainingBalance));

    remainingBalance = roundMoney(Math.max(remainingBalance - principalPayment, 0));

    if (installment === offer.months) {
      remainingBalance = 0;
    }

    return {
      installment,
      dueDate: addMonths(normalizedStartDate, index + 1).toISOString().slice(0, 10),
      payment: scheduledPayment,
      principal: principalPayment,
      interest,
      remainingBalance,
    };
  });
}

function buildPros(offer: LoanOffer, readiness: ReadinessEstimate): string[] {
  const pros = [offer.bestFor];

  if (offer.apr <= 10) {
    pros.push('Lower synthetic APR than the other demo options.');
  }

  if (readiness.paymentBurden <= 0.05) {
    pros.push('Light estimated payment burden for Maya.');
  }

  if (offer.fundingSpeedEstimate.includes('Same day')) {
    pros.push('Fast demo funding timeline.');
  }

  if (offer.apr === 0) {
    pros.push('No demo interest cost when paid on schedule.');
  }

  return pros;
}

function buildCons(offer: LoanOffer, readiness: ReadinessEstimate): string[] {
  const cons: string[] = [];

  if (offer.apr >= 30) {
    cons.push('High-cost synthetic APR requires caution.');
  }

  if (readiness.paymentBurden > 0.1) {
    cons.push('Payment burden could pressure the monthly budget.');
  }

  if (offer.secured) {
    cons.push('Requires a demo deposit; no real funds are collected.');
  }

  if (offer.months <= 6 && offer.principal >= 800) {
    cons.push('Short term creates a larger monthly payment.');
  }

  if (cons.length === 0) {
    cons.push('Still a simulated debt obligation, so compare before applying.');
  }

  return cons;
}

export function compareLoanOffers(
  offers: LoanOffer[],
  profile: BorrowerProfile
): LoanComparisonResult[] {
  return offers.map((offer) => {
    const monthlyPayment = calculateMonthlyPayment(offer.principal, offer.apr, offer.months);
    const totalRepayment = calculateTotalRepayment(monthlyPayment, offer.months);
    const totalInterest = calculateTotalInterest(totalRepayment, offer.principal);
    const paymentBurden = calculatePaymentBurden(monthlyPayment, profile.estimatedMonthlyIncome);
    const readiness = estimateReadiness(profile, offer);

    return {
      offerId: offer.id,
      name: offer.name,
      principal: offer.principal,
      apr: offer.apr,
      months: offer.months,
      monthlyPayment,
      totalRepayment,
      totalInterest,
      paymentBurden,
      paymentBurdenLevel: classifyPaymentBurden(paymentBurden),
      fundingSpeedEstimate: offer.fundingSpeedEstimate,
      readiness,
      pros: buildPros(offer, readiness),
      cons: buildCons(offer, readiness),
    };
  });
}

export function generateStatusTimeline(application: LoanApplication): StatusTimelineItem[] {
  const activeIndex = STATUS_ORDER.indexOf(application.status);

  return STATUS_ORDER.map((status, index) => {
    const state =
      application.status === 'demo_complete'
        ? 'complete'
        : index < activeIndex
          ? 'complete'
          : index === activeIndex
            ? 'current'
            : 'locked';

    return {
      status,
      title: STATUS_COPY[status].title,
      description: STATUS_COPY[status].description,
      state,
    };
  });
}
