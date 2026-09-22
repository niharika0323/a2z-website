import { createClient, Client } from '@libsql/client';
import path from 'node:path';
import fs from 'node:fs';

export interface Employee {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: string;
  email: string;
  phone: string;
  status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'HALF_DAY' | '' | string;
  check_in_time: string;
  check_out_time: string;
  created_at?: string;
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

export interface CompanyEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  created_at?: string;
}

// Global singletons to prevent connection leaks across serverless / reloads
declare global {
  // eslint-disable-next-line no-var
  var __a2z_libsql_client: Client | undefined;
  // eslint-disable-next-line no-var
  var __a2z_db_init_promise: Promise<void> | undefined;
}

export function isUsingTurso(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

export function getDatabaseInfo() {
  const usingTurso = isUsingTurso();
  return {
    engine: usingTurso ? 'Turso Cloud LibSQL / SQLite' : 'Local SQLite (@libsql/client)',
    url: usingTurso 
      ? (process.env.TURSO_DATABASE_URL?.split('@').pop() || 'Turso Cloud') 
      : 'file:data/a2z.db',
    isTurso: usingTurso,
  };
}

function getClient(): Client {
  if (!global.__a2z_libsql_client) {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoToken = process.env.TURSO_AUTH_TOKEN;

    if (tursoUrl) {
      global.__a2z_libsql_client = createClient({
        url: tursoUrl,
        authToken: tursoToken,
      });
    } else {
      // Local SQLite fallback
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        try {
          fs.mkdirSync(dataDir, { recursive: true });
        } catch {}
      }
      const localFilePath = path.join(dataDir, 'a2z.db').replace(/\\/g, '/');
      global.__a2z_libsql_client = createClient({
        url: `file:${localFilePath}`,
      });
    }
  }
  return global.__a2z_libsql_client;
}

