// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Layout,
//   Card,
//   Table,
//   Tabs,
//   Statistic,
//   Row,
//   Col,
//   Space,
//   Avatar,
//   Typography,
//   Modal,
//   Input,
//   Button,
//   Tag,
// } from "antd";
// import {
//   SettingOutlined,
//   DashboardOutlined,
//   TeamOutlined,
//   ClockCircleOutlined,
// } from "@ant-design/icons";

// const { Header, Content, Sider } = Layout;
// const { Title, Text } = Typography;

// interface Staff {
//   id: number;
//   name: string;
//   role: string;
//   avatar: string;
// }

// interface TimeEntry {
//   id: string;
//   staffId: number;
//   staffName: string;
//   clockIn: Date;
//   clockOut: Date | null;
//   clockInLocation: string | null;
//   clockOutLocation: string | null;
//   hoursWorked: string | null;
// }

// interface WeeklyHours extends Staff {
//   weeklyHours: string;
// }

// interface LocationSettings {
//   latitude: number;
//   longitude: number;
//   radius: number;
// }

// // Mock staff
// const mockStaff: Staff[] = [
//   { id: 1, name: "Dr. Sarah Johnson", role: "Doctor", avatar: "👩‍⚕️" },
//   { id: 2, name: "Nurse Mike Chen", role: "Nurse", avatar: "👨‍⚕️" },
//   { id: 3, name: "Lisa Williams", role: "Nurse", avatar: "👩‍⚕️" },
//   { id: 4, name: "David Brown", role: "Technician", avatar: "👨‍⚕️" },
//   { id: 5, name: "Maria Garcia", role: "Therapist", avatar: "👩‍⚕️" },
// ];

// // Utility to generate mock time entries (could be replaced with real data)
// const generateMockTimeEntries = (): TimeEntry[] => {
//   const entries: TimeEntry[] = [];
//   const now = new Date();

//   for (let i = 0; i < 30; i++) {
//     const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
//     mockStaff.forEach((staff) => {
//       if (Math.random() > 0.2) {
//         const clockInTime = new Date(date);
//         clockInTime.setHours(
//           Math.floor(Math.random() * 3) + 7,
//           Math.floor(Math.random() * 60)
//         );

//         const hoursWorked = Math.floor(Math.random() * 4) + 6;
//         const clockOutTime = new Date(
//           clockInTime.getTime() + hoursWorked * 60 * 60 * 1000
//         );

//         entries.push({
//           id: `${staff.id}-${i}`,
//           staffId: staff.id,
//           staffName: staff.name,
//           clockIn: clockInTime,
//           clockOut: clockOutTime,
//           clockInLocation: `${(6.5 + Math.random() * 0.002).toFixed(6)}, ${(
//             3.35 +
//             Math.random() * 0.002
//           ).toFixed(6)}`,
//           clockOutLocation: `${(6.5 + Math.random() * 0.002).toFixed(6)}, ${(
//             3.35 +
//             Math.random() * 0.002
//           ).toFixed(6)}`,
//           hoursWorked: (
//             (clockOutTime.getTime() - clockInTime.getTime()) /
//             (1000 * 60 * 60)
//           ).toFixed(2),
//         });
//       }
//     });
//   }
//   return entries.sort((a, b) => b.clockIn.getTime() - a.clockIn.getTime());
// };

// const ManagerPage = () => {
//   const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
//   const [locationSettings, setLocationSettings] = useState<LocationSettings>({
//     latitude: 6.5244,
//     longitude: 3.3792,
//     radius: 2000,
//   });
//   const [locationModalVisible, setLocationModalVisible] = useState(false);

//   useEffect(() => {
//     const mockEntries = generateMockTimeEntries();
//     setTimeEntries(mockEntries);
//   }, []);

//   // Calculate weekly hours by staff
//   const last7Days = timeEntries.filter((entry) => {
//     const entryDate = new Date(entry.clockIn);
//     const weekAgo = new Date();
//     weekAgo.setDate(weekAgo.getDate() - 7);
//     return entryDate >= weekAgo;
//   });

//   const avgHoursPerDay =
//     last7Days.length > 0
//       ? (
//           last7Days.reduce(
//             (sum, entry) => sum + parseFloat(entry.hoursWorked || "0"),
//             0
//           ) / 7
//         ).toFixed(2)
//       : "0";

//   const dailyClockIns = last7Days.reduce<Record<string, number>>(
//     (acc, entry) => {
//       const date = entry.clockIn.toDateString();
//       acc[date] = (acc[date] || 0) + 1;
//       return acc;
//     },
//     {}
//   );

