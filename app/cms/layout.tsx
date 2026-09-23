import "../globals.css";
import { Inter } from "next/font/google";
import { AdminNav } from "./components/AdminNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Admin — Tibor Szász",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-50 text-gray-900">
        <AdminNav />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
