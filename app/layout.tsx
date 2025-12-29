import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Restaurant POS System",
  description: "Production-grade POS frontend for restaurant billing",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: "/restaurant-logo.png?v=2",
    apple: "/restaurant-logo.png?v=2",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/restaurant-logo.png?v=2" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/restaurant-logo.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/restaurant-logo.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/restaurant-logo.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/restaurant-logo.png?v=2" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
