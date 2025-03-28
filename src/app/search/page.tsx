import { Metadata } from 'next'
import SearchPage from '../components/search/SearchPage'

export const metadata: Metadata = {
  title: '体験・クエストを検索',
  description: '体験やクエストを探す',
}

export const PREFECTURES = [
  { id: 'kagawa', name: '香川県' },
  { id: 'tokushima', name: '徳島県' },
  { id: 'kochi', name: '高知県' },
  { id: 'ehime', name: '愛媛県' },
] as const

export default function Page() {
  return <SearchPage />
} 