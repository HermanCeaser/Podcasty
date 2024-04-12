import type { Metadata } from "next";
import { Chivo_Mono, Inter, Nova_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";
import connectDB from "@/lib/db";
import { cn } from "@/lib/utils";

connectDB();

const inter = Inter({ subsets: ["latin"] });
const chivo_mono = Chivo_Mono({ weight: ['400', '700', '900' ], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcasty",
  description:
    "A onestop place for all your podcasts, whether you are creator or a listener. we have the biggest catalogue of podcasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header>
            <div className="fixed flex flex-row justify-center items-center px-6 bg-background  shadow dark:shadow-slate-700 h-20 lg:h-16 z-30 top-0 left-0 right-0">
              <div className="flex lg:flex-row items-center justify-between max-w-7xl w-full">
                <div className="flex flex-row justify-center gap-6 items-center">
                  <Link
                    href="/"
                    className="flex flex-row space-x-3 items-center"
                  >
                    <Image
                      src="/logo.svg"
                      alt="Podcast Logo"
                      width={24}
                      height={24}
                    />
                    <p className={cn("text-2xl font-bold font-matter", chivo_mono.className)}>Podcasty</p>
                  </Link>
                </div>
                <div className="flex flex-row justify-center gap-3">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>
          {children}

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
