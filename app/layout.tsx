// app/layout.tsx
import { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { Providers } from './provider'
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Talim Olami - O\'quv Markazi',
  description: 'Professional ta\'lim markazi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}