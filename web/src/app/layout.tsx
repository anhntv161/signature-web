import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StoreProvider from "@/provider/StoreProvider";
import ToasterProvider from "@/components/ToasterProvider"; // ⬅️ client component
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Signature App",
  description: "A simple app to create and verify digital signatures using public-key cryptography.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <div id="root">{children}</div>
          <ToasterProvider /> {/* ✅ client-only */}
        </StoreProvider>
      </body>
    </html>
  );
}
