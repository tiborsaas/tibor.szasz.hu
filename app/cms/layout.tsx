import "../globals.css";
import { Inter } from "next/font/google";
import { getUnverifiedUserFromInstantCookie } from "@instantdb/react/nextjs";
import { InstantProvider } from "../components/InstantProvider";
import { AdminNav } from "./components/AdminNav";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export const metadata = {
    title: "Admin — Tibor Szász",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUnverifiedUserFromInstantCookie(
        process.env.NEXT_PUBLIC_INSTANT_APP_ID!
    );

    return (
        <html lang="en" className={inter.variable}>
            <body className="bg-gray-50 text-gray-900">
                <InstantProvider user={user}>
                    <AdminNav />
                    <main className="p-6">{children}</main>
                </InstantProvider>
            </body>
        </html>
    );
}
