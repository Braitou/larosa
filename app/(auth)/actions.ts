"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // Validation
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
      success: false,
    };
  }

  // Authentification
  const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (error) {
    console.error("Login error:", error);
    return {
      error: "Email ou mot de passe incorrect",
      success: false,
    };
  }

  // Connexion réussie, rediriger vers admin dashboard
  return {
    success: true,
    role: "admin",
    error: null,
  };
}

export async function register(formData: FormData) {
  // Validation
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    nom: formData.get("nom") as string,
    prenom: formData.get("prenom") as string,
    telephone: formData.get("telephone") as string,
  };

  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  const { email, password, nom, prenom, telephone } = validatedFields.data;

  // Utiliser le service role client pour tout (bypass RLS)
  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // 1. Créer l'utilisateur dans Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirmer l'email
  });

  if (authError) {
    console.error("Auth error:", authError);
    return {
      error: authError.message === "User already registered"
        ? "Un compte existe déjà avec cet email"
        : "Erreur lors de la création du compte: " + authError.message,
    };
  }

  if (!authData.user) {
    return {
      error: "Erreur lors de la création du compte",
    };
  }

  // 2. Créer le profil dans la table users (RLS désactivé donc ça marche)
  const { error: profileError } = await supabaseAdmin.from("users").insert({
    id: authData.user.id,
    email,
    nom,
    prenom,
    telephone,
    role: "admin",
  });

  if (profileError) {
    console.error("Profile error:", profileError);
    return {
      error: "Erreur lors de la création du profil: " + profileError.message,
    };
  }

  // 3. Connecter l'utilisateur
  const supabase = await createClient();
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Redirection vers admin dashboard
  redirect("/admin/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}




