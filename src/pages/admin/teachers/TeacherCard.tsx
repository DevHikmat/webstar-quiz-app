import React from "react";
import { Card, Avatar, Button, Space, Typography, Col } from "antd";
import { Edit, Trash2 } from "lucide-react";
import { User } from "@/types/index.type";

const { Text, Title } = Typography;

interface TeacherCardProps {
  teacher: User;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onEdit,
  onDelete,
}) => {
  const {
    _id,
    firstname,
    lastname,
    email,
    profilePicture,
    subject,
    createdAt,
  } = teacher;

  return (
    <Col span={6}>
      <Card
        style={{ width: 300 }}
        cover={
          <Avatar
            src={profilePicture?.url || undefined}
            style={{ margin: "0", width: '100%', height: "200px", objectFit: "contain" }}
          >
            {!profilePicture && `${firstname[0]}${lastname[0]}`}
          </Avatar>
        }
        actions={[
          <Button
            type="text"
            icon={<Edit size={18} />}
            onClick={() => onEdit(_id)}
          >
            Edit
          </Button>,
          <Button
            danger
            type="text"
            icon={<Trash2 size={18} />}
            onClick={() => onDelete(_id)}
          >
            Delete
          </Button>,
        ]}
      >
        <Title level={5}>
          {firstname} {lastname}
        </Title>
        <Text type="secondary">{email}</Text>
        <br />
        <Text>Fan: {subject || "Nomaʼlum"}</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          Qoʻshilgan sana: {new Date(createdAt).toLocaleDateString()}
        </Text>
      </Card>
    </Col>
  );
};

export default TeacherCard;
