const ADMIN_EMAIL = 'chaurasiyavikas1234@gmail.com'

export default function AdminRoute({ children, user }) {
  if (!user) return null
  if (user.email !== ADMIN_EMAIL) return null
  return children
}