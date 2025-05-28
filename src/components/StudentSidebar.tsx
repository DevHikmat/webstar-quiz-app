import { FileText, BookOpen, History, Settings } from "lucide-react";
import Sider from 'antd/es/layout/Sider';
import { useState } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const menuItems = [
    {
      key: "exams",
      icon: <FileText size={18} />,
      label: <Link to="/student/exam">Imtihonlar</Link>,
    },
    {
      key: "homework",
      icon: <BookOpen size={18} />,
      label: <Link to="/student/homework">Uyga vazifalar</Link>,
    },
    {
      key: "history",
      icon: <History size={18} />,
      label: <Link to="/student/history">Tarix</Link>,
    },
    {
      key: "settings",
      icon: <Settings size={18} />,
      label: <Link to="/student/settings">Sozlamalar</Link>,
    },
  ];

const StudentSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        style={{
          backgroundColor: "#f5f5f5",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <div>
          <div
            className="logo"
            style={{
              color: "#333",
              padding: 16,
              textAlign: "center",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            {collapsed ? 'T' : 'Talaba'}
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["exams"]}
            items={menuItems}
          />
        </div>
      </Sider>
  )
}

export default StudentSidebar
