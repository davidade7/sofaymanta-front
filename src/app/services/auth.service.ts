import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { UserProfileService } from './userProfile.service';
import { firstValueFrom } from 'rxjs'; // Import firstValueFrom

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

  constructor(private userProfileService: UserProfileService) { }

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

  async getUserWithMetadata(): Promise<any> {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return { data: null, error };
    }

    return { data, error };
  }

  async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const { data: user, error } = await this.getUserWithMetadata();

      if (error || !user) {
        return false;
      }

      const userId = user.user.id;

      // Use UserProfileService to get the user profile
      const profile$ = this.userProfileService.getUserProfile(userId);
      const profile = await firstValueFrom(profile$);


      if (!profile) {
        console.error('User profile not found');
        return false;
      }

      // Check if the user has the 'admin' role
      const isAdmin = profile?.role === 'admin';
      return isAdmin;

    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}
