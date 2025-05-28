import CommonTable from "@/components/CommonTable";
import ProfileCard from "@/components/ProfileCard";
import { getOneUser } from "@/services/userService";
import { UserRole } from "@/types/enum.type";
import { History, User } from "@/types/api.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { StudentDetailColumns } from "./StudentDetailColumns";
import { Divider, message, Segmented, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { deleteHistory, updateHistory } from "@/services/historyService";

const StudentDetail = () => {
  const { id } = useParams();
  const [taskType, setTaskType] = useState<"exam" | "task">("exam");
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [deletingRow, setDeletingRow] = useState<string | null>(null);
  const [practiceBall, setPracticeBall] = useState<string>("");
  const queryClient = useQueryClient();

  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-ignore-outside]")) return;
      setEditingRow(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { mutate: updatePractice, isPending: loading } = useMutation({
    mutationFn: ({ id, practice }: { id: string; practice: string }) => updateHistory(id, { practice }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-detail", id] });
      setEditingRow(null);
      setPracticeBall("");
    },
  });

  const { mutate: removeHistory, isPending: deleting } = useMutation({
    mutationFn: (id: string) => deleteHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-detail", id] });
    },
  });

  const handleUpdatePractice = () => {
    if (!practiceBall || !editingRow) return message.warning("Iltimos, praktika balini kiriting.");
    if (0 >= Number(practiceBall) || Number(practiceBall) > 100) return message.error("Baholash tizimi 0 < x <= 100 bo'ladi.");
    updatePractice({ id: editingRow, practice: practiceBall });
  };

  if (!id) return <p>Invalid student ID</p>;
  const { isPending, data: student } = useQuery({
    queryKey: ["student-detail", id],
    queryFn: async () => {
      const res = await getOneUser(id);
      return {
        ...res,
        role: res.role as UserRole,
      } as User;
    },
  });

  if (isPending) return <p>Loading...</p>;
  if (!student) return <p>No student found</p>;

  const columns: ColumnsType<History> = StudentDetailColumns(
    editingRow,
    setEditingRow,
    setPracticeBall,
    handleUpdatePractice,
    loading,
    removeHistory,
    deleting,
    deletingRow,
    setDeletingRow,
    rowRef
  );

  const handleChange = (value: "Imtihon" | "Uyga vazifa") => {
    setTaskType(value === "Imtihon" ? "exam" : "task");
  };

  const filteredHistory = student.history.filter((item) => item.type === taskType);

  const tabsItems = [
    {
      key: "exam",
      label: "",
      children: <CommonTable dataSource={filteredHistory} columns={columns} />,
    },
    {
      key: "task",
      label: "",
      children: <CommonTable dataSource={filteredHistory} columns={columns} />,
    },
  ];

  return (
    <div>
      <ProfileCard profileInfo={student} />
      <Divider>O'quvchi tarixi</Divider>
      <Segmented style={{ marginBottom: 8, background: "#e0e0e0" }} options={["Imtihon", "Uyga vazifa"]} onChange={handleChange} />
      <Tabs defaultActiveKey="exam" items={tabsItems} />
    </div>
  );
};

export default StudentDetail;