//   const avgDailyClockIns =
//     Object.values(dailyClockIns).length > 0
//       ? (Object.values(dailyClockIns).reduce((a, b) => a + b, 0) / 7).toFixed(1)
//       : "0";

//   const currentlyWorkingData = mockStaff.filter((staff) =>
//     timeEntries.some((entry) => entry.staffId === staff.id && !entry.clockOut)
//   );

//   const weeklyHoursByStaff: WeeklyHours[] = mockStaff.map((staff) => {
//     const staffEntries = last7Days.filter(
//       (entry) => entry.staffId === staff.id
//     );
//     const totalHours = staffEntries.reduce(
//       (sum, entry) => sum + parseFloat(entry.hoursWorked || "0"),
//       0
//     );
//     return {
//       ...staff,
//       weeklyHours: totalHours.toFixed(2),
//     };
//   });

//   const weeklyHoursColumns = [
//     {
//       title: "Staff",
//       dataIndex: "name",
//       key: "name",
//       render: (_: string, record: Staff) => (
//         <Space>
//           <Avatar size="small">{record.avatar}</Avatar>
//           <div>
//             <div style={{ fontWeight: 500 }}>{record.name}</div>
//             <Text type="secondary" style={{ fontSize: "12px" }}>
//               {record.role}
//             </Text>
//           </div>
//         </Space>
//       ),
//     },
//     {
//       title: "Total Hours (7 days)",
//       dataIndex: "weeklyHours",
//       key: "weeklyHours",
//       render: (hours: string) => `${hours}h`,
//       sorter: (a: WeeklyHours, b: WeeklyHours) =>
//         parseFloat(a.weeklyHours) - parseFloat(b.weeklyHours),
//     },
//   ];

//   const currentlyWorkingColumns = [
//     {
//       title: "Staff",
//       dataIndex: "name",
//       key: "name",
//       render: (_: string, record: Staff) => (
//         <Space>
//           <Avatar size="small">{record.avatar}</Avatar>
//           <div>
//             <div style={{ fontWeight: 500 }}>{record.name}</div>
//             <Text type="secondary" style={{ fontSize: "12px" }}>
//               {record.role}
//             </Text>
//           </div>
//         </Space>
//       ),
//     },
//   ];

//   const timeHistoryColumns = [
//     {
//       title: "Staff",
//       dataIndex: "staffName",
//       key: "staffName",
//       render: (text: string, record: TimeEntry) => {
//         const staffData = mockStaff.find((s) => s.name === text);
//         return (
//           <Space>
//             <Avatar size="small">{staffData?.avatar}</Avatar>
//             <div>
//               <div style={{ fontWeight: 500 }}>{record.staffName}</div>
//               <Text type="secondary" style={{ fontSize: "12px" }}>
//                 {mockStaff.find((s) => s.name === text)?.role}
//               </Text>
//             </div>
//           </Space>
//         );
//       },
//     },
//     {
//       title: "Clock In",
//       dataIndex: "clockIn",
//       key: "clockIn",
//       render: (date: Date) => new Date(date).toLocaleString(),
//     },
//     {
//       title: "Clock Out",
//       dataIndex: "clockOut",
//       key: "clockOut",
//       render: (date: Date | null) =>
//         date ? (
//           new Date(date).toLocaleString()
//         ) : (
//           <Tag color="orange">Active</Tag>
//         ),
//     },
//     {
//       title: "Hours Worked",
//       dataIndex: "hoursWorked",
//       key: "hoursWorked",
//       render: (hours: string | null) => (hours ? `${hours}h` : "-"),
//       sorter: (a: TimeEntry, b: TimeEntry) =>
//         parseFloat(a.hoursWorked || "0") - parseFloat(b.hoursWorked || "0"),
//     },
//   ];

//   const handleLocationSave = () => {
//     // Implement saving logic if you want
//     setLocationModalVisible(false);
//   };

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider width={250} style={{ background: "#fff" }}>
//         <div style={{ padding: "24px 16px" }}>
//           <Title level={4} style={{ color: "#1890ff", margin: 0 }}>
//             Manager Dashboard
//           </Title>
//         </div>
//       </Sider>

//       <Layout>
//         <Header
//           style={{
//             background: "#fff",
//             padding: "0 24px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Row justify="space-between" align="middle">
//             <Title level={3} style={{ margin: 0 }}>
//               Healthcare Clock Management
//             </Title>
//             <Button
//               icon={<SettingOutlined />}
//               onClick={() => setLocationModalVisible(true)}
//             >
//               Location Settings
//             </Button>
//           </Row>
//         </Header>

