import { Table, Button, Input, Card, Row, Col, Space, Select, Tag, Badge, Avatar, Tooltip, Dropdown, message, Drawer, Descriptions } from "antd"
import { 
  DollarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  BankOutlined,
  PieChartOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  FilePdfOutlined
} from "@ant-design/icons"
import { AreaChart, Area, Scatter, ScatterChart, Tooltip as ReTooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { useLoans } from "../hooks/useLoans"
import { evaluateLoan, updateStatus, deleteLoan } from "../api/loanApi"
import { useState } from "react"
import { useSummary } from "../hooks/useSummary"
import CreateLoan from "./CreateLoan"
import { useRanking } from "../hooks/useRanking"
import { exportToPDF } from "../utils/exportPDF"

export default function Dashboard() {

  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState<any>(null)

  const { data, isLoading, refetch } = useLoans()
  const { data: summary, refetch: refetchSummary } = useSummary()
  const { data: rankingData, isLoading: isRankingLoading } = useRanking()

  // Filter data
  const filteredData = (data || [])?.filter((loan: any) => {
    const matchSearch = loan.applicantName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "All" ? true : loan.status === filterStatus
    return matchSearch && matchStatus
  }) || []

  // Chart Data
  const statusChartData = [
    { name: "Approved", value: summary?.approved ?? 0, color: "#10b981" },
    { name: "Rejected", value: summary?.rejected ?? 0, color: "#ef4444" },
    { name: "Pending", value: summary?.pending ?? 0, color: "#f59e0b" }
  ]

  const gradeChartData = () => {
    if (!data) return []
    const grades = { A: 0, B: 0, C: 0, D: 0 }
    data.forEach((loan: any) => {
      if (loan.riskGrade) grades[loan.riskGrade as keyof typeof grades]++
    })
    return [
      { grade: "A", count: grades.A, color: "#10b981", label: "Low Risk" },
      { grade: "B", count: grades.B, color: "#3b82f6", label: "Moderate" },
      { grade: "C", count: grades.C, color: "#f59e0b", label: "High Risk" },
      { grade: "D", count: grades.D, color: "#ef4444", label: "Very High" }
    ]
  }

  // Trend Chart Data
  const trendChartData = () => {
    if (!data) return []
    const monthlyData: { [key: string]: number } = {}
    data.forEach((loan: any) => {
      if (loan.createdAt) {
        const date = new Date(loan.createdAt)
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1
      }
    })
    return Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
  }

  // Risk Score Distribution
  const riskScoreDistribution = () => {
    if (!data) return []
    const ranges = [
      { range: "0-20", min: 0, max: 20, count: 0 },
      { range: "21-40", min: 21, max: 40, count: 0 },
      { range: "41-60", min: 41, max: 60, count: 0 },
      { range: "61-80", min: 61, max: 80, count: 0 },
      { range: "81-100", min: 81, max: 100, count: 0 }
    ]
    data.forEach((loan: any) => {
      const score = loan.riskScore || 0
      const range = ranges.find(r => score >= r.min && score <= r.max)
      if (range) range.count++
    })
    return ranges
  }

  // Scatter Data
  const scatterData = () => {
    if (!data) return []
    return data.map((loan: any) => ({
      income: loan.income,
      loanAmount: loan.loanAmount,
      status: loan.status,
      name: loan.applicantName
    }))
  }

  // Handlers
  const handleEvaluate = async (id: string) => {
    await evaluateLoan(id)
    await refetch()
    await refetchSummary()
    message.success("Loan evaluated successfully")
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateStatus(id, newStatus)
      await refetch()
      await refetchSummary()
      message.success(`Status updated to ${newStatus}`)
    } catch (error) {
      message.error("Failed to update status")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteLoan(id)
      await refetch()
      await refetchSummary()
      message.success("Loan deleted successfully")
    } catch (error) {
      message.error("Failed to delete loan")
    }
  }

  const showDetailDrawer = (loan: any) => {
    setSelectedLoan(loan)
    setDrawerVisible(true)
  }

  const exportPDF = () => {
    if (!data || data.length === 0) {
      message.warning("No data to export")
      return
    }
    exportToPDF(data, summary)
    message.success("PDF exported successfully")
  }

  const exportCSV = () => {
    if (!data || data.length === 0) {
      message.warning("No data to export")
      return
    }

    const headers = ["Applicant", "Age", "Income", "Loan Amount", "Existing Debt", "Home Ownership", "Employment Length", "Loan Intent", "Loan Grade", "Default History", "Credit History", "Status", "ML Score", "ML Decision"]
    const rows = data.map((loan: any) => [
      loan.applicantName,
      loan.personAge,
      loan.income,
      loan.loanAmount,
      loan.existingDebt,
      loan.personHomeOwnership,
      loan.personEmpLength,
      loan.loanIntent,
      loan.loanGrade,
      loan.cbPersonDefaultOnFile === "Y" ? "Yes" : "No",
      loan.cbPersonCredHistLength,
      loan.status,
      loan.riskScore,
      loan.riskGrade
    ])

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `loans_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    message.success("CSV exported successfully")
  }

  const handleCreated = async () => {
    await refetch()
    await refetchSummary()
    setShowForm(false)
    message.success("Loan created successfully")
  }

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "Approved": return { icon: <CheckCircleOutlined />, color: "#10b981", bg: "#d1fae5" }
      case "Rejected": return { icon: <CloseCircleOutlined />, color: "#ef4444", bg: "#fee2e2" }
      default: return { icon: <ClockCircleOutlined />, color: "#f59e0b", bg: "#fed7aa" }
    }
  }

  // Columns
  const columns = [
    {
      title: "Applicant",
      dataIndex: "applicantName",
      render: (name: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#3b82f6" }} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
      sorter: (a: any, b: any) => a.applicantName?.localeCompare(b.applicantName),
    },
    {
      title: "Age",
      dataIndex: "personAge",
      render: (value: number) => <span>{value || "-"}</span>,
      sorter: (a: any, b: any) => (a.personAge || 0) - (b.personAge || 0),
      width: 70,
    },
    {
      title: "Income",
      dataIndex: "income",
      render: (value: number) => (
        <span style={{ fontWeight: 500, color: "#1f2937" }}>
          Rp {(value || 0).toLocaleString()}
        </span>
      ),
      sorter: (a: any, b: any) => (a.income || 0) - (b.income || 0),
    },
    {
      title: "Loan Amount",
      dataIndex: "loanAmount",
      render: (value: number) => (
        <span style={{ fontWeight: 500, color: "#1f2937" }}>
          Rp {(value || 0).toLocaleString()}
        </span>
      ),
      sorter: (a: any, b: any) => (a.loanAmount || 0) - (b.loanAmount || 0),
    },
    {
      title: "ML Score",
      dataIndex: "riskScore",
      render: (value: number) => (
        <span style={{ fontWeight: "bold" }}>{value || 0}</span>
      )
    },
    {
      title: "ML Decision",
      dataIndex: "riskGrade",
      render: (grade: string) => {
        const config: any = {
          A: { label: "Low Risk", color: "green", icon: "✅" },
          B: { label: "Medium Risk", color: "blue", icon: "⚠️" },
          C: { label: "High Risk", color: "orange", icon: "⚠️" },
          D: { label: "Very High Risk", color: "red", icon: "❌" }
        }
        const item = config[grade] || { label: grade || "-", color: "default", icon: "" }
        return <Tag color={item.color}>{item.icon} {item.label}</Tag>
      }
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="text" icon={<InfoCircleOutlined />} onClick={() => showDetailDrawer(record)} style={{ color: "#3b82f6" }} />
          </Tooltip>
          <Tooltip title="Evaluate">
            <Button type="text" icon={<EyeOutlined />} onClick={() => handleEvaluate(record.id)} style={{ color: "#10b981" }} />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                { key: "Pending", label: "Set Pending" },
                { key: "Approved", label: "Set Approved" },
                { key: "Rejected", label: "Set Rejected" },
                { type: "divider" },
                { key: "delete", label: "Delete", danger: true, icon: <DeleteOutlined /> }
              ],
              onClick: ({ key }) => {
                if (key === "delete") handleDelete(record.id)
                else handleUpdateStatus(record.id, key)
              }
            }}
          >
            <Button type="text" icon={<EditOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ]

  const top5Ranking = rankingData?.slice(0, 5) || []

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ padding: "24px 32px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#111827" }}>
            Loan Dashboard
          </h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: 16 }}>
            Monitor and manage loan applications with AI-powered risk assessment
          </p>
        </div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} bodyStyle={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>Total Loans</p>
                  <p style={{ fontSize: 32, fontWeight: 700, margin: "8px 0 0 0", color: "#111827" }}>{summary?.total ?? 0}</p>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BankOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} bodyStyle={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>Approved</p>
                  <p style={{ fontSize: 32, fontWeight: 700, margin: "8px 0 0 0", color: "#10b981" }}>{summary?.approved ?? 0}</p>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} bodyStyle={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>Rejected</p>
                  <p style={{ fontSize: 32, fontWeight: 700, margin: "8px 0 0 0", color: "#ef4444" }}>{summary?.rejected ?? 0}</p>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CloseCircleOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} bodyStyle={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>Pending</p>
                  <p style={{ fontSize: 32, fontWeight: 700, margin: "8px 0 0 0", color: "#f59e0b" }}>{summary?.pending ?? 0}</p>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ClockCircleOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} lg={12}>
            <Card title={<span><PieChartOutlined style={{ marginRight: 8 }} /> Loan Status Distribution</span>} style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                    {statusChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title={<span><BarChartOutlined style={{ marginRight: 8 }} /> ML Decision Distribution</span>} style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={gradeChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {gradeChartData().map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Trend Chart */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} lg={24}>
            <Card title={<span>📈 Loan Application Trend</span>} style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ReTooltip />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Risk Score Distribution & Scatter Plot */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} lg={12}>
            <Card title={<span>📊 Risk Score Distribution</span>} style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskScoreDistribution()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {riskScoreDistribution().map((entry, index) => {
                      const colors = ["#ef4444", "#f59e0b", "#f59e0b", "#3b82f6", "#10b981"]
                      return <Cell key={`cell-${index}`} fill={colors[index]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title={<span>🎯 Income vs Loan Amount</span>} style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="income" name="Income" unit=" IDR" />
                  <YAxis dataKey="loanAmount" name="Loan Amount" unit=" IDR" />
                  <ReTooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={scatterData()} fill="#8884d8">
                    {scatterData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.status === "Approved" ? "#10b981" : entry.status === "Rejected" ? "#ef4444" : "#f59e0b"} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Top 5 Risky Loans */}
        <Card title={<span style={{ fontWeight: 600 }}>⚠️ Top 5 Risky Loans</span>} style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: 32 }}>
          <Table
            dataSource={top5Ranking}
            loading={isRankingLoading}
            rowKey="id"
            pagination={false}
            size="middle"
            columns={[
              { title: "Rank", key: "rank", width: 80, render: (_: any, __: any, index: number) => (<div style={{ width: 32, height: 32, borderRadius: "50%", background: index === 0 ? "#f59e0b" : index === 1 ? "#9ca3af" : "#d1d5db", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white" }}>{index + 1}</div>) },
              { title: "Applicant", dataIndex: "applicantName", render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span> },
              { title: "Loan Amount", dataIndex: "loanAmount", render: (value: number) => `Rp ${(value || 0).toLocaleString()}` },
              { title: "ML Score", dataIndex: "riskScore", render: (value: number) => (<span style={{ fontWeight: "bold", color: value >= 80 ? "#ef4444" : "#f59e0b" }}>{value || 0}</span>) },
              { title: "ML Decision", dataIndex: "riskGrade", render: (grade: string) => { 
                const color = grade === "D" ? "red" : grade === "C" ? "orange" : grade === "B" ? "blue" : "green"
                const icon = grade === "A" ? "✅" : grade === "B" ? "⚠️" : grade === "C" ? "⚠️" : "❌"
                return <Tag color={color}>{icon} {grade}</Tag> 
              } }
            ]}
          />
        </Card>

        {/* Actions Bar */}
        <Card style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={7}>
              <Input placeholder="Search by applicant name" prefix={<SearchOutlined style={{ color: "#9ca3af" }} />} value={search} onChange={(e) => setSearch(e.target.value)} allowClear style={{ borderRadius: 12 }} />
            </Col>
            <Col xs={24} md={7}>
              <Select style={{ width: "100%", borderRadius: 12 }} value={filterStatus} onChange={setFilterStatus} suffixIcon={<FilterOutlined />}>
                <Select.Option value="All">All Status</Select.Option>
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
              </Select>
            </Col>
            <Col xs={24} md={10}>
              <Space style={{ float: "right" }}>
                <Button icon={<ReloadOutlined />} onClick={() => refetch()} style={{ borderRadius: 12 }}>Refresh</Button>
                <Button icon={<DownloadOutlined />} onClick={exportCSV} style={{ borderRadius: 12 }}>CSV</Button>
                <Button icon={<FilePdfOutlined />} onClick={exportPDF} style={{ borderRadius: 12 }}>PDF</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowForm(!showForm)} style={{ borderRadius: 12, background: "#3b82f6" }}>Create Loan</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Create Form */}
        {showForm && (
          <Card style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: 24 }}>
            <CreateLoan onCreated={handleCreated} />
          </Card>
        )}

        {/* All Loans Table */}
        <Card title={<span style={{ fontWeight: 600 }}>📋 All Loan Applications</span>} style={{ borderRadius: 16, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={isLoading}
            rowKey="id"
            pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `Total ${total} loans`, pageSizeOptions: [8, 16, 24, 48] }}
            scroll={{ x: 1000 }}
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys, selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT] }}
          />
        </Card>

        {/* Footer Legend */}
        <div style={{ marginTop: 24, textAlign: "center", padding: "16px 0", background: "#f3f4f6", borderRadius: 12 }}>
          <Space split={<span>•</span>}>
            <span>🤖 ML Prediction Results:</span>
            <span>✅ Low Risk (ML Score ≥ 80)</span>
            <span>⚠️ Medium Risk (60-79)</span>
            <span>⚠️ High Risk (40-59)</span>
            <span>❌ Very High Risk ({"<"} 40)</span>
          </Space>
        </div>
      </div>

      {/* Detail Drawer */}
      <Drawer
        title={
          <Space>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#3b82f6" }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>{selectedLoan?.applicantName}</span>
          </Space>
        }
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedLoan && (
          <div>
            <Card title="Personal Information" size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label={<Space><UserOutlined /> Full Name</Space>}>{selectedLoan.applicantName}</Descriptions.Item>
                <Descriptions.Item label={<Space><CalendarOutlined /> Age</Space>}>{selectedLoan.personAge} years</Descriptions.Item>
                <Descriptions.Item label={<Space><BankOutlined /> Income</Space>}>Rp {selectedLoan.income?.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label={<Space><DollarOutlined /> Loan Amount</Space>}>Rp {selectedLoan.loanAmount?.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Existing Debt">Rp {selectedLoan.existingDebt?.toLocaleString()}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Employment & Credit Information" size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Home Ownership">{selectedLoan.personHomeOwnership}</Descriptions.Item>
                <Descriptions.Item label="Employment Length">{selectedLoan.personEmpLength} years</Descriptions.Item>
                <Descriptions.Item label="Loan Intent">{selectedLoan.loanIntent}</Descriptions.Item>
                <Descriptions.Item label="Loan Grade (Input)">{selectedLoan.loanGrade || "-"}</Descriptions.Item>
                <Descriptions.Item label="Default History">{selectedLoan.cbPersonDefaultOnFile === "Y" ? "Yes - Has default history" : "No - Clean record"}</Descriptions.Item>
                <Descriptions.Item label="Credit History Length">{selectedLoan.cbPersonCredHistLength} years</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="🤖 ML Prediction Result" size="small" style={{ marginBottom: 16, borderRadius: 12 }}>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Status">
                  <Tag color={selectedLoan.status === "Approved" ? "green" : selectedLoan.status === "Rejected" ? "red" : "orange"}>{selectedLoan.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="ML Score">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 50, height: 50, borderRadius: "50%", background: selectedLoan.riskScore >= 80 ? "#10b98115" : selectedLoan.riskScore >= 60 ? "#3b82f615" : selectedLoan.riskScore >= 40 ? "#f59e0b15" : "#ef444415", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontWeight: "bold", fontSize: 18, color: selectedLoan.riskScore >= 80 ? "#10b981" : selectedLoan.riskScore >= 60 ? "#3b82f6" : selectedLoan.riskScore >= 40 ? "#f59e0b" : "#ef4444" }}>{selectedLoan.riskScore || 0}</span>
                    </div>
                    <span>/ 100</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="ML Decision">
                  <Tag color={selectedLoan.riskGrade === "A" ? "green" : selectedLoan.riskGrade === "B" ? "blue" : selectedLoan.riskGrade === "C" ? "orange" : "red"} style={{ fontSize: 16, padding: "4px 12px" }}>
                    {selectedLoan.riskGrade === "A" ? "✅ Low Risk" : selectedLoan.riskGrade === "B" ? "⚠️ Medium Risk" : selectedLoan.riskGrade === "C" ? "⚠️ High Risk" : "❌ Very High Risk"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Created At">{new Date(selectedLoan.createdAt).toLocaleString()}</Descriptions.Item>
              </Descriptions>
            </Card>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Button type="primary" icon={<EyeOutlined />} onClick={() => handleEvaluate(selectedLoan.id)} block>Evaluate Now</Button>
              <Button danger icon={<DeleteOutlined />} onClick={() => { handleDelete(selectedLoan.id); setDrawerVisible(false); }} block>Delete Loan</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}