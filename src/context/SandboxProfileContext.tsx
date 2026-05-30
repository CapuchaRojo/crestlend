import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  loadSandboxBorrowerProfile,
  resetSandboxBorrowerProfile,
  saveMayaDemoProfile,
  saveSandboxBorrowerProfile,
} from '@/src/lib/profileStorage';
import { createMayaSandboxProfile, type SandboxOnboardingDraft } from '@/src/lib/sandboxProfile';
import type { BorrowerProfile } from '@/src/types/lending';

interface SandboxProfileContextValue {
  profile: BorrowerProfile;
  isHydrated: boolean;
  saveProfile: (draft: SandboxOnboardingDraft) => Promise<BorrowerProfile>;
  useMayaProfile: () => Promise<BorrowerProfile>;
  resetProfile: () => Promise<BorrowerProfile>;
}

const SandboxProfileContext = createContext<SandboxProfileContextValue | null>(null);

export function SandboxProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<BorrowerProfile>(() => createMayaSandboxProfile());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    async function hydrateProfile() {
      const storedProfile = await loadSandboxBorrowerProfile();

      if (active) {
        setProfile(storedProfile);
        setIsHydrated(true);
      }
    }

    void hydrateProfile();

    return () => {
      active = false;
    };
  }, []);

  const saveProfile = useCallback(async (draft: SandboxOnboardingDraft) => {
    const savedProfile = await saveSandboxBorrowerProfile(draft);
    setProfile(savedProfile);
    return savedProfile;
  }, []);

  const useMayaProfile = useCallback(async () => {
    const mayaProfile = await saveMayaDemoProfile();
    setProfile(mayaProfile);
    return mayaProfile;
  }, []);

  const resetProfile = useCallback(async () => {
    const mayaProfile = await resetSandboxBorrowerProfile();
    setProfile(mayaProfile);
    return mayaProfile;
  }, []);

  const value = useMemo(
    () => ({
      profile,
      isHydrated,
      saveProfile,
      useMayaProfile,
      resetProfile,
    }),
    [isHydrated, profile, resetProfile, saveProfile, useMayaProfile]
  );

  return <SandboxProfileContext.Provider value={value}>{children}</SandboxProfileContext.Provider>;
}

export function useSandboxProfile() {
  const context = useContext(SandboxProfileContext);

  if (!context) {
    throw new Error('useSandboxProfile must be used inside SandboxProfileProvider.');
  }

  return context;
}
