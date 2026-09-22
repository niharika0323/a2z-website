import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import { db, getDatabaseInfo } from "@/lib/db";

export async function GET() {
  try {
    const dbInfo = getDatabaseInfo();
    const dbFilePath = path.join(process.cwd(), "data", "a2z.db");
    let fileSizeFormatted = "N/A";
    let fileExists = false;

    if (!dbInfo.isTurso && fs.existsSync(dbFilePath)) {
      fileExists = true;
      const stats = fs.statSync(dbFilePath);
      fileSizeFormatted = `${(stats.size / 1024).toFixed(1)} KB`;
    }

    const employees = await db.getEmployees();
    const tasks = await db.getTasks();
    const events = await db.getEvents();
    const attendance = await db.getAttendanceStats();

    const tables = [
      {
        name: "employees",
        count: employees.length,
        description: "Stores corporate staff, admin accounts, roles, contact info, and live daily attendance status.",
        columns: ["id", "name", "username", "role", "email", "phone", "status", "check_in_time", "check_out_time", "created_at"]
      },
      {
        name: "verification_tasks",
        count: tasks.length,
        description: "Stores client deliverable sprints, forensic BGV verification pipelines, and work queue deliverables.",
        columns: ["id", "title", "assigned_to", "employee_name", "priority", "time", "status", "created_at"]
      },
      {
        name: "company_events",
        count: events.length,
        description: "Stores company holidays, sprint milestones, and security compliance review dates.",
        columns: ["id", "title", "date", "type", "description", "created_at"]
      }
    ];

    return NextResponse.json({
      status: "healthy",
      database: {
        engine: dbInfo.engine,
        isTurso: dbInfo.isTurso,
        url: dbInfo.url,
        filePath: dbInfo.isTurso ? "Turso Cloud DB" : "data/a2z.db",
        absolutePath: dbInfo.isTurso ? "Turso Cloud Connection" : dbFilePath,
        fileExists: dbInfo.isTurso ? true : fileExists,
        fileSize: dbInfo.isTurso ? "Cloud Managed" : fileSizeFormatted,
        totalRecords: employees.length + tasks.length + events.length
      },
      tables,
      attendance,
      recentEmployees: employees.slice(0, 10),
      recentTasks: tasks.slice(0, 10),
      recentEvents: events.slice(0, 10),
      nodeVersion: process.version,
      serverTime: new Date().toISOString()
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to inspect backend database status";
    return NextResponse.json(
      {
        status: "error",
        error: message
      },
      { status: 500 }
    );
  }
}
