// components/GlobalChatBox.tsx
"use client";

import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalChatBox() {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Hide chat on admin pages
  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      setIsChatOpen(false);
    }
  }, [pathname]);

  const toggleChat = () => {
    setHasMounted(true); // Mounts the iframe forever on the first click
    setIsChatOpen((prev) => !prev);
  };

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // THE FIX: We build an isolated mini-website for Chatango inside a string.
  // This prevents it from interacting with your Next.js app's sizing calculations.
  const chatangoSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: white; }
        </style>
      </head>
      <body>
        <script id="cid0020000442099020517" data-cfasync="false" async src="https://st.chatango.com/js/gz/emb.js" style="width: 100%;height: 100%;">
          {"handle":"radioppiduniachat","arch":"js","styles":{"a":"B21E35","b":100,"c":"FFFFFF","d":"FFFFFF","k":"B21E35","l":"B21E35","m":"B21E35","n":"FFFFFF","p":"10","q":"B21E35","r":100,"fwtickm":0,"usricon":1}}
        </script>
      </body>
    </html>
  `;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleChat}
        className={`fixed top-1/2 z-[99990] -translate-y-1/2 rounded-l-3xl bg-[#B21E35] px-4 py-12 text-white shadow-2xl backdrop-blur-md transition-all hover:bg-[#8B0000] md:px-6 md:py-20 ${
          isChatOpen ? "right-[300px] md:right-[420px]" : "right-0"
        }`}
      >
        <span className="[writing-mode:vertical-lr] text-xs font-black uppercase tracking-[0.4em]">
          {isChatOpen ? "CLOSE" : "CHATBOX"}
        </span>
      </button>

      {/* Chat panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isChatOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-1/2 z-[99999] flex flex-col h-[75vh] min-h-[450px] max-h-[650px] w-[300px] -translate-y-1/2 overflow-hidden rounded-l-3xl border-l-4 border-[#B21E35] bg-[#121212] shadow-2xl md:h-[75vh] md:max-h-[700px] md:w-[420px]"
        style={{ display: hasMounted ? "flex" : "none" }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between bg-[#B21E35] p-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">
            Global Chat
          </h3>
          <button
            onClick={() => setIsChatOpen(false)}
            aria-label="Close chatbox"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* THE TRAP: The iframe runs the script but is explicitly denied 'allow-top-navigation' */}
        <div className="relative flex-1 w-full bg-white min-h-0">
          {hasMounted && (
            <iframe
              srcDoc={chatangoSrcDoc}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="absolute inset-0 w-full h-full border-none"
              title="Radio PPI Dunia Chat"
            />
          )}
        </div>
      </motion.div>
    </>
  );
}