import Image from 'next/image'

export const metadata = { title: "You're offline" }

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6 bg-[#08020d] text-white">
      <Image src="/logo.png" alt="TheChemSolver" width={64} height={64} className="rounded-full opacity-90" />
      <h1 className="text-xl font-bold">You&apos;re offline</h1>
      <p className="text-sm text-gray-400 max-w-xs">
        This page needs a live connection. Reconnect and try again — your progress isn&apos;t lost.
      </p>
    </div>
  )
}
