"use client";

import type React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout as AntLayout, Menu, Button, Typography } from "antd";
import {
  LogoutOutlined,
  ShoppingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/use-auth";

const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/products",
      icon: <ShoppingOutlined />,
      label: "Mahsulotlar",
      onClick: () => navigate("/products"),
    },
    {
      key: "/search",
      icon: <SearchOutlined />,
      label: "Qidiruv",
      onClick: () => navigate("/search"),
    },
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider width={200} theme="dark">
        <div style={{ padding: "16px", textAlign: "center" }}>
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Admin Panel
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          theme="dark"
        />
      </Sider>
      <AntLayout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Boshqaruv paneli
          </Title>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Chiqish
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px",
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
