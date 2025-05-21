import CommonTable from "@/components/CommonTable"
import { getGroupStudents } from "@/services/userService"
import { useQuery } from "@tanstack/react-query"
import { Divider } from "antd"
import { useParams } from "react-router-dom"
import { GroupDetailColumns } from "./GroupDetailColumns"
import { getAllGroup } from "@/services/groupService"

const GroupDetail = () => {
    const {id} = useParams()
    const {data: groupData, isPending} = useQuery({
        queryKey: ['group-detail', id],
        queryFn: () => getGroupStudents(id!),
        enabled: !!id,
    })
    const {data: groupList} = useQuery({
        queryKey: ['groups'],
        queryFn: getAllGroup
    })

    const columns = GroupDetailColumns(groupList)

    if(isPending) return <h3>Loading...</h3>
    if(!groupData || !groupData.length) return <h3>Gruhda o'quvchilar mavjud emas!</h3>;
  return (
    <div>
        <Divider>Guruhdagi o'quvchilar</Divider>
        <CommonTable columns={columns} dataSource={groupData} />
    </div>
  )
}

export default GroupDetail
