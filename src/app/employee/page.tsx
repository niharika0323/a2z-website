"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  Clock3, 
  Calendar, 
  User, 
  LogOut, 
  ShieldCheck, 
  Building, 
  Clock, 
  Layers,
  ArrowRight,
  Plus,
  Trash2,
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
  status: "PRESENT" | "ABSENT" | "ON_LEAVE" | "HALF_DAY";
  check_in_time?: string;
  check_out_time?: string;
}

interface CompanyEvent {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
}

export interface VerificationTask {
  id: string;
  task: string;
  priority: "Urgent" | "High" | "Normal";
  time: string;
  status: "In Progress" | "Review" | "Verified" | "Blocked";
}

const DEFAULT_TASKS: VerificationTask[] = [
  { id: "BGV-409", task: "Aadhaar Biometric Liveness", priority: "High", time: "SLA: 4h", status: "In Progress" },
  { id: "BGV-118", task: "District e-Courts Cross-Match", priority: "Urgent", time: "SLA: 2h", status: "Review" },
  { id: "BGV-882", task: "University Roll Forensic Auth", priority: "Normal", time: "SLA: 24h", status: "Verified" },
  { id: "BGV-550", task: "EPFO Service History Integrity", priority: "Normal", time: "SLA: 12h", status: "In Progress" }
];

