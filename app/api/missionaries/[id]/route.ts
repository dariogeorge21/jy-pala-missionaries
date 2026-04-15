import { getMissionaryById, updateMissionary, deleteMissionary } from '@/lib/missionaries';
import type { MissionaryFormData } from '@/types/missionary';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const missionary = await getMissionaryById(Number(id));
    if (!missionary) {
      return Response.json({ success: false, error: 'Missionary not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: missionary });
  } catch (error) {
    console.error('GET missionary error:', error);
    return Response.json({ success: false, error: 'Failed to fetch missionary' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      is_active: Boolean(is_active),
    };

    const missionary = await updateMissionary(Number(id), data);
    if (!missionary) {
      return Response.json({ success: false, error: 'Missionary not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: missionary });
  } catch (error) {
    console.error('PUT missionary error:', error);
    return Response.json({ success: false, error: 'Failed to update missionary' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteMissionary(Number(id));
    if (!deleted) {
      return Response.json({ success: false, error: 'Missionary not found' }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error('DELETE missionary error:', error);
    return Response.json({ success: false, error: 'Failed to delete missionary' }, { status: 500 });
  }
}
