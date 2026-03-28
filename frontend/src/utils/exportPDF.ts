import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const exportToPDF = (data: any[], summary: any) => {
  const doc = new jsPDF({ orientation: "landscape" })
  
  doc.setFontSize(20)
  doc.text("Loan Application Report", 14, 20)
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)
  
  doc.setFontSize(14)
  doc.text("Summary Statistics", 14, 45)
  doc.setFontSize(10)
  doc.text(`Total Loans: ${summary?.total || 0}`, 14, 55)
  doc.text(`Approved: ${summary?.approved || 0}`, 14, 62)
  doc.text(`Rejected: ${summary?.rejected || 0}`, 14, 69)
  doc.text(`Pending: ${summary?.pending || 0}`, 14, 76)
  doc.text(`Average ML Score: ${summary?.avgScore?.toFixed(2) || 0}`, 14, 83)
  
  const tableData = data.map((loan: any) => [
    loan.applicantName || "-",
    loan.personAge || "-",
    `Rp ${(loan.income || 0).toLocaleString()}`,
    `Rp ${(loan.loanAmount || 0).toLocaleString()}`,
    loan.status || "-",
    loan.riskScore || 0,
    loan.riskGrade || "-"
  ])
  
  autoTable(doc, {
    head: [["Applicant", "Age", "Income", "Loan Amount", "Status", "ML Score", "ML Decision"]],
    body: tableData,
    startY: 90,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] }
  })
  
  doc.save(`loan_report_${new Date().toISOString().split("T")[0]}.pdf`)
}