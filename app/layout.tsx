import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UserProfileProvider } from '@/lib/user-profile-context';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://zenchat.ai'),
  title: 'ZenChat — AI Personas',
  description: 'A beautiful AI chat experience with multiple personas. Mindful, wise, energetic, mysterious, and warm.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
};

export const viewport = {
  maximumScale: 1,
};

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const DARK_THEME_COLOR = 'hsl(222 15% 5%)';

const THEME_COLOR_SCRIPT = `(function(){var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');document.head.appendChild(m);}m.setAttribute('content','${DARK_THEME_COLOR}');})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geist.variable} ${geistMono.variable} dark`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required for theme color
          dangerouslySetInnerHTML={{ __html: THEME_COLOR_SCRIPT }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <UserProfileProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </UserProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
