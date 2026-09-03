import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'a2z.db');

// Global singleton to prevent connection leaks across Next.js reloads
declare global {
  // eslint-disable-next-line no-var
  var __a2z_db: DatabaseSync | undefined;
}

function getDatabase(): DatabaseSync {
  if (!global.__a2z_db) {
    const db = new DatabaseSync(dbPath);
    // Performance and integrity tuning
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA foreign_keys = ON;');
    initializeSchema(db);
    global.__a2z_db = db;
  }
  return global.__a2z_db;
}

function initializeSchema(db: DatabaseSync) {
  // SINGLE table for all employee details (admin & regular employees)
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      status TEXT DEFAULT 'PRESENT',
      check_in_time TEXT DEFAULT '',
      check_out_time TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table for company events & calendar
  db.exec(`
    CREATE TABLE IF NOT EXISTS company_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Auto-seed Admin if not present
  const adminCheck = db.prepare('SELECT id FROM employees WHERE username = ?').get('admin');
  if (!adminCheck) {
    const insertAdmin = db.prepare(`
      INSERT INTO employees (id, name, username, password, role, department, email, phone, status, check_in_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertAdmin.run(
      'ADM-001',
      'System Administrator',
      'admin',
      'admin',
      'ADMIN',
      'Executive Management',
      'admin@a2z.com',
      '+91 90158 21469',
      'PRESENT',
      '08:30 AM'
    );
  }

  // Pre-seed initial employees to showcase realistic attendance counters
  const employeeCountRow = db.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number };
  if (employeeCountRow.count <= 1) {
    const insertEmp = db.prepare(`
      INSERT OR IGNORE INTO employees (id, name, username, password, role, department, email, phone, status, check_in_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertEmp.run(
      'EMP-101',
      'Alok Kumar',
      'alok',
      'password123',
      'Senior BGV Verification Engineer',
      'Engineering & Core Tech',
      'alok@a2z.com',
      '+91 98765 43210',
      'PRESENT',
      '09:12 AM'
    );

    insertEmp.run(
      'EMP-102',
      'Niharika Singh',
      'niharika',
      'password123',
      'BGV Product Manager',
      'Product & Verification Strategy',
      'niharika@a2z.com',
      '+91 98765 43211',
      'PRESENT',
      '09:28 AM'
    );

    insertEmp.run(
      'EMP-103',
      'Rahul Verma',
      'rahul',
      'password123',
      'Lead Forensic BGV Checker',
      'Quality & Checker Operations',
      'rahul.v@a2z.com',
      '+91 98765 43212',
      'ABSENT',
      ''
    );

    insertEmp.run(
      'EMP-104',
      'Priya Sharma',
      'priya',
      'password123',
      'Compliance & Legal Risk Specialist',
      'Legal & Compliance',
      'priya.s@a2z.com',
      '+91 98765 43213',
      'ON_LEAVE',
      ''
    );

    insertEmp.run(
      'EMP-105',
      'Amit Patel',
      'amit',
      'password123',
      'Distributed Systems Architect',
      'Engineering & Core Tech',
      'amit.p@a2z.com',
      '+91 98765 43214',
      'PRESENT',
      '09:05 AM'
    );
  }

  // Pre-seed company events if empty
  const eventsCountRow = db.prepare('SELECT COUNT(*) as count FROM company_events').get() as { count: number };
  if (eventsCountRow.count === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO company_events (id, title, date, type, description)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertEvent.run('EVT-101', 'Gandhi Jayanti', '2026-10-02', 'Holiday', 'National Holiday - Corporate offices closed');
    insertEvent.run('EVT-102', 'Q3 ISO 27001 & BGV Security Audit', '2026-10-15', 'Audit', 'Annual external audit for background verification data handling');
    insertEvent.run('EVT-103', 'Dussehra Festival', '2026-10-24', 'Holiday', 'National Festival Holiday');
    insertEvent.run('EVT-104', 'Enterprise BGV 3.0 Platform Rollout', '2026-11-05', 'Milestone', 'Launch of automated court record AI parser & instant Aadhaar OCR');
    insertEvent.run('EVT-105', 'Diwali Celebration & Holiday', '2026-11-12', 'Holiday', 'Festival of Lights company celebration');
    insertEvent.run('EVT-106', 'Christmas Day', '2026-12-25', 'Holiday', 'Winter corporate holiday');
  }
}

export interface Employee {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
  check_in_time: string;
  check_out_time: string;
  created_at?: string;
}

export interface CompanyEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  created_at?: string;
}

export const db = {
  // EMPLOYEE METHODS
  getEmployees(options?: { status?: string; search?: string }): Employee[] {
    const database = getDatabase();
    let query = 'SELECT id, name, username, role, department, email, phone, status, check_in_time, check_out_time, created_at FROM employees WHERE 1=1';
    const params: unknown[] = [];

    if (options?.status && options.status !== 'ALL') {
      query += ' AND UPPER(status) = UPPER(?)';
      params.push(options.status);
    }

    if (options?.search) {
      query += ' AND (name LIKE ? OR username LIKE ? OR id LIKE ? OR department LIKE ? OR role LIKE ?)';
      const term = `%${options.search}%`;
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY created_at ASC';
    return database.prepare(query).all(...params) as unknown as Employee[];
  },

  getEmployeeById(id: string): Employee | undefined {
    const database = getDatabase();
    return database.prepare('SELECT id, name, username, role, department, email, phone, status, check_in_time, check_out_time FROM employees WHERE id = ?').get(id) as Employee | undefined;
  },

  getEmployeeByUsername(username: string): Employee | undefined {
    const database = getDatabase();
    return database.prepare('SELECT * FROM employees WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)').get(username, username) as Employee | undefined;
  },

  getAttendanceStats() {
    const database = getDatabase();
    const rows = database.prepare("SELECT status, COUNT(*) as count FROM employees WHERE role != 'ADMIN' GROUP BY status").all() as { status: string; count: number }[];
    const totalRow = database.prepare("SELECT COUNT(*) as total FROM employees WHERE role != 'ADMIN'").get() as { total: number };
    
    let present = 0;
    let absent = 0;
    let onLeave = 0;

    for (const r of rows) {
      const s = (r.status || '').toUpperCase();
      if (s === 'PRESENT') present += r.count;
      else if (s === 'ABSENT') absent += r.count;
      else if (s === 'ON_LEAVE') onLeave += r.count;
    }

    return {
      total: totalRow?.total || 0,
      present,
      absent,
      onLeave
    };
  },

  createEmployee(data: {
    id?: string;
    name: string;
    username: string;
    password?: string;
    role: string;
    department: string;
    email: string;
    phone?: string;
    status?: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
  }): Employee {
    const database = getDatabase();
    
    // Auto-generate employee ID if not provided
    let empId = data.id?.trim();
    if (!empId) {
      const allEmps = database.prepare("SELECT id FROM employees WHERE id LIKE 'EMP-%'").all() as { id: string }[];
      let maxNum = 105;
      for (const e of allEmps) {
        const num = parseInt(e.id.replace('EMP-', ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
      empId = `EMP-${maxNum + 1}`;
    }

    const password = data.password || 'password123';
    const status = data.status || 'PRESENT';
    const checkIn = status === 'PRESENT' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    const stmt = database.prepare(`
      INSERT INTO employees (id, name, username, password, role, department, email, phone, status, check_in_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      empId,
      data.name,
      data.username.trim().toLowerCase(),
      password,
      data.role,
      data.department,
      data.email,
      data.phone || '',
      status,
      checkIn
    );

    return this.getEmployeeById(empId)!;
  },

  updateEmployee(id: string, updates: Partial<Employee>): Employee | undefined {
    const database = getDatabase();
    const existing = this.getEmployeeById(id);
    if (!existing) return undefined;

    const fields: string[] = [];
    const values: unknown[] = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.role !== undefined) { fields.push('role = ?'); values.push(updates.role); }
    if (updates.department !== undefined) { fields.push('department = ?'); values.push(updates.department); }
    if (updates.email !== undefined) { fields.push('email = ?'); values.push(updates.email); }
    if (updates.phone !== undefined) { fields.push('phone = ?'); values.push(updates.phone); }
    if (updates.password !== undefined) { fields.push('password = ?'); values.push(updates.password); }
    if (updates.status !== undefined) { 
      fields.push('status = ?'); 
      values.push(updates.status); 
      if (updates.status === 'PRESENT') {
        fields.push('check_in_time = ?');
        values.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else if (updates.status === 'ABSENT' || updates.status === 'ON_LEAVE') {
        fields.push('check_in_time = ?');
        values.push('');
      }
    }
    if (updates.check_in_time !== undefined) { fields.push('check_in_time = ?'); values.push(updates.check_in_time); }
    if (updates.check_out_time !== undefined) { fields.push('check_out_time = ?'); values.push(updates.check_out_time); }

    if (fields.length === 0) return existing;

    values.push(id);
    database.prepare(`UPDATE employees SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getEmployeeById(id);
  },

  deleteEmployee(id: string): boolean {
    const database = getDatabase();
    if (id === 'ADM-001') return false; // Root Admin cannot be deleted
    const res = database.prepare("DELETE FROM employees WHERE id = ? AND role != 'ADMIN'").run(id);
    return res.changes > 0;
  },

  // EVENTS METHODS
  getEvents(): CompanyEvent[] {
    const database = getDatabase();
    return database.prepare('SELECT * FROM company_events ORDER BY date ASC').all() as unknown as CompanyEvent[];
  },

  createEvent(data: { title: string; date: string; type: string; description?: string }): CompanyEvent {
    const database = getDatabase();
    const id = `EVT-${Date.now().toString().slice(-6)}`;
    const stmt = database.prepare(`
      INSERT INTO company_events (id, title, date, type, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.title, data.date, data.type, data.description || '');
    return { id, ...data, description: data.description || '' };
  },

  deleteEvent(id: string): boolean {
    const database = getDatabase();
    const res = database.prepare('DELETE FROM company_events WHERE id = ?').run(id);
    return res.changes > 0;
  }
};
