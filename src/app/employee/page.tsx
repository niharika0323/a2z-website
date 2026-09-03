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
  title?: string;
  task?: string;
  assigned_to?: string;
  employee_name?: string;
  priority: "Urgent" | "High" | "Normal";
  time: string;
  status: "In Progress" | "Review" | "Verified" | "Blocked";
}

const DEFAULT_TASKS: VerificationTask[] = [
  { id: "TSK-101", task: "Next.js Frontend Architecture & UI Sprint", priority: "High", time: "SLA: 4h", status: "In Progress" },
  { id: "TSK-102", task: "REST API Gateway & Payment SDK Integration", priority: "Urgent", time: "SLA: 2h", status: "Review" },
  { id: "TSK-103", task: "Mobile App Push Notifications & Offline Sync", priority: "Normal", time: "SLA: 24h", status: "Verified" },
  { id: "TSK-104", task: "Cloud Database Migration & Query Indexing", priority: "Normal", time: "SLA: 12h", status: "In Progress" }
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

    // Load saved tasks from localStorage and filter out legacy BGV tasks
    const savedTasks = localStorage.getItem("a2z_employee_tasks");
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        const clean = parsed.filter((t: any) => !t.id?.startsWith("BGV-"));
        if (clean.length > 0) {
          setTasks(clean);
        } else {
          localStorage.removeItem("a2z_employee_tasks");
        }
      } catch (e) { }
    }

    fetchTasks();
    fetchDirectory();
    fetchEvents();
  }, [router]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (res.ok && data.tasks && data.tasks.length > 0) {
        setTasks(data.tasks);
        localStorage.setItem("a2z_employee_tasks", JSON.stringify(data.tasks));
      }
    } catch (e) {
      console.warn("Could not sync tasks from API, using cached", e);
    }
  };

  const saveTasks = (newTasks: VerificationTask[]) => {
    setTasks(newTasks);
    localStorage.setItem("a2z_employee_tasks", JSON.stringify(newTasks));
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.task.trim()) return;
    const id = `TSK-${Math.floor(100 + Math.random() * 900)}`;
    const created: VerificationTask = {
      id,
      title: newTask.task.trim(),
      priority: newTask.priority,
      time: newTask.time.trim() || "SLA: 4h",
      status: newTask.status,
      assigned_to: currentUser?.id || 'EMP-101',
      employee_name: currentUser?.name || 'Staff Member'
    };

    // Update local state first
    const updated = [created, ...tasks];
    saveTasks(updated);
    setNewTask({ task: "", priority: "High", time: "SLA: 4h", status: "In Progress" });
    setShowAddTaskModal(false);
    showToast(`Task ${id} added successfully!`);

    // Sync to backend DB
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(created)
      });
    } catch (err) {
      console.warn("Offline or failed to sync task", err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: VerificationTask["status"]) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    saveTasks(updated);
    showToast(`Task status updated to "${status}"`);

    // Sync to backend DB
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status })
      });
    } catch (err) {
      console.warn("Failed to sync task status", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    saveTasks(updated);
    showToast("Task removed from queue");

    // Sync to backend DB
    try {
      await fetch(`/api/tasks?id=${taskId}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Failed to delete task from DB", err);
    }
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

  const handleAttendancePunch = async (action: "PUNCH_IN" | "PUNCH_OUT" | "HALF_DAY" | "ON_LEAVE") => {
    if (!currentUser) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updates: Partial<Employee> = {};

    if (action === "PUNCH_IN") {
      updates = { status: "PRESENT", check_in_time: nowTime };
    } else if (action === "PUNCH_OUT") {
      updates = { check_out_time: nowTime };
    } else if (action === "HALF_DAY") {
      updates = { status: "HALF_DAY", check_in_time: nowTime };
    } else if (action === "ON_LEAVE") {
      updates = { status: "ON_LEAVE", check_in_time: "Leave Logged" };
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
            action === "PUNCH_OUT" ? `Punched Out recorded at ${nowTime}!` :
              action === "HALF_DAY" ? `Half Day logged at ${nowTime}!` : `On Leave recorded for today!`
        );
      }
    } catch (err) {
      showToast("Error updating attendance record.");
    }
  };

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Authenticating credentials...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '3rem', position: 'relative', zIndex: 10, backgroundColor: '#070a10', color: '#ffffff' }}>
      {/* Compact Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.65rem 1.5rem',
        background: 'rgba(16, 24, 40, 0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" showTagline={false} />
          </Link>
          <span style={{
            background: 'linear-gradient(135deg, #00f5d4, #38bdf8)',
            color: '#070a10',
            padding: '0.25rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Employee Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {currentUser.role === "ADMIN" && (
            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #38bdf8, #9b72cf)',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#ffffff', fontWeight: 600 }}>
            <User size={13} color="#38bdf8" />
            <span>{currentUser.name}</span>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>({currentUser.id})</span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.76rem',
              fontWeight: 700,
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={13} color="#f87171" /> Logout
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

        {/* Modern Welcome Card */}
        <div className="glass-card" style={{ padding: '1.2rem 1.4rem', marginBottom: '1rem', background: 'rgba(16, 24, 40, 0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.22)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Employee Portal • A2Z Software Solutions
              </div>
              <h2 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0.2rem 0' }}>
                Welcome, {currentUser.name}
              </h2>
              <div style={{ display: 'flex', gap: '0.8rem', color: '#94a3b8', fontSize: '0.74rem', flexWrap: 'wrap' }}>
                <span><strong>ID:</strong> <span style={{ color: '#00f5d4', fontWeight: 700 }}>{currentUser.id}</span></span>
                <span><strong>Role:</strong> {currentUser.role}</span>
                <span><strong>Dept:</strong> {currentUser.department}</span>
              </div>
            </div>

            {/* Small Status Badge */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 700 }}>
                Today's Punch Status
              </div>
              <div>
                {currentUser.status === "PRESENT" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '0.25rem 0.75rem', borderRadius: '16px', fontWeight: 800, fontSize: '0.74rem', boxShadow: '0 2px 6px rgba(22, 163, 74, 0.15)' }}>
                    <CheckCircle2 size={13} /> PRESENT {currentUser.check_in_time ? `(${currentUser.check_in_time})` : ''}
                  </span>
                )}
                {currentUser.status === "HALF_DAY" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d', padding: '0.25rem 0.75rem', borderRadius: '16px', fontWeight: 800, fontSize: '0.74rem' }}>
                    <Clock3 size={13} /> HALF DAY {currentUser.check_in_time ? `(${currentUser.check_in_time})` : ''}
                  </span>
                )}
                {currentUser.status === "ABSENT" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '0.25rem 0.75rem', borderRadius: '16px', fontWeight: 800, fontSize: '0.74rem' }}>
                    <XCircle size={13} /> ABSENT
                  </span>
                )}
                {currentUser.status === "ON_LEAVE" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fce7f3', color: '#be185d', border: '1px solid #fbcfe8', padding: '0.25rem 0.75rem', borderRadius: '16px', fontWeight: 800, fontSize: '0.74rem' }}>
                    <Clock3 size={13} /> ON LEAVE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Small Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.1rem', flexWrap: 'wrap', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.4rem' }}>
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
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)' : 'rgba(16, 24, 40, 0.65)',
                color: activeTab === tab.id ? '#070a10' : '#cbd5e1',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(56, 189, 248, 0.25)',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(0, 245, 212, 0.3)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & TASKS QUEUE */}
        {activeTab === "OVERVIEW" && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>

            {/* Assigned Tasks Queue Card */}
            <div className="glass-card" style={{ padding: '1.2rem 1.3rem', background: 'rgba(16, 24, 40, 0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck color="#0284c7" size={18} />
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Assigned Tasks Queue ({tasks.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                    color: '#070a10', fontWeight: 800,
                    border: 'none',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                  }}
                >
                  <Plus size={13} /> Add Task
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {tasks.map((item) => (
                  <div key={item.id} style={{ padding: '0.75rem 0.9rem', background: 'rgba(7, 10, 16, 0.65)', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)', borderLeft: '4px solid #00f5d4', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: '1 1 auto', minWidth: 0, marginRight: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#00f5d4', background: 'rgba(0, 245, 212, 0.12)', padding: '0.12rem 0.45rem', borderRadius: '4px' }}>{item.id}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || item.task}</span>
                      </div>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 600 }}>
                        {item.time} • Priority: <strong style={{ color: item.priority === 'Urgent' ? '#b91c1c' : item.priority === 'High' ? '#b45309' : '#475569' }}>{item.priority}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                      {/* Interactive Status Selector */}
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateTaskStatus(item.id, e.target.value as any)}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          cursor: 'pointer',
                          outline: 'none',
                          background:
                            item.status === "Verified" ? 'rgba(0, 245, 212, 0.15)' :
                              item.status === "Review" ? 'rgba(168, 85, 247, 0.15)' :
                                item.status === "Blocked" ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color:
                            item.status === "Verified" ? '#00f5d4' :
                              item.status === "Review" ? '#c084fc' :
                                item.status === "Blocked" ? '#f87171' : '#38bdf8'
                        }}
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Under Review</option>
                        <option value="Verified">Completed</option>
                        <option value="Blocked">Blocked</option>
                      </select>

                      {/* Delete Task */}
                      <button
                        onClick={() => handleDeleteTask(item.id)}
                        title="Remove Task"
                        style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#dc2626', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.78rem' }}>
                    No tasks currently assigned. Click <strong>+ Add Task</strong> above to add one!
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="glass-card" style={{ padding: '1.2rem 1.3rem', background: 'rgba(16, 24, 40, 0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.8rem 0' }}>
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <button
                    onClick={() => setActiveTab("ATTENDANCE")}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(2, 132, 199, 0.25)', background: 'rgba(7, 10, 16, 0.65)', cursor: 'pointer', fontWeight: 700, fontSize: '0.76rem', color: '#ffffff', transition: 'all 0.2s ease' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={15} color="#0284c7" /> Record Today's Punch
                    </span>
                    <ArrowRight size={13} color="#0284c7" />
                  </button>

                  <button
                    onClick={() => setActiveTab("CALENDAR")}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.25)', background: 'rgba(7, 10, 16, 0.65)', cursor: 'pointer', fontWeight: 700, fontSize: '0.76rem', color: '#ffffff', transition: 'all 0.2s ease' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={15} color="#8b5cf6" /> Corporate Holidays
                    </span>
                    <ArrowRight size={13} color="#8b5cf6" />
                  </button>

                  <button
                    onClick={() => setActiveTab("DIRECTORY")}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', background: 'rgba(7, 10, 16, 0.65)', cursor: 'pointer', fontWeight: 700, fontSize: '0.76rem', color: '#ffffff', transition: 'all 0.2s ease' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building size={15} color="#10b981" /> Colleague Directory
                    </span>
                    <ArrowRight size={13} color="#10b981" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DAILY ATTENDANCE PUNCH (Punch In, Punch Out, Half Day, On Leave) */}
        {activeTab === "ATTENDANCE" && (
          <div className="glass-card" style={{ maxWidth: '640px', margin: '0 auto', padding: '1.4rem 1.6rem', textAlign: 'center', background: 'rgba(16, 24, 40, 0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(7, 10, 16, 0.65)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem auto', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <Clock color="#38bdf8" size={22} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
              Daily Attendance Clock
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '1.2rem' }}>
              Punch in at start of shift, record punch out, mark half day, or apply leave.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.7rem' }}>

              {/* Punch In */}
              <button
                onClick={() => handleAttendancePunch("PUNCH_IN")}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: '10px',
                  border: currentUser.status === "PRESENT" ? '1.5px solid #00f5d4' : '1px solid rgba(56, 189, 248, 0.25)',
                  background: currentUser.status === "PRESENT" ? 'rgba(0, 245, 212, 0.18)' : 'rgba(7, 10, 16, 0.65)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: currentUser.status === "PRESENT" ? '0 0 15px rgba(0, 245, 212, 0.25)' : 'none'
                }}
              >
                <CheckCircle2 color="#00f5d4" size={22} />
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#00f5d4' }}>Punch In</div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Shift Start</div>
              </button>

              {/* Punch Out */}
              <button
                onClick={() => handleAttendancePunch("PUNCH_OUT")}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  background: 'rgba(7, 10, 16, 0.65)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <LogOut color="#38bdf8" size={22} />
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#38bdf8' }}>Punch Out</div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Shift End</div>
              </button>

              {/* Half Day */}
              <button
                onClick={() => handleAttendancePunch("HALF_DAY")}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: '10px',
                  border: currentUser.status === "HALF_DAY" ? '1.5px solid #ffc107' : '1px solid rgba(56, 189, 248, 0.25)',
                  background: currentUser.status === "HALF_DAY" ? 'rgba(245, 158, 11, 0.18)' : 'rgba(7, 10, 16, 0.65)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: currentUser.status === "HALF_DAY" ? '0 0 15px rgba(245, 158, 11, 0.25)' : 'none'
                }}
              >
                <Clock3 color="#fbbf24" size={22} />
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#fbbf24' }}>Half Day</div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Half Shift</div>
              </button>

              {/* On Leave */}
              <button
                onClick={() => handleAttendancePunch("ON_LEAVE")}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: '10px',
                  border: currentUser.status === "ON_LEAVE" ? '1.5px solid #ec4899' : '1px solid rgba(56, 189, 248, 0.25)',
                  background: currentUser.status === "ON_LEAVE" ? 'rgba(236, 72, 153, 0.22)' : 'rgba(7, 10, 16, 0.65)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: currentUser.status === "ON_LEAVE" ? '0 0 15px rgba(236, 72, 153, 0.25)' : 'none'
                }}
              >
                <Calendar color="#f472b6" size={22} />
                <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f472b6' }}>Leave</div>
                <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Full Day Off</div>
              </button>

            </div>

            <div style={{ marginTop: '1.2rem', padding: '0.6rem 0.9rem', borderRadius: '8px', background: 'rgba(7, 10, 16, 0.65)', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '0.74rem', color: '#94a3b8' }}>
              Logged Status: <strong style={{ color: '#ffffff' }}>{currentUser.status}</strong> {currentUser.check_in_time ? `• Time: ${currentUser.check_in_time}` : ''}
            </div>
          </div>
        )}

        {/* TAB 3: COMPANY CALENDAR & HOLIDAYS (Small Cards) */}
        {activeTab === "CALENDAR" && (
          <div className="glass-card" style={{ padding: '1rem 1.1rem', background: 'rgba(16, 24, 40, 0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <Calendar color="#38bdf8" size={16} />
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Corporate Calendar & Holidays
                </h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.65rem' }}>
              {events.map(ev => (
                <div key={ev.id} style={{ background: 'rgba(7, 10, 16, 0.65)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '0.65rem 0.8rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#ffffff' }}>{ev.title}</div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '10px', background: 'var(--lilac-light)', color: '#38bdf8' }}>
                      {ev.type}
                    </span>
                  </div>
                  <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.7rem', marginTop: '0.2rem' }}>
                    📅 {ev.date}
                  </div>
                  {ev.description && (
                    <div style={{ fontSize: '0.66rem', color: '#94a3b8', marginTop: '0.2rem' }}>
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
          <div className="glass-card" style={{ padding: '1rem 1.1rem', background: 'rgba(16, 24, 40, 0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <Building color="#38bdf8" size={16} />
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Staff Directory
                </h3>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', color: '#94a3b8', fontSize: '0.68rem', textTransform: 'uppercase' }}>
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
                    <td style={{ padding: '0.45rem 0.5rem', fontWeight: 800, color: '#38bdf8' }}>{emp.id}</td>
                    <td style={{ padding: '0.45rem 0.5rem', fontWeight: 700, color: '#ffffff' }}>{emp.name}</td>
                    <td style={{ padding: '0.45rem 0.5rem', color: '#ffffff' }}>{emp.role}</td>
                    <td style={{ padding: '0.45rem 0.5rem', color: '#94a3b8' }}>{emp.department}</td>
                    <td style={{ padding: '0.45rem 0.5rem', color: '#94a3b8' }}>{emp.email}</td>
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
                background: 'rgba(16, 24, 40, 0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(56, 189, 248, 0.25)',
                width: '100%',
                maxWidth: '420px',
                padding: '1.4rem 1.6rem',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  + Add New Task
                </h3>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                    Task Title / Check Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js API Architecture Sprint"
                    value={newTask.task}
                    onChange={e => setNewTask({ ...newTask, task: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(7, 10, 16, 0.75)', color: '#ffffff', outline: 'none', fontSize: '0.78rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                      style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(7, 10, 16, 0.75)', color: '#ffffff', outline: 'none', fontSize: '0.78rem', boxSizing: 'border-box' }}
                    >
                      <option value="Urgent">🔴 Urgent</option>
                      <option value="High">🟠 High</option>
                      <option value="Normal">🟢 Normal</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                      Target SLA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SLA: 4h"
                      value={newTask.time}
                      onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(7, 10, 16, 0.75)', color: '#ffffff', outline: 'none', fontSize: '0.78rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                    Initial Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={e => setNewTask({ ...newTask, status: e.target.value as any })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: 'rgba(7, 10, 16, 0.75)', color: '#ffffff', outline: 'none', fontSize: '0.78rem', boxSizing: 'border-box' }}
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
                    style={{ padding: '0.55rem 1rem', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(7, 10, 16, 0.65)', cursor: 'pointer', fontWeight: 600, fontSize: '0.76rem' }}
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
