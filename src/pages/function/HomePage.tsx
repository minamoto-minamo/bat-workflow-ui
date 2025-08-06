// pages/HomePage.tsx
import { useState } from "react";
import PostList, { type Post } from "@/components/Home/PostList";
import PostForm from "@/components/Home/PostForm";

let postIdCounter = 1000;

const dummyPosts: Post[] = Array.from({ length: 25 }).map((_, i) => ({
	id: i + 1,
	title: `User ${i + 1}`,
	content: `これは投稿内容 ${i + 1} です。\n aaa\n bbb`,
	createdAt: new Date(Date.now() - i * 1000 * 60),
}));

export default function HomePage({ setRightPanel }: { setRightPanel: (content: React.ReactNode) => void }) {
	const [posts, setPosts] = useState<Post[]>(dummyPosts);

	const openEditor = (post: Post | null = null) => {
		setRightPanel(
			<PostForm
				post={post}
				onSave={(newPost, id) => {
					setPosts((prev) =>
						id
							? prev.map((p) => (p.id === id ? { ...p, ...newPost } : p))
							: [{ id: postIdCounter++, createdAt: new Date(), ...newPost }, ...prev]
					);
					setRightPanel(null);
				}}
				onDelete={(id) => {
					setPosts((prev) => prev.filter((p) => p.id !== id));
					setRightPanel(null);
				}}
				onClose={() => setRightPanel(null)}
			/>
		);
	};

	return (
		<div className="text-gray-800">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">投稿一覧</h2>
				<div className="flex gap-2">
					<button
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						onClick={() => openEditor(null)}
					>
						＋ 投稿
					</button>
				</div>
			</div>

			<PostList posts={posts} onEdit={openEditor} />
		</div>
	);
}
