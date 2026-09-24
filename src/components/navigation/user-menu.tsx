import { Link } from 'react-router-dom'

import { useAuth } from '../../features/auth/auth-context'

export function UserMenu() {
  const auth = useAuth()

  return (
    <div className="user-menu">
      <Link className="text-link" to={auth.role === 'staff' ? '/staff/account' : '/app/account'}>
        Account
      </Link>
      <button className="button button-quiet" type="button" onClick={() => void auth.signOut()}>
        Sign out
      </button>
    </div>
  )
}
