import "../globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: `Tibor Szász`,
  description: `A blog, a journal to infrequently offload some random stuff from my mind.`,
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-orange-50">
        <section className="min-h-screen">
          <main>{children}</main>
        </section>
      </body>
    </html>
  );
}
