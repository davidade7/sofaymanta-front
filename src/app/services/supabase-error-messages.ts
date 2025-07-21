// Dictionary of Supabase error translations
export const SUPABASE_ERROR_TRANSLATIONS: { [key: string]: string } = {
    "Invalid login credentials": "Credenciales de acceso inválidas",
    "Email not confirmed": "Correo electrónico no confirmado",
    "User already registered": "El usuario ya está registrado",
    "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
    "Password should contain at least one character of each: abcdefghijklmnopqrstuvwxyz, ABCDEFGHIJKLMNOPQRSTUVWXYZ, 0123456789, !@#$%^&*()_+-=[]{};':\"|<>?,./`~.":
        "La contraseña debe contener al menos un carácter de cada uno de los siguientes grupos: letras minúsculas, letras mayúsculas, números y símbolos (!@#$%^&*()_+-=[]{};':\"|<>?,./`~.)",
};

// Utility function to translate Supabase error messages
export function translateSupabaseError(message: string): string {
    return SUPABASE_ERROR_TRANSLATIONS[message] || message;
} 