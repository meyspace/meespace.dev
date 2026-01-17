export interface Profile {
    name: string;
    role: string;
    tagline: string;
    bio: string;
    status: string;
    avatar: string;
    email: string;
    location: string;
    socials: {
        linkedin: string;
        github: string;
    };
}

export interface Stat {
    label: string;
    value: string;
    icon: string;
    color: string;
}

export interface Tool {
    name: string;
    icon: string;
    color: string;
}

export interface Skill {
    icon: string;
    title: string;
    desc: string;
}

export interface Project {
    title: string;
    year: string;
    description: string;
    tags: string[];
    icon: string;
    color: string;
}

export interface Post {
    title: string;
    excerpt: string;
    readTime: string;
    icon: string;
    color: string;
}

export interface CertItem {
    title: string;
    subtitle: string;
    icon: string;
}

export interface DegreeItem {
    title: string;
    school: string;
    year: string;
}

export interface ExperienceItem {
    role: string;
    company: string;
    year: string;
    color: string;
    highlights: string[];
    tags?: string[];
}

export interface AboutPageData {
    header: {
        title: string;
        subtitle: string;
    };
    story: {
        tag: string;
        year: string;
        title: string;
        content: string[];
        image: string;
    };
    funFact: {
        title: string;
        description: string;
    };
    education: {
        degree: DegreeItem;
        certs: CertItem[];
    };
    experience: ExperienceItem[];
    offline: {
        title: string;
        description: string;
    };
}

export interface ProjectPageItem {
    title: string;
    description: string;
    icon: string;
    category: string;
    categoryColor: string;
    tags: string[];
}

export interface ProjectSidebarLink {
    label: string;
    icon?: string;
    color?: string;
    active?: boolean;
}

export interface ProjectsPageData {
    sidebar: {
        title: string;
        links: ProjectSidebarLink[];
        cta: {
            title: string;
            description: string;
            button: string;
        };
    };
    main: {
        title: string;
        categories: string[];
    };
    projects: ProjectPageItem[];
}

// Project Details Page Types
export interface DeliverableItem {
    icon: string;
    title: string;
    description: string;
}

export interface OutcomeStat {
    value: string;
    label: string;
}

export interface TechTool {
    name: string;
    icon: string;
    color: string;
}

export interface ProjectNav {
    prev?: {
        title: string;
        slug: string;
    };
    next?: {
        title: string;
        slug: string;
    };
}

export interface ProjectDetail {
    header: {
        category: string;
        icon: string;
        title: string;
        subtitle: string;
        tags: string[];
    };
    problem: {
        content: string;
    };
    solution: {
        content: string;
    };
    deliverables: DeliverableItem[];
    outcomes: OutcomeStat[];
    techStack: TechTool[];
    navigation: ProjectNav;
}

// Insights Page Types
export interface BlogPost {
    slug: string;
    category: string;
    categoryColor: string;
    title: string;
    excerpt: string;
}

export interface InsightsPageData {
    header: {
        title: string;
        description: string;
    };
    latestPost: {
        slug: string;
        category: string;
        readTime: string;
        title: string;
        excerpt: string;
        author: string;
        date: string;
        image: string;
    };
    topics: string[];
    posts: BlogPost[];
}

// Insight Details Page Types
export interface Comment {
    author: string;
    initials: string;
    initialsColor: string;
    date: string;
    content: string;
    likes: number;
}

export interface InsightDetail {
    header: {
        category: string;
        title: string;
        author: string;
        date: string;
        readTime: string;
        authorImage: string;
    };
    content: string[];
    comments: Comment[];
}
