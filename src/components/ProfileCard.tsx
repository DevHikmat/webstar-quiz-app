import React from "react";
import { Card, Avatar, Typography, Tag, Space, Divider } from "antd";
import { UserOutlined, MailOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { User } from "@/types/index.type";
import { useGroupName } from "@/hooks/useGroupName";

const { Title, Text } = Typography;

const ProfileCard: React.FC<{profileInfo: User}> = ({ profileInfo }) => {
  const {firstname, lastname, email, group, profilePicture, role, createdAt, accessExam} = profileInfo;
  const fullName = `${firstname} ${lastname}`;
  const initials = `${firstname.charAt(0)}${lastname.charAt(0)}`;
  const groupName = useGroupName(group);
  return (
    <Card
      style={{ width: 400, borderRadius: 12 }}
      hoverable
    >
      <Space align="start" size="large" style={{width: '100%'}}>
        <Avatar
          size={64}
          src={profilePicture?.url || undefined}
          icon={!profilePicture ? <UserOutlined /> : undefined}
          style={{ backgroundColor: profilePicture ? "transparent" : "#87d068" }}
        >
          {!profilePicture && initials}
        </Avatar>

        <div style={{width: '100%'}}>
          <Title level={4} style={{ marginBottom: 0 }}>{fullName}</Title>
          <Text type="secondary">
            <MailOutlined /> {email}
          </Text><br />
          <Text>
            <CalendarOutlined /> Qo'shildi: {dayjs(createdAt).format("DD-MM-YYYY")}
          </Text><br />
          <Divider />
          {groupName && (
            <Text>
              Guruhi: <Tag color="green">{groupName}</Tag>
            </Text>
          )}
          <div style={{ marginTop: 8 }}>
            Holat: <Tag color={accessExam ? "green" : "red"}>
              {accessExam ? "Imtihonga ruxsat berilgan" : "Ruxsat mavjud emas!"}
            </Tag>
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default ProfileCard;
