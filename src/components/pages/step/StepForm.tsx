import { useEffect, useState } from 'react'
import type { Step } from '@/types/pages/Step'

interface StepFormProps {
	step: Step | null
	onSave: (step: Omit<Step, 'id'>, id?: number) => void
	onDelete?: (id: number) => void
	onClose: () => void
}

export default function StepForm({ step, onSave, onDelete, onClose }: StepFormProps) {
	const [name, setName] = useState('')
	const [batPath, setBatPath] = useState('')
	const [memo, setMemo] = useState('')

	useEffect(() => {
		setName(step?.name || '')
		setBatPath(step?.batPath || '')
		setMemo(step?.memo || '')
	}, [step])

	const handleSubmit = () => {
		if (!name.trim() || !batPath.trim()) {
			alert('ステップ名とbatパスは必須です。')
			return
		}
		onSave({ name, batPath, memo }, step?.id)
	}

	const handleDelete = () => {
		if (step?.id && onDelete && confirm('本当に削除しますか？')) {
			onDelete(step.id)
		}
	}

	return (
		<div className='space-y-4 text-sm text-gray-800'>
			<h3 className='text-xl font-bold mx-auto'>
				{step ? 'ステップ編集' : '新規ステップ作成'}
			</h3>

			<div>
				<label className='block font-semibold mb-1'>ステップ名</label>
				<input
					className='w-full border border-gray-400 px-2 py-1 rounded'
					value={name}
					onChange={e => setName(e.target.value)}
				/>
			</div>

			<div>
				<label className='block font-semibold mb-1'>batパス</label>
				<input
					className='w-full border border-gray-400 px-2 py-1 rounded'
					value={batPath}
					onChange={e => setBatPath(e.target.value)}
				/>
			</div>

			<div>
				<label className='block font-semibold mb-1'>メモ</label>
				<textarea
					className='w-full border border-gray-400 px-2 py-1 rounded'
					rows={3}
					value={memo}
					onChange={e => setMemo(e.target.value)}
				/>
			</div>

			<div className='flex gap-2 mt-4'>
				<button className='bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500' onClick={onClose}>
					閉じる
				</button>
				<button className='bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700' onClick={handleSubmit}>
					保存
				</button>

				{step?.id && onDelete && (
					<button className='ml-auto bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700' onClick={handleDelete}>
						削除
					</button>
				)}
			</div>

		</div>
	)
}