//         <Content style={{ padding: "24px" }}>
//           <Tabs defaultActiveKey="dashboard">
//             <Tabs.TabPane
//               tab={
//                 <span>
//                   <DashboardOutlined />
//                   Dashboard
//                 </span>
//               }
//               key="dashboard"
//             >
//               <Row gutter={[16, 16]}>
//                 <Col xs={24} sm={8}>
//                   <Card>
//                     <Statistic
//                       title="Avg Hours/Day (Last 7 days)"
//                       value={avgHoursPerDay}
//                       suffix="hours"
//                       valueStyle={{ color: "#3f8600" }}
//                     />
//                   </Card>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Card>
//                     <Statistic
//                       title="Avg Daily Clock-ins"
//                       value={avgDailyClockIns}
//                       valueStyle={{ color: "#1890ff" }}
//                     />
//                   </Card>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Card>
//                     <Statistic
//                       title="Currently Working"
//                       value={currentlyWorkingData.length}
//                       valueStyle={{ color: "#722ed1" }}
//                     />
//                   </Card>
//                 </Col>
//               </Row>

//               <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
//                 <Col span={24}>
//                   <Card title="Weekly Hours by Staff (Last 7 Days)">
//                     <Table
//                       columns={weeklyHoursColumns}
//                       dataSource={weeklyHoursByStaff}
//                       pagination={false}
//                       size="small"
//                       rowKey="id"
//                     />
//                   </Card>
//                 </Col>
//               </Row>
//             </Tabs.TabPane>

//             <Tabs.TabPane
//               tab={
//                 <span>
//                   <TeamOutlined />
//                   Currently Working
//                 </span>
//               }
//               key="currentlyWorking"
//             >
//               <Card>
//                 <Table
//                   columns={currentlyWorkingColumns}
//                   dataSource={currentlyWorkingData}
//                   pagination={false}
//                   size="small"
//                   rowKey="id"
//                 />
//               </Card>
//             </Tabs.TabPane>

//             <Tabs.TabPane
//               tab={
//                 <span>
//                   <ClockCircleOutlined />
//                   Time History
//                 </span>
//               }
//               key="timeHistory"
//             >
//               <Card>
//                 <Table
//                   columns={timeHistoryColumns}
//                   dataSource={timeEntries}
//                   pagination={{ pageSize: 10 }}
//                   size="small"
//                   rowKey="id"
//                 />
//               </Card>
//             </Tabs.TabPane>
//           </Tabs>
//         </Content>

//         <Modal
//           title="Location Settings"
//           open={locationModalVisible}
//           onCancel={() => setLocationModalVisible(false)}
//           onOk={handleLocationSave}
//         >
//           <div>
//             <div style={{ marginBottom: "16px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "4px",
//                   fontWeight: 500,
//                 }}
//               >
//                 Workplace Latitude
//               </label>
//               <Input
//                 type="number"
//                 step="any"
//                 value={locationSettings.latitude}
//                 onChange={(e) =>
//                   setLocationSettings((prev) => ({
//                     ...prev,
//                     latitude: parseFloat(e.target.value),
//                   }))
//                 }
//               />
//             </div>

//             <div style={{ marginBottom: "16px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "4px",
//                   fontWeight: 500,
//                 }}
//               >
//                 Workplace Longitude
//               </label>
//               <Input
//                 type="number"
//                 step="any"
//                 value={locationSettings.longitude}
//                 onChange={(e) =>
//                   setLocationSettings((prev) => ({
//                     ...prev,
//                     longitude: parseFloat(e.target.value),
//                   }))
//                 }
//               />
//             </div>

//             <div style={{ marginBottom: "24px" }}>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "4px",
//                   fontWeight: 500,
//                 }}
//               >
//                 Allowed Radius (meters)
//               </label>
//               <Input
//                 type="number"
//                 value={locationSettings.radius}
//                 onChange={(e) =>
//                   setLocationSettings((prev) => ({
//                     ...prev,
//                     radius: parseInt(e.target.value, 10),
//                   }))
//                 }
//               />
//             </div>
//           </div>
//         </Modal>
//       </Layout>
//     </Layout>
//   );
// };

// export default ManagerPage;

"use client";
import { auth0 } from "@/lib/auth0";
// const session = await auth0.();
import React, { useState } from "react";
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
} from "antd";
import {
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    getDashboardStats {
      avgHoursPerDay
      dailyCount
      totalHoursLastWeek
    }
  }
`;

const GET_CARE_WORKERS_CLOCKED_IN = gql`
  query GetCareWorkersClockedIn {
    managerClockedIn {
      id
      name
      role
      email
    }
  }
