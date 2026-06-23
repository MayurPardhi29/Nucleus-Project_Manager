import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from '../components/ProtectedRoute'
import Unauthorized from '../pages/Unauthorized'

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path='/' element={<Navigate to='/login' />} />
    <Route path='/login' element={<LoginPage />} />
    <Route path='/unauthorized' element={<Unauthorized />} />
    <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
  </Routes>
)

export default AppRoutes
