'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

// ユーザー詳細ページ
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().int().positive(),
  role: z.enum(['user', 'admin']),
})
type UserFormInputs = z.infer<typeof userSchema>

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    console.log('User data:', data)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/sample.json`, {
        method: 'PUT',
        mode: 'cors', // CORSモードを明示的に指定
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      console.log('User response:', result)
      alert(`更新成功: ${result.message}`)
    } catch (error) {
      console.error('User error:', error)
      alert('更新に失敗しました。')
    }
  }

  return (
    <main>
      <div className='flex flex-col items-start gap-4 rounded bg-white p-4'>
        <h1 className='font-bold text-lg'>ユーザー情報</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <label>
            ID
            <input type="text" {...register('id')} />
          </label>
          <label>
            名前
            <input type="text" {...register('name')} />
          </label>
          <label>
            メールアドレス
            <input type="email" {...register('email')} />
          </label>
          <label>
            年齢
            <input type="number" {...register('age')} />
          </label>
          <label>
            権限
            <select {...register('role')}>
              <option value="user">ユーザー</option>
              <option value="admin">管理者</option>
            </select>
          </label>
          <button type="submit">更新</button>
        </form>
      </div>
    </main>
  )
}
