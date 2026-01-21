export type Job = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "Tech" | "Management" | "Content" | "Outreach" | "Campus Ambassador" | "Design";
  skills: string[];
  type: "Full-time" | "Part-time" | "Internship";
  location: "Remote" | "On-site" | "Hybrid";
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
};

export const jobs: Job[] = [
  {
    id: "1",
    slug: "frontend-developer-intern",
    title: "Frontend Developer Intern",
    description: "Build beautiful, responsive web applications using Next.js and Tailwind CSS.",
    category: "Tech",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    type: "Internship",
    location: "Remote",
    about: "We are looking for a passionate Frontend Developer Intern to join our team. You will work closely with our designers and engineers to build the user interface of our core products.",
    responsibilities: [
      "Develop new user-facing features using React.js and Next.js.",
      "Build reusable components and front-end libraries for future use.",
      "Translate designs and wireframes into high-quality code.",
      "Optimize components for maximum performance across a vast array of web-capable devices and browsers."
    ],
    requirements: [
      "Basic understanding of React.js and its core principles.",
      "Experience with HTML5, CSS3, and JavaScript.",
      "Familiarity with RESTful APIs.",
      "Knowledge of modern authorization mechanisms, such as JSON Web Token."
    ],
    niceToHave: ["Experience with TypeScript.", "Familiarity with Tailwind CSS."]
  },
  {
    id: "2",
    slug: "product-designer",
    title: "Product Designer",
    description: "Design intuitive and stunning user experiences for our growing user base.",
    category: "Design",
    skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
    type: "Full-time",
    location: "Hybrid",
    about: "As a Product Designer at REstart, you will be responsible for defining the user experience of our products. You will work across the entire product lifecycle, from research and strategy to design and execution.",
    responsibilities: [
      "Collaborate with product management and engineering to define and implement innovative solutions for the product direction, visuals and experience.",
      "Execute all visual design stages from concept to final hand-off to engineering.",
      "Conceptualize original ideas that bring simplicity and user friendliness to complex design roadblocks.",
      "Create wireframes, storyboards, user flows, process flows and site maps to effectively communicate interaction and design ideas."
    ],
    requirements: [
      "Proven UI experience.",
      "Demonstrable UI design skills with a strong portfolio.",
      "Solid experience in creating wireframes, storyboards, user flows, process flows and site maps.",
      "Proficiency in Figma, Sketch, or other visual design and wire-framing tools."
    ]
  },
  {
    id: "3",
    slug: "campus-ambassador",
    title: "Campus Ambassador",
    description: "Represent REstart on your campus and build a community of builders.",
    category: "Campus Ambassador",
    skills: ["Communication", "Marketing", "Community Building", "Leadership"],
    type: "Internship",
    location: "On-site",
    about: "The Campus Ambassador program is your chance to represent REstart at your college. You will be the face of REstart, helping us reach students and build a community of passionate individuals.",
    responsibilities: [
      "Promote REstart programs and events on campus.",
      "Organize workshops and meetups.",
      "Connect with student clubs and organizations.",
      "Gather feedback from students to help us improve our offerings."
    ],
    requirements: [
      "Currently enrolled in a college or university.",
      "Strong communication and interpersonal skills.",
      "Active in student communities.",
      "Passionate about technology and entrepreneurship."
    ]
  },
  {
    id: "4",
    slug: "growth-lead",
    title: "Growth Lead",
    description: "Drive user acquisition and engagement through creative marketing strategies.",
    category: "Management",
    skills: ["Growth Hacking", "SEO", "Analytics", "Content Marketing"],
    type: "Full-time",
    location: "Remote",
    about: "We are seeking a Growth Lead to drive our user acquisition and retention strategies. You will experiment with new channels, optimize existing ones, and lead our growth efforts.",
    responsibilities: [
      "Develop and execute growth strategies to increase user acquisition.",
      "Analyze data to identify opportunities for growth.",
      "Run experiments to test new ideas and channels.",
      "Collaborate with the content team to create high-performing content."
    ],
    requirements: [
      "Proven experience in growth marketing or a similar role.",
      "Strong analytical skills and experience with data analysis tools.",
      "Experience with SEO, SEM, and social media marketing.",
      "Creative thinker with a data-driven mindset."
    ]
  },
  {
    id: "5",
    slug: "technical-writer",
    title: "Technical Writer",
    description: "Create clear and concise documentation for our products and APIs.",
    category: "Content",
    skills: ["Writing", "Markdown", "Documentation", "Tech Communication"],
    type: "Part-time",
    location: "Remote",
    about: "As a Technical Writer, you will be responsible for creating high-quality documentation that helps developers user our tools effectively.",
    responsibilities: [
      "Write clear and concise documentation for our APIs and SDKs.",
      "Create tutorials and guides.",
      "Edit and proofread content produced by other team members.",
      "Maintain and update existing documentation."
    ],
    requirements: [
      "Excellent written and verbal communication skills.",
      "Ability to explain technical concepts to a non-technical audience.",
      "Experience with Markdown and documentation tools.",
      "Basic understanding of programming concepts."
    ]
  }
];