async function initializeSchema(client: Client) {
  // Create tables without department column
  await client.execute(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      status TEXT DEFAULT '',
      check_in_time TEXT DEFAULT '',
      check_out_time TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Drop department column if migrating existing table on Turso / SQLite
  try {
    await client.execute('ALTER TABLE employees DROP COLUMN department');
  } catch {}

  await client.execute(`
    CREATE TABLE IF NOT EXISTS company_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
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
  const adminCheck = await client.execute({
    sql: 'SELECT id FROM employees WHERE username = ?',
    args: ['admin'],
  });

  if (adminCheck.rows.length === 0) {
    await client.execute({
      sql: `INSERT INTO employees (id, name, username, password, role, email, phone, status, check_in_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        'ADM-001',
        'System Administrator',
        'admin',
        'admin',
        'ADMIN',
        'admin@a2z.com',
        '+91 90158 21469',
        'PRESENT',
        '08:30 AM',
      ],
    });
  }

  // Pre-seed initial employees to showcase realistic attendance counters if empty
  const empCount = await client.execute('SELECT COUNT(*) as count FROM employees');
  const count = Number(empCount.rows[0]?.count || 0);

  if (count <= 1) {
    const seedEmployees = [
      ['EMP-101', 'Alok Kumar', 'alok', 'password123', 'Senior BGV Verification Engineer', 'alok@a2z.com', '+91 98765 43210', 'PRESENT', '09:12 AM'],
      ['EMP-102', 'Niharika Singh', 'niharika', 'password123', 'BGV Product Manager', 'niharika@a2z.com', '+91 98765 43211', 'PRESENT', '09:28 AM'],
      ['EMP-103', 'Rahul Verma', 'rahul', 'password123', 'Lead Forensic BGV Checker', 'rahul.v@a2z.com', '+91 98765 43212', 'ABSENT', ''],
      ['EMP-104', 'Priya Sharma', 'priya', 'password123', 'Compliance & Legal Risk Specialist', 'priya.s@a2z.com', '+91 98765 43213', 'ON_LEAVE', ''],
      ['EMP-105', 'Amit Patel', 'amit', 'password123', 'Distributed Systems Architect', 'amit.p@a2z.com', '+91 98765 43214', 'PRESENT', '09:05 AM'],
    ];

    for (const emp of seedEmployees) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO employees (id, name, username, password, role, email, phone, status, check_in_time)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: emp,
      });
    }
  }

  // Pre-seed company events if empty
  const evtCount = await client.execute('SELECT COUNT(*) as count FROM company_events');
  if (Number(evtCount.rows[0]?.count || 0) === 0) {
    const seedEvents = [
      ['EVT-101', 'Gandhi Jayanti', '2026-10-02', 'Holiday', 'National Holiday - Corporate offices closed'],
      ['EVT-102', 'Q3 Cloud Architecture & Security Audit', '2026-10-15', 'Audit', 'Annual external audit for web & application infrastructure security'],
      ['EVT-103', 'Dussehra Festival', '2026-10-24', 'Holiday', 'National Festival Holiday'],
      ['EVT-104', 'A2Z Enterprise App Framework 3.0 Rollout', '2026-11-05', 'Milestone', 'Launch of high-performance microservices architecture & mobile SDK'],
      ['EVT-105', 'Diwali Celebration & Holiday', '2026-11-12', 'Holiday', 'Festival of Lights company celebration'],
      ['EVT-106', 'Christmas Day', '2026-12-25', 'Holiday', 'Winter corporate holiday'],
    ];
    for (const evt of seedEvents) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO company_events (id, title, date, type, description) VALUES (?, ?, ?, ?, ?)`,
        args: evt,
      });
    }
  }

  // Pre-seed development tasks if empty
  const tskCount = await client.execute('SELECT COUNT(*) as count FROM verification_tasks');
  if (Number(tskCount.rows[0]?.count || 0) === 0) {
    const seedTasks = [
      ['TSK-101', 'Next.js Frontend Architecture & UI Sprint', 'EMP-101', 'Alok Kumar', 'High', 'SLA: 4h', 'In Progress'],
      ['TSK-102', 'REST API Gateway & Payment SDK Integration', 'EMP-102', 'Priya Sharma', 'Urgent', 'SLA: 2h', 'Review'],
      ['TSK-103', 'Mobile App Push Notifications & Offline Sync', 'EMP-103', 'Rahul Verma', 'Normal', 'SLA: 24h', 'Verified'],
      ['TSK-104', 'Cloud Database Migration & Query Indexing', 'EMP-104', 'Sneha Patel', 'Normal', 'SLA: 12h', 'In Progress'],
    ];
    for (const t of seedTasks) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO verification_tasks (id, title, assigned_to, employee_name, priority, time, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: t,
      });
    }
  }
}

async function getDb(): Promise<Client> {
  const client = getClient();
  if (!global.__a2z_db_init_promise) {
    global.__a2z_db_init_promise = initializeSchema(client).catch((err) => {
      global.__a2z_db_init_promise = undefined;
      throw err;
    });
  }
  await global.__a2z_db_init_promise;
  return client;
}

export const db = {
  // EMPLOYEE METHODS
  async getEmployees(options?: { status?: string; search?: string }): Promise<Employee[]> {
    const client = await getDb();
    let query = 'SELECT id, name, username, role, email, phone, status, check_in_time, check_out_time, created_at FROM employees WHERE 1=1';
    const params: (string | number)[] = [];

    if (options?.status && options.status !== 'ALL') {
      query += ' AND UPPER(status) = UPPER(?)';
      params.push(options.status);
    }

    if (options?.search) {
      query += ' AND (name LIKE ? OR username LIKE ? OR id LIKE ? OR role LIKE ?)';
      const term = `%${options.search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY created_at ASC';
    const res = await client.execute({ sql: query, args: params });
    return res.rows as unknown as Employee[];
  },

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    const client = await getDb();
    const res = await client.execute({
      sql: 'SELECT id, name, username, role, email, phone, status, check_in_time, check_out_time FROM employees WHERE id = ?',
      args: [id],
    });
    return res.rows[0] as unknown as Employee | undefined;
  },

  async getEmployeeByUsername(username: string): Promise<Employee | undefined> {
    const client = await getDb();
    const res = await client.execute({
      sql: 'SELECT * FROM employees WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
      args: [username, username],
    });
    return res.rows[0] as unknown as Employee | undefined;
  },

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    const client = await getDb();
    const res = await client.execute({
      sql: 'SELECT * FROM employees WHERE LOWER(email) = LOWER(?)',
      args: [email],
    });
    return res.rows[0] as unknown as Employee | undefined;
  },

  async getAttendanceStats() {
    const client = await getDb();
    const rowsRes = await client.execute("SELECT status, COUNT(*) as count FROM employees WHERE role != 'ADMIN' GROUP BY status");
    const totalRes = await client.execute("SELECT COUNT(*) as total FROM employees WHERE role != 'ADMIN'");

    let present = 0;
    let absent = 0;
    let onLeave = 0;
    let halfDay = 0;

    for (const r of rowsRes.rows as unknown as { status: string; count: number }[]) {
      const s = (r.status || '').toUpperCase();
      if (s === 'PRESENT') present += Number(r.count);
      else if (s === 'ABSENT') absent += Number(r.count);
      else if (s === 'ON_LEAVE') onLeave += Number(r.count);
      else if (s === 'HALF_DAY') halfDay += Number(r.count);
    }

    return {
      total: Number(totalRes.rows[0]?.total || 0),
      present,
      absent,
      onLeave,
      halfDay,
    };
  },

  async createEmployee(data: {
    id?: string;
    name: string;
    username: string;
    password?: string;
    role: string;
    email: string;
    phone?: string;
    status?: 'PRESENT' | 'ABSENT' | 'ON_LEAVE' | 'HALF_DAY';
  }): Promise<Employee> {
    const client = await getDb();

    let empId = data.id?.trim();
    if (!empId) {
      const allEmpsRes = await client.execute("SELECT id FROM employees WHERE id LIKE 'EMP-%'");
      let maxNum = 105;
      for (const e of allEmpsRes.rows as unknown as { id: string }[]) {
        const num = parseInt(e.id.replace('EMP-', ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
      empId = `EMP-${maxNum + 1}`;
    }

    const password = data.password || 'password123';
    const status = data.status || '';
    const checkIn = (status === 'PRESENT' || status === 'HALF_DAY') 
      ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : '';

    await client.execute({
      sql: `INSERT INTO employees (id, name, username, password, role, email, phone, status, check_in_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        empId,
        data.name,
        data.username.trim().toLowerCase(),
        password,
        data.role,
        data.email,
        data.phone || '',
        status,
        checkIn,
      ],
    });

    return (await this.getEmployeeById(empId))!;
  },

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | undefined> {
    const client = await getDb();
    const existing = await this.getEmployeeById(id);
    if (!existing) return undefined;

    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.role !== undefined) { fields.push('role = ?'); values.push(updates.role); }
    if (updates.email !== undefined) { fields.push('email = ?'); values.push(updates.email); }
    if (updates.phone !== undefined) { fields.push('phone = ?'); values.push(updates.phone); }
    if (updates.password !== undefined) { fields.push('password = ?'); values.push(updates.password); }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
      if (updates.status === 'PRESENT' || updates.status === 'HALF_DAY') {
        fields.push('check_in_time = ?');
        values.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else if (updates.status === 'ABSENT' || updates.status === 'ON_LEAVE' || updates.status === '') {
        fields.push('check_in_time = ?');
        values.push('');
      }
    }
    if (updates.check_in_time !== undefined) { fields.push('check_in_time = ?'); values.push(updates.check_in_time); }
    if (updates.check_out_time !== undefined) { fields.push('check_out_time = ?'); values.push(updates.check_out_time); }

    if (fields.length === 0) return existing;

    values.push(id);
    await client.execute({
      sql: `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`,
      args: values,
    });
    return this.getEmployeeById(id);
  },

  async deleteEmployee(id: string): Promise<boolean> {
    const client = await getDb();
    if (id === 'ADM-001') return false; // Root Admin cannot be deleted
    const res = await client.execute({
      sql: "DELETE FROM employees WHERE id = ? AND role != 'ADMIN'",
      args: [id],
    });
    return res.rowsAffected > 0;
  },

  // EVENTS METHODS
  async getEvents(): Promise<CompanyEvent[]> {
    const client = await getDb();
    const res = await client.execute('SELECT * FROM company_events ORDER BY date ASC');
    return res.rows as unknown as CompanyEvent[];
  },

  async createEvent(data: { title: string; date: string; type: string; description?: string }): Promise<CompanyEvent> {
    const client = await getDb();
    const id = `EVT-${Date.now().toString().slice(-6)}`;
    await client.execute({
      sql: 'INSERT INTO company_events (id, title, date, type, description) VALUES (?, ?, ?, ?, ?)',
      args: [id, data.title, data.date, data.type, data.description || ''],
    });
    return { id, ...data, description: data.description || '' };
  },

  async deleteEvent(id: string): Promise<boolean> {
    const client = await getDb();
    const res = await client.execute({
      sql: 'DELETE FROM company_events WHERE id = ?',
      args: [id],
    });
    return res.rowsAffected > 0;
  },

  // TASKS METHODS
  async getTasks(filter?: { status?: string; employee_id?: string; username?: string }): Promise<VerificationTask[]> {
    const client = await getDb();
    let query = 'SELECT * FROM verification_tasks WHERE 1=1';
    const params: string[] = [];
    if (filter?.status && filter.status !== 'ALL') {
      query += ' AND status = ?';
      params.push(filter.status);
    }
    if (filter?.employee_id) {
      if (filter.username) {
        query += ' AND (assigned_to = ? OR LOWER(assigned_to) = LOWER(?) OR LOWER(employee_name) = LOWER(?))';
        params.push(filter.employee_id, filter.username, filter.username);
      } else {
        query += ' AND (assigned_to = ? OR LOWER(assigned_to) = LOWER(?))';
        params.push(filter.employee_id, filter.employee_id);
      }
    }
    query += ' ORDER BY created_at DESC';
    const res = await client.execute({ sql: query, args: params });
    return res.rows as unknown as VerificationTask[];
  },

  async getTaskStats(filter?: { employee_id?: string; username?: string }) {
    const client = await getDb();
    let whereClause = '';
    const params: string[] = [];
    if (filter?.employee_id) {
      if (filter.username) {
        whereClause = ' WHERE (assigned_to = ? OR LOWER(assigned_to) = LOWER(?) OR LOWER(employee_name) = LOWER(?))';
        params.push(filter.employee_id, filter.username, filter.username);
      } else {
        whereClause = ' WHERE (assigned_to = ? OR LOWER(assigned_to) = LOWER(?))';
        params.push(filter.employee_id, filter.employee_id);
      }
    }

    const rowsRes = await client.execute({
      sql: `SELECT status, COUNT(*) as count FROM verification_tasks ${whereClause} GROUP BY status`,
      args: params,
    });
    const totalRes = await client.execute({
      sql: `SELECT COUNT(*) as total FROM verification_tasks ${whereClause}`,
      args: params,
    });

    let inProgress = 0;
    let review = 0;
    let verified = 0;
    let blocked = 0;

    for (const r of rowsRes.rows as unknown as { status: string; count: number }[]) {
      if (r.status === 'In Progress') inProgress += Number(r.count);
      else if (r.status === 'Review') review += Number(r.count);
      else if (r.status === 'Verified') verified += Number(r.count);
      else if (r.status === 'Blocked') blocked += Number(r.count);
    }

    return {
      total: Number(totalRes.rows[0]?.total || 0),
      inProgress,
      review,
      verified,
      blocked,
    };
  },

  async createTask(data: {
    id?: string;
    title: string;
    assigned_to?: string;
    employee_name?: string;
    priority?: 'Urgent' | 'High' | 'Normal';
    time?: string;
    status?: 'In Progress' | 'Review' | 'Verified' | 'Blocked';
  }): Promise<VerificationTask> {
    const client = await getDb();
    const id = data.id?.trim() && !data.id.startsWith('BGV-') ? data.id.trim() : `TSK-${Math.floor(100 + Math.random() * 900)}`;
    const priority = data.priority || 'Normal';
    const time = data.time || 'SLA: 4h';
    const status = data.status || 'In Progress';
    const assigned_to = data.assigned_to || '';
    const employee_name = data.employee_name || 'Staff Member';

    await client.execute({
      sql: 'INSERT INTO verification_tasks (id, title, assigned_to, employee_name, priority, time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [id, data.title, assigned_to, employee_name, priority, time, status],
    });

    return {
      id,
      title: data.title,
      assigned_to,
      employee_name,
      priority,
      time,
      status,
    };
  },

  async updateTask(id: string, updates: Partial<VerificationTask>): Promise<VerificationTask | undefined> {
    const client = await getDb();
    const existingRes = await client.execute({
      sql: 'SELECT * FROM verification_tasks WHERE id = ?',
      args: [id],
    });
    const existing = existingRes.rows[0] as unknown as VerificationTask | undefined;
    if (!existing) return undefined;

    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
    if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
    if (updates.priority !== undefined) { fields.push('priority = ?'); values.push(updates.priority); }
    if (updates.time !== undefined) { fields.push('time = ?'); values.push(updates.time); }
    if (updates.assigned_to !== undefined) { fields.push('assigned_to = ?'); values.push(updates.assigned_to); }
    if (updates.employee_name !== undefined) { fields.push('employee_name = ?'); values.push(updates.employee_name); }

    if (fields.length === 0) return existing;

    values.push(id);
    await client.execute({
      sql: `UPDATE verification_tasks SET ${fields.join(', ')} WHERE id = ?`,
      args: values,
    });

    const updatedRes = await client.execute({
      sql: 'SELECT * FROM verification_tasks WHERE id = ?',
      args: [id],
    });
    return updatedRes.rows[0] as unknown as VerificationTask;
  },

  async deleteTask(id: string): Promise<boolean> {
    const client = await getDb();
    const res = await client.execute({
      sql: 'DELETE FROM verification_tasks WHERE id = ?',
      args: [id],
    });
    return res.rowsAffected > 0;
  },
};
