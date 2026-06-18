import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage      from './pages/HomePage';
import LearnPage     from './pages/LearnPage';
import QuizzesPage   from './pages/QuizzesPage';
import QuizPage      from './pages/QuizPage';
import Navbar        from './components/Navbar';
import Footer        from './components/Footer';

import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPhrases   from './pages/admin/AdminPhrases';
import AdminQuizzes   from './pages/admin/AdminQuizzes';
import AdminLayout    from './components/AdminLayout';
import ProtectedAdmin from './components/admin/ProtectedAdmin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"            element={<><Navbar transparent /><HomePage /><Footer /></>} />
        <Route path="/learn"       element={<><Navbar /><LearnPage /><Footer /></>} />
        <Route path="/quizzes"     element={<><Navbar /><QuizzesPage /><Footer /></>} />
        <Route path="/quizzes/:id" element={<><Navbar /><QuizPage /><Footer /></>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <ProtectedAdmin>
            <AdminLayout>
              <Routes>
                <Route index                element={<AdminDashboard />} />
                <Route path="categories"    element={<AdminCategories />} />
                <Route path="phrases"       element={<AdminPhrases />} />
                <Route path="quizzes"       element={<AdminQuizzes />} />
              </Routes>
            </AdminLayout>
          </ProtectedAdmin>
        } />
      </Routes>
    </BrowserRouter>
  );
}
