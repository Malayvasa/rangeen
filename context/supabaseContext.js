import toast, { Toaster } from 'react-hot-toast';
import { createContext } from 'react';
import {
  useUser,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';

export const Supabase_data = createContext(null);

function SupabaseContext({ children }) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();

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
