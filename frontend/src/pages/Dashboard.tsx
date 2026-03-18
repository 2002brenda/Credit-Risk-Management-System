import { Table, Button, Input } from "antd"
import { useLoans } from "../hooks/useLoans"
import { evaluateLoan } from "../api/loanApi"
import { useState } from "react"
import CreateLoan from "./CreateLoan"
import AppLayout from "../components/AppLayout"

export default function Dashboard() {

  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")

  const { data, isLoading, refetch } = useLoans()
  console.log("DATA FROM API", data)
  console.log("IS LOADING", isLoading)
  console.log("FINAL DATA", data)
  
  // filter search
  const filteredData =
    (data || [])?.filter((loan: any) =>
      loan.applicantName
        .toLowerCase()
        .includes(search.toLowerCase())
    ) || []

  // evaluate loan
  const handleEvaluate = async (id: string) => {
    await evaluateLoan(id)
    await refetch()
  }

  // setelah create loan
  const handleCreated = async () => {
    console.log("Loan REFETCH TRIGGERED")
    await refetch()
    setShowForm(false)
  }

  const columns = [
    {
      title: "Applicant",
      dataIndex: "applicantName"
    },
    {
      title: "Income",
      dataIndex: "income"
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount"
    },
    {
      title: "Status",
      dataIndex: "status"
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          onClick={() => handleEvaluate(record.id)}
        >
          Evaluate
        </Button>
      )
    }
  ]

  return (
    <AppLayout>

      <h1>Loan Dashboard</h1>


      {/* Search */}
      <Input
        placeholder="Search by applicant name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />

      {/* Create button */}
      <Button
        type="primary"
        style={{ marginBottom: 20, marginLeft: 10 }}
        onClick={() => setShowForm(!showForm)}
      >
        Create Loan
      </Button>

      {/* Form */}
      {showForm && <CreateLoan onCreated={handleCreated} />}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
        rowKey="id"
      />

    </AppLayout>
  )
}