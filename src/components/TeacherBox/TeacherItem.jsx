import { Card, Col } from "antd";
import React from "react";
import { Link } from "react-router-dom";
const { Meta } = Card;

const TeacherItem = ({ teach }) => {
  return (
    <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24} className="mb-4">
      <Link to={`${teach._id}`}>
        <Card
          className="shadow-sm"
          hoverable
          style={{
            width: "100%",
          }}
          cover={
            <img
              style={{ height: '250px' }}
              alt="example"
              src={
                teach.profilePicture
                  ? teach.profilePicture.url
                  : "https://cdn-icons-png.flaticon.com/512/46/46139.png"
              }
            />
          }
        >
          <Meta
            title={teach.firstname + " " + teach.lastname}
            description={teach.email}
          />
        </Card>
      </Link>
    </Col>
  );
};

export default TeacherItem;
