import { Layout, Menu } from "antd"
import type { ReactNode } from "react"

const { Header, Sider, Content } = Layout

type Props = {
  children: ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      <Sider>
        <div style={{ color: "white", padding: 16, fontSize: 18 }}>
          Credit System
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={[
            { key: "dashboard", label: "Dashboard" },
            { key: "loans", label: "Loans" }
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 20 }}>
          Loan Management Dashboard
        </Header>

        <Content style={{ margin: 20 }}>
          {children}
        </Content>
      </Layout>

    </Layout>
  )
}