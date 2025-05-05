import { Button, Image, Popconfirm, Switch } from "antd";
import { Group, User } from "@/types/index.type";
import { ScanSearch, Trash, UserRound, UserRoundPen } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

export const StudentsColumns = (
  handleOpenModal: (user: User) => void,
  deleteMutation: UseMutationResult<any, Error, string>,
  currentPage: number,
  groups: Group[] | undefined
) => {
  return [
    {
      title: "T/R",
      key: "count",
      render: (_: any, __: any, index: number) => (currentPage - 1) * 15 + index + 1,
    },
    {
      title: "Rasmi",
      key: "image",
      render: (record: User) => {
        if (record.profilePicture) {
          return <Image width={40} height={"auto"} src={record.profilePicture.url} alt={record.firstname} />;
        } else return <UserRound />;
      },
    },
    {
      title: "Ism",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Familiya",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Guruhi",
      key: "group",
      render: (record: User) => {
        const group = groups?.find((g) => g._id === record.group); 
        return group ? group.name : "Noma'lum guruh"; 
      }
    },
    {
      title: "Imtihon",
      key: "access",
      render: (record: User) => {
        return <Switch checkedChildren="ha" unCheckedChildren="yo'q" defaultChecked={record.accessExam} />;
      },
    },
    {
      title: "Amaliyotlar",
      key: "actions",
      render: (record: User) => {
        const isDeleting = deleteMutation.isPending && deleteMutation.variables === record._id;
        return (
          <div style={{ display: "flex", gap: "25px" }}>
            <Button size="small" type="link" style={{ color: "#4caf50" }} icon={<ScanSearch />}></Button>
            <Button onClick={() => handleOpenModal(record)} size="small" type="link" style={{ color: "#5c6bc0" }} icon={<UserRoundPen />}></Button>
            <Popconfirm
              onConfirm={() => deleteMutation.mutate(record._id)}
              title="Ishonchingiz komilmi ?"
              okText="ha"
              cancelText="bekor qil"
              okType="danger"
            >
              <Button loading={isDeleting} size="small" type="link" style={{ color: "#ff7043" }} icon={<Trash />}></Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
