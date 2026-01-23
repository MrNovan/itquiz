import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

const AdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверка, вошел ли администратор в систему.
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    // Проверка переменных окружения.
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('admin_token', 'authenticated');
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
};

export default AdminRoute;