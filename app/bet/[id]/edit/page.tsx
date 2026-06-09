'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function EditBet() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '', deadline: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('bets').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) setForm({
          title: data.title,
          description: data.description || '',
          deadline: data.deadline.slice(0, 16)
        })
      })
  }, [id])

  async function handleUpdate() {
    setLoading(true)
    await supabase.from('bets').update(form).eq('id', id)
    router.push('/bet/' + id)
    setLoading(false)
  }

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">내기 수정하기</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">내기 제목</label>
          <input
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            className="w-full border rounded-lg p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="w-full border rounded-lg p-3 h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">마감일</label>
          <input
            type="datetime-local"
            value={form.deadline}
            onChange={e => setForm({...form, deadline: e.target.value})}
            className="w-full border rounded-lg p-3"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()}
            className="flex-1 border rounded-lg p-3 font-semibold text-gray-600 hover:bg-gray-50">
            취소
          </button>
          <button onClick={handleUpdate} disabled={loading}
            className="flex-1 bg-black text-white rounded-lg p-3 font-semibold disabled:opacity-50">
            {loading ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </main>
  )
}
