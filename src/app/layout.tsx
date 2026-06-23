import type { Metadata, Viewport } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Navbar } from "@/components/Navbar";
import ListenNowPlayer from "@/components/ListenNowPlayer";
import GlobalChatBox from "@/components/GlobalChatBox";

export const metadata: Metadata = {
  title: "Radio PPI Dunia",
  description: "Radio PPI Dunia - Suara Anak Bangsa, Satu Cinta, Satu Indonesia",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Radio PPI Dunia",
  },
  icons: {
    icon: "/rpd-icon-192.png",
    apple: "/rpd-icon-192.png"
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RPD Mobile" />
        <link rel="apple-touch-icon" href="/globe.svg" />
      </head>
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="18bad06e-616d-4a15-a836-96eb191d8378"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Navbar />
        <ListenNowPlayer />
        <GlobalChatBox />
        {children}
        <VisualEditsMessenger />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                if (window.location.hostname === 'localhost' || window.location.hostname.includes('orchids.cloud')) {
                  navigator.serviceWorker.getRegistrations().then(registrations => {
                    for (let registration of registrations) {
                      registration.unregister();
                      console.log('Unregistered service worker in dev');
                    }
                  });
                } else {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

