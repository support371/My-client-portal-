import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "GEM & ATR Platform",
  description: "Complete Enterprise SaaS Platform - Cybersecurity Monitoring & Asset Recovery",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#0a0e14]">
      <body>{children}</body>
    </html>
  );
}
