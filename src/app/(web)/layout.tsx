import Footer from "@/components/footer";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { absoluteUrl } from "@/lib/utils";
import "@/styles/index.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://outstatic.com"),
  title: {
    default: "Outstatic",
    template: "%s | Outstatic",
  },
  description: "A blog starter built with Outstatic.",
  openGraph: {
    title: "Outstatic - A Static Site CMS for Next.js",
    description: "A blog starter built with Outstatic.",
    url: absoluteUrl("/"),
    siteName: "Next.js",
    images: [
      {
        url: absoluteUrl("/images/og-image.png"),
        width: 1800,
        height: 1600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [{ url: "/favicon/favicon-32x32.png" }],
    apple: [{ url: "/favicon/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative pb-48 md:pb-32 min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <div className="max-w-6xl mx-auto px-5 h-full pt-8 md:pt-24">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
