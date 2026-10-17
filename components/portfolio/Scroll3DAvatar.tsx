"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Camera } from "lucide-react";
import ImageUploadModal from "./ImageUploadModal";

interface Scroll3DAvatarProps {
  initialImage: string;
  name: string;
}

export default function Scroll3DAvatar({
  initialImage,
  name,
}: Scroll3DAvatarProps) {
  const [profileImage, setProfileImage] = useState<string>(
    initialImage || "/profile/profile-cutout.png"
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 1024;

  const { scrollYProgress } = useScroll();

  // Smooth spring for fluid 60fps physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 24,
    restDelta: 0.001,
  });

  // Multi-Phase Horizontal Movement across 4-5 scrolls:
  // Phase 1 (0.0 - 0.12, Hero): Right side (+24vw)
  // Phase 2 (0.24 - 0.36, About): Glides to Left side (-24vw)
  // Phase 3 (0.48 - 0.60, Skills): Glides to Right side (+24vw)
  // Phase 4 (0.68 - 0.80, Projects): Glides to Left side (-24vw)
  // Phase 5 (0.88 - 1.00, Contact): Centered / Docked (0vw)
  const x = useTransform(
    smoothProgress,
    [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.7, 0.82, 0.94, 1.0],
    isMobile
      ? ["0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw"]
      : [
          "24vw",
          "24vw",
          "-24vw",
          "-24vw",
          "24vw",
          "24vw",
          "-24vw",
          "-24vw",
          "0vw",
          "0vw",
        ]
  );

  // 3D Rotation along Y-axis:
  // Facing toward the content on the opposite side of the screen
  const rotateY = useTransform(
    smoothProgress,
    [0, 0.12, 0.24, 0.36, 0.48, 0.6, 0.7, 0.82, 0.94, 1.0],
    isMobile
      ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      : [-14, -14, 16, 16, -14, -14, 16, 16, 0, 0]
  );

  // Subtle 3D dynamic tilt along Z-axis
  const rotateZ = useTransform(
    smoothProgress,
    [0, 0.2, 0.35, 0.55, 0.75, 0.9, 1.0],
    [0, -2.5, 2.5, -2.5, 2.5, -1, 0]
  );

  // Scale: full size in Hero, subtle companion scaling in subsequent sections
  const scale = useTransform(
    smoothProgress,
    [0, 0.15, 0.4, 0.8, 1.0],
    isMobile ? [1, 0.88, 0.84, 0.8, 0.76] : [1, 0.9, 0.88, 0.85, 0.82]
  );

  // Opacity: stays vibrant throughout the journey
  const opacity = useTransform(
    smoothProgress,
    [0, 0.05, 0.92, 1.0],
    [1, 1, 1, 0.9]
  );

  return (
    <>
      {/* Fixed 3D Avatar Companion */}
      <div
        className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden"
        style={{ perspective: 1200 }}
      >
        <motion.div
          style={{
            x,
            rotateY,
            rotateZ,
            scale,
            opacity,
            transformStyle: "preserve-3d",
          }}
          className="relative w-[300px] sm:w-[380px] md:w-[440px] lg:w-[480px] aspect-[3/4] flex items-center justify-center"
        >
          {/* Radial Backlight Aura (travels with avatar) */}
          <div className="absolute inset-0 -top-8 rounded-full bg-gradient-to-tr from-red-600/35 via-rose-500/25 to-indigo-600/30 blur-3xl opacity-80 pointer-events-none" />

          {/* Transparent Cutout Avatar - NO square borders, NO clipping box! */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5.5,
              ease: "easeInOut",
            }}
            className="relative w-full h-full filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] group"
          >
            <Image
              src={profileImage}
              alt={name || "Portfolio Profile"}
              fill
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 480px"
              className="object-contain object-bottom pointer-events-none select-none transition-transform duration-500"
              priority
            />

            {/* Quick Upload Action Button Badge */}
            <motion.button
              onClick={() => setIsUploadModalOpen(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="pointer-events-auto absolute bottom-4 right-6 z-30 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0c0d16]/90 hover:bg-red-600 text-gray-200 hover:text-white border border-gray-700/80 hover:border-red-500 shadow-xl shadow-black/80 backdrop-blur-md transition-all duration-300 cursor-pointer text-xs font-semibold"
              aria-label="Upload/Change Profile Picture"
            >
              <Camera className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
              <span className="hidden sm:inline">Change Photo</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Image Upload Modal Dialog */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentImage={profileImage}
        onImageUpdated={(newUrl) => setProfileImage(newUrl)}
      />
    </>
  );
}
