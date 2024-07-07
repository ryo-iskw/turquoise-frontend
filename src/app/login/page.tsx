'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { ZodError, z } from 'zod'

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: '無効なメールアドレスです' })
    .nonempty({ message: 'メールアドレスを入力してください' }),
  password: z
    .string()
    .min(6, { message: 'パスワードは8文字以上で入力してください' })
    .nonempty({ message: 'パスワードを入力してください' }),
})

type LoginFormInputs = z.infer<typeof loginSchema>

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  const onLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    console.log('Login data:', data)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sessions`, {
        method: 'POST',
        mode: 'cors', // CORSモードを明示的に指定
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ session: data }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const result = await response.json()
      console.log('Login response:', result)
      alert('ログイン成功: ' + result.message)
    } catch (error) {
      console.error('Login error:', error)
      alert('ログインに失敗しました。')
    }
  }

  return (
    <>
      <div className="flex_[1_0_0] flex h-full w-full flex-col items-center justify-center self-stretch">
        <div className="flex flex-col items-start gap-4 rounded bg-white">
          <span>ログイン</span>
          <form className="flex w-[450px] flex-col items-start" onSubmit={handleSubmit(onLogin)}>
            <div className="flex items-start self-stretch pb-4">
              <span className="flex h-[42px] w-[150px] items-center gap-1">メールアドレス</span>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center">
                <input
                  className="flex w-[300px] items-center"
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...register('email')}
                />
                {errors.email && <p>{errors.email.message}</p>}
              </div>
            </div>
            <div className="flex items-start self-stretch pb-4">
              <span className="flex h-[42px] w-[150px] items-center gap-1">パスワード</span>
              <div className="flex flex-[1_0_0] flex-col items-start justify-center">
                <input
                  className="flex w-[300px] items-center"
                  id="password"
                  type="password"
                  placeholder="*******"
                  {...register('password')}
                />
                {errors.password && <p>{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between self-stretch">
              <button className="btn btn-primary" type="submit">
                ログイン
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex_[1_0_0] flex h-full w-full flex-col items-center justify-center self-stretch bg-turqb-500"></div>
    </>
  )
}
