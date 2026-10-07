import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yah SABAB (ইয়াহ সাবাব) | Heritage & Modern Elegance for Men",
  description: "Premier Bangladeshi menswear brand specializing in hand-embroidered Panjabis, Peshawari Kabli suits, and festive waistcoats. Express Cash on Delivery & bKash available nationwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
