import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage    from './pages/HomePage';
import LearnPage   from './pages/LearnPage';
import QuizzesPage from './pages/QuizzesPage';
import QuizPage    from './pages/QuizPage';
import Navbar      from './components/Navbar';
import Footer      from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<><Navbar transparent /><HomePage /><Footer /></>} />
        <Route path="/learn"     element={<><Navbar /><LearnPage /><Footer /></>} />
        <Route path="/quizzes"   element={<><Navbar /><QuizzesPage /><Footer /></>} />
        <Route path="/quizzes/:id" element={<><Navbar /><QuizPage /><Footer /></>} />
      </Routes>
    </BrowserRouter>
  );
}
