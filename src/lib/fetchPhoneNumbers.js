import { supabase } from "./supabaseClient";

export async function fetchPhoneNumbers() {
  const { data, error } = await supabase.from("phoneNumbers").select("*");

  if (error) {
    console.error("Error fetching phoneNumber:", error);
    return [];
  }

  return data; 
}
