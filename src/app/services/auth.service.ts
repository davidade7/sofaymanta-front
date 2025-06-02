import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
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
}
