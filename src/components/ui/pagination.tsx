import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface PaginationProps {
    currentPage: number
    totalPages: number
    searchParams?: { [key: string]: string | string[] | undefined }
}

export function Pagination({ currentPage, totalPages, searchParams = {} }: PaginationProps) {
    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams as Record<string, string>)
        params.set('page', pageNumber.toString())
        return `?${params.toString()}`
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <Button
                variant="outline"
                size="icon"
                asChild
                disabled={currentPage <= 1}
            >
                <Link href={createPageURL(currentPage - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            </Button>

            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        asChild
                    >
                        <Link href={createPageURL(page)}>
                            {page}
                        </Link>
                    </Button>
                ))}
            </div>

            <Button
                variant="outline"
                size="icon"
                asChild
                disabled={currentPage >= totalPages}
            >
                <Link href={createPageURL(currentPage + 1)}>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    )
} 