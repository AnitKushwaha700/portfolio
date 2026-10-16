import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anit Kushwaha | Software Developer",
    short_name: "Anit K.",
    description: "Software Developer specializing in React.js, Next.js, Node.js, TypeScript, and full-stack web development.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
