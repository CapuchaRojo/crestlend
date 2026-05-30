import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PartnerReadinessCard } from '@/src/components/PartnerReadinessCard';
import {
  ActionButton,
  AppScreen,
  Badge,
  Card,
  DetailRow,
  ExternalLinkCard,
  ProgressDots,
  SectionHeader,
} from '@/src/components/ui';
import { creditCrestLinks, loanOffers } from '@/src/data/demoData';
import { useSandboxProfile } from '@/src/context/SandboxProfileContext';
import { colors, radii, spacing } from '@/src/constants/theme';
import {
  simulatedApplicationSchema,
  type SimulatedApplicationDraft,
  validateSimulatedApplication,
} from '@/src/lib/applicationValidation';
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateTotalRepayment,
  estimateReadiness,
} from '@/src/lib/lendingEngine';
import { mapBorrowingGoalToOfferId, mapBorrowingGoalToPurpose } from '@/src/lib/sandboxProfile';
import { formatCurrency, formatPercent } from '@/src/lib/formatters';
import type { BorrowerProfile, EmploymentType, LoanPurpose } from '@/src/types/lending';

const purposeDefaults: Record<
  LoanPurpose,
  { amount: number; offerId: string; caption: string }
> = {
  'Emergency buffer': {
    amount: 800,
    offerId: 'emergency-flex',
    caption: 'Compare this with lower-cost options first.',
  },
  'Credit building': {
    amount: 500,
    offerId: 'credit-builder',
    caption: 'Small secured-style demo structure.',
  },
  'Device purchase': {
    amount: 900,
    offerId: 'device-financing',
    caption: 'Short payoff window with zero demo APR.',
  },
  'Auto repair': {
    amount: 1500,
    offerId: 'auto-repair',
    caption: 'Longer term for a necessary repair.',
  },
  'Personal expense': {
    amount: 1000,
    offerId: 'personal-starter',
    caption: 'General-purpose demo installment loan.',
  },
};

const employmentOptions: EmploymentType[] = [
  'W-2 employee',
  'Contractor',
  'Student',
  'Not listed',
];

const stepTitles = [
  'Purpose',
  'Profile',
  'Income',
  'Terms',
  'Disclosure',
  'Submit',
];

