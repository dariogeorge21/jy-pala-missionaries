import { initializeTable } from '@/lib/missionaries';

export async function GET() {
  try {
    await initializeTable();
    return Response.json({ success: true, message: 'Database initialized successfully' });
  } catch (error) {
    console.error('DB init error:', error);
    return Response.json({ success: false, error: 'Failed to initialize database' }, { status: 500 });
  }
}
