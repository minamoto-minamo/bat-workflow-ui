import { useEffect, useState } from 'react'
import type { Post } from '@/types/pages/Post'

interface PostFormProps {
	post: Post | null
	onSave: (post: Omit<Post, 'id' | 'updatedAt'>, id?: number) => void
	onDelete?: (id: number) => void
	onClose: () => void
}

export default function PostForm({ post, onSave, onDelete, onClose }: PostFormProps) {
	const [title, setName] = useState('')
	const [content, setContent] = useState('')

	useEffect(() => {
		setName(post?.title ?? '')
		setContent(post?.content ?? '')
	}, [post])

	const handleSubmit = () => {
		if (!title.trim() || !content.trim()) {
			alert('名前と本文は必須です。')
			return
		}
		onSave({ title, content }, post?.id)
	}

	const handleDelete = () => {
		if (post?.id && confirm('本当に削除しますか？')) {
			onDelete?.(post.id)
		}
	}

	return (
		<div className='space-y-4 text-sm text-gray-800'>
			<h3 className='text-xl font-bold mx-auto'>
				{post ? '投稿を編集' : '新規投稿'}
			</h3>

			<div>
				<label className='block font-semibold mb-1'>タイトル</label>
				<input
					className='w-full border border-gray-400 px-2 py-1 rounded'
					value={title}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<div>
				<label className='block font-semibold mb-1'>本文</label>
				<textarea
					className='w-full border border-gray-400 px-2 py-1 rounded'
					rows={4}
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
			</div>

			<div className='flex gap-2 mt-4'>
				<button className='!bg-gray-400 text-white px-4 py-1 rounded' onClick={onClose}>
					閉じる
				</button>
				<button className='!bg-blue-600 text-white px-4 py-1 rounded' onClick={handleSubmit}>
					保存
				</button>
				{post?.id && onDelete && (
					<button className='ml-auto bg-red-600 text-white px-4 py-1 rounded' onClick={handleDelete}>
						削除
					</button>
				)}
			</div>
		</div>
	)
}
