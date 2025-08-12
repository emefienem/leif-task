"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Table,
  Tabs,
  Statistic,
  Row,
  Col,
  Space,
  Avatar,
  Typography,
  Modal,
  Input,
  Button,
  Tag,
  message,
  Grid,
  Spin,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { Line, Bar } from "react-chartjs-2";
import { registerCharts } from "@/lib/chartSetup";

import {
  GET_CARE_WORKERS_CLOCKED_IN,
  GET_DASHBOARD_STATS,
  GET_GEOFENCE,
  GET_SHIFT_HISTORY,
  UPSERT_GEOFENCE,
  Staff,
  TimeEntry,
  WeeklyHours,
} from "@/lib/managerDashboard";
import { logout } from "@/actions/auth";

const { useBreakpoint } = Grid;
const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

registerCharts();

const ManagerDashboard = ({ mainUser }: UserProfile) => {
  const screens = useBreakpoint();
  const { user, error: authError, isLoading } = useUser();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [locationSettings, setLocationSettings] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
    radius: 2,
  });

  // queries
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery(GET_DASHBOARD_STATS, { skip: !user });

  const {
    data: clockedInData,
    loading: clockedInLoading,
    error: clockedInError,
  } = useQuery(GET_CARE_WORKERS_CLOCKED_IN, { skip: !user });

  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
  } = useQuery(GET_SHIFT_HISTORY, { skip: !user });

  const {
    data: geoFenceData,
    loading: geoFenceLoading,
    error: geoFenceError,
    refetch: refetchGeoFence,
  } = useQuery(GET_GEOFENCE, {
    skip: !user,
    onCompleted: (data) => {
      if (data?.getGeoFence) {
        setLocationSettings({
          latitude: data.getGeoFence.lat,
          longitude: data.getGeoFence.lng,
          radius: data.getGeoFence.radiusKm,
        });
      }
    },
  });

  useEffect(() => {
    if (!geoFenceLoading && !geoFenceError && !geoFenceData?.getGeoFence) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationSettings((prev) => ({
              ...prev,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }));
          },
          (error) => {
            console.warn("Geolocation error:", error.message);
          }
        );
      }
    }
  }, [geoFenceLoading, geoFenceError, geoFenceData]);

  const [upsertGeoFence, { loading: upsertLoading }] = useMutation(
    UPSERT_GEOFENCE,
    {
      onCompleted() {
        message.success("Location settings saved.");
        setLocationModalVisible(false);
        refetchStats();
        refetchGeoFence();
      },
      onError() {
        message.error("Failed to save location settings.");
      },
    }
  );

  // shifts and care workers data
  const shifts: TimeEntry[] = historyData?.getHistory ?? [];
  const careWorkers: Staff[] = clockedInData?.managerClockedIn ?? [];

  // helper function to get YYYY-MM-DD string
  const getDateString = (date: Date) => date.toISOString().split("T")[0];

  // last 7 days array of Date objects
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  // to init hours per day map with 0
  const hoursPerDayMap: Record<string, number> = {};
  last7Days.forEach((d) => {
    hoursPerDayMap[getDateString(d)] = 0;
  });

  // sum hours worked per day
  shifts.forEach(({ clockInAt, clockOutAt }) => {
    if (!clockOutAt) return; // ignore active shifts

    const clockInDate = new Date(clockInAt);
    const clockOutDate = new Date(clockOutAt);
    const dayStr = getDateString(clockInDate);

    if (dayStr in hoursPerDayMap) {
      const durationHours =
        (clockOutDate.getTime() - clockInDate.getTime()) / (1000 * 60 * 60);
      hoursPerDayMap[dayStr] += durationHours;
    }
  });

  // Chart labels & data for avg hours per day
  const last7DaysLabels = last7Days.map((d) =>
    d.toLocaleDateString(undefined, { weekday: "short" })
  );

  const avgHoursTrend = last7Days.map(
    (d) => hoursPerDayMap[getDateString(d)] ?? 0
  );

  // calculate average hours per day
  const totalHours = avgHoursTrend.reduce((sum, h) => sum + h, 0);
  const avgHoursPerDay =
    avgHoursTrend.length > 0 ? totalHours / avgHoursTrend.length : 0;

  // weekly hours by staff for table
  const weeklyHoursMap: Record<string, number> = {};
  shifts.forEach(({ user: { id }, clockInAt, clockOutAt }) => {
    if (!clockOutAt) return;
    const start = new Date(clockInAt).getTime();
    const end = new Date(clockOutAt).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    weeklyHoursMap[id] = (weeklyHoursMap[id] || 0) + hours;
  });
  const weeklyHoursByStaff: WeeklyHours[] = careWorkers.map((staff) => ({
    ...staff,
    weeklyHours: Number((weeklyHoursMap[staff.id] || 0).toFixed(2)),
  }));

  // weekly hours table columns
  const weeklyHoursColumns = [
    {
      title: "Staff",
      dataIndex: "name",
      key: "name",
      render: (_: unknown, record: WeeklyHours) => (
        <Space>
          <Avatar>{record.name[0]}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.role}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Total Hours (Last 7 Days)",
      dataIndex: "weeklyHours",
      key: "weeklyHours",
      sorter: (a: WeeklyHours, b: WeeklyHours) => a.weeklyHours - b.weeklyHours,
      render: (hours: number) => `${hours}h`,
    },
  ];

  // prepare chart data for avg hours line chart
  const avgHoursData = {
    labels: last7DaysLabels,
    datasets: [
      {
        label: "Avg Hours",
        data: avgHoursTrend,
        borderColor: "rgba(24, 144, 255, 1)",
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const avgHoursOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Average Hours per Day (Last 7 days)" },
    },
  };

  // total staff count (fetching this explicitly)
  const totalStaffCount = careWorkers.length;

  const currentlyWorkingCount = careWorkers.length;

  const currentlyWorkingData = {
    labels: ["Working", "Not Working"],
    datasets: [
      {
        label: "Staff Status",
        data: [currentlyWorkingCount, totalStaffCount - currentlyWorkingCount],
        backgroundColor: ["#722ed1", "#d9d9d9"],
      },
    ],
  };

  const currentlyWorkingOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: { display: true, text: "Staff Currently Working" },
    },
  };

  const tableScroll = screens.xs ? { x: "100%" } : undefined;

  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Spin />
      </div>
    );
  if (authError)
    return (
      <div style={{ textAlign: "center", marginTop: 24, color: "red" }}>
        Error: {authError.message}
      </div>
    );
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <Title level={2}>Manager Login Required</Title>
        <Button
          type="primary"
          onClick={() => (window.location.href = "/api/auth/login")}
        >
          Login
        </Button>
      </div>
    );
  }

  const anyLoading =
    statsLoading || clockedInLoading || historyLoading || geoFenceLoading;
  const anyError =
    statsError || clockedInError || historyError || geoFenceError;

  if (anyLoading)
    return (
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Spin />
      </div>
    );
  if (anyError) {
    return (
      <div style={{ textAlign: "center", marginTop: 24, color: "red" }}>
        Error loading data
      </div>
    );
  }

  const avgDailyClockIns = statsData?.getDashboardStats.dailyCount ?? 0;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!screens.xs && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={250}
          style={{ background: "#fff" }}
        >
          <div style={{ padding: "24px 16px" }}>
            <Title
              level={4}
              style={{
                color: "#1890ff",
                margin: 0,
                fontSize: collapsed ? 14 : 18,
              }}
            >
              Manager Dashboard
            </Title>
          </div>
        </Sider>
      )}

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: screens.xs ? "0 12px" : "0 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            {screens.xs && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuVisible(true)}
              />
            )}
            <Title
              level={3}
              style={{ margin: 0, fontSize: screens.xs ? 18 : 24 }}
            >
              Healthcare Clock Management
            </Title>
          </Space>
          <Space>
            <Button
              icon={<SettingOutlined />}
              size={screens.xs ? "small" : "middle"}
              onClick={() => setLocationModalVisible(true)}
            >
              {!screens.xs && "Location Settings"}
            </Button>
            <Button
              danger
              icon={<LogoutOutlined />}
              size={screens.xs ? "small" : "middle"}
              onClick={logout}
            >
              {!screens.xs && "Logout"}
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: screens.xs ? "12px" : "24px" }}>
          <Tabs defaultActiveKey="dashboard">
            <Tabs.TabPane
              tab={
                <span>
                  <DashboardOutlined /> Dashboard
                </span>
              }
              key="dashboard"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Avg Hours/Day (Last 7 days)"
                      value={avgHoursPerDay.toFixed(2)}
                      suffix="hours"
                      valueStyle={{ color: "#3f8600" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Avg Daily Clock-ins"
                      value={avgDailyClockIns}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Currently Working"
                      value={currentlyWorkingCount}
                      valueStyle={{ color: "#722ed1" }}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24} sm={12}>
                  <Card>
                    <Line data={avgHoursData} options={avgHoursOptions} />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card>
                    <Bar
                      data={currentlyWorkingData}
                      options={currentlyWorkingOptions}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                  <Card title="Weekly Hours by Staff (Last 7 Days)">
                    <Table
                      columns={weeklyHoursColumns}
                      dataSource={weeklyHoursByStaff}
                      pagination={false}
                      size="small"
                      rowKey="id"
                      scroll={tableScroll}
                    />
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <span>
                  <TeamOutlined /> Currently Working
                </span>
              }
              key="currentlyWorking"
            >
              <Card>
                <Table
                  columns={[
                    {
                      title: "Staff",
                      dataIndex: "name",
                      key: "name",
                      render: (_: unknown, record: Staff) => (
                        <Space>
                          <Avatar>{record.name[0]}</Avatar>
                          <div>
                            <div style={{ fontWeight: 500 }}>{record.name}</div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {record.role}
                            </Text>
                          </div>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={clockedInData?.managerClockedIn}
                  pagination={false}
                  size="small"
                  rowKey="id"
                  scroll={tableScroll}
                />
              </Card>
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <span>
                  <ClockCircleOutlined /> Time History
                </span>
              }
              key="timeHistory"
            >
              <Card>
                <Table
                  columns={[
                    {
                      title: "Staff Name",
                      dataIndex: "user",
                      key: "user",
                      render: (_: unknown, record: TimeEntry) =>
                        record.user?.name,
                    },
                    {
                      title: "Clock In",
                      dataIndex: "clockInAt",
                      key: "clockInAt",
                      render: (text: string) => new Date(text).toLocaleString(),
                    },
                    {
                      title: "Clock Out",
                      dataIndex: "clockOutAt",
                      key: "clockOutAt",
                      render: (text: string | null) =>
                        text ? (
                          new Date(text).toLocaleString()
                        ) : (
                          <Tag color="green">Active</Tag>
                        ),
                    },
                  ]}
                  dataSource={shifts}
                  pagination={{ pageSize: 10 }}
                  size="small"
                  rowKey="id"
                  scroll={tableScroll}
                />
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Content>
      </Layout>

      {/* Mobile menu */}
      <Modal
        open={mobileMenuVisible}
        footer={null}
        onCancel={() => setMobileMenuVisible(false)}
        width="80%"
      >
        <div style={{ rowGap: 16 }}>
          <Button block onClick={() => setLocationModalVisible(true)}>
            Location Settings
          </Button>
          <Button
            block
            danger
            onClick={() => (window.location.href = "/api/auth/logout")}
          >
            Logout
          </Button>
        </div>
      </Modal>

      <Modal
        title="Location Settings"
        open={locationModalVisible}
        onCancel={() => setLocationModalVisible(false)}
        onOk={() => {
          upsertGeoFence({
            variables: {
              lat: locationSettings.latitude,
              lng: locationSettings.longitude,
              radiusKm: locationSettings.radius,
            },
          });
        }}
        confirmLoading={upsertLoading}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
            Workplace Latitude
          </label>
          <Input
            type="number"
            step="any"
            value={locationSettings.latitude}
            onChange={(e) =>
              setLocationSettings((prev) => ({
                ...prev,
                latitude: parseFloat(e.target.value),
              }))
            }
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
            Workplace Longitude
          </label>
          <Input
            type="number"
            step="any"
            value={locationSettings.longitude}
            onChange={(e) =>
              setLocationSettings((prev) => ({
                ...prev,
                longitude: parseFloat(e.target.value),
              }))
            }
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>
            Allowed Radius (km)
          </label>
          <Input
            type="number"
            step="any"
            value={locationSettings.radius}
            onChange={(e) =>
              setLocationSettings((prev) => ({
                ...prev,
                radius: parseFloat(e.target.value),
              }))
            }
          />
        </div>
      </Modal>
    </Layout>
  );
};

export default ManagerDashboard;
