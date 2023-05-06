import '../styles/globals.css';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import SupabaseContext from '@/context/supabaseContext';
import { useState } from 'react';
import NavBar from '@/components/Navbar';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: 'https://app.posthog.com',
    autocapture: false,
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

function App({ Component, pageProps }) {
  const [supabaseCP] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();
  const session = pageProps.initialSession;

  {
    session && posthog.identify(session.user.email);
  }

  // useEffect(() => {
  //   // Track page views
  //   const handleRouteChange = () => posthog?.capture('$pageview');
  //   router.events.on('routeChangeComplete', handleRouteChange);

  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange);
  //   };
  // }, []);

  return (
    <PostHogProvider client={posthog}>
      <SessionContextProvider
        supabaseClient={supabaseCP}
        initialSession={pageProps.initialSession}
      >
        <SupabaseContext>
          <NavBar />
          <Component {...pageProps} />
        </SupabaseContext>
      </SessionContextProvider>
    </PostHogProvider>
  );
}
export default App;
