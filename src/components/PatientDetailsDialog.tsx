'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PatientRecord } from '@/lib/db'
import { Calendar01Icon, ClipboardIcon, Stethoscope02Icon, FilePasteIcon, Brain02Icon, Copy01Icon, Tick02Icon } from 'hugeicons-react'


interface PatientDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  patient: PatientRecord | null
}

export default function PatientDetailsDialog({ isOpen, onClose, patient }: PatientDetailsDialogProps) {
  const [copied, setCopied] = useState(false)
  if (!patient) return null


  const handleCopy = () => {
    const patientData = formatPatientData(patient)
    navigator.clipboard.writeText(patientData).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw] sm:w-full overflow-hidden">
        <DialogHeader className='flex  flex-row justify-between'>
          <DialogTitle className="text-xl lg:text-2xl font-bold capitalize">Patient Details: {patient.name}</DialogTitle>
          <span>
            <button
            onClick={handleCopy}
            className="p-2 border mr-7  w-fit rounded-md flex items-center gap-2 hover:bg-gray-200"
          >
            {copied ? <Tick02Icon className="w-5 h-5" /> : <Copy01Icon className="w-5 h-5" />}

            </button>
          </span>

        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-100px)] pr-4">
          <div className="space-y-6 capitalize">
            <Section title="Personal Information" icon={<Calendar01Icon className="w-5 h-5" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InfoItem label="Age" value={patient.age} />
                <InfoItem label="Gravida" value={patient.g} />
                <InfoItem label="Para" value={patient.p} />
                <InfoItem label="EGA" value={patient.ega} />
                <InfoItem label="EDD" value={patient.edd} />
              </div>
            </Section>

            <Section title="Medical Information" icon={<ClipboardIcon className="w-5 h-5" />}>
              <InfoItem label="Being Managed For" value={patient.beingManagedFor} />
              <InfoItem label="Complaints" value={patient.complaints} />
              <InfoItem label="Updates" value={patient.updates} />
            </Section>

            <Section title="On Direct Questioning (ODQ)" icon={<Stethoscope02Icon className="w-5 h-5" />}>
              {Object.entries(patient.odq).map(([key, value]) => (
                <InfoItem key={key} label={formatLabel(key)} value={value ? "Yes" : "No"} />
              ))}
            </Section>

            <Section title="Systemic Enquiry" icon={<FilePasteIcon className="w-5 h-5" />}>
              <InfoItem label="Details" value={patient.systemicEnquiry} />
            </Section>

            <Section title="Examination" icon={<Stethoscope02Icon className="w-5 h-5" />}>
              <InfoItem label="General" value={patient.examination.general} />
              <InfoItem label="BP" value={patient.examination.vitalSigns.bp} />
              <InfoItem label="CVS" value={patient.examination.cvs} />
              <InfoItem label="RS" value={patient.examination.rs} />
              <InfoItem label="ABD" value={patient.examination.abd} />
              <InfoItem label="Uterus" value={patient.examination.uterus} />
              <InfoItem label="CNS" value={patient.examination.cns} />
            </Section>

            <Section title="Medical Assessment" icon={<Brain02Icon className="w-5 h-5" />}>
              <InfoItem label="Investigations" value={patient.investigations} />
              <InfoItem label="Impression" value={patient.impression} />
              <InfoItem label="Plan" value={patient.plan} />
            </Section>

            <Section title="Record Information" icon={<Calendar01Icon className="w-5 h-5" />}>
              <InfoItem label="Created At" value={new Date(patient.createdAt).toLocaleString()} />
              <InfoItem label="Updated At" value={new Date(patient.updatedAt).toLocaleString()} />
            </Section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
        {icon}
        {title}
      </h3>
      {children}
      <Separator className="my-4" />
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string | number | boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-normal text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value.toString()}</span>
    </div>
  )
}

function formatLabel(key: string): string {
  return key
    .split(/(?=[A-Z])/)
    .join(' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatPatientData(patient: PatientRecord): string {
  const personalInfo = `
  Personal Information:
  ---------------------
  Name: ${patient.name}
  Age: ${patient.age}
  Gravida: ${patient.g}
  Para: ${patient.p}
  EGA: ${patient.ega}
  EDD: ${patient.edd}
  `;

  const medicalInfo = `
  Medical Information:
  --------------------
  Being Managed For: ${patient.beingManagedFor}
  Complaints: ${patient.complaints}
  Updates: ${patient.updates}
  `;

  const odq = `
  On Direct Questioning (ODQ):
  ----------------------------
${Object.entries(patient.odq).map(
    ([key, value]) => `  ${formatLabel(key)}: ${value ? 'Yes' : 'No'}`
  ).join('\n')}
  `;
  

  const examination = `
  Examination:
  ------------
  General: ${patient.examination.general}
  BP: ${patient.examination.vitalSigns.bp}
  CVS: ${patient.examination.cvs}
  RS: ${patient.examination.rs}
  ABD: ${patient.examination.abd}
  Uterus: ${patient.examination.uterus}
  CNS: ${patient.examination.cns}
  `;

  const medicalAssessment = `
  Medical Assessment:
  -------------------
  Investigations: ${patient.investigations}
  Impression: ${patient.impression}
  Plan: ${patient.plan}
  `;

  const recordInfo = `
  Record Information:
  -------------------
  Created At: ${new Date(patient.createdAt).toLocaleString()}
  Updated At: ${new Date(patient.updatedAt).toLocaleString()}
  `;

  return `${personalInfo}\n${medicalInfo}\n${odq}\n${examination}\n${medicalAssessment}\n`;
}