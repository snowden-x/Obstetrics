'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileEditIcon, Delete02Icon, UserAdd01Icon, FileDownloadIcon, Sorting01Icon, UserIcon } from "hugeicons-react"
import { getPatients, deletePatient, PatientRecord } from '@/lib/db'
import AddEditPatientDialog from '@/components/AddEditPatientDialog'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import PatientDetailsDialog from '@/components/PatientDetailsDialog'
import { SearchAndFilter, FilterOptions } from '@/components/SearchandFilter'
import { Pagination } from '@/components/ui/pagination'
import ExportPDFButton from '@/components/ExportPDFButton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EmptyState from './EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PatientList() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientRecord[]>([]);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState<string>('edd');

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    const loadedPatients = await getPatients();
    setPatients(loadedPatients);
    setFilteredPatients(loadedPatients);
  }

  function handleFilterChange(filters: FilterOptions) {
    const filtered = patients.filter(patient => {
      const nameMatch = patient.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const categoryMatch = filters.category === 'all' || 
        (filters.category === 'pregnant' && patient.ega) || 
        (filters.category === 'post partum' && !patient.ega);
      const ageMatch = patient.age >= filters.ageRange[0] && patient.age <= filters.ageRange[1];
      return nameMatch && categoryMatch && ageMatch;
    });
    setFilteredPatients(filtered);
    setCurrentPage(1);
  }

  function handleSortChange(sortBy: string) {
    setSortOption(sortBy);
    let sortedPatients = [...filteredPatients];
    if (sortBy === 'edd') {
      sortedPatients.sort((a, b) => new Date(a.edd).getTime() - new Date(b.edd).getTime());
    } else if (sortBy === 'name') {
      sortedPatients.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'createdAt') {
      sortedPatients.sort((a, b) => b.createdAt - a.createdAt);
    }
    setFilteredPatients(sortedPatients);
  }

  // Get current patients
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  function handleAddNewPatient() {
    setSelectedPatient(null);
    setIsAddEditDialogOpen(true);
  }

  function handleEditPatient(patient: PatientRecord) {
    setSelectedPatient(patient);
    setIsAddEditDialogOpen(true);
  }

  function handleDeletePatient(patient: PatientRecord) {
    setSelectedPatient(patient);
    setIsDeleteDialogOpen(true);
  }

  function handleViewPatientDetails(patient: PatientRecord) {
    setSelectedPatient(patient);
    setIsDetailsDialogOpen(true);
  }

  async function confirmDeletePatient() {
    if (selectedPatient) {
      await deletePatient(selectedPatient.id);
      loadPatients();
      setIsDeleteDialogOpen(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex justify-between items-center">
          <span>Patient Management</span>
          <Button onClick={handleAddNewPatient} className="bg-primary hover:bg-primary/90">
            <UserAdd01Icon className="mr-2 h-4 w-4" /> Add New Patient
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <SearchAndFilter onFilterChange={handleFilterChange} />
            <div className="flex items-center space-x-2">
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger id="sort" className="w-[180px]">
                  <Sorting01Icon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edd">EDD</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="createdAt">Creation Date</SelectItem>
                </SelectContent>
              </Select>
              <ExportPDFButton patients={filteredPatients} />
            </div>
          </div>
          {filteredPatients.length === 0 ? (
            <EmptyState message="No patients found." />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleViewPatientDetails(patient)}
                          className="text-primary font-medium hover:underline capitalize flex items-center"
                        >
                          <UserIcon className="mr-2 h-4 w-4" />
                          {patient.name}
                        </button>
                      </TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.ega ? 'Pregnant' : 'Post Partum'}</TableCell>
                      <TableCell className='text-right'>
                        <Button variant="ghost" size="sm" onClick={() => handleEditPatient(patient)}>
                          <FileEditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePatient(patient)}>
                          <Delete02Icon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredPatients.length / patientsPerPage)}
            onPageChange={paginate}
          />
        </div>
      </CardContent>
      <AddEditPatientDialog
        isOpen={isAddEditDialogOpen}
        onClose={() => setIsAddEditDialogOpen(false)}
        patient={selectedPatient}
        onSave={loadPatients}
      />
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeletePatient}
      />
      <PatientDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        patient={selectedPatient}
      />
    </Card>
  );
}