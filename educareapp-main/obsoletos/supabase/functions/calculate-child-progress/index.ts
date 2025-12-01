import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalculateProgressRequest {
  child_id?: string;
  user_id?: string;
  recalculate_all?: boolean;
  calculate_modules?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { child_id, user_id, recalculate_all, calculate_modules }: CalculateProgressRequest = await req.json();

    console.log('Calculate progress request:', { child_id, user_id, recalculate_all, calculate_modules });

    if (recalculate_all) {
      // Recalcular progresso para todas as crianças
      const { data, error } = await supabaseClient.rpc('update_all_children_progress');
      
      if (error) {
        console.error('Error updating all children progress:', error);
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (child_id) {
      if (calculate_modules && user_id) {
        // Calcular módulos individuais para uma criança específica
        const { data, error } = await supabaseClient.rpc('calculate_child_modules', {
          p_child_id: child_id,
          p_user_id: user_id
        });

        if (error) {
          console.error('Error calculating child modules:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        // Calcular progresso geral para uma criança específica
        const { data, error } = await supabaseClient.rpc('calculate_child_progress', {
          p_child_id: child_id
        });

        if (error) {
          console.error('Error calculating child progress:', error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    if (user_id) {
      // Calcular progresso para todas as crianças de um usuário
      const { data: children, error: childrenError } = await supabaseClient
        .from('educare_children')
        .select('id')
        .eq('user_id', user_id);

      if (childrenError) {
        console.error('Error fetching user children:', childrenError);
        return new Response(
          JSON.stringify({ success: false, error: childrenError.message }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const results = [];
      for (const child of children || []) {
        const { data, error } = await supabaseClient.rpc('calculate_child_progress', {
          p_child_id: child.id
        });

        if (error) {
          console.error(`Error calculating progress for child ${child.id}:`, error);
          results.push({ child_id: child.id, success: false, error: error.message });
        } else {
          results.push({ child_id: child.id, success: true, data });
        }
      }

      return new Response(
        JSON.stringify({ success: true, results, total_children: children?.length || 0 }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Please provide child_id, user_id, or set recalculate_all to true. For modules calculation, provide both child_id and user_id with calculate_modules=true' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in calculate-child-progress function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});