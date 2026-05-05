import { Search, PlayCircle, ArrowRightCircle } from "lucide-react";
import { motion } from "framer-motion";
import background from "../assets/background.jpg"; // 🔥 use webp
import banner from "../assets/../assets/kaguya.webp"; // 🔥 use webp
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";

const Root = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate(`/search?keyword=${value}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="flex justify-between items-center px-4 md:px-8 py-4">
        <Logo />
        <div className="flex items-center gap-6">
          <Navbar />
          <button className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg font-medium transition">
            Sign In
          </button>
        </div>
      </div>

      {/* Hero Section (🔥 FIXED LCP) */}
      <div className="relative min-h-[calc(100vh-80px)] px-4 md:px-8 py-6 rounded-lg overflow-hidden">
        {/* ✅ LCP image */}
        <img
          src={background}
          alt="Anime background"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

        <div className="relative z-10 pt-10 pb-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              Discover Your Next <span className="text-primary">Anime</span>{" "}
              Obsession
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Explore thousands of anime series, movies, and exclusive content
            </p>
          </motion.div>

          {/* Search */}
          <div className="max-w-3xl mx-auto mb-12">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="relative flex-1">
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="text"
                  placeholder="Search anime..."
                  className="w-full px-5 py-4 bg-white text-black rounded-xl focus:outline-none"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              <button
                type="submit"
                className="bg-primary text-black font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition"
              >
                <Search size={18} />
                Search
              </button>
            </form>
          </div>

          {/* Banner Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 mb-12 md:mb-16 px-4"
          >
            <div className="relative group max-w-sm">
              <motion.img
                whileHover={{ scale: 1.02 }}
                className="banner-img h-auto w-full rounded-xl md:rounded-2xl shadow-2xl"
                src={banner}
                alt="anime banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl md:rounded-2xl opacity-0 group-hover:transition-opacity duration-300"></div>
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                className="absolute top-4 right-4 bg-primary text-black p-2 rounded-full"
              >
              </motion.div>
            </div>

            {/* Features */}
            <div className="text-white max-w-md bg-gray-900/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                <PlayCircle className="text-primary text-2xl" />
                Why Choose AnimeWeebs?
              </h2>

              <ul className="space-y-4 md:space-y-5">
                <li>• 10,000+ anime titles</li>
                <li>• HD streaming quality</li>
                <li>• No ads experience</li>
                <li>• Fast updates</li>
              </ul>
            </div>
          </motion.div>

          {/* CTA */}
          <div className="flex justify-center mt-12">
            <Link
              to="/home"
              className="bg-primary text-black font-bold px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-primary/90 transition"
            >
              Start Exploring
              <ArrowRightCircle />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;
