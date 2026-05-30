import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PartnerReadinessCard } from '@/src/components/PartnerReadinessCard';
import { ActionButton, AppScreen, Badge, Card, DetailRow, SectionHeader } from '@/src/components/ui';
import { colors, radii, spacing } from '@/src/constants/theme';
import { useSandboxProfile } from '@/src/context/SandboxProfileContext';
import { creditCrestLinks, productRelationship } from '@/src/data/demoData';
import {
  borrowingGoalOptions,
  createOnboardingDraftFromProfile,
  creditEducationComfortOptions,
  employmentCategoryOptions,
  mayaOnboardingDraft,
  sandboxOnboardingSchema,
  type SandboxOnboardingDraft,
} from '@/src/lib/sandboxProfile';
import type { BorrowerProfile } from '@/src/types/lending';

const compliancePoints = [
  'No SSN, full date of birth, account numbers, or bank credentials',
  'No credit bureau credentials, identity documents, uploaded files, or lender matching',
  'Synthetic offers only, with no approval or denial decisioning',
];

export default function OnboardingScreen() {
  const profileContext = useSandboxProfile();

  return (
    <OnboardingForm
      key={`${profileContext.profile.id}-${profileContext.isHydrated ? 'ready' : 'loading'}`}
      initialProfile={profileContext.profile}
      saveProfile={profileContext.saveProfile}
      applyMayaProfile={profileContext.useMayaProfile}
      resetProfile={profileContext.resetProfile}
    />
  );
}

