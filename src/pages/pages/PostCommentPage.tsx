import { useCrud } from '@/hooks/useCrud'
import { useRightPanel } from '@/hooks/useRightPanel'
import type { Post } from '@/types/pages/Post'
import PostForm from '@/components/pages/post/PostForm'
import PostList from '@/components/pages/post/PostList'
import MasterDetailPage from '@/pages/MasterDetailPage'
import { CONFIG } from '@/config'

interface Props { setRightPanel: (content: React.ReactNode) => void }

export default function PostCommentPage({ setRightPanel }: Props) {
	const { items: posts, save, remove } = useCrud<Post>('/api/post',
		(a, b) => b.updatedAt.localeCompare(a.updatedAt)
	)
	const { open, close } = useRightPanel(setRightPanel)

	const openForm = (post: Post | null) => {
		open(
			<PostForm
				post={post}
				onSave={async (p, id) => { await save(p, id); close() }}
				onDelete={async (id) => { await remove(id); close() }}
				onClose={close}
			/>
		)
	}

	return (
		<MasterDetailPage<Post>
			title={CONFIG['page.post.title']}
			items={posts}
			onOpenForm={openForm}
			ListComponent={({ items, onEdit }) => (
				<PostList posts={items} onEdit={onEdit} />
			)}
			onCreateLabel={CONFIG['page.post.add-button']}
		/>
	)
}
