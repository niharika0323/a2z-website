import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "A2Z Software Solutions | Web & Mobile Application Development",
  description: "Premier web and mobile application development agency. We architect bespoke software, full-stack Next.js websites, iOS/Android apps, and scalable cloud systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" async></script>
      </head>
      <body>
        <div className="blob-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
