import { getOwnPosts } from "@/lib/ownPost"
import { auth } from '@/auth'
import PostDropdownMenu from "@/components/post/PostDropdownMenu"
import { Button } from '@/components/ui/button'
import Link from "next/link"

// `getOwnPosts`が返す型を定義
type OwnPost = {
  id: string;
  title: string;
  published: boolean;
  updatedAt: Date;
}

export default async function DashBoardPage() {

  // セッション情報取得
  const session = await auth()
  // ユーザーID取得
  const userId = session?.user?.id
  if(!session?.user?.email || !userId) {
    throw new Error('不正なリクエストです')
  }
  const posts = await getOwnPosts(userId)

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">記事一覧</h1>
        <Button>
          <Link href="/manage/posts/create">新規記事作成</Link>
        </Button>
      </div>
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-center">タイトル</th>
            <th className="border p-2 text-center">公開／非公開</th>
            <th className="border p-2 text-center">更新日時</th>
            <th className="border p-2 text-center">操作</th>
        </tr>
        </thead>
        <tbody>
          { posts.map((post: OwnPost)=>(
            <tr key={post.id}>
              <td className="border p-2">{post.title}</td>
              <td className="border p-2 text-center">
                {post.published ? "公開" : "公開／非公開"}
              </td>
              <td className="border p-2 text-center">
                {new Date(post.updatedAt).toLocaleString()}
              </td>
              <td className="border p-2 text-center">
                <PostDropdownMenu postId={post.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
