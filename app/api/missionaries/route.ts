import { getAllMissionaries, createMissionary } from '@/lib/missionaries';
import type { MissionaryFormData } from '@/types/missionary';

export async function GET() {
  try {
    const missionaries = await getAllMissionaries();
    return Response.json({ success: true, data: missionaries });
  } catch (error) {
    console.error('GET missionaries error:', error);
    return Response.json({ success: false, error: 'Failed to fetch missionaries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, ministry, study_work, jy_courses, joined_year, is_active } = body;

    if (!name || !ministry || !joined_year) {
      return Response.json(
        { success: false, error: 'Name, ministry, and joined year are required' },
        { status: 400 }
      );
    }

    const data: MissionaryFormData = {
      name: String(name).trim(),
      ministry: String(ministry).trim(),
      study_work: String(study_work ?? '').trim(),
      jy_courses: Array.isArray(jy_courses) ? jy_courses : [],
      joined_year: Number(joined_year),
      is_active: Boolean(is_active ?? true),
    };

    const missionary = await createMissionary(data);
    return Response.json({ success: true, data: missionary }, { status: 201 });
  } catch (error) {
    console.error('POST missionary error:', error);
    return Response.json({ success: false, error: 'Failed to create missionary' }, { status: 500 });
  }
}
