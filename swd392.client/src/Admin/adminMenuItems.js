import { BookOpen, PlusCircle, Users, UserCheck } from "lucide-react";
import { FaQuestionCircle } from "react-icons/fa";

const adminMenuItems = [
  {
    id: "majors",
    name: "Quản lý ngành học",
    icon: BookOpen,
    description: "Xem, thêm, sửa, xóa các ngành học.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    active: false,
    onClick: () => (window.location.href = "/admin/majors"),
    className: "cursor-pointer",
  },
  {
    id: "articles",
    name: "Quản lý FAQ",
    icon: FaQuestionCircle,
    description: "Xem, sửa, xóa các FAQ.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    active: false,
    onClick: () => (window.location.href = "/admin/faq"),
    className: "cursor-pointer",
  },
  {
    id: "upload-article",
    name: "Quản lý bài viết",
    icon: PlusCircle,
    description: "Xem, sửa, xóa các bài viết đã đăng.",
    color: "text-green-600",
    bgColor: "bg-green-50",
    active: false,
    onClick: () => (window.location.href = "/admin/upload-article"),
    className: "cursor-pointer",
  },
  {
    id: "users",
    name: "Quản lý người dùng",
    icon: Users,
    description: "Xem và quản lý tài khoản.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    active: false,
    onClick: () => (window.location.href = "/admin/users"),
    className: "cursor-pointer",
  },
  {
    id: "ticket-assignment",
    name: "Giao ticket",
    icon: UserCheck,
    description: "Giao ticket cho consultant phù hợp.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    active: false,
    onClick: () => (window.location.href = "/admin/ticket-assignment"),
    className: "cursor-pointer",
  },
  
];

export default adminMenuItems;
