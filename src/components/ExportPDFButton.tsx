import React from 'react';
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { PatientRecord } from '@/lib/db';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ExportPDFButtonProps {
  patients: PatientRecord[];
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ patients }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Patient List as at: " + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), 14, 15);
    const tableColumn = ["Name", "Age", "Category", "EGA", "EDD", "Managed For"];
    const tableRows: (string | number)[][] = [];

    patients.forEach(patient => {
      const patientData = [
        patient.name,
        patient.age,
        patient.ega ? 'Pregnant' : 'Post Partum',
        patient.ega,
        patient.edd,
        patient.beingManagedFor
      ];
      tableRows.push(patientData);
    });

    (doc as unknown as { autoTable: Function }).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Patient_List.pdf");
  };

  return (
    <Button onClick={exportToPDF}>
      <FileDown className="mr-2 h-4 w-4" /> Export to PDF
    </Button>
  );
};

export default ExportPDFButton;