export default function ApplyScreen() {
  const { profile } = useSandboxProfile();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [draft, setDraft] = useState<SimulatedApplicationDraft>({
    purpose: mapBorrowingGoalToPurpose(profile.borrowingGoal),
    requestedAmount: profile.desiredLoanAmount,
    applicantName: profile.name,
    profileMode: 'Synthetic demo profile',
    monthlyIncome: profile.estimatedMonthlyIncome,
    employmentType: profile.employmentCategory,
    selectedOfferId: mapBorrowingGoalToOfferId(profile.borrowingGoal),
    demoConsentAccepted: false,
  });

  const selectedOffer = useMemo(
    () => loanOffers.find((offer) => offer.id === draft.selectedOfferId) ?? loanOffers[0],
    [draft.selectedOfferId]
  );
  const monthlyPayment = calculateMonthlyPayment(
    selectedOffer.principal,
    selectedOffer.apr,
    selectedOffer.months
  );
  const totalRepayment = calculateTotalRepayment(monthlyPayment, selectedOffer.months);
  const totalInterest = calculateTotalInterest(totalRepayment, selectedOffer.principal);
  const readiness = estimateReadiness(
    { ...profile, estimatedMonthlyIncome: draft.monthlyIncome },
    selectedOffer
  );

  function setPurpose(purpose: LoanPurpose) {
    const defaults = purposeDefaults[purpose];
    setDraft((current) => ({
      ...current,
      purpose,
      requestedAmount: defaults.amount,
      selectedOfferId: defaults.offerId,
    }));
  }

  function validateCurrentStep() {
    setError(null);
    const stepSchema =
      step === 0
        ? simulatedApplicationSchema.pick({ purpose: true, requestedAmount: true })
        : step === 2
          ? simulatedApplicationSchema.pick({ monthlyIncome: true, employmentType: true })
          : step === 4
            ? simulatedApplicationSchema.pick({ demoConsentAccepted: true })
            : null;

    if (!stepSchema) {
      return true;
    }

    const result = stepSchema.safeParse(draft);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Check this step before continuing.');
      return false;
    }

    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) {
      return;
    }

    setStep((current) => Math.min(current + 1, stepTitles.length - 1));
  }

  function submitApplication() {
    const result = validateSimulatedApplication(draft);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Review the simulated application.');
      return;
    }

    setError(null);
    setSubmitted(true);
  }

  return (
    <AppScreen
      eyebrow="Simulated Application"
      title="Prepare a lending journey."
      subtitle="A production-style application workspace using Maya's synthetic profile. No sensitive identifiers are collected."
      rightSlot={<Badge label={`Step ${step + 1}/6`} variant="demo" />}
    >
      <Card>
        <View style={styles.progressHeader}>
          <Text style={styles.stepName}>{stepTitles[step]}</Text>
          <Badge label="Demo Mode" variant="demo" />
        </View>
        <ProgressDots current={step} total={stepTitles.length} />
      </Card>

      {error ? (
        <Card accent="coral">
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      ) : null}

      {submitted ? (
        <SubmittedState onStatus={() => router.push('/status')} onRestart={() => {
          setSubmitted(false);
          setStep(0);
          setDraft((current) => ({ ...current, demoConsentAccepted: false }));
        }} />
      ) : (
        <>
          {step === 0 ? (
            <StepPurpose draft={draft} setPurpose={setPurpose} setDraft={setDraft} />
          ) : null}
          {step === 1 ? <StepProfile profile={profile} /> : null}
          {step === 2 ? <StepIncome draft={draft} setDraft={setDraft} /> : null}
          {step === 3 ? (
            <StepTerms
              selectedOfferId={draft.selectedOfferId}
              setDraft={setDraft}
              monthlyPayment={monthlyPayment}
              totalRepayment={totalRepayment}
              totalInterest={totalInterest}
              readinessLevel={readiness.level}
              preferredMonthlyPayment={profile.preferredMonthlyPayment}
            />
          ) : null}
          {step === 4 ? (
            <StepConsent draft={draft} setDraft={setDraft} selectedOfferName={selectedOffer.name} />
          ) : null}
          {step === 5 ? (
            <StepSubmit
              draft={draft}
              offerName={selectedOffer.name}
              monthlyPayment={monthlyPayment}
              totalRepayment={totalRepayment}
              readinessLevel={readiness.level}
              preferredMonthlyPayment={profile.preferredMonthlyPayment}
              onSubmit={submitApplication}
            />
          ) : null}

          <View style={styles.navRow}>
            <ActionButton
              label="Back"
              icon="arrow-left"
              variant="ghost"
              disabled={step === 0}
              style={styles.navButton}
              onPress={() => {
                setError(null);
                setStep((current) => Math.max(current - 1, 0));
              }}
            />
            {step < stepTitles.length - 1 ? (
              <ActionButton
                label="Next"
                icon="arrow-right"
                style={styles.navButton}
                onPress={goNext}
              />
            ) : null}
          </View>
          <PartnerReadinessCard />
        </>
      )}
    </AppScreen>
  );
}

function StepPurpose({
  draft,
  setPurpose,
  setDraft,
}: {
  draft: SimulatedApplicationDraft;
  setPurpose: (purpose: LoanPurpose) => void;
  setDraft: Dispatch<SetStateAction<SimulatedApplicationDraft>>;
}) {
  return (
    <View style={styles.stepWrap}>
      <SectionHeader
        title="Loan purpose and amount"
        caption="Use synthetic demo values only. This is not a real loan request."
      />
      <View style={styles.optionList}>
        {(Object.keys(purposeDefaults) as LoanPurpose[]).map((purpose) => (
          <OptionButton
            key={purpose}
            label={purpose}
            caption={purposeDefaults[purpose].caption}
            active={draft.purpose === purpose}
            onPress={() => setPurpose(purpose)}
          />
        ))}
      </View>
      <Card>
        <Text style={styles.inputLabel}>Requested demo amount</Text>
        <TextInput
          accessibilityLabel="Requested demo amount"
          keyboardType="numeric"
          value={String(draft.requestedAmount)}
          onChangeText={(value) =>
            setDraft((current) => ({
              ...current,
              requestedAmount: Number(value.replace(/[^0-9]/g, '')),
            }))
          }
          style={styles.input}
        />
        <Text style={styles.helperText}>Demo range: $100-$3,000. No real application is submitted.</Text>
      </Card>
    </View>
  );
}

