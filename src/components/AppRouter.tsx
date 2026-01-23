import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import App from '../App';
import AdminRoute from './AdminRoute';
import NotFound from './NotFound';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;