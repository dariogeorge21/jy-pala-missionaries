import { getCustomCourses, addCustomCourse } from '@/lib/missionaries';

export async function GET() {
  try {
    const courses = await getCustomCourses();
    return Response.json({ success: true, data: courses });
  } catch (error) {
    console.error('GET courses error:', error);
    return Response.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return Response.json({ success: false, error: 'Course name is required' }, { status: 400 });
    }

    const course = await addCustomCourse(name.trim());
    return Response.json({ success: true, data: course }, { status: 201 });
  } catch (error) {
    console.error('POST course error:', error);
    return Response.json({ success: false, error: 'Failed to add course' }, { status: 500 });
  }
}
