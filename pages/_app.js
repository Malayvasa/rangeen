import '../styles/globals.css';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import NavBar from '@/components/Navbar';

function App({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <NavBar />
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
export default App;
