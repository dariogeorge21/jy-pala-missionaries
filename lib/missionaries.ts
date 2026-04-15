import { sql } from './db';
import type { Missionary, MissionaryFormData } from '@/types/missionary';

export async function initializeTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS jyp_missionaries_data (
      id SERIAL PRIMARY KEY,
      serial_number SERIAL,
      name VARCHAR(255) NOT NULL,
      ministry VARCHAR(255) NOT NULL,
      study_work VARCHAR(255) NOT NULL DEFAULT '',
      jy_courses JSONB NOT NULL DEFAULT '[]',
      joined_year INTEGER NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS jyp_custom_courses (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function getAllMissionaries(): Promise<Missionary[]> {
  const rows = await sql`
    SELECT * FROM jyp_missionaries_data
    ORDER BY serial_number ASC
  `;
  return rows.map(parseMissionary);
}

export async function getMissionaryById(id: number): Promise<Missionary | null> {
  const rows = await sql`
    SELECT * FROM jyp_missionaries_data WHERE id = ${id}
  `;
  if (rows.length === 0) return null;
  return parseMissionary(rows[0]);
}

export async function createMissionary(data: MissionaryFormData): Promise<Missionary> {
  const rows = await sql`
    INSERT INTO jyp_missionaries_data (name, ministry, study_work, jy_courses, joined_year, is_active)
    VALUES (
      ${data.name},
      ${data.ministry},
      ${data.study_work},
      ${JSON.stringify(data.jy_courses)},
      ${data.joined_year},
      ${data.is_active}
    )
    RETURNING *
  `;
  return parseMissionary(rows[0]);
}

export async function updateMissionary(id: number, data: MissionaryFormData): Promise<Missionary | null> {
  const rows = await sql`
    UPDATE jyp_missionaries_data
    SET
      name = ${data.name},
      ministry = ${data.ministry},
      study_work = ${data.study_work},
      jy_courses = ${JSON.stringify(data.jy_courses)},
      joined_year = ${data.joined_year},
      is_active = ${data.is_active},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) return null;
  return parseMissionary(rows[0]);
}

export async function deleteMissionary(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM jyp_missionaries_data WHERE id = ${id}
  `;
  return (result as unknown as { count: number }).count > 0;
}

export async function getCustomCourses(): Promise<string[]> {
  const rows = await sql`SELECT name FROM jyp_custom_courses ORDER BY name ASC`;
  return rows.map((r) => r.name as string);
}

export async function addCustomCourse(name: string): Promise<string> {
  const rows = await sql`
    INSERT INTO jyp_custom_courses (name)
    VALUES (${name})
    ON CONFLICT (name) DO NOTHING
    RETURNING name
  `;
  return rows.length > 0 ? (rows[0].name as string) : name;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseMissionary(row: any): Missionary {
  return {
    id: row.id,
    serial_number: row.serial_number,
    name: row.name,
    ministry: row.ministry,
    study_work: row.study_work,
    jy_courses: Array.isArray(row.jy_courses) ? row.jy_courses : JSON.parse(row.jy_courses ?? '[]'),
    joined_year: row.joined_year,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