function StepProfile({ profile }: { profile: BorrowerProfile }) {
  return (
    <View style={styles.stepWrap}>
      <SectionHeader
        title="Basic profile"
        caption="The sandbox preserves the synthetic Maya profile and avoids real identity fields."
      />
      <Card accent="primary">
        <DetailRow label="Applicant" value={profile.name} />
        <DetailRow label="Borrower status" value={profile.borrowerStatus} />
        <DetailRow label="Borrowing goal" value={profile.borrowingGoal} />
        <DetailRow label="Desired amount" value={formatCurrency(profile.desiredLoanAmount)} />
        <DetailRow label="Comfort payment" value={formatCurrency(profile.preferredMonthlyPayment)} />
        <DetailRow label="Education comfort" value={profile.creditEducationComfort} />
      </Card>
      <Card accent="amber">
        <Text style={styles.disclosureText}>
          No SSN, date of birth, government ID, bank login, credit bureau login, or address proof is
          requested in this simulated flow.
        </Text>
      </Card>
    </View>
  );
}

function StepIncome({
  draft,
  setDraft,
}: {
  draft: SimulatedApplicationDraft;
  setDraft: Dispatch<SetStateAction<SimulatedApplicationDraft>>;
}) {
  return (
    <View style={styles.stepWrap}>
      <SectionHeader
        title="Income and employment"
        caption="Prefilled demo-only values help estimate payment burden without collecting real financial identifiers."
      />
      <Card>
        <Text style={styles.inputLabel}>Synthetic monthly income</Text>
        <TextInput
          accessibilityLabel="Synthetic monthly income"
          keyboardType="numeric"
          value={String(draft.monthlyIncome)}
          onChangeText={(value) =>
            setDraft((current) => ({
              ...current,
              monthlyIncome: Number(value.replace(/[^0-9]/g, '')),
            }))
          }
          style={styles.input}
        />
        <Text style={styles.helperText}>This is a demo field. Do not enter sensitive real income records.</Text>
      </Card>
      <View style={styles.optionList}>
        {employmentOptions.map((employmentType) => (
          <OptionButton
            key={employmentType}
            label={employmentType}
            active={draft.employmentType === employmentType}
            onPress={() => setDraft((current) => ({ ...current, employmentType }))}
          />
        ))}
      </View>
    </View>
  );
}

function StepTerms({
  selectedOfferId,
  setDraft,
  monthlyPayment,
  totalRepayment,
  totalInterest,
  readinessLevel,
  preferredMonthlyPayment,
}: {
  selectedOfferId: string;
  setDraft: Dispatch<SetStateAction<SimulatedApplicationDraft>>;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  readinessLevel: string;
  preferredMonthlyPayment: number;
}) {
  const selectedOffer = loanOffers.find((offer) => offer.id === selectedOfferId) ?? loanOffers[0];

  return (
    <View style={styles.stepWrap}>
      <SectionHeader
        title="Review estimated terms"
        caption="Choose a synthetic offer and inspect production-style local payment estimates."
      />
      <View style={styles.optionList}>
        {loanOffers.map((offer) => (
          <OptionButton
            key={offer.id}
            label={offer.name}
            caption={`${formatCurrency(offer.principal)} at ${formatPercent(offer.apr)} APR`}
            active={selectedOfferId === offer.id}
            onPress={() => setDraft((current) => ({ ...current, selectedOfferId: offer.id }))}
          />
        ))}
      </View>
      <Card accent="blue">
        <DetailRow label="Selected offer" value={selectedOffer.name} />
        <DetailRow label="Principal" value={formatCurrency(selectedOffer.principal)} />
        <DetailRow label="APR" value={formatPercent(selectedOffer.apr)} />
        <DetailRow label="Term" value={`${selectedOffer.months} months`} />
        <DetailRow label="Estimated monthly payment" value={formatCurrency(monthlyPayment)} />
        <DetailRow label="Total repayment" value={formatCurrency(totalRepayment)} />
        <DetailRow label="Total interest" value={formatCurrency(totalInterest)} />
        <DetailRow label="Payment comfort" value={formatCurrency(preferredMonthlyPayment)} />
        <DetailRow label="Readiness" value={readinessLevel} />
      </Card>
    </View>
  );
}

