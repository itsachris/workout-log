import { Outlet, NavLink, useLocation } from 'react-router-dom'

export default function App() {
  const location = useLocation()
  const isWorkoutActive = location.pathname.startsWith('/workout')

  return (
    <>
      <Outlet />
      {!isWorkoutActive && (
        <nav className="bottom-nav">
          <NavLink to="/" end>
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </NavLink>
          <NavLink to="/history">
            <span className="nav-icon">📋</span>
            <span>History</span>
          </NavLink>
        </nav>
      )}
    </>
  )
}
