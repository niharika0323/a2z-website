"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  LogOut,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Plus,
  Trash2,
  KeyRound,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building,
  Mail,
  Phone,
  RefreshCw,
  X,
  ShieldCheck,
  Database,
  Server,
  HardDrive,
  FileCode,
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/Logo";

interface Employee {
  id: string;
  name: string;
  username: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "PRESENT" | "ABSENT" | "ON_LEAVE" | "HALF_DAY";
  check_in_time: string;
  check_out_time: string;
}

interface Stats {
  total: number;
  present: number;
  absent: number;
  onLeave: number;
  halfDay?: number;
}

interface CompanyEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
}

interface VerificationTask {
  id: string;
  title: string;
  assigned_to: string;
  employee_name: string;
  priority: "Urgent" | "High" | "Normal";
  time: string;
  status: "In Progress" | "Review" | "Verified" | "Blocked";
  created_at?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<"EMPLOYEES" | "ATTENDANCE" | "TASKS" | "CALENDAR" | "BACKEND">("EMPLOYEES");

  // Backend inspector state
  const [backendData, setBackendData] = useState<any>(null);
  const [selectedDbTable, setSelectedDbTable] = useState<string>("employees");
  const [loadingBackend, setLoadingBackend] = useState<boolean>(false);
  const [dbSearchTerm, setDbSearchTerm] = useState<string>("");

