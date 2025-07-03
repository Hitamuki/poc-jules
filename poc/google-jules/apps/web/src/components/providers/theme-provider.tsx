"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

/**
 * ThemeProvider component that wraps NextThemesProvider.
 * It's marked as a client component because next-themes relies on client-side logic
 * to determine and switch themes.
 *
 * Props are passed directly to NextThemesProvider. Common props include:
 * - attribute="class" (to apply theme as a class on the html tag, e.g., <html class="dark">)
 * - defaultTheme="system" (to use the user's system preference as the default)
 * - enableSystem (to allow switching between light, dark, and system themes)
 * - storageKey="theme" (custom key for localStorage, defaults to 'theme')
 * - disableTransitionOnChange (to prevent style transitions when themes change, often useful)
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Ensure the provider is mounted on the client before rendering children
  // that might depend on the theme, preventing hydration mismatches.
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // You can render a loader or null here to prevent hydration mismatch
    // if children are sensitive to theme before client-side mount.
    // For many cases, just returning children directly is fine if they adapt gracefully.
    // However, to be absolutely safe with theme-dependent UI:
    return null; // Or a loading spinner, or <div style={{ visibility: 'hidden' }}>{children}</div>
                 // This ensures that theme-dependent rendering happens only after client mount.
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
