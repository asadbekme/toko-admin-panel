"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { Input, Table, Typography, message, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "../hooks/use-auth";

const { Title } = Typography;
const { Search } = Input;

interface Product {
  id: number;
  sku: string;
  supplier: string;
  supplierId: number;
  barcode: string;
  name: string;
  productName: string;
  lastUpdateTime: string;
  showMarket: boolean;
}

const SearchPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAllProducts = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://toko.ox-sys.com/variations?page=1&size=1000",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAllProducts(data.items);
      } else {
        messageApi.error("Ma'lumotlarni yuklashda xatolik!");
      }
    } catch (error) {
      messageApi.error("Server bilan bog'lanishda xatolik!");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [user]);

  // Search algorithm - harflar joylashuviga qarab tartiblanadi
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return allProducts;

    const searchLower = searchTerm.toLowerCase();

    const filtered = allProducts.filter((product) => {
      const productName = product.productName?.toLowerCase() || "";
      return productName.includes(searchLower);
    });

    // Sort algorithm
    return filtered.sort((a, b) => {
      const aName = a.productName?.toLowerCase() || "";
      const bName = b.productName?.toLowerCase() || "";

      const aIndex = aName.indexOf(searchLower);
      const bIndex = bName.indexOf(searchLower);

      // Agar ikkalasida ham topilsa, boshida turganini birinchi qo'yish
      if (aIndex !== -1 && bIndex !== -1) {
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }
        // Agar bir xil joyda bo'lsa, alifbo tartibida
        return aName.localeCompare(bName);
      }

      // Agar faqat birida topilsa
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return aName.localeCompare(bName);
    });
  }, [allProducts, searchTerm]);

  const columns: ColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Nomi",
      dataIndex: "productName",
      key: "productName",
      width: 180,
      render: (text: string) => {
        if (!text || text.trim() === "") {
          return <span>Nomi mavjud emas</span>;
        }
        if (!searchTerm.trim()) return text;

        const searchLower = searchTerm.toLowerCase();
        const textLower = text?.toLowerCase() || "";
        const index = textLower.indexOf(searchLower);

        if (index === -1) return text;

        const before = text.substring(0, index);
        const match = text.substring(index, index + searchTerm.length);
        const after = text.substring(index + searchTerm.length);

        return (
          <>
            {before}
            <span style={{ backgroundColor: "#ffeb3b", fontWeight: "bold" }}>
              {match}
            </span>
            {after}
          </>
        );
      },
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 150,
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
      width: 150,
    },
    {
      title: "Oxirgi yangilanish",
      dataIndex: "lastUpdateTime",
      key: "lastUpdateTime",
      width: 180,
      render: (text: string) => new Date(text).toLocaleString("uz-UZ"),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Title level={2}>Mahsulotlarni qidirish</Title>

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Mahsulot nomini kiriting..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} / ${total} ta natija`,
          }}
          scroll={{ x: 1000 }}
        />
      )}
    </div>
  );
};

export default SearchPage;
