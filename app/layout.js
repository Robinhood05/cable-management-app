import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SOHEL❤️SWEET CABLE NETWORK",
  description: "Manage your cable network billing efficiently",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  themeColor: "#3b82f6",
  appleWebAppCapable: true,
  appleWebAppStatusBarStyle: "black-translucent",
  appleWebAppTitle: "SOHEL SWEET",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
