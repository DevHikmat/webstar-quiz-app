import CommonTable from "@/components/CommonTable";
import { createGroup, getAllGroup, updateGroup } from "@/services/groupService";
import { getTeachers } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Divider, Form, Input, message, Select, Spin, Switch } from "antd";
import { GroupsColumn } from "./GroupsColumn";
import { Plus } from "lucide-react";

const Groups = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate: addGroup, isPending: addGroupPending } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      message.success("Guruh muvaffaqiyatli qo‘shildi");
      queryClient.invalidateQueries({ queryKey: ["groups"] }); // 🔁 keshni yangilash
    },
    onError: () => {
      message.error("Guruhni qo‘shishda xatolik yuz berdi");
    },
  });

  const onFinish = (values: any) => {
    addGroup({...values, accessExam: values.accessExam || false, company: "Webstar" });
    form.resetFields();
  };
  const { data: groupsData, isPending } = useQuery({
    queryKey: ["groups"],
    queryFn: getAllGroup,
  });
  const { data: teacherList } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const { mutate: updateGroupMutation } = useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      message.success("Guruh ruxsat holati o'zgardi");
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    },
  });

  const handleAccessChange = (checked: boolean, id: string) => {
    updateGroupMutation({
      id,
      data: { accessExam: checked },
    });
  };

  const columns = GroupsColumn({
    teacherList,
    handleAccessChange,
  });

  if (isPending) {
    return <Spin>Loading...</Spin>;
  }
  if (!groupsData) {
    return;
  }
  return (
    <div>
      <Divider style={{margin: "30px 0"}}><h3>Yangi guruh qo'shish bo'limi</h3></Divider>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Guruh nomi" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Ustoz" name="teacherId" rules={[{ required: true }]}>
          <Select placeholder="Ustozni tanlang" allowClear>
            {teacherList?.map((t) => (
              <Select.Option key={t._id} value={t._id}>
                {t.firstname} {t.lastname}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Imtihon ruxsati" name="accessExam" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={addGroupPending} icon={<Plus />}>
            Qo‘shish
          </Button>
        </Form.Item>
            <Divider><h3>Barcha guruhlar</h3></Divider>
      </Form>
      <CommonTable columns={columns} dataSource={groupsData} />
    </div>
  );
};

export default Groups;
