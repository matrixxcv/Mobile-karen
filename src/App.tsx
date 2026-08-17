import { Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileCallBar from '@/components/MobileCallBar'
import ScrollToTop from '@/components/ScrollToTop'
import Home from '@/pages/Home'
import Products from '@/pages/Products'
import ProductDetails from '@/pages/ProductDetails'
import Comparison from '@/pages/Comparison'
import Repairs from '@/pages/Repairs'
import RepairRequest from '@/pages/RepairRequest'
import Contact from '@/pages/Contact'
import About from '@/pages/About'
import VpnHome from '@/pages/vpn/VpnHome'
import NotFound from '@/pages/NotFound'
import Accessories from '@/pages/Accessories'
import Auth from '@/pages/Auth'
import Admin from '@/pages/Admin'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/iphones" element={<Products />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/iphones/:id" element={<ProductDetails />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/repairs/request" element={<RepairRequest />} />
          <Route path="/vpn" element={<VpnHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  )
}
