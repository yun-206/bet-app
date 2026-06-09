'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function BetDetail() {
  const { id } = useParams()
  const [bet, setBet] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])

  useEffect(() => {
    supabase.from('bets').select('*').eq('id', id).single()
      .then(({ data }) => setBet(data))
    supabase.from('participants').select('*').eq('bet_id', id)
      .then(({ data }) => setParticipants(data || []))
  }, [id])

  if (!bet) return <div className="p-6 text-center">로딩중...</div>

  const isPastDeadline = new Date(bet.deadline) < new Date()
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/bet/${id}/join` : ''

  return (
    <main className="max-w-lg mx-auto p-6">
      <Link href="/" className="text-gray-400 text-sm mb-4 block">← 목록으로</LinssName="text-2xl font-bold">{bet.title}</h1>
      {bet.description && <p className="text-gray-500 mt-1">{bet.description}</p>}
      <p className={`text-sm mt-2 font-medium ${isPastDeadline ? 'text-red-500' : 'text-orange-500'}`}>
        {isPastDeadline ? '⏰ 마감됨!' : `⏰ 마감: ${new Date(bet.deadline).toLocaleDateString('ko-KR')}`}
      </p>

      <button
        onClick={() => { navigator.clipboard.writeText(inviteUrl); alert('링크 복사됨! 친구에게 보내세요 🔗') }}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 mt-4 hover:border-black hover:text-black transition-colors">
        🔗 친구 초대 링크 복사
      </button>

      <h2 className="font-bold text-lg mt-6 mb-3">참여자 {participants.length}명</h2>
      <div className="space-y-3">
        {participants.length === 0 && (
          <p className="text-center text-gray-400 py-8">아직 참여자가 없어요!<br/>위 링크로 친구를 초대하세요</p>
        )} showPenalty = isFailed
          return (
            <div key={p.id} className={`rounded-xl border p-4 space-y-2 ${isFailed ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{p.nickname}</span>
                {p.is_completed
                  ? <span className="text-green-500 text-sm">✅ 달성!</span>
                  : isFailed
                    ? <span className="text-red-500 text-sm">💀 실패</span>
                    : <span className="text-orange-400 text-sm">🔥 진행중</span>
                }
              </div>
              <p className="text-sm text-gray-600">🎯 {p.goal}</p>
              <div className={`rounded-lg p-2 text-sm ${showPenalty ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
                {showPenalty ? `🔓 벌칙: ${p.penalty}` : '🔒 벌칙은 마감 후 공개'}
              </div>
            </div>
          )
        })}
    <Link href={`/bet/${id}/join`}
          className="block w-full bg-black text-white rounded-lg p-3 font-semibold text-center mt-6">
          + 나도 참여하기
        </Link>
      )}
    </main>
  )
}
