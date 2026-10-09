import type { Metadata } from "next";
import { Playfair_Display, Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-bangla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yah SABAB (ইয়াহ সাবাব) | Heritage & Modern Elegance for Men",
  description:
    "Premier Bangladeshi menswear brand specializing in hand-embroidered Panjabis, Peshawari Kabli suits, and festive waistcoats. Express Cash on Delivery & bKash available nationwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${hindSiliguri.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0c0a09] text-[#f7f3eb] font-sans selection:bg-[#c9933a]/30 selection:text-[#f7f3eb]">
        {children}
      </body>
    </html>
  );
}
