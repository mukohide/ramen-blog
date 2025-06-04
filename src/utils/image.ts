import { writeFile } from "fs/promises";
import path from "path";
import { supabase } from "@/lib/actions/supabase";

// 引数として画像の情報が入ってくる
export async function saveImage(file: File): Promise<string | null> {
    const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE_STORAGE === 'true';

    if (useSupabase) {
        return await saveImageToSupabase(file);
    } else {
        return await saveImageToLocal(file);
    }
}

export async function saveImageToLocal(file: File): Promise<string | null>{
    // 渡ってくるデータ形式
    const buffer = Buffer.from(await file.arrayBuffer())
    // 引数で渡ってきた画像のファイル名を設定
    const fileName = `${Date.now()}_${file.name}`
    // アップロードするフォルダのパス
    const uploadDir = path.join(process.cwd(), 'public/images')
    
    try {
        // ファイル名も合わせた完全なパスを作成
        const filePath = path.join(uploadDir, fileName)
        // 保存
        await writeFile(filePath, buffer)
        // DBに保存する文字情報を戻す
        return `/images/${fileName}`
    } catch(error) {
        return null
    }
}

async function saveImageToSupabase(file: File): Promise<string | null> {
 const fileName = `${Date.now()}_${file.name}`;
 const { error } = await supabase.storage
 .from('ramen-blog-bucket')
 .upload(fileName, file, {
 cacheControl: '3600',
 upsert: false,
 });
 if (error) {
 console.error('Upload error:', error.message);
 return null; }
 const { data: publicUrlData } = supabase.storage
 .from('ramen-blog-bucket')
 .getPublicUrl(fileName);
 return publicUrlData.publicUrl;
}

