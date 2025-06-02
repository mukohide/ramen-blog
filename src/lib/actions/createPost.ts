'use server'
// バリデーションのスキーマファイル
import { postSchema } from "@/validations/post"
// 画像の保存の関数
import { saveImage } from "@/utils/image"
// DB登録のため
import { prisma } from "@/lib/prisma"
// 認証しているユーザーID取得のため
import { auth } from "@/auth"
// DB登録後にリダイレクトをかけるため
import { redirect } from "next/navigation"

type ActionState = {
    success: boolean,
    errors: Record<string, string[]>
}

export async function createPost(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {

    // フォームの情報を保存
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const topImageInput = formData.get('topImage')
    // topImageInputがFileかどうか判定
    const topImage = topImageInput instanceof File ? topImageInput : null

    // バリデーション
    const validationResult = postSchema.safeParse({ title, content, topImage })
    if (!validationResult.success) {
        return { success: false, errors: validationResult.error.flatten().fieldErrors}
    }

    // 画像の保存
    // topImageが存在するか判定
    const imageUrl = topImage ? await saveImage(topImage) : null
    if (topImage && !imageUrl) {
        return { success: false, errors: { image: ['画像の保存に失敗しました']}}
    }

    // DB保存
    const session = await auth()
    const userId = session?.user?.id
    if(!session?.user?.email || !userId){
        throw new Error('不正なリクエストです')
    }

    await prisma.post.create({
        data: {
            title,
            content,
            topImage: imageUrl,
            published: true,
            authorId: userId
        }
    })

    redirect('/dashboard')
}