import { Table } from "antd";
import { usePagination } from "../hooks/usePagination";

interface CommonTableProps<T> {
  dataSource: T[];
  columns: any[];
  loading?: boolean;
  totalPage?: number;
  pagination?: any;
  currentPage?: number;
}

function CommonTable<T extends object>({ totalPage, currentPage = 1, ...props }: CommonTableProps<T>) {
  const { setPage } = usePagination();

  const onPageChange = (page: number) => {
    setPage(page);
  };

  return (
    <Table
      size="small"
      rowKey={(record) => (record as any)._id || JSON.stringify(record)}
      pagination={{
        pageSize: 15,
        total: totalPage ? totalPage * 15 : 15,
        onChange: onPageChange,
        current: currentPage,
      }}
      {...props}
    />
  );
}

export default CommonTable;
