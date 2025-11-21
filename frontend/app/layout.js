import './globals.css'

export const metadata = {
  title: 'Business Lab - SLA Management System',
  description: 'Comprehensive SLA management system for Business Lab',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}