const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#001e2b] to-[#023430] flex items-center justify-center">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-24 h-24 rounded-full border-4 border-white/20 animate-pulse"></div>

        {/* Inner Ring */}
        <div className="absolute left-1/2 top-1/2 w-16 h-16 rounded-full border-4 border-[#00ed64] animate-spin border-t-transparent"></div>

        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#00ed64] rounded-full animate-pulse"></div>

        {/* Loading Text */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
