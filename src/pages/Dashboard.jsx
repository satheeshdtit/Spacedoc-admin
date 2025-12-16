import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
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
import icon from "../assets/Images/icon.png";
import axios from "axios";

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [stats, setStats] = useState(null);
  const [visitsData, setVisitsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // Fetch Dashboard Stats
  // ------------------------------
  const fetchDashboardStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getDashboardStats`);
      if (res.data.status === "success") {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Dashboard Stats Error:", err);
    }
  };

  // ------------------------------
  // Fetch Visits per Day (Graph)
  // ------------------------------
  const fetchVisits = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getVisitsPerDay`);
      if (res.data.status === "success") {
        const graphData = (res.data.data || []).map((item) => ({
          name: new Date(item.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          }),
          users: item.count,
        }));
        setVisitsData(graphData);
      }
    } catch (err) {
      console.error("Visits API Error:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([fetchDashboardStats(), fetchVisits()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  if (loading || !stats) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <Container className="my-5">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">
          Welcome to <span>Spacedocashok</span> admin panel
        </p>

        {/* -------------- STATS CARDS -------------- */}
        <Row className="g-3 my-4">
          <Col xs={12} sm={6} md={3}>
            <Card className="grad-card grad-card-blue h-100">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="auto">
                    <div className="grad-icon">
                      <img src={icon} alt="stat" className="grad-icon-img" />
                    </div>
                  </Col>
                  <Col>
                    <h4 className="grad-number">{stats.totalJourneyRows}</h4>
                    <p className="grad-label">Total Journey</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Card className="grad-card grad-card-purple h-100">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="auto">
                    <div className="grad-icon">
                      <img src={icon} alt="stat" className="grad-icon-img" />
                    </div>
                  </Col>
                  <Col>
                    <h4 className="grad-number">{stats.totalNewsRows}</h4>
                    <p className="grad-label">Total News</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Card className="grad-card grad-card-green h-100">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="auto">
                    <div className="grad-icon">
                      <HiOutlinePhotograph className="grad-icon-img" />
                    </div>
                  </Col>
                  <Col>
                    <h4 className="grad-number">{stats.totalImages}</h4>
                    <p className="grad-label">Total Picture</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Card className="grad-card grad-card-orange h-100">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="auto">
                    <div className="grad-icon">
                      <LuEye className="grad-icon-img" />
                    </div>
                  </Col>
                  <Col>
                    <h4 className="grad-number">{stats.totalVisits}</h4>
                    <p className="grad-label">Total Visits</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* -------------- GRAPH SECTION -------------- */}
        <Row>
          <Col>
            <Card className="user-stat-card">
              <Card.Body>
                <h5 className="mb-4">User Statistics</h5>

                <div className="user-stat-chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={visitsData.length ? visitsData : [{ name: "No Data", users: 0 }]}>
                      <defs>
                        <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#007bff" stopOpacity={0.6} />
                          <stop offset="70%" stopColor="#00c0ff" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#00c0ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5eaf3" />

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
