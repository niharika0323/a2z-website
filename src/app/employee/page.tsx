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
  X,
  Search,
  Activity,
  Award,
  Zap,
  CheckCircle,
  Briefcase
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
  { id: "TSK-101", task: "Next.js 16 Server Component Optimization", priority: "High", time: "SLA: 4h", status: "In Progress" },
  { id: "TSK-102", task: "Enterprise REST API Gateway & OAuth Security", priority: "Urgent", time: "SLA: 2h", status: "Review" },
  { id: "TSK-103", task: "Mobile Push Notification Engine & Offline Sync", priority: "Normal", time: "SLA: 24h", status: "Verified" },
  { id: "TSK-104", task: "Cloud Database Query Indexing & Backup Verification", priority: "Normal", time: "SLA: 12h", status: "In Progress" }
];

export default function EmployeePortal() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [directory, setDirectory] = useState<Employee[]>([]);
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "ATTENDANCE" | "CALENDAR" | "DIRECTORY">("OVERVIEW");
  const [notification, setNotification] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Employee Task Management State
  const [tasks, setTasks] = useState<VerificationTask[]>(DEFAULT_TASKS);
  const [taskFilter, setTaskFilter] = useState<string>("ALL");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [directorySearch, setDirectorySearch] = useState("");
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

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

    const savedTasks = localStorage.getItem("a2z_employee_tasks");
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (parsed.length > 0) {
          setTasks(parsed);
        }
      } catch (e) {}
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
      console.warn("Could not load server tasks, using local cache", e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.task.trim()) return;

    const taskObj: VerificationTask = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      task: newTask.task,
      title: newTask.task,
      assigned_to: currentUser?.id || "EMP-101",
      employee_name: currentUser?.name || "Staff Member",
      priority: newTask.priority,
      time: newTask.time || "SLA: 4h",
      status: newTask.status
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskObj)
      });
      if (res.ok) {
        const data = await res.json();
        const updated = [data.task || taskObj, ...tasks];
        setTasks(updated);
        localStorage.setItem("a2z_employee_tasks", JSON.stringify(updated));
      } else {
        const updated = [taskObj, ...tasks];
        setTasks(updated);
        localStorage.setItem("a2z_employee_tasks", JSON.stringify(updated));
      }
    } catch (err) {
      const updated = [taskObj, ...tasks];
      setTasks(updated);
      localStorage.setItem("a2z_employee_tasks", JSON.stringify(updated));
    }

    setShowAddTaskModal(false);
    setNewTask({ task: "", priority: "High", time: "SLA: 4h", status: "In Progress" });
    showToast("Task successfully added to your work queue!");
  };

  const handleUpdateTaskStatus = async (id: string, newStatus: VerificationTask["status"]) => {
    const updated = tasks.map(t => (t.id === id ? { ...t, status: newStatus } : t));
    setTasks(updated);
    localStorage.setItem("a2z_employee_tasks", JSON.stringify(updated));

    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      showToast(`Task ${id} updated to ${newStatus}`);
    } catch (e) {
      showToast(`Task ${id} updated locally`);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem("a2z_employee_tasks", JSON.stringify(updated));

    try {
      await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      showToast("Task removed from active board.");
    } catch (e) {
      showToast("Task removed.");
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06080e' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Authenticating employee credentials...</p>
      </div>
    );
  }

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "ALL") return true;
    return t.status === taskFilter;
  });

  const filteredDirectory = directory.filter(e => 
    e.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
    e.department.toLowerCase().includes(directorySearch.toLowerCase()) ||
    e.role.toLowerCase().includes(directorySearch.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem', position: 'relative', zIndex: 10, backgroundColor: '#06080e', color: '#ffffff' }}>
      
      {/* Executive Enterprise Top Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 2rem',
        background: 'rgba(12, 16, 23, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo size="sm" showTagline={false} />
          </Link>
          <span style={{
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            padding: '0.25rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Staff Workspace
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Live Digital Clock Badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            fontSize: '0.78rem', 
            fontWeight: 700, 
            color: '#00f5d4',
            background: 'rgba(0, 245, 212, 0.08)',
            border: '1px solid rgba(0, 245, 212, 0.25)',
            padding: '0.3rem 0.75rem',
            borderRadius: '20px'
          }}>
            <Clock size={13} color="#00f5d4" />
            <span>{currentTime || "Live"}</span>
          </div>

          {currentUser.role === "ADMIN" && (
            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #0284c7, #818cf8)',
                color: '#fff',
                border: 'none',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <ShieldCheck size={13} /> Admin Console
              </button>
            </Link>
          )}

          {/* User Profile Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f5d4, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06080e', fontWeight: 800, fontSize: '0.75rem' }}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <span style={{ fontWeight: 700 }}>{currentUser.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', lineHeight: 1 }}>{currentUser.id}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.76rem',
              fontWeight: 700,
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={13} color="#f87171" /> Logout
          </button>
        </div>
      </nav>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: '4rem',
              right: '2rem',
              zIndex: 999,
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.8rem',
              background: 'rgba(12, 16, 23, 0.95)',
              color: '#00f5d4',
              border: '1px solid #00f5d4',
              boxShadow: '0 8px 25px rgba(0, 245, 212, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle size={15} color="#00f5d4" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1120px', margin: '1.8rem auto 0 auto', padding: '0 1.5rem' }}>

        {/* Executive Header Banner */}
        <div className="glass-card" style={{ 
          padding: '1.8rem 2rem', 
          marginBottom: '1.5rem', 
          background: 'rgba(12, 16, 23, 0.8)', 
          border: '1px solid rgba(56, 189, 248, 0.25)', 
          borderRadius: '18px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '0.3rem' }}>
                Enterprise Digital Workforce &bull; A2Z
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Welcome back, {currentUser.name}
              </h2>
              <div style={{ display: 'flex', gap: '1.2rem', color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <span><strong>Role:</strong> <span style={{ color: '#cbd5e1' }}>{currentUser.role}</span></span>
                <span><strong>Department:</strong> <span style={{ color: '#cbd5e1' }}>{currentUser.department}</span></span>
                <span><strong>Email:</strong> <span style={{ color: '#cbd5e1' }}>{currentUser.email}</span></span>
              </div>
            </div>

            {/* Current Attendance Status Badge */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 700 }}>
                Current Shift Status
              </div>
              <div>
                {currentUser.status === "PRESENT" && (
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.45rem', 
                    background: 'rgba(16, 185, 129, 0.15)', 
                    color: '#34d399', 
                    border: '1px solid rgba(16, 185, 129, 0.35)', 
                    padding: '0.35rem 0.95rem', 
                    borderRadius: '20px', 
                    fontWeight: 800, 
                    fontSize: '0.8rem',
                    boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
                  }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    PRESENT {currentUser.check_in_time ? `• In at ${currentUser.check_in_time}` : ''}
                  </span>
                )}
                {currentUser.status === "HALF_DAY" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.35rem 0.95rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem' }}>
                    <Clock3 size={14} /> HALF DAY {currentUser.check_in_time ? `• ${currentUser.check_in_time}` : ''}
                  </span>
                )}
                {currentUser.status === "ABSENT" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.35)', padding: '0.35rem 0.95rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem' }}>
                    <XCircle size={14} /> ABSENT
                  </span>
                )}
                {currentUser.status === "ON_LEAVE" && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: '1px solid rgba(236, 72, 153, 0.35)', padding: '0.35rem 0.95rem', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem' }}>
                    <Calendar size={14} /> ON LEAVE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Executive KPI Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' }}>
          
          {/* Card 1: Active Tasks */}
          <div className="glass-card" style={{ padding: '1.3rem 1.5rem', background: 'rgba(16, 24, 40, 0.75)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', color: '#94a3b8', fontWeight: 700 }}>ACTIVE TASKS</span>
              <Activity size={18} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.3rem' }}>
              {tasks.filter(t => t.status !== "Verified").length}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
              {tasks.filter(t => t.priority === "Urgent").length} urgent priority
            </div>
          </div>

          {/* Card 2: Completed Tasks (Replaces SLA Compliance) */}
          <div className="glass-card" style={{ padding: '1.3rem 1.5rem', background: 'rgba(16, 24, 40, 0.75)', border: '1px solid rgba(0, 245, 212, 0.3)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', color: '#94a3b8', fontWeight: 700 }}>COMPLETED TASKS</span>
              <CheckCircle2 size={18} color="#00f5d4" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00f5d4', marginTop: '0.3rem' }}>
              {tasks.filter(t => t.status === "Verified").length}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
              Delivered & verified
            </div>
          </div>

          {/* Card 3: Attendance Rate */}
          <div className="glass-card" style={{ padding: '1.3rem 1.5rem', background: 'rgba(16, 24, 40, 0.75)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', color: '#94a3b8', fontWeight: 700 }}>ATTENDANCE RATE</span>
              <Award size={18} color="#a855f7" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7', marginTop: '0.3rem' }}>
              100%
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
              Current month on-time record
            </div>
          </div>

          {/* Card 4: Paid Leave Balance (Replaces System Status) */}
          <div className="glass-card" style={{ padding: '1.3rem 1.5rem', background: 'rgba(16, 24, 40, 0.75)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.86rem', color: '#94a3b8', fontWeight: 700 }}>PAID LEAVE BALANCE</span>
              <Calendar size={18} color="#34d399" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '0.3rem' }}>
              18 Days
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
              4 Casual • 14 Annual Earned
            </div>
          </div>

        </div>

        {/* Modern Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.6rem', flexWrap: 'wrap' }}>
          {[
            { id: "OVERVIEW", label: "Task Board & Queue" },
            { id: "ATTENDANCE", label: "Attendance Clock" },
            { id: "CALENDAR", label: "Company Calendar" },
            { id: "DIRECTORY", label: "Colleague Directory" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.94rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)' : 'rgba(16, 24, 40, 0.75)',
                color: activeTab === tab.id ? '#06080e' : '#cbd5e1',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: activeTab === tab.id ? '0 4px 20px rgba(0, 245, 212, 0.35)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & TASKS BOARD */}
        {activeTab === "OVERVIEW" && (
          <div>
            {/* Header controls for tasks */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {["ALL", "In Progress", "Review", "Verified", "Blocked"].map(f => (
                  <button
                    key={f}
                    onClick={() => setTaskFilter(f)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: '20px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      background: taskFilter === f ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: taskFilter === f ? '#38bdf8' : '#94a3b8',
                      border: taskFilter === f ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                  color: '#06080e',
                  fontWeight: 800,
                  border: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 245, 212, 0.3)'
                }}
              >
                <Plus size={15} /> Add New Task
              </button>
            </div>

            {/* Task Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredTasks.map((item) => (
                <div 
                  key={item.id} 
                  className="glass-card"
                  style={{ 
                    padding: '1.1rem 1.4rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    borderLeft: `4px solid ${
                      item.priority === 'Urgent' ? '#ef4444' : 
                      item.priority === 'High' ? '#f59e0b' : '#38bdf8'
                    }`
                  }}
                >
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00f5d4', background: 'rgba(0, 245, 212, 0.12)', padding: '0.15rem 0.55rem', borderRadius: '6px' }}>
                        {item.id}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                        {item.title || item.task}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span>{item.time}</span>
                      <span>Priority: <strong style={{ color: item.priority === 'Urgent' ? '#f87171' : item.priority === 'High' ? '#fbbf24' : '#94a3b8' }}>{item.priority}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateTaskStatus(item.id, e.target.value as any)}
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
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
                      <option value="Review">Review</option>
                      <option value="Verified">Completed</option>
                      <option value="Blocked">Blocked</option>
                    </select>

                    <button
                      onClick={() => handleDeleteTask(item.id)}
                      title="Delete task"
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.25)', 
                        color: '#f87171', 
                        cursor: 'pointer', 
                        padding: '0.4rem', 
                        borderRadius: '6px' 
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredTasks.length === 0 && (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                  No tasks found under this filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE CLOCK */}
        {activeTab === "ATTENDANCE" && (
          <div className="glass-card" style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.35)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto' }}>
              <Clock size={28} color="#38bdf8" />
            </div>

            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00f5d4', letterSpacing: '1px', fontFamily: 'monospace', marginBottom: '0.3rem' }}>
              {currentTime || "--:--:--"}
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
              Daily Enterprise Attendance Clock
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', marginBottom: '2rem' }}>
              Record your official shift punch in, punch out, half-day, or log planned absence.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '1.8rem' }}>
              <button
                onClick={() => handleAttendancePunch("PUNCH_IN")}
                style={{
                  padding: '1.1rem 0.5rem',
                  borderRadius: '12px',
                  border: currentUser.status === "PRESENT" ? '1.5px solid #00f5d4' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: currentUser.status === "PRESENT" ? 'rgba(0, 245, 212, 0.18)' : 'rgba(16, 24, 40, 0.6)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: currentUser.status === "PRESENT" ? '0 0 20px rgba(0, 245, 212, 0.3)' : 'none'
                }}
              >
                <CheckCircle2 color="#00f5d4" size={24} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#00f5d4' }}>Punch In</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Shift Start</div>
              </button>

              <button
                onClick={() => handleAttendancePunch("PUNCH_OUT")}
                style={{
                  padding: '1.1rem 0.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(16, 24, 40, 0.6)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <LogOut color="#38bdf8" size={24} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#38bdf8' }}>Punch Out</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Shift End</div>
              </button>

              <button
                onClick={() => handleAttendancePunch("HALF_DAY")}
                style={{
                  padding: '1.1rem 0.5rem',
                  borderRadius: '12px',
                  border: currentUser.status === "HALF_DAY" ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: currentUser.status === "HALF_DAY" ? 'rgba(245, 158, 11, 0.18)' : 'rgba(16, 24, 40, 0.6)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: currentUser.status === "HALF_DAY" ? '0 0 20px rgba(245, 158, 11, 0.3)' : 'none'
                }}
              >
                <Clock3 color="#fbbf24" size={24} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fbbf24' }}>Half Day</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Half Shift</div>
              </button>

              <button
                onClick={() => handleAttendancePunch("ON_LEAVE")}
                style={{
                  padding: '1.1rem 0.5rem',
                  borderRadius: '12px',
                  border: currentUser.status === "ON_LEAVE" ? '1.5px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: currentUser.status === "ON_LEAVE" ? 'rgba(236, 72, 153, 0.18)' : 'rgba(16, 24, 40, 0.6)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: currentUser.status === "ON_LEAVE" ? '0 0 20px rgba(236, 72, 153, 0.3)' : 'none'
                }}
              >
                <Calendar color="#f472b6" size={24} />
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#f472b6' }}>Leave</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Planned Off</div>
              </button>
            </div>

            <div style={{ padding: '0.8rem 1.2rem', borderRadius: '10px', background: 'rgba(9, 13, 22, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.82rem', color: '#94a3b8' }}>
              Current State: <strong style={{ color: '#ffffff' }}>{currentUser.status}</strong> {currentUser.check_in_time ? `• Punch In: ${currentUser.check_in_time}` : ''} {currentUser.check_out_time ? `• Punch Out: ${currentUser.check_out_time}` : ''}
            </div>
          </div>
        )}

        {/* TAB 3: CALENDAR & HOLIDAYS */}
        {activeTab === "CALENDAR" && (
          <div className="glass-card" style={{ padding: '2rem 2.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.8rem' }}>
              <Calendar color="#00f5d4" size={24} />
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Corporate Calendar & Observances
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
              {events.map((evt) => (
                <div 
                  key={evt.id} 
                  style={{ 
                    padding: '1.4rem', 
                    background: 'rgba(12, 16, 28, 0.85)', 
                    borderRadius: '14px', 
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#00f5d4', textTransform: 'uppercase', background: 'rgba(0, 245, 212, 0.12)', border: '1px solid rgba(0, 245, 212, 0.3)', padding: '0.2rem 0.65rem', borderRadius: '16px' }}>
                      {evt.type}
                    </span>
                    <span style={{ fontSize: '0.94rem', color: '#38bdf8', fontWeight: 700 }}>
                      📅 {evt.date}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
                    {evt.title}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {evt.description || "Corporate company holiday or company-wide observance."}
                  </div>
                </div>
              ))}

              {events.length === 0 && (
                <div style={{ color: '#94a3b8', padding: '3rem', textAlign: 'center', fontSize: '0.95rem' }}>
                  No upcoming calendar events scheduled.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: STAFF DIRECTORY */}
        {activeTab === "DIRECTORY" && (
          <div className="glass-card" style={{ padding: '2rem 2.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building color="#10b981" size={24} />
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Staff Directory ({filteredDirectory.length})
                </h3>
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.85rem' }} />
                <input
                  type="text"
                  placeholder="Search colleagues..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.9rem 0.6rem 2.5rem',
                    borderRadius: '8px',
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
              {filteredDirectory.map((emp) => (
                <div 
                  key={emp.id} 
                  style={{ 
                    padding: '1.3rem', 
                    background: 'rgba(12, 16, 28, 0.85)', 
                    borderRadius: '14px', 
                    border: '1px solid rgba(56, 189, 248, 0.25)', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1rem' 
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284c7, #00f5d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#06080e',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}>
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#ffffff' }}>
                      {emp.name}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 600, marginTop: '0.15rem' }}>
                      {emp.role}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                      {emp.department}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                      {emp.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTaskModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                background: 'rgba(12, 16, 23, 0.95)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '18px',
                padding: '1.8rem',
                maxWidth: '460px',
                width: '100%',
                boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Add Task to Work Queue
                </h3>
                <button 
                  onClick={() => setShowAddTaskModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.3rem' }}>
                    Task Title / Deliverable Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement Next.js caching layer"
                    value={newTask.task}
                    onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: 'rgba(7, 10, 16, 0.7)',
                      color: '#ffffff',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.3rem' }}>
                      Priority Level
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(7, 10, 16, 0.7)',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        outline: 'none'
                      }}
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.3rem' }}>
                      Target SLA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SLA: 4h"
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(7, 10, 16, 0.7)',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    style={{
                      padding: '0.6rem 1.1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: 'transparent',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 700
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.6rem 1.4rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #00f5d4 0%, #0284c7 100%)',
                      color: '#06080e',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 800
                    }}
                  >
                    Create Task
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
