'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Home,
  Users,
  Calendar,
  BarChart2,
  FileText,
  Pill,
  Target,
  Video,
  Heart,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Filter,
  Download as DownloadIcon,
  Share2,
  Printer,
  Bell,
  X,
} from 'lucide-react';

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-center rounded-full border border-purple-200 bg-gradient-to-br from-purple-100 to-purple-50 font-mono font-semibold text-purple-700"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

function Sidebar() {
  const navItems = [
    { label: 'Dashboard', icon: Home, href: '/doctor/dashboard' },
    { label: 'Patients', icon: Users, href: '/doctor/patients' },
    { label: 'Appointments', icon: Calendar, href: '/doctor/appointments' },
    { label: 'Analytics', icon: BarChart2, href: '/doctor/analytics' },
    { label: 'Documents', icon: FileText, href: '/doctor/documents' },
    { label: 'Prescriptions', icon: Pill, href: '/doctor/prescriptions' },
    { label: 'Treatment Plans', icon: Target, href: '/doctor/treatment-plans' },
    { label: 'Consultations', icon: Video, href: '/doctor/consultations' },
    { label: 'Resources', icon: Heart, href: '/doctor/resources' },
    { label: 'Settings', icon: Settings, href: '/doctor/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-gradient-to-b from-purple-800 to-purple-900 md:flex">
      <div className="border-b border-purple-700 px-5 py-6">
        <div className="flex items-center gap-3">
          <Avatar name="Dr. Sarah Johnson" size={52} />
          <div>
            <p className="text-sm font-semibold text-white">Dr. Sarah Johnson</p>
            <p className="text-xs text-purple-200">Cardiologist</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition text-purple-100 hover:bg-purple-700/60 ${
              label === 'Analytics' ? 'bg-purple-700 text-white' : ''
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-purple-700 p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-3 text-red-300 transition hover:bg-red-500 hover:text-white">
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

// Filter Panel Component
function FilterPanel() {
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetrics, setSelectedMetrics] = useState([
    'bp',
    'sugar',
    'heart',
    'mood',
  ]);
  const [compareToggle, setCompareToggle] = useState(false);

  const metrics = [
    { id: 'bp', label: 'Blood Pressure' },
    { id: 'sugar', label: 'Blood Sugar' },
    { id: 'heart', label: 'Heart Rate' },
    { id: 'mood', label: 'Mood' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'weight', label: 'Weight' },
    { id: 'adherence', label: 'Medication Adherence' },
  ];

  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg mb-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        {/* Patient Selector */}
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase">Patient</label>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="mt-2 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Patients</option>
            <option value="john">John Smith</option>
            <option value="sara">Sara Lee</option>
            <option value="david">David Kim</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase">Date Range</label>
          <div className="mt-2 flex flex-wrap gap-1">
            {['7', '30', '90', '180'].map((days) => (
              <button
                key={days}
                onClick={() => setDateRange(days)}
                className={`rounded-lg px-2 py-1.5 text-xs font-bold transition ${
                  dateRange === days
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {days === '7' ? '7d' : days === '30' ? '30d' : days === '90' ? '90d' : '6m'}
              </button>
            ))}
            <button className="rounded-lg bg-gray-100 px-2 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200">
              Custom
            </button>
          </div>
        </div>

        {/* Metrics Selector */}
        <div className="lg:col-span-2">
          <label className="text-xs font-bold text-gray-700 uppercase">Metrics</label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {metrics.slice(0, 4).map((metric) => (
              <button
                key={metric.id}
                onClick={() =>
                  setSelectedMetrics((prev) =>
                    prev.includes(metric.id)
                      ? prev.filter((m) => m !== metric.id)
                      : [...prev, metric.id]
                  )
                }
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
                  selectedMetrics.includes(metric.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compare Toggle */}
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase">Compare</label>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setCompareToggle(!compareToggle)}
              className={`relative h-6 w-11 rounded-full transition ${
                compareToggle ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute h-5 w-5 rounded-full bg-white transition ${
                  compareToggle ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-xs font-semibold text-gray-700">Previous</span>
          </div>
        </div>

        {/* Export */}
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase">Export</label>
          <div className="relative mt-2">
            <button className="flex w-full items-center justify-between rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:border-gray-300">
              <DownloadIcon className="h-4 w-4" />
              <span className="text-xs">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Physical Health Trends Chart
function PhysicalHealthCard() {
  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Physical Health Metrics</h3>
          <p className="text-sm text-gray-600">Last 30 days trend analysis</p>
        </div>
        <button className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-200">
          ↗ Full View
        </button>
      </div>

      {/* Mock Chart Area */}
      <div className="relative h-64 w-full bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-4 flex items-end gap-2 justify-between">
        {/* Mock bar chart data */}
        {[65, 72, 68, 75, 70, 78, 82, 76, 80, 85].map((height, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg hover:from-emerald-600 transition cursor-pointer"
              style={{ height: `${(height / 100) * 200}px` }}
            />
            <span className="text-[10px] text-gray-500 font-semibold">
              {['J1', 'J5', 'J9', 'J13', 'J17', 'J21', 'J25', 'J29', 'Feb2', 'Feb6'][idx]}
            </span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 px-4 py-3 border border-red-200">
          <p className="text-xs font-bold text-gray-600 uppercase">Avg BP</p>
          <p className="text-lg font-bold text-gray-900 mt-1">128/82</p>
          <p className="text-xs text-red-600 font-semibold mt-1">↑ +5 mmHg</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 px-4 py-3 border border-emerald-200">
          <p className="text-xs font-bold text-gray-600 uppercase">Blood Sugar</p>
          <p className="text-lg font-bold text-gray-900 mt-1">95 mg/dL</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↓ -3 mg/dL</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 px-4 py-3 border border-blue-200">
          <p className="text-xs font-bold text-gray-600 uppercase">Heart Rate</p>
          <p className="text-lg font-bold text-gray-900 mt-1">74 bpm</p>
          <p className="text-xs text-gray-600 font-semibold mt-1">→ Stable</p>
        </div>
      </div>
    </div>
  );
}

// Mental Health Card
function MentalHealthCard() {
  const moodData = [
    { day: 'Mon', mood: 6, anxiety: 5, stress: 6 },
    { day: 'Tue', mood: 7, anxiety: 4, stress: 5 },
    { day: 'Wed', mood: 6, anxiety: 6, stress: 7 },
    { day: 'Thu', mood: 8, anxiety: 3, stress: 4 },
    { day: 'Fri', mood: 8, anxiety: 3, stress: 4 },
    { day: 'Sat', mood: 9, anxiety: 2, stress: 3 },
    { day: 'Sun', mood: 8, anxiety: 2, stress: 2 },
  ];

  const getMoodEmoji = (score: number) => {
    if (score <= 3) return '😢';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😊';
  };

  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Mental Health Tracking</h3>
          <p className="text-sm text-gray-600">Mood, Anxiety & Stress patterns</p>
        </div>
        <button className="rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-200">
          ℹ️ Details
        </button>
      </div>

      {/* Mood bars */}
      <div className="flex items-end justify-between gap-2 h-48 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-4">
        {moodData.map((data, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <div className="flex flex-col gap-1 h-32 w-full items-center justify-end">
              {/* Mood line */}
              <div
                className="w-6 h-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg"
                style={{ height: `${(data.mood / 10) * 100}px` }}
              />
            </div>
            <span className="text-lg">{getMoodEmoji(data.mood)}</span>
            <span className="text-[10px] font-bold text-gray-600">{data.day}</span>
          </div>
        ))}
      </div>

      {/* Weekly Breakdown */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left px-3 py-2 font-bold text-gray-700">Week</th>
              <th className="text-center px-3 py-2 font-bold text-gray-700">Mood</th>
              <th className="text-center px-3 py-2 font-bold text-gray-700">Anxiety</th>
              <th className="text-center px-3 py-2 font-bold text-gray-700">Stress</th>
            </tr>
          </thead>
          <tbody>
            {[
              { week: 'Week 1', mood: '6.5/10 😊', anxiety: '5/10', stress: '6/10', trend: '↑' },
              { week: 'Week 2', mood: '7.2/10 😊', anxiety: '4/10', stress: '5/10', trend: '↑' },
              { week: 'Week 3', mood: '7.8/10 😊', anxiety: '3/10', stress: '4/10', trend: '↑' },
            ].map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-3 py-3 font-semibold text-gray-900">{row.week}</td>
                <td className="text-center px-3 py-3 text-gray-700">{row.mood}</td>
                <td className="text-center px-3 py-3 text-gray-700">{row.anxiety}</td>
                <td className="text-center px-3 py-3 text-gray-700">{row.stress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trends */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-200">
          <p className="text-xs font-bold text-gray-600">Mood Trend</p>
          <p className="text-sm font-bold text-emerald-700 mt-1">↑ +1.0 Improving</p>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-200">
          <p className="text-xs font-bold text-gray-600">Anxiety</p>
          <p className="text-sm font-bold text-emerald-700 mt-1">↓ -2.0 Decreasing</p>
        </div>
        <div className="rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-200">
          <p className="text-xs font-bold text-gray-600">Stress</p>
          <p className="text-sm font-bold text-emerald-700 mt-1">↓ -3.0 Decreasing</p>
        </div>
      </div>
    </div>
  );
}

// Sleep & Stress Heatmap
function SleepHeatmapCard() {
  const sleepData = [
    [7.5, 6.8, 7.2, 5.5, 6.0, 8.2, 8.5],
    [6.5, 7.0, 6.8, 7.1, 5.8, 7.9, 8.1],
    [7.2, 6.5, 7.8, 6.2, 7.0, 8.0, 8.3],
    [6.8, 7.5, 7.0, 6.9, 6.5, 7.8, 8.0],
  ];

  const getSleepColor = (hours: number) => {
    if (hours < 4) return 'bg-red-500';
    if (hours < 5) return 'bg-orange-500';
    if (hours < 6) return 'bg-yellow-400';
    if (hours < 7) return 'bg-emerald-300';
    if (hours < 8) return 'bg-emerald-500';
    return 'bg-emerald-700';
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Sleep Quality & Stress</h3>
          <p className="text-sm text-gray-600">Last 30 days - Visual correlation</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 font-bold text-gray-700 text-sm"></th>
              {days.map((day) => (
                <th key={day} className="text-center px-2 py-2 font-bold text-gray-700 text-xs">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sleepData.map((week, weekIdx) => (
              <tr key={weekIdx}>
                <td className="text-left px-3 py-2 font-bold text-gray-700 text-xs">
                  {weeks[weekIdx]}
                </td>
                {week.map((hours, dayIdx) => (
                  <td key={dayIdx} className="text-center px-2 py-2">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-lg transition ${getSleepColor(
                        hours
                      )}`}
                      title={`${hours}h sleep`}
                    >
                      {hours}h
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-700">Legend:</span>
        {[
          { color: 'bg-red-500', label: '<4h' },
          { color: 'bg-orange-500', label: '4-5h' },
          { color: 'bg-yellow-400', label: '5-6h' },
          { color: 'bg-emerald-300', label: '6-7h' },
          { color: 'bg-emerald-500', label: '7-8h' },
          { color: 'bg-emerald-700', label: '8+h' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded ${item.color}`} />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Daily Patterns */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-emerald-50 px-4 py-3 border border-emerald-200">
          <p className="text-xs font-bold text-gray-600 uppercase mb-2">Best Sleep Days</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Sunday</span>
              <span className="text-emerald-700 font-bold">8.2h</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Saturday</span>
              <span className="text-emerald-700 font-bold">8.1h</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-orange-50 px-4 py-3 border border-orange-200">
          <p className="text-xs font-bold text-gray-600 uppercase mb-2">Worst Stress Days</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Monday</span>
              <span className="text-orange-700 font-bold">7/10</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Tuesday</span>
              <span className="text-orange-700 font-bold">6/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Medication Adherence Card
function MedicationAdherenceCard() {
  const adherenceData = [
    { week: 'Week 1', onTime: 60, late: 25, missed: 15 },
    { week: 'Week 2', onTime: 70, late: 20, missed: 10 },
    { week: 'Week 3', onTime: 75, late: 15, missed: 10 },
    { week: 'Week 4', onTime: 85, late: 10, missed: 5 },
  ];

  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Medication Adherence</h3>
          <p className="text-sm text-gray-600">Last 12 weeks compliance tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">Target: 80%</span>
          <div className="h-3 w-8 bg-emerald-500 rounded-full"></div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="space-y-4">
        {adherenceData.map((data, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">{data.week}</span>
              <span className="text-sm font-bold text-gray-900">
                {data.onTime + data.late}%
              </span>
            </div>
            <div className="flex h-8 rounded-lg overflow-hidden border-2 border-gray-300">
              <div
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${data.onTime}%` }}
              >
                {data.onTime > 15 && `${data.onTime}%`}
              </div>
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-300 flex items-center justify-center text-xs font-bold text-yellow-900"
                style={{ width: `${data.late}%` }}
              >
                {data.late > 10 && `${data.late}%`}
              </div>
              <div
                className="bg-gradient-to-r from-red-400 to-red-300 flex items-center justify-center text-xs font-bold text-red-900"
                style={{ width: `${data.missed}%` }}
              >
                {data.missed > 10 && `${data.missed}%`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend and Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="h-3 w-3 bg-emerald-600 rounded"></div>
          <div>
            <p className="text-xs font-bold text-gray-600">On Time</p>
            <p className="text-sm font-bold text-gray-900">75%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="h-3 w-3 bg-yellow-400 rounded"></div>
          <div>
            <p className="text-xs font-bold text-gray-600">Late</p>
            <p className="text-sm font-bold text-gray-900">15%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
          <div className="h-3 w-3 bg-red-400 rounded"></div>
          <div>
            <p className="text-xs font-bold text-gray-600">Missed</p>
            <p className="text-sm font-bold text-gray-900">10%</p>
          </div>
        </div>
      </div>

      {/* Medication Details */}
      <div className="mt-6">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Medication Breakdown</h4>
        <div className="space-y-2">
          {[
            { name: 'Metformin 500mg', adherence: 95, status: '✅' },
            { name: 'Lisinopril 10mg', adherence: 88, status: '✅' },
            { name: 'Sertraline 50mg', adherence: 72, status: '⚠️' },
          ].map((med, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-800">{med.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${med.adherence}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-8 text-right">
                  {med.adherence}%
                </span>
                <span className="text-lg">{med.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Disease-Specific Tracking
function DiseaseTrackingCard() {
  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Diabetes Management</h3>
          <p className="text-sm text-gray-600">HbA1c, Blood Sugar & Hypo/Hyper Events</p>
        </div>
        <select className="rounded-lg border-2 border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-gray-300">
          <option>Diabetes</option>
          <option>Hypertension</option>
          <option>Depression/Anxiety</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* HbA1c Trend */}
        <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">HbA1c Trend</h4>
          <p className="text-2xl font-bold text-gray-900">6.5%</p>
          <p className="text-xs text-emerald-700 font-bold mt-1">↓ Improving</p>
          <p className="text-xs text-gray-600 mt-2">Target: &lt;7%</p>
          <div className="mt-3 flex gap-1">
            {[8.2, 7.5, 6.8, 6.5].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 flex items-center justify-center p-1 rounded text-white font-bold text-xs"
                style={{
                  backgroundColor:
                    val > 7 ? '#EF4444' : val > 6.5 ? '#F59E0B' : '#22C55E',
                }}
              >
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* Average Blood Sugar Gauge */}
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Avg Blood Sugar</h4>
          <div className="relative h-32 flex items-center justify-center">
            <svg className="absolute inset-0" viewBox="0 0 100 50">
              <path
                d="M 10 45 A 35 35 0 0 1 90 45"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="4"
              />
              <path d="M 10 45 A 35 35 0 0 1 55 15" fill="none" stroke="#22C55E" strokeWidth="4" />
              <circle cx="55" cy="15" r="2.5" fill="#22C55E" />
            </svg>
            <div className="text-center z-10">
              <p className="text-2xl font-bold text-gray-900">105</p>
              <p className="text-xs text-gray-600">mg/dL</p>
            </div>
          </div>
          <p className="text-xs text-emerald-700 font-bold text-center mt-2">Good Zone</p>
        </div>

        {/* Events Chart */}
        <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 p-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Hypo/Hyper Events</h4>
          <div className="flex gap-1 h-24 items-end mb-2">
            {[
              { hypo: 2, hyper: 5 },
              { hypo: 1, hyper: 3 },
              { hypo: 0, hyper: 2 },
              { hypo: 0, hyper: 1 },
            ].map((week, idx) => (
              <div key={idx} className="flex-1 flex gap-0.5 items-end h-full">
                <div
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${(week.hypo / 5) * 100}%` }}
                />
                <div
                  className="flex-1 bg-red-500 rounded-t"
                  style={{ height: `${(week.hyper / 5) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600">Weeks: 1-4</p>
        </div>
      </div>

      {/* Time in Range */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Time in Range (70-180 mg/dL)</h4>
        <div className="flex h-8 rounded-lg overflow-hidden border-2 border-gray-300">
          <div className="flex-1 bg-red-400 flex items-center justify-center text-xs font-bold text-white">
            Low 5%
          </div>
          <div className="flex-[3] bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
            Target 75% ✅
          </div>
          <div className="flex-1 bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-900">
            High 20%
          </div>
        </div>
        <p className="text-xs text-emerald-700 font-bold mt-2">Excellent Control - Keep it up!</p>
      </div>
    </div>
  );
}

// Lab Results Table
function LabResultsCard() {
  const labResults = [
    { test: 'HbA1c', latest: '6.5%', previous: '6.8%', normal: '<7%', status: '✅' },
    { test: 'Fasting Glucose', latest: '95', previous: '105', normal: '70-100', status: '✅' },
    { test: 'Total Cholesterol', latest: '185', previous: '200', normal: '<200', status: '✅' },
    { test: 'LDL', latest: '110', previous: '125', normal: '<100', status: '⚠️' },
    { test: 'HDL', latest: '55', previous: '52', normal: '>40', status: '✅' },
    { test: 'Triglycerides', latest: '140', previous: '160', normal: '<150', status: '✅' },
  ];

  return (
    <div className="rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Lab Results Timeline</h3>
        <p className="text-sm text-gray-600">Latest lab work and trends</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left px-4 py-3 font-bold text-gray-700 text-sm">Test</th>
              <th className="text-center px-4 py-3 font-bold text-gray-700 text-sm">Latest</th>
              <th className="text-center px-4 py-3 font-bold text-gray-700 text-sm">Previous</th>
              <th className="text-center px-4 py-3 font-bold text-gray-700 text-sm">Change</th>
              <th className="text-center px-4 py-3 font-bold text-gray-700 text-sm">Normal</th>
              <th className="text-center px-4 py-3 font-bold text-gray-700 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {labResults.map((result, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">{result.test}</td>
                <td className="text-center px-4 py-3 text-gray-900 font-bold">{result.latest}</td>
                <td className="text-center px-4 py-3 text-gray-600">{result.previous}</td>
                <td className="text-center px-4 py-3">
                  <span className="text-emerald-700 font-bold">↓ Improved</span>
                </td>
                <td className="text-center px-4 py-3 text-gray-600">{result.normal}</td>
                <td className="text-center px-4 py-3 text-lg">{result.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Generate Report Modal
function GenerateReportModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generate Patient Report</h2>
            <p className="text-sm text-gray-600 mt-1">Customize your analytics export</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Report Type */}
          <div>
            <label className="text-sm font-bold text-gray-700 uppercase">Report Type</label>
            <div className="mt-2 space-y-2">
              {[
                { id: 'quick', label: 'Quick Summary (2 pages)', desc: 'Essentials only' },
                { id: 'detailed', label: 'Detailed Analysis (10+ pages)', desc: 'Comprehensive view' },
                { id: 'custom', label: 'Custom Report', desc: 'Select sections' },
              ].map((type) => (
                <label key={type.id} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-emerald-400 cursor-pointer">
                  <input type="radio" name="reportType" defaultChecked={type.id === 'quick'} />
                  <div>
                    <p className="font-semibold text-gray-900">{type.label}</p>
                    <p className="text-xs text-gray-600">{type.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-bold text-gray-700 uppercase">Date Range</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {['Last 30 days', 'Last 90 days', '6 months', '1 year', 'Custom'].map((range) => (
                <button
                  key={range}
                  className="px-3 py-1.5 rounded-lg border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-emerald-400"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <label className="text-sm font-bold text-gray-700 uppercase">Sections</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                'Executive Summary',
                'Vitals Trends',
                'Mental Health',
                'Medication Adherence',
                'Lab Results',
                'Appointment History',
                'Treatment Plan',
                'Recommendations',
              ].map((section) => (
                <label key={section} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm font-semibold text-gray-700">{section}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format & Recipient */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 uppercase">Format</label>
              <select className="mt-2 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800">
                <option>PDF (default)</option>
                <option>Word Document</option>
                <option>Excel Spreadsheet</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 uppercase">Recipient</label>
              <select className="mt-2 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800">
                <option>For Doctor's Records</option>
                <option>Share with Patient</option>
                <option>Send to Another Provider</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
              Preview Report
            </button>
            <button className="flex-1 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-700">
              Generate & Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="md:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3 flex-1">
              <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-100 md:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-lg border-2 border-gray-200 p-2 text-gray-600 hover:bg-gray-100">
                <Filter className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <DownloadIcon className="h-4 w-4" />
                Generate Report
              </button>
              <button className="rounded-lg border-2 border-gray-200 p-2 text-gray-600 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Filter Panel */}
          <FilterPanel />

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PhysicalHealthCard />
            <MentalHealthCard />
            <SleepHeatmapCard />
            <MedicationAdherenceCard />
            <div className="lg:col-span-2">
              <DiseaseTrackingCard />
            </div>
            <div className="lg:col-span-2">
              <LabResultsCard />
            </div>
          </div>
        </div>
      </div>

      {showReportModal && <GenerateReportModal onClose={() => setShowReportModal(false)} />}
    </div>
  );
}
