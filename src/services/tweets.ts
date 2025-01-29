import { supabase } from './supabase'
import type { SavedTweet } from './supabase'

export async function saveTweet(content: string, sourceText?: string): Promise<SavedTweet | null> {
  const { data, error } = await supabase
    .from('saved_tweets')
    .insert([
      { 
        content,
        source_text: sourceText
      }
    ])
    .select()
    .single()
  
  if (error) {
    console.error('Error saving tweet:', error)
    throw error
  }
  
  return data
}

export async function updateTweet(id: number, content: string): Promise<SavedTweet | null> {
  const { data, error } = await supabase
    .from('saved_tweets')
    .update({ content })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating tweet:', error)
    throw error
  }
  
  return data
}

export async function getSavedTweets(): Promise<SavedTweet[]> {
  const { data, error } = await supabase
    .from('saved_tweets')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching saved tweets:', error)
    throw error
  }
  
  return data || []
}

export async function deleteSavedTweet(id: number): Promise<void> {
  const { error } = await supabase
    .from('saved_tweets')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting tweet:', error)
    throw error
  }
} 