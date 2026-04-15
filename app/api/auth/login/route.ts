import { cookies } from 'next/headers';

const AUTH_COOKIE = 'jyp_auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return Response.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    const appPassword = process.env.APP_PASSWORD;
    if (!appPassword) {
      return Response.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    if (password !== appPassword) {
      return Response.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
