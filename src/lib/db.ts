import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

function getDatabasePath(): string {
  // Check if running on Netlify, AWS Lambda, or other serverless host
  const isServerless = Boolean(
    process.env.NETLIFY || 
    process.env.AWS_LAMBDA_FUNCTION_NAME || 
    process.env.VERCEL
  );

  if (isServerless) {
    const tmpDir = os.tmpdir();
    const tmpPath = path.join(tmpDir, 'a2z.db');
    
    // Copy bundled seed database to /tmp if it doesn't exist yet
    if (!fs.existsSync(tmpPath)) {
      const bundledPath = path.join(process.cwd(), 'data', 'a2z.db');
      if (fs.existsSync(bundledPath)) {
        try {
          fs.copyFileSync(bundledPath, tmpPath);
        } catch (e) {
          console.warn('Could not copy bundled database to /tmp, will initialize fresh', e);
        }
      }
    }
    return tmpPath;
  }

  // Local development
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'a2z.db');
}

// Global singleton to prevent connection leaks across Next.js reloads
declare global {
  // eslint-disable-next-line no-var
  var __a2z_db: DatabaseSync | undefined;
}

function getDatabase(): DatabaseSync {
  if (!global.__a2z_db) {
    const dbPath = getDatabasePath();
    const db = new DatabaseSync(dbPath);
    // Performance and integrity tuning
    try {
      db.exec('PRAGMA journal_mode = WAL;');
      db.exec('PRAGMA foreign_keys = ON;');
    } catch (e) {
      console.warn('PRAGMA tuning warning:', e);
    }
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

  // Table for verification tasks & statuses
  db.exec(`
    CREATE TABLE IF NOT EXISTS verification_tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      assigned_to TEXT DEFAULT '',
      employee_name TEXT DEFAULT '',
      priority TEXT DEFAULT 'Normal',
      time TEXT DEFAULT 'SLA: 4h',
      status TEXT DEFAULT 'In Progress',
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
    insertEvent.run('EVT-102', 'Q3 Cloud Architecture & Security Audit', '2026-10-15', 'Audit', 'Annual external audit for web & application infrastructure security');
    insertEvent.run('EVT-103', 'Dussehra Festival', '2026-10-24', 'Holiday', 'National Festival Holiday');
    insertEvent.run('EVT-104', 'A2Z Enterprise App Framework 3.0 Rollout', '2026-11-05', 'Milestone', 'Launch of high-performance microservices architecture & mobile SDK');
    insertEvent.run('EVT-105', 'Diwali Celebration & Holiday', '2026-11-12', 'Holiday', 'Festival of Lights company celebration');
    insertEvent.run('EVT-106', 'Christmas Day', '2026-12-25', 'Holiday', 'Winter corporate holiday');
  }

  // Pre-seed development tasks if empty or remove legacy BGV tasks
  const tasksCountRow = db.prepare('SELECT COUNT(*) as count FROM verification_tasks').get() as { count: number };
  if (tasksCountRow.count === 0) {
    const insertTask = db.prepare(`
      INSERT INTO verification_tasks (id, title, assigned_to, employee_name, priority, time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertTask.run('TSK-101', 'Next.js Frontend Architecture & UI Sprint', 'EMP-101', 'Alok Kumar', 'High', 'SLA: 4h', 'In Progress');
    insertTask.run('TSK-102', 'REST API Gateway & Payment SDK Integration', 'EMP-102', 'Priya Sharma', 'Urgent', 'SLA: 2h', 'Review');
    insertTask.run('TSK-103', 'Mobile App Push Notifications & Offline Sync', 'EMP-103', 'Rahul Verma', 'Normal', 'SLA: 24h', 'Verified');
    insertTask.run('TSK-104', 'Cloud Database Migration & Query Indexing', 'EMP-104', 'Sneha Patel', 'Normal', 'SLA: 12h', 'In Progress');
  } else {
    // Clean up any legacy BGV tasks if they exist
    try {
      db.prepare(`DELETE FROM verification_tasks WHERE id LIKE 'BGV%'`).run();
      const currentCount = db.prepare('SELECT COUNT(*) as count FROM verification_tasks').get() as { count: number };
      if (currentCount.count === 0) {
        const insertTask = db.prepare(`
          INSERT INTO verification_tasks (id, title, assigned_to, employee_name, priority, time, status)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        insertTask.run('TSK-101', 'Next.js Frontend Architecture & UI Sprint', 'EMP-101', 'Alok Kumar', 'High', 'SLA: 4h', 'In Progress');
        insertTask.run('TSK-102', 'REST API Gateway & Payment SDK Integration', 'EMP-102', 'Priya Sharma', 'Urgent', 'SLA: 2h', 'Review');
        insertTask.run('TSK-103', 'Mobile App Push Notifications & Offline Sync', 'EMP-103', 'Rahul Verma', 'Normal', 'SLA: 24h', 'Verified');
        insertTask.run('TSK-104', 'Cloud Database Migration & Query Indexing', 'EMP-104', 'Sneha Patel', 'Normal', 'SLA: 12h', 'In Progress');
      }
    } catch (e) {}
  }
}

export interface VerificationTask {
  id: string;
  title: string;
  assigned_to: string;
  employee_name: string;
  priority: 'Urgent' | 'High' | 'Normal';
  time: string;
  status: 'In Progress' | 'Review' | 'Verified' | 'Blocked';
  created_at?: string;
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
  status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'HALF_DAY';
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

  getEmployeeByEmail(email: string): Employee | undefined {
    const database = getDatabase();
    return database.prepare('SELECT * FROM employees WHERE LOWER(email) = LOWER(?)').get(email) as Employee | undefined;
  },

  getAttendanceStats() {
    const database = getDatabase();
    const rows = database.prepare("SELECT status, COUNT(*) as count FROM employees WHERE role != 'ADMIN' GROUP BY status").all() as { status: string; count: number }[];
    const totalRow = database.prepare("SELECT COUNT(*) as total FROM employees WHERE role != 'ADMIN'").get() as { total: number };
    
    let present = 0;
    let absent = 0;
    let onLeave = 0;
    let halfDay = 0;

    for (const r of rows) {
      const s = (r.status || '').toUpperCase();
      if (s === 'PRESENT') present += r.count;
      else if (s === 'ABSENT') absent += r.count;
      else if (s === 'ON_LEAVE') onLeave += r.count;
      else if (s === 'HALF_DAY') halfDay += r.count;
    }

    return {
      total: totalRow?.total || 0,
      present,
      absent,
      onLeave,
      halfDay
    };
  },

  createEmployee(data: {
    id?: string;
    name: string;
    username: string;
    password?: string;
    role: string;
    department?: string;
    email: string;
    phone?: string;
    status?: 'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'HALF_DAY';
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
    const department = data.department?.trim() || 'Operations';
    const status = data.status || 'PRESENT';
    const checkIn = (status === 'PRESENT' || status === 'HALF_DAY') ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

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
      department,
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
      if (updates.status === 'PRESENT' || updates.status === 'HALF_DAY') {
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
  },

  // TASKS METHODS
  getTasks(filter?: { status?: string; employee_id?: string }): VerificationTask[] {
    const database = getDatabase();
    let query = 'SELECT * FROM verification_tasks WHERE 1=1';
    const params: unknown[] = [];
    if (filter?.status && filter.status !== 'ALL') {
      query += ' AND status = ?';
      params.push(filter.status);
    }
    if (filter?.employee_id) {
      query += ' AND assigned_to = ?';
      params.push(filter.employee_id);
    }
    query += ' ORDER BY created_at DESC';
    return database.prepare(query).all(...params) as unknown as VerificationTask[];
  },

  getTaskStats() {
    const database = getDatabase();
    const rows = database.prepare('SELECT status, COUNT(*) as count FROM verification_tasks GROUP BY status').all() as { status: string; count: number }[];
    const totalRow = database.prepare('SELECT COUNT(*) as total FROM verification_tasks').get() as { total: number };

    let inProgress = 0;
    let review = 0;
    let verified = 0;
    let blocked = 0;

    for (const r of rows) {
      if (r.status === 'In Progress') inProgress += r.count;
      else if (r.status === 'Review') review += r.count;
      else if (r.status === 'Verified') verified += r.count;
      else if (r.status === 'Blocked') blocked += r.count;
    }

    return {
      total: totalRow?.total || 0,
      inProgress,
      review,
      verified,
      blocked
    };
  },

  createTask(data: {
    id?: string;
    title: string;
    assigned_to?: string;
    employee_name?: string;
    priority?: 'Urgent' | 'High' | 'Normal';
    time?: string;
    status?: 'In Progress' | 'Review' | 'Verified' | 'Blocked';
  }): VerificationTask {
    const database = getDatabase();
    const id = data.id?.trim() && !data.id.startsWith('BGV-') ? data.id.trim() : `TSK-${Math.floor(100 + Math.random() * 900)}`;
    const priority = data.priority || 'Normal';
    const time = data.time || 'SLA: 4h';
    const status = data.status || 'In Progress';
    const assigned_to = data.assigned_to || '';
    const employee_name = data.employee_name || 'Staff Member';

    const stmt = database.prepare(`
      INSERT INTO verification_tasks (id, title, assigned_to, employee_name, priority, time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, data.title, assigned_to, employee_name, priority, time, status);
    return {
      id,
      title: data.title,
      assigned_to,
      employee_name,
      priority,
      time,
      status
    };
  },

  updateTask(id: string, updates: Partial<VerificationTask>): VerificationTask | undefined {
    const database = getDatabase();
    const existing = database.prepare('SELECT * FROM verification_tasks WHERE id = ?').get(id) as unknown as VerificationTask;
    if (!existing) return undefined;

    const fields: string[] = [];
    const values: unknown[] = [];

    if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
    if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
    if (updates.priority !== undefined) { fields.push('priority = ?'); values.push(updates.priority); }
    if (updates.time !== undefined) { fields.push('time = ?'); values.push(updates.time); }
    if (updates.assigned_to !== undefined) { fields.push('assigned_to = ?'); values.push(updates.assigned_to); }
    if (updates.employee_name !== undefined) { fields.push('employee_name = ?'); values.push(updates.employee_name); }

    if (fields.length === 0) return existing;

    values.push(id);
    database.prepare(`UPDATE verification_tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return database.prepare('SELECT * FROM verification_tasks WHERE id = ?').get(id) as unknown as VerificationTask;
  },

  deleteTask(id: string): boolean {
    const database = getDatabase();
    const res = database.prepare('DELETE FROM verification_tasks WHERE id = ?').run(id);
    return res.changes > 0;
  }
};
