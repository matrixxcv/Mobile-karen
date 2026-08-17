import { useEffect } from 'react'
import VpnHero from '@/components/vpn/VpnHero'
import VpnInfo from '@/components/vpn/VpnInfo'
import VpnComparison from '@/components/vpn/VpnComparison'
import VpnConnectionStatus from '@/components/vpn/VpnConnectionStatus'
import VpnSpeedTest from '@/components/vpn/VpnSpeedTest'
import VpnServers from '@/components/vpn/VpnServers'
import VpnSelectorQuiz from '@/components/vpn/VpnSelectorQuiz'
import VpnGuides from '@/components/vpn/VpnGuides'

export default function VpnHome() {
  useEffect(() => {
    document.title = 'مرکز VPN | موبایل کارن'
  }, [])

  return (
    <div className="divide-y divide-line">
      <VpnHero />
      <VpnInfo />
      <VpnSelectorQuiz />
      <VpnComparison />
      <VpnConnectionStatus />
      <VpnSpeedTest />
      <VpnServers />
      <VpnGuides />
    </div>
  )
}
