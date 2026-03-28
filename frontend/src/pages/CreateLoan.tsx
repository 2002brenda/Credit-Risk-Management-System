import { Form, Input, InputNumber, Button, Select, message } from "antd"
import { createLoan } from "../api/loanApi"
import { useState } from "react"  // ✅ Tambah ini

export default function CreateLoan({ onCreated }: any) {

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      console.log("SEND DATA:", values)
      await createLoan(values)
      message.success("Loan application created successfully!")
      form.resetFields()
      onCreated()
    } catch (err: any) {
      console.error("CREATE ERROR:", err.response || err)
      message.error("Failed to create loan application! Please check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Create Loan Application</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Fill all fields below. Risk assessment will be done automatically by ML model.
      </p>

      <Form 
        form={form}
        layout="vertical" 
        onFinish={onFinish}
      >
        
        <Form.Item
          label="Applicant Name"
          name="applicantName"
          rules={[{ required: true, message: "Please enter applicant name" }]}
        >
          <Input placeholder="Enter applicant name" />
        </Form.Item>

        <Form.Item
          label="Income (IDR)"
          name="income"
          rules={[{ required: true, message: "Please enter income" }]}
        >
          <InputNumber 
            style={{ width: "100%" }} 
            placeholder="e.g., 50000000"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Loan Amount (IDR)"
          name="loanAmount"
          rules={[{ required: true, message: "Please enter loan amount" }]}
        >
          <InputNumber 
            style={{ width: "100%" }} 
            placeholder="e.g., 10000000"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Existing Debt (IDR)"
          name="existingDebt"
          rules={[{ required: true, message: "Please enter existing debt" }]}
        >
          <InputNumber 
            style={{ width: "100%" }} 
            placeholder="e.g., 5000000"
            min={0}
          />
        </Form.Item>

        {/* ML INPUT */}

        <Form.Item
          label="Age (years)"
          name="personAge"
          rules={[{ required: true, message: "Please enter age" }]}
        >
          <InputNumber 
            style={{ width: "100%" }} 
            placeholder="e.g., 25"
            min={18}
            max={100}
          />
        </Form.Item>

        <Form.Item
          label="Home Ownership"
          name="personHomeOwnership"
          rules={[{ required: true, message: "Please select home ownership" }]}
        >
          <Select 
            placeholder="Select home ownership"
            options={[
              { value: "RENT", label: "Rent" },
              { value: "OWN", label: "Own" },
              { value: "MORTGAGE", label: "Mortgage" },
            ]} 
          />
        </Form.Item>

        <Form.Item
          label="Employment Length (years)"
          name="personEmpLength"
          rules={[{ required: true, message: "Please enter employment length" }]}
        >
          <InputNumber 
            style={{ width: "100%" }} 
            placeholder="e.g., 5"
            min={0}
            max={50}
          />
        </Form.Item>

        <Form.Item
          label="Loan Intent"
          name="loanIntent"
          rules={[{ required: true, message: "Please select loan intent" }]}
        >
          <Select 
            placeholder="Select loan purpose"
            options={[
              { value: "PERSONAL", label: "Personal" },
              { value: "EDUCATION", label: "Education" },
              { value: "MEDICAL", label: "Medical" },
            ]} 
          />
        </Form.Item>

        <Form.Item
          label="Loan Grade (Optional - ML will determine if left empty)"
          name="loanGrade"
          tooltip="Leave empty to let ML automatically determine the risk grade"
        >
          <Select 
            placeholder="Auto-determined by ML (optional)"
            allowClear
            options={[
              { value: "A", label: "A - Low Risk" },
              { value: "B", label: "B - Moderate Risk" },
              { value: "C", label: "C - High Risk" },
              { value: "D", label: "D - Very High Risk" },
            ]} 
          />
        </Form.Item>

        <Form.Item
          label="Default History"
          name="cbPersonDefaultOnFile"
          rules={[{ required: true, message: "Please select default history" }]}
          tooltip="Has the applicant ever defaulted on a loan before?"
        >
          <Select 
            placeholder="Select default history"
            options={[
              { value: "N", label: "No - No default history" },
              { value: "Y", label: "Yes - Has default history" },
            ]} 
          />
        </Form.Item>

        <Form.Item
          label="Credit History Length (years)"
          name="cbPersonCredHistLength"
          rules={[{ required: true, message: "Please enter credit history length" }]}
          tooltip="How many years of credit history does the applicant have?"
        >
          <InputNumber 
            style={{ width: "100%" }} 
            placeholder="e.g., 5"
            min={0}
            max={30}
          />
        </Form.Item>

        {/* Info Box */}
        <div style={{ 
          background: "#e6f7ff", 
          padding: "12px 16px", 
          borderRadius: 8, 
          marginBottom: 16,
          border: "1px solid #91d5ff"
        }}>
          <span>🤖 <strong>ML Auto-Assessment:</strong> Risk Score, Risk Grade (A/B/C/D), and Status will be automatically calculated by the ML model.</span>
        </div>

        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          block
        >
          Create Loan Application
        </Button>

      </Form>
    </div>
  )
}