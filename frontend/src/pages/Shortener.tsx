import { useState } from "react";
import type { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { CopyCheckIcon, CopyIcon, Loader2 } from "lucide-react";

interface ShortData {
  code: string;
  fullShortUrl: string;
  qrCode: string;
}

interface ApiError {
  message: string;
}

export function Shortener() {
  const [url, setUrl] = useState("");
  const [shortData, setShortData] = useState<ShortData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortData(null);
    setCopied(false);

    try {
      const res = await axios.post<ShortData>(
        `${import.meta.env.VITE_API_BASE_URL}/shorten`,
        { url },
      );
      setShortData(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setError(axiosErr.response?.data?.message ?? "Erro ao encurtar URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortData) return;
    navigator.clipboard.writeText(shortData.fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-white to-pink-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full py-6 shadow-md bg-white sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-indigo-600 text-center tracking-tight">
          AbreShort
        </h1>
      </header>

      {/* Main Content */}
      <main className="grow flex flex-col items-center justify-center w-full px-4">
        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full transform transition-transform">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="url"
                placeholder="Cole sua URL aqui..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="peer w-full px-4 py-5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hover:-translate-y-0.5 w-full bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg flex justify-center items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              <span>{loading ? "Encurtando..." : "Encurtar URL"}</span>
            </button>
          </form>

          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

          {/* Result Card */}
          {shortData && (
            <div className="mt-4 bg-indigo-50 rounded-2xl p-6 shadow-inner transition  flex flex-col items-center space-y-4">
              <p className="text-gray-700 font-semibold text-lg">
                URL encurtada:
              </p>
              <div className="flex items-center space-x-2 w-full justify-center flex-wrap">
                <a
                  href={shortData.fullShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-700 font-medium hover:underline wrap-break-word"
                >
                  {shortData.fullShortUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-2 rounded-lg text-sm transition flex items-center justify-center"
                >
                  {copied ? (
                    <CopyCheckIcon size={16} />
                  ) : (
                    <CopyIcon size={16} />
                  )}
                </button>
              </div>

              {shortData.qrCode && (
                <div className="mt-1 flex justify-center cursor-pointer">
                  <img
                    src={shortData.qrCode}
                    alt="QR Code"
                    className="w-44 h-44 rounded-xl border border-gray-200 shadow-md hover:scale-105 transition-transform"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-gray-500 text-sm text-center">
        {new Date().getFullYear()} AbreShort.
      </footer>
    </div>
  );
}
