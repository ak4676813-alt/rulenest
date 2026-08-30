import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"
import { DataProvider } from "./context/DataContext"
import AppRoutes from "./routes/AppRoutes"
import ProductTour from "./components/ProductTour"

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
            <ProductTour />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}