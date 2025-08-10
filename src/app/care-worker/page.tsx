// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Layout,
//   Card,
//   Button,
//   Space,
//   Avatar,
//   Typography,
//   Row,
//   Col,
//   Tag,
//   message,
// } from "antd";
// import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

// const { Header, Content } = Layout;
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
//   clockIn: Date;
//   clockOut: Date | null;
//   clockInLocation: string | null;
//   clockOutLocation: string | null;
//   hoursWorked: string | null;
// }

// const staff: Staff = {
//   id: 1,
//   name: "Dr. Sarah Johnson",
//   role: "Doctor",
//   avatar: "👩‍⚕️",
// };

// const CareWorkerPage = () => {
//   const [currentlyClockedIn, setCurrentlyClockedIn] = useState<boolean>(false);
//   const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

//   useEffect(() => {
//     // On mount, check if there's a current active clock-in entry
//     const activeEntry = timeEntries.find(
//       (entry) => entry.staffId === staff.id && !entry.clockOut
//     );
//     setCurrentlyClockedIn(Boolean(activeEntry));
//   }, [timeEntries]);

//   const getCurrentLocation = (): Promise<{
//     latitude: number;
//     longitude: number;
//   }> => {
//     return new Promise((resolve) => {
//       if (!navigator.geolocation) {
//         resolve({ latitude: 6.5244, longitude: 3.3792 });
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           resolve({
//             latitude: pos.coords.latitude,
//             longitude: pos.coords.longitude,
//           });
//         },
//         () => {
//           resolve({ latitude: 6.5244, longitude: 3.3792 });
//         }
//       );
//     });
//   };

//   const handleClockAction = async (action: "clock-in" | "clock-out") => {
//     try {
//       const location = await getCurrentLocation();
//       const locationStr = `${location.latitude.toFixed(
//         6
//       )}, ${location.longitude.toFixed(6)}`;
//       const now = new Date();

//       if (action === "clock-in") {
//         if (currentlyClockedIn) {
//           message.warning("You are already clocked in!");
//           return;
//         }
//         const newEntry: TimeEntry = {
//           id: `${staff.id}-${Date.now()}`,
//           staffId: staff.id,
//           clockIn: now,
//           clockOut: null,
//           clockInLocation: locationStr,
//           clockOutLocation: null,
//           hoursWorked: null,
//         };
//         setTimeEntries((prev) => [newEntry, ...prev]);
//         setCurrentlyClockedIn(true);
//         message.success("Clocked in successfully!");
//       } else {
//         if (!currentlyClockedIn) {
//           message.warning("You are not clocked in!");
//           return;
//         }
//         setTimeEntries((prev) =>
//           prev.map((entry) => {
//             if (entry.staffId === staff.id && !entry.clockOut) {
//               const clockOut = now;
//               const hoursWorked = (
//                 (clockOut.getTime() - entry.clockIn.getTime()) /
//                 (1000 * 60 * 60)
//               ).toFixed(2);
//               return {
//                 ...entry,
//                 clockOut,
//                 clockOutLocation: locationStr,
//                 hoursWorked,
//               };
//             }
//             return entry;
//           })
//         );
//         setCurrentlyClockedIn(false);
//         message.success("Clocked out successfully!");
//       }
//     } catch {
//       message.error("Failed to get location. Please enable location services.");
//     }
//   };

//   return (
//     <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
//       <Header
//         style={{
//           background: "#fff",
//           padding: "0 24px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Row justify="center" align="middle">
//           <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
//             Healthcare Clock System
//           </Title>
//         </Row>
//       </Header>

//       <Content style={{ padding: "24px", maxWidth: "400px", margin: "0 auto" }}>
//         <Card
//           title={
//             <Space>
//               <Avatar size="large">{staff.avatar}</Avatar>
//               <div>
//                 <div style={{ fontWeight: 600 }}>{staff.name}</div>
//                 <Text type="secondary">{staff.role}</Text>
//               </div>
//             </Space>
//           }
//         >
//           <Row gutter={[16, 16]}>
//             <Col span={24}>
//               <Button
//                 type="primary"
//                 size="large"
//                 block
//                 icon={<CheckCircleOutlined />}
//                 onClick={() => handleClockAction("clock-in")}
//                 disabled={currentlyClockedIn}
//                 style={{ height: "60px", fontSize: "16px" }}
//               >
//                 Clock In
//               </Button>
//             </Col>
//             <Col span={24}>
//               <Button
//                 danger
//                 size="large"
//                 block
//                 icon={<MinusCircleOutlined />}
//                 onClick={() => handleClockAction("clock-out")}
//                 disabled={!currentlyClockedIn}
//                 style={{ height: "60px", fontSize: "16px" }}
//               >
//                 Clock Out
//               </Button>
//             </Col>
//           </Row>

//           <div style={{ marginTop: "24px", textAlign: "center" }}>
//             <Text type="secondary">
//               Status:{" "}
//               {currentlyClockedIn ? (
//                 <Tag color="green">Clocked In</Tag>
//               ) : (
//                 <Tag color="red">Clocked Out</Tag>
//               )}
//             </Text>
//           </div>
//         </Card>
//       </Content>
//     </Layout>
//   );
// };

// export default CareWorkerPage;

"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Button,
  Space,
  Avatar,
  Typography,
  Row,
  Col,
  Tag,
  message,
} from "antd";
import { CheckCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useQuery, useMutation, gql } from "@apollo/client";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const GET_HISTORY = gql`
  query GetHistory {
    getHistory {
      id
      clockInAt
      clockOutAt
      clockInLat
      clockInLng
      clockOutLat
      clockOutLng
      clockInNote
      clockOutNote
      userId
    }
  }
`;

const CLOCK_IN = gql`
  mutation ClockIn($lat: Float!, $lng: Float!, $note: String) {
    clockIn(lat: $lat, lng: $lng, note: $note) {
      id
      clockInAt
    }
  }
`;

const CLOCK_OUT = gql`
  mutation ClockOut($lat: Float!, $lng: Float!, $note: String) {
    clockOut(lat: $lat, lng: $lng, note: $note) {
      id
      clockOutAt
    }
  }
`;

// Example logged-in user info
const loggedInStaff = {
  id: "1",
  name: "Dr. Sarah Johnson",
  role: "Doctor",
  avatar: "👩‍⚕️",
};

const CareWorkerPage = () => {
  const [currentlyClockedIn, setCurrentlyClockedIn] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_HISTORY);
  const [clockInMutation, { loading: clockInLoading }] = useMutation(CLOCK_IN);
  const [clockOutMutation, { loading: clockOutLoading }] =
    useMutation(CLOCK_OUT);

  // Find active clock-in entry for the logged-in user
  useEffect(() => {
    if (!data?.getHistory) {
      setCurrentlyClockedIn(false);
      return;
    }
    const activeEntry = data.getHistory.find(
      (entry: { userId: string; clockOutAt: Date }) =>
        entry.userId === loggedInStaff.id && !entry.clockOutAt
    );
    setCurrentlyClockedIn(Boolean(activeEntry));
  }, [data]);

  // Helper to get current location, fallback to default if denied
  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 6.5244, longitude: 3.3792 }); // Default coords
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          resolve({ latitude: 6.5244, longitude: 3.3792 }); // Default coords on error
        }
      );
    });
  };

  const handleClockAction = async (action: "clock-in" | "clock-out") => {
    try {
      const location = await getCurrentLocation();
      const note = ""; // Optional note, can extend UI later

      if (action === "clock-in") {
        if (currentlyClockedIn) {
          message.warning("You are already clocked in!");
          return;
        }
        await clockInMutation({
          variables: { lat: location.latitude, lng: location.longitude, note },
        });
        message.success("Clocked in successfully!");
      } else {
        if (!currentlyClockedIn) {
          message.warning("You are not clocked in!");
          return;
        }
        await clockOutMutation({
          variables: { lat: location.latitude, lng: location.longitude, note },
        });
        message.success("Clocked out successfully!");
      }
      refetch();
    } catch (err) {
      message.error(
        "Failed to get location or complete action. Please enable location services."
      );
    }
  };

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error loading history data.</p>;

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row justify="center" align="middle">
          <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
            Healthcare Clock System
          </Title>
        </Row>
      </Header>

      <Content style={{ padding: "24px", maxWidth: 400, margin: "0 auto" }}>
        <Card
          title={
            <Space>
              <Avatar size="large">{loggedInStaff.avatar}</Avatar>
              <div>
                <div style={{ fontWeight: 600 }}>{loggedInStaff.name}</div>
                <Text type="secondary">{loggedInStaff.role}</Text>
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
                disabled={
                  currentlyClockedIn || clockInLoading || clockOutLoading
                }
                style={{ height: 60, fontSize: 16 }}
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
                disabled={
                  !currentlyClockedIn || clockInLoading || clockOutLoading
                }
                style={{ height: 60, fontSize: 16 }}
              >
                Clock Out
              </Button>
            </Col>
          </Row>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Text type="secondary">
              Status:{" "}
              {currentlyClockedIn ? (
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
};

export default CareWorkerPage;
