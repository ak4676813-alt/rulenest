import { lazy, Suspense, type ReactNode } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "../layouts/AppLayout"
import PublicLayout from "../layouts/PublicLayout"
import { useAuth } from "../context/AuthContext"
import Home from "../pages/public/Home"

// Route-level code splitting keeps the initial bundle light.
const Features = lazy(() => import("../pages/public/Features"))
const HowItWorks = lazy(() => import("../pages/public/HowItWorks"))
const Pricing = lazy(() => import("../pages/public/Pricing"))
const Resources = lazy(() => import("../pages/public/Resources"))
const About = lazy(() => import("../pages/public/About"))
const HelpCenter = lazy(() => import("../pages/public/HelpCenter"))
const Contact = lazy(() => import("../pages/public/Contact"))
const Security = lazy(() => import("../pages/public/Security"))
const Privacy = lazy(() => import("../pages/public/Privacy"))
const Terms = lazy(() => import("../pages/public/Terms"))
const BlogIndex = lazy(() => import("../pages/public/blog/BlogIndex"))
const BlogPost = lazy(() => import("../pages/public/blog/BlogPost"))
const CityPage = lazy(() => import("../pages/public/compliance/CityPage"))
const GuidePage = lazy(() => import("../pages/public/guides/GuidePage"))
const Login = lazy(() => import("../pages/public/auth/Login"))
const Signup = lazy(() => import("../pages/public/auth/Signup"))
const ForgotPassword = lazy(() => import("../pages/public/auth/ForgotPassword"))
const Dashboard = lazy(() => import("../pages/app/Dashboard"))
const Properties = lazy(() => import("../pages/app/Properties"))
const PropertyDetail = lazy(() => import("../pages/app/PropertyDetail"))
const ComplianceRadar = lazy(() => import("../pages/app/ComplianceRadar"))
const Documents = lazy(() => import("../pages/app/Documents"))
const Tasks = lazy(() => import("../pages/app/Tasks"))
const Inbox = lazy(() => import("../pages/app/Inbox"))
const Reports = lazy(() => import("../pages/app/Reports"))
const Settings = lazy(() => import("../pages/app/Settings"))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600" />
    </div>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/security" element={<Security />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/compliance/:slug" element={<CityPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/properties" element={<Properties />} />
          <Route path="/app/properties/:id" element={<PropertyDetail />} />
          <Route path="/app/compliance-radar" element={<ComplianceRadar />} />
          <Route path="/app/documents" element={<Documents />} />
          <Route path="/app/tasks" element={<Tasks />} />
          <Route path="/app/inbox" element={<Inbox />} />
          <Route path="/app/reports" element={<Reports />} />
          <Route path="/app/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}