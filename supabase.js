// supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xqlcfnerxppijrzolckh.supabase.co' // Ton URL Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbGNmbmVyeHBwaWpyem9sY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTYzNDUsImV4cCI6MjA2NzI5MjM0NX0.9MJPGX_WknT1bXR5q-wDQmTIahPys7RN-6ol05ZGPrE' // Ta clé anon (publique)

export const supabase = createClient(supabaseUrl, supabaseKey)
