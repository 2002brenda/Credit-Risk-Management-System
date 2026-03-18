import { Card } from "antd"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

interface Props {
  loans: any[]
}

export default function LoanChart({ loans }: Props) {

  const approved = loans.filter(l => l.status === "Approved").length
  const rejected = loans.filter(l => l.status === "Rejected").length
  const pending = loans.filter(l => l.status === "Pending").length

  const data = [
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
    { name: "Pending", value: pending }
  ]

  const COLORS = ["#52c41a", "#ff4d4f", "#faad14"]

  return (
    <Card title="Loan Status Chart" style={{ marginBottom: 20 }}>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />

      </PieChart>

    </Card>
  )
}