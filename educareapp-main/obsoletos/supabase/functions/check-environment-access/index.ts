
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get the request body
    const { userId, environmentSlug } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!environmentSlug) {
      return new Response(
        JSON.stringify({ error: "Environment slug is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
    );

    // Check if user has role based access to the environment
    const { data: environment, error: envError } = await supabaseAdmin
      .from("app_environments")
      .select("id")
      .eq("slug", environmentSlug)
      .single();

    if (envError || !environment) {
      return new Response(
        JSON.stringify({ error: "Environment not found", details: envError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Get user roles
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role_id")
      .eq("user_id", userId);

    if (rolesError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch user roles", details: rolesError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // If user has no roles, they only have access to public environment
    if (!userRoles || userRoles.length === 0) {
      return new Response(
        JSON.stringify({ hasAccess: environmentSlug === "public" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Check if any of the user's roles have access to the environment
    const roleIds = userRoles.map(ur => ur.role_id);
    const { data: accessCheck, error: accessError } = await supabaseAdmin
      .from("role_environment_access")
      .select("can_access")
      .eq("environment_id", environment.id)
      .in("role_id", roleIds);

    if (accessError) {
      return new Response(
        JSON.stringify({ error: "Failed to check environment access", details: accessError }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // User has access if any role has access
    const hasAccess = accessCheck.some(access => access.can_access);

    return new Response(
      JSON.stringify({ hasAccess }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
