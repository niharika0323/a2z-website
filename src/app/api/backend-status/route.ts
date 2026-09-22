import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const dbFilePath = path.join(process.cwd(), "data", "a2z.db");
    let fileSizeFormatted = "N/A";
    let fileExists = false;

    if (fs.existsSync(dbFilePath)) {
      fileExists = true;
      const stats = fs.statSync(dbFilePath);
      fileSizeFormatted = `${(stats.size / 1024).toFixed(1)} KB`;
    }

    const employees = db.getEmployees();
    const tasks = db.getTasks();
    const events = db.getEvents();
    const attendance = db.getAttendanceStats();

    const tables = [
      {
        name: "employees",
        count: employees.length,
        description: "Stores corporate staff, admin accounts, roles, departments, contact info, and live daily attendance status.",
        columns: ["id", "name", "username", "role", "department", "email", "phone", "status", "check_in_time", "check_out_time", "created_at"]
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
        engine: "SQLite 3 (WAL mode via node:sqlite / @libsql/client)",
        filePath: "data/a2z.db",
        absolutePath: dbFilePath,
        fileExists,
        fileSize: fileSizeFormatted,
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
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message || "Failed to inspect backend database status"
      },
      { status: 500 }
    );
  }
}
