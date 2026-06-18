import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      street,
      city,
      zip,
      phone,
      role
    } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. AUTH USER ERSTELLEN
    const { data: user, error: userError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

    if (userError) {
      return new Response(JSON.stringify(userError), { status: 400 });
    }

    const userId = user.user.id;

    // 2. PROFILE
    await supabase.from("profiles").insert({
      id: userId,
      email,
      role: role || "user"
    });

    // 3. MEMBER
    await supabase.from("members").insert({
      profile_id: userId,
      first_name,
      last_name,
      email,
      street,
      city,
      zip,
      phone,
      status: "active"
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }
});
