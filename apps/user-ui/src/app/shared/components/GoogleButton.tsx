export default function GoogleButton() {
  return (
    <button className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-2 bg-white hover:bg-gray-50 transition shadow-sm">
      
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.15 0 5.97 1.08 8.2 3.2l6.1-6.1C34.5 2.5 29.6 0 24 0 14.6 0 6.4 5.4 2.6 13.2l7.4 5.7C12 13.2 17.5 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.4 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.2z"
        />
        <path
          fill="#FBBC05"
          d="M10 28.9c-1-2.8-1-5.9 0-8.7l-7.4-5.7C.9 18 0 20.9 0 24s.9 6 2.6 8.5L10 28.9z"
        />
        <path
          fill="#34A853"
          d="M24 48c5.6 0 10.3-1.8 13.7-4.9l-7-5.4c-2 1.3-4.5 2.1-6.7 2.1-6.5 0-12-3.7-14-9.4l-7.4 5.7C6.4 42.6 14.6 48 24 48z"
        />
      </svg>
      
    </button>
  );
}