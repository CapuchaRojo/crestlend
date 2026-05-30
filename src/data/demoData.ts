import type {
  BorrowerProfile,
  DisclosureItem,
  LoanApplication,
  LoanOffer,
} from '@/src/types/lending';

export const creditCrestLinks = {
  home: 'https://creditcrest-ai.vercel.app/',
  lendingLab: 'https://creditcrest-ai.vercel.app/lending-lab',
  calculatorHub: 'https://creditcrest-ai.vercel.app/calculator-hub',
  methodology: 'https://creditcrest-ai.vercel.app/methodology',
};

export const productRelationship = {
  crestlend:
    'CrestLend helps users compare, organize, and manage lending journeys in a sandbox environment.',
  creditCrest:
    'CreditCrest AI helps users understand the financial concepts behind those lending decisions.',
};

export const futurePartnerCapabilities = [
  {
    title: 'Licensed lender partner API',
    description: 'Future integration surface for eligible partner offers and status updates.',
  },
  {
    title: 'Identity verification',
    description: 'Future compliant KYC/KYB flow after licensing and vendor review.',
  },
  {
    title: 'Secure document upload',
    description: 'Future encrypted document intake with retention, access, and audit controls.',
  },
  {
    title: 'Open banking',
    description: 'Future user-permissioned cash-flow data connection through a vetted provider.',
  },
  {
    title: 'Credit bureau soft pull',
    description: 'Future permissible-purpose credit review through a compliant bureau partner.',
  },
  {
    title: 'Payment processor',
    description: 'Future repayment and autopay rails through a licensed payment partner.',
  },
];

export const mayaProfile: BorrowerProfile = {
  id: 'maya-demo',
  name: 'Maya',
  borrowerStatus: 'Demo profile',
  readiness: 'Needs caution',
  borrowingGoal: 'Repair vehicle',
  desiredLoanAmount: 1500,
  estimatedMonthlyIncome: 2400,
  currentMonthlyObligations: 430,
  preferredMonthlyPayment: 140,
  employmentCategory: 'W-2 employee',
  creditEducationComfort: 'Somewhat familiar',
  currentCreditUtilization: 49,
  recentInquiries: 1,
  paymentHistoryCaution: 'One late payment 10 months ago',
  profileSource: 'maya-demo',
};

export const loanOffers: LoanOffer[] = [
  {
    id: 'personal-starter',
    name: 'Personal Starter Loan',
    principal: 1000,
    minAmount: 500,
    maxAmount: 2000,
    apr: 18,
    minApr: 15,
    maxApr: 22,
    months: 12,
    minMonths: 6,
    maxMonths: 18,
    bestFor: 'Predictable personal expenses with room to compare.',
    disclosureBadge: 'Synthetic offer',
    directionalRisk: 'Neutral',
    fundingSpeedEstimate: '1-2 demo business days',
    readinessHint: 'Needs caution',
    demoNotes: [
      'No real lender offer is being shown.',
      'Payment estimate uses local deterministic math.',
    ],
  },
  {
    id: 'credit-builder',
    name: 'Credit Builder Loan',
    principal: 500,
    minAmount: 300,
    maxAmount: 1000,
    apr: 9,
    minApr: 7,
    maxApr: 12,
    months: 12,
    minMonths: 6,
    maxMonths: 12,
    bestFor: 'Small installment practice with secured demo structure.',
    disclosureBadge: 'Deposit required in real-world analogs',
    directionalRisk: 'Helps',
    fundingSpeedEstimate: 'After demo deposit review',
    readinessHint: 'Ready to compare',
    secured: true,
    demoNotes: [
      'Secured/deposit concept is educational only.',
      'CrestLend does not collect real funds in this demo.',
    ],
  },
  {
    id: 'emergency-flex',
    name: 'Emergency Flex Loan',
    principal: 800,
    minAmount: 300,
    maxAmount: 1000,
    apr: 36,
    minApr: 28,
    maxApr: 36,
    months: 6,
    minMonths: 3,
    maxMonths: 9,
    bestFor: 'Urgent needs when lower-cost options are not available.',
    disclosureBadge: 'High-cost warning',
    directionalRisk: 'Significant risk',
    fundingSpeedEstimate: 'Same day in demo',
    readinessHint: 'High caution',
    demoNotes: [
      'High APR can raise total repayment quickly.',
      'Compare alternatives before choosing this simulated option.',
    ],
  },
  {
    id: 'device-financing',
    name: 'Device Financing',
    principal: 900,
    minAmount: 400,
    maxAmount: 1200,
    apr: 0,
    minApr: 0,
    maxApr: 0,
    months: 4,
    minMonths: 3,
    maxMonths: 6,
    bestFor: 'Short planned purchase with disciplined payoff.',
    disclosureBadge: 'No hard inquiry in demo',
    directionalRisk: 'Neutral',
    fundingSpeedEstimate: 'Instant simulated decisioning',
    readinessHint: 'Needs caution',
    demoNotes: [
      'Zero APR is synthetic and not a real retailer offer.',
      'Short terms can still create payment pressure.',
    ],
  },
  {
    id: 'auto-repair',
    name: 'Auto Repair Loan',
    principal: 1500,
    minAmount: 750,
    maxAmount: 3000,
    apr: 22,
    minApr: 18,
    maxApr: 27,
    months: 18,
    minMonths: 12,
    maxMonths: 24,
    bestFor: 'Necessary repair costs with a longer repayment window.',
    disclosureBadge: 'Synthetic offer',
    directionalRisk: 'Slight risk',
    fundingSpeedEstimate: '2-3 demo business days',
    readinessHint: 'Needs caution',
    demoNotes: [
      'Offer is simulated for education and product testing.',
      'No approval, denial, or lender matching occurs.',
    ],
  },
];

