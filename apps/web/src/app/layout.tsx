import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider"; // To be created
import { JotaiProvider } from "@/components/providers/jotai-provider"; // To be created
// import { ReactQueryProvider } from "@/components/providers/react-query-provider"; // For tRPC, to be created
// import { TRPCReactProvider } from "@/lib/trpc/react"; // For tRPC, to be created


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" }); // Add variable for Tailwind

// PWA Manifest and Theme Color
const APP_NAME = "Bookmark ToDo App";
const APP_DESCRIPTION = "Manage your bookmarks and reading list like a ToDo app.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
    // startUpImage: [], // Can add startup images
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json", // Path to the manifest file
};

export const viewport: Viewport = {
  themeColor: [ // Support for light and dark theme color
    { media: "(prefers-color-scheme: light)", color: "#ffffff" }, // Example light theme color
    { media: "(prefers-color-scheme: dark)", color: "#000000" },  // Example dark theme color (match your dark theme bg)
  ],
  // width: "device-width", // Already default
  // initialScale: 1, // Already default
  // maximumScale: 1, // Often good for PWAs to prevent zooming where not intended
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}> {/* Apply font variable and antialiasing */}
        {/* <TRPCReactProvider> */}
          <JotaiProvider>
            {/* <ReactQueryProvider> */}
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
            {/* </ReactQueryProvider> */}
          </JotaiProvider>
        {/* </TRPCReactProvider> */}
      </body>
    </html>
  );
}
