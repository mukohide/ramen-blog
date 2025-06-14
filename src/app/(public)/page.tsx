import { getPosts, searchPosts } from "@/lib/post"
import PostCard from "@/components/post/PostCard"
import { Post, PaginatedPosts } from "@/types/post"
import { Pagination } from "@/components/ui/pagination"

type SearchParams = {
  search?: string
  page?: string
}

export default async function PostsPage(
  {searchParams}:{searchParams: Promise<SearchParams>}) {

  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.search || ''
  const page = Number(resolvedSearchParams.page) || 1

  let posts: Post[]
  let totalPages = 1
  let currentPage = 1

  if (query) {
    posts = await searchPosts(query) as Post[]
  } else {
    const result = await getPosts(page) as PaginatedPosts
    posts = result.posts
    totalPages = result.totalPages
    currentPage = result.currentPage
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: Post)=>(
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {!query && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={resolvedSearchParams}
        />
      )}
    </div>
    </>
  )
}
