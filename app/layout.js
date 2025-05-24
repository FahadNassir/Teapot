import './globals.css'
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'teapot|Delicious snacks',
  description: 'Order delicious snacks and beverages online',
  icons: {
    icon: [
      { url: '/images/logo.jpg', type: 'image/jpeg' }
    ],
    shortcut: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
