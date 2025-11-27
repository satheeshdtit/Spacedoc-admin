import React from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Card,
  Button,
  Table,
  Form,
} from "react-bootstrap";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { HiOutlinePhotograph } from "react-icons/hi";
import { LuEye } from "react-icons/lu";
import { SiSimpleanalytics } from "react-icons/si";
import icon from "../assets/Images/icon.png";
const userStatisticsData = [
  { name: "Jan", users: 120 },
  { name: "Feb", users: 210 },
  { name: "Mar", users: 150 },
  { name: "Apr", users: 260 },
  { name: "May", users: 200 },
  { name: "Jun", users: 320 },
  { name: "Jul", users: 280 },
  { name: "Aug", users: 360 },
  { name: "Sep", users: 300 },
  { name: "Oct", users: 420 },
  { name: "Nov", users: 380 },
  { name: "Dec", users: 450 },
];

const Dashboard = () => {
  return (
    <div>
      <Container className="my-5">
        <div className="dashboard-header mb-4">
          <div>
            <h2 className="dashboard-title">Dashboard</h2>
            <p className="dashboard-subtitle">
              Welcome to <span>Spacedocashok</span> admin panel
            </p>
          </div>
        </div>
        <Row className="g-3 my-4">
  <Col xs={12} sm={6} md={3} className="d-flex">
    <Card className="grad-card grad-card-blue h-100 w-100">
      <Card.Body className="d-flex flex-column justify-content-center">
        <Row className="align-items-center">
          <Col xs="auto">
            <div className="grad-icon">
              <img src={icon} alt="stat" className="grad-icon-img" />
            </div>
          </Col>
          <Col>
            <h4 className="grad-number">8</h4>
            <p className="grad-label">Total Journey</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Col>

  <Col xs={12} sm={6} md={3} className="d-flex">
    <Card className="grad-card grad-card-purple h-100 w-100">
      <Card.Body className="d-flex flex-column justify-content-center">
        <Row className="align-items-center">
          <Col xs="auto">
            <div className="grad-icon">
              <img src={icon} alt="stat" className="grad-icon-img" />
            </div>
          </Col>
          <Col>
            <h4 className="grad-number">45</h4>
            <p className="grad-label">Total News</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Col>

  <Col xs={12} sm={6} md={3} className="d-flex">
    <Card className="grad-card grad-card-green h-100 w-100">
      <Card.Body className="d-flex flex-column justify-content-center">
        <Row className="align-items-center">
          <Col xs="auto">
            <div className="grad-icon">
              <HiOutlinePhotograph className="grad-icon-img" />
            </div>
          </Col>
          <Col>
            <h4 className="grad-number">100</h4>
            <p className="grad-label">Total Picture</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Col>

  <Col xs={12} sm={6} md={3} className="d-flex">
    <Card className="grad-card grad-card-orange h-100 w-100">
      <Card.Body className="d-flex flex-column justify-content-center">
        <Row className="align-items-center">
          <Col xs="auto">
            <div className="grad-icon">
              <LuEye className="grad-icon-img" />
            </div>
          </Col>
          <Col>
            <h4 className="grad-number">26</h4>
            <p className="grad-label">Total Visits</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Col>
</Row>


        <Row>
          <Col>
            <Card className="user-stat-card">
              <Card.Body>
                <h5 className="mb-4">User Statistics</h5>

                <div className="user-stat-chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={userStatisticsData}>
                      <defs>
                        <linearGradient
                          id="chartColor"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#007bff"
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="70%"
                            stopColor="#00c0ff"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="100%"
                            stopColor="#00c0ff"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5eaf3"
                      />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis hide={true} />
                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke="#007bff"
                        strokeWidth={3}
                        fill="url(#chartColor)"
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
