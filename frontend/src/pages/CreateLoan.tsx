import { Form, Input, InputNumber, Button } from "antd"
import { createLoan } from "../api/loanApi"

export default function CreateLoan({ onCreated }: any) {

  const onFinish = async (values: any) => {
    await createLoan(values)
    onCreated()   // refresh table
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Create Loan</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Applicant Name"
          name="applicantName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Income"
          name="income"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Loan Amount"
          name="loanAmount"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Existing Debt"
          name="existingDebt"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Create Loan
        </Button>
      </Form>
    </div>
  )
}