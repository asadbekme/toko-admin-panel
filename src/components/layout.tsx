"use client";

import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout as AntLayout,
  Menu,
  Button,
  Typography,
  Drawer,
  Grid,
} from "antd";
import {
  LogoutOutlined,
  ShoppingOutlined,
  SearchOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/use-auth";

const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/products",
      icon: <ShoppingOutlined />,
      label: "Mahsulotlar",
      onClick: () => {
        navigate("/products");
        setDrawerOpen(false);
      },
    },
    {
      key: "/search",
      icon: <SearchOutlined />,
      label: "Qidiruv",
      onClick: () => {
        navigate("/search");
        setDrawerOpen(false);
      },
    },
  ];

  const isDesktop = screens.lg; // >= 992px

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      {isDesktop ? (
        <Sider
          width={200}
          theme="dark"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            height: "100vh",
            zIndex: 100,
            display: isDesktop ? "block" : "none",
          }}
        >
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
      ) : (
        <Drawer
          title="Admin Panel"
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            theme="light"
          />
        </Drawer>
      )}

      <AntLayout
        style={{ marginLeft: isDesktop ? 200 : 0, minHeight: "100vh" }}
      >
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            left: isDesktop ? 200 : 0,
            right: 0,
            top: 0,
            zIndex: 101,
            height: 64,
            width: isDesktop ? "calc(100% - 200px)" : "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isDesktop && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ fontSize: 16 }}
              />
            )}
            <Title level={3} style={{ margin: 0 }}>
              Boshqaruv paneli
            </Title>
          </div>
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
            margin: "88px 24px 24px 24px",
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            overflow: "auto",
            minHeight: "calc(100vh - 88px)",
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
