"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalChatBox() {
	const pathname = usePathname();
	const [isChatOpen, setIsChatOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (pathname?.startsWith("/admin")) {
			setIsChatOpen(false);
		}
	}, [pathname]);

	useEffect(() => {
		if (!containerRef.current || containerRef.current.childElementCount > 0) return;

		const script = document.createElement("script");
		script.id = "chatango-script";
		script.src = "https://st.chatango.com/js/gz/emb.js";
		script.async = true;
		script.style.width = "100%";
		script.style.height = "100%";
		script.innerHTML = JSON.stringify({
			handle: "radioppiduniachat",
			arch: "js",
			styles: {
				a: "#B21E35",
				b: 100,
				c: "FFFFFF",
				d: "FFFFFF",
				k: "B21E35",
				l: "B21E35",
				m: "B21E35",
				n: "FFFFFF",
				q: "B21E35",
				r: 100,
				p: 10,
				cnrs: 0.5,
				usricon: 1,
			},
		});

		containerRef.current.appendChild(script);

		return () => {
			script.remove();
		};
	}, []);

	if (pathname?.startsWith("/admin")) {
		return null;
	}

	return (
		<>
			<button
				onClick={() => setIsChatOpen((prev) => !prev)}
				className={`fixed top-1/2 z-[135] -translate-y-1/2 rounded-l-3xl bg-[#B21E35] px-4 py-12 text-white shadow-2xl backdrop-blur-md transition-all hover:bg-[#8B0000] md:px-6 md:py-20 ${
					isChatOpen ? "right-[280px] md:right-[420px]" : "right-0"
				}`}
			>
				<span className="[writing-mode:vertical-lr] text-xs font-black uppercase tracking-[0.4em]">
					{isChatOpen ? "CLOSE" : "CHATBOX"}
				</span>
			</button>

			<AnimatePresence>
				{isChatOpen && (
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						className="fixed right-0 top-1/2 z-[140] h-[45vh] max-h-[440px] w-[280px] -translate-y-1/2 overflow-hidden rounded-l-3xl border-l-4 border-[#B21E35] bg-[#121212] shadow-2xl md:h-[60vh] md:max-h-[620px] md:w-[420px]"
					>
						<div className="flex items-center justify-between bg-[#B21E35] p-4">
							<h3 className="text-xs font-black uppercase tracking-widest text-white">Global Chat</h3>
							<button onClick={() => setIsChatOpen(false)} aria-label="Close chatbox">
								<X className="h-5 w-5 text-white" />
							</button>
						</div>
						<div ref={containerRef} className="h-[calc(100%-52px)] w-full" />
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
