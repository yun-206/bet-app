'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [bets, setBets] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    supabase.from('bets').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setBets(data || []))
  }, [])

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm('정말 삭제할까요?')) return
    await supabase.from('bets').delete().eq('id', id)
    setBets(bets.filter(b => b.id !== id))
  }

  return (
    <main className="max-w-lg mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-1">ChallengeUp</h1>
        <p className="text-gray-400 text-sm mb-4">동기부여 프로젝트 챌린지업</p>
        <Link href="/create"
          className="bg-black text-white px-6 py-2 rounded-lg font-semibold inline-block hover:bg-gray-800 transition-colors">
          + 내기 만들기
        </Link>
      </div>
      <div className="space-y-3">
        {bets.length === 0 && (
          <p className="text-center text-gray-400 py-12">아직 내기가 없어요!<br/>첫 번째 내기를 만들어보세요</p>
        )}
        {bets.map(bet => (
          <div key={bet.id}
            className="border rounded-xl p-4 hover:border-black hover:shadow-md transition-all cursor-pointer group">
            <Link href={`/bet/${bet.id}`} className="block">
              <h2 className="font-semibold text-lg group-hover:text-black">{bet.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{bet.description}</p>
              <p className="text-red-500 text-sm mt-2">
                마감: {new Date(bet.deadline).toLocaleDateString('ko-KR')}
              </p>
            </Link>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link href={`/bet/${bet.id}/edit`}
                className="text-xs text-gray-400 hover:text-black transition-colors px-2 py-1 rounded hover:bg-gray-100">
                수정하기
              </Link>
              <button
                onClick={e => handleDelete(bet.id, e)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50">
                삭제하기
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
