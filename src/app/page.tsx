import dynamic from 'next/dynamic'

const PatientForm = dynamic(() => import('@/components/PatientForm'), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <PatientForm />
    </main>
  )
}