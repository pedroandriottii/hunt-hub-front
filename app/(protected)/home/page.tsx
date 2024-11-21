'use client'
import Tasks from "@/components/Tasks/tasks"
import { CreateTaskButton } from '@/components/Tasks/create-task-button'
import { useEffect, useState } from "react"

export default function Home() {
  const [userRole, setUserRole] = useState('')
  const [userid, setUserid] = useState('')
  useEffect(() => {
    const role = localStorage.getItem('role') || ''
    const userid = localStorage.getItem('userId') || ''
    setUserRole(role)
    setUserid(userid)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        {userRole === 'ROLE_PO' && (
          <CreateTaskButton poid={userid} userRole={userRole} />
        )}
      </div>
      <Tasks />
    </div>
  )
}