  // Data states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, present: 0, absent: 0, onLeave: 0 });
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [tasks, setTasks] = useState<VerificationTask[]>([]);
  const [taskStats, setTaskStats] = useState({ total: 0, inProgress: 0, review: 0, verified: 0, blocked: 0 });
  const [taskStatusFilter, setTaskStatusFilter] = useState("ALL");
  const [taskSearchTerm, setTaskSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  // Modals
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [empModalError, setEmpModalError] = useState("");
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states - Add Employee
  const [newEmp, setNewEmp] = useState({
    id: "",
    name: "",
    username: "",
    password: "",
    role: "",
    department: "Security & Verification Ops",
    email: "",
    phone: "",
    status: "PRESENT" as "PRESENT" | "ABSENT" | "ON_LEAVE"
  });

  // Form states - Add Event
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    type: "Company Holiday",
    description: ""
  });

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 9, 1)); // Oct 2026

  useEffect(() => {
    // Check session
    const stored = localStorage.getItem("a2z_user");
    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(stored);
      if (user.role !== "ADMIN") {
        router.push("/employee");
        return;
      }
      setCurrentUser(user);
    } catch {
      router.push("/login");
      return;
    }

    fetchEmployees();
    fetchEvents();
    fetchTasks();
    fetchBackendStatus();
  }, [router]);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchBackendStatus = async () => {
    setLoadingBackend(true);
    try {
      const res = await fetch("/api/backend-status");
      const data = await res.json();
      if (res.ok) {
        setBackendData(data);
      }
    } catch (err) {
      console.error("Failed to fetch backend status", err);
    } finally {
      setLoadingBackend(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      if (res.ok) {
        setEmployees(data.employees || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks || []);
        if (data.stats) setTaskStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch tasks in admin", err);
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: VerificationTask["status"]) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === taskId ? data.task : t));
        if (data.stats) setTaskStats(data.stats);
        showNotification(`Task status updated to "${newStatus}"`);
      } else {
        showNotification(data.error || "Failed to update task", "error");
      }
    } catch (err) {
      showNotification("Error updating task status", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("a2z_user");
    document.cookie = "a2z_role=; path=/; max-age=0";
    router.push("/login");
  };

  // Quick Attendance Status Toggle
  const handleStatusChange = async (id: string, newStatus: "PRESENT" | "ABSENT" | "ON_LEAVE" | "HALF_DAY") => {
    try {
      const res = await fetch("/api/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(prev => prev.map(e => e.id === id ? data.employee : e));
        if (data.stats) setStats(data.stats);
        showNotification(`Status updated to ${newStatus}`);
      } else {
        showNotification(data.error || "Failed to update status", "error");
      }
    } catch (err) {
      showNotification("Error updating status", "error");
    }
  };

  // Create Employee
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmpModalError("");
    if (!newEmp.name || !newEmp.username || !newEmp.role || !newEmp.email) {
      setEmpModalError("Please fill all required fields");
      showNotification("Please fill all required fields", "error");
      return;
    }

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmp)
      });
      const data = await res.json();

      if (res.ok) {
        setShowAddEmpModal(false);
        setEmpModalError("");
        setEmployees(prev => [...prev, data.employee]);
        if (data.stats) setStats(data.stats);
        setNewEmp({
          id: "",
          name: "",
          username: "",
          password: "",
          role: "",
          department: "Security & Verification Ops",
          email: "",
          phone: "",
          status: "PRESENT"
        });
        showNotification(`Employee ${data.employee.name} created successfully!`);
      } else {
        const errMsg = data.error || "User already exists with this email or employee ID";
        setEmpModalError(errMsg);
        showNotification(errMsg, "error");
      }
    } catch (err) {
      setEmpModalError("Error creating employee. Please check connection.");
      showNotification("Error creating employee", "error");
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove employee: ${name}?`)) return;

    try {
      const res = await fetch(`/api/employees?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(prev => prev.filter(e => e.id !== id));
        if (data.stats) setStats(data.stats);
        showNotification(`Employee removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete employee", "error");
      }
    } catch (err) {
      showNotification("Error deleting employee", "error");
    }
  };

  // Create Event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.type) {
      showNotification("Please fill event title and date", "error");
      return;
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddEventModal(false);
        setEvents(prev => [...prev, data.event].sort((a, b) => a.date.localeCompare(b.date)));
        setNewEvent({
          title: "",
          date: new Date().toISOString().split("T")[0],
          type: "Company Holiday",
          description: ""
        });
        showNotification("Event added to company calendar!");
      } else {
        showNotification(data.error || "Failed to add event", "error");
      }
    } catch (err) {
      showNotification("Error adding event", "error");
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        showNotification("Event removed from calendar.");
      }
    } catch (err) {
      showNotification("Error deleting event", "error");
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== id));
        fetchTasks();
        showNotification("Task removed from verification queue.");
      }
    } catch (err) {
      showNotification("Error deleting task", "error");
    }
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const q = taskSearchTerm.toLowerCase();
      const matchesSearch =
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.employee_name && t.employee_name.toLowerCase().includes(q)) ||
        (t.assigned_to && t.assigned_to.toLowerCase().includes(q));

      const matchesStatus = taskStatusFilter === "ALL" || t.status === taskStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, taskSearchTerm, taskStatusFilter]);

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Exclude admin from the employee roster list if preferred, or keep with admin badge
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || emp.status === statusFilter;
      const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [employees, searchTerm, statusFilter, deptFilter]);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach(e => { if (e.department) set.add(e.department); });
    return Array.from(set);
  }, [employees]);

  // Calendar math
  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { day: number | null; dateStr: string; hasEvents: CompanyEvent[] }[] = [];

    // Empty leading padding
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null, dateStr: "", hasEvents: [] });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      const dateStr = `${year}-${mStr}-${dStr}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      days.push({ day: d, dateStr, hasEvents: dayEvents });
    }

    return days;
  }, [currentMonthDate, events]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6rem', position: 'relative', zIndex: 10, backgroundColor: '#070a10', color: '#ffffff' }}>
      {/* Top Admin Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.2rem 3rem',
        
        background: 'rgba(16, 24, 40, 0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" showTagline={false} />
          </Link>
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8, #9b72cf)',
            color: 'rgba(16, 24, 40, 0.85)',
            padding: '0.25rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Admin Control Center
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
            <Shield size={18} color="#38bdf8" />
            <span>Root Administrator</span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={16} color="#f87171" /> Logout
          </button>
        </div>
      </nav>

      {/* Notification Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '5rem',
              right: '3rem',
              zIndex: 999,
              padding: '0.9rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              background: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
            }}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '1160px', margin: '1.2rem auto 0 auto', padding: '0 1.2rem' }}>

        {/* Real-Time Attendance Statistics Header */}
        <div style={{ marginBottom: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Workforce Intelligence & Attendance
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: '0.25rem 0 0 0' }}>
                Real-time visibility into staff availability, employee credentials, and upcoming company calendar
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={fetchEmployees}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(16, 24, 40, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={15} /> Refresh
              </button>
              <button
                onClick={() => setShowAddEmpModal(true)}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.88rem',
                  borderRadius: '8px'
                }}
              >
                <UserPlus size={16} /> Create Employee
              </button>
            </div>
          </div>

          {/* 4 Attendance Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.9rem' }}>

            {/* Total Staff */}
            <div className="glass-card" style={{ padding: '1rem 1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#94a3b8' }}>Total Employees</span>
                <Users size={18} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.3rem' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Active in database
              </div>
            </div>

            {/* Present Counter */}
            <div className="glass-card" style={{ padding: '1rem 1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 245, 212, 0.35)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#28a745' }}>🟢 Present Today</span>
                <CheckCircle2 size={18} color="#28a745" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#28a745', marginTop: '0.3rem' }}>
                {stats.present}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}% of workforce
              </div>
            </div>

            {/* Absent Counter */}
            <div className="glass-card" style={{ padding: '1rem 1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#dc3545' }}>🔴 Absent</span>
                <XCircle size={18} color="#dc3545" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc3545', marginTop: '0.3rem' }}>
                {stats.absent}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Unscheduled absence
              </div>
            </div>

            {/* On Leave Counter */}
            <div className="glass-card" style={{ padding: '1rem 1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#b58105' }}>🟡 On Leave</span>
                <Clock3 size={18} color="#b58105" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b58105', marginTop: '0.3rem' }}>
                {stats.onLeave}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Approved leave logged
              </div>
            </div>

          </div>

          {/* Visual Progress Bar */}
          <div style={{ marginTop: '0.9rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '8px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${stats.total ? (stats.present / stats.total) * 100 : 0}%`, background: '#28a745', transition: 'width 0.5s ease' }} title={`Present: ${stats.present}`} />
            <div style={{ width: `${stats.total ? (stats.onLeave / stats.total) * 100 : 0}%`, background: '#ffc107', transition: 'width 0.5s ease' }} title={`On Leave: ${stats.onLeave}`} />
            <div style={{ width: `${stats.total ? (stats.absent / stats.total) * 100 : 0}%`, background: '#dc3545', transition: 'width 0.5s ease' }} title={`Absent: ${stats.absent}`} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem', flexWrap: 'wrap' }}>
          {[
            { id: "EMPLOYEES", label: "Employee Management", icon: Users },
            { id: "ATTENDANCE", label: "Live Attendance Board", icon: Clock },
            { id: "TASKS", label: `Tasks & Status (${taskStats.inProgress} Active)`, icon: ShieldCheck },
            { id: "CALENDAR", label: "Upcoming Events & Calendar", icon: Calendar },
            { id: "BACKEND", label: "Database & Backend Explorer", icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)' : 'rgba(16, 24, 40, 0.75)',
                  color: isActive ? '#070a10' : '#cbd5e1',
                  border: isActive ? 'none' : '1px solid rgba(56, 189, 248, 0.25)',
                  boxShadow: isActive ? '0 4px 16px rgba(0, 245, 212, 0.35)' : 'none'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: EMPLOYEE MANAGEMENT (SINGLE TABLE) */}
        {activeTab === "EMPLOYEES" && (
          <div>
            {/* Search & Filter Bar */}
            <div className="glass-card" style={{ padding: '0.9rem 1.2rem', marginBottom: '1.2rem', display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px' }}>
              <div style={{ flex: '1 1 240px', position: 'relative' }}>
                <Search size={16} color="#38bdf8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.9rem' }} />
                <input
                  type="text"
                  placeholder="Search by name, ID, username, role or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.9rem 0.6rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    background: 'rgba(7, 10, 16, 0.75)',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#94a3b8' }}>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '0.55rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(7, 10, 16, 0.9)', color: '#ffffff', fontWeight: 600, fontSize: '0.88rem', outline: 'none' }}
                >
                  <option value="ALL">All ({stats.total})</option>
                  <option value="PRESENT">Present ({stats.present})</option>
                  <option value="ABSENT">Absent ({stats.absent})</option>
                  <option value="ON_LEAVE">On Leave ({stats.onLeave})</option>
                  <option value="HALF_DAY">Half Day ({stats.halfDay || 0})</option>
                </select>
              </div>

              {/* Department Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#94a3b8' }}>Dept:</span>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  style={{ padding: '0.55rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(7, 10, 16, 0.9)', color: '#ffffff', fontWeight: 600, fontSize: '0.88rem', outline: 'none' }}
                >
                  <option value="ALL">All Departments</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Employee Table */}
            <div className="glass-card" style={{ padding: '1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(56, 189, 248, 0.25)', overflowX: 'auto', borderRadius: '14px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 800 }}>
                    <th style={{ padding: '0.8rem 0.75rem' }}>EMP ID</th>
                    <th style={{ padding: '0.8rem 0.75rem' }}>Staff Name</th>
                    <th style={{ padding: '0.8rem 0.75rem' }}>Username</th>
                    <th style={{ padding: '0.8rem 0.75rem' }}>Role</th>
                    <th style={{ padding: '0.8rem 0.75rem' }}>Department</th>
                    <th style={{ padding: '0.8rem 0.75rem' }}>Live Status</th>
                    <th style={{ padding: '0.8rem 0.75rem' }}>Quick Status Toggle</th>
                    <th style={{ padding: '0.8rem 0.75rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => {
                    const isRootAdmin = emp.id === "ADM-001";
                    return (
                      <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.92rem', transition: 'background 0.2s' }}>
                        <td style={{ padding: '0.8rem 0.75rem', fontWeight: 800, color: '#00f5d4' }}>
                          {emp.id}
                        </td>
                        <td style={{ padding: '0.8rem 0.75rem' }}>
                          <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.05rem' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '0.15rem' }}>{emp.email}</div>
                        </td>
                        <td style={{ padding: '0.8rem 0.75rem', fontWeight: 600, color: '#e2e8f0' }}>
                          <code style={{ fontSize: '0.9rem', color: '#38bdf8' }}>{emp.username}</code>
                        </td>
                        <td style={{ padding: '0.8rem 0.75rem', color: '#ffffff', fontWeight: 600 }}>
                          {emp.role}
                        </td>
                        <td style={{ padding: '0.8rem 0.75rem', color: '#cbd5e1' }}>
                          {emp.department}
                        </td>
                        <td style={{ padding: '0.8rem 0.75rem' }}>
                          {emp.status === "PRESENT" && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0, 245, 212, 0.15)', color: '#00f5d4', border: '1px solid rgba(0, 245, 212, 0.35)', padding: '0.35rem 0.75rem', borderRadius: '16px', fontWeight: 700, fontSize: '0.84rem' }}>
                              <CheckCircle2 size={14} /> Present ({emp.check_in_time || 'Logged'})
                            </span>
                          )}
                          {emp.status === "HALF_DAY" && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.35rem 0.75rem', borderRadius: '16px', fontWeight: 700, fontSize: '0.84rem' }}>
                              <Clock3 size={14} /> Half Day ({emp.check_in_time || 'Logged'})
                            </span>
                          )}
                          {emp.status === "ABSENT" && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.35rem 0.75rem', borderRadius: '16px', fontWeight: 700, fontSize: '0.84rem' }}>
                              <XCircle size={14} /> Absent
                            </span>
                          )}
                          {emp.status === "ON_LEAVE" && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.35)', padding: '0.35rem 0.75rem', borderRadius: '16px', fontWeight: 700, fontSize: '0.84rem' }}>
                              <Clock3 size={14} /> On Leave
                            </span>
                          )}
                        </td>
                        {/* 1-Click Status Switcher (2x2 Grid) */}
                        <td style={{ padding: '0.8rem 0.75rem' }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 66px)',
                            gap: '0.35rem',
                            width: 'fit-content'
                          }}>
                            <button
                              onClick={() => handleStatusChange(emp.id, "PRESENT")}
                              title="Mark Present"
                              style={{
                                padding: '0.38rem 0.3rem',
                                borderRadius: '6px',
                                border: '1px solid #28a745',
                                background: emp.status === "PRESENT" ? '#28a745' : 'rgba(16, 24, 40, 0.85)',
                                color: emp.status === "PRESENT" ? '#fff' : '#28a745',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleStatusChange(emp.id, "HALF_DAY")}
                              title="Mark Half Day"
                              style={{
                                padding: '0.38rem 0.3rem',
                                borderRadius: '6px',
                                border: '1px solid #ffc107',
                                background: emp.status === "HALF_DAY" ? '#ffc107' : 'rgba(16, 24, 40, 0.85)',
                                color: emp.status === "HALF_DAY" ? '#000' : '#856404',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Half
                            </button>
                            <button
                              onClick={() => handleStatusChange(emp.id, "ABSENT")}
                              title="Mark Absent"
                              style={{
                                padding: '0.38rem 0.3rem',
                                borderRadius: '6px',
                                border: '1px solid #dc3545',
                                background: emp.status === "ABSENT" ? '#dc3545' : 'rgba(16, 24, 40, 0.85)',
                                color: emp.status === "ABSENT" ? '#fff' : '#dc3545',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleStatusChange(emp.id, "ON_LEAVE")}
                              title="Mark On Leave"
                              style={{
                                padding: '0.38rem 0.3rem',
                                borderRadius: '6px',
                                border: '1px solid #c2185b',
                                background: emp.status === "ON_LEAVE" ? '#c2185b' : 'rgba(16, 24, 40, 0.85)',
                                color: emp.status === "ON_LEAVE" ? '#fff' : '#c2185b',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Leave
                            </button>
                          </div>
                        </td>
                        {/* Actions */}
                        <td style={{ padding: '0.8rem 0.75rem', textAlign: 'right' }}>
                          {!isRootAdmin ? (
                            <button
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                              title="Delete Employee"
                              style={{
                                background: 'rgba(239, 68, 68, 0.12)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.84rem', color: '#94a3b8', fontWeight: 700 }}>
                              System Root
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                        No employee records found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ATTENDANCE BOARD */}
        {activeTab === "ATTENDANCE" && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.2rem' }}>

              {/* Present Column */}
              <div className="glass-card" style={{ padding: '1.3rem 1.4rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderTop: '4px solid #28a745', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={18} /> Present ({stats.present})
                  </div>
                  <span style={{ background: 'rgba(0, 245, 212, 0.15)', color: '#00f5d4', border: '1px solid rgba(0, 245, 212, 0.35)', fontWeight: 800, fontSize: '0.8rem', padding: '0.25rem 0.65rem', borderRadius: '12px' }}>
                    Active
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {employees.filter(e => e.status === "PRESENT").map(emp => (
                    <div key={emp.id} style={{ background: 'rgba(16, 24, 40, 0.9)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.02rem', color: '#ffffff' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '0.15rem' }}>{emp.id} • {emp.role}</div>
                        <div style={{ fontSize: '0.84rem', color: '#34d399', marginTop: '0.25rem', fontWeight: 700 }}>
                          In: {emp.check_in_time || '09:00 AM'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleStatusChange(emp.id, "ABSENT")}
                        style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Absent
                      </button>
                    </div>
                  ))}
                  {employees.filter(e => e.status === "PRESENT").length === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.92rem' }}>
                      No staff checked in yet today.
                    </div>
                  )}
                </div>
              </div>

              {/* Absent Column */}
              <div className="glass-card" style={{ padding: '1.3rem 1.4rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderTop: '4px solid #dc3545', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <XCircle size={18} /> Absent ({stats.absent})
                  </div>
                  <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.35)', fontWeight: 800, fontSize: '0.8rem', padding: '0.25rem 0.65rem', borderRadius: '12px' }}>
                    Off-Duty
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {employees.filter(e => e.status === "ABSENT").map(emp => (
                    <div key={emp.id} style={{ background: 'rgba(16, 24, 40, 0.9)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.02rem', color: '#ffffff' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '0.15rem' }}>{emp.id} • {emp.department}</div>
                        <div style={{ fontSize: '0.84rem', color: '#f87171', marginTop: '0.25rem', fontWeight: 700 }}>
                          No Check-in
                        </div>
                      </div>
                      <button
                        onClick={() => handleStatusChange(emp.id, "PRESENT")}
                        style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #28a745', background: '#28a745', color: '#ffffff', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Present
                      </button>
                    </div>
                  ))}
                  {stats.absent === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.8rem', color: '#94a3b8', fontSize: '0.92rem' }}>
                      No absent staff today! 100% accounted for.
                    </div>
                  )}
                </div>
              </div>

              {/* On Leave Column */}
              <div className="glass-card" style={{ padding: '1.3rem 1.4rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderTop: '4px solid #ffc107', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock3 size={18} /> On Leave ({stats.onLeave})
                  </div>
                  <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)', fontWeight: 800, fontSize: '0.8rem', padding: '0.25rem 0.65rem', borderRadius: '12px' }}>
                    Approved
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {employees.filter(e => e.status === "ON_LEAVE").map(emp => (
                    <div key={emp.id} style={{ background: 'rgba(16, 24, 40, 0.9)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.02rem', color: '#ffffff' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.86rem', color: '#94a3b8', marginTop: '0.15rem' }}>{emp.id} • {emp.department}</div>
                        <div style={{ fontSize: '0.84rem', color: '#fbbf24', marginTop: '0.25rem', fontWeight: 700 }}>
                          Leave Granted
                        </div>
                      </div>
                      <button
                        onClick={() => handleStatusChange(emp.id, "PRESENT")}
                        style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #28a745', background: '#28a745', color: '#ffffff', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Present
                      </button>
                    </div>
                  ))}
                  {stats.onLeave === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.8rem', color: '#94a3b8', fontSize: '0.92rem' }}>
                      No employees on leave today.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: UPCOMING EVENTS & INTERACTIVE CALENDAR */}
        {activeTab === "CALENDAR" && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>

            {/* Calendar Month View */}
            <div className="glass-card" style={{ padding: '2.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {monthNames[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {events.length} company events recorded
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))}
                    style={{ padding: '0.55rem 0.95rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(16, 24, 40, 0.85)', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Previous Month"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))}
                    style={{ padding: '0.55rem 0.95rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(16, 24, 40, 0.85)', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Next Month"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Days header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.6rem', textAlign: 'center', fontWeight: 800, fontSize: '0.95rem', color: '#38bdf8', marginBottom: '0.8rem' }}>
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>

              {/* Day cells with crystal-clear high contrast dates */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.6rem' }}>
                {calendarDays.map((c, idx) => {
                  if (!c.day) {
                    return <div key={idx} style={{ aspectRatio: '1', borderRadius: '10px' }} />;
                  }

                  const hasEvent = c.hasEvents.length > 0;
                  const isAudit = c.hasEvents.some(e => e.type.toLowerCase().includes("audit"));

                  return (
                    <div
                      key={idx}
                      title={c.hasEvents.map(e => e.title).join(", ") || `Day ${c.day}`}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: hasEvent ? '2px solid #00f5d4' : '1px solid rgba(56, 189, 248, 0.2)',
                        background: hasEvent
                          ? (isAudit ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%)' : 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(0, 245, 212, 0.2) 100%)')
                          : 'rgba(12, 16, 28, 0.85)',
                        boxShadow: hasEvent ? '0 0 16px rgba(0, 245, 212, 0.35)' : 'none',
                        cursor: hasEvent ? 'pointer' : 'default',
                        position: 'relative',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{
                        fontWeight: 800,
                        fontSize: hasEvent ? '1.2rem' : '1.15rem',
                        color: hasEvent ? '#00f5d4' : '#ffffff',
                        lineHeight: 1
                      }}>
                        {c.day}
                      </span>
                      {hasEvent && (
                        <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                          {c.hasEvents.map((_, eIdx) => (
                            <span key={eIdx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 6px #00f5d4' }} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.8rem', display: 'flex', gap: '1.8rem', fontSize: '0.9rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 8px #00f5d4' }} />
                  <span>Corporate Event / Scheduled Observance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7', boxShadow: '0 0 8px #a855f7' }} />
                  <span>Audit / Compliance Milestone</span>
                </div>
              </div>
            </div>

            {/* Event List & Add Event Trigger */}
            <div className="glass-card" style={{ padding: '2.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Upcoming Events & Holidays
                </h3>
                <button
                  onClick={() => setShowAddEventModal(true)}
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.3rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.45rem', borderRadius: '8px' }}
                >
                  <Plus size={18} /> Add Event
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '460px', overflowY: 'auto' }}>
                {events.map(ev => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '1.3rem 1.4rem',
                      borderRadius: '14px',
                      background: 'rgba(12, 16, 28, 0.85)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{ev.title}</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0.25rem 0.7rem', borderRadius: '20px', background: 'rgba(0, 245, 212, 0.15)', color: '#00f5d4', border: '1px solid rgba(0, 245, 212, 0.35)' }}>
                          {ev.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        📅 {ev.date}
                      </div>
                      {ev.description && (
                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.35rem', lineHeight: 1.5 }}>
                          {ev.description}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      title="Remove Event"
                      style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {events.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                    No upcoming events scheduled. Click "Add Event" to schedule.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: TASKS & VERIFICATION STATUS */}
        {activeTab === "TASKS" && (
          <div>
            {/* Task KPI Counters */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.9rem', marginBottom: '1.4rem' }}>
              <div className="glass-card" style={{ padding: '1rem 1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#94a3b8' }}>Total Queue</span>
                  <ShieldCheck size={18} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.3rem' }}>
                  {taskStats.total}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  All registered tasks
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', borderLeft: '4px solid #0284c7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#38bdf8' }}>🔵 In Progress</span>
                  <Clock size={18} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.3rem' }}>
                  {taskStats.inProgress}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Active sprints
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', borderLeft: '4px solid #a855f7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#c084fc' }}>🟣 Under Review</span>
                  <Layers size={18} color="#c084fc" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc', marginTop: '0.3rem' }}>
                  {taskStats.review}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  QA approval
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#34d399' }}>🟢 Completed</span>
                  <CheckCircle2 size={18} color="#34d399" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.3rem' }}>
                  {taskStats.verified}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Delivered & verified
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem 1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', borderLeft: '4px solid #ef4444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f87171' }}>🔴 Blocked</span>
                  <XCircle size={18} color="#f87171" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171', marginTop: '0.3rem' }}>
                  {taskStats.blocked}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Awaiting dependencies
                </div>
              </div>
            </div>

            {/* Task Filter & Search Bar */}
            <div className="glass-card" style={{ padding: '0.9rem 1.2rem', marginBottom: '1.2rem', display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px' }}>
              <div style={{ flex: '1 1 240px', position: 'relative' }}>
                <Search size={16} color="#38bdf8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.9rem' }} />
                <input
                  type="text"
                  placeholder="Search tasks by ID, task description, assigned engineer..."
                  value={taskSearchTerm}
                  onChange={(e) => setTaskSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.9rem 0.6rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    background: 'rgba(7, 10, 16, 0.75)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: 'rgba(7, 10, 16, 0.9)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#ffffff'
                }}
              >
                <option value="ALL">All Statuses ({taskStats.total})</option>
                <option value="In Progress">🔵 In Progress ({taskStats.inProgress})</option>
                <option value="Review">🟣 Under Review ({taskStats.review})</option>
                <option value="Verified">🟢 Completed / Done ({taskStats.verified})</option>
                <option value="Blocked">🔴 Blocked ({taskStats.blocked})</option>
              </select>

              <button
                onClick={fetchTasks}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                  color: '#06080e',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0, 245, 212, 0.25)'
                }}
                title="Refresh Tasks"
              >
                <RefreshCw size={15} />
                Refresh
              </button>
            </div>

            {/* Tasks Table */}
            <div className="glass-card" style={{ padding: '1.2rem', background: 'rgba(16, 24, 40, 0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px', overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Tasks Roster ({filteredTasks.length})
                </h3>
                <span style={{ fontSize: '0.86rem', color: '#94a3b8', fontWeight: 600 }}>
                  Live Operational Task Management
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 800 }}>
                    <th style={{ padding: '0.8rem 0.85rem' }}>Task ID</th>
                    <th style={{ padding: '0.8rem 0.85rem' }}>Task</th>
                    <th style={{ padding: '0.8rem 0.85rem' }}>Assigned Staff</th>
                    <th style={{ padding: '0.8rem 0.85rem' }}>Priority</th>
                    <th style={{ padding: '0.8rem 0.85rem' }}>SLA Target</th>
                    <th style={{ padding: '0.8rem 0.85rem' }}>Current Status</th>
                    <th style={{ padding: '0.8rem 0.85rem', textAlign: 'right' }}>Admin Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.92rem' }}>
                      <td style={{ padding: '0.8rem 0.85rem', fontWeight: 800 }}>
                        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.35)', padding: '0.3rem 0.65rem', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'monospace' }}>
                          {t.id}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 0.85rem', fontWeight: 700, color: '#ffffff', fontSize: '1.02rem' }}>
                        {t.title}
                      </td>
                      <td style={{ padding: '0.8rem 0.85rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '0.3rem 0.75rem', borderRadius: '16px', fontSize: '0.86rem', fontWeight: 700 }}>
                          👨‍💻 {t.employee_name || t.assigned_to || 'Software Engineer'}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 0.85rem' }}>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          padding: '0.3rem 0.7rem',
                          borderRadius: '12px',
                          background: t.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.2)' : t.priority === 'High' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                          color: t.priority === 'Urgent' ? '#f87171' : t.priority === 'High' ? '#fbbf24' : '#cbd5e1',
                          border: `1px solid ${t.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.4)' : t.priority === 'High' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(148, 163, 184, 0.3)'}`
                        }}>
                          {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 0.85rem', color: '#cbd5e1', fontWeight: 700 }}>
                        {t.time}
                      </td>
                      <td style={{ padding: '0.8rem 0.85rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          padding: '0.35rem 0.8rem',
                          borderRadius: '14px',
                          background:
                            t.status === 'Verified' ? 'rgba(16, 185, 129, 0.18)' :
                              t.status === 'Review' ? 'rgba(168, 85, 247, 0.18)' :
                                t.status === 'Blocked' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(56, 189, 248, 0.18)',
                          color:
                            t.status === 'Verified' ? '#34d399' :
                              t.status === 'Review' ? '#c084fc' :
                                t.status === 'Blocked' ? '#f87171' : '#38bdf8',
                          border: `1px solid ${t.status === 'Verified' ? 'rgba(16, 185, 129, 0.4)' :
                              t.status === 'Review' ? 'rgba(168, 85, 247, 0.4)' :
                                t.status === 'Blocked' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.4)'
                            }`
                        }}>
                          {t.status === 'Verified' && <CheckCircle2 size={14} />}
                          {t.status === 'Review' && <Layers size={14} />}
                          {t.status === 'Blocked' && <XCircle size={14} />}
                          {t.status === 'In Progress' && <Clock size={14} />}
                          {t.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 0.85rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select
                            value={t.status}
                            onChange={(e) => handleTaskStatusChange(t.id, e.target.value as any)}
                            style={{
                              padding: '0.45rem 0.85rem',
                              borderRadius: '8px',
                              fontSize: '0.86rem',
                              fontWeight: 700,
                              background: 'rgba(7, 10, 16, 0.95)',
                              border: '1px solid rgba(56, 189, 248, 0.4)',
                              color: '#38bdf8',
                              cursor: 'pointer',
                              outline: 'none',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                          >
                            <option value="In Progress" style={{ background: '#070a10', color: '#ffffff' }}>Set In Progress</option>
                            <option value="Review" style={{ background: '#070a10', color: '#ffffff' }}>Set Review</option>
                            <option value="Verified" style={{ background: '#070a10', color: '#ffffff' }}>Set Completed</option>
                            <option value="Blocked" style={{ background: '#070a10', color: '#ffffff' }}>Set Blocked</option>
                          </select>
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            title="Delete Task"
                            style={{
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#f87171',
                              cursor: 'pointer',
                              padding: '0.45rem',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                        No tasks match the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE & BACKEND EXPLORER */}
        {activeTab === "BACKEND" && (
          <div>
            {/* Backend Architecture & Engine Status Card */}
            <div className="glass-card" style={{ padding: '2rem 2.2rem', marginBottom: '1.6rem', background: 'rgba(12, 16, 23, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.6rem' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.85rem', borderRadius: '20px', background: 'rgba(0, 245, 212, 0.12)', border: '1px solid rgba(0, 245, 212, 0.35)', color: '#00f5d4', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 8px #00f5d4' }} />
                    Live SQLite Database Engine Active
                  </div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                    Backend Infrastructure & Database Console
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: '0.35rem 0 0 0' }}>
                    Inspect active database tables, stored rows, and serverless SQLite storage state.
                  </p>
                </div>

                <button
                  onClick={fetchBackendStatus}
                  disabled={loadingBackend}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.3rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                    color: '#06080e',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(0, 245, 212, 0.35)'
                  }}
                >
                  <RefreshCw size={16} className={loadingBackend ? "animate-spin" : ""} />
                  {loadingBackend ? "Syncing Engine..." : "Sync Database State"}
                </button>
              </div>

              {/* 4 DB Metric Panels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                <div style={{ background: 'rgba(7, 10, 16, 0.65)', padding: '1.2rem 1.4rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700 }}>
                    <Server size={16} /> STORAGE ENGINE
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '0.4rem' }}>
                    SQLite 3 (WAL Mode)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    High-concurrency LibSQL engine
                  </div>
                </div>

                <div style={{ background: 'rgba(7, 10, 16, 0.65)', padding: '1.2rem 1.4rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f5d4', fontSize: '0.82rem', fontWeight: 700 }}>
                    <HardDrive size={16} /> DB FILE LOCATION
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f5d4', marginTop: '0.4rem', fontFamily: 'monospace' }}>
                    data/a2z.db
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Size: {backendData?.database?.fileSize || "Healthy"}
                  </div>
                </div>

                <div style={{ background: 'rgba(7, 10, 16, 0.65)', padding: '1.2rem 1.4rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7', fontSize: '0.82rem', fontWeight: 700 }}>
                    <Database size={16} /> TOTAL DATABASE ROWS
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a855f7', marginTop: '0.4rem' }}>
                    {backendData?.database?.totalRecords || (employees.length + tasks.length + events.length)} records
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Across 3 core tables
                  </div>
                </div>

                <div style={{ background: 'rgba(7, 10, 16, 0.65)', padding: '1.2rem 1.4rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.82rem', fontWeight: 700 }}>
                    <FileCode size={16} /> API ARCHITECTURE
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '0.4rem' }}>
                    Next.js Route Handlers
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    REST endpoints in /src/app/api/
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Live Table Inspector */}
            <div className="glass-card" style={{ padding: '2rem 2.2rem', marginBottom: '1.6rem', background: 'rgba(12, 16, 23, 0.85)', border: '1px solid rgba(255, 255, 255, 0.09)', borderRadius: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Live Table Inspector
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                    Select a table to inspect live records stored in SQLite
                  </p>
                </div>

                {/* Table selector chips */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {[
                    { id: "employees", label: `employees (${employees.length} rows)` },
                    { id: "verification_tasks", label: `verification_tasks (${tasks.length} rows)` },
                    { id: "company_events", label: `company_events (${events.length} rows)` }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedDbTable(t.id)}
                      style={{
                        padding: '0.55rem 1.15rem',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: selectedDbTable === t.id ? 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)' : 'rgba(255, 255, 255, 0.05)',
                        color: selectedDbTable === t.id ? '#06080e' : '#cbd5e1',
                        border: selectedDbTable === t.id ? 'none' : '1px solid rgba(255, 255, 255, 0.12)'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Data Preview */}
              <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {selectedDbTable === "employees" && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                    <thead style={{ background: 'rgba(7, 10, 16, 0.9)', color: '#38bdf8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <tr>
                        <th style={{ padding: '0.85rem 1.1rem' }}>id</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>name</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>username</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>role</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>department</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>status</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>check_in_time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map(emp => (
                        <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(12, 16, 23, 0.5)' }}>
                          <td style={{ padding: '0.85rem 1.1rem', fontFamily: 'monospace', color: '#00f5d4', fontWeight: 700 }}>{emp.id}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#ffffff', fontWeight: 600 }}>{emp.name}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#94a3b8' }}>{emp.username}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#cbd5e1' }}>{emp.role}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#94a3b8' }}>{emp.department}</td>
                          <td style={{ padding: '0.85rem 1.1rem' }}>
                            <span style={{
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              padding: '0.25rem 0.65rem',
                              borderRadius: '20px',
                              color: emp.status === 'PRESENT' ? '#34d399' : emp.status === 'ABSENT' ? '#f87171' : '#fbbf24',
                              background: emp.status === 'PRESENT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
                            }}>
                              {emp.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#94a3b8' }}>{emp.check_in_time || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedDbTable === "verification_tasks" && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                    <thead style={{ background: 'rgba(7, 10, 16, 0.9)', color: '#38bdf8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <tr>
                        <th style={{ padding: '0.85rem 1.1rem' }}>id</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>title</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>assigned_to</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>priority</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>time</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(tsk => (
                        <tr key={tsk.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(12, 16, 23, 0.5)' }}>
                          <td style={{ padding: '0.85rem 1.1rem', fontFamily: 'monospace', color: '#00f5d4', fontWeight: 700 }}>{tsk.id}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#ffffff', fontWeight: 600 }}>{tsk.title}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#94a3b8' }}>{tsk.employee_name || tsk.assigned_to}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: tsk.priority === 'Urgent' ? '#f87171' : '#cbd5e1' }}>{tsk.priority}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#94a3b8' }}>{tsk.time}</td>
                          <td style={{ padding: '0.85rem 1.1rem' }}>
                            <span style={{
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              padding: '0.25rem 0.65rem',
                              borderRadius: '20px',
                              color: tsk.status === 'Verified' ? '#34d399' : tsk.status === 'Blocked' ? '#f87171' : '#38bdf8',
                              background: 'rgba(56, 189, 248, 0.15)'
                            }}>
                              {tsk.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedDbTable === "company_events" && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                    <thead style={{ background: 'rgba(7, 10, 16, 0.9)', color: '#38bdf8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <tr>
                        <th style={{ padding: '0.85rem 1.1rem' }}>id</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>title</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>date</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>type</th>
                        <th style={{ padding: '0.85rem 1.1rem' }}>description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(ev => (
                        <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(12, 16, 23, 0.5)' }}>
                          <td style={{ padding: '0.85rem 1.1rem', fontFamily: 'monospace', color: '#00f5d4', fontWeight: 700 }}>{ev.id}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#ffffff', fontWeight: 600 }}>{ev.title}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#38bdf8' }}>{ev.date}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#cbd5e1' }}>{ev.type}</td>
                          <td style={{ padding: '0.85rem 1.1rem', color: '#94a3b8' }}>{ev.description || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Comprehensive Administrator Guidance Box */}
            <div className="glass-card" style={{ padding: '2rem 2.2rem', background: 'rgba(12, 16, 23, 0.85)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '18px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                How & Where to Handle Your Backend
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Your backend is fully powered by a local, zero-latency SQLite database with Write-Ahead Logging (WAL) and Next.js server route handlers. Here is how you can inspect and modify it:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                {/* Method 1 */}
                <div style={{ background: 'rgba(7, 10, 16, 0.7)', padding: '1.3rem', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f5d4', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <ShieldCheck size={18} /> 1. Through This Admin Portal
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    You can manage everything directly without writing code:
                  </p>
                  <ul style={{ fontSize: '0.78rem', color: '#94a3b8', paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                    <li><strong>Employees:</strong> Click <em>Employee Management</em> to create, edit, or remove staff.</li>
                    <li><strong>Attendance:</strong> Click <em>Live Attendance Board</em> to update or monitor punch times.</li>
                    <li><strong>Tasks:</strong> Click <em>Tasks & Status</em> to add, reassign, or update task SLAs.</li>
                    <li><strong>Events:</strong> Click <em>Upcoming Events</em> to schedule holidays.</li>
                  </ul>
                </div>

                {/* Method 2 */}
                <div style={{ background: 'rgba(7, 10, 16, 0.7)', padding: '1.3rem', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <FileCode size={18} /> 2. Database Code & REST APIs
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    The backend code and database files reside in your project directory:
                  </p>
                  <ul style={{ fontSize: '0.78rem', color: '#94a3b8', paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                    <li><strong>Database File:</strong> <code style={{ color: '#00f5d4' }}>data/a2z.db</code></li>
                    <li><strong>Database Methods:</strong> <code style={{ color: '#38bdf8' }}>src/lib/db.ts</code></li>
                    <li><strong>Server APIs:</strong> <code style={{ color: '#a855f7' }}>src/app/api/employees</code>, <code style={{ color: '#a855f7' }}>src/app/api/tasks</code>, <code style={{ color: '#a855f7' }}>src/app/api/events</code></li>
                  </ul>
                </div>

                {/* Method 3 */}
                <div style={{ background: 'rgba(7, 10, 16, 0.7)', padding: '1.3rem', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <HardDrive size={18} /> 3. Direct GUI Database Tools
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                    If you want to view or edit the raw SQLite database outside the browser:
                  </p>
                  <ul style={{ fontSize: '0.78rem', color: '#94a3b8', paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                    <li>Install <strong>DB Browser for SQLite</strong> (free, open-source).</li>
                    <li>Open the file at <code style={{ color: '#00f5d4' }}>data/a2z.db</code>.</li>
                    <li>Or use the <strong>VS Code SQLite Viewer</strong> extension to query rows directly in the editor!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD NEW EMPLOYEE */}
      <AnimatePresence>
        {showAddEmpModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '560px',
                padding: '2.4rem',
                background: 'rgba(16, 24, 40, 0.95)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '20px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 245, 212, 0.12)',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.3rem 0' }}>
                    Add New Employee
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0 }}>
                    Create credentials and assign roles in the single employees table
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEmpModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
                >
                  <X size={22} />
                </button>
              </div>

              {empModalError && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <XCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{empModalError}</span>
                </div>
              )}

              <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={newEmp.name}
                      onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(7, 10, 16, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                      Employee ID (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-generated e.g. EMP-106"
                      value={newEmp.id}
                      onChange={e => setNewEmp({ ...newEmp, id: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(7, 10, 16, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ramesh.c"
                      value={newEmp.username}
                      onChange={e => setNewEmp({ ...newEmp, username: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(7, 10, 16, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                      Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. pass123"
                      value={newEmp.password}
                      onChange={e => setNewEmp({ ...newEmp, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(7, 10, 16, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                      Role / Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Full-Stack Developer"
                      value={newEmp.role}
                      onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(7, 10, 16, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@a2z.com"
                      value={newEmp.email}
                      onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(7, 10, 16, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.4rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddEmpModal(false)}
                    style={{
                      padding: '0.75rem 1.4rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.88rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.8rem',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                      color: '#070a10',
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(0, 245, 212, 0.35)'
                    }}
                  >
                    Create Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ADD UPCOMING EVENT */}
      <AnimatePresence>
        {showAddEventModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '480px',
                padding: '2.4rem',
                background: 'rgba(16, 24, 40, 0.95)',
                backdropFilter: 'blur(25px)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '20px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 245, 212, 0.12)',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Add Upcoming Event
                </h3>
                <button
                  onClick={() => setShowAddEventModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Cloud Sprint Review"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      background: 'rgba(7, 10, 16, 0.75)',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newEvent.date}
                      onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(7, 10, 16, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                      Category *
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        background: 'rgba(7, 10, 16, 0.75)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="Company Holiday">Company Holiday</option>
                      <option value="Audit">Audit / Security</option>
                      <option value="Townhall">Townhall</option>
                      <option value="Milestone">Milestone</option>
                      <option value="Training">Training</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief details about the event..."
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      background: 'rgba(7, 10, 16, 0.75)',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddEventModal(false)}
                    style={{
                      padding: '0.75rem 1.4rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.88rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.75rem 1.6rem',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                      color: '#070a10',
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(0, 245, 212, 0.35)'
                    }}
                  >
                    Add to Calendar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
