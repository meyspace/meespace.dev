import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';

/**
 * GET /api/v1/contact
 * Get all contact inquiries (admin only)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const url = new URL(req.url);
                const status = url.searchParams.get('status'); // 'new', 'read', 'replied', 'archived'

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let query = (supabase as any)
                    .from('contact_inquiries')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (status) {
                    query = query.eq('status', status);
                }

                const { data, error } = await query;

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ messages: data }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error fetching contact inquiries:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * POST /api/v1/contact
 * Submit a contact inquiry (public)
 */
export async function POST(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();
            const body = await req.json();

            // Validate required fields
            if (!body.name || !body.email || !body.message) {
                return errorResponse('Name, email, and message are required', 400, rateLimitInfo);
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(body.email)) {
                return errorResponse('Invalid email format', 400, rateLimitInfo);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from('contact_inquiries')
                .insert({
                    name: body.name,
                    email: body.email,
                    subject: body.subject || null,
                    message: body.message,
                    company: body.company || null,
                    status: 'new',
                })
                .select()
                .single();

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            return successResponse({ message: 'Message sent successfully', data }, 201, rateLimitInfo);
        } catch (err) {
            console.error('Error creating contact inquiry:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * PUT /api/v1/contact?id=<id>
 * Update contact inquiry status (admin only)
 */
export async function PUT(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const url = new URL(req.url);
                const id = url.searchParams.get('id');

                if (!id) {
                    return errorResponse('ID is required', 400, rateLimitInfo);
                }

                const body = await req.json();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data, error } = await (supabase as any)
                    .from('contact_inquiries')
                    .update({
                        status: body.status,
                        is_read: body.status !== 'new',
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating contact inquiry:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * DELETE /api/v1/contact?id=<id>
 * Delete contact inquiry (admin only)
 */
export async function DELETE(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const url = new URL(req.url);
                const id = url.searchParams.get('id');

                if (!id) {
                    return errorResponse('ID is required', 400, rateLimitInfo);
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { error } = await (supabase as any)
                    .from('contact_inquiries')
                    .delete()
                    .eq('id', id);

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ message: 'Message deleted successfully' }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error deleting contact inquiry:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
