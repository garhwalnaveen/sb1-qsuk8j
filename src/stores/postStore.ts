import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Post = Database['public']['Tables']['posts']['Row'];

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  loadPosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'published_at'>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  loadPosts: async () => {
    set({ loading: true, error: null });
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      set({ posts });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createPost: async (post) => {
    try {
      const { error } = await supabase.from('posts').insert([post]);
      if (error) throw error;
      await get().loadPosts();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updatePost: async (id, post) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update(post)
        .eq('id', id);
      
      if (error) throw error;
      await get().loadPosts();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      set(state => ({
        posts: state.posts.filter(post => post.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
}));