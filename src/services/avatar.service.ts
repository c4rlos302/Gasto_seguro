import { supabase } from "./supabase";

export const getAvatars = async () => {

    const { data, error } = await supabase.storage
        .from("avatars")
        .list("", {
            limit: 100,
        });

    if (error) {
        return { error };
    }

    const avatars = data.map((file) => {
        const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(file.name);

        return {
            name: file.name,
            url: urlData.publicUrl,
        };
    });

    return { data: avatars };
};