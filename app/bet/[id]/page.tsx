'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function BetDetail() {
  const { id } = useParams()
  const [bet, setBet] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [checks, setChecks] = useState<Record<string, string[]>>({})

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    supabase.from('bets').select('*').eq('id', id).single()
      .then(({ data }) => setBet(data))
    loadParticipants()
  }, [id])

  async function loadParticipants() {
    const { data: parts } = await supabase.from('participants').select('*').eq('bet_id', id)
    if (!parts) return
    setParticipants(parts)
    const { data: checkData } = await supabase
      .from('daily_checks')
      .select('*')
      .in('participant_id', parts.map(p => p.id))
    const grouped: Record<string, string[]> = {}
    parts.forEach(p => { grouped[p.id] = [] })
    checkData?.forEach(c => {
      if (grouped[c.participant_id]) grouped[c.participant_id].push(c.check_date)
    })
    setChecks(grouped)
  }

  async function handleCheck(participantId: string) {
    const alreadyChecked = checks[participantId]?.includes(today)
    if (alreadyChecked) {
      await supabase.from('daily_checks').delete()
        .eq('participant_id', participantId).eq('check_date', today)
    } else {
      await supabase.from('daily_checks').insert({ participant_id: participantId, check_date: today })
    }
    loadParticipants()
  }

  function getAchieveRate(participantId: string, deadline: string) {
    const start = new Date(bet.created_at).toISOString().slice(0, 10)
    const end = new Date(Math.min(new Date(deadline).getTime(), new Date().getTime())).toISOString().slice(0, 10)
    const totalDays = Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1)
    const checkedDays = checks[participantId]?.length || 0
    return Math.round((checkedDays / totalDays) * 100)
  }

  if (!bet) return <div className="p-6 text-center">로딩중...</div>

  const isPastDeadline = new Date(bet.deadline) < new Date()
  const inviteUrl = typeof window !== 'undefined' ? window.location.origin + '/bet/' + id + '/join' : ''

  return (
    <main className="max-w-lg mx-auto p-6">
      <Link href="/" className="text-gray-400 text-sm mb-4 block">← 목록으로</Link>
      <h1 className="text-2xl font-bold">{bet.title}</h1>
      {bet.description && <p className="text-gray-500 mt-1">{bet.description}</p>}
      <p className={`text-sm mt-2 font-medium ${isPastDeadline ? 'text-red-500' : 'text-orange-500'}`}>
        {isPastDeadline ? '마감됨!' : '마감: ' + new Date(bet.deadline).toLocaleDateString('ko-KR')}
      </p>
      <button
        onClick={() => { navigator.clipboard.writeText(inviteUrl); alert('링크 복사됨!') }}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 mt-4 hover:border-black transition-colors">
        친구 초대 링크 복사
      </button>
      <h2 className="font-bold text-lg mt-6 mb-3">참여자 {participants.length}명</h2>
      <div className="space-y-3">
        {participants.length === 0 && (
          <p className="text-center text-gray-400 py-8">아직 참여자가 없어요!</p>
        )}
        {participants.map(p => {
          const isFailed = isPastDeadline && !p.is_completed
          const checkedToday = checks[p.id]?.includes(today)
          const rate = getAchieveRate(p.id, bet.deadline)
          const checkedDays = checks[p.id]?.length || 0
          return (
            <div key={p.id} className={`rounded-xl border p-4 space-y-3 ${isFailed ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{p.nickname}</span>
                {p.is_completed
                  ? <span className="text-green-500 text-sm">달성!</span>
                  : isFailed
                    ? <span className="text-red-500 text-sm">실패</span>
                    : <span className="text-orange-400 text-sm">진행중</span>
                }
              </div>
              <p className="text-sm text-gray-600">목표: {p.goal}</p>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{checkedDays}일 체크</span>
                  <span className="font-semibold">{rate}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-black rounded-full h-2 transition-all" style={{ width: rate + '%' }} />
                </div>
              </div>
              {!isPastDeadline && (
                <button
                  onClick={() => handleCheck(p.id)}
                  className={`w-full rounded-lg p-2 text-sm font-semibold transition-all ${checkedToday ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {checkedToday ? '오늘 완료! (취소하려면 클릭)' : '오늘 했어요!'}
                </button>
              )}
              <div className={`rounded-lg p-2 text-sm ${isFailed ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
                {isFailed ? '벌칙: ' + p.penalty : '벌칙은 마감 후 공개'}
              </div>
            </div>
          )
        })}
      </div>
      {!isPastDeadline && (
        <Link href={'/bet/' + id + '/join'}
          className="block w-full bg-black text-white rounded-lg p-3 font-semibold text-center mt-6">
          나도 참여하기
        </Link>
      )}
    </main>
  )
}
