import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali, Poppins } from "next/font/google";
import "./globals.css";

/*
 * Same type system as the public website: Inter for UI text, Poppins for
 * headings, Noto Sans Bengali for the Bangla content (neither Latin family has
 * Bengali glyphs). The variables are consumed by the --font-* tokens in
 * globals.css.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "School CMS",
  description: "Content dashboard for the school website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      {/* Browser extensions (Grammarly, ColorZilla…) add attributes to <body>
          before React hydrates; this silences only that one-level mismatch. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
