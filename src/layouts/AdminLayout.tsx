import React from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
const { Header, Content, Footer } = Layout;

const AdminLayout: React.FC = () => {
  return (
    <Layout hasSider>
      <Sidebar />
      <Layout>
        <Header />
        <Content>
         <div style={{padding: "15px"}}>
         <Outlet />
         </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Webstar ©{new Date().getFullYear()} Created by Hikmatullo</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
