import { cookies } from 'next/headers';

const AUTH_COOKIE = 'jyp_auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
