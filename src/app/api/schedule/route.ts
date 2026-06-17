// app/api/schedule/route.ts
import { NextResponse } from 'next/server';

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTxKSa--ORUHF-9kdX9FvpsHz1khW3CVwufT7DQnm8gLUFWYfiYVRJ_Y1Wme26Na6wiGQx5IBfngpfq/pub?gid=807863960&single=true&output=csv';

export async function GET() {
  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
    const csv = await res.text();

    // Split into rows and clean cells
    const rows = csv
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line =>
        line.split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1'))
      );

    // Ensure we have at least one header row
    if (rows.length < 2) return NextResponse.json([]);

    return NextResponse.json(rows);
  } catch (err) {
    console.error('Schedule error:', err);
    return NextResponse.json([], { status: 500 });
  }
}