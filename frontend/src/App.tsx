import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import HalaqahList from './pages/halaqah/HalaqahList';
import StudentList from './pages/student/StudentList';
import StudentDetail from './pages/student/StudentDetail';
import SessionList from './pages/session/SessionList';
import SessionDetail from './pages/session/SessionDetail';
import ExamList from './pages/exam/ExamList';
import ExamDetail from './pages/exam/ExamDetail';
import TeacherList from './pages/teacher/TeacherList';
import ReportList from './pages/reports/ReportList';
import StudentReport from './pages/reports/StudentReport';
import HalaqahReport from './pages/reports/HalaqahReport';
import UsersList from './pages/users/UsersList';
import ProfilePage from './pages/profile/ProfilePage';
import { ToastProvider } from './components/common/toast/ToastProvider';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="halaqah" element={<HalaqahList />} />
              <Route path="student" element={<StudentList />} />
              <Route path="student/:id" element={<StudentDetail />} />
              <Route path="session" element={<SessionList />} />
              <Route path="session/:id" element={<SessionDetail />} />
              <Route path="exam" element={<ExamList />} />
              <Route path="exam/:id" element={<ExamDetail />} />
              <Route path="teacher" element={<TeacherList />} />
              <Route path="users" element={<UsersList />} />
              <Route path="reports" element={<ReportList />} />
              <Route path="reports/student/:id" element={<StudentReport />} />
              <Route path="reports/halaqah/:id" element={<HalaqahReport />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
