import { Button, Switch, Table, Skeleton, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GroupService } from "../../services/GroupService";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const TeacherGroups = () => {
  const [dataSource, setDataSource] = useState(null);
  const { currentUser } = useSelector((state) => state.auth);

  const handleTeacherGroups = async () => {
    try {
      const { groups } = await GroupService.getTeacherGroups(currentUser._id);
      setDataSource(groups.map((item, index) => ({ ...item, key: index + 1 })));
    } catch (error) {
      message.error(error.response.data.message);
    }
  };
  useEffect(() => {
    handleTeacherGroups();
  }, [currentUser]);

  const handleAccessGroup = async (group) => {
    const { _id, accessExam } = group;
    try {
      const data = await GroupService.groupExamToggler(_id, {
        access: !accessExam,
      });
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const columns = [
    { key: "1", title: "#", dataIndex: "key" },
    { key: "2", title: "Guruh nomi", dataIndex: "name" },
    {
      key: "3",
      title: "Ruxsat",
      render: (group) => {
        return (
          <Switch
            checkedChildren="Ha"
            unCheckedChildren="yo'q"
            defaultChecked={group.accessExam}
            onChange={() => handleAccessGroup(group)}
          />
        );
      },
    },
    {
      key: "4",
      title: "O'quvchilar",
      render: (group) => {
        return (
          <Link to={`group/${group._id}`}>
            <Button icon={<EyeOutlined />}></Button>
          </Link>
        );
      },
    },
  ];
  return (
    <div>
      {dataSource ? (
        dataSource.length > 0 ? (
          <Table
            size="small"
            dataSource={dataSource}
            columns={columns}
            pagination={{ defaultPageSize: 5 }}
          ></Table>
        ) : (
          "Guruhlar mavjud emas!"
        )
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export default TeacherGroups;
