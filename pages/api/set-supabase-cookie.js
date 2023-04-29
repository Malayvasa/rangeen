import { supabase } from '../../utils/supabase';

const handler = async (req, res) => {
  console.log(req.body);
  const data = await supabase.auth.api.setAuthCookie(req, res);
  console.log(data);
};

export default handler;
