"use client";
import { useState, FormEvent } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      try {
        // Mock API response
        const mockResponse = {
          status: true,
          message: "เข้าสู่ระบบสำเร็จ!",
          token: "mock-jwt-token-" + Date.now()
        };

        alert(mockResponse.message);
        
        if (mockResponse.status === true) {
          setToken(mockResponse.token);
          setIsLoggedIn(true);
          // In a real app, you would redirect here
          // window.location.href = "/";
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Login failed.");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-light text-slate-800 mb-2">ยินดีต้อนรับ</h2>
            <p className="text-slate-500 text-sm mb-6">เข้าสู่ระบบสำเร็จแล้ว</p>
            <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg font-mono">
              Token: {token.slice(0, 20)}...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-2xl font-light text-slate-800">เข้าสู่ระบบ</h1>
          <p className="text-slate-500 text-sm mt-2">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full py-4 bg-slate-800 text-white rounded-2xl font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              <span>เข้าสู่ระบบ</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            ลืมรหัสผ่าน? <span className="text-slate-600 hover:text-slate-800 cursor-pointer transition-colors">คลิกที่นี่</span>
          </p>
        </div>
      </div>
    </div>
  );
}