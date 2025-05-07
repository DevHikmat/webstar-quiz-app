import React from 'react'
import { useParams } from 'react-router-dom'

const StudentDetail = () => {
  const {id} = useParams();
  
  return (
    <div>StudentDetail</div>
  )
}

export default StudentDetail