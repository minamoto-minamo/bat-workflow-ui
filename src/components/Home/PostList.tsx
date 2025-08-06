// components/PostList.tsx
import { useState } from "react";


export type Post = {
	id: number;
	title: string;
	content: string;
	createdAt: Date;
};

interface PostListProps {
	posts: Post[];
	onEdit: (post: Post) => void;
}

export default function PostList({ posts, onEdit }: PostListProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 10;

	// ページネーション
	const indexOfLast = currentPage * postsPerPage;
	const indexOfFirst = indexOfLast - postsPerPage;
	const currentPosts = posts.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(posts.length / postsPerPage);

	return (
		<div className="space-y-4">
			{currentPosts.map((post) => (
				<div
					key={post.id}
					className="p-4 bg-white shadow-md rounded-md hover:bg-gray-50 cursor-pointer space-y-2"
					onClick={() => onEdit(post)}
				>
					<div className="flex justify-between items-center text-sm text-gray-600">
						<span className="font-medium">{post.title}</span>
						<span className="text-xs">{post.createdAt.toLocaleString()}</span>
					</div>

					<div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pl-4">
						{post.content}
					</div>
				</div>
			))}

			<div className="flex justify-center mt-4 space-x-2">
				{Array.from({ length: totalPages }, (_, i) => (
					<button
						key={i}
						className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
							}`}
						onClick={() => setCurrentPage(i + 1)}
					>
						{i + 1}
					</button>
				))}
			</div>
		</div>
	);
}
