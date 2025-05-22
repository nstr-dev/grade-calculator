import Providers from "@/app/providers";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import "../../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function OfflineLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <Providers>
          <div className="mt-[5rem] bg-background text-foreground flex flex-col items-center ">
            <main className="min-h-screen w-full flex flex-col items-center">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
