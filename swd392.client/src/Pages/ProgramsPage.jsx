
import React, { useEffect, useState } from "react";

const API_BASE = "https://localhost:7013/api/programs";

const ProgramsPage = () => {
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
    fetch(`https://localhost:7013/program-detail/${selected}`)
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {(programs || []).map((p, idx) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100 flex flex-col md:flex-row items-stretch hover:shadow-2xl transition-all duration-200"
              >
                <div className="md:w-48 w-full h-48 md:h-auto flex-shrink-0 flex items-center justify-center bg-orange-50">
                  <img
                    src={"https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80"}
                    alt="Program"
                    className="w-32 h-32 object-cover rounded-2xl shadow border border-orange-100"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center p-6">
                  <div className="mb-2">
                    <h3 className="text-2xl font-bold text-orange-700 truncate text-center" title={p.title}>{p.title}</h3>
                    <div className="flex flex-col items-center gap-1 mt-2">
                      {p.admissionRequirements && (
                        <span className="px-3 py-1 rounded-full font-semibold text-xs bg-orange-50 text-orange-700 border border-orange-200 text-center max-w-full truncate" title={p.admissionRequirements}>
                          Yêu cầu: {p.admissionRequirements}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full font-semibold text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'} border ${p.isActive ? 'border-green-200' : 'border-gray-300'} text-center max-w-full`}>
                        {p.isActive ? 'Đang tuyển' : 'Ngừng tuyển'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow transition text-sm"
                      onClick={e => { e.stopPropagation(); setSelected(p.id); }}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal detail */}
        {selected && (
          <>
            {/* Disable body scroll when modal is open */}
            <style>{`body { overflow: hidden !important; }`}</style>
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setSelected(null)}>
              <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-0 relative animate-fade-in overflow-hidden"
                style={{ maxHeight: '92vh', minWidth: '340px', display: 'flex', flexDirection: 'column' }}
                onClick={e => e.stopPropagation()}
              >
                <div
                  className="overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50"
                  style={{ maxHeight: '92vh', width: '100%' }}
                >
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-orange-500 text-2xl font-bold z-10" onClick={() => setSelected(null)}>&times;</button>
                  {loadingDetail ? (
                    <div className="text-orange-500 text-lg font-semibold animate-pulse p-10">Đang tải chi tiết...</div>
                  ) : errorDetail ? (
                    <div className="text-red-500 text-lg font-semibold p-10">{errorDetail}</div>
                  ) : detail ? (
                    <div className="flex flex-col items-center p-0 w-full break-words">
                      <div className="w-full h-48 md:h-56 bg-orange-50 flex items-center justify-center border-b border-orange-100 relative">
                        <img
                          src={"https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80"}
                          alt="Program"
                          className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-2xl shadow-lg border-2 border-orange-200 bg-orange-50 absolute left-1/2 -translate-x-1/2 top-8"
                          style={{zIndex:2}}
                        />
                      </div>
                      <div className="w-full flex flex-col items-center px-6 pt-24 pb-8">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-orange-500 drop-shadow-lg mb-2 text-center leading-tight break-words">{detail.title}</h2>
                        <div className="flex flex-wrap gap-2 mb-4 justify-center">
                          <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold text-lg">
                            Học phí: {Number(detail.tuitionFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </span>
                          <span className={`px-4 py-2 rounded-xl font-semibold text-base ${detail.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{detail.isActive ? 'Đang tuyển' : 'Ngừng tuyển'}</span>
                        </div>
                        <div className="w-full bg-gray-50 rounded-xl p-4 mb-3">
                          <div className="font-semibold text-orange-500 mb-1">Mô tả ngành học</div>
                          <div className="text-gray-700 whitespace-pre-line text-base break-words">{detail.description}</div>
                        </div>
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="bg-orange-50 rounded-xl p-4">
                            <div className="font-semibold text-orange-500 mb-1">Yêu cầu tuyển sinh</div>
                            <div className="text-gray-700 text-sm break-words">{detail.admissionRequirements}</div>
                          </div>
                          {detail.dormitoryInfo && (
                            <div className="bg-blue-50 rounded-xl p-4">
                              <div className="font-semibold text-blue-500 mb-1">Ký túc xá</div>
                              <div className="text-blue-900 text-sm break-words">{detail.dormitoryInfo}</div>
                            </div>
                          )}
                        </div>
                        {detail.courses && detail.courses.length > 0 && (
                          <div className="w-full mt-2">
                            <div className="font-semibold text-orange-500 mb-1">Các môn học tiêu biểu:</div>
                            <ul className="list-disc list-inside text-gray-700 text-sm pl-4">
                              {detail.courses.map((c, i) => <li key={i} className="break-words">{c}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgramsPage;