'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CreateBet() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', deadline: '' })
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!form.title || !form.deadline) return alert('제목과 마감일을 입력해주세요!')
    setLoading(true)
    const { data, error } = await supabase
      .from('bets')
      .insert({ ...form, created_by: 'anonymous' })
      .select()
      .single()
    if (data) router.push(`/bet/${data.id}/join`)
    setLoading(false)
  }

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🎯 새 내기 만들기</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">내기 제목 *</label>
       
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            className="w-full border rounded-lg p-3 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            placeholder="예: 매일 운동 인증샷 올리기"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="w-full border rounded-lg p-3 focus:outline-none focus:border-black h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">마감일 *</label>
          <input
            type="datetime-local"
            value={form.deadline}
            onChange={e => setForm({...form, deadline: e.target.value})}
            className="w-full border rounded-lg p-3 focus:outline-none focus:border-black"
          />
        </div>
        <button
           disabled={loading}
          className="w-full bg-black text-white rounded-lg p-3 font-semibold disabled:opacity-50">
          {loading ? '만드는 중...' : '만들고 내 목표 등록하기 →'}
        </button>
      </div>
    </main>
  )
}
