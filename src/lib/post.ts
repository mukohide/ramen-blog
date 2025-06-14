import { prisma } from '@/lib/prisma'

export async function getPosts(page: number = 1) {
    const limit = 15
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit,
            select: {
                id: true,
                title: true,
                content: true,
                topImage: true,
                author: true,
                createdAt: true
            }
        }),
        prisma.post.count({
            where: {
                published: true
            }
        })
    ])

    return {
        posts,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    }
}

export async function getPost(id: string){
    return await prisma.post.findUnique({
        where: {id},
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    })
}

export async function searchPosts(search: string) {
     // 全角スペースを半角スペースに変換しつつスペースで分割 (空文字などを除外) 
    const decodedSearch = decodeURIComponent(search)   
    const normalizedSearch = decodedSearch.replace(/[\s　]+/g, ' ').trim() 
    const searchWords = normalizedSearch.split(' ').filter(Boolean)

    const filters = searchWords.map( word =>({
        OR : [
            { title: { contains: word }},
            { content: { contains: word }},
        ]
    }))

    return await prisma.post.findMany({
        where: {
            AND: filters
        },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}
