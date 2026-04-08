import './globals.css'

export const metadata = {
  title: 'Your Name | Photographer & Filmmaker',
  description: '東京を拠点に活動するフォトグラファー・映像クリエイター',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
