import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

interface PostPayload {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  image_url?: string
  category?: string
  difficulty?: string
  light?: string
  science_fact?: string
  practice_tip?: string
  status?: string
  author_id?: string
  published_at?: string
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', Connection: 'keep-alive', ...corsHeaders },
  })
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getUserFromAuth(req: Request): string | null {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.replace('Bearer ', '')
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload.sub ?? null
  } catch {
    return null
  }
}

function createAuthClient(authHeader: string | null) {
  if (!authHeader) return null
  const headers = { Authorization: authHeader, apikey: SUPABASE_ANON_KEY }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function handleGet(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  const slug = url.searchParams.get('slug')

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  if (id) {
    const { data, error } = await adminClient.from('posts').select('*').eq('id', id).single()
    if (error) {
      if (error.code === 'PGRST116') return jsonResponse({ error: 'Post not found' }, 404)
      return jsonResponse({ error: error.message }, 500)
    }
    return jsonResponse({ data }, 200)
  }

  if (slug) {
    const { data, error } = await adminClient.from('posts').select('*').eq('slug', slug).single()
    if (error) {
      if (error.code === 'PGRST116') return jsonResponse({ error: 'Post not found' }, 404)
      return jsonResponse({ error: error.message }, 500)
    }
    return jsonResponse({ data }, 200)
  }

  const { data, error } = await adminClient
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) return jsonResponse({ error: error.message }, 500)
  return jsonResponse({ data }, 200)
}

async function handlePost(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization')
  const userId = getUserFromAuth(req)
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401)

  const authClient = createAuthClient(authHeader)
  if (!authClient) return jsonResponse({ error: 'Unauthorized' }, 401)

  const { data: userData, error: userError } = await authClient.auth.getUser()
  if (userError || !userData.user) return jsonResponse({ error: 'Unauthorized' }, 401)

  let body: PostPayload
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400)
  }

  if (!body.title || !body.content) {
    return jsonResponse({ error: 'Missing required fields: title and content' }, 400)
  }

  const payload: Record<string, unknown> = {
    title: body.title,
    slug: body.slug || slugify(body.title),
    content: body.content,
    excerpt: body.excerpt ?? '',
    image_url: body.image_url ?? '',
    category: body.category ?? 'Jardim Interno',
    difficulty: body.difficulty ?? 'Fácil',
    light: body.light ?? 'Luz Indireta',
    science_fact: body.science_fact ?? '',
    practice_tip: body.practice_tip ?? '',
    status: body.status ?? 'Published',
    author_id: userData.user.id,
  }

  if (body.published_at) payload.published_at = body.published_at

  const { data, error } = await authClient.from('posts').insert(payload).select().single()

  if (error) return jsonResponse({ error: error.message }, 500)
  return jsonResponse({ data }, 201)
}

async function handlePut(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization')
  const userId = getUserFromAuth(req)
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401)

  const authClient = createAuthClient(authHeader)
  if (!authClient) return jsonResponse({ error: 'Unauthorized' }, 401)

  const { data: userData, error: userError } = await authClient.auth.getUser()
  if (userError || !userData.user) return jsonResponse({ error: 'Unauthorized' }, 401)

  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return jsonResponse({ error: 'Missing id query parameter' }, 400)

  let body: Partial<PostPayload>
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400)
  }

  const payload: Record<string, unknown> = {}
  if (body.title !== undefined) {
    payload.title = body.title
    payload.slug = body.slug || slugify(body.title)
  }
  if (body.content !== undefined) payload.content = body.content
  if (body.excerpt !== undefined) payload.excerpt = body.excerpt
  if (body.image_url !== undefined) payload.image_url = body.image_url
  if (body.category !== undefined) payload.category = body.category
  if (body.difficulty !== undefined) payload.difficulty = body.difficulty
  if (body.light !== undefined) payload.light = body.light
  if (body.science_fact !== undefined) payload.science_fact = body.science_fact
  if (body.practice_tip !== undefined) payload.practice_tip = body.practice_tip
  if (body.status !== undefined) payload.status = body.status
  if (body.published_at !== undefined) payload.published_at = body.published_at

  if (Object.keys(payload).length === 0) {
    return jsonResponse({ error: 'No fields to update' }, 400)
  }

  const { data: existing } = await authClient.from('posts').select('id').eq('id', id).single()

  if (!existing) return jsonResponse({ error: 'Post not found' }, 404)

  const { data, error } = await authClient
    .from('posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) return jsonResponse({ error: error.message }, 500)
  return jsonResponse({ data }, 200)
}

async function handleDelete(req: Request): Promise<Response> {
  const authHeader = req.headers.get('Authorization')
  const userId = getUserFromAuth(req)
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401)

  const authClient = createAuthClient(authHeader)
  if (!authClient) return jsonResponse({ error: 'Unauthorized' }, 401)

  const { data: userData, error: userError } = await authClient.auth.getUser()
  if (userError || !userData.user) return jsonResponse({ error: 'Unauthorized' }, 401)

  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return jsonResponse({ error: 'Missing id query parameter' }, 400)

  const { data: existing } = await authClient.from('posts').select('id').eq('id', id).single()

  if (!existing) return jsonResponse({ error: 'Post not found' }, 404)

  const { error } = await authClient.from('posts').delete().eq('id', id)
  if (error) return jsonResponse({ error: error.message }, 500)

  return jsonResponse({ message: 'Post deleted successfully' }, 200)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req)
      case 'POST':
        return await handlePost(req)
      case 'PUT':
        return await handlePut(req)
      case 'DELETE':
        return await handleDelete(req)
      default:
        return jsonResponse({ error: `Method ${req.method} not allowed` }, 405)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error'
    return jsonResponse({ error: message }, 500)
  }
})
