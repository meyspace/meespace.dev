import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';

/**
 * GET /api/v1/dashboard
 * Get dashboard summary data including content counts
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();

                // Get counts from each table
                const [projectsResult, blogsResult, experiencesResult, techStackResult] = await Promise.all([
                    supabase.from('projects').select('id', { count: 'exact', head: true }),
                    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
                    supabase.from('experiences').select('id', { count: 'exact', head: true }),
                    supabase.from('tech_stack').select('id', { count: 'exact', head: true }),
                ]);

                const projectsCount = projectsResult.count || 0;
                const blogsCount = blogsResult.count || 0;
                const experiencesCount = experiencesResult.count || 0;
                const techStackCount = techStackResult.count || 0;

                // Get total views from blog_posts
                const { data: viewsData } = await supabase
                    .from('blog_posts')
                    .select('view_count');

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const totalViews = (viewsData as any[])?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

                // Build stats array for display
                const stats = [
                    {
                        label: "Total Projects",
                        value: String(projectsCount),
                        change: "Total",
                        icon: "folder_open",
                        color: "blue"
                    },
                    {
                        label: "Blog Posts",
                        value: String(blogsCount),
                        change: "Total",
                        icon: "article",
                        color: "purple"
                    },
                    {
                        label: "Total Views",
                        value: String(totalViews),
                        change: "All time",
                        icon: "visibility",
                        color: "green"
                    },
                    {
                        label: "Tech Stack",
                        value: String(techStackCount),
                        change: "Tools",
                        icon: "code",
                        color: "orange"
                    },
                ];

                return successResponse({
                    stats,
                    projectsCount,
                    blogsCount,
                    experiencesCount,
                    techStackCount,
                    totalViews,
                }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
