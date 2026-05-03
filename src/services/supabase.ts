import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const isReactNative = typeof window !== "undefined";

export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_KEY!,
    {
        auth: {
            storage: isReactNative ? AsyncStorage : undefined,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
)