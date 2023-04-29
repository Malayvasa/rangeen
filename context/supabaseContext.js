import { use, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { createContext, useEffect } from 'react';
import {
  useUser,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import axios from 'axios';

export const Supabase_data = createContext(null);

function SupabaseContext({ children }) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [userFull, setUserFull] = useState(null);

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          // delete cookies on sign out
          console.log('cookie deleted');
          const expires = new Date(0).toUTCString();
          document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
          document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('cookie set');
          const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
          document.cookie = `my-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
          document.cookie = `my-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
        }
      }
    );
  }, []);

  async function getUser() {
    let { data, error } = await supabase
      .from('profiles')
      .select(`*`)
      .eq('id', user.id);

    if (error) {
      console.log(error);
    }

    if (data) {
      let newData = data[0];
      if (newData.email === null || newData.email === '') {
        await supabase
          .from('profiles')
          .update({ email: user.email })
          .eq('id', user.id);
        newData.email = user.email;
      }
      if (!newData.stripe_customer || newData.stripe_customer === '') {
        const data = await axios.post('/api/create-stripe-for-old-customer', {
          record: {
            id: newData.id,
            email: newData.email,
          },
        });
      }
      console.log(newData);
      let userData = { ...user, ...newData };
      setUserFull(userData);
      setLoading(false);
    }
  }

  async function SignUp(email, password) {
    try {
      let { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (data) {
        console.log(data);
        toast.success('Check your email for the confirmation link!', {
          duration: 5000,
        });
        return 'Waiting for confirmation';
      }

      if (error) {
        toast.error(error.message);
        return error.message;
      }
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async function SignIn(email, password) {
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (data) {
        console.log(data);
        toast.success(`Welcome back ${data.user.email}!`, {
          duration: 5000,
        });
        return 'Success';
      }

      if (error) {
        toast.error(error.message);
        return error.message;
      }
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  function SignOut() {
    supabase.auth.signOut();
    setUserFull(null);
  }

  async function GetPalettes() {
    try {
      let { data, error, status } = await supabase
        .from('palettes')
        .select(`id,name, colors,type, created_at`)
        .eq('user_id', user.id);

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        return data;
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  async function AddPaletteToLibrary(name, hexList, type) {
    try {
      let { data, error, status } = await supabase.from('palettes').insert([
        {
          name: name,
          colors: hexList,
          user_id: user.id,
          type: type,
        },
      ]);

      if (error && status !== 406) {
        toast.error('Error Saving Palette');
        throw error;
      }

      if (status === 201) {
        // return true;
        toast.success('New Palette added to library');
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
    }
  }

  async function DeletePalette(palette) {
    try {
      let { data, error, status } = await supabase
        .from('palettes')
        .delete()
        .eq('id', palette.id);

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        return data;
      }

      if (status === 204) {
        toast('Palette deleted', {
          icon: '🗑️',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  async function GetUsesRemaining(type) {
    try {
      let { data, error, status } = await supabase
        .from('profiles')
        .select(type)
        .eq('id', user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log(data);
        return data;
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  return (
    <Supabase_data.Provider
      value={{
        loading,
        userFull,
        supabase,
        session,
        user,
        SignUp,
        SignIn,
        SignOut,
        GetPalettes,
        DeletePalette,
        AddPaletteToLibrary,
        GetUsesRemaining,
      }}
    >
      <Toaster position="bottom_center" />
      {children}
    </Supabase_data.Provider>
  );
}

export default SupabaseContext;
