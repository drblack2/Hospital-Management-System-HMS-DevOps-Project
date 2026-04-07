import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePatientReport = (patient) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text('Patient Medical Report', 14, 22);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  doc.setTextColor(0);

  // Patient Information Section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Patient Information', 14, 40);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  const patientInfo = [
    ['Name:', patient.firstName + ' ' + patient.lastName],
    ['Email:', patient.email],
    ['Phone:', patient.phone],
    ['Date of Birth:', patient.dateOfBirth],
    ['Gender:', patient.gender],
    ['Address:', patient.address],
  ];

  let yPosition = 47;
  patientInfo.forEach(([label, value]) => {
    doc.text(label, 14, yPosition);
    doc.text(value, 60, yPosition);
    yPosition += 7;
  });

  // Medical History Section
  yPosition += 5;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Medical History', 14, yPosition);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  yPosition += 7;
  const medicalHistoryText = patient.medicalHistory || 'No medical history recorded';
  const wrappedMedicalHistory = doc.splitTextToSize(medicalHistoryText, 180);
  doc.text(wrappedMedicalHistory, 14, yPosition);

  // Allergies Section
  yPosition += wrappedMedicalHistory.length * 5 + 5;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Allergies', 14, yPosition);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  yPosition += 7;
  const allergiesText = patient.allergies || 'No known allergies';
  const wrappedAllergies = doc.splitTextToSize(allergiesText, 180);
  doc.text(wrappedAllergies, 14, yPosition);

  // Current Medications Section
  yPosition += wrappedAllergies.length * 5 + 5;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Current Medications', 14, yPosition);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  yPosition += 7;
  const medicationsText = patient.currentMedications || 'No medications recorded';
  const wrappedMedications = doc.splitTextToSize(medicationsText, 180);
  doc.text(wrappedMedications, 14, yPosition);

  // Emergency Contact Section
  yPosition += wrappedMedications.length * 5 + 5;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Emergency Contact', 14, yPosition);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  yPosition += 7;
  const emergencyText = patient.emergencyContact || 'No emergency contact recorded';
  const wrappedEmergency = doc.splitTextToSize(emergencyText, 180);
  doc.text(wrappedEmergency, 14, yPosition);

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save(`Patient_Report_${patient.firstName}_${patient.lastName}.pdf`);
};

export const generateBillingInvoice = (invoice) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('INVOICE', 14, 22);

  // Invoice number and date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Invoice No: ${invoice.id}`, 14, 35);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);
  doc.text(`Due Date: ${invoice.dueDate || new Date().toLocaleDateString()}`, 14, 49);

  // Patient details
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Bill To:', 14, 60);

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(invoice.patientName, 14, 67);
  doc.text(invoice.patientEmail, 14, 74);
  doc.text(invoice.patientPhone, 14, 81);

  // Table data
  const tableData = invoice.items.map((item) => [
    item.description,
    item.quantity,
    `₹${item.unitPrice}`,
    `₹${item.total}`,
  ]);

  // Add totals
  tableData.push(['', '', 'Subtotal:', `₹${invoice.subtotal}`]);
  tableData.push(['', '', 'Tax (18%):', `₹${invoice.tax}`]);
  tableData.push(['', '', 'Total:', `₹${invoice.total}`]);

  autoTable(doc, {
    startY: 95,
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
  });

  // Notes
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Notes:', 14, doc.lastAutoTable.finalY + 20);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  const notesText = invoice.notes || 'Thank you for your business!';
  const wrappedNotes = doc.splitTextToSize(notesText, 180);
  doc.text(wrappedNotes, 14, doc.lastAutoTable.finalY + 27);

  // Save the PDF
  doc.save(`Invoice_${invoice.id}.pdf`);
};
