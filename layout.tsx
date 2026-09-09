import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "FORECAST — See More Than One Possibility",
  description:
    "AI-powered behavioral scenario forecasting that helps you understand uncertainty, explore plausible outcomes, and prepare better responses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0D1015] text-[#ECEEF2] font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
