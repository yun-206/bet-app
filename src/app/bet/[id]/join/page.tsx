'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function JoinBet() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState({ nickname: '', goal: '', penalty: '' })
  const [loading, setLoading] = useState(false)

  async function handleJoin() {
    if (!form.nickname || !form.goal || !form.penalty) return alert('모두 입력해주세요!')
    setLoading(true)
    const { error } = await supabase.from('participants').insert({
      bet_id: id,
      user_id: 'anonymous-' + Math.random().toString(36).slice(2),
      ...form
    })
    if (!error) router.push(`/bet/${id}`)
    setLoading(false)
  }

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">✍️ 내 목표 & 벌칙 등록</h1>
      <p className="text-gray-500 text-sm mb-6">⚠️ 벌칙은 기한 pace-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">닉네임 *</label>
          <input
            placeholder="예: 운동왕김철수"
            value={form.nickname}
            onChange={e => setForm({...form, nickname: e.target.value})}
            className="w-full border rounded-lg p-3 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">나의 목표 *</label>
          <input
            placeholder="예: 매일 1시간 운동하기"
            value={form.goal}
            onChange={e => setForm({...form, goal: e.target.value})}
            className="w-full border rounded-lg p-3 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">실패 시 벌칙 🔒 *</label>
          <textarea
            placeholder="예: 치킨 10마리 쏘기, 삭발..."
            value={form.penalty}
        className="w-full border rounded-lg p-3 focus:outline-none focus:border-red-400 border-red-200 h-24"
          />
          <p className="text-xs text-red-400 mt-1">🔐 달성하면 영원히 비공개, 실패하면 전체 공개!</p>
        </div>
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full bg-red-500 text-white rounded-lg p-3 font-semibold disabled:opacity-50">
          {loading ? '등록 중...' : '등록하기 (벌칙은 잠깁니다 🔐)'}
        </button>
      </div>
    </main>
  )
}
