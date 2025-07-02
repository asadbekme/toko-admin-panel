"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Table, Typography, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useAuth } from "@/hooks/use-auth";

const { Title } = Typography;

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

interface ApiResponse {
  page: number;
  items: Product[];
  total_count: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { user } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchProducts = async (page = 1, size = 10) => {
    if (!user?.token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://toko.ox-sys.com/variations?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data: ApiResponse = await response.json();
        setProducts(data.items);
        setPagination((prev) => ({
          ...prev,
          current: data.page,
          total: data.total_count,
        }));
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
    fetchProducts();
  }, [user]);

  const handleTableChange = (paginationInfo: TablePaginationConfig) => {
    fetchProducts(paginationInfo.current, paginationInfo.pageSize);
  };

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
      render: (text: string) => text || "Nomi mavjud emas",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 150,
    },
    {
      title: "Yetkazib beruvchi",
      dataIndex: "supplier",
      key: "supplier",
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
    {
      title: "Bozorda ko'rsatish",
      dataIndex: "showMarket",
      key: "showMarket",
      width: 150,
      render: (value: boolean) => (value ? "Ha" : "Yo'q"),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Title level={2}>Mahsulotlar ro'yxati</Title>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} ta mahsulot`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default ProductsPage;
