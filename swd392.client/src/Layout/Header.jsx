import React, { useState, useEffect } from "react";
import { Search, Globe, ChevronDown, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import AdmissionsPage from "../Pages/AdmissionsPage";

const languages = [
  { code: "en", name: "English" },
  { code: "vi", name: "Tiếng Việt" },
];

const LanguageSelector = ({ onClose }) => {
  const handleLanguageChange = (langCode) => {
    console.log(`Language changed to: ${langCode}`);
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
      <ul className="py-1">
        {languages.map((language) => (
          <li key={language.code}>
            <button
              onClick={() => handleLanguageChange(language.code)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#F2711F]"
            >
              {language.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const UserDropdown = ({ user, onClose }) => {
  // const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem("token");
    onClose();
    // navigate("/tuyen-sinh");
    window.location.reload(); // Refresh to update header state
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 truncate" title={user.email}>
            {user.email}
          </p>
          {user.role && (
            <p className="text-xs text-[#F2711F] font-semibold">
              Role: {user.role}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center"
        >
          <LogOut size={16} className="mr-2" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="flex items-center">
      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm..."
          className="pl-3 pr-10 py-1.5 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F2711F] focus:border-transparent text-sm"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="absolute right-0 top-0 h-full px-2 text-gray-600 hover:text-[#F2711F]"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
};

const AuthButtons = () => {
  const [user, setUser] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Toggle thay vì mouseEnter
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={toggleUserDropdown}
          className="flex items-center text-gray-600 hover:text-[#F2711F] bg-gray-50 hover:bg-orange-50 px-3 py-2 rounded-md transition-colors duration-200 max-w-48"
        >
          <User size={18} className="flex-shrink-0" />
          <span className="ml-2 text-sm font-medium truncate">{user.name}</span>
          <ChevronDown size={16} className="ml-1 flex-shrink-0" />
        </button>

        {isUserDropdownOpen && (
          <UserDropdown
            user={user}
            onClose={() => setIsUserDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link
        to="/login"
        className="bg-[#F2711F] hover:bg-[#E0601A] text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200"
      >
        Đăng nhập
      </Link>
      <Link
        to="/register"
        className="bg-white hover:bg-gray-50 text-[#F2711F] border border-[#F2711F] px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200"
      >
        Đăng ký
      </Link>
    </div>
  );
};

const TopBar = ({ isSticky }) => {
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

  const toggleLanguageSelector = () => {
    setIsLanguageSelectorOpen(!isLanguageSelectorOpen);
  };

  return (
    <div
      className={`bg-white transition-all duration-300 border-b border-gray-200 ${
        isSticky ? "py-2" : "py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img
                src="https://daihoc.fpt.edu.vn/wp-content/uploads/2023/04/cropped-cropped-2021-FPTU-Long-300x93.png"
                alt="logo-fpt"
                className="h-10 w-auto"
              />
            </a>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-[#F2711F] text-sm font-semibold"
              >
                Trang Chủ
              </Link>
              <Link
                to="/sinh-vien"
                className="text-gray-600 hover:text-[#F2711F] text-sm font-semibold"
              >
                Sinh Viên
              </Link>
              <a
                href="/alumni"
                className="text-gray-600 hover:text-[#F2711F] text-sm font-semibold"
              >
                Cựu Sinh Viên
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <SearchBar />
              </div>

              <div className="relative">
                <button
                  onClick={toggleLanguageSelector}
                  className="flex items-center text-gray-600 hover:text-[#F2711F]"
                >
                  <Globe size={20} />
                  <span className="ml-1 text-sm">VI</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>

                {isLanguageSelectorOpen && (
                  <LanguageSelector
                    onClose={() => setIsLanguageSelectorOpen(false)}
                  />
                )}
              </div>

              <AuthButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ item, isSticky, isActive }) => {
  return (
    <li>
      <Link
        to={item.path}
        className={`px-6 hover:bg-[#E0601A] transition-all duration-300 text-white relative group inline-block ${
          isSticky ? "py-3" : "py-4"
        } ${isActive ? "bg-[#E0601A]" : ""}`}
      >
        <span className="tracking-wide">{item.label}</span>
        <span
          className={`absolute bottom-0 left-1/2 h-0.5 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 ${
            isActive ? "w-full left-0" : "w-0"
          }`}
        ></span>
      </Link>
    </li>
  );
};

const MainNavigation = ({ isSticky }) => {
  const navItems = [
    { label: "Giới Thiệu", path: "/gioi-thieu" },
    { label: "Tin Tức và Sự Kiện", path: "/tin-tuc-su-kien" },
    { label: "Ngành Học", path: "/nganh-hoc" },
    { label: "Tuyển Sinh", path: "/tuyen-sinh" },
    { label: "Trải Nghiệm Toàn Cầu", path: "/trai-nghiem-toan-cau" },
  ];

  return (
    <div className="bg-[#F2711F] text-white font-semibold">
      <div className="container mx-auto px-4">
        <div className="flex justify-end items-center">
          <nav className="flex items-center">
            <ul className="flex space-x-[-10px] mr-6">
              {navItems.map((item) => (
                <NavItem key={item.path} item={item} isSticky={isSticky} />
              ))}
            </ul>

            <Link
              to="/lien-he"
              className="bg-white hover:bg-gray-100 text-[#F2711F] font-semibold py-2 px-4 rounded transition-colors duration-300 border border-white font-semibold"
            >
              Liên Hệ
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="">
      <header
        className={`w-full transition-all duration-300 z-50 ${
          isSticky ? "fixed top-0 shadow-md" : "relative"
        }`}
      >
        <TopBar isSticky={isSticky} />
        <MainNavigation isSticky={isSticky} />
      </header>
    </div>
  );
};

export default Header;
