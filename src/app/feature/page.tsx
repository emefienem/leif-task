"use client";
import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Divider,
  Badge,
  Timeline,
  Statistic,
  Alert,
  Tag,
} from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  MobileOutlined,
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  HeartOutlined,
  RocketOutlined,
  MailOutlined,
  LoginOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const FeaturesPage = () => {
  const managerFeatures = [
    {
      icon: <SettingOutlined />,
      title: "Location Perimeter Control",
      description:
        "Set custom perimeters (e.g., within 2km) where care workers can clock in",
    },
    {
      icon: <TeamOutlined />,
      title: "Real-time Staff Monitoring",
      description:
        "View all staff currently clocked in with live status updates",
    },
    {
      icon: <ClockCircleOutlined />,
      title: "Detailed Timesheets",
      description: "Access when and where each staff member clocked in/out",
    },
    {
      icon: <BarChartOutlined />,
      title: "Analytics Dashboard",
      description:
        "Track average hours, daily attendance, and weekly summaries",
    },
  ];

  const careWorkerFeatures = [
    {
      icon: <LoginOutlined />,
      title: "Location-Based Clock In",
      description: "Clock in only when within the designated perimeter area",
    },
    // {
    //   icon: <EnvironmentOutlined />,
    //   title: "GPS Validation",
    //   description:
    //     "Automatic location verification prevents unauthorized entries",
    // },
    {
      icon: <ClockCircleOutlined />,
      title: "Optional Notes",
      description: "Add notes when clocking in or out for additional context",
    },
    {
      icon: <CheckCircleOutlined />,
      title: "Personal History",
      description: "View your own timesheet and attendance history",
    },
  ];

  const techStack = [
    {
      name: "Next.js",
      description: "React framework for production",
      color: "blue",
    },
    {
      name: "Ant Design",
      description: "Enterprise UI components",
      color: "cyan",
    },
    { name: "Auth0", description: "Secure authentication", color: "green" },
    { name: "PWA", description: "Progressive Web App", color: "purple" },
    { name: "Geolocation API", description: "GPS tracking", color: "orange" },
    { name: "Responsive Design", description: "All devices", color: "magenta" },
  ];

  const analyticsData = [
    { title: "Average Daily Hours", value: "7.5", suffix: "hrs" },
    { title: "Daily Check-ins", value: "24", suffix: "staff" },
    { title: "Weekly Total", value: "180", suffix: "hrs" },
  ];

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "80px 0",
          textAlign: "center",
          color: "white",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Title
              level={1}
              style={{ color: "white", fontSize: "3.5rem", marginBottom: 0 }}
            >
              <HeartOutlined /> Lief Clock
            </Title>
            <Paragraph
              style={{
                fontSize: "1.3rem",
                color: "rgba(255,255,255,0.9)",
                maxWidth: 600,
                margin: "0 auto 30px",
              }}
            >
              Modern Care Worker Management System with Location-Based Clock
              In/Out
            </Paragraph>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              style={{
                height: 50,
                fontSize: "1.1rem",
                background: "rgba(255,255,255,0.2)",
                borderColor: "rgba(255,255,255,0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              Explore Features
            </Button>
          </Space>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 0" }}>
        <Alert
          message="MVP Approach"
          description="First user to register automatically becomes the manager. All subsequent users are assigned as care workers."
          type="info"
          showIcon
          style={{ marginBottom: 40 }}
        />
      </div>

      {/* Core Features */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
          Core Features
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} lg={6}>
            <Card
              hoverable
              style={{ height: "100%" }}
              cover={
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    background: "#f0f2f5",
                  }}
                >
                  <EnvironmentOutlined
                    style={{ fontSize: 48, color: "#1890ff" }}
                  />
                </div>
              }
            >
              <Card.Meta
                title="Location-Based Tracking"
                description="GPS-verified clock in/out system with custom perimeters and real-time validation"
              />
            </Card>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Card
              hoverable
              style={{ height: "100%" }}
              cover={
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    background: "#f0f2f5",
                  }}
                >
                  <ClockCircleOutlined
                    style={{ fontSize: 48, color: "#52c41a" }}
                  />
                </div>
              }
            >
              <Card.Meta
                title="Time Management"
                description="Simple one-tap clock in/out with optional notes and automatic time calculations"
              />
            </Card>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Card
              hoverable
              style={{ height: "100%" }}
              cover={
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    background: "#f0f2f5",
                  }}
                >
                  <SafetyOutlined style={{ fontSize: 48, color: "#faad14" }} />
                </div>
              }
            >
              <Card.Meta
                title="Secure Authentication"
                description="Auth0 integration with multiple login options and role-based access control"
              />
            </Card>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Card
              hoverable
              style={{ height: "100%" }}
              cover={
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    background: "#f0f2f5",
                  }}
                >
                  <MobileOutlined style={{ fontSize: 48, color: "#722ed1" }} />
                </div>
              }
            >
              <Card.Meta
                title="Progressive Web App"
                description="Install to home screen, works offline, cross-platform compatibility"
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* User Roles Section */}
      <div style={{ background: "white", padding: "60px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
            User Roles & Capabilities
          </Title>

          <Row gutter={[40, 40]}>
            {/* Manager Card */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <Text strong>Manager Dashboard</Text>
                    <Badge
                      count="First User"
                      style={{ backgroundColor: "#f50" }}
                    />
                  </Space>
                }
                style={{ height: "100%" }}
                headStyle={{
                  backgroundColor: "#fff2e8",
                  borderBottom: "2px solid #ff7a45",
                }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Timeline
                    items={managerFeatures.map((feature) => ({
                      dot: feature.icon,
                      children: (
                        <div>
                          <Text strong>{feature.title}</Text>
                          <br />
                          <Text type="secondary">{feature.description}</Text>
                        </div>
                      ),
                    }))}
                  />

                  <Divider>Analytics Dashboard</Divider>

                  <Row gutter={16}>
                    {analyticsData.map((stat, index) => (
                      <Col span={8} key={index}>
                        <Statistic
                          title={stat.title}
                          value={stat.value}
                          suffix={stat.suffix}
                          valueStyle={{ color: "#1890ff", fontSize: "1.2rem" }}
                        />
                      </Col>
                    ))}
                  </Row>
                </Space>
              </Card>
            </Col>

            {/* Care Worker Card */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <DashboardOutlined />
                    <Text strong>Care Worker Interface</Text>
                    <Badge
                      count="Subsequent Users"
                      style={{ backgroundColor: "#52c41a" }}
                    />
                  </Space>
                }
                style={{ height: "100%" }}
                headStyle={{
                  backgroundColor: "#f6ffed",
                  borderBottom: "2px solid #52c41a",
                }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  <Timeline
                    items={careWorkerFeatures.map((feature) => ({
                      dot: feature.icon,
                      children: (
                        <div>
                          <Text strong>{feature.title}</Text>
                          <br />
                          <Text type="secondary">{feature.description}</Text>
                        </div>
                      ),
                    }))}
                  />

                  <Alert
                    message="Location Validation"
                    description="App prevents clock-in when outside designated perimeter"
                    type="warning"
                    showIcon
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Technology Stack */}
      <div style={{ padding: "60px 0", background: "#f0f2f5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
            Technology Stack
          </Title>

          <Row gutter={[16, 16]} justify="center">
            {techStack.map((tech, index) => (
              <Col xs={12} sm={8} md={6} lg={4} key={index}>
                <Card
                  hoverable
                  size="small"
                  style={{ textAlign: "center", height: 120 }}
                >
                  <Space direction="vertical" size="small">
                    <Tag
                      color={tech.color}
                      style={{ fontSize: "0.9rem", padding: "4px 8px" }}
                    >
                      {tech.name}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: "0.8rem" }}>
                      {tech.description}
                    </Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Authentication Features */}
      <div style={{ background: "white", padding: "60px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
            Authentication & Security
          </Title>

          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} md={8}>
              <Card hoverable style={{ textAlign: "center" }}>
                <SafetyOutlined
                  style={{ fontSize: 40, color: "#1890ff", marginBottom: 16 }}
                />
                <Title level={4}>Auth0 Integration</Title>
                <Paragraph type="secondary">
                  Enterprise-grade authentication with multiple login options
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card hoverable style={{ textAlign: "center" }}>
                <UserOutlined
                  style={{ fontSize: 40, color: "#52c41a", marginBottom: 16 }}
                />
                <Title level={4}>Role-Based Access</Title>
                <Paragraph type="secondary">
                  Automatic role assignment with secure permission controls
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card hoverable style={{ textAlign: "center" }}>
                <LoginOutlined
                  style={{ fontSize: 40, color: "#faad14", marginBottom: 16 }}
                />
                <Title level={4}>Multiple Login Options</Title>
                <Paragraph type="secondary">
                  Support for email, Google login, and password recovery
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Contact Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
          padding: "60px 0",
          textAlign: "center",
          color: "white",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Title level={2} style={{ color: "white" }}>
              <RocketOutlined /> MVP Ready for Deployment
            </Title>
            <Paragraph
              style={{
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.7,
              }}
            >
              Built with Next.js and Ant Design, solution focuses on essential
              care worker management features while maintaining room for future
              enhancements.
            </Paragraph>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
