'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { addPatient, updatePatient, PatientRecord } from '@/lib/db'
import { ScrollArea } from './ui/scroll-area'
import { Card, CardHeader, CardContent, CardTitle } from './ui/card'

interface AddEditPatientDialogProps {
    isOpen: boolean
    onClose: () => void
    patient: PatientRecord | null
    onSave: () => void
}

export default function AddEditPatientDialog({ isOpen, onClose, patient, onSave }: AddEditPatientDialogProps) {
    const [currentPatient, setCurrentPatient] = useState<PatientRecord>({
        id: '',
        name: '',
        age: 0,
        g: 0,
        p: 0,
        ega: '',
        edd: '',
        beingManagedFor: '',
        complaints: '',
        updates: '',
        odq: {
            fetalMovements: false,
            lossOfLiquor: false,
            lowerAbdominalPain: false,
            bleedingPerVaginum: false,
            fever: false,
            nausea: false,
            vomiting: false,
            dysuria: false,
            frequency: false,
            chills: false,
            headache: false,
            blurredVision: false,
            dizziness: false,
            easyFatiguability: false,
            chestPain: false,
            palpitations: false,
            bipedalSwelling: false
        },
        systemicEnquiry: '',
        examination: {
            general: '',
            vitalSigns: {
                bp: ''
            },
            cvs: '',
            rs: '',
            abd: '',
            uterus: '',
            cns: ''
        },
        investigations: '',
        impression: '',
        plan: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
    })

    const [bpSys, setBpSys] = useState('')
    const [bpDia, setBpDia] = useState('')
    const [egaWeeks, setEgaWeeks] = useState('')
    const [egaDays, setEgaDays] = useState('')

    const bpDiaRef = useRef<HTMLInputElement>(null)
    const egaDaysRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (patient) {
            setCurrentPatient(patient)
            const [sys, dia] = patient.examination.vitalSigns.bp.split('/') || ['', '']
            setBpSys(sys)
            setBpDia(dia)
            const [weeks, days] = patient.ega.split('+').map(part => part.trim().split(' ')[0])
            setEgaWeeks(weeks || '')
            setEgaDays(days || '')
        } else {
            setCurrentPatient({
                id: '',
                name: '',
                age: 0,
                g: 0,
                p: 0,
                ega: '',
                edd: '',
                beingManagedFor: '',
                complaints: '',
                updates: '',
                odq: {
                    fetalMovements: false,
                    lossOfLiquor: false,
                    lowerAbdominalPain: false,
                    bleedingPerVaginum: false,
                    fever: false,
                    nausea: false,
                    vomiting: false,
                    dysuria: false,
                    frequency: false,
                    chills: false,
                    headache: false,
                    blurredVision: false,
                    dizziness: false,
                    easyFatiguability: false,
                    chestPain: false,
                    palpitations: false,
                    bipedalSwelling: false
                },
                systemicEnquiry: '',
                examination: {
                    general: '',
                    vitalSigns: {
                        bp: ''
                    },
                    cvs: '',
                    rs: '',
                    abd: '',
                    uterus: '',
                    cns: ''
                },
                investigations: '',
                impression: '',
                plan: '',
                createdAt: Date.now(),
                updatedAt: Date.now()
            })
            setBpSys('')
            setBpDia('')
            setEgaWeeks('')
            setEgaDays('')
        }
    }, [patient])

    useEffect(() => {
        const bp = `${bpSys}/${bpDia}`.replace(/^\/|\/$/, '')
        setCurrentPatient(prev => ({
            ...prev,
            examination: {
                ...prev.examination,
                vitalSigns: {
                    ...prev.examination.vitalSigns,
                    bp
                }
            }
        }))
    }, [bpSys, bpDia])

    useEffect(() => {
        const ega = `${egaWeeks} weeks${egaDays ? ' + ' + egaDays + ' days' : ''}`
        setCurrentPatient(prev => ({ ...prev, ega }))
    }, [egaWeeks, egaDays])

    function handleBPSysChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3)
        setBpSys(value)
        if (value.length === 3) {
            bpDiaRef.current?.focus()
        }
    }

    function handleBPDiaChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3)
        setBpDia(value)
    }

    function handleEGAWeeksChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(/\D/g, '').slice(0, 2)
        setEgaWeeks(value)
        if (value.length === 2) {
            egaDaysRef.current?.focus()
        }
    }

    function handleEGADaysChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(/\D/g, '').slice(0, 2)
        setEgaDays(value)
    }



    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const now = Date.now()
        if (currentPatient.id) {
            await updatePatient({ ...currentPatient, updatedAt: now })
        } else {
            await addPatient({ ...currentPatient, id: now.toString(), createdAt: now, updatedAt: now })
        }
        onSave()
        onClose()
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setCurrentPatient(prev => ({ ...prev, [name]: name === 'age' || name === 'g' || name === 'p' ? parseInt(value) || 0 : value }))
    }

    function handleODQChange(name: keyof PatientRecord['odq']) {
        setCurrentPatient(prev => ({
            ...prev,
            odq: { ...prev.odq, [name]: !prev.odq[name] }
        }))
    }

    function handleExaminationChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        if (name === 'bp') {
            setCurrentPatient(prev => ({
                ...prev,
                examination: {
                    ...prev.examination,
                    vitalSigns: { ...prev.examination.vitalSigns, bp: value }
                }
            }))
        } else {
            setCurrentPatient(prev => ({
                ...prev,
                examination: { ...prev.examination, [name]: value }
            }))
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className='border-b border-black/50 pb-2'>{currentPatient.id ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[calc(90vh-100px)] pr-4">
                    <form onSubmit={handleSubmit} className="space-y-4 mx-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" className="capitalize" value={currentPatient.name} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" name="age" type="number" value={currentPatient.age} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="g">Gravida</Label>
                                <Input id="g" name="g" type="number" value={currentPatient.g} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="p">Para</Label>
                                <Input id="p" name="p" type="number" value={currentPatient.p} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="ega">EGA</Label>
                                <div className="flex items-center justify-around border rounded-md focus:border-red-500 space-x-2">
                                    <Input
                                        id="egaWeeks"
                                        value={egaWeeks}
                                        onChange={handleEGAWeeksChange}
                                        placeholder="Weeks"
                                        className="w-20 border-transparent shadow-none input-transparent"
                                        
                                    />
                                    <span className='text-muted-foreground'>+</span>
                                    <Input
                                        id="egaDays"
                                        ref={egaDaysRef}
                                        value={egaDays}
                                        onChange={handleEGADaysChange}
                                        placeholder="Days"
                                        className="w-20 border-transparent shadow-none input-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="edd">EDD</Label>
                                <Input
                                    id="edd"
                                    name="edd"
                                    type="date"
                                    value={currentPatient.edd}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="beingManagedFor">Being Managed For</Label>
                            <Input id="beingManagedFor" name="beingManagedFor" className="capitalize" value={currentPatient.beingManagedFor} onChange={handleInputChange} />
                        </div>

                        <div>
                            <Label htmlFor="complaints">Complaints</Label>
                            <Textarea id="complaints" name="complaints" className="capitalize" value={currentPatient.complaints} onChange={handleInputChange} />
                        </div>

                        <div>
                            <Label htmlFor="updates">Updates</Label>
                            <Textarea id="updates" name="updates" className="capitalize" value={currentPatient.updates} onChange={handleInputChange} />
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>On Direct Questioning (ODQ)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(Object.keys(currentPatient.odq) as Array<keyof PatientRecord['odq']>).map((key) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={key}
                                                    checked={currentPatient.odq[key]}
                                                    onCheckedChange={() => handleODQChange(key)}
                                                />
                                                <Label className="text-sm capitalize" htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                                            </div>
                                        ))}
                                    </div>

                                </CardContent>
                            </Card>


                        </div>

                        <div>
                            <Label htmlFor="systemicEnquiry">Systemic Enquiry</Label>
                            <Textarea id="systemicEnquiry" className="capitalize" name="systemicEnquiry" value={currentPatient.systemicEnquiry} onChange={handleInputChange} />
                        </div>

                        <div>
                            <Label>On Examination</Label>
                            <div className="space-y-2">
                                <Input name="general" placeholder="General" className="capitalize" value={currentPatient.examination.general} onChange={handleExaminationChange} />
                                <div className='flex justify-around border rounded-md'>
                                    <Input
                                        id="bpSys"
                                        value={bpSys}
                                        onChange={handleBPSysChange}
                                        placeholder="SYS"
                                        className="w-20 border-transparent shadow-none input-transparent"
                                    />
                                    <span className='my-auto h-auto text-xl'>/</span>
                                    <Input
                                        id="bpDia"
                                        ref={bpDiaRef}
                                        value={bpDia}
                                        onChange={handleBPDiaChange}
                                        placeholder="DIA"
                                        className="w-20 border-transparent shadow-none input-transparent"
                                    />

                                </div>

                                <Input name="cvs" placeholder="CVS" className="capitalize" value={currentPatient.examination.cvs} onChange={handleExaminationChange} />
                                <Input name="rs" placeholder="RS" className="capitalize" value={currentPatient.examination.rs} onChange={handleExaminationChange} />
                                <Input name="abd" placeholder="ABD" className="capitalize" value={currentPatient.examination.abd} onChange={handleExaminationChange} />
                                <Input name="uterus" placeholder="Uterus" className="capitalize" value={currentPatient.examination.uterus} onChange={handleExaminationChange} />
                                <Input name="cns" placeholder="CNS" className="capitalize" value={currentPatient.examination.cns} onChange={handleExaminationChange} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="investigations">Investigations</Label>
                            <Textarea id="investigations" name="investigations" className="capitalize" value={currentPatient.investigations} onChange={handleInputChange} />
                        </div>

                        <div>
                            <Label htmlFor="impression">Impression</Label>
                            <Textarea id="impression" name="impression" className="capitalize" value={currentPatient.impression} onChange={handleInputChange} />
                        </div>

                        <div>
                            <Label htmlFor="plan">Plan</Label>
                            <Textarea id="plan" name="plan" className="capitalize" value={currentPatient.plan} onChange={handleInputChange} />
                        </div>
                        <Button type="submit" className="w-full sm:w-auto">{currentPatient.id ? 'Update Patient Data' : 'Save Patient Data'}</Button>
                    </form>

                </ScrollArea>

            </DialogContent>
        </Dialog>
    )
}