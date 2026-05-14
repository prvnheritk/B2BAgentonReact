import { useEffect, type ReactNode } from 'react';
import { useThemeStore } from '@/store/themeStore';

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return <>{children}</>;
}
