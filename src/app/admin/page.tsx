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
  X
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
  status: "PRESENT" | "ABSENT" | "ON_LEAVE";
  check_in_time: string;
  check_out_time: string;
}

interface Stats {
  total: number;
  present: number;
  absent: number;
  onLeave: number;
}

interface CompanyEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<"EMPLOYEES" | "ATTENDANCE" | "CALENDAR">("EMPLOYEES");

  // Data states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, present: 0, absent: 0, onLeave: 0 });
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  // Modals
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states - Add Employee
  const [newEmp, setNewEmp] = useState({
    id: "",
    name: "",
    username: "",
    password: "",
    role: "",
    department: "Verification Ops",
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
  }, [router]);

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
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

  const handleLogout = () => {
    localStorage.removeItem("a2z_user");
    document.cookie = "a2z_role=; path=/; max-age=0";
    router.push("/login");
  };

  // Quick Attendance Status Toggle
  const handleStatusChange = async (id: string, newStatus: "PRESENT" | "ABSENT" | "ON_LEAVE") => {
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
    if (!newEmp.name || !newEmp.username || !newEmp.role || !newEmp.email) {
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
        setEmployees(prev => [...prev, data.employee]);
        if (data.stats) setStats(data.stats);
        setNewEmp({
          id: "",
          name: "",
          username: "",
          password: "",
          role: "",
          department: "Verification Ops",
          email: "",
          phone: "",
          status: "PRESENT"
        });
        showNotification(`Employee ${data.employee.name} created successfully!`);
      } else {
        showNotification(data.error || "Failed to create employee", "error");
      }
    } catch (err) {
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
    <div style={{ minHeight: '100vh', paddingBottom: '6rem', position: 'relative', zIndex: 10 }}>
      {/* Top Admin Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.2rem 3rem', 
        borderBottom: '1px solid rgba(0,0,0,0.06)', 
        background: 'rgba(255,255,255,0.6)', 
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" showTagline={false} />
          </Link>
          <span style={{ 
            background: 'linear-gradient(135deg, var(--lilac-dark), #9b72cf)', 
            color: '#fff', 
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            <Shield size={18} color="var(--lilac-dark)" />
            <span>Root Administrator</span>
          </div>

          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              background: 'rgba(255,255,255,0.8)', 
              border: '1px solid rgba(0,0,0,0.1)', 
              color: 'var(--text-primary)', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '0.85rem', 
              fontWeight: 700 
            }}
          >
            <LogOut size={16} /> Logout
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

      <div style={{ maxWidth: '960px', margin: '1.2rem auto 0 auto', padding: '0 1rem' }}>
        
        {/* Real-Time Attendance Statistics Header (Compact) */}
        <div style={{ marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                Workforce Intelligence & Attendance
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', margin: '0.15rem 0 0 0' }}>
                Real-time visibility into staff availability, employee credentials, and upcoming company calendar
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={fetchEmployees}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.85)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
              <button 
                onClick={() => setShowAddEmpModal(true)}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.76rem',
                  borderRadius: '6px'
                }}
              >
                <UserPlus size={14} /> Create Employee
              </button>
            </div>
          </div>

          {/* 4 Attendance Counters (Compact) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            
            {/* Total Staff */}
            <div className="glass-card" style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.75)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Total Employees</span>
                <Users size={16} color="var(--lilac-dark)" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                Active in database
              </div>
            </div>

            {/* Present Counter */}
            <div className="glass-card" style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(40, 167, 69, 0.3)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#28a745' }}>🟢 Present Today</span>
                <CheckCircle2 size={16} color="#28a745" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#28a745', marginTop: '0.2rem' }}>
                {stats.present}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}% of workforce
              </div>
            </div>

            {/* Absent Counter */}
            <div className="glass-card" style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(220, 53, 69, 0.3)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dc3545' }}>🔴 Absent</span>
                <XCircle size={16} color="#dc3545" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc3545', marginTop: '0.2rem' }}>
                {stats.absent}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                Unscheduled absence
              </div>
            </div>

            {/* On Leave Counter */}
            <div className="glass-card" style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255, 193, 7, 0.4)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b58105' }}>🟡 On Leave</span>
                <Clock3 size={16} color="#b58105" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b58105', marginTop: '0.2rem' }}>
                {stats.onLeave}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                Approved leave logged
              </div>
            </div>

          </div>

          {/* Visual Progress Bar */}
          <div style={{ marginTop: '0.8rem', background: 'rgba(0,0,0,0.06)', borderRadius: '8px', height: '6px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${stats.total ? (stats.present / stats.total) * 100 : 0}%`, background: '#28a745', transition: 'width 0.5s ease' }} title={`Present: ${stats.present}`} />
            <div style={{ width: `${stats.total ? (stats.onLeave / stats.total) * 100 : 0}%`, background: '#ffc107', transition: 'width 0.5s ease' }} title={`On Leave: ${stats.onLeave}`} />
            <div style={{ width: `${stats.total ? (stats.absent / stats.total) * 100 : 0}%`, background: '#dc3545', transition: 'width 0.5s ease' }} title={`Absent: ${stats.absent}`} />
          </div>
        </div>

        {/* Tab Navigation (Compact) */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: "EMPLOYEES", label: "Employee Management", icon: Users },
            { id: "ATTENDANCE", label: "Live Attendance Board", icon: Clock },
            { id: "CALENDAR", label: "Upcoming Events & Calendar", icon: Calendar }
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
                  gap: '0.4rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isActive ? 'var(--lilac-dark)' : 'rgba(255,255,255,0.65)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  border: isActive ? 'none' : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: isActive ? '0 4px 12px rgba(122, 91, 156, 0.25)' : 'none'
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: EMPLOYEE MANAGEMENT (SINGLE TABLE) */}
        {activeTab === "EMPLOYEES" && (
          <div>
            {/* Search & Filter Bar (Compact) */}
            <div className="glass-card" style={{ padding: '0.7rem 1rem', marginBottom: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap', background: 'rgba(255,255,255,0.75)', borderRadius: '12px' }}>
              <div style={{ flex: '1 1 220px', position: 'relative' }}>
                <Search size={14} color="var(--lilac-dark)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.8rem' }} />
                <input
                  type="text"
                  placeholder="Search by name, ID, username, role or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.8rem 0.45rem 2.2rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: '#fff',
                    outline: 'none',
                    fontSize: '0.78rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', fontWeight: 600, fontSize: '0.75rem', outline: 'none' }}
                >
                  <option value="ALL">All ({stats.total})</option>
                  <option value="PRESENT">Present ({stats.present})</option>
                  <option value="ABSENT">Absent ({stats.absent})</option>
                  <option value="ON_LEAVE">On Leave ({stats.onLeave})</option>
                </select>
              </div>

              {/* Department Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Dept:</span>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  style={{ padding: '0.4rem 0.7rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', fontWeight: 600, fontSize: '0.75rem', outline: 'none' }}
                >
                  <option value="ALL">All Departments</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Employee Table (Compact) */}
            <div className="glass-card" style={{ padding: '0.9rem 1.1rem', background: 'rgba(255,255,255,0.8)', overflowX: 'auto', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid rgba(0,0,0,0.08)', color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '0.5rem 0.6rem' }}>ID</th>
                    <th style={{ padding: '0.5rem 0.6rem' }}>Staff Name</th>
                    <th style={{ padding: '0.5rem 0.6rem' }}>Username</th>
                    <th style={{ padding: '0.5rem 0.6rem' }}>Role</th>
                    <th style={{ padding: '0.5rem 0.6rem' }}>Department</th>
                    <th style={{ padding: '0.5rem 0.6rem' }}>Live Status</th>
                    <th style={{ padding: '0.5rem 0.6rem' }}>Status Toggle</th>
                    <th style={{ padding: '0.5rem 0.6rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => {
                    const isRootAdmin = emp.id === "ADM-001";
                    return (
                      <tr key={emp.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.76rem', transition: 'background 0.2s' }}>
                        <td style={{ padding: '0.5rem 0.6rem', fontWeight: 800, color: 'var(--lilac-dark)' }}>
                          {emp.id}
                        </td>
                        <td style={{ padding: '0.5rem 0.6rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                        </td>
                        <td style={{ padding: '0.5rem 0.6rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          <code>{emp.username}</code>
                        </td>
                        <td style={{ padding: '0.5rem 0.6rem', color: 'var(--text-primary)' }}>
                          {emp.role}
                        </td>
                        <td style={{ padding: '0.5rem 0.6rem', color: 'var(--text-secondary)' }}>
                          {emp.department}
                        </td>
                        <td style={{ padding: '0.5rem 0.6rem' }}>
                          {emp.status === "PRESENT" && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#d4edda', color: '#155724', padding: '0.2rem 0.55rem', borderRadius: '14px', fontWeight: 700, fontSize: '0.7rem' }}>
                              <CheckCircle2 size={12} /> Present ({emp.check_in_time || 'Logged'})
                            </span>
                          )}
                          {emp.status === "ABSENT" && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#f8d7da', color: '#721c24', padding: '0.2rem 0.55rem', borderRadius: '14px', fontWeight: 700, fontSize: '0.7rem' }}>
                              <XCircle size={12} /> Absent
                            </span>
                          )}
                          {emp.status === "ON_LEAVE" && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#fff3cd', color: '#856404', padding: '0.2rem 0.55rem', borderRadius: '14px', fontWeight: 700, fontSize: '0.7rem' }}>
                              <Clock3 size={12} /> On Leave
                            </span>
                          )}
                        </td>
                        {/* 1-Click Status Switcher */}
                        <td style={{ padding: '0.5rem 0.6rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button
                              onClick={() => handleStatusChange(emp.id, "PRESENT")}
                              title="Mark Present"
                              style={{
                                padding: '0.2rem 0.45rem',
                                borderRadius: '4px',
                                border: '1px solid #28a745',
                                background: emp.status === "PRESENT" ? '#28a745' : '#fff',
                                color: emp.status === "PRESENT" ? '#fff' : '#28a745',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleStatusChange(emp.id, "ABSENT")}
                              title="Mark Absent"
                              style={{
                                padding: '0.2rem 0.45rem',
                                borderRadius: '4px',
                                border: '1px solid #dc3545',
                                background: emp.status === "ABSENT" ? '#dc3545' : '#fff',
                                color: emp.status === "ABSENT" ? '#fff' : '#dc3545',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleStatusChange(emp.id, "ON_LEAVE")}
                              title="Mark On Leave"
                              style={{
                                padding: '0.2rem 0.45rem',
                                borderRadius: '4px',
                                border: '1px solid #ffc107',
                                background: emp.status === "ON_LEAVE" ? '#ffc107' : '#fff',
                                color: emp.status === "ON_LEAVE" ? '#000' : '#b58105',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Leave
                            </button>
                          </div>
                        </td>
                        {/* Actions */}
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {!isRootAdmin ? (
                            <button
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                              title="Delete Employee"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#dc3545',
                                cursor: 'pointer',
                                padding: '0.4rem',
                                borderRadius: '6px'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                              System Root
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.9rem' }}>
              
              {/* Present Column (Compact) */}
              <div className="glass-card" style={{ padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.75)', borderTop: '3px solid #28a745', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e7e34', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={15} /> Present ({stats.present})
                  </div>
                  <span style={{ background: '#d4edda', color: '#155724', fontWeight: 800, fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '10px' }}>
                    Active
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {employees.filter(e => e.status === "PRESENT").map(emp => (
                    <div key={emp.id} style={{ background: '#fff', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{emp.id} • {emp.role}</div>
                        <div style={{ fontSize: '0.65rem', color: '#28a745', marginTop: '0.1rem', fontWeight: 600 }}>
                          In: {emp.check_in_time || '09:00 AM'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleStatusChange(emp.id, "ABSENT")}
                        style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', background: '#f8f9fa', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Absent
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Absent Column (Compact) */}
              <div className="glass-card" style={{ padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.75)', borderTop: '3px solid #dc3545', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#dc3545', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <XCircle size={15} /> Absent ({stats.absent})
                  </div>
                  <span style={{ background: '#f8d7da', color: '#721c24', fontWeight: 800, fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '10px' }}>
                    Off-Duty
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {employees.filter(e => e.status === "ABSENT").map(emp => (
                    <div key={emp.id} style={{ background: '#fff', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{emp.id} • {emp.department}</div>
                        <div style={{ fontSize: '0.65rem', color: '#dc3545', marginTop: '0.1rem', fontWeight: 600 }}>
                          No Check-in
                        </div>
                      </div>
                      <button
                        onClick={() => handleStatusChange(emp.id, "PRESENT")}
                        style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #28a745', background: '#28a745', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Present
                      </button>
                    </div>
                  ))}
                  {stats.absent === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      No absent staff today! 100% accounted for.
                    </div>
                  )}
                </div>
              </div>

              {/* On Leave Column (Compact) */}
              <div className="glass-card" style={{ padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.75)', borderTop: '3px solid #ffc107', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#b58105', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock3 size={15} /> On Leave ({stats.onLeave})
                  </div>
                  <span style={{ background: '#fff3cd', color: '#856404', fontWeight: 800, fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '10px' }}>
                    Approved
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {employees.filter(e => e.status === "ON_LEAVE").map(emp => (
                    <div key={emp.id} style={{ background: '#fff', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{emp.id} • {emp.department}</div>
                        <div style={{ fontSize: '0.65rem', color: '#b58105', marginTop: '0.1rem', fontWeight: 600 }}>
                          Leave Granted
                        </div>
                      </div>
                      <button
                        onClick={() => handleStatusChange(emp.id, "PRESENT")}
                        style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #28a745', background: '#28a745', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Present
                      </button>
                    </div>
                  ))}
                  {stats.onLeave === 0 && (
                    <div style={{ textAlign: 'center', padding: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            
            {/* Calendar Month View */}
            <div className="glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.75)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {monthNames[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {events.length} company events recorded
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', cursor: 'pointer' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Days header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>

              {/* Day cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                {calendarDays.map((c, idx) => {
                  if (!c.day) {
                    return <div key={idx} style={{ aspectRatio: '1', borderRadius: '8px' }} />;
                  }

                  const hasEvent = c.hasEvents.length > 0;
                  const isAudit = c.hasEvents.some(e => e.type.toLowerCase().includes("audit"));

                  return (
                    <div
                      key={idx}
                      title={c.hasEvents.map(e => e.title).join(", ")}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: hasEvent ? '2px solid var(--lilac-dark)' : '1px solid rgba(0,0,0,0.06)',
                        background: hasEvent ? (isAudit ? 'rgba(122, 91, 156, 0.15)' : 'rgba(244, 238, 248, 0.9)') : '#ffffff',
                        cursor: hasEvent ? 'pointer' : 'default',
                        position: 'relative'
                      }}
                    >
                      <span style={{ fontWeight: hasEvent ? 800 : 500, fontSize: '0.9rem', color: hasEvent ? 'var(--lilac-dark)' : 'var(--text-primary)' }}>
                        {c.day}
                      </span>
                      {hasEvent && (
                        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                          {c.hasEvents.map((_, eIdx) => (
                            <span key={eIdx} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--lilac-dark)' }} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--lilac-dark)' }} />
                  <span>Company Event / Holiday</span>
                </div>
              </div>
            </div>

            {/* Event List & Add Event Trigger */}
            <div className="glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.75)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Upcoming Events & Holidays
                </h3>
                <button
                  onClick={() => setShowAddEventModal(true)}
                  className="btn-primary"
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> Add Event
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
                {events.map(ev => (
                  <div
                    key={ev.id}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '12px',
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{ev.title}</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'var(--lilac-light)', color: 'var(--lilac-dark)' }}>
                          {ev.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lilac-dark)', marginTop: '0.3rem' }}>
                        📅 {ev.date}
                      </div>
                      {ev.description && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                          {ev.description}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      title="Remove Event"
                      style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '0.3rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
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
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '560px',
                padding: '2.5rem',
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Add New Employee
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Create credentials and assign roles in the single employees table
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddEmpModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={newEmp.name}
                      onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Employee ID (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Auto-generated e.g. EMP-106"
                      value={newEmp.id}
                      onChange={e => setNewEmp({ ...newEmp, id: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ramesh.c"
                      value={newEmp.username}
                      onChange={e => setNewEmp({ ...newEmp, username: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. pass123"
                      value={newEmp.password}
                      onChange={e => setNewEmp({ ...newEmp, password: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Role / Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Forensic BGV Checker"
                      value={newEmp.role}
                      onChange={e => setNewEmp({ ...newEmp, role: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Department *
                    </label>
                    <select
                      value={newEmp.department}
                      onChange={e => setNewEmp({ ...newEmp, department: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                    >
                      <option value="Verification Ops">Verification Ops</option>
                      <option value="Forensic Review">Forensic Review</option>
                      <option value="Engineering & Core Tech">Engineering & Core Tech</option>
                      <option value="Quality & Checker Operations">Quality & Checker Operations</option>
                      <option value="Legal & Compliance">Legal & Compliance</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@a2z.com"
                      value={newEmp.email}
                      onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Initial Attendance Status
                    </label>
                    <select
                      value={newEmp.status}
                      onChange={e => setNewEmp({ ...newEmp, status: e.target.value as any })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                    >
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="ON_LEAVE">On Leave</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddEmpModal(false)}
                    style={{ padding: '0.8rem 1.4rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }}
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
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '480px',
                padding: '2.5rem',
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Add Upcoming Event
                </h3>
                <button 
                  onClick={() => setShowAddEventModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Compliance Review"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newEvent.date}
                      onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      Category *
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', boxSizing: 'border-box' }}
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
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief details about the event..."
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddEventModal(false)}
                    style={{ padding: '0.75rem 1.4rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.6rem', fontSize: '0.9rem' }}
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
