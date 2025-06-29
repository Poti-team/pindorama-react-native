import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://caxadytokzhylzebneff.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNheGFkeXRva3poeWx6ZWJuZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTc5ODAsImV4cCI6MjA2NjA5Mzk4MH0.fBLE4UOxynk20i0-xYjP07aKVzP3kLUMKqPkxWTXiwY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);