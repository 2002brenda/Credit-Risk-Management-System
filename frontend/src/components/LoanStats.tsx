import { Card, Row, Col } from "antd"

interface Props {
  loans: any[]
}

export default function LoanStats({ loans }: any) {

  const total = loans?.length
  const approved = loans.filter((l:any)=>l.status==="Approved").length
  const rejected = loans.filter((l:any)=>l.status==="Rejected").length
  const pending = loans.filter((l:any)=>l.status==="Pending").length


  return (
    <Row gutter={16} style={{ marginBottom: 20 }}>

      <Col span={6}>
        <Card title="Total Loans">
          {total}
        </Card>
      </Col>

      <Col span={6}>
        <Card title="Approved">
          {approved}
        </Card>
      </Col>

      <Col span={6}>
        <Card title="Rejected">
          {rejected}
        </Card>
      </Col>

      <Col span={6}>
        <Card title="Pending">
          {pending}
        </Card>
      </Col>

    </Row>
  )
}