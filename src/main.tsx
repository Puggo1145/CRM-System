import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Root from './Root'

import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

import Dashboard from './pages/Dashboard/Dashboard'
import Workbench from './pages/Dashboard/WorkBench/Workbench'
import TaskCenter from './pages/Dashboard/TaskCenter/TaskCenter'
import Database from './pages/Dashboard/Database/Database'

import ErrorPage from './pages/ErrorPage/ErrorPage'

import './index.css'

// router handler
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
        children: [
          {
            path: 'workbench',
            element: <Workbench />,
          },
          {
            path: 'taskcenter',
            element: <TaskCenter />,
          },
          {
            path: 'database',
            element: <Database />,
          }
        ]
      }
    ]
  },
  
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
);

export default root;