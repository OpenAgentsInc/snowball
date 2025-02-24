import "./globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import { ClientLayout } from "../components/layout/ClientLayout"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <Script src="https://elevenlabs.io/convai-widget/index.js" />
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
