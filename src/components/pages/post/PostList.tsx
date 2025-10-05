// components/PostList.tsx
import type { Post } from '@/types/pages/Post'
import { formatDateTime } from '@/utils/formatDateTime'
import { usePagination } from '@/hooks/usePagination'
import Pagination from '@/components/common/Pagination'
import NoItem from '@/components/common/NoItem'
import { Page } from '@/types/Page'

interface PostListProps {
	posts: Post[]
	onEdit: (post: Post) => void
}

export default function PostList({ posts, onEdit }: PostListProps) {
	const { page, totalPages, pageItems, setPage } = usePagination(posts ?? [])

	// 並び替えやフィルタを別で入れる場合、reset() で1ページ目へ戻すとUXが良いです

	return (
		<div className='p-4'>
			{pageItems.map((post) => (
				<div
					key={post.id}
					className='p-4 bg-white shadow-md rounded-md hover:bg-gray-50 cursor-pointer my-4'
					onClick={() => onEdit(post)}
				>
					<div className='flex justify-between items-center text-sm text-gray-600'>
						<span className='font-medium'>{post.title}</span>
						<span className='text-xs'>LastUpdate:{formatDateTime(post.updatedAt)}</span>
					</div>

					<div className='text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pl-4'>
						{post.content}
					</div>
				</div>
			))}
			{pageItems.length === 0 && (
				<NoItem page={Page.Post} />
			)}

			<Pagination page={page} totalPages={totalPages} onChange={setPage} />
		</div>
	)
}
