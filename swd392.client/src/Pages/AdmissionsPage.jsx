
import React, { useEffect, useState } from "react";

const API_BASE = "https://localhost:7013/api/programs";

const AdmissionsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`${API_BASE}/list-program`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách chương trình đào tạo");
        return res.json();
      })
      .then((data) => setPrograms(data))
      .catch((err) => setError(err.message || "Lỗi không xác định"))
      .finally(() => setLoading(false));
  }, []);

  // Fetch detail when selected
  useEffect(() => {
    if (!selected) return;
    setLoadingDetail(true);
    setErrorDetail("");
    setDetail(null);
    fetch(`${API_BASE}/detail/${selected}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải chi tiết chương trình");
        return res.json();
      })
      .then((data) => setDetail(data))
      .catch((err) => setErrorDetail(err.message || "Lỗi không xác định"))
      .finally(() => setLoadingDetail(false));
  }, [selected]);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-10 text-center">Danh sách chương trình đào tạo</h1>
        {loading ? (
          <div className="text-center text-orange-500 text-lg font-semibold animate-pulse">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg font-semibold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {programs.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col gap-2 cursor-pointer border border-orange-100 hover:border-orange-400"
                onClick={() => setSelected(p.id)}
              >
                <h3 className="text-2xl font-bold text-orange-500 mb-2 truncate" title={p.title}>{p.title}</h3>
                <div className="text-gray-700 text-sm min-h-[48px] line-clamp-3" title={p.description}>{p.description}</div>
                <div className="flex flex-wrap gap-2 text-sm mt-1">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">Học phí: {p.tuitionFee}</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{p.isActive ? 'Đang mở' : 'Ngừng tuyển'}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Yêu cầu: {p.admissionRequirements}</div>
                {p.dormitoryInfo && <div className="text-xs text-gray-500">KTX: {p.dormitoryInfo}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Modal detail */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative" onClick={e => e.stopPropagation()}>
              <button className="absolute top-3 right-3 text-gray-400 hover:text-orange-500 text-2xl font-bold" onClick={() => setSelected(null)}>&times;</button>
              {loadingDetail ? (
                <div className="text-orange-500 text-lg font-semibold animate-pulse">Đang tải chi tiết...</div>
              ) : errorDetail ? (
                <div className="text-red-500 text-lg font-semibold">{errorDetail}</div>
              ) : detail ? (
                <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-2">{detail.title}</h2>
                  <div className="text-gray-700 mb-2 whitespace-pre-line">{detail.description}</div>
                  <div className="flex flex-wrap gap-2 text-sm mb-2">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">Học phí: {detail.tuitionFee}</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{detail.isActive ? 'Đang mở' : 'Ngừng tuyển'}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">Yêu cầu: {detail.admissionRequirements}</div>
                  {detail.dormitoryInfo && <div className="text-xs text-gray-500 mb-1">KTX: {detail.dormitoryInfo}</div>}
                  {detail.courses && (
                    <div className="mt-4">
                      <div className="font-semibold text-orange-500 mb-1">Các môn học tiêu biểu:</div>
                      <ul className="list-disc list-inside text-gray-700 text-sm">
                        {detail.courses.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionsPage;
