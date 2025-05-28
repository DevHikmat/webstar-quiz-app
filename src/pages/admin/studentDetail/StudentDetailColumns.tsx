import { History } from "@/types/api.type";
import { Button, Input, Popconfirm, Space, Tag } from "antd";
import dayjs from "dayjs";
import { Ban, CheckCheck, CircleHelp, Loader, PlusCircle, Trash } from "lucide-react";


export const StudentDetailColumns = (
  editingRow: string | null,
  setEditingRow: (id: string | null) => void,
  setPracticeBall: (value: string) => void,
  handleUpdatePractice: () => void,
  loading: boolean,
  removeHistory: (id: string) => void,
  deleting: boolean,
  deletingRow: string | null,
  setDeletingRow: (id: string | null) => void,
  rowRef: React.RefObject<HTMLDivElement | null>
) => {

  const ActionButtons = ({ record }: { record: History }) => {
    const isEditing = record._id === editingRow;
    const isActionVisible = record.type !== "task";
  
    return (
      <Space>
        {isActionVisible && (
          <Button
            data-ignore-outside
            type="link"
            disabled={isEditing && loading}
            onClick={
              isEditing
                ? handleUpdatePractice
                : () => {
                    setEditingRow(record._id);
                    setPracticeBall(record.practice);
                  }
            }
          >
            {isEditing ? (loading ? <Loader /> : <CheckCheck />) : <PlusCircle />}
          </Button>
        )}
        <Popconfirm
          data-ignore-outside
          title="Tarix o'chirilsinmi?"
          okText="Ha"
          cancelText="Bekor"
          okType="danger"
          onConfirm={() => {
            setDeletingRow(record._id);
            removeHistory(record._id);
          }}
        >
          <Button disabled={deleting && record._id === deletingRow} type="link" danger>
            {deleting && record._id === deletingRow ? <Loader /> : <Trash />}
          </Button>
        </Popconfirm>
      </Space>
    );
  };
  
  return [
    {
      title: "Turi",
      dataIndex: "type",
      key: "type",
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Nomi",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Jami savollar",
      dataIndex: "countQuiz",
      key: "countQuiz",
    },
    {
      title: "To'gri javoblar",
      dataIndex: "correctCount",
      key: "correctCount",
    },
    {
      title: "Test sanasi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Amaliyot",
      key: "practice",
      render: (record: History) => {
        const isEditable = record.type === "exam";
        const isEditing = record._id === editingRow;
        if (!isEditable) return <Ban />;
        if (isEditing) {
          return (
            <div ref={rowRef}>
              <Input
                data-ignore-outside
                style={{ width: "80px" }}
                placeholder="ball"
                defaultValue={record.practice || ""}
                onChange={(e) => setPracticeBall(e.target.value)}
              />
            </div>
          );
        }
        return record.practice?.length > 0 ? <Tag>{record.practice}</Tag> : <CircleHelp />;
      },
    },
    {
      title: "Amaliyotlar",
      key: "actions",
      render: (record: History) => <ActionButtons record={record} />,
    },
    {
      title: "Natija",
      key: "result",
      render: (record: History) => {
        let result = (record.correctCount / record.countQuiz) * 100;
        let color = result < 60 ? "red" : "green";
        if (record.type === "task") return <Tag color={color}>{result.toFixed(1)}%</Tag>;

        if (record.practice !== undefined && record.practice !== null) {
          result = (result + Number(record.practice)) / 2;
        }
        color = result < 60 ? "red" : "green";

        return <Tag color={color}>{result.toFixed(1)}%</Tag>;
      },
    },
  ];
};
