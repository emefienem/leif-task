"use client";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Button,
  Table,
  Tabs,
  Statistic,
  Row,
  Col,
  message,
  Modal,
  Input,
  Tag,
  Space,
  Avatar,
  Typography,
  DatePicker,
  Select,
} from "antd";
import {
  ClockCircleOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Types
interface Staff {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface TimeEntry {
  id: string;
  staffId: number;
  staffName: string;
  clockIn: Date;
  clockOut: Date | null;
  clockInLocation: string | null;
  clockOutLocation: string | null;
  hoursWorked: string | null;
}

interface LocationSettings {
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

interface WeeklyHours extends Staff {
  weeklyHours: string;
}

// Mock data and utilities
const mockStaff: Staff[] = [
  { id: 1, name: "Dr. Sarah Johnson", role: "Doctor", avatar: "👩‍⚕️" },
  { id: 2, name: "Nurse Mike Chen", role: "Nurse", avatar: "👨‍⚕️" },
  { id: 3, name: "Lisa Williams", role: "Nurse", avatar: "👩‍⚕️" },
  { id: 4, name: "David Brown", role: "Technician", avatar: "👨‍⚕️" },
  { id: 5, name: "Maria Garcia", role: "Therapist", avatar: "👩‍⚕️" },
];

const generateMockTimeEntries = (): TimeEntry[] => {
  const entries: TimeEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    mockStaff.forEach((staff) => {
      if (Math.random() > 0.2) {
        const clockInTime = new Date(date);
        clockInTime.setHours(
          Math.floor(Math.random() * 3) + 7,
          Math.floor(Math.random() * 60)
        );

        const hoursWorked = Math.floor(Math.random() * 4) + 6;
        const clockOutTime = new Date(
          clockInTime.getTime() + hoursWorked * 60 * 60 * 1000
        );

        entries.push({
          id: `${staff.id}-${i}`,
          staffId: staff.id,
          staffName: staff.name,
          clockIn: clockInTime,
          clockOut: clockOutTime,
          clockInLocation: `${(Math.random() * 0.002 + 6.5).toFixed(6)}, ${(
            Math.random() * 0.002 +
            3.35
          ).toFixed(6)}`,
          clockOutLocation: `${(Math.random() * 0.002 + 6.5).toFixed(6)}, ${(
            Math.random() * 0.002 +
            3.35
          ).toFixed(6)}`,
          hoursWorked: (
            (clockOutTime.getTime() - clockInTime.getTime()) /
            (1000 * 60 * 60)
          ).toFixed(2),
        });
      }
    });
  }
  return entries.sort((a, b) => b.clockIn.getTime() - a.clockIn.getTime());
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function HealthcareClockApp() {
  const [userRole, setUserRole] = useState<"manager" | "worker">("manager");
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentlyClockedIn, setCurrentlyClockedIn] = useState<Set<number>>(
    new Set()
  );
  const [locationSettings, setLocationSettings] = useState<LocationSettings>({
    latitude: 6.5244,
    longitude: 3.3792,
    radius: 2000,
  });
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  useEffect(() => {
    const mockEntries = generateMockTimeEntries();
    setTimeEntries(mockEntries);

    const recentEntries = mockEntries.filter(
      (entry) =>
        !entry.clockOut &&
        new Date().getTime() - entry.clockIn.getTime() < 24 * 60 * 60 * 1000
    );
    setCurrentlyClockedIn(new Set(recentEntries.map((entry) => entry.staffId)));
  }, []);

  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 6.5244, longitude: 3.3792 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve({
            latitude: 6.5244 + (Math.random() - 0.5) * 0.01,
            longitude: 3.3792 + (Math.random() - 0.5) * 0.01,
          });
        }
      );
    });
  };

  const handleClockAction = async (action: "clock-in" | "clock-out") => {
    try {
      const userLocation = await getCurrentLocation();
      const distance =
        calculateDistance(
          locationSettings.latitude,
          locationSettings.longitude,
          userLocation.latitude,
          userLocation.longitude
        ) * 1000;

      if (distance > locationSettings.radius) {
        message.error(
          `You must be within ${locationSettings.radius}m of the workplace to ${action}`
        );
        return;
      }

      const staff = mockStaff[0];
      const now = new Date();
      const locationStr = `${userLocation.latitude.toFixed(
        6
      )}, ${userLocation.longitude.toFixed(6)}`;

      if (action === "clock-in") {
        if (currentlyClockedIn.has(staff.id)) {
          message.warning("You are already clocked in!");
          return;
        }

        const newEntry: TimeEntry = {
          id: `${staff.id}-${Date.now()}`,
          staffId: staff.id,
          staffName: staff.name,
          clockIn: now,
          clockOut: null,
          clockInLocation: locationStr,
          clockOutLocation: null,
          hoursWorked: null,
        };

        setTimeEntries((prev) => [newEntry, ...prev]);
        setCurrentlyClockedIn((prev) => new Set([...prev, staff.id]));
        message.success("Clocked in successfully!");
      } else {
        if (!currentlyClockedIn.has(staff.id)) {
          message.warning("You are not clocked in!");
          return;
        }

        setTimeEntries((prev) =>
          prev.map((entry) => {
            if (entry.staffId === staff.id && !entry.clockOut) {
              const clockOut = now;
              const hoursWorked = (
                (clockOut.getTime() - entry.clockIn.getTime()) /
                (1000 * 60 * 60)
              ).toFixed(2);
              return {
                ...entry,
                clockOut,
                clockOutLocation: locationStr,
                hoursWorked,
              };
            }
            return entry;
          })
        );

        setCurrentlyClockedIn((prev) => {
          const newSet = new Set(prev);
          newSet.delete(staff.id);
          return newSet;
        });
        message.success("Clocked out successfully!");
      }
    } catch {
      message.error("Failed to get location. Please enable location services.");
    }
  };

  const updateLocationSettings = (values: LocationSettings) => {
    setLocationSettings({
      latitude: parseFloat(String(values.latitude)),
      longitude: parseFloat(String(values.longitude)),
      radius: parseInt(String(values.radius)),
    });
    message.success("Location settings updated successfully!");
    setLocationModalVisible(false);
  };

  // Dashboard calculations
  const last7Days = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.clockIn);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });

  const avgHoursPerDay =
    last7Days.length > 0
      ? (
          last7Days.reduce(
            (sum, entry) => sum + parseFloat(entry.hoursWorked || "0"),
            0
          ) / 7
        ).toFixed(2)
      : "0";

  const dailyClockIns = last7Days.reduce(
    (acc: Record<string, number>, entry) => {
      const date = entry.clockIn.toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  const avgDailyClockIns =
    Object.values(dailyClockIns).length > 0
      ? (Object.values(dailyClockIns).reduce((a, b) => a + b, 0) / 7).toFixed(1)
      : "0";

  const weeklyHoursByStaff: WeeklyHours[] = mockStaff.map((staff) => {
    const staffEntries = last7Days.filter(
      (entry) => entry.staffId === staff.id
    );
    const totalHours = staffEntries.reduce(
      (sum, entry) => sum + parseFloat(entry.hoursWorked || "0"),
      0
    );
    return {
      ...staff,
      weeklyHours: totalHours.toFixed(2),
    };
  });

  const currentlyWorkingColumns = [
    {
      title: "Staff",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Staff) => (
        <Space>
          <Avatar size="small">{record.avatar}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.role}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Clock In Time",
      dataIndex: "clockIn",
      key: "clockIn",
      render: (time: Date) => (time ? time.toLocaleString() : "-"),
    },
    {
      title: "Duration",
      key: "duration",
      render: (_: unknown, record: any) => {
        if (record.clockIn) {
          const duration =
            (new Date().getTime() - record.clockIn.getTime()) /
            (1000 * 60 * 60);
          return `${duration.toFixed(1)}h`;
        }
        return "-";
      },
    },
    {
      title: "Location",
      dataIndex: "clockInLocation",
      key: "clockInLocation",
      render: (location: string) =>
        location ? (
          <Text copyable style={{ fontSize: "12px" }}>
            {location}
          </Text>
        ) : (
          "-"
        ),
    },
  ];

  const timeHistoryColumns = [
    {
      title: "Staff",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Clock In",
      dataIndex: "clockIn",
      key: "clockIn",
      render: (time: Date) => time.toLocaleString(),
    },
    {
      title: "Clock Out",
      dataIndex: "clockOut",
      key: "clockOut",
      render: (time: Date | null) =>
        time ? time.toLocaleString() : <Tag color="green">Working</Tag>,
    },
    {
      title: "Hours",
      dataIndex: "hoursWorked",
      key: "hoursWorked",
      render: (hours: string | null) => (hours ? `${hours}h` : "-"),
    },
    {
      title: "In Location",
      dataIndex: "clockInLocation",
      key: "clockInLocation",
      render: (location: string) => (
        <Text copyable style={{ fontSize: "11px" }}>
          {location}
        </Text>
      ),
    },
    {
      title: "Out Location",
      dataIndex: "clockOutLocation",
      key: "clockOutLocation",
      render: (location: string | null) =>
        location ? (
          <Text copyable style={{ fontSize: "11px" }}>
            {location}
          </Text>
        ) : (
          "-"
        ),
    },
  ];

  const weeklyHoursColumns = [
    {
      title: "Staff",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Staff) => (
        <Space>
          <Avatar size="small">{record.avatar}</Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.role}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Total Hours (7 days)",
      dataIndex: "weeklyHours",
      key: "weeklyHours",
      render: (hours: string) => `${hours}h`,
      sorter: (a: WeeklyHours, b: WeeklyHours) =>
        parseFloat(a.weeklyHours) - parseFloat(b.weeklyHours),
    },
  ];

  const currentlyWorkingData = mockStaff
    .filter((staff) => currentlyClockedIn.has(staff.id))
    .map((staff) => {
      const activeEntry = timeEntries.find(
        (entry) => entry.staffId === staff.id && !entry.clockOut
      );
      return {
        key: staff.id,
        ...staff,
        clockIn: activeEntry?.clockIn,
        clockInLocation: activeEntry?.clockInLocation,
      };
    });

  if (userRole === "worker") {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Row justify="space-between" align="middle">
            <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
              Healthcare Clock System
            </Title>
            <Button onClick={() => setUserRole("manager")}>
              Switch to Manager View
            </Button>
          </Row>
        </Header>

        <Content
          style={{ padding: "24px", maxWidth: "400px", margin: "0 auto" }}
        >
          <Card
            title={
              <Space>
                <Avatar size="large">👩‍⚕️</Avatar>
                <div>
                  <div style={{ fontWeight: 600 }}>Dr. Sarah Johnson</div>
                  <Text type="secondary">Doctor</Text>
                </div>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleClockAction("clock-in")}
                  disabled={currentlyClockedIn.has(1)}
                  style={{ height: "60px", fontSize: "16px" }}
                >
                  Clock In
                </Button>
              </Col>
              <Col span={24}>
                <Button
                  danger
                  size="large"
                  block
                  icon={<MinusCircleOutlined />}
                  onClick={() => handleClockAction("clock-out")}
                  disabled={!currentlyClockedIn.has(1)}
                  style={{ height: "60px", fontSize: "16px" }}
                >
                  Clock Out
                </Button>
              </Col>
            </Row>

            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <Text type="secondary">
                Status:{" "}
                {currentlyClockedIn.has(1) ? (
                  <Tag color="green">Clocked In</Tag>
                ) : (
                  <Tag color="red">Clocked Out</Tag>
                )}
              </Text>
            </div>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#fff" }}>
        <div style={{ padding: "24px 16px" }}>
          <Title level={4} style={{ color: "#1890ff", margin: 0 }}>
            Manager Dashboard
          </Title>
        </div>

        <div style={{ padding: "0 16px" }}>
          <Button
            type="link"
            block
            style={{ textAlign: "left", marginBottom: "8px" }}
            onClick={() => setUserRole("worker")}
          >
            Switch to Worker View
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Row justify="space-between" align="middle">
            <Title level={3} style={{ margin: 0 }}>
              Healthcare Clock Management
            </Title>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setLocationModalVisible(true)}
            >
              Location Settings
            </Button>
          </Row>
        </Header>

        <Content style={{ padding: "24px" }}>
          <Tabs defaultActiveKey="dashboard">
            <Tabs.TabPane
              tab={
                <span>
                  <DashboardOutlined />
                  Dashboard
                </span>
              }
              key="dashboard"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Avg Hours/Day (Last 7 days)"
                      value={avgHoursPerDay}
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
                      value={currentlyWorkingData.length}
                      valueStyle={{ color: "#722ed1" }}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
                <Col span={24}>
                  <Card title="Weekly Hours by Staff (Last 7 Days)">
                    <Table
                      columns={weeklyHoursColumns}
                      dataSource={weeklyHoursByStaff}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <span>
                  <TeamOutlined />
                  Currently Working
                </span>
              }
              key="current"
            >
              <Card>
                <Table
                  columns={currentlyWorkingColumns}
                  dataSource={currentlyWorkingData}
                  pagination={false}
                  locale={{ emptyText: "No staff currently clocked in" }}
                />
              </Card>
            </Tabs.TabPane>

            <Tabs.TabPane
              tab={
                <span>
                  <ClockCircleOutlined />
                  Time History
                </span>
              }
              key="history"
            >
              <Card>
                <Table
                  columns={timeHistoryColumns}
                  dataSource={timeEntries}
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                />
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Content>
      </Layout>

      <Modal
        title="Location Settings"
        open={locationModalVisible}
        onCancel={() => setLocationModalVisible(false)}
        footer={null}
      >
        <div>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}
            >
              Workplace Latitude
            </label>
            <Input
              type="number"
              step="any"
              value={locationSettings.latitude}
              //   onChange={(e) => setLocationSettings(prev => ({ ...prev, latitude: e.target.value }))}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}
            >
              Workplace Longitude
            </label>
            <Input
              type="number"
              step="any"
              value={locationSettings.longitude}
              //   onChange={(e) => setLocationSettings(prev => ({ ...prev, longitude: e.target.value }))}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{ display: "block", marginBottom: "4px", fontWeight: 500 }}
            >
              Allowed Radius (meters)
            </label>
            <Input
              type="number"
              value={locationSettings.radius}
              //   onChange={(e) => setLocationSettings(prev => ({ ...prev, radius: e.target.value }))}
            />
          </div>

          <Space>
            <Button
              type="primary"
              onClick={() => updateLocationSettings(locationSettings)}
            >
              Update Settings
            </Button>
            <Button onClick={() => setLocationModalVisible(false)}>
              Cancel
            </Button>
          </Space>
        </div>
      </Modal>
    </Layout>
  );
}
