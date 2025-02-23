"use client";
import "../styles/globals.css";
import NavBar from "@/components/Navbar";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== "undefined") {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: "https://app.posthog.com",
		autocapture: false,
		// Enable debug mode in development
		loaded: (posthog) => {
			if (process.env.NODE_ENV === "development") posthog.debug();
		},
	});
}

function App({ Component, pageProps }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);
	return (
		<>
			<PostHogProvider client={posthog}>
				<NavBar />
				{isClient && <Toaster position="bottom-right" />}
				<Component {...pageProps} />
			</PostHogProvider>
		</>
	);
}
export default App;
