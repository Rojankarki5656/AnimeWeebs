import { FaArrowCircleRight, FaSearch, FaFire, FaStar, FaPlayCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import banner from "../assets/kaguya.png";
import background from "../assets/background.jpg";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

const Root = () => {
  const [value, setValue] = useState("");
  const [pulse, setPulse] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const changeInput = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?keyword=${value}`);
  };

  const popularSearches = ["Naruto", "One Piece", "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen"];

  return (
    <div className="h-[100dvh] bg-black overflow-y-auto">
      <div className="bg-black">
        {/* Updated Navbar with spacing */}
        <div className="flex justify-between items-center px-4 md:px-8 py-4">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Logo />
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-6 md:space-x-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex space-x-6 md:space-x-8"
            >
            </motion.div>
            <div >
              <Navbar />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Sign In
            </motion.button>
          </div>
        </div>

        <div
          className="relative px-4 md:px-8 py-3 md:py-5 mt-2 rounded-lg bg-cover bg-center min-h-[calc(100vh-80px)]"
          style={{ backgroundImage: `url(${background})` }}
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>
          
          <div className="relative z-10 pt-4 md:pt-8 pb-12">
            {/* Logo with animation (centered) */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center items-center mb-6 md:mb-8"
            >
              <div className="relative">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  ANIME<span className="text-primary">HUB</span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border-2 border-primary/30 rounded-full"
                ></motion.div>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-center mb-10 md:mb-12"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
                Discover Your Next <span className="text-primary">Anime</span> Obsession
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                Explore thousands of anime series, movies, and exclusive content
              </p>
            </motion.div>

            {/* Search Section - FIXED ALIGNMENT */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="max-w-4xl mx-auto mb-10 md:mb-14"
            >
              <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row gap-4 justify-center items-stretch md:items-center"
              >
                <div className="relative w-full md:w-2/3">
                  <motion.div
                    animate={{ 
                      boxShadow: pulse 
                        ? "0 0 20px rgba(255, 105, 0, 0.5)" 
                        : "0 0 10px rgba(255, 105, 0, 0.2)"
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <input
                      value={value}
                      onChange={changeInput}
                      type="text"
                      placeholder="Search anime by title, character, or genre..."
                      className="w-full text-lg px-6 py-4 md:py-5 bg-white/95 text-black rounded-xl md:rounded-2xl border-2 border-primary/50 focus:border-primary focus:outline-none transition-all duration-300"
                    />
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                  </motion.div>
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary hover:bg-primary/90 text-black font-bold px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl h-full"
                >
                  <FaSearch className="text-lg" /> 
                  <span className="hidden md:inline">Search</span>
                </motion.button>
              </form>
            </motion.div>

            {/* Banner Section */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 mb-12 md:mb-16 px-4"
            >
              <div className="relative group max-w-2xl">
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
                  <FaStar />
                </motion.div>
              </div>
              
              {/* Features List */}
              <div className="text-white max-w-md bg-gray-900/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                  <FaPlayCircle className="text-primary text-2xl" /> Why Choose AnimeHub?
                </h3>
                <ul className="space-y-4 md:space-y-5">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">Largest Anime Database</span>
                      <p className="text-gray-400 text-sm mt-1">Access 10,000+ anime titles with detailed information</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">HD Streaming Quality</span>
                      <p className="text-gray-400 text-sm mt-1">Watch in 1080p with multiple subtitle options</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">No Ads Experience</span>
                      <p className="text-gray-400 text-sm mt-1">Enjoy uninterrupted viewing with premium features</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">Regular Updates</span>
                      <p className="text-gray-400 text-sm mt-1">New episodes added within hours of Japanese broadcast</p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Explore Button */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="w-full flex justify-center items-center mt-10 md:mt-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: pulse 
                    ? "0 0 30px rgba(255, 105, 0, 0.7)" 
                    : "0 0 15px rgba(255, 105, 0, 0.4)"
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Link
                  to="/home"
                  className="font-bold bg-primary hover:bg-primary/90 px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl text-lg md:text-xl flex items-center gap-4 group transition-all duration-300"
                >
                  <h1 className="flex text-black font-extrabold justify-center items-center gap-4">
                    <p>Start Exploring Now</p>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <FaArrowCircleRight className="text-xl group-hover:rotate-90 transition-transform duration-300" />
                    </motion.span>
                  </h1>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-16 md:mt-20 flex justify-center px-4"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 w-full max-w-4xl">
                <div className="text-center flex-1 min-w-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
                  <div className="text-gray-300 text-sm md:text-base mt-1">Anime Titles</div>
                </div>
                <div className="text-center flex-1 min-w-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-primary">500K+</div>
                  <div className="text-gray-300 text-sm md:text-base mt-1">Episodes</div>
                </div>
                <div className="text-center flex-1 min-w-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-primary">1M+</div>
                  <div className="text-gray-300 text-sm md:text-base mt-1">Active Users</div>
                </div>
                <div className="text-center flex-1 min-w-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
                  <div className="text-gray-300 text-sm md:text-base mt-1">Support Available</div>
                </div>
              </div>
            </motion.div>

            {/* Additional content for scrolling */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="mt-16 md:mt-20 px-4 max-w-4xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                Popular Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Action", "Adventure", "Romance", "Fantasy", "Sci-Fi", "Comedy", "Drama", "Mystery"].map((category, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="bg-gray-900/40 hover:bg-primary/20 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer border border-gray-800 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="font-medium text-white">{category}</div>
                    <div className="text-xs text-gray-400 mt-1">Explore →</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
                initial={{ y: 0, x: Math.random() * window.innerWidth }}
                animate={{ 
                  y: window.innerHeight,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Root;