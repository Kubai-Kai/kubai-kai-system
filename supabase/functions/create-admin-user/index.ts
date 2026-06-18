import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {

  // =========================
  // CORS PRE-FLIGHT HANDLING
  // =========================
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

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

    // =========================
    // 1. AUTH USER ERSTELLEN
    // =========================
    const { data: user, error: userError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

    if (userError || !user?.user) {
      return new Response(
        JSON.stringify({
          error: userError?.message || "User creation failed"
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const userId = user.user.id;

    // =========================
    // 2. PROFILE ERSTELLEN
    // =========================
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        role: role || "user"
      });

    if (profileError) {
      return new Response(
        JSON.stringify({ error: profileError.message }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    // =========================
    // 3. MEMBER ERSTELLEN
    // =========================
    const { error: memberError } = await supabase
      .from("members")
      .insert({
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

    if (memberError) {
      return new Response(
        JSON.stringify({ error: memberError.message }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    // =========================
    // SUCCESS RESPONSE
    // =========================
    return new Response(
      JSON.stringify({
        success: true,
        userId
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err)
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
