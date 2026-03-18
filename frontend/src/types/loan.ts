// src/types/index.ts
export interface LoanApplication {  // ✅ "LoanApplication" bukan "loanApplication"
  id: string;
  applicantName: string;
  income: number;
  loanAmount: number;
  existingDebt: number;
  termMonths: number;
  creditScore: number;
  status: string;
  createdAt: string;
}

// Tambahkan ini untuk tes:
console.log("Types loaded");  // Sementara, lihat di console browser