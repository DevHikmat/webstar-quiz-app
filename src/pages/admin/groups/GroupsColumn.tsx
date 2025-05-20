import { Button, Popconfirm, Switch } from "antd";
import { ColumnsType } from "antd/es/table";
import { Group, User } from "@/types/index.type";
import { Link } from "react-router-dom";
import { Search, Trash, UserRoundPen } from "lucide-react";

type Props = {
  teacherList: User[] | undefined;
  handleAccessChange: (checked: boolean, id: string) => void;
};

export const GroupsColumn = ({ teacherList, handleAccessChange }: Props): ColumnsType<Group> => {
  return [
    {
      title: "#",
      key: "count",
      render: (_, __, index) => <span>{index + 1}</span>,
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ustoz",
      key: "teacher",
      render: (record: Group) => {
        const currentTeacher = teacherList?.find((t) => t._id === record.teacherId);
        const text = currentTeacher ? `${currentTeacher.firstname} ${currentTeacher.lastname}` : "Mavjud emas!";
        return <span>{text}</span>;
      },
    },
    {
      title: "Kompaniya",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Imtihon ruxsati",
      dataIndex: "accessExam",
      key: "accessExam",
      render: (access: boolean, record: Group) => <Switch checked={access} onChange={(checked) => handleAccessChange(checked, record._id)} />,
    },
    {
      title: "Amaliyotlar",
      key: "actions",
      render: (record: User) => {
        return (
          <div style={{ display: "flex", gap: "25px" }}>
            <Link to={`/admin/groups/${record._id}`}>
              <Button size="small" type="link" style={{ color: "#4caf50" }} icon={<Search />} />
            </Link>
            <Button size="small" type="link" style={{ color: "#5c6bc0" }} icon={<UserRoundPen />}></Button>
            <Popconfirm title="Ishonchingiz komilmi ?" okText="ha" cancelText="bekor qil" okType="danger">
              <Button size="small" type="link" style={{ color: "#ff7043" }} icon={<Trash />}></Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
