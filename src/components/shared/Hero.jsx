import React from "react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

const features = [
  { title: "Smart Routes", color: "text-indigo-500" },
  { title: "Optimized Trips", color: "text-purple-500" },
  { title: "AI Recommendations", color: "text-pink-500" },
];

const Hero = () => {
  const navigate = useNavigate(); // ✅ initialize navigate
  const { scrollY } = useViewportScroll();
  const yBlob1 = useTransform(scrollY, [0, 500], [0, -50]);
  const yBlob2 = useTransform(scrollY, [0, 500], [0, 30]);
  const yBlob3 = useTransform(scrollY, [0, 500], [0, -20]);
  const yHeading = useTransform(scrollY, [0, 500], [0, -30]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
      {/* Floating Blobs */}
      <motion.div style={{ y: yBlob1 }} className="absolute top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-purple-300/20 rounded-full blur-3xl" />
      <motion.div style={{ y: yBlob2 }} className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-pink-300/20 rounded-full blur-3xl" />
      <motion.div style={{ y: yBlob3 }} className="absolute -bottom-24 sm:-bottom-32 left-10 sm:left-20 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-300/20 rounded-full blur-3xl" />

      {/* Animated SVG Wave */}
      <motion.svg className="absolute bottom-0 left-0 w-full h-48" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          fill="url(#gradientWave)"
          d="M0,192L60,181.3C120,171,240,149,360,144C480,139,600,149,720,154.7C840,160,960,160,1080,154.7C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradientWave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-4xl w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg text-sm font-medium"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-50" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
          </span>
          AI-Powered Travel Agent v2.0
        </motion.div>

        {/* Heading */}
        <motion.h1
          style={{ y: yHeading }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 drop-shadow-lg"
        >
          Design Your Dream Getaway in Seconds
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-700 text-base sm:text-lg md:text-xl max-w-md sm:max-w-2xl"
        >
          Tell us where you want to go, and let our AI craft the perfect itinerary tailored to your budget and interests.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button
              onClick={() => navigate("/create-trip")} // ✅ navigate to create-trip
              className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-xl hover:shadow-2xl transition-transform w-full sm:w-auto"
            >
              Start Planning
              <FaArrowRight />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button variant="outline" className="flex items-center justify-center gap-3 px-6 py-3 text-gray-700 border border-gray-300 hover:bg-gray-100 transition-transform w-full sm:w-auto">
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="flex flex-col items-center gap-2 p-4 sm:p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow-md cursor-pointer transition-transform"
            >
              <Plane size={28} className={feature.color} />
              <span className="text-gray-800 font-semibold text-sm sm:text-base text-center">{feature.title}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;