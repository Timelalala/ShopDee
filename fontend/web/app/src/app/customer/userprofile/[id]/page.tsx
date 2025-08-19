// 1. Importing Dependencies
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { User } from "lucide-react";

// 2. Creating and Exporting a Component
// สร้าง Interface สำหรับข้อมูลลูกค้า
interface Customer {
  custID: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  birthdate: string;
  gender: number;
  address: string;
  imageFile: string;
}

export default function UserProfile() {
  // 2.1 Defining Variables, States, and Handlers
  
  const { id } = useParams(); // รับ custID จาก URL
  const [customer, setCustomer] = useState<Customer | null>(null);

  //เรียก API ด้วย token ที่เก็บไว้ใน localStorage
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("กรุณาเข้าสู่ระบบก่อน");
          window.location.href = "/login"; // redirect ไปหน้า login
          return;
        }

        const response = await axios.get(`http://localhost:4000/api/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // แนบ token
          },
        });

        setCustomer(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");
      }
    };

    fetchProfile();
  }, []);

  if (!customer) {// แสดง Loading ถ้ายังไม่มีข้อมูล
    return <div className="text-center py-10 text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  // 2.2 Returning UI Output  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">โปรไฟล์ผู้ใช้</h2>

        <div className="flex flex-col items-center space-y-4">
          <User className="w-32 h-32 object-cover rounded-full border border-gray-300"/>

          <div className="text-center">
            <h3 className="text-xl font-semibold">
              {customer.firstName} {customer.lastName}
            </h3>
            <p className="text-gray-500">@{customer.username}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2 text-gray-700">
          <p><strong>อีเมล:</strong> {customer.email || "-"}</p>
          <p><strong>เบอร์โทร:</strong> {customer.mobilePhone || "-"}</p>
          <p><strong>วันเกิด:</strong> {customer.birthdate || "-"}</p>
          <p><strong>เพศ:</strong> {customer.gender === 0 ? "ชาย" : "หญิง"}</p>
          <p><strong>ที่อยู่:</strong> {customer.address || "-"}</p>
        </div>
      </div>
    </div>
  );
}