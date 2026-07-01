import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avid Kiya | AI Engineer & Graphic Designer",
  description: "Interactive portfolio of Avid Kiya - OS Simulation",
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
