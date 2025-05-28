import { deleteUser, getTeachers, updateUser } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TeacherCard from "@/pages/admin/teachers/TeacherCard";
import { Button, Flex, Form, Input, message, Modal, Row, Select, Spin, Upload, UploadFile } from "antd";
import { CircleAlert, Inbox, Plus } from "lucide-react";
import { useState } from "react";
import { UserRole } from "@/types/enum.type";
import { signup } from "@/services/authService";
import { subjects } from "@/utils/subjects";
import { getChangedFields } from "@/utils/getChangedFields";
import { User } from "@/types/api.type";

const { Dragger } = Upload;
interface UpdateTeacherValue {
  _id: string;
  subject: string;
  password: string | undefined;
}

const Teachers = () => {
  const [teacherImg, setTeacherImg] = useState<UploadFile | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [updTeacherValues, setUpdTeacherValues] = useState<null | UpdateTeacherValue>(null);
  const { data: teachers, isPending } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log(data);
      setTeacherImg(null);
      addForm.resetFields();
      handleCancel();
      message.success("O‘qituvchi muvaffaqiyatli yaratildi");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Yaratishda xatolik yuz berdi");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      message.success("O‘qituvchi muvaffaqiyatli o‘chirildi");
      queryClient.invalidateQueries({ queryKey: ["teachers"] }); // ro‘yxatni yangilash
    },
    onError: () => {
      message.error("O‘chirishda xatolik yuz berdi");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: Partial<User> }) => updateUser(id, formData),
    onSuccess: () => {
      message.success("O‘qituvchi ma'lumotlari yangilandi");
      queryClient.invalidateQueries({ queryKey: ["teachers"] }); // ro'yxatni yangilash
      setEditModalOpen(false);
      editForm.resetFields();
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Yangilashda xatolik yuz berdi");
    },
  });

  const props = {
    name: "file",
    multiple: false,
    accept: "image/*",
    beforeUpload: (file: UploadFile) => {
      setTeacherImg(file);
      return false;
    },
    onRemove: () => {
      setTeacherImg(null);
    },
    fileList: teacherImg ? [teacherImg] : [],
  };

  const onEdit = (_id: string) => {
    setEditModalOpen(true);
    const updatingTeacher = teachers?.find((item) => item._id === _id);
    if (!updatingTeacher) return message.warning("Bu ustoz ma'lumotlari topilmadi !");
    editForm.setFieldsValue({ subject: updatingTeacher.subject });
    setUpdTeacherValues({ _id, subject: updatingTeacher.subject, password: undefined });
  };

  const onDelete = (id: string) => {
    Modal.confirm({
      title: "O‘qituvchini o‘chirmoqchimisiz?",
      icon: <CircleAlert style={{ marginRight: "10px" }} />,
      content: "Bu amalni bekor qilib bo‘lmaydi.",
      okText: "Ha, o‘chirish",
      okType: "danger",
      cancelText: "Bekor qilish",
      onOk() {
        deleteMutation.mutate(id);
      },
    });
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();
      const { subject, firstname, lastname, email, password } = values;
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", UserRole.TEACHER);
      if (teacherImg instanceof File) {
        console.log(teacherImg);
        formData.append("profilePicture", teacherImg);
      }
      createMutation.mutate(formData);
    } catch (error) {
      message.error("Iltimos, barcha maydonlarni to‘g‘ri to‘ldiring");
    }
  };

  const handleUpdateTeacher = async () => {
    try {
      const result = getChangedFields(updTeacherValues, editForm.getFieldsValue());
      if (!Object.keys(result).length) return message.warning("Ma'lumotlar o'zgartrilmadi");
      if (!updTeacherValues?._id) return message.error("O‘qituvchi ID topilmadi");
      if (!result.password) {
        delete result.password;
      }
      updateMutation.mutate({ id: updTeacherValues._id, formData: result });
    } catch (error) {
      message.error("Iltimos, formani to‘g‘ri to‘ldiring");
    }
  };

  if (isPending) {
    return <Spin tip="Yuklanmoqda..." />;
  }

  return (
    <div>
      <Button onClick={handleOpenModal} icon={<Plus />} style={{ marginBottom: "20px" }}>
        Yangi ustoz qo'shish
      </Button>
      <Modal footer={false} open={open} title="Ustoz ma'lumotlarini kiriting." onCancel={handleCancel}>
        <Form form={addForm} labelCol={{ span: 6 }} labelAlign="left">
          <Form.Item>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Inbox />
              </p>
              <p className="ant-upload-text">Rasmni yuklash uchun bosing yoki surib keling.</p>
              <p className="ant-upload-hint">Yagona yuklashni qo'llab-quvvatlash.</p>
            </Dragger>
          </Form.Item>
          <Form.Item name="subject" label="Mutaxasis" initialValue={"Fan nomi..."}>
            <Select>
              {subjects.map((item) => (
                <Select.Option key={item.key} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="firstname" label="Ustoz ismi">
            <Input placeholder="ism" />
          </Form.Item>
          <Form.Item name="lastname" label="Familya">
            <Input placeholder="familya" />
          </Form.Item>
          <Form.Item name="email" label="Elektron manzil">
            <Input placeholder="email" />
          </Form.Item>
          <Form.Item name="password" label="Parol">
            <Input placeholder="parol" />
          </Form.Item>
          <Flex gap={10} justify="end">
            <Button onClick={() => setOpen(false)}>Bekor qilish</Button>
            <Button loading={createMutation.isPending} onClick={handleAdd} type="primary">
              Saqlash
            </Button>
          </Flex>
        </Form>
      </Modal>

      <Modal footer={false} open={editModalOpen} title="Ustoz ma'lumotlarini o'zgartrish." onCancel={() => setEditModalOpen(false)}>
        <Form onFinish={handleUpdateTeacher} form={editForm} labelCol={{ span: 5 }} labelAlign="left">
          <Form.Item name="subject" label="Fan">
            <Select>
              {subjects.map((item) => {
                return (
                  <Select.Option key={item.key} value={item.name}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="password" label="Yangi parol">
            <Input.Password autoComplete="off" placeholder="yangi parol berish" />
          </Form.Item>
          <Form.Item>
            <Flex justify="end">
              <Button type="primary" htmlType="submit">
                O'zgarishlarni saqlash
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
      <Row gutter={[16, 16]}>
        {teachers?.map((item) => (
          <TeacherCard key={item._id} onEdit={onEdit} onDelete={onDelete} teacher={item} />
        ))}
      </Row>
    </div>
  );
};

export default Teachers;
