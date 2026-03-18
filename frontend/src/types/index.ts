export interface LoanApplication {
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