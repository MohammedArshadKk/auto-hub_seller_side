import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CreateProduct } from './pages/CreateProduct';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { Orders } from './pages/Orders';
import { Earnings } from './pages/Earnings';
import { Settings } from './pages/Settings';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/*"
                                element={
                                    <ProtectedRoute>
                                        <DashboardLayout>
                                            <Routes>
                                                <Route path="/dashboard" element={<Dashboard />} />
                                                <Route path="/create-product" element={<CreateProduct />} />
                                                <Route path="/products" element={<Products />} />
                                                <Route path="/inventory" element={<Inventory />} />
                                                <Route path="/orders" element={<Orders />} />
                                                <Route path="/earnings" element={<Earnings />} />
                                                <Route path="/settings" element={<Settings />} />
                                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                            </Routes>
                                        </DashboardLayout>
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