`;

const GET_SHIFT_HISTORY = gql`
  query GetShiftHistory {
    getHistory {
      id
      clockInAt
      clockOutAt
      userId
    }
  }
`;

const UPSERT_GEOFENCE = gql`
  mutation UpsertGeoFence($lat: Float!, $lng: Float!, $radiusKm: Float!) {
    upsertGeoFence(lat: $lat, lng: $lng, radiusKm: $radiusKm) {
      id
      lat
      lng
      radiusKm
    }
  }
`;

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface TimeEntry {
  id: string;
  clockInAt: string;
  clockOutAt: string | null;
  userId: string;
}

interface WeeklyHours extends Staff {
  weeklyHours: number;
}

const ManagerPage = () => {
  const [locationSettings, setLocationSettings] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
    radius: 2, // kilometers
  });
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery(GET_DASHBOARD_STATS);

  const {
    data: clockedInData,
    loading: clockedInLoading,
    error: clockedInError,
  } = useQuery(GET_CARE_WORKERS_CLOCKED_IN);

  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
  } = useQuery(GET_SHIFT_HISTORY);

  const [upsertGeoFence] = useMutation(UPSERT_GEOFENCE, {
    onCompleted() {
      message.success("Location settings saved.");
      setLocationModalVisible(false);
      refetchStats();
    },
    onError() {
      message.error("Failed to save location settings.");
    },
  });

  // Process shifts and users to compute weekly hours by staff
  const shifts: TimeEntry[] = historyData?.getHistory ?? [];
  const careWorkers: Staff[] = clockedInData?.managerClockedIn ?? [];

  // Aggregate weekly hours per userId
  const weeklyHoursMap: Record<string, number> = {};
  shifts.forEach(({ userId, clockInAt, clockOutAt }) => {
    if (!clockOutAt) return;
    const start = new Date(clockInAt).getTime();
    const end = new Date(clockOutAt).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    weeklyHoursMap[userId] = (weeklyHoursMap[userId] || 0) + hours;
  });

  // Map to WeeklyHours array
  const weeklyHoursByStaff: WeeklyHours[] = careWorkers.map((staff) => ({
    ...staff,
    weeklyHours: Number((weeklyHoursMap[staff.id] || 0).toFixed(2)),
  }));

  const weeklyHoursColumns = [
    {
      title: "Staff",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: WeeklyHours) => (
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

  const currentlyWorkingCount = clockedInData?.managerClockedIn.length ?? 0;
  const avgHoursPerDay = statsData?.getDashboardStats.avgHoursPerDay ?? 0;
  const avgDailyClockIns = statsData?.getDashboardStats.dailyCount ?? 0;

  const handleLocationSave = () => {
    upsertGeoFence({
      variables: {
        lat: locationSettings.latitude,
        lng: locationSettings.longitude,
        radiusKm: locationSettings.radius,
      },
    });
  };

  // if (statsLoading || clockedInLoading || historyLoading)
  //   return <p>Loading...</p>;
  // if (statsError || clockedInError || historyError)
  //   return <p>Error loading data.</p>;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#fff" }}>
        <div style={{ padding: "24px 16px" }}>
          <Title level={4} style={{ color: "#1890ff", margin: 0 }}>
            Manager Dashboard
          </Title>
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
            {/* {session ? (
              <>
                <a href="/auth/login?screen_hint=signup">
                  <button>Sign up</button>
                </a>
                <a href="/auth/login">
                  <button>Log in</button>
                </a>
              </>
            ) : (
              <h1>Welcome, {session!.user.name}!</h1>
            )} */}
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
                      value={currentlyWorkingCount}
                      valueStyle={{ color: "#722ed1" }}
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
              key="currentlyWorking"
            >
              <Card>
                <Table
                  columns={[
                    {
                      title: "Staff",
                      dataIndex: "name",
                      key: "name",
                      render: (_: any, record: Staff) => (
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
              key="timeHistory"
            >
              <Card>
                <Table
                  columns={[
                    {
                      title: "User ID",
                      dataIndex: "userId",
                      key: "userId",
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
                          <Tag color="orange">Active</Tag>
                        ),
                    },
                  ]}
                  dataSource={shifts}
                  pagination={{ pageSize: 10 }}
                  size="small"
                  rowKey="id"
                />
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Content>

        <Modal
          title="Location Settings"
          open={locationModalVisible}
          onCancel={() => setLocationModalVisible(false)}
          onOk={handleLocationSave}
        >
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
            >
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
            <label
              style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
            >
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
            <label
              style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
            >
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
    </Layout>
  );
};

export default ManagerPage;
