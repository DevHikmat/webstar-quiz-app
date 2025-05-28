import { Image } from "antd";
import { User } from "@/types/api.type";
import { UserRound } from "lucide-react";
import {Group} from "@/types/api.type";

export const GroupDetailColumns = (
    groups: Group[] | undefined
) => {
  return [
    {
      title: "T/R",
      key: "count",
      render: (_: any, __: any, index: number) => index + 1,
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
      },
    },
  ];
};
