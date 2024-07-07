import "./globals.css"
import type { Metadata } from "next"
import { Noto_Sans_JP } from "next/font/google"
import { AppToastProvider } from "@/hooks/toast"

const noto_sans_jp = Noto_Sans_JP({
  subsets: ["latin"], // 必要なサブセットを指定します
  display: "swap", // フォントの表示方法を指定します
  adjustFontFallback: false, // これがないと勝手に別のフォントになる。参考: https://stackoverflow.com/questions/76478043/next-js-always-fail-at-downloading-fonts-from-google-fonts
  variable: "--font-noto-sans-jp", // CSS変数名を指定します
})

export const metadata: Metadata = {
  title: "Turquoise",
  description: "テストサイトです",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={noto_sans_jp.className}>
        <AppToastProvider>{children}</AppToastProvider>
      </body>
    </html>
  )
}
