export const TECH_CATEGORIES = {
    "Web Development": [
        "React", "Vue", "Angular", "Svelte", "Next.js", "Remix", "Astro",
        "Node.js", "Express", "NestJS", "Fastify",
        "TypeScript", "JavaScript", "HTML5", "CSS3", "TailwindCSS",
        "WebAssembly", "GraphQL", "TRPC", "Prisma"
    ],
    "Mobile & Desktop": [
        "React Native", "Flutter", "Swift", "Kotlin", "SwiftUI", "Jetpack Compose",
        "Electron", "Tauri", "Maui", "Xamarin"
    ],
    "Game Development": [
        "Unity", "Unreal Engine 5", "Godot", "Bevy", "Three.js", "WebGL",
        "C#", "C++", "Lua", "Blender"
    ],
    "AI & Data Science": [
        "Python", "PyTorch", "TensorFlow", "OpenAI API", "LangChain",
        "Hugging Face", "Pandas", "NumPy", "Jupyter", "CUDA"
    ],
    "DevOps & Cloud": [
        "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes",
        "Terraform", "Vercel", "Netlify", "Supabase", "Firebase",
        "Linux", "Bash", "CI/CD", "Nginx"
    ],
    "Languages": [
        "Rust", "Go", "Java", "C", "C#", "C++", "Ruby", "PHP",
        "Elixir", "Haskell", "Zig", "Odin"
    ],
    "Content & Design": [
        "Figma", "Adobe CC", "Premiere Pro", "After Effects",
        "Photoshop", "Illustrator", "DaVinci Resolve", "OBS Studio",
        "Affinity Designer", "Affinity Photo", "Affinity Publisher"
    ],
    "Consoles & Platforms": [
        "iOS", "Android", "Windows", "MacOS", "Linux",
        "PlayStation", "Xbox", "Switch", "Steam Deck"
    ],
    "Modern Dev Tools": [
        "Cursor", "Replit", "Lovable", "Antigravity", "CoPilot"
    ]
} as const;

// Deduplicate and flatten
export const ALL_TECH_OPTIONS = Array.from(new Set(Object.values(TECH_CATEGORIES).flat())).sort();
