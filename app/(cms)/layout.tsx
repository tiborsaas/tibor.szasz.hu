import "../globals.css";
import { Playfair_Display, Lora, JetBrains_Mono } from "next/font/google";
import { Nav } from "../components/Nav";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Archive — Tibor Szász",
  description:
    "A blog, a journal to infrequently offload some random stuff from my mind.",
};

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lora.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-ink text-offwhite">
        <div className="max-w-4xl mx-auto px-6">
          <Nav />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
