import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { Product, Category } from "./types";

// 1. PRODUCTS CRUD
export async function getSupabaseProducts(): Promise<Product[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*");
    
    if (error) throw error;
    
    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      image: p.image,
      isNew: p.isNew,
      isOffer: p.isOffer,
      isTrending: p.isTrending,
      rating: Number(p.rating),
      colors: p.colors || [],
      sizes: p.sizes || [],
      stock: Number(p.stock)
    }));
  } catch (err) {
    console.error("Error fetching products from Supabase:", err);
    return null;
  }
}

export async function insertSupabaseProduct(p: Product): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from("products")
      .insert({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        image: p.image,
        isNew: p.isNew || false,
        isOffer: p.isOffer || false,
        isTrending: p.isTrending || false,
        rating: p.rating || 5,
        colors: p.colors || [],
        sizes: p.sizes || [],
        stock: p.stock || 0
      });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error inserting product in Supabase:", err);
    return false;
  }
}

export async function updateSupabaseProduct(p: Product): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from("products")
      .update({
        name: p.name,
        category: p.category,
        price: p.price,
        image: p.image,
        isNew: p.isNew || false,
        isOffer: p.isOffer || false,
        isTrending: p.isTrending || false,
        rating: p.rating,
        colors: p.colors,
        sizes: p.sizes,
        stock: p.stock
      })
      .eq("id", p.id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error updating product in Supabase:", err);
    return false;
  }
}

export async function deleteSupabaseProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting product in Supabase:", err);
    return false;
  }
}

// 2. CATEGORIES CRUD
export async function getSupabaseCategories(): Promise<Category[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*");
    
    if (error) throw error;
    
    return (data || []).map(c => ({
      id: c.id,
      name: c.name,
      image: c.image,
      count: Number(c.count)
    }));
  } catch (err) {
    console.error("Error fetching categories from Supabase:", err);
    return null;
  }
}

export async function insertSupabaseCategory(c: Category): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from("categories")
      .insert({
        id: c.id,
        name: c.name,
        image: c.image,
        count: c.count || 0
      });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error inserting category in Supabase:", err);
    return false;
  }
}

export async function updateSupabaseCategory(c: Category): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from("categories")
      .update({
        name: c.name,
        image: c.image,
        count: c.count
      })
      .eq("id", c.id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error updating category in Supabase:", err);
    return false;
  }
}

export async function deleteSupabaseCategory(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting category from Supabase:", err);
    return false;
  }
}

// 3. ADMIN PROFILE CHECK
export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return !!data?.is_admin;
  } catch (err) {
    console.error("Error checking admin profile:", err);
    return false;
  }
}
