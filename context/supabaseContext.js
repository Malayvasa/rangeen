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