function OnboardingForm({
  initialProfile,
  saveProfile,
  applyMayaProfile,
  resetProfile,
}: {
  initialProfile: BorrowerProfile;
  saveProfile: (draft: SandboxOnboardingDraft) => Promise<BorrowerProfile>;
  applyMayaProfile: () => Promise<BorrowerProfile>;
  resetProfile: () => Promise<BorrowerProfile>;
}) {
  const [draft, setDraft] = useState<SandboxOnboardingDraft>(() =>
    createOnboardingDraftFromProfile(initialProfile)
  );
  const [error, setError] = useState<string | null>(null);

  async function continueWithProfile() {
    const result = sandboxOnboardingSchema.safeParse(draft);

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Review the sandbox borrower profile.');
      return;
    }

    setError(null);
    await saveProfile(result.data);
    router.replace('/home');
  }

  async function skipToMaya() {
    setError(null);
    setDraft(mayaOnboardingDraft);
    await applyMayaProfile();
    router.replace('/home');
  }

  async function resetDemoProfile() {
    setError(null);
    setDraft(mayaOnboardingDraft);
    await resetProfile();
  }

  return (
    <AppScreen
      eyebrow="Welcome to CrestLend"
      title="Borrow with clarity."
      subtitle="Set up a local sandbox borrower profile for production-style loan comparison without live lending."
      rightSlot={<Badge label="Sandbox" variant="demo" />}
    >
      <Card accent="primary">
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <MaterialCommunityIcons name="bank-outline" size={30} color="#FFFFFF" />
          </View>
          <View style={styles.logoText}>
            <Text style={styles.heroTitle}>Create a sandbox borrower profile.</Text>
            <Text style={styles.heroCopy}>
              {productRelationship.crestlend} {productRelationship.creditCrest}
            </Text>
          </View>
        </View>
        <View style={styles.localNotice}>
          <MaterialCommunityIcons name="cellphone-lock" size={19} color={colors.primaryDark} />
          <Text style={styles.localNoticeText}>Stored locally on this device/browser only.</Text>
        </View>
      </Card>

      <Card accent="amber">
        <Badge label="Demo Mode disclosure" variant="warning" />
        {compliancePoints.map((point) => (
          <View key={point} style={styles.trustRow}>
            <MaterialCommunityIcons name="check-circle-outline" size={19} color={colors.primary} />
            <Text style={styles.trustText}>{point}</Text>
          </View>
        ))}
      </Card>

      <SectionHeader
        title="Borrower setup"
        caption="Use approximate sandbox values only. These fields tune estimates and local app copy."
      />

      {error ? (
        <Card accent="coral">
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      ) : null}

      <Card>
        <Text style={styles.fieldTitle}>Borrowing goal</Text>
        <OptionGrid
          options={borrowingGoalOptions}
          selected={draft.borrowingGoal}
          onSelect={(borrowingGoal) =>
            setDraft((current) => ({
              ...current,
              borrowingGoal,
            }))
          }
        />
      </Card>

      <Card>
        <Text style={styles.fieldTitle}>Sandbox numbers</Text>
        <MoneyInput
          label="Desired loan amount"
          value={draft.desiredLoanAmount}
          onChange={(desiredLoanAmount) =>
            setDraft((current) => ({
              ...current,
              desiredLoanAmount,
            }))
          }
        />
        <MoneyInput
          label="Estimated monthly income"
          value={draft.estimatedMonthlyIncome}
          onChange={(estimatedMonthlyIncome) =>
            setDraft((current) => ({
              ...current,
              estimatedMonthlyIncome,
            }))
          }
        />
        <MoneyInput
          label="Existing monthly obligations"
          value={draft.currentMonthlyObligations}
          onChange={(currentMonthlyObligations) =>
            setDraft((current) => ({
              ...current,
              currentMonthlyObligations,
            }))
          }
        />
        <MoneyInput
          label="Preferred monthly payment comfort"
          value={draft.preferredMonthlyPayment}
          onChange={(preferredMonthlyPayment) =>
            setDraft((current) => ({
              ...current,
              preferredMonthlyPayment,
            }))
          }
        />
      </Card>

      <Card>
        <Text style={styles.fieldTitle}>Employment category</Text>
        <OptionGrid
          options={employmentCategoryOptions}
          selected={draft.employmentCategory}
          onSelect={(employmentCategory) =>
            setDraft((current) => ({
              ...current,
              employmentCategory,
            }))
          }
        />
      </Card>

      <Card>
        <Text style={styles.fieldTitle}>Credit education comfort</Text>
        <OptionGrid
          options={creditEducationComfortOptions}
          selected={draft.creditEducationComfort}
          onSelect={(creditEducationComfort) =>
            setDraft((current) => ({
              ...current,
              creditEducationComfort,
            }))
          }
        />
      </Card>

      <Card accent="blue">
        <Text style={styles.fieldTitle}>Profile preview</Text>
        <DetailRow label="Profile mode" value="Local sandbox profile" />
        <DetailRow label="Storage" value="This device/browser only" />
        <DetailRow label="No sensitive data" value="No IDs, accounts, uploads, or bureau credentials" />
      </Card>

      <ActionButton
        label="Continue to CrestLend"
        icon="arrow-right"
        onPress={continueWithProfile}
      />
      <ActionButton
        label="Learn first with CreditCrest AI"
        icon="school-outline"
        variant="secondary"
        onPress={() => Linking.openURL(creditCrestLinks.home)}
      />
      <ActionButton
        label="Skip and use Maya demo profile"
        icon="account-arrow-right-outline"
        variant="ghost"
        onPress={skipToMaya}
      />
      <ActionButton
        label="Reset demo profile"
        icon="refresh"
        variant="ghost"
        onPress={resetDemoProfile}
      />

      <PartnerReadinessCard />
    </AppScreen>
  );
}

function OptionGrid<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={styles.optionGrid}>
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === option }}
          onPress={() => onSelect(option)}
          style={({ pressed }) => [
            styles.option,
            selected === option ? styles.optionActive : null,
            pressed ? styles.optionPressed : null,
          ]}
        >
          <Text style={[styles.optionText, selected === option ? styles.optionTextActive : null]}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType="numeric"
        value={String(value)}
        onChangeText={(nextValue) => onChange(Number(nextValue.replace(/[^0-9]/g, '')))}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  logoMark: {
    width: 58,
    height: 58,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    flex: 1,
    gap: 6,
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 23,
    lineHeight: 30,
    fontWeight: '900',
  },
  heroCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  localNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  localNoticeText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  trustText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  errorText: {
    color: colors.coral,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
  },
  fieldTitle: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '900',
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionPressed: {
    opacity: 0.78,
  },
  optionText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
  },
  optionTextActive: {
    color: colors.primaryDark,
  },
  inputBlock: {
    gap: 6,
  },
  inputLabel: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
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
});
