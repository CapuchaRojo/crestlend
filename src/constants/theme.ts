import { Platform } from 'react-native';

export const colors = {
  background: '#F5F8FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF8F5',
  ink: '#16242D',
  muted: '#64727C',
  softText: '#82909A',
  border: '#DCE7E5',
  primary: '#0E766E',
  primaryDark: '#124B55',
  primarySoft: '#DDF5EF',
  sky: '#E8F4FF',
  blue: '#2F6F9F',
  amber: '#F2A83B',
  amberSoft: '#FFF2D9',
  coral: '#D96557',
  coralSoft: '#FFE7E2',
  green: '#2E8B57',
  greenSoft: '#E2F6EA',
  slate: '#20343D',
  tabInactive: '#8A98A3',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
};

export const shadow =
  Platform.OS === 'web'
    ? {
        boxShadow: '0 10px 20px rgba(12, 42, 44, 0.08)',
      }
    : {
        shadowColor: '#0C2A2C',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
      };
