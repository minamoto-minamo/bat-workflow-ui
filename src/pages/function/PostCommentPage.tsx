// src/pages/PostCommentPage.tsx
import { useCrud } from "@/hooks/useCrud"
import { useRightPanel } from "@/hooks/useRightPanel"
import type { Post } from "@/types/Post"
import PostForm from "@/components/Post/PostForm"
import PostList from "@/components/Post/PostList"
import MasterDetailPage from "@/pages/MasterDetailPage"

interface Props { setRightPanel: (content: React.ReactNode) => void }

export default function PostCommentPage({ setRightPanel }: Props) {
	const { items: posts, save, remove } = useCrud<Post>("/api/post")
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
			title="投稿一覧"
			items={posts}
			onOpenForm={openForm}
			ListComponent={({ items, onEdit }) => (
				<PostList posts={items} onEdit={onEdit} />
			)}
			onCreateLabel="＋ 投稿"
		/>
	)
}
