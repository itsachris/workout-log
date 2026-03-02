import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Workout from './pages/Workout'
import History from './pages/History'
import WorkoutDetail from './pages/WorkoutDetail'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'workout/:category', element: <Workout /> },
      { path: 'history', element: <History /> },
      { path: 'history/:workoutId', element: <WorkoutDetail /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
