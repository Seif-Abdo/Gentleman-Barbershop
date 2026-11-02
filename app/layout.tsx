import type { Metadata } from "next";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "Gentleman Barbershop | صالون جنتل مان للرجال",
  description: "صالون جنتل مان - أرقى تجارب الحلاقة الكلاسيكية والعصرية، العناية باللحية، وحمامات البخار الملكية في فروعنا (زهراء المعادي، مدينة نصر - حسن المأمون، مدينة نصر - أبوداود الظاهري).",
  keywords: ["صالون حلاقة", "حلاق رجالي", "صالون جنتل مان", "Gentleman Barbershop", "زهراء المعادي", "مدينة نصر حسن المأمون", "مدينة نصر أبوداود الظاهري"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-bg text-ivory antialiased min-h-screen">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
