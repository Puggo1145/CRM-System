import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Root from './Root'

import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

import Dashboard from './pages/Dashboard/Dashboard'
import Workbench from './pages/Dashboard/WorkBench/Workbench'
import TaskCenter from './pages/Dashboard/TaskCenter/TaskCenter'
import CreateTask from './pages/Dashboard/TaskCenter/CreateTask/CreateTask'
import TaskDetail from './pages/Dashboard/TaskCenter/TaskDetail/TaskDetail'

import Database from './pages/Dashboard/Database/Database'
import SchoolData from './pages/Dashboard/Database/SchoolData/SchoolData'
import TeacherData from './pages/Dashboard/Database/TeacherData/TeacherData'
import StudentData from './pages/Dashboard/Database/StudentData/StudentData'
import EditData from './pages/Dashboard/Database/EditData/EditData'

import Mytask from './pages/Dashboard/MyTask/Mytask'
import EmployeeTaskDetail from './pages/Dashboard/MyTask/EmployeeTaskDetail/EmployeeTaskDetail'

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
            children: [{
              path: ':id',
              element: <TaskDetail />
            }],
          },
          {
            path: 'taskcenter/createtask',
            element: <CreateTask />,
          },


          {
            path: 'database',
            element: <Database />,
            children: [
              {
                path: '',
                element: <SchoolData />,
              },
              {
                path: ':schoolId',
                element: <TeacherData />,
              },
              {
                path: ':schoolId/:teacherId',
                element: <StudentData />,
              },
              {
                path: 'edit',
                element: <EditData />,
              }
            ]
          },

          {
            path: 'mytask',
            element: <Mytask />,
          },
          {
            path: 'mytask/:id',
            element: <EmployeeTaskDetail />
          }
        ]
      }
    ]
  },
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

export default root;