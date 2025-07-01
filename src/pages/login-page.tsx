"use client";

import type React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Spin } from "antd";
import { UserOutlined, LockOutlined, GlobalOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/use-auth";

const { Title } = Typography;

interface LoginForm {
  username: string;
  password: string;
  subdomain: string;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  if (user) {
    return <Navigate to="/products" replace />;
  }

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const success = await login(
        values.username,
        values.password,
        values.subdomain
      );
      if (success) {
        messageApi.success("Tizimga muvaffaqiyatli kirildi!");
      } else {
        messageApi.error("Username, parol yoki subdomain noto'g'ri!");
      }
    } catch (error) {
      messageApi.error("Xatolik yuz berdi!");
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4d9aff 0%, #1890ff 100%)",
      }}
    >
      <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2}>Tizimga kirish</Title>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            username: "user_task",
            password: "user_task",
            subdomain: "toko",
          }}
        >
          {contextHolder}
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Foydalanuvchi nomini kiriting!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Foydalanuvchi nomi"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Parolni kiriting!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Parol"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="subdomain"
            rules={[{ required: true, message: "Subdomain kiriting!" }]}
          >
            <Input
              prefix={<GlobalOutlined />}
              placeholder="Subdomain"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ width: "100%" }}
            >
              {loading ? <Spin size="small" /> : "Kirish"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
