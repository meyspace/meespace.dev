import { BentoCard } from "@/components/public/BentoCard";
import aboutDataRaw from "@/data/about.json";
import { AboutPageData } from "@/types/data";
import { Metadata } from "next";

const aboutData = aboutDataRaw as AboutPageData;

export const metadata: Metadata = {
    title: `About - ${aboutData.header.title}`,
    description: aboutData.header.subtitle,
};

export default function AboutPage() {
    return (
        <div className="w-full">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-text-main dark:text-white mb-3">
                    {aboutData.header.title}
                </h2>
                <p className="text-text-muted dark:text-gray-400 text-lg max-w-2xl">
                    {aboutData.header.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                {/* Story Card */}
                <BentoCard className="col-span-1 md:col-span-2 row-span-1 bg-white dark:bg-[#1e1e1e] p-8 flex flex-col justify-between relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="size-24 md:size-32 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-sm relative">
                            <img
                                alt="Portrait"
                                className="w-full h-full object-cover"
                                src={aboutData.story.image}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-accent-sage text-green-900 text-xs font-semibold">
                                    {aboutData.story.tag}
                                </span>
                                <span className="text-sm text-text-muted dark:text-gray-400 font-medium">
                                    {aboutData.story.year}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-text-main dark:text-white mb-4">
                                {aboutData.story.title}
                            </h3>
                            {aboutData.story.content.map((paragraph, idx) => (
                                <p
                                    key={idx}
                                    className={`text-text-muted dark:text-gray-400 leading-relaxed ${idx < aboutData.story.content.length - 1 ? "mb-4" : ""
                                        }`}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500 pointer-events-none"></div>
                </BentoCard>

                {/* Fun Fact Card */}
                <BentoCard className="col-span-1 bg-accent-purple/30 dark:bg-purple-900/10 p-6 flex flex-col justify-between border border-accent-purple/50 dark:border-purple-800/30">
                    <div className="flex justify-between items-start">
                        <div className="size-10 rounded-full bg-white dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
                            <span className="material-symbols-outlined">lightbulb</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-bold text-text-main dark:text-white text-lg mb-2">
                            {aboutData.funFact.title}
                        </h4>
                        <p className="text-sm text-text-muted dark:text-purple-200">
                            {aboutData.funFact.description}
                        </p>
                    </div>
                </BentoCard>

                {/* Education & Certs Card */}
                <BentoCard className="col-span-1 md:col-span-1 md:row-span-2 bg-white dark:bg-[#1e1e1e] p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="size-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-300">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <h3 className="font-bold text-text-main dark:text-white text-lg">
                            Education & Certs
                        </h3>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <span className="text-xs font-semibold text-text-muted dark:text-gray-500 uppercase tracking-wider">
                                Degree
                            </span>
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <h4 className="font-bold text-text-main dark:text-white text-sm">
                                    {aboutData.education.degree.title}
                                </h4>
                                <p className="text-xs text-text-muted dark:text-gray-400 mt-1">
                                    {aboutData.education.degree.school}
                                </p>
                                <p className="text-xs text-text-muted dark:text-gray-500 mt-0.5">
                                    {aboutData.education.degree.year}
                                </p>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-text-muted dark:text-gray-500 uppercase tracking-wider">
                                Certifications
                            </span>
                            <div className="mt-2 space-y-3">
                                {aboutData.education.certs.map((cert, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-primary/50 transition-colors"
                                    >
                                        <div className="mt-0.5 text-blue-600 dark:text-blue-400">
                                            <span className="material-symbols-outlined text-[20px]">
                                                {cert.icon}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-main dark:text-white text-sm">
                                                {cert.title}
                                            </h4>
                                            <p className="text-xs text-text-muted dark:text-gray-400">
                                                {cert.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* Experience Roadmap Card */}
                <BentoCard className="col-span-1 md:col-span-2 row-span-2 bg-white dark:bg-[#1e1e1e] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                <span className="material-symbols-outlined">work_history</span>
                            </div>
                            <h3 className="font-bold text-text-main dark:text-white text-xl">
                                Experience Roadmap
                            </h3>
                        </div>
                        <span className="text-sm text-primary-dark font-semibold hover:text-text-main transition-colors flex items-center gap-1 cursor-pointer">
                            Download CV{" "}
                            <span className="material-symbols-outlined text-sm">download</span>
                        </span>
                    </div>
                    <div className="relative pl-4 md:pl-8 space-y-10">
                        {/* Timeline Line */}
                        <div className="absolute left-[23px] md:left-[39px] top-2 bottom-2 w-[2px] bg-gray-200 dark:bg-gray-800"></div>

                        {aboutData.experience.map((exp, idx) => (
                            <div key={idx} className="relative pl-8">
                                <div
                                    className={`absolute -left-[9px] top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-[#1e1e1e] shadow-sm z-10 ${idx === 0
                                            ? "bg-blue-500"
                                            : "bg-gray-300 dark:bg-gray-600"
                                        }`}
                                ></div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                    <h4 className="text-lg font-bold text-text-main dark:text-white">
                                        {exp.role}
                                    </h4>
                                    <span
                                        className={`text-sm font-medium px-3 py-1 rounded-full w-fit mt-1 sm:mt-0 ${idx === 0
                                                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                                : "text-text-muted dark:text-gray-500 bg-gray-100 dark:bg-gray-800"
                                            }`}
                                    >
                                        {exp.year}
                                    </span>
                                </div>
                                <p className="text-text-muted dark:text-gray-400 text-sm font-medium mb-3">
                                    {exp.company}
                                </p>
                                <ul className="space-y-2 mb-4">
                                    {exp.highlights.map((highlight, hIdx) => (
                                        <li
                                            key={hIdx}
                                            className="flex items-start gap-2 text-sm text-text-muted dark:text-gray-400 leading-relaxed"
                                        >
                                            <span
                                                className={`material-symbols-outlined text-base mt-0.5 shrink-0 ${idx === 0
                                                        ? "text-green-500"
                                                        : "text-gray-400"
                                                    }`}
                                            >
                                                check_circle
                                            </span>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: highlight,
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                {exp.tags && (
                                    <div className="flex flex-wrap gap-2">
                                        {exp.tags.map((tag, tIdx) => (
                                            <span
                                                key={tIdx}
                                                className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded border border-gray-200 dark:border-gray-700"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </BentoCard>

                {/* Offline Mode Card */}
                <BentoCard className="col-span-1 bg-accent-rose/30 dark:bg-rose-900/10 p-6 flex flex-col justify-between border border-accent-rose/50 dark:border-rose-800/30">
                    <div className="flex justify-between items-start">
                        <div className="size-10 rounded-full bg-white dark:bg-rose-900/50 flex items-center justify-center text-rose-500 dark:text-rose-300">
                            <span className="material-symbols-outlined">hiking</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-bold text-text-main dark:text-white text-lg mb-2">
                            {aboutData.offline.title}
                        </h4>
                        <p className="text-sm text-text-muted dark:text-rose-200">
                            {aboutData.offline.description}
                        </p>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
}
