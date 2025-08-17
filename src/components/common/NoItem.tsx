import { CONFIG } from '@/config'
import { type Page } from '@/types/Page'

type Props = {
    page: Page
}

export default function NoItem({ page }: Props) {
    return (
        <div className='px-2 py-8 text-center text-gray-400'>
            {CONFIG[`page.${page}.item-name`]}がありません。右上の「＋ {CONFIG[`page.${page}.add-button`]}」から作成してください。
        </div>
    )
}
