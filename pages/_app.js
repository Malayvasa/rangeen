import '../styles/globals.css';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import SupabaseContext from '@/context/supabaseContext';
import { useState } from 'react';
import NavBar from '@/components/Navbar';

function App({ Component, pageProps }) {
  const [supabaseCP] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseCP}
      initialSession={pageProps.initialSession}
    >
      <SupabaseContext>
        <NavBar />
        <Component {...pageProps} />
      </SupabaseContext>
    </SessionContextProvider>
  );
}
export default App;
