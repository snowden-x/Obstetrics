'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PatientList from '@/components/PatientList'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('patients')

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-1/2 mx-auto flex justify-center lg:p-4 md:p-4 mb-4">
          <TabsTrigger value="patients" className="flex-1 ">Patients</TabsTrigger>
          <TabsTrigger value="reports" className="flex-1">Reports</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="patients">
          <PatientList />
        </TabsContent>
        <TabsContent value="reports">
          <p>Reports content (to be implemented)</p>
        </TabsContent>
        <TabsContent value="settings">
          <p>Settings content (to be implemented)</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}