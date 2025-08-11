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
  Spin,
  Modal,
  Input,
  Table,
  Grid,
} from "antd";
import {
  CheckCircleOutlined,
  LogoutOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import {
  CLOCK_IN,
  CLOCK_OUT,
  ClockInOutData,
  ClockInOutVars,
  GET_HISTORY,
  GET_ME,
  HistoryData,
  MeData,
} from "@/lib/careWorkerDashboard";
import { logout } from "@/actions/auth";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { Header, Content } = Layout;

const CareWorkerPage: React.FC = () => {
  const screens = useBreakpoint();
  const [currentlyClockedIn, setCurrentlyClockedIn] = useState<boolean>(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [pendingAction, setPendingAction] = useState<
    "clock-in" | "clock-out" | null
  >(null);
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  // Get current user info
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery<MeData>(GET_ME);

  // Get shift history
  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
    refetch,
  } = useQuery<HistoryData>(GET_HISTORY, {
    variables: { userId: userData?.me?.id },
    skip: !userData?.me?.id,
    fetchPolicy: "network-only",
    // onCompleted: (data) => {
    //   const activeEntry = data.getHistory.find(
    //     (entry) => entry?.user?.id === userData?.me?.id && !entry.clockOutAt
    //   );
    //   setCurrentlyClockedIn(Boolean(activeEntry));
    // },
  });

  const [clockInMutation, { loading: clockInLoading }] = useMutation<
    ClockInOutData,
    ClockInOutVars
  >(CLOCK_IN);

  const [clockOutMutation, { loading: clockOutLoading }] = useMutation<
    ClockInOutData,
    ClockInOutVars
  >(CLOCK_OUT);

  // On mount: restore from localStorage if available
  useEffect(() => {
    const savedStatus = localStorage.getItem("currentlyClockedIn");
    if (savedStatus !== null) {
      setCurrentlyClockedIn(savedStatus === "true");
    }
  }, []);

  // Whenever currentlyClockedIn changes: save to localStorage
  useEffect(() => {
    localStorage.setItem("currentlyClockedIn", String(currentlyClockedIn));
  }, [currentlyClockedIn]);

  useEffect(() => {
    if (!historyData?.getHistoryForWorkers || !userData?.me?.id) return;

    const savedStatus = localStorage.getItem("currentlyClockedIn");
    if (savedStatus !== null) return; // localStorage takes priority

    const activeEntry = historyData.getHistoryForWorkers.find(
      (entry) => entry.user.id === userData.me!.id && !entry.clockOutAt
    );
    setCurrentlyClockedIn(Boolean(activeEntry));
  }, [historyData, userData]);

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

  const openNoteModal = (action: "clock-in" | "clock-out") => {
    setPendingAction(action);
    setNoteText("");
    setNoteModalVisible(true);
  };

  const handleNoteSubmit = async () => {
    if (!pendingAction) return;
    setNoteSubmitting(true);
    try {
      await handleClockAction(pendingAction, noteText || undefined);
    } finally {
      setNoteSubmitting(false);
      setNoteModalVisible(false);
      setPendingAction(null);
      setNoteText("");
    }
  };

  const handleClockAction = async (
    action: "clock-in" | "clock-out",
    note?: string
  ) => {
    try {
      const location = await getCurrentLocation();
      // const note = "";

      if (action === "clock-in") {
        if (currentlyClockedIn) {
          message.warning("You are already clocked in!");
          return;
        }
        const { data } = await clockInMutation({
          variables: { lat: location.latitude, lng: location.longitude, note },
        });
        if (data?.clockIn) {
          setCurrentlyClockedIn(true); // immediate update
          await refetch();
        }
        message.success("Clocked in successfully!");
      } else {
        if (!currentlyClockedIn) {
          message.warning("You are not clocked in!");
          return;
        }
        const { data } = await clockOutMutation({
          variables: { lat: location.latitude, lng: location.longitude, note },
        });
        if (data?.clockOut) {
          setCurrentlyClockedIn(false); // immediate update
          await refetch();
        }
        message.success("Clocked out successfully!");
      }
    } catch (err: unknown) {
      console.error("Clock action error:", err);
    }
  };

  if (userError || historyError) {
    return (
      <div style={{ padding: 20, whiteSpace: "pre-wrap", color: "red" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Text type="danger">
            Error loading data. Please refresh the page.
          </Text>
        </div>

        <div>{JSON.stringify(userError || historyError, null, 2)}</div>
      </div>
    );
  }

  if (!userData?.me) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Text type="warning">Care Worker Login Required</Text>
      </div>
    );
  }

  const user = userData.me;

  return (
    <>
      <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
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
            <Title
              level={3}
              style={{ margin: 0, fontSize: screens.xs ? 18 : 24 }}
            >
              Healthcare Clock Management
            </Title>
          </Space>
          <Space>
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

        <Content
          style={{
            padding: "24px",
            maxWidth: 800,
            height: 500,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Card
            title={
              <Space>
                <Avatar size="large">👩‍⚕️</Avatar>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {user.name || user.email}
                  </div>
                  <Text type="secondary">{user.role}</Text>
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
                  onClick={() => openNoteModal("clock-in")}
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
                  onClick={() => openNoteModal("clock-out")}
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
          {!historyLoading ? (
            <div style={{ marginTop: 24 }}>
              <Title level={4}>Shift History</Title>
              <Table
                columns={[
                  {
                    title: "Clock In",
                    dataIndex: "clockInAt",
                    key: "clockInAt",
                    render: (text: string) =>
                      text ? new Date(text).toLocaleString() : "-",
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
                  {
                    title: "Clock In Note",
                    dataIndex: "clockInNote",
                    key: "clockInNote",
                    render: (note: string | null) => note || "-",
                  },
                  {
                    title: "Clock Out Note",
                    dataIndex: "clockOutNote",
                    key: "clockOutNote",
                    render: (note: string | null) => note || "-",
                  },
                ]}
                dataSource={historyData?.getHistoryForWorkers || []}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                size="small"
              />
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Spin />
            </div>
          )}
        </Content>
      </Layout>
      <Modal
        title={`Add a note (optional) for ${
          pendingAction === "clock-in" ? "Clock In" : "Clock Out"
        }`}
        open={noteModalVisible}
        onOk={handleNoteSubmit}
        okButtonProps={{ loading: noteSubmitting, disabled: noteSubmitting }}
        onCancel={() => setNoteModalVisible(false)}
        okText="Confirm"
      >
        <Input.TextArea
          rows={3}
          placeholder="Type a note or leave empty..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default CareWorkerPage;
