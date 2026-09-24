import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ChatMessage = { role: 'user' | 'assistant'; content: string }

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const authorization = request.headers.get('Authorization')
    if (!authorization) return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authorization } } })
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const payload = await request.json() as { messages?: ChatMessage[] }
    const messages = (payload.messages ?? []).filter((message) => (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string').slice(-12)
    if (!messages.length) return new Response(JSON.stringify({ error: 'A question is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { data: animals, error: animalError } = await supabase.from('animals').select('name,species,breed,age_years,size,description,personality,energy_level,good_with_children,good_with_dogs,good_with_cats,medical_status,vaccination_status,sterilized,special_care,adoption_restrictions,status').in('status', ['available', 'on_hold', 'adoption_pending'])
    if (animalError) throw animalError
    const verifiedContext = JSON.stringify(animals ?? [])
    const system = `You are the Animal Rescue assistant. Use only the verified animal records below and general non-diagnostic adoption preparation guidance. Never invent animal facts, medical details, availability, or behavior. Never guarantee approval. Never make a final adoption decision. Do not diagnose; recommend a veterinarian or rescue staff for medical concerns. If a record lacks the answer, say that the rescue team should be contacted.\n\nVerified records:\n${verifiedContext}`

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY') ?? ''}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini', messages: [{ role: 'system', content: system }, ...messages] }) })
    if (!openAiResponse.ok) throw new Error(`Assistant provider returned ${openAiResponse.status}`)
    const completion = await openAiResponse.json() as { choices?: Array<{ message?: { content?: string } }> }
    const answer = completion.choices?.[0]?.message?.content ?? 'Please contact the rescue team for help with that question.'
    return new Response(JSON.stringify({ answer }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('animal-assistant request failed', error instanceof Error ? error.message : 'unknown error')
    return new Response(JSON.stringify({ error: 'Assistant unavailable' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
