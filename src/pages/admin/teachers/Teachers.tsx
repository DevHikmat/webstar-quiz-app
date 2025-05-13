import { deleteUser, getTeachers } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TeacherCard from "./TeacherCard";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Row,
  Upload,
  UploadProps,
} from "antd";
import { CircleAlert, DeleteIcon, HomeIcon, Inbox, Plus } from "lucide-react";
import { useState } from "react";

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  onChange(info) {
    console.log(info);
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const Teachers = () => {
  const [open, setOpen] = useState(false);
  const {
    data: teachers,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
  const queryClient = useQueryClient();

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

  const onEdit = (id: string) => {
    console.log(id);
  };
  const showDeleteConfirm = (onConfirm: () => void) => {
    Modal.confirm({
      title: "O‘qituvchini o‘chirmoqchimisiz?",
      icon: <CircleAlert style={{ marginRight: "10px" }} />,
      content: "Bu amalni bekor qilib bo‘lmaydi.",
      okText: "Ha, o‘chirish",
      okType: "danger",
      cancelText: "Bekor qilish",
      onOk() {
        onConfirm();
      },
    });
  };

  const onDelete = (id: string) => {
    showDeleteConfirm(() => {
      deleteMutation.mutate(id);
    });
  };

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  if (!teachers?.length) return;
  if (isPending) return message.info("Loading....");
  return (
    <div>
      <Button
        onClick={handleOpenModal}
        icon={<Plus />}
        style={{ marginBottom: "20px" }}
      >
        Add new Teacher
      </Button>
      <Modal open={open} title="Add teacher info" onCancel={handleCancel}>
        <Form>
          <Form.Item>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Inbox />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Input placeholder="firstname" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="lastname" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="email" />
          </Form.Item>
          <Form.Item>
            <Input placeholder="password" />
          </Form.Item>
        </Form>
      </Modal>
      <Row gutter={[16, 16]}>
        {teachers?.map((item) => (
          <TeacherCard
            key={item._id}
            onEdit={onEdit}
            onDelete={onDelete}
            teacher={item}
          />
        ))}
      </Row>
    </div>
  );
};

export default Teachers;