export default function EmployeePortal() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [directory, setDirectory] = useState<Employee[]>([]);
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "ATTENDANCE" | "CALENDAR" | "DIRECTORY">("OVERVIEW");
  const [notification, setNotification] = useState<string | null>(null);

  // Employee Task Management State
  const [tasks, setTasks] = useState<VerificationTask[]>(DEFAULT_TASKS);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState<{
    task: string;
    priority: "Urgent" | "High" | "Normal";
    time: string;
    status: "In Progress" | "Review" | "Verified" | "Blocked";
  }>({
    task: "",
    priority: "High",
    time: "SLA: 4h",
    status: "In Progress"
  });

  useEffect(() => {
    const stored = localStorage.getItem("a2z_user");
    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setCurrentUser(parsed);
      fetchLiveUserData(parsed.id);
    } catch (e) {
      router.push("/login");
    }

    // Load saved tasks from localStorage
    const savedTasks = localStorage.getItem("a2z_employee_tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {}
    }

    fetchDirectory();
    fetchEvents();
  }, [router]);

  const saveTasks = (newTasks: VerificationTask[]) => {
    setTasks(newTasks);
    localStorage.setItem("a2z_employee_tasks", JSON.stringify(newTasks));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.task.trim()) return;
    const id = `BGV-${Math.floor(100 + Math.random() * 900)}`;
    const created: VerificationTask = {
      id,
      task: newTask.task.trim(),
      priority: newTask.priority,
      time: newTask.time.trim() || "SLA: 4h",
      status: newTask.status
    };
    const updated = [created, ...tasks];
    saveTasks(updated);
    setNewTask({ task: "", priority: "High", time: "SLA: 4h", status: "In Progress" });
    setShowAddTaskModal(false);
    showToast(`Task ${id} added successfully!`);
  };

  const handleUpdateTaskStatus = (taskId: string, status: VerificationTask["status"]) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    saveTasks(updated);
    showToast(`Task status updated to "${status}"`);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    saveTasks(updated);
    showToast("Task removed from queue");
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchLiveUserData = async (empId: string) => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      if (res.ok && data.employees) {
        const found = data.employees.find((e: Employee) => e.id === empId);
        if (found) {
          setCurrentUser(found);
          localStorage.setItem("a2z_user", JSON.stringify(found));
        }
      }
    } catch (e) {
      console.error("Failed to sync live user status", e);
    }
  };

  const fetchDirectory = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      if (res.ok) {
        setDirectory(data.employees || []);
      }
    } catch (err) {
      console.error("Failed to fetch directory", err);
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
      console.error("Failed to fetch events", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("a2z_user");
    router.push("/login");
  };

  const handleAttendancePunch = async (action: "PUNCH_IN" | "PUNCH_OUT" | "HALF_DAY") => {
    if (!currentUser) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updates: Partial<Employee> = {};

    if (action === "PUNCH_IN") {
      updates = { status: "PRESENT", check_in_time: nowTime };
    } else if (action === "PUNCH_OUT") {
      updates = { check_out_time: nowTime };
    } else if (action === "HALF_DAY") {
      updates = { status: "HALF_DAY", check_in_time: nowTime };
    }

    try {
      const res = await fetch("/api/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentUser.id, ...updates })
      });

      const data = await res.json();
      if (res.ok) {
        const updated = data.employee;
        setCurrentUser(updated);
        localStorage.setItem("a2z_user", JSON.stringify(updated));
        showToast(
          action === "PUNCH_IN" ? `Punched In recorded at ${nowTime}!` :
          action === "PUNCH_OUT" ? `Punched Out recorded at ${nowTime}!` : `Half Day logged at ${nowTime}!`
        );
      }
    } catch (err) {
      showToast("Error updating attendance record.");
    }
  };

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Authenticating credentials...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '3rem', position: 'relative', zIndex: 10 }}>
      {/* Compact Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.6rem 1.5rem', 
        borderBottom: '1px solid rgba(0,0,0,0.06)', 
        background: 'rgba(255,255,255,0.75)', 
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" showTagline={false} />
          </Link>
          <span style={{ 
            background: 'var(--lilac-light)', 
            color: 'var(--lilac-dark)', 
            padding: '0.15rem 0.5rem', 
            borderRadius: '12px', 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            letterSpacing: '0.5px', 
            textTransform: 'uppercase' 
          }}>
            Staff Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {currentUser.role === "ADMIN" && (
            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, var(--lilac-dark), #9b72cf)',
                color: '#fff',
                border: 'none',
                padding: '0.25rem 0.65rem',
                borderRadius: '5px',
                fontWeight: 700,
                fontSize: '0.7rem',
                cursor: 'pointer'
              }}>
                ⚡ Admin View
              </button>
            </Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            <User size={13} color="var(--lilac-dark)" />
            <span>{currentUser.name}</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>({currentUser.id})</span>
          </div>

          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.3rem', 
              background: 'rgba(255,255,255,0.9)', 
              border: '1px solid rgba(0,0,0,0.1)', 
              color: 'var(--text-primary)', 
              padding: '0.25rem 0.6rem', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              fontSize: '0.72rem', 
              fontWeight: 700 
            }}
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </nav>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: '3.5rem',
              right: '1.5rem',
              zIndex: 999,
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.74rem',
              background: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small Compact Container */}
      <div style={{ maxWidth: '840px', margin: '1.2rem auto 0 auto', padding: '0 1rem' }}>
        
        {/* Small Welcome Card */}
        <div className="glass-card" style={{ padding: '0.85rem 1.1rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--lilac-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Employee Portal
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0.1rem 0' }}>
                Welcome, {currentUser.name}
              </h2>
              <div style={{ display: 'flex', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                <span><strong>ID:</strong> {currentUser.id}</span>
                <span><strong>Role:</strong> {currentUser.role}</span>
                <span><strong>Dept:</strong> {currentUser.department}</span>
              </div>
            </div>

            {/* Small Status Badge */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', marginBottom: '0.15rem', fontWeight: 600 }}>
                Today's Status
              </div>
              <div>
                {currentUser.status === "PRESENT" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#d4edda', color: '#155724', padding: '0.22rem 0.65rem', borderRadius: '14px', fontWeight: 800, fontSize: '0.72rem' }}>
                    <CheckCircle2 size={13} /> PRESENT {currentUser.check_in_time ? `(${currentUser.check_in_time})` : ''}
                  </span>
                )}
                {currentUser.status === "HALF_DAY" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fff3cd', color: '#856404', padding: '0.22rem 0.65rem', borderRadius: '14px', fontWeight: 800, fontSize: '0.72rem' }}>
                    <Clock3 size={13} /> HALF DAY {currentUser.check_in_time ? `(${currentUser.check_in_time})` : ''}
                  </span>
                )}
                {currentUser.status === "ABSENT" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#f8d7da', color: '#721c24', padding: '0.22rem 0.65rem', borderRadius: '14px', fontWeight: 800, fontSize: '0.72rem' }}>
                    <XCircle size={13} /> ABSENT
                  </span>
                )}
                {currentUser.status === "ON_LEAVE" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fce4ec', color: '#c2185b', padding: '0.22rem 0.65rem', borderRadius: '14px', fontWeight: 800, fontSize: '0.72rem' }}>
                    <Clock3 size={13} /> ON LEAVE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Small Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.3rem' }}>
          {[
            { id: "OVERVIEW", label: "Operations & Tasks" },
            { id: "ATTENDANCE", label: "Attendance Punch" },
            { id: "CALENDAR", label: "Calendar & Holidays" },
            { id: "DIRECTORY", label: "Staff Directory" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: activeTab === tab.id ? 'var(--lilac-dark)' : 'rgba(255,255,255,0.65)',
                color: activeTab === tab.id ? '#fff' : 'var(--text-primary)',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(0,0,0,0.08)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & BGV INTERNAL QUEUE (With Add Task & Status Switcher) */}
        {activeTab === "OVERVIEW" && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.9rem' }}>
            
            {/* Small Assigned BGV Queue Card */}
            <div className="glass-card" style={{ padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck color="var(--lilac-dark)" size={16} />
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Assigned Tasks Queue ({tasks.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    background: 'var(--lilac-dark)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(122, 91, 156, 0.25)'
                  }}
                >
                  <Plus size={12} /> Add Task
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {tasks.map((item) => (
                  <div key={item.id} style={{ padding: '0.5rem 0.7rem', background: '#fff', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: '1 1 auto', minWidth: 0, marginRight: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--lilac-dark)' }}>{item.id}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.74rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.task}</span>
                      </div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                        {item.time} • Priority: <strong style={{ color: item.priority === 'Urgent' ? '#dc3545' : item.priority === 'High' ? '#e67e22' : 'inherit' }}>{item.priority}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                      {/* Interactive Status Selector */}
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateTaskStatus(item.id, e.target.value as any)}
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.4rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(0,0,0,0.12)',
                          cursor: 'pointer',
                          outline: 'none',
                          background:
                            item.status === "Verified" ? '#d4edda' :
                            item.status === "Review" ? '#e8daef' :
                            item.status === "Blocked" ? '#f8d7da' : '#eaf2f8',
                          color:
                            item.status === "Verified" ? '#155724' :
                            item.status === "Review" ? '#5b2c6f' :
                            item.status === "Blocked" ? '#721c24' : '#1b4f72'
                        }}
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Under Review</option>
                        <option value="Verified">Verified / Done</option>
                        <option value="Blocked">Blocked</option>
                      </select>

                      {/* Delete Task */}
                      <button
                        onClick={() => handleDeleteTask(item.id)}
                        title="Remove Task"
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    No tasks currently assigned. Click <strong>+ Add Task</strong> above to add one!
                  </div>
                )}
              </div>
            </div>

            {/* Small Quick Actions Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="glass-card" style={{ padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.6rem 0' }}>
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <button 
                    onClick={() => setActiveTab("ATTENDANCE")}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.74rem', color: 'var(--text-primary)' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={13} color="var(--lilac-dark)" /> Record Today's Punch
                    </span>
                    <ArrowRight size={12} />
                  </button>

                  <button 
                    onClick={() => setActiveTab("CALENDAR")}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.74rem', color: 'var(--text-primary)' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={13} color="var(--lilac-dark)" /> Corporate Holidays
                    </span>
                    <ArrowRight size={12} />
                  </button>

                  <button 
                    onClick={() => setActiveTab("DIRECTORY")}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.74rem', color: 'var(--text-primary)' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building size={13} color="var(--lilac-dark)" /> Colleague Directory
                    </span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DAILY ATTENDANCE PUNCH (Punch In, Punch Out, Half Day) */}
        {activeTab === "ATTENDANCE" && (
          <div className="glass-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '1.2rem 1.4rem', textAlign: 'center', background: 'rgba(255,255,255,0.8)', borderRadius: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--lilac-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
              <Clock color="var(--lilac-dark)" size={20} />
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              Daily Attendance Clock
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginBottom: '1.1rem' }}>
              Punch in at start of shift, record punch out, or mark half day.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              
              {/* Punch In */}
              <button
                onClick={() => handleAttendancePunch("PUNCH_IN")}
                style={{
                  padding: '0.8rem 0.5rem',
                  borderRadius: '8px',
                  border: '1.5px solid #28a745',
                  background: currentUser.status === "PRESENT" ? '#d4edda' : '#f4fbf6',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <CheckCircle2 color="#28a745" size={20} />
                <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#155724' }}>Punch In</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Shift Start</div>
              </button>

              {/* Punch Out */}
              <button
                onClick={() => handleAttendancePunch("PUNCH_OUT")}
                style={{
                  padding: '0.8rem 0.5rem',
                  borderRadius: '8px',
                  border: '1.5px solid var(--lilac-dark)',
                  background: 'var(--lilac-light)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <LogOut color="var(--lilac-dark)" size={20} />
                <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--lilac-dark)' }}>Punch Out</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Shift End</div>
              </button>

              {/* Half Day */}
              <button
                onClick={() => handleAttendancePunch("HALF_DAY")}
                style={{
                  padding: '0.8rem 0.5rem',
                  borderRadius: '8px',
                  border: '1.5px solid #ffc107',
                  background: currentUser.status === "HALF_DAY" ? '#fff3cd' : '#fffdf5',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Clock3 color="#b58105" size={20} />
                <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#856404' }}>Half Day</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Half Shift</div>
              </button>

            </div>

            <div style={{ marginTop: '1.1rem', padding: '0.5rem 0.8rem', borderRadius: '6px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Logged Status: <strong style={{ color: 'var(--text-primary)' }}>{currentUser.status}</strong> {currentUser.check_in_time ? `• Time: ${currentUser.check_in_time}` : ''}
            </div>
          </div>
        )}

        {/* TAB 3: COMPANY CALENDAR & HOLIDAYS (Small Cards) */}
        {activeTab === "CALENDAR" && (
          <div className="glass-card" style={{ padding: '1rem 1.1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <Calendar color="var(--lilac-dark)" size={16} />
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Corporate Calendar & Holidays
                </h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.65rem' }}>
              {events.map(ev => (
                <div key={ev.id} style={{ background: '#fff', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{ev.title}</div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '10px', background: 'var(--lilac-light)', color: 'var(--lilac-dark)' }}>
                      {ev.type}
                    </span>
                  </div>
                  <div style={{ color: 'var(--lilac-dark)', fontWeight: 800, fontSize: '0.7rem', marginTop: '0.2rem' }}>
                    📅 {ev.date}
                  </div>
                  {ev.description && (
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {ev.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF DIRECTORY (Small Table Card) */}
        {activeTab === "DIRECTORY" && (
          <div className="glass-card" style={{ padding: '1rem 1.1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <Building color="var(--lilac-dark)" size={16} />
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Staff Directory
                </h3>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', color: 'var(--text-secondary)', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.4rem 0.5rem' }}>ID</th>
                  <th style={{ padding: '0.4rem 0.5rem' }}>Name</th>
                  <th style={{ padding: '0.4rem 0.5rem' }}>Role</th>
                  <th style={{ padding: '0.4rem 0.5rem' }}>Department</th>
                  <th style={{ padding: '0.4rem 0.5rem' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {directory.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', fontSize: '0.72rem' }}>
                    <td style={{ padding: '0.45rem 0.5rem', fontWeight: 800, color: 'var(--lilac-dark)' }}>{emp.id}</td>
                    <td style={{ padding: '0.45rem 0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{emp.name}</td>
                    <td style={{ padding: '0.45rem 0.5rem', color: 'var(--text-primary)' }}>{emp.role}</td>
                    <td style={{ padding: '0.45rem 0.5rem', color: 'var(--text-secondary)' }}>{emp.department}</td>
                    <td style={{ padding: '0.45rem 0.5rem', color: 'var(--text-secondary)' }}>{emp.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTaskModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card"
              style={{
                background: '#ffffff',
                width: '100%',
                maxWidth: '420px',
                padding: '1.4rem 1.6rem',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  + Add New Task
                </h3>
                <button 
                  onClick={() => setShowAddTaskModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Task Title / Check Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Court Criminal Registry Scan"
                    value={newTask.task}
                    onChange={e => setNewTask({ ...newTask, task: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', fontSize: '0.78rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                      style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', fontSize: '0.78rem', boxSizing: 'border-box' }}
                    >
                      <option value="Urgent">🔴 Urgent</option>
                      <option value="High">🟠 High</option>
                      <option value="Normal">🟢 Normal</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      Target SLA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SLA: 4h"
                      value={newTask.time}
                      onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', fontSize: '0.78rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Initial Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={e => setNewTask({ ...newTask, status: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', fontSize: '0.78rem', boxSizing: 'border-box' }}
                  >
                    <option value="In Progress">🔵 In Progress</option>
                    <option value="Review">🟣 Under Review</option>
                    <option value="Verified">🟢 Verified / Done</option>
                    <option value="Blocked">🔴 Blocked</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    style={{ padding: '0.55rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.76rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '0.55rem 1.2rem', fontSize: '0.78rem' }}
                  >
                    Add Task
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
