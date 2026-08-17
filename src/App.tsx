import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileCallBar from '@/components/MobileCallBar'
import ScrollToTop from '@/components/ScrollToTop'

const Home = lazy(() => import('@/pages/Home'))
const Products = lazy(() => import('@/pages/Products'))
const ProductDetails = lazy(() => import('@/pages/ProductDetails'))
const Comparison = lazy(() => import('@/pages/Comparison'))
const Repairs = lazy(() => import('@/pages/Repairs'))
const RepairRequest = lazy(() => import('@/pages/RepairRequest'))
const Contact = lazy(() => import('@/pages/Contact'))
const About = lazy(() => import('@/pages/About'))
const VpnHome = lazy(() => import('@/pages/vpn/VpnHome'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Accessories = lazy(() => import('@/pages/Accessories'))
const Auth = lazy(() => import('@/pages/Auth'))
const Admin = lazy(() => import('@/pages/Admin'))
const AdminReports = lazy(() => import('@/pages/AdminReports'))

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-16 text-center text-silver-dim">در حال بارگذاری...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/iphones" element={<Products />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/iphones/:id" element={<ProductDetails />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/repairs" element={<Repairs />} />
            <Route path="/repairs/request" element={<RepairRequest />} />
            <Route path="/vpn" element={<VpnHome />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  )
}
