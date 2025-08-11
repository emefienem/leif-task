"use client";
import React from "react";
import { Result, Button, Card, Space, Typography } from "antd";
import {
  LockOutlined,
  HomeOutlined,
  LoginOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";

const { Title, Text } = Typography;

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "none",
        }}
        bodyStyle={{ padding: "40px 32px" }}
      >
        <Result
          status="403"
          icon={<LockOutlined style={{ color: "#ff7875", fontSize: "72px" }} />}
          title={
            <Title level={2} style={{ color: "#262626", marginBottom: "8px" }}>
              Access Denied
            </Title>
          }
          subTitle={
            <div style={{ marginBottom: "24px" }}>
              <Text
                style={{
                  fontSize: "16px",
                  color: "#595959",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                You don't have permission to access this resource.
              </Text>
              <Text style={{ fontSize: "14px", color: "#8c8c8c" }}>
                Please contact your administrator if you believe this is an
                error.
              </Text>
            </div>
          }
          extra={
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Space
                wrap
                size="middle"
                style={{ justifyContent: "center", width: "100%" }}
              >
                <Button
                  type="primary"
                  icon={<HomeOutlined />}
                  size="large"
                  onClick={() => router.push("/")}
                  style={{
                    borderRadius: "6px",
                    height: "44px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                  }}
                >
                  Go Home
                </Button>

                <Button
                  icon={<LoginOutlined />}
                  size="large"
                  onClick={login}
                  style={{
                    borderRadius: "6px",
                    height: "44px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                  }}
                >
                  Login
                </Button>
              </Space>
            </Space>
          }
        />

        <div
          style={{
            marginTop: "32px",
            padding: "16px",
            background: "#fafafa",
            borderRadius: "6px",
            border: "1px solid #f0f0f0",
          }}
        >
          <Text
            style={{
              fontSize: "12px",
              color: "#8c8c8c",
              display: "block",
              textAlign: "center",
            }}
          >
            Error Code: 403 • Unauthorized Access
          </Text>
        </div>
      </Card>
    </div>
  );
}
