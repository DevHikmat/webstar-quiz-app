import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
const { Header, Content, Footer } = Layout;

const AdminLayout: React.FC = () => {
  return (
    <Layout hasSider>
      <AdminSidebar />
      <Layout>
        <Header />
        <Content>
          <div style={{ padding: "15px" }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Webstar ©{new Date().getFullYear()} Created by Hikmatullo
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
