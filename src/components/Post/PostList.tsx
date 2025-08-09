// components/PostList.tsx
import type { Post } from "@/types/Post"
import { usePagination } from "@/hooks/usePagination"
import Pagination from "@/components/common/Pagination"
import { CONFIG } from "@/config"

interface PostListProps {
	posts: Post[]
	onEdit: (post: Post) => void
}

export default function PostList({ posts, onEdit }: PostListProps) {
	const { page, totalPages, pageItems, setPage, reset } = usePagination(posts, CONFIG["page.base.pagination.per-page"])

	// 並び替えやフィルタを別で入れる場合、reset() で1ページ目へ戻すとUXが良いです

	return (
		<div className="space-y-4">
			{pageItems.map((post) => (
				<div
					key={post.id}
					className="p-4 bg-white shadow-md rounded-md hover:bg-gray-50 cursor-pointer space-y-2"
					onClick={() => onEdit(post)}
				>
					<div className="flex justify-between items-center text-sm text-gray-600">
						<span className="font-medium">{post.title}</span>
						<span className="text-xs">
							{/* updatedAt が string の場合に対応 */}
							{post.updatedAt
								? new Date(post.updatedAt as any).toLocaleString()
								: ""}
						</span>
					</div>

					<div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pl-4">
						{post.content}
					</div>
				</div>
			))}

			<Pagination page={page} totalPages={totalPages} onChange={setPage} />
		</div>
	)
}
