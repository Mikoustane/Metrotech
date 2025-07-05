import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xqlcfnerxppijrzolckh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbGNmbmVyeHBwaWpyem9sY2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTYzNDUsImV4cCI6MjA2NzI5MjM0NX0.9MJPGX_WknT1bXR5q-wDQmTIahPys7RN-6ol05ZGPrE'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types pour TypeScript
export interface Actualite {
  id?: number
  titre: string
  contenu: string
  image_url?: string
  auteur: string
  categorie: string
  created_at?: string
  updated_at?: string
}

// Fonctions pour gérer les actualités
export const actualitesService = {
  // Récupérer toutes les actualités
  async getAll(): Promise<Actualite[]> {
    const { data, error } = await supabase
      .from('actualites')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des actualités:', error)
      throw error
    }
    return data || []
  },

  // Créer une nouvelle actualité
  async create(actualite: Omit<Actualite, 'id' | 'created_at' | 'updated_at'>): Promise<Actualite> {
    const { data, error } = await supabase
      .from('actualites')
      .insert([actualite])
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de l\'actualité:', error)
      throw error
    }
    return data
  },

  // Mettre à jour une actualité
  async update(id: number, actualite: Partial<Actualite>): Promise<Actualite> {
    const { data, error } = await supabase
      .from('actualites')
      .update(actualite)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'actualité:', error)
      throw error
    }
    return data
  },

  // Supprimer une actualité
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('actualites')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression de l\'actualité:', error)
      throw error
    }
  },

  // Récupérer une actualité par ID
  async getById(id: number): Promise<Actualite | null> {
    const { data, error } = await supabase
      .from('actualites')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erreur lors de la récupération de l\'actualité:', error)
      return null
    }
    return data
  }
}