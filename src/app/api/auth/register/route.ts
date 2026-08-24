import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, isDbConfigured } from "@/lib/db";

export async function POST(req: Request) {
  if (!isDbConfigured) {
    return NextResponse.json(
      { error: "Database is not configured. Set DATABASE_URL in your environment." },
      { status: 500 }
    );
  }

  let body: { email?: string; password?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const name = body.name?.trim() || email?.split("@")[0] || "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (password.length < 4) {
    return NextResponse.json(
      { error: "Password must be at least 4 characters." },
      { status: 400 }
    );
  }

  try {
    const existing = await sql`
      SELECT id FROM users WHERE lower(email) = ${email} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const inserted = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email}, ${name}, ${passwordHash})
      RETURNING id, email, name
    `;

    return NextResponse.json({ success: true, user: inserted[0] }, { status: 201 });
  } catch (err) {
    console.error("Registration error", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
