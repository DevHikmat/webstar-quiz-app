import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { GraduationCap, Layers, LayoutDashboard, UserCog, Users } from "lucide-react";
import { Link } from "react-router-dom";

const AdminSiderItems = [
  { key: "01", label: <Link to="/admin/students?page=1">Students</Link>, icon: <UserCog /> },
  { key: "02", label: <Link to="/admin/teachers">Teachers</Link>, icon: <GraduationCap /> },
  { key: "03", label: <Link to="/admin/groups">Groups</Link>, icon: <Users /> },
  { key: "04", label: <Link to="/admin/exams">Exams</Link>, icon: <Layers /> },
  { key: "05", label: <Link to="/admin/category">Category</Link>, icon: <LayoutDashboard /> },
];

const Sidebar = () => {
  return (
    <Sider>
      <div className="demo-logo-vertical">
        <img src="/public/webstar-logo-2.jpg" alt="webstar logo" />
      </div>
      <Menu mode="inline" defaultSelectedKeys={["01"]} items={AdminSiderItems} />
    </Sider>
  );
};

export default Sidebar;
