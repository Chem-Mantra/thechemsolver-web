'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function Redirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/labs/organic-mechanism') }, [router])
  return null
}
