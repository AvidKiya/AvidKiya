import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avid Kiya | Senior AI Engineer",
  description: "Terminal-style developer portfolio of Avid Kiya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
