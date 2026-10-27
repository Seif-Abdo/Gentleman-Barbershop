import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gentleman Barbershop | صالون جنتل مان للرجال",
  description: "صالون جنتل مان - أرقى تجارب الحلاقة الكلاسيكية والعصرية، العناية باللحية، وحمامات البخار الملكية في القاهرة.",
  keywords: ["صالون حلاقة", "حلاق رجالي", "صالون جنتل مان", "Gentleman Barbershop", "حلاقة القاهرة", "تدريج فيد"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-bg text-ivory antialiased flex flex-col min-h-screen">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
