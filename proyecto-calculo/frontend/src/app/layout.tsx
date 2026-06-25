import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptiAgro | Modelo de Cálculo Avanzado",
  description: "Optimización matemática de producción agrícola con múltiples variables.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} font-sans h-full antialiased`}>
      <body className="min-h-full flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
