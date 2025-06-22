import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const supabaseUrl = environment.supabaseUrl;
const supabaseKey = environment.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be defined in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public supabase: SupabaseClient = supabase;

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  getUser() {
    return supabase.auth.getUser();
  }

  async getUserWithMetadata() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return { data: null, error };
    }

    return { data, error };
  }

  async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const { data, error } = await this.getUserWithMetadata();

      if (error || !data?.user) {
        return false;
      }

      // Vérifier dans user_metadata et app_metadata
      const isAdmin = data.user.user_metadata?.['is_super_admin'] === true ||
                     data.user.app_metadata?.['is_super_admin'] === true;

      return isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}
