import CommonTable from "@/components/CommonTable";
import { User } from "@/types/index.type";
import { Button, Divider, Flex, Form, Input, message, Modal, Select } from "antd";
import { useState } from "react";
import { deleteUser, getStudents, updateUser } from "@/services/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePagination } from "@/hooks/usePagination";
import { StudentsColumns } from "./StudentsColumns";
import { getAllGroup } from "@/services/groupService";
import { getChangedFields } from "@/utils/getChangedFields";

const Students = () => {
  const { page: currentPage } = usePagination();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["students", currentPage],
    queryFn: () => getStudents(currentPage),
  });
  const { data: groupList } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getAllGroup(),
  });
  const [open, setOpen] = useState(false);
  const [updForm] = Form.useForm();
  const [updatingUser, setUpdatingUser] = useState<User | null>(null);
  
  const handleOpenModal = (user: User) => {
    setOpen(true);
    setUpdatingUser(user);
    updForm.setFieldsValue({
      email: user.email,
      group: user.group,
    })
  };
  
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => refetch(),
    onError: (error) => {
      console.log("O‘chirishda xatolik: " + (error as Error).message);
    },
  });
  
  const updateUserMutation = useMutation({
    mutationFn: (updatedData: Partial<User>) => updateUser(updatingUser?._id!, updatedData),
    onSuccess: () => {
      message.success("Foydalanuvchi muvaffaqiyatli yangilandi.");
      refetch();
      handleCloseModal();
    },
    onError: (error) => {
      message.error("O‘zgartirishda xatolik: " + (error as Error).message);
    }
  });
 
  const handleSaveUser = () => {
    const newValues = updForm.getFieldsValue();
    const formdata = getChangedFields(updatingUser, newValues)
    if(!Object.keys(formdata).length) return message.info("Hech qanday qiymat o'zgartrilmadi.");
    updateUserMutation.mutate(formdata);
  };

  const handleCloseModal = () => {
    setOpen(false);
    updForm.resetFields();
  };

  const columns = StudentsColumns(handleOpenModal, deleteMutation, currentPage, groupList?.groups);

  return (
    <div>
      <Modal footer open={open} onCancel={handleCloseModal}>
        <Form form={updForm} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
          <Divider>Ma'lumotlarni yangilash.</Divider>
          <Form.Item label="E-mail" name="email">
            <Input placeholder="Elektron pochta" />
          </Form.Item>
          <Form.Item label="Boshqa guruhga o'tkazish" name='group'>
            <Select>
              {groupList?.groups.map((item) => {
                return (
                  <Select.Option value={item._id} key={item._id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Parolni yangilash(majburiy emas)" name="password">
            <Input placeholder="Yangi parol qiymatini kiriting" />
          </Form.Item>
          <Flex gap={16} justify="right">
            <Button onClick={handleCloseModal}>Bekor qilish</Button>
            <Button loading={updateUserMutation.isPending} type="primary" onClick={handleSaveUser}>Yangilash</Button>
          </Flex>
        </Form>
      </Modal>
      <CommonTable currentPage={currentPage} totalPage={data?.totalPage} dataSource={data?.users || []} columns={columns} loading={isLoading} />
    </div>
  );
};

export default Students;
