import StudentSidebar from "@/components/StudentSidebar";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
const { Content } = Layout;

const StudentLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StudentSidebar />
      <Layout>
        <Content
          style={{
            margin: "16px",
            background: "#ffffff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;
