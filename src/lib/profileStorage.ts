import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createMayaSandboxProfile,
  createSandboxProfileFromDraft,
  sandboxOnboardingSchema,
  type SandboxOnboardingDraft,
} from '@/src/lib/sandboxProfile';
import type { BorrowerProfile } from '@/src/types/lending';

const STORAGE_KEY = 'crestlend:sandbox-borrower-profile:v1';

export async function loadSandboxBorrowerProfile(): Promise<BorrowerProfile> {
  const rawProfile = await AsyncStorage.getItem(STORAGE_KEY);

  if (!rawProfile) {
    return createMayaSandboxProfile();
  }

  try {
    const parsedProfile = JSON.parse(rawProfile) as Partial<BorrowerProfile>;
    const draft = sandboxOnboardingSchema.parse(parsedProfile);

    return {
      ...createSandboxProfileFromDraft(draft),
      id: parsedProfile.id === 'local-sandbox-profile' ? parsedProfile.id : 'local-sandbox-profile',
      name: 'Sandbox borrower',
      borrowerStatus: 'Local sandbox profile',
      profileSource: 'custom-sandbox',
    };
  } catch {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return createMayaSandboxProfile();
  }
}

export async function saveSandboxBorrowerProfile(
  draft: SandboxOnboardingDraft
): Promise<BorrowerProfile> {
  const profile = createSandboxProfileFromDraft(draft);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export async function resetSandboxBorrowerProfile(): Promise<BorrowerProfile> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return createMayaSandboxProfile();
}

export async function saveMayaDemoProfile(): Promise<BorrowerProfile> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return createMayaSandboxProfile();
}
