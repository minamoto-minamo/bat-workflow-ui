import { useEffect, useState } from "react";
import type { Step } from "@/types/Step";
import StepForm from "@/components/Step/StepForm";

interface StepConfigPageProps {
	setRightPanel: (content: React.ReactNode) => void;
}

export default function StepConfigPage({ setRightPanel }: StepConfigPageProps) {
	const [steps, setSteps] = useState<Step[]>([]);

	useEffect(() => {
		fetch("/api/steps")
			.then(res => res.json())
			.then(data => setSteps(data));
	}, []);

	const handleSave = async (step: Omit<Step, "id">, id?: number) => {
		const res = await fetch(id ? `/api/steps/${id}` : "/api/steps", {
			method: id ? "PUT" : "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(step),
		});

		const saved = await res.json();
		setSteps(prev => {
			const updated = prev.filter(s => s.id !== saved.id);
			return [...updated, saved].sort((a, b) => a.id - b.id);
		});

		closeForm();
	};

	const handleDelete = async (id: number) => {
		await fetch(`/api/steps/${id}`, { method: "DELETE" });
		setSteps(prev => prev.filter(s => s.id !== id));
		closeForm();
	};

	const openForm = (step: Step | null) => {
		setRightPanel(
			<StepForm
				step={step}
				onSave={handleSave}
				onDelete={handleDelete}
				onClose={closeForm}
			/>
		);
	};

	const closeForm = () => setRightPanel(null);

	return (
		<div className="text-gray-800">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">ステップ定義一覧</h2>
				<button
					className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					onClick={() => openForm(null)}
				>
					＋ 新規作成
				</button>
			</div>


			<table className="w-full text-sm table-fixed">
				<thead>
					<tr className="text-left border-b border-gray-600">
						<th className="px-2 py-1 text-center w-[150px]">ステップ名</th>
						<th className="px-2 py-1 text-center w-[300px]">batパス</th>
						<th className="px-2 py-1 text-center w-[200px]">メモ</th>
						<th className="px-2 py-1 text-center w-[100px]">操作</th>
					</tr>
				</thead>
				<tbody>
					{steps.map(step => (
						<tr key={step.id} className="border-b border-gray-700">
							<td className="px-2 py-1 truncate" title={step.name}>{step.name}</td>
							<td className="px-2 py-1 truncate" title={step.batPath}>{step.batPath}</td>
							<td className="px-2 py-1 truncate" title={step.memo}>{step.memo}</td>
							<td className="px-2 py-1 text-center">
								<button
									className="bg-gray-700 px-4 py-2 rounded text-white text-base hover:bg-gray-600"
									onClick={() => openForm(step)}
								>
									編集
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

		</div>
	);
}
