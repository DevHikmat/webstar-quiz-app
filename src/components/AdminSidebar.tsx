import useLogout from "@/hooks/useLogout";
import { Button, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  UserCog,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminSiderItems = [
  {
    key: "01",
    label: <Link to="/admin/students?page=1">Students</Link>,
    icon: <UserCog />,
  },
  {
    key: "02",
    label: <Link to="/admin/teachers">Teachers</Link>,
    icon: <GraduationCap />,
  },
  { key: "03", label: <Link to="/admin/groups">Groups</Link>, icon: <Users /> },
  { key: "04", label: <Link to="/admin/exams">Exams</Link>, icon: <Layers /> },
  {
    key: "05",
    label: <Link to="/admin/category">Category</Link>,
    icon: <LayoutDashboard />,
  },
];

const AdminSidebar = () => {
  const logout = useLogout();
  return (
    <Sider>
      <div>
        <div className="demo-logo-vertical">
          <img src="/public/webstar-logo-2.jpg" alt="webstar logo" />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["01"]}
          items={AdminSiderItems}
        />
      </div>
      <Button onClick={logout} danger icon={<LogOut />}>
        chiqish
      </Button>
    </Sider>
  );
};

export default AdminSidebar;
