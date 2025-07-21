import React, { useEffect, useState } from "react";
import AdminConsultantLayout from "../Layout/AdminConsultantLayout";
import adminMenuItems from "./adminMenuItems";

const API_BASE = "https://localhost:7013/api/programs";
const getToken = () => localStorage.getItem("token");

const emptyMajor = {
  title: "",
  description: "",
  admissionRequirements: "",
  tuitionFee: "",
  dormitoryInfo: "",
  isActive: true,
};

const AdminMajorsPage = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyMajor);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast helper
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Fetch majors
  const fetchMajors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/list-program`);
      if (!res.ok) throw new Error("Không thể tải danh sách ngành học");
      const data = await res.json();
      setMajors(data);
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMajors(); }, []);

  // Add or update major
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { id, ...payload } = form;
      let res;
      if (editId) {
        res = await fetch(`${API_BASE}/update/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
          },
          body: JSON.stringify({
            ...payload,
            tuitionFee: form.tuitionFee === "" ? 0 : Number(form.tuitionFee),
          }),
        });
      } else {
        res = await fetch(`${API_BASE}/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
          },
          body: JSON.stringify({
            ...payload,
            tuitionFee: form.tuitionFee === "" ? 0 : Number(form.tuitionFee),
          }),
        });
      }
      if (!res.ok) throw new Error(editId ? "Lỗi khi cập nhật ngành học" : "Lỗi khi thêm ngành học");
      showToast(editId ? "Cập nhật thành công!" : "Thêm thành công!", "success");
      setShowForm(false);
      setForm(emptyMajor);
      setEditId(null);
      await fetchMajors();
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
      showToast(err.message || "Lỗi không xác định", "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (major) => {
    setForm({
      title: major.title || "",
      description: major.description || "",
      admissionRequirements: major.admissionRequirements || "",
      tuitionFee: major.tuitionFee || "",
      dormitoryInfo: major.dormitoryInfo || "",
      isActive: major.isActive,
    });
    setEditId(major.id);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ngành này?")) return;
    setLoading(true);
    setError("");
    try {
      let res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
      });
      if (!res.ok) {
        res = await fetch(`${API_BASE}/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
          },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Lỗi khi xóa ngành học");
      }
      showToast("Xóa thành công!", "success");
      await fetchMajors();
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
      showToast(err.message || "Lỗi không xác định", "error");
    } finally {
      setLoading(false);
    }
  };

  // Form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <AdminConsultantLayout menuItems={adminMenuItems} userRole="Admin" panelTitle="Quản lý ngành học">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-extrabold mb-8 text-purple-800 tracking-tight flex items-center gap-2">
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
          Quản lý ngành học
        </h2>
        {/* Popup Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 min-w-[260px] px-6 py-3 rounded-xl shadow-2xl text-white text-base font-semibold flex items-center gap-3 transition-all duration-300 animate-fade-in ${toast.type === "success" ? "bg-green-600/95" : "bg-red-600/95"}`}>
            {toast.type === "success" ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {toast.msg}
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <button
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-lg shadow hover:scale-105 transition-transform duration-150"
            onClick={() => { setShowForm(true); setForm(emptyMajor); setEditId(null); }}
          >
            <span className="text-xl">＋</span> Thêm ngành học
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-purple-100 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-1 text-purple-700">Tên ngành</label>
                <input name="title" value={form.title} onChange={handleChange} required className="w-full border-2 border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-purple-700">Học phí</label>
                <input name="tuitionFee" value={form.tuitionFee} onChange={handleChange} type="number" required className="w-full border-2 border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-purple-700">Mô tả</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={2} className="w-full border-2 border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-purple-700">Yêu cầu tuyển sinh</label>
                <input name="admissionRequirements" value={form.admissionRequirements} onChange={handleChange} required className="w-full border-2 border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1 text-purple-700">Thông tin ký túc xá</label>
                <input name="dormitoryInfo" value={form.dormitoryInfo} onChange={handleChange} className="w-full border-2 border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 transition" />
              </div>
              <div className="flex items-center md:col-span-2 mt-2">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="mr-2 accent-purple-600 w-5 h-5" />
                <label className="font-semibold text-purple-700">Đang hoạt động</label>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button type="submit" className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-lg shadow hover:scale-105 transition-transform duration-150">{editId ? "Lưu" : "Thêm"}</button>
              <button type="button" className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition" onClick={() => { setShowForm(false); setForm(emptyMajor); setEditId(null); }}>Hủy</button>
            </div>
          </form>
        )}
        {loading ? (
          <div className="text-center text-purple-500 text-lg font-semibold animate-pulse">Đang tải...</div>
        ) : error ? (
          <div className="text-red-500 mb-4 text-lg font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {majors.map((m) => (
              <div key={m.id} className="bg-white border border-purple-100 rounded-2xl shadow-lg p-6 flex flex-col gap-3 relative group hover:shadow-2xl transition">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: m.isActive ? '#22c55e' : '#ef4444' }}></span>
                  <span className="text-lg font-bold text-purple-800 truncate" title={m.title}>{m.title}</span>
                </div>
                <div className="text-gray-700 text-sm line-clamp-3 min-h-[48px]" title={m.description}>{m.description}</div>
                <div className="flex flex-wrap gap-2 text-sm mt-1">
                  <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-semibold">Học phí: {m.tuitionFee}</span>
                  <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full">{m.isActive ? 'Đang mở' : 'Ngừng tuyển'}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Yêu cầu: {m.admissionRequirements}</div>
                {m.dormitoryInfo && <div className="text-xs text-gray-500">KTX: {m.dormitoryInfo}</div>}
                <div className="flex gap-2 mt-4 justify-end">
                  <button className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow transition flex items-center gap-1" onClick={() => handleEdit(m)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" /></svg>
                    Sửa
                  </button>
                  <button className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow transition flex items-center gap-1" onClick={() => handleDelete(m.id)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminConsultantLayout>
  );
};

export default AdminMajorsPage;