export const exampleApplication: LoanApplication = {
  id: 'demo-app-001',
  applicantName: 'Maya',
  purpose: 'Auto repair',
  requestedAmount: 1500,
  selectedOfferId: 'auto-repair',
  monthlyIncome: mayaProfile.estimatedMonthlyIncome,
  employmentType: 'W-2 employee',
  status: 'documents_pending',
  submittedAt: '2026-05-30',
  demoConsentAccepted: true,
};

export const documentRequirements = [
  {
    title: 'Identity verification',
    description: 'Future partner-ready identity verification. Demo mode collects no IDs.',
  },
  {
    title: 'Proof of income',
    description: 'Future secure document upload or verified income data. Do not upload real records.',
  },
  {
    title: 'Address verification',
    description: 'Future compliance-controlled address review after vendor and policy setup.',
  },
  {
    title: 'Bank account verification',
    description: 'Future open banking connection. No bank credentials or account numbers are collected.',
  },
  {
    title: 'Credit review',
    description: 'Future credit bureau soft pull through a compliant partner. No real credit pull happens.',
  },
];

export const disclosureItems: DisclosureItem[] = [
  {
    title: 'CrestLend demo mode disclosure',
    body: 'CrestLend is a production-oriented sandbox for comparing and managing lending journeys without live lending activity.',
  },
  {
    title: 'Synthetic offers only',
    body: 'Loan products, APRs, terms, payments, timelines, and statuses are simulated.',
  },
  {
    title: 'No real lending',
    body: 'CrestLend is not a lender and does not broker, approve, deny, fund, or service loans.',
  },
  {
    title: 'No sensitive identifier collection',
    body: 'The app does not ask for SSNs, bank credentials, bureau credentials, identity documents, or sensitive financial identifiers.',
  },
  {
    title: 'No lender matching',
    body: 'No real lender, marketplace, partner, or underwriting integration is active in this demo.',
  },
  {
    title: 'Future compliance requirements',
    body: 'A production version would require licensing analysis, partner compliance, APR disclosures, a privacy policy, security controls, monitoring, and partner/vendor governance.',
  },
];

export const helpTopics = [
  {
    title: 'APR explained',
    description: 'Learn how annual percentage rates affect borrowing cost.',
    url: creditCrestLinks.calculatorHub,
  },
  {
    title: 'EMI/monthly payment explained',
    description: 'See how principal, APR, and term shape an estimated payment.',
    url: creditCrestLinks.calculatorHub,
  },
  {
    title: 'Payment burden explained',
    description: 'Understand how a payment compares with monthly income.',
    url: creditCrestLinks.calculatorHub,
  },
  {
    title: 'Credit impact explained',
    description: 'Review directional education without official score predictions.',
    url: creditCrestLinks.lendingLab,
  },
  {
    title: 'Utilization explained',
    description: 'Learn why balances and limits matter in credit education.',
    url: creditCrestLinks.methodology,
  },
];
