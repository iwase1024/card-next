import './globals.css'

export const metadata = {
  title: 'Your Name | Photographer & Filmmaker',
  description: 'テストテキスト',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
