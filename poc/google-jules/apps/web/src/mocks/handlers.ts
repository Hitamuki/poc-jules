// import { http, HttpResponse, delay } from 'msw'; // Using new msw v2 syntax
import { http, HttpResponse } from 'msw'; // Simpler import for now
import type { LoginInput } from '@bookmark-todo-app/zod-schemas/auth'; // For request body type if needed

// Example: Mocking a user profile endpoint
const mockUser = {
  id: '123-abc',
  email: 'jules.agent@example.com',
  username: 'JulesAgent',
  role: 'ADMIN', // Make sure this matches UserRole enum in Prisma/Zod if strict
  status: 'ACTIVE', // Make sure this matches UserStatus enum
};

export const handlers = [
  // Mock for GET /api/v1/auth/profile (protected route)
  http.get('*/api/v1/auth/profile', async () => {
    // In a real scenario, you might check for Authorization header here if testing auth flows
    // For Storybook, often assume authenticated or provide controls to switch.
    // await delay(150);
    return HttpResponse.json(mockUser);
  }),

  // Mock for POST /api/v1/auth/login
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = await request.json() as LoginInput; // Assuming LoginInput type for the body
    if (body.email === 'test@example.com' && body.password === 'password123') {
      // await delay(300);
      return HttpResponse.json({
        accessToken: 'mock-access-token-storyb00k',
        refreshToken: 'mock-refresh-token-storyb00k',
        // user: { ...mockUser, email: body.email }, // Usually login returns tokens, profile call gets user
      });
    }
    if (body.email === mockUser.email && body.password === 'password') { // Allow login with the mockUser details
        // await delay(300);
        return HttpResponse.json({
            accessToken: 'mock-access-token-jules',
            refreshToken: 'mock-refresh-token-jules',
        });
    }
    // await delay(300);
    return new HttpResponse(JSON.stringify({ message: 'Invalid credentials' }), {
      status: 401, // Unauthorized
      headers: { 'Content-Type': 'application/json' },
    });
  }),

  // Mock for POST /api/v1/auth/register
  http.post('*/api/v1/auth/register', async ({ request }) => {
    const body = await request.json() as any; // Replace 'any' with RegisterInput from Zod if available
    // await delay(400);
    if (body.email === 'exists@example.com') {
      return new HttpResponse(JSON.stringify({ message: 'Email already exists' }), {
        status: 409, // Conflict
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return HttpResponse.json(
      { ...mockUser, id: 'new-user-id', email: body.email, username: body.username },
      { status: 201 } // Created
    );
  }),

  // Example: Mocking a list endpoint for bookmarks
  http.get('*/api/v1/bookmarks', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    // await delay(200);
    return HttpResponse.json({
      data: [ // Example: NestJS typical paginated response
        { id: 'bm1', name: 'MSW Official Documentation', url: 'https://mswjs.io', status: 'NOT_STARTED', priority: 'HIGH', profileId: 'defaultProfile' },
        { id: 'bm2', name: 'Next.js Framework Site', url: 'https://nextjs.org', status: 'IN_PROGRESS', priority: 'MEDIUM', profileId: 'defaultProfile' },
        { id: 'bm3', name: 'Tailwind CSS Components', url: 'https://tailwindcss.com', status: 'COMPLETED', priority: 'LOW', profileId: 'defaultProfile' },
      ],
      meta: {
        currentPage: parseInt(page),
        itemCount: 3,
        itemsPerPage: 10,
        totalItems: 25, // Example total
        totalPages: 3,   // Example total
      }
    });
  }),

  // Fallback for any other /api/v1 GET requests to avoid console errors during dev
  // http.get('*/api/v1/*', ({ request }) => {
  //   console.warn(`[MSW] Unhandled GET request to API: ${request.url}`);
  //   return new HttpResponse(null, { status: 404 });
  // }),
];
