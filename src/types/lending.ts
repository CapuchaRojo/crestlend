export type DirectionalRisk = 'Helps' | 'Neutral' | 'Slight risk' | 'Significant risk';

export type PaymentBurdenLevel = 'Light' | 'Manageable' | 'Needs caution' | 'High burden';

export type ReadinessLevel = 'Ready to compare' | 'Needs caution' | 'High caution';

export type ApplicationStatus =
  | 'started'
  | 'profile_reviewed'
  | 'terms_estimated'
  | 'documents_pending'
  | 'final_review'
  | 'demo_complete';

export type TimelineState = 'complete' | 'current' | 'locked';

export type LoanPurpose =
  | 'Emergency buffer'
  | 'Credit building'
  | 'Device purchase'
  | 'Auto repair'
  | 'Personal expense';

export type EmploymentType = 'W-2 employee' | 'Contractor' | 'Student' | 'Not listed';

export interface BorrowerProfile {
  id: string;
  name: string;
  borrowerStatus: string;
  readiness: ReadinessLevel;
  estimatedMonthlyIncome: number;
  currentMonthlyObligations: number;
  currentCreditUtilization: number;
  recentInquiries: number;
  paymentHistoryCaution: string;
}

export interface LoanOffer {
  id: string;
  name: string;
  principal: number;
  minAmount: number;
  maxAmount: number;
  apr: number;
  minApr: number;
  maxApr: number;
  months: number;
  minMonths: number;
  maxMonths: number;
  bestFor: string;
  disclosureBadge: string;
  directionalRisk: DirectionalRisk;
  fundingSpeedEstimate: string;
  readinessHint: ReadinessLevel;
  secured?: boolean;
  demoNotes: string[];
}

export interface ReadinessEstimate {
  level: ReadinessLevel;
  directionalRisk: DirectionalRisk;
  burdenLevel: PaymentBurdenLevel;
  paymentBurden: number;
  totalDebtLoad: number;
  reasons: string[];
}

export interface LoanComparisonResult {
  offerId: string;
  name: string;
  principal: number;
  apr: number;
  months: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  paymentBurden: number;
  paymentBurdenLevel: PaymentBurdenLevel;
  fundingSpeedEstimate: string;
  readiness: ReadinessEstimate;
  pros: string[];
  cons: string[];
}

export interface RepaymentScheduleItem {
  installment: number;
  dueDate: string;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  purpose: LoanPurpose;
  requestedAmount: number;
  selectedOfferId: string;
  monthlyIncome: number;
  employmentType: EmploymentType;
  status: ApplicationStatus;
  submittedAt: string;
  demoConsentAccepted: boolean;
}

export interface StatusTimelineItem {
  status: ApplicationStatus;
  title: string;
  description: string;
  state: TimelineState;
}

export interface DisclosureItem {
  title: string;
  body: string;
}
