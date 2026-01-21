import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';

const curatedJobs = [
  // ENGINEERING / PRODUCT
  {
    title: "Founding Full-Stack Engineer",
    slug: "founding-full-stack-engineer",
    shortDescription: "Build the core platform from the ground up. High ownership, high impact.",
    fullDescription: "As a Founding Full-Stack Engineer, you will be one of the first engineers on the team, playing a critical role in shaping our technical foundation. You will work directly with the founders to build, scale, and iterate on our core product. This is not just a coding role; it's a product ownership role.",
    responsibilities: [
      "Architect and build scalable full-stack applications using Next.js, Node.js, and MongoDB.",
      "Design and implement RESTful APIs and database schemas.",
      "Collaborate on product design and UX decisions.",
      "Ensure code quality through code reviews and testing.",
      "Optimize application performance for speed and scalability."
    ],
    requirements: [
      "3+ years of experience with modern JavaScript frameworks (React, Next.js, Node.js).",
      "Strong understanding of database design (SQL or NoSQL).",
      "Experience with cloud infrastructure (AWS, Vercel, or similar).",
      "Ability to ship features end-to-end independently.",
      "Passion for education and building user-centric products."
    ],
    niceToHave: ["Experience in an early-stage startup.", "Open source contributions."],
    category: "Tech",
    tags: ["Full-Stack", "Next.js", "TypeScript", "Startup", "Engineering"],
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "Frontend Engineer",
    slug: "frontend-engineer",
    shortDescription: "Craft beautiful, responsive, and high-performance user interfaces.",
    fullDescription: "We are looking for a Frontend Engineer with a keen eye for design and a passion for building smooth, interactive user experiences. You will be responsible for translating designs into pixel-perfect code and ensuring our platform feels premium and responsive across all devices.",
    responsibilities: [
      "Develop and maintain the user interface using React and Tailwind CSS.",
      "Build reusable components and front-end libraries.",
      "Optimize applications for maximum speed and scalability.",
      "Collaborate with designers to ensure design fidelity.",
      "Implement responsive design principles for mobile and desktop."
    ],
    requirements: [
      "2+ years of experience with React and modern CSS (Tailwind preferred).",
      "Strong understanding of the DOM, HTML5, and CSS3.",
      "Experience with state management libraries.",
      "Familiarity with Next.js and server-side rendering.",
      "Attention to detail and a passion for UI perfection."
    ],
    niceToHave: ["Experience with animation libraries (Framer Motion, GSAP).", "Design background."],
    category: "Tech",
    tags: ["Frontend", "React", "Tailwind CSS", "UI/UX"],
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "Backend Engineer",
    slug: "backend-engineer",
    shortDescription: "Design and scale the APIs and infrastructure powering our platform.",
    fullDescription: "We need a Backend Engineer to build robust, secure, and scalable server-side logic. You will handle data storage, API development, and ensure the reliability of our systems as we scale to serve thousands of students.",
    responsibilities: [
      "Design and develop robust APIs using Node.js and Express/Next.js.",
      "Manage and optimize database schemas (MongoDB).",
      "Implement security best practices and data protection measures.",
      "Integrate third-party services (payments, email, etc.).",
      "Monitor system performance and troubleshoot issues."
    ],
    requirements: [
      "3+ years of experience in backend development with Node.js.",
      "Strong proficiency in database management (MongoDB/PostgreSQL).",
      "Experience designing RESTful APIs and microservices.",
      "Knowledge of caching mechanisms (Redis) and authentication (JWT/OAuth).",
      "Experience with CI/CD pipelines."
    ],
    niceToHave: ["Experience with serverless architecture.", "Knowledge of Go or Python."],
    category: "Tech",
    tags: ["Backend", "Node.js", "API", "Database", "Security"],
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "AI / Data Engineer",
    slug: "ai-data-engineer",
    shortDescription: "Leverage data and AI to personalize the learning experience.",
    fullDescription: "Join us to build the intelligence layer of our platform. You will work on recommendation systems, learning analytics, and integrating AI tools to provide personalized guidance to students.",
    responsibilities: [
      "Build data pipelines to collect and process student activity data.",
      "Develop and deploy machine learning models for personalization.",
      "Integrate LLMs to assist with content generation and student queries.",
      "Analyze data to provide actionable insights for product improvement.",
      "Collaborate with the product team to define AI-driven features."
    ],
    requirements: [
      "Experience with Python and ML libraries (TensorFlow, PyTorch, Scikit-learn).",
      "Familiarity with LLM APIs (OpenAI, Anthropic) and prompt engineering.",
      "Strong understanding of data structures and algorithms.",
      "Experience with data storage and processing tools.",
      "Ability to explain complex technical concepts to non-technical stakeholders."
    ],
    niceToHave: ["Experience in EdTech.", "PhD or Masters in related field."],
    category: "Tech",
    tags: ["AI", "Machine Learning", "Data Science", "Python", "LLM"],
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "Product Designer (UI/UX)",
    slug: "product-designer-ui-ux",
    shortDescription: "Shape the visual language and user experience of our educational platform.",
    fullDescription: "We are looking for a Product Designer who can own the end-to-end design process. From user research to high-fidelity prototyping, you will ensure our product is intuitive, accessible, and delightful to use.",
    responsibilities: [
      "Lead design initiatives from concept to execution.",
      "Create wireframes, prototypes, and high-fidelity mockups.",
      "Conduct user research and usability testing.",
      "Maintain and evolve our design system.",
      "Collaborate closely with engineers to ensure implementation quality."
    ],
    requirements: [
      "Portfolio demonstrating strong UI/UX skills.",
      "Proficiency in Figma and prototyping tools.",
      "Understanding of interaction design principles.",
      "Experience designing for web and mobile applications.",
      "Ability to think systematically about design."
    ],
    niceToHave: ["Basic understanding of HTML/CSS.", "Experience in branding."],
    category: "Design",
    tags: ["Product Design", "UI/UX", "Figma", "User Research"],
    location: "Hybrid",
    type: "Full-time"
  },

  // CONTENT / BRAND / COMMUNITY
  {
    title: "Content & Growth Associate",
    slug: "content-growth-associate",
    shortDescription: "Drive our narrative and growth through high-quality content.",
    fullDescription: "You will be responsible for creating compelling content that resonates with our audience. This role sits at the intersection of marketing, branding, and community building.",
    responsibilities: [
      "Create engaging content for social media, blog, and newsletters.",
      "Develop and execute content strategies to drive user acquisition.",
      "Analyze content performance and optimize for reach/engagement.",
      "Collaborate with designers to create visual assets.",
      "Manage our editorial calendar."
    ],
    requirements: [
      "Strong writing and storytelling skills.",
      "Experience with social media management and analytics.",
      "Understanding of SEO and content marketing principles.",
      "Creativity and ability to think outside the box.",
      "Self-starter with ability to manage multiple projects."
    ],
    niceToHave: ["Experience with video editing.", "Graphic design skills."],
    category: "Content",
    tags: ["Content Marketing", "Growth", "Writing", "Social Media"],
    location: "Remote",
    type: "Full-time"
  },
  {
    title: "Visual Designer (Brand & Social)",
    slug: "visual-designer",
    shortDescription: "Define and elevate our brand presence across all channels.",
    fullDescription: "We need a Visual Designer to bring our brand to life. You will create stunning visuals for our marketing campaigns, social media, and digital presence, ensuring a consistent and premium look.",
    responsibilities: [
      "Design marketing collateral, social media assets, and presentations.",
      "Develop and maintain brand guidelines.",
      "Create illustrations and visual elements for the product.",
      "Collaborate with the content team on campaigns.",
      "Stay updated on design trends and best practices."
    ],
    requirements: [
      "Strong portfolio showcasing brand identity and visual design work.",
      "Proficiency in Adobe Creative Suite and Figma.",
      "Strong understanding of typography, color, and layout.",
      "Experience creating motion graphics is a plus.",
      "Attention to detail and strong aesthetic sense."
    ],
    niceToHave: ["Experience with 3D design.", "Illustration skills."],
    category: "Design",
    tags: ["Visual Design", "Branding", "Graphic Design", "Social Media"],
    location: "Remote",
    type: "Part-time"
  },
  {
    title: "Community & Social Media Coordinator",
    slug: "community-social-media-coordinator",
    shortDescription: "Build and nurture a vibrant community of learners.",
    fullDescription: "You will be the face of our community, engaging with students across social platforms and our internal channels. Your goal is to foster a sense of belonging and support among our users.",
    responsibilities: [
      "Manage and moderate our community channels (Discord, Telegram, etc.).",
      "Engage with users on social media platforms.",
      "Organize community events and contests.",
      "Gather feedback from the community and relay to the product team.",
      "Create user-generated content initiatives."
    ],
    requirements: [
      "Passion for building communities and connecting people.",
      "Excellent communication and interpersonal skills.",
      "Experience managing online communities (Discord/Slack).",
      "Empathy and patience in dealing with user queries.",
      "Active presence on social media."
    ],
    niceToHave: ["Experience in event planning.", "Customer support experience."],
    category: "Community",
    tags: ["Community Management", "Social Media", "Engagement", "Events"],
    location: "Remote",
    type: "Part-time"
  },

  // EDUCATION / MENTORSHIP
  {
    title: "JEE/Other Entrance Exam Mentor (IIT / Top Rank Preferred)",
    slug: "jee-other-entrance-exam-mentor",
    shortDescription: "Guide the next generation of students to success in competitive exams.",
    fullDescription: "We are seeking accomplished individuals who have cracked JEE or other top entrance exams to mentor aspiring students. You will provide academic guidance, strategy sessions, and emotional support to help them achieve their dreams.",
    responsibilities: [
      "Conduct 1:1 mentorship sessions with students.",
      "Help students create personalized study plans.",
      "Provide guidance on exam strategy and time management.",
      "Answer academic queries and clear doubts.",
      "Motivate and support students throughout their journey."
    ],
    requirements: [
      "Must have qualified JEE Advanced or other top entrance exams with a good rank.",
      "Strong understanding of relevant subjects (PCM, etc.).",
      "Excellent communication and teaching skills.",
      "Passion for mentoring and helping others.",
      "Empathy and understanding of student psychology."
    ],
    niceToHave: ["Prior teaching or mentoring experience.", "Currently studying in a top-tier college."],
    category: "Education",
    tags: ["Mentorship", "JEE", "Entrance Exams", "Teaching", "Education"],
    location: "Remote",
    type: "Part-time"
  },
  {
    title: "Live Session Educator",
    slug: "live-session-educator",
    shortDescription: "Deliver engaging live classes and problem-solving sessions.",
    fullDescription: "Join us to conduct high-energy live sessions for students. You will explain complex concepts, solve problems live, and interact with students to ensure they grasp the material.",
    responsibilities: [
      "Plan and deliver live interactive sessions on specific topics.",
      "Solve problems live and explain the thought process.",
      "Engage students through polls, quizzes, and Q&A.",
      "Create session notes and practice problems.",
      "Collaborate with the content team on curriculum."
    ],
    requirements: [
      "Deep knowledge of the subject matter (Physics, Chemistry, or Maths).",
      "Energy and charisma to keep students engaged.",
      "Experience with online teaching tools.",
      "Ability to simplify complex topics.",
      "Reliable internet connection and setup."
    ],
    niceToHave: ["YouTube teaching experience.", "Content creation background."],
    category: "Education",
    tags: ["Teaching", "Live Classes", "Education", "Public Speaking"],
    location: "Remote",
    type: "Contract"
  },
  {
    title: "Academic Content Creator",
    slug: "academic-content-creator",
    shortDescription: "Create high-quality study materials, notes, and roadmaps.",
    fullDescription: "We need subject matter experts to create top-notch educational content. You will be responsible for creating detailed notes, curating previous year questions (PYQs), and designing effective study roadmaps.",
    responsibilities: [
      "Create high-quality chapter notes and summaries.",
      "Curate and solve PYQs with detailed explanations.",
      "Design study roadmaps and planners.",
      "Review and verify content for accuracy.",
      "Ensure content is aligned with the latest exam patterns."
    ],
    requirements: [
      "Strong command over JEE syllabus subjects.",
      "Excellent written communication skills.",
      "Ability to structure content logically.",
      "Attention to detail and accuracy.",
      "Experience with LaTeX or content formatting tools."
    ],
    niceToHave: ["Graphic design skills for diagrams.", "Experience writing books/materials."],
    category: "Education",
    tags: ["Content Creation", "Academic Writing", "JEE", "Curriculum"],
    location: "Remote",
    type: "Contract"
  },
  {
    title: "Campus Ambassador",
    slug: "campus-ambassador",
    shortDescription: "Represent REstart on your campus and build a community.",
    fullDescription: "Become a leader on your campus! We are looking for energetic students to spread the word about REstart, organize events, and build a community of learners in their college/school.",
    responsibilities: [
      "Promote REstart within your campus network.",
      "Organize workshops and seminars.",
      "Collect student feedback and insights.",
      "Build a local community of REstart users.",
      "Represent the brand at college fests."
    ],
    requirements: [
      "Currently enrolled student.",
      "Strong networking and communication skills.",
      "Active in college clubs or societies.",
      "Leadership qualities and initiative.",
      "Enthusiasm for education and startups."
    ],
    niceToHave: ["Social media influence.", "Event organizing experience."],
    category: "Growth",
    tags: ["Marketing", "Leadership", "Community", "Campus"],
    location: "Remote",
    type: "Internship"
  }
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs.');

    // Insert new curated jobs
    const jobsToInsert = curatedJobs.map((job) => ({
      ...job,
      isOpen: true,
    }));

    const insertedJobs = await Job.insertMany(jobsToInsert);

    return NextResponse.json(
      {
        message: `Successfully seeded ${insertedJobs.length} jobs`,
        jobs: insertedJobs
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to seed database', details: errorMessage },
      { status: 500 }
    );
  }
}
