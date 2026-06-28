export const colors = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    900: '#14532d',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  white: '#ffffff',
  black: '#000000',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
};

export const theme = {
  colors: {
    primary: colors.primary[600],
    background: colors.slate[50],
    text: colors.slate[900],
    textSecondary: colors.slate[500],
    border: colors.slate[200],
  }
};