function StepConsent({
  draft,
  setDraft,
  selectedOfferName,
}: {
  draft: SimulatedApplicationDraft;
  setDraft: Dispatch<SetStateAction<SimulatedApplicationDraft>>;
  selectedOfferName: string;
}) {
  return (
    <View style={styles.stepWrap}>
      <SectionHeader
        title="Demo consent and disclosure"
        caption="Confirm that this is a sandbox action, not a real credit or lending application."
      />
      <Card accent="amber">
        <Text style={styles.disclosureText}>
          You are submitting a simulated application for {selectedOfferName}. CrestLend will not
          send this to a lender, pull credit, collect documents, or make an approval decision.
        </Text>
      </Card>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: draft.demoConsentAccepted }}
        onPress={() =>
          setDraft((current) => ({
            ...current,
            demoConsentAccepted: !current.demoConsentAccepted,
          }))
        }
        style={styles.checkboxRow}
      >
        <View style={[styles.checkbox, draft.demoConsentAccepted ? styles.checkboxChecked : null]}>
          {draft.demoConsentAccepted ? (
            <MaterialCommunityIcons name="check" size={17} color="#FFFFFF" />
          ) : null}
        </View>
        <Text style={styles.checkboxText}>
          I understand this is Demo Mode and no real lending action will occur.
        </Text>
      </Pressable>
    </View>
  );
}

function StepSubmit({
  draft,
  offerName,
  monthlyPayment,
  totalRepayment,
  readinessLevel,
  preferredMonthlyPayment,
  onSubmit,
}: {
  draft: SimulatedApplicationDraft;
  offerName: string;
  monthlyPayment: number;
  totalRepayment: number;
  readinessLevel: string;
  preferredMonthlyPayment: number;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.stepWrap}>
      <SectionHeader
        title="Submit simulated application"
        caption="Review the sandbox summary before generating a local status. This is not sent to a lender."
      />
      <Card accent="primary">
        <DetailRow label="Applicant" value={draft.applicantName} />
        <DetailRow label="Purpose" value={draft.purpose} />
        <DetailRow label="Requested amount" value={formatCurrency(draft.requestedAmount)} />
        <DetailRow label="Selected offer" value={offerName} />
        <DetailRow label="Estimated monthly" value={formatCurrency(monthlyPayment)} />
        <DetailRow label="Payment comfort" value={formatCurrency(preferredMonthlyPayment)} />
        <DetailRow label="Total repayment" value={formatCurrency(totalRepayment)} />
        <DetailRow label="Readiness" value={readinessLevel} />
      </Card>
      <ExternalLinkCard
        title="Learn with CreditCrest AI"
        description="Understand APR, payment burden, and credit concepts before submitting the simulated review."
        url={creditCrestLinks.lendingLab}
        icon="school-outline"
      />
      <ActionButton
        label="Submit simulated application"
        icon="send-check-outline"
        onPress={onSubmit}
      />
    </View>
  );
}

function SubmittedState({
  onStatus,
  onRestart,
}: {
  onStatus: () => void;
  onRestart: () => void;
}) {
  return (
    <View style={styles.stepWrap}>
      <Card accent="primary">
        <Badge label="Demo submitted" variant="success" />
        <Text style={styles.submittedTitle}>Simulated application submitted</Text>
        <Text style={styles.submittedText}>
          CrestLend generated a local demo status only. No lender, bureau, bank, or document system
          received any data.
        </Text>
        <ActionButton label="View status tracker" icon="timeline-check-outline" onPress={onStatus} />
        <ActionButton label="Start over" icon="refresh" variant="ghost" onPress={onRestart} />
      </Card>
    </View>
  );
}

function OptionButton({
  label,
  caption,
  active,
  onPress,
}: {
  label: string;
  caption?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        active ? styles.optionActive : null,
        pressed ? styles.optionPressed : null,
      ]}
    >
      <Text style={[styles.optionLabel, active ? styles.optionLabelActive : null]}>{label}</Text>
      {caption ? <Text style={styles.optionCaption}>{caption}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  stepName: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '900',
  },
  stepWrap: {
    gap: spacing.md,
  },
  optionList: {
    gap: spacing.sm,
  },
  option: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 4,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionPressed: {
    opacity: 0.82,
  },
  optionLabel: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  optionLabelActive: {
    color: colors.primaryDark,
  },
  optionCaption: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  inputLabel: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
  },
  input: {
    minHeight: 50,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    backgroundColor: '#F8FAFA',
    fontSize: 18,
    fontWeight: '800',
  },
  helperText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  disclosureText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxMark: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  checkboxText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  navButton: {
    flex: 1,
  },
  errorText: {
    color: colors.coral,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  submittedTitle: {
    color: colors.ink,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
  },
  submittedText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
