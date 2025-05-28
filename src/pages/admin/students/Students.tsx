import CommonTable from "@/components/CommonTable";
import { User } from "@/types/api.type";
import { Button, Divider, Flex, Form, Input, message, Modal, Select } from "antd";
import { useState } from "react";
import { deleteUser, getStudents, updateUser } from "@/services/userService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePagination } from "@/hooks/usePagination";
import { StudentsColumns } from "./StudentsColumns";
import { getChangedFields } from "@/utils/getChangedFields";
import { useUpdateMutation } from "@/hooks/useUpdateMutation";
import { ColumnsType } from "antd/es/table";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Students = () => {
  const { page: currentPage } = usePagination();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["students", currentPage],
    queryFn: () => getStudents(currentPage),
  });
  const { groups } = useSelector((state: RootState) => state.group);
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
  
  const updateUserMutation = useUpdateMutation<User>(updatingUser?._id, {
    entityName: "Foydalanuvchi",
    mutationFn: updateUser,
    onSuccess: () => {
      refetch();
      handleCloseModal();
    },
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

  const columns:ColumnsType<User> = StudentsColumns(handleOpenModal, deleteMutation, refetch, currentPage, groups);

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
              {groups?.map((item) => {
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
      <Divider>All Students in Webstar</Divider>
      <CommonTable currentPage={currentPage} totalPage={data?.totalPage} dataSource={data?.users || []} columns={columns} loading={isLoading} />
    </div>
  );
};

export default Students;
