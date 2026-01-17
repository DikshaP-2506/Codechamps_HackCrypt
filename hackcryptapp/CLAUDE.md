Comprehensive UI Design Prompt for Healthcare Management System
Design System Foundation
Color Theme (Green Healthcare Palette)

Primary Green: #10B981 (Emerald-500) - Main actions, CTAs
Dark Green: #047857 (Emerald-700) - Headers, important text
Light Green: #D1FAE5 (Emerald-100) - Backgrounds, subtle highlights
Accent Green: #34D399 (Emerald-400) - Success states, positive metrics
Mint: #6EE7B7 (Emerald-300) - Secondary actions, info cards
Forest: #065F46 (Emerald-900) - Navigation, footers
Neutral Grays: #F9FAFB, #E5E7EB, #6B7280, #1F2937
Alert Colors: Red (#EF4444), Yellow (#F59E0B), Blue (#3B82F6)

Typography

Headings: Inter Bold (32px/24px/18px/16px)
Body: Inter Regular (16px/14px)
Labels: Inter Medium (14px/12px)
Monospace (for data): JetBrains Mono (vitals, IDs)

Design Principles

Clean, medical-grade interface with ample whitespace
Card-based layouts for information hierarchy
Soft shadows and rounded corners (8px-16px radius)
Accessible color contrast ratios (WCAG AA minimum)
Mobile-first responsive design
Intuitive iconography (Lucide React icons)


Page-by-Page UI Design Specifications

1. AUTHENTICATION FLOWS
1.1 Landing Page (Public)
Layout: Full-screen hero with split design

Left Section (60%):

Animated healthcare illustration with gradient green overlay
Floating stat cards: "10K+ Patients", "500+ Doctors", "24/7 Care"
Subtle parallax scrolling effect


Right Section (40%):

White card with soft shadow elevation
Logo at top (green + gray medical cross)
Tagline: "Integrated Care. Empowered Health."
Two prominent CTAs:

"Login" (outlined green button)
"Register as Patient/Caretaker" (filled green button)


Small text link: "Admin/Staff Access" → redirects to admin login



Interactive Elements:

Smooth micro-animations on button hover
Testimonial carousel at bottom
Trust badges (HIPAA compliant, secure, encrypted)


1.2 Role-Based Login Page
Layout: Centered card (480px max-width)
Header Section:

Back arrow to landing page
Role selector tabs (horizontal pills):

Doctor | Patient | Caretaker | Admin | Lab Reporter | Nurse
Active tab: solid green background, white text
Inactive: light green background, dark green text



Form Section:

Clean input fields with floating labels
Email/Username field (icon: user)
Password field (icon: lock, show/hide toggle)
"Remember Me" checkbox (green when checked)
"Forgot Password?" link (right-aligned, green text)
Login button (full-width, green, 48px height)
Error messages in red below respective fields

Footer:

"Don't have an account? Register" (only for Patient/Caretaker)
Security badge icon with "256-bit Encrypted"

Variants by Role:

Admin/Staff roles: No registration link, show "Contact admin for credentials"
Patient/Caretaker: Show registration link
All roles: Same visual design, different copy


1.3 Patient/Caretaker Registration
Layout: Multi-step wizard with progress indicator
Progress Bar (top):

4 steps: Personal Info → Medical Info → Emergency Contact → Verification
Visual stepper with green checkmarks for completed steps
Current step highlighted with pulsing green circle

Step 1: Personal Information

Full Name (text input)
Date of Birth (date picker with calendar icon)
Gender (radio buttons: Male/Female/Other with custom icons)
Phone Number (with country code dropdown)
Email Address
Upload Profile Photo (dashed border drop zone, green on hover)
Continue button (bottom right, green)

Step 2: Medical Information

Blood Group (dropdown with visual blood drop icons)
Allergies (tag input: type and press enter, green tags)
Chronic Conditions (multi-select checkboxes in grid layout)
Past Surgeries (textarea with character count)
Current Medications (dynamic add/remove list)
Back | Continue buttons

Step 3: Emergency Contact

Emergency Contact Name
Relationship (dropdown)
Phone Number
Alternate Contact (collapsible section)
For Caretaker Registration: Add "Patient Details" section

Patient Name, ID, Relationship


Back | Continue buttons

Step 4: Verification

OTP sent to phone/email
6-digit OTP input (auto-focus next field)
Resend OTP (countdown timer, 60s)
Summary card showing all entered info
"Verify & Complete Registration" (green button)

Success State:

Checkmark animation
"Registration Successful!" message
Auto-redirect to role-specific dashboard (3s countdown)


2. DOCTOR WEB INTERFACE
2.1 Doctor Dashboard (Home)
Layout: Sidebar navigation + main content area
Sidebar (240px fixed width, Forest green background):

Profile section at top:

Circular avatar (56px)
Dr. Name (white text)
Specialty (gray-300 text, smaller)


Navigation menu items (icons + labels):

🏠 Dashboard (active: light green background)
👥 Patients
📅 Appointments
📊 Analytics
📄 Documents
💊 Prescriptions
🎯 Treatment Plans
🎥 Teleconsultation
🧘 Wellness Library
👥 Collaboration
⚙️ Settings


Logout button (bottom, red icon)

Top Bar (White, sticky):

Search bar (left, 400px): "Search patients, appointments..."
Alert bell icon (badge with count if unread alerts)
Settings gear icon
Profile dropdown (click avatar)

Main Content Grid:
Row 1: Stats Cards (4 columns)

Total Patients

Large number: 247 (dark green)
Subtitle: "Active patients"
Trend: +12% ↑ (green text)
Icon: users (top-right, light green circle)


Today's Appointments

Number: 8
Subtitle: "3 completed, 5 upcoming"
Icon: calendar


Pending Alerts

Number: 5
Color: Yellow/Red based on severity
Subtitle: "Require attention"
Icon: alert-triangle


Active Treatments

Number: 142
Subtitle: "Ongoing plans"
Icon: activity



Row 2: Two-Column Layout
Left Column (60%): Today's Schedule

Card header: "Today's Appointments" + "View All" link
Timeline view:

Each appointment: horizontal card
Time (left, bold): 09:00 AM
Patient avatar + name
Appointment type badge (Consultation/Follow-up/Therapy)
Status indicator: dot (green=upcoming, blue=in-progress, gray=completed)
Quick actions: Join (video icon), Reschedule, Cancel


Empty state: Illustration + "No appointments scheduled"

Right Column (40%): Recent Alerts

Card header: "Critical Alerts" + filter dropdown (All/Critical/High/Medium)
Alert list items:

Severity indicator (left border: red/yellow/blue)
Patient name (bold, clickable)
Alert type: "Hypertensive Crisis - BP 180/110"
Timestamp: "2 hours ago"
Action button: "Review" (small, green outlined)


View All Alerts button (bottom)

Row 3: Quick Actions Panel

4 large action cards (icon + label):

"Add Patient" (green card, user-plus icon)
"New Prescription" (blue card, pill icon)
"Schedule Appointment" (yellow card, calendar-plus)
"Upload Document" (purple card, upload icon)



Row 4: Patient Overview

Table header: "Recent Patient Activity" + search/filter
Data table:

Columns: Patient Name (avatar + text), Last Visit, Condition, Next Appointment, Status, Actions
Status badges: Active (green), Follow-up (yellow), Critical (red)
Actions dropdown: View Profile, Message, Schedule


Pagination (bottom)


2.2 Patient Profiles Page
Layout: List view with detailed sidebar panel
Left Panel: Patient List (400px)

Search bar with filters:

Text search
Filter dropdowns: Status, Condition, Risk Level
Date range picker


"Add New Patient" button (green, top-right)
Patient cards in scrollable list:

Avatar (left, 48px)
Name (bold) + ID (gray, small)
Age, Gender (icons)
Primary condition badge
Last visit date
Risk indicator: color-coded dot (red/yellow/green)
Click to view details →



Right Panel: Patient Details (expandable)

When patient selected from list:

Header Section:

Large avatar (left, 96px)
Patient name (h2)
ID, Age, Gender, Blood Group (metadata row)
Action buttons (right): Edit, Print, Share, Archive
Tabs below: Overview | Medical History | Vitals | Mental Health | Documents | Timeline

Tab 1: Overview

Quick Stats Grid (3 columns):

Last Visit, Next Appointment, Total Visits


Contact Information card
Emergency Contact card (red border)
Assigned Doctor/Care Team card
Current Treatment Plans (list)

Tab 2: Medical History

Accordion sections:

Chronic Conditions (expandable list with dates)
Allergies (highlighted in red tags)
Past Surgeries (timeline view)
Family History (tree structure icon)
Immunizations (checklist)



Tab 3: Vitals (see Module 2)
Tab 4: Mental Health (see Module 3)
Tab 5: Documents (see Module 7)
Tab 6: Timeline (see Module 15)

2.3 Patient Profile Creation/Edit Modal
Layout: Full-screen modal with wizard OR inline form
Wizard Approach (recommended for creation):

Same structure as patient registration
4 steps with progress indicator
Auto-save draft functionality
Rich form fields:

Date inputs with calendar picker
Multi-select dropdowns for conditions
Tag inputs for allergies
Rich text editor for notes
File upload for insurance/ID documents



Inline Form (for editing):

Sections in expandable cards
Edit in place with save/cancel buttons
Validation errors inline below fields
Success toast notification after save


2.4 Physical Vitals Tracking Page
Layout: Dashboard with graph visualization + data entry
Header:

Patient selector (if viewing for specific patient)
Date range picker (last 7 days, 30 days, 90 days, custom)
Export button (CSV/PDF)

Vitals Grid (3x2 cards):
Each card shows one vital metric:

Blood Pressure

Large display: 120/80 mmHg (current reading)
Status indicator: Normal (green)/High (yellow)/Critical (red)
Mini line graph (sparkline) showing 7-day trend
"Log New Reading" button


Blood Sugar

Fasting: 95 mg/dL | Post-prandial: 140 mg/dL
Dual sparkline graphs
HbA1c: 5.8% (badge)


Heart Rate

72 bpm (large, with heart icon animation)
Range indicator: Normal 60-100
Trend graph


SpO2

98% (large)
Oxygen icon with pulse animation
Normal range: >95%


BMI

24.5 (calculated from weight/height)
Category: Normal Weight (green)
Weight trend graph


Temperature

98.6°F
Thermometer icon
Trend line



Detailed Graph Section (bottom):

Large interactive chart (Chart.js/Recharts)
Multi-line graph with toggleable vital signs
Y-axis: Vital values
X-axis: Time
Legend with checkboxes to show/hide lines
Hover tooltip shows exact values
Zoom and pan controls

Manual Entry Modal:

Triggered by "Log New Reading" button
Form with all vital fields
Smart defaults (pre-fill last reading)
Timestamp (auto or manual)
Notes field (optional)
Submit button (green)

Wearable Sync Section:

"Connect Wearable" button
Supported devices: Fitbit, Apple Watch, Google Fit
Last sync timestamp
Sync status indicator


2.5 Mental Health Dashboard
Layout: Combined analytics + patient input review
Overview Cards (top row):

Average Mood Score (7-day): 6.8/10 (emoji: 🙂)
Stress Level: Medium (yellow badge)
Anxiety Score (GAD-7): 8/21 (Mild)
Sleep Quality: 6.5/10

Main Graph Section:

Dual Y-axis chart:

Left axis: Mood (1-10 scale, line graph, green)
Right axis: Anxiety/Stress (bar chart, yellow/orange)


X-axis: Date (last 30 days)
Correlation indicators (if dosage data available)

Sleep Patterns Card:

Heatmap calendar (last 30 days)
Color intensity: Hours slept (light green = few hours, dark green = 8+ hours)
Click date to see details

Patient Input Review Section:

List of mood logs with timestamps
Each log shows:

Date/time
Mood emoji + score
Stress/anxiety level
Optional notes from patient
Voice note player (if submitted)


Filter by date range
Export to PDF for therapy notes

Therapy Notes Section:

Rich text editor
Template library (dropdown): Initial Assessment, Progress Note, Session Summary
Auto-save drafts
Session date/time picker
Tags: Goals, Interventions, Homework
Save button


2.6 Digital Prescriptions Page
Layout: Creation wizard + prescription library
Left Panel: Prescription Templates (300px)

Search templates
Common prescriptions (cards):

Diabetes Management
Hypertension Control
Anxiety/Depression
Custom (blank)


Click to load template

Right Panel: Prescription Builder
Patient Selection:

Autocomplete search field
Selected patient card (avatar, name, ID, allergies in RED)

Medication Table:

Add Medication button (top-right, green)
Table columns:

Drug Name (autocomplete from drug database)
Dosage (text + unit dropdown: mg/ml/tabs)
Frequency (dropdown: Once/Twice/Thrice daily, etc.)
Duration (number + unit: days/weeks/months)
Instructions (text: "Take with food", etc.)
Remove (trash icon)


Add row dynamically

Additional Fields:

Diagnosis (text area)
Doctor's Notes (text area)
Valid Until (date picker, default: 30 days)
Follow-up Date (date picker)

Preview Section:

Live preview of prescription PDF
Letterhead with clinic logo
Doctor's name, registration number
Patient details
Medication table
QR code (bottom-right) linking to digital copy
Doctor's digital signature

Action Buttons:

Save as Draft (outlined)
Generate & Send (green, solid)

Triggers: PDF generation, email to patient, push notification



Prescription History:

Below builder, table of past prescriptions
Columns: Date, Patient, Medications Count, Status (Active/Expired)
Actions: View, Duplicate, Revoke


2.7 Appointment Calendar Page
Layout: Full calendar view with sidebar
Calendar Header:

View toggles: Day | Week | Month
Date navigator: ← Today →
"New Appointment" button (green)

Calendar Grid:

Week view (default):

Time slots (Y-axis, 9 AM - 6 PM)
Days (X-axis, Mon-Sat)
Appointment blocks:

Patient name (bold)
Type badge (Consultation/Follow-up/Therapy)
Time duration
Color-coded by status: Scheduled (blue), Confirmed (green), Completed (gray), Cancelled (red)
Click to view/edit





Drag-and-Drop:

Drag appointments to reschedule
Visual feedback (shadow, dashed outline)
Conflict detection (red highlight if overlap)

Sidebar Panel (right, 320px):

Today's Summary:

Total appointments: 8
Completed: 3
Upcoming: 5
No-shows: 0


Upcoming Appointments List (next 7 days):

Cards with patient, time, type
Quick actions: Join, Reschedule, Cancel



New/Edit Appointment Modal:

Patient selector (autocomplete)
Appointment type (radio buttons with icons)
Date picker (calendar)
Time picker (dropdown or time input)
Duration (dropdown: 15/30/45/60 mins)
Recurring (checkbox):

Frequency: Daily/Weekly/Monthly
End date


Notes (text area)
Reminder settings:

24 hours before (checkbox)
1 hour before (checkbox)
Email/SMS/Push (checkboxes)


Save button

No-Show Management:

Appointment cards have "Mark as No-Show" option
No-show badge appears on patient profile
Admin can view no-show report


2.8 Alert System Page
Layout: Notification center with filtering
Header:

"Alerts & Notifications" title
Filter dropdowns: Severity (All/Critical/High/Medium), Type (Vitals/Mental/Medication), Status (Unread/Read/Archived)
Mark all as read button

Alert Cards (list view):

Critical alerts (top, red left border):

Severity icon (red alert-circle)
Patient name (bold, clickable to profile)
Alert type: "Hypertensive Crisis"
Metric: "BP: 180/110 mmHg"
Timestamp: "15 minutes ago"
Action buttons: Review Patient, Dismiss, Escalate


High priority (yellow border):

Similar structure
"Depression Risk - Mood <3 for 3 days"


Medium (blue border):

"Medication Missed - 2 doses skipped"



Alert Details Modal:

Full patient context
Alert history (timeline)
Related vitals/mental health data
Quick actions: Call Patient, Schedule Appointment, Update Treatment
Notes section (to record action taken)
Resolve button

Settings (gear icon):

Configure alert thresholds:

BP: >160/100 (critical), 140-160/90-100 (high)
Mood: <3 for 3 days (critical)
Medication: 2+ misses (high)


Notification preferences:

Email (toggle)
SMS (toggle)
Push (toggle)
In-app only (toggle)




2.9 Document Access & Management
Layout: File explorer with preview panel
Left Sidebar: Folder Tree (250px)

Folders by category:

📁 Lab Reports
📁 X-Rays & Scans
📁 Prescriptions
📁 Therapy Notes
📁 Discharge Summaries
📁 Patient Uploads (photos/videos)


Each folder shows count badge

Toolbar:

Upload button (drag-and-drop zone, dashed border)
Search documents
Filter: Date range, Patient, Type
Sort: Name, Date, Type
View toggle: Grid | List

Main Area: Document Grid/List
Grid View:

Document cards (200px width):

File type icon/thumbnail (PDF/image preview)
File name (truncated)
Upload date
Uploaded by (doctor/patient/lab)
Tags (if any)
Actions menu (3 dots): View, Download, Share, Delete



List View:

Table: Name, Type, Size, Uploaded By, Date, Tags, Actions

Preview Panel (right, 400px, collapsible):

Large preview (PDF viewer for PDFs, image viewer for images)
Document metadata:

Patient name
Upload date/time
Uploaded by
Category
Tags (editable)
Version history
Access logs (who viewed, when)


Actions:

Download (icon)
Print (icon)
Share (modal with email/link)
Delete (icon, confirmation)



Upload Modal:

Drag-and-drop zone (large, dashed border, green on hover)
"Browse Files" button
Multi-file upload support
Fields:

Patient (autocomplete)
Category (dropdown)
Tags (tag input)
Description (text area)


OCR checkbox: "Extract text from document"
Upload button (shows progress bar)

OCR Results:

Extracted text displayed in modal
Copy to clipboard button
Save to patient notes option

Sharing Modal:

Share via email (input emails, comma-separated)
Generate shareable link (toggle expiry date)
Set permissions: View only | Download allowed
Copy link button


2.10 Progress Graphs & Analytics
Layout: Dashboard with multiple visualization types
Filter Panel (top):

Patient selector (for individual view)
Date range: Last 7 days | 30 days | 90 days | Custom
Metrics selector (multi-select): BP, Sugar, Mood, Anxiety, Sleep, Weight
Comparison toggle: Compare with previous period

Visualization Grid:
Card 1: Physical Health Trends (line graph)

Multi-line chart (Chart.js/Recharts)
Lines: BP (systolic/diastolic), Blood Sugar, Heart Rate
Toggle legend to show/hide metrics
Reference zones (normal/high/critical shaded areas)

Card 2: Mental Health Overview (combo chart)

Dual Y-axis:

Line: Mood (1-10 scale, green)
Bars: Anxiety score (GAD-7, yellow)


Correlation annotation (if medication data available)

Card 3: Sleep & Stress Heatmap

Calendar heatmap (30 days)
Color intensity: Sleep hours (green) vs Stress level (orange)
Click cell for daily details

Card 4: Medication Adherence (bar chart)

Y-axis: Adherence % (0-100%)
X-axis: Weeks
Color: Green (>80%), Yellow (50-80%), Red (<50%)
Target line at 80%

Card 5: Disease-Specific Tracking

Dynamic based on patient condition:

Diabetes: HbA1c trend, avg blood sugar, hypo/hyper events
Hypertension: BP control days (%), avg BP, crisis events


Custom metrics for condition

Card 6: Comparative Analysis (scatter plot)

X-axis: Vitals (e.g., BP)
Y-axis: Mental health (e.g., mood)
Scatter points: Daily readings
Trendline (regression)
Identify correlations

Export Options:

Download as PDF report
Export data as CSV
Share with patient (email)


2.11 Teleconsultation Interface
Layout: Video call UI with patient context sidebar
Pre-Call Lobby:

Waiting room with:

Preview of own camera (test video/audio)
Device settings: Camera, Microphone, Speaker dropdowns
"Join Consultation" button (green, large)
Appointment details card (patient, time, type)



Active Call Interface:
Main Video Area (70%):

Large patient video feed (primary)
Small self-view (bottom-right corner, draggable)
Connection quality indicator (top-right: green/yellow/red dot)
Call timer (top-left)

Control Bar (bottom, overlay):

Microphone toggle (mute/unmute)
Camera toggle (on/off)
Screen share button
Record button (with consent indicator)
Chat button (opens sidebar)
End call button (red, prominent)

Sidebar Panel (right, 30%, collapsible):
Tabs: Patient Info | Chat | Notes
Patient Info Tab:

Avatar + name
Quick stats: Age, condition, last visit
Current vitals (latest readings):

BP, Sugar, Heart Rate (compact cards)


Alerts (if any, red badges)
Quick access: View full profile (link)

Chat Tab:

Text chat messages (doctor-patient)
Input field at bottom
Send files/images
Auto-save transcript

Notes Tab:

Consultation notes editor (rich text)
Quick note templates:

Chief Complaint
Diagnosis
Treatment Plan
Follow-up


Auto-save
"Finalize & Send to Patient" button

Screen Share Mode:

Patient video minimized to corner
Shared screen (full area)
Annotation tools: Pen, highlighter, text
Pointer to highlight areas

Recording:

Consent modal before starting
Recording indicator (red dot, visible to all)
Auto-transcription (if enabled)
Save to Documents after call

Post-Call Summary:

Call duration
Notes preview
Action items: Prescription sent, Follow-up scheduled
Rating prompt (optional feedback)


2.12 Treatment Plans Management
Layout: Plan builder with timeline view
Header:

"Create Treatment Plan" button (green)
Search/filter existing plans

Treatment Plan List (left panel, 350px):

Cards showing:

Patient name + avatar
Plan name: "Diabetes Management - 3 Months"
Start date - End date
Status badge: Active, Completed, Paused
Progress bar (% complete based on adherence)
Click to view/edit



Plan Builder/Editor (right panel):
Header Section:

Patient selector
Plan name (text input)
Condition (dropdown: Diabetes, Hypertension, Depression, etc.)
Duration (start date - end date)

Medications Section:

"Add Medication" button
Table of linked medications:

Drug name
Dosage
Frequency
Linked condition (tag)
Side effects monitoring (checkbox + notes)
Adjustment rules (if mood >8, reduce anxiety med)
Remove button



Trackers Integration:

Checkboxes to link:

Physical vitals: BP, Sugar, Weight
Mental health: Mood, Anxiety, Sleep


Threshold alerts (configure per metric)

Goals & Milestones:

Add goal button
Goals list:

Description: "Reduce HbA1c to <7%"
Target date
Progress indicator
Status: On track/At risk/Achieved



Lifestyle Recommendations:

Diet plan (text area or file upload)
Exercise plan (text area)
Wellness exercises (from library, checkboxes)

Monitoring Schedule:

Weekly check-in reminders
Follow-up appointments (auto-schedule)
Lab tests (reminder dates)

Adherence Tracking (view mode):

Visual streak calendar (green for adherent days)
Adherence % (weekly breakdown)
Missed doses list (dates, times)
Escalation section:

If 2+ consecutive misses, trigger alert
Action taken (notes)



Action Buttons:

Save as Draft
Activate Plan (sends to patient)
Pause Plan
Mark as Completed


2.13 Wellness Library
Layout: Content library with assignment system
Header:

"Wellness Resources" title
Search bar
Category filter: Meditation, Breathing, CBT, Journaling, Games (MindPlay)

Content Grid (cards):
Each wellness resource card:

Thumbnail image/icon
Type badge: Audio, Interactive, Worksheet, Game
Title: "4-7-8 Breathing Technique"
Duration/Length: "5 mins"
Difficulty: Beginner/Intermediate/Advanced
Description (short)
Preview button
Assign to Patient button (green)

Categories:
1. Guided Meditations:

Audio player embedded
Durations: 5/10/15 mins
Themes: Anxiety Relief, Sleep, Focus

2. Breathing Exercises:

Interactive visualization (animated lungs)
Instructions: "Inhale 4s, Hold 7s, Exhale 8s"
Timer display

3. CBT Worksheets:

PDF preview
Printable
Topics: Thought Records, Cognitive Distortions, Gratitude Journal

4. Journaling Prompts:

Text-based prompts
Sample questions displayed

5. MindPlay Games (for neurodiverse individuals):

4-5 mini games:

Memory Match (card matching)
Pattern Recognition (sequence puzzles)
Emotion Recognition (facial expression identification)
Attention Training (focus exercises)
Relaxation Puzzles (calming activities)


Each game card shows preview image

Assignment Modal:

Patient selector (multi-select for group assignment)
Schedule:

Frequency: Daily/Weekly
Duration: 1 week / 2 weeks / 1 month


Notes to patient (text area)
Reminder settings
Assign button

Tracking Dashboard:

Separate section showing assigned exercises
Table: Patient, Exercise, Assigned Date, Completion %, Last Completed
Adaptive recommendations (AI suggests next exercises based on completion/mood)

MindPlay Progress Dashboard:

Patient selector
Game-wise performance:

Game name
Times played
Average score
Improvement trend (↑↓)
Time spent


Overall engagement chart (days active)


2.14 Collaboration Hub
Layout: Community board with threads
Header:

"Clinical Collaboration" title
"New Post" button (green)
Search discussions

Filter/Sort Bar:

Categories: Case Studies, Best Practices, Research, Q&A
Sort: Recent, Most Liked, Most Commented
My Posts filter toggle

Discussion Feed:
Each post card:

Author avatar + name + specialty
Post title (bold, clickable)
Category badge
Preview text (truncated)
Metadata: Posted time, Views, Comments, Likes
Tags: #diabetes #newtreatment
Upvote button (green arrow, count)

Post Detail View (modal or new page):

Full post content (rich text with images)
Author info (left sidebar):

Avatar, name, specialty, institution
Follow button


Engagement buttons: Like, Save, Share
Comments section:

Nested replies
Rich text editor for new comment
Mention other doctors (@Dr. Smith)


Related posts (sidebar)

Create Post Modal:

Title (text input)
Category (dropdown)

Content (rich text editor):

Continue12:09Formatting: Bold, Italic, Lists

Attach files/images
Code snippets (for data/scripts)
Tags (tag input)
Visibility: All doctors | Specific specialty
Post button

Moderation (if admin):

Flag inappropriate posts
Pin important discussions
Archive old threads


2.15 Timeline & Patient Notes
Layout: Chronological event feed with filtering
Header:

Patient selector
Date range filter
Event type filter: All | Visits | Vitals | Prescriptions | Documents | Notes

Timeline View (vertical):
Visual Design:

Central vertical line (green)
Event nodes on alternating sides
Date markers (left margin)

Event Cards:
1. Visit Event:

Icon: 🏥 (left of timeline)
Date/time (bold)
Type: In-person / Teleconsultation
Doctor: Dr. Smith
Diagnosis
Notes preview
Click to expand full notes

2. Vitals Logged:

Icon: 📊
Vital type: Blood Pressure
Value: 130/85 mmHg (with status color)
Logged by: Patient (self-reported) / Doctor / Nurse

3. Prescription Issued:

Icon: 💊
Medication names (list)
Prescribing doctor
Click to view full prescription

4. Document Uploaded:

Icon: 📄
Document type: Lab Report
File name
Uploaded by
Quick preview/download

5. Mental Health Log:

Icon: 🧠
Mood: 7/10 😊
Stress: Medium
Notes from patient

6. Alert Triggered:

Icon: ⚠️ (red)
Alert type
Metric value
Action taken

Expanded Event View:

Full details in modal
Related events (linked)
Edit notes (if doctor)
Add follow-up note

Therapy Notes Section (separate tab):

Rich text editor
Session date/time
Progress sliders:

Symptom severity (1-10)
Treatment response (1-10)
Patient engagement (1-10)


Homework assignments
Next session goals
Save button

Patient Self-Reports Review:

Filter: Mood logs | Anxiety surveys | Symptom reports | Photo/video uploads
Cards showing:

Report type
Timestamp
Content preview
View full button


For photo/video uploads:

Thumbnail grid
Click to view full media
Add annotation/notes
Approve/flag (if AI verification enabled)



High-Risk Patient Identification:

Risk score calculation (AI-based):

Factors: Missed appointments, low adherence, critical vitals, mood deterioration


Risk badge: Low (green) | Medium (yellow) | High (red)
Risk history graph
Intervention suggestions


3. PATIENT MOBILE APP INTERFACE
3.1 Patient App Home Screen
Layout: Dashboard with card-based navigation
Header (sticky):

App logo (top-left)
Notification bell (top-right, badge count)
Profile avatar (top-right)

Welcome Section:

"Hi, [Patient Name]!" (large, friendly)
Today's date
Motivational quote or health tip (rotating)

Quick Stats Row (horizontal scroll):

Today's Mood: 😊 7/10
Vitals Logged: ✅ BP, Sugar
Medications: 2/3 taken
Next Appointment: Tomorrow, 10 AM

Action Cards Grid (2 columns):

Log Vitals (green gradient):

Icon: heart rate
"Track your health"
Tap to open vitals logger


Log Mood (blue gradient):

Icon: emoji
"How are you feeling?"


Medications (purple gradient):

Icon: pill
"Today's meds"
Badge: 1 pending


Appointments (yellow gradient):

Icon: calendar
"Upcoming visits"


Documents (teal gradient):

Icon: folder
"My health records"


Wellness (pink gradient):

Icon: lotus
"Mindfulness exercises"


Chat (orange gradient):

Icon: message
"Talk to AI assistant"


Community (indigo gradient):

Icon: users
"Connect with others"



Bottom Navigation Bar (fixed):

Home (house icon, green when active)
Vitals (activity icon)
Medications (pill icon)
More (menu icon)


3.2 Vitals Logging Screen
Layout: Form with interactive inputs
Header:

Back button
"Log Your Vitals" title
Date/time display (editable)

Input Sections (vertical scroll):
1. Blood Pressure:

Two number inputs side-by-side:

Systolic (left, large, green border when focused)
Diastolic (right)
Unit: mmHg (non-editable)


Visual slider alternative (drag to set value)
Status indicator below: Normal / High / Critical (auto-calculated)

2. Blood Sugar:

Toggle: Fasting / Post-prandial
Number input with slider
Unit: mg/dL
Color-coded range guide below (green/yellow/red zones)

3. Heart Rate:

Number input
Animated heart icon (pulses at entered BPM)
Unit: bpm

4. Oxygen Level (SpO2):

Number input or slider (90-100%)
Lungs icon animation

5. Weight:

Number input
Unit toggle: kg / lbs
BMI auto-calculated and displayed

6. Temperature:

Number input
Unit toggle: °F / °C
Thermometer visualization

Additional Options (collapsible):

Add Photo (for wound/symptom progress)

Camera or gallery picker
Preview thumbnail


Voice Note (for symptoms)

Record button (red dot when recording)
Playback before submit


Text Notes

"How are you feeling?"
Text area (150 chars)



Submit Button (bottom, sticky):

Large green button: "Save Vitals"
Loading state: spinner + "Saving..."
Success: checkmark animation + "Vitals logged successfully!"


3.3 Mood Logging Screen
Layout: Interactive emoji-based interface
Header:

Back button
"How are you feeling today?" (large, friendly)
Date (editable)

Mood Selection:

Large emoji selector (horizontal scroll or grid):

😊 Happy
😐 Neutral
😢 Sad
😰 Anxious
😤 Stressed
😴 Tired
😡 Angry


Selected emoji: enlarged, subtle bounce animation

Mood Intensity:

"How strong is this feeling?" (subtitle)
Visual slider (1-10):

1-3: Light green (mild)
4-7: Yellow (moderate)
8-10: Red (intense)


Number display at slider thumb

Stress Level:

"Stress Level" (subtitle)
Three buttons (toggle selection):

Low (green, mountain icon)
Medium (yellow, hill icon)
High (red, volcano icon)



Anxiety Assessment (optional, expandable):

"Quick Anxiety Check" (5 questions)
GAD-7 style questions:

"Feeling nervous or on edge?"
"Can't stop worrying?"
etc.


Answer scale: Not at all | Several days | More than half | Nearly every day
Score auto-calculated: Minimal / Mild / Moderate / Severe

Sleep Quality (collapsible):

"How did you sleep last night?"
Star rating (1-5 stars, tap to rate)
Hours slept (number input with moon icon)
Sleep quality: Poor / Fair / Good / Excellent

Notes:

"Anything on your mind?" (text area)
Placeholder: "Optional - share what's affecting your mood"
Character count (0/300)

Submit Button:

"Save My Mood" (large, blue button)
Encouraging message after: "Great job tracking your mental health! 🌟"


3.4 Medication Tracker Screen
Layout: List view with reminder settings
Header:

"My Medications" title
Filter: Today | This Week | All
Add Medication button (if allowed)

Today's Medications (cards):
Each medication card:

Pill icon (left, color-coded by type)
Medication name (bold)
Dosage: "10 mg"
Timing: "8:00 AM"
Instructions: "Take with food"
Status indicator:

Pending: Empty circle (gray outline)
Taken: Green checkmark in circle
Missed: Red X


Action buttons:

"Mark as Taken" (green, if pending)
"Snooze Reminder" (clock icon, 15/30/60 mins)
"Skip Dose" (with reason dropdown)



Pill Scan Feature (camera icon on card):

Opens camera
Scan pill to confirm (image recognition)
Auto-mark as taken after successful scan
Success: "Medication confirmed! ✓"

Medication History (expandable):

Calendar view (last 30 days)
Color-coded dots: Green (taken), Red (missed), Gray (skipped)
Adherence % displayed
Streak counter: "7 days in a row! 🔥"

Reminder Settings (per medication):

Time picker
Frequency: Daily / Twice / Thrice / Custom
Custom schedule builder (days of week, times)
Reminder sound (dropdown)
Snooze options
Notification toggle

Add Medication Modal (if patient can add):

Medication name (text input or barcode scan)
Dosage
Frequency
Start date - End date
Reminder time
Save button


3.5 Appointments Screen
Layout: Calendar and list view
Header:

"My Appointments" title
Toggle view: Calendar | List
"Request Appointment" button (if enabled)

Calendar View:

Month calendar
Dates with appointments: green dot
Tap date to see appointment details
Today highlighted with circle

List View:
Upcoming Appointments (cards):

Date & time (large, left)
Doctor avatar + name
Specialty
Appointment type badge: Consultation / Follow-up / Therapy
Location: Clinic address / "Virtual" (video icon)
Action buttons:

Join (if virtual, shows 10 mins before)
Reschedule
Cancel (with confirmation)


Reminder toggle (24h/1h before)

Past Appointments:

Collapsed by default ("View History" toggle)
Same card layout, grayed out
View summary notes (if shared by doctor)

Appointment Details Modal:

Full appointment info
Add to device calendar (export)
Directions to clinic (map integration)
Call clinic (phone integration)

Request Appointment (if enabled):

Preferred doctor (dropdown)
Appointment type (radio buttons)
Preferred dates (multi-select calendar)
Preferred times (checkboxes: Morning/Afternoon/Evening)
Reason for visit (text area)
Submit request (goes to doctor for approval)


3.6 Documents & Reports Screen
Layout: File browser with preview
Header:

"My Health Records" title
Search bar
Filter: Type, Date

Categories (tabs):

All
Lab Reports
Prescriptions
Scans (X-ray, MRI)
My Uploads

Document List (cards):
Each document card:

File type icon (PDF/image)
Thumbnail preview (if image)
Document name
Date uploaded
Uploaded by: Dr. Smith / Self
File size
Download icon (tap to save)
Share icon (email/messaging)

Upload Section:

"Upload Document" button (green)
Photo/video capture for symptom logs:

"Wound Progress" category
"Symptom Photos" category
Camera or gallery picker
Add description before upload
Auto-uploaded to doctor's vault



Document Viewer:

Full-screen PDF viewer (for PDFs)
Zoom/pan for images
Share/download options (top-right)
Delete (if own upload)


3.7 Wellness Library Screen
Layout: Content browser with player/viewer
Header:

"Wellness Exercises" title
Filter: Assigned / All / Favorites

Assigned Exercises (top section):

"Recommended by Dr. [Name]" subtitle
Cards with:

Exercise thumbnail
Title
Type badge: Audio / Interactive / Worksheet
Duration
Progress: "2/7 days completed"
Start/Continue button



All Exercises (grid):
1. Guided Meditations:

Audio thumbnail
Duration: 5/10/15 mins
Theme: Anxiety Relief / Sleep / Focus
Play button

2. Breathing Exercises:

Thumbnail with lungs animation
Technique name: "4-7-8 Breathing"
Start button

3. CBT Worksheets:

PDF thumbnail
Download/view button

4. Journaling Prompts:

Text card with prompt preview
Open button

Audio Player (for meditations):

Full-screen with background gradient
Play/pause (large, center)
Progress bar with timestamp
10s rewind/forward buttons
Volume control
Background play (lock screen controls)
Favorites (heart icon)

Breathing Exercise Interface:

Full-screen with animated circle
Instructions: "Breathe in" (circle expands)
Hold (circle static)
Breathe out (circle contracts)
Timer display
Calming background (animated gradient)

Completion Tracking:

After exercise, prompt: "How do you feel?"
Star rating (1-5)
Notes (optional)
Mark complete (checkmark animation)

Offline Downloads:

Download icon on each exercise
"Available offline" badge when downloaded
Manage storage in settings


3.8 AI Chatbot Screen
Layout: Chat interface with calming design
Header:

Back button
"Wellness Assistant" title
Info icon (explains chatbot purpose)

Chat Area:

Messages (bubbles):

Bot messages: Left-aligned, light green bubbles
User messages: Right-aligned, dark green bubbles


Avatar for bot (lotus icon)
Timestamp (subtle, small)

Input Area (bottom):

Text input: "Share how you're feeling..."
Send button (green arrow)
Voice input button (microphone icon)

Chatbot Capabilities:
Mood Check-in:

Bot: "How are you feeling today?"
User: "I'm stressed"
Bot: "I'm sorry you're feeling stressed. On a scale of 1-10, how intense is it?"
User: "8"
Bot: [Generates calming response]

Breathing Exercise Suggestion:

Bot: "Let me guide you through a breathing exercise. Tap below to start."
Start button (launches breathing interface)

Relaxation Messages:

Bot: "Remember, this feeling is temporary. You're stronger than you think. 🌱"
Positive affirmations
Mindfulness tips

Coping Tips:

Bot: "Here are some ways to manage stress:"

List of techniques (bulleted)
Links to wellness exercises



Quick Actions (suggestion chips):

"I'm anxious"
"I need to relax"
"Help me sleep"
"I'm feeling low"
Tap chip to send message

Disclaimers:

Top of chat: "This is an AI assistant for support. For urgent help, contact your doctor."
Emergency button (red): "I need immediate help" → shows crisis hotline


3.9 Health Quiz Screen
Layout: Interactive quiz with gamification
Header:

"Health Knowledge Quiz" title
Topic badge: Medications / Treatment / General Health
Score: "Best Score: 8/10"

Quiz Card:

Question number: "Question 3 of 10"
Progress bar (30% filled, green)
Question text (large): "When should you take antibiotics?"
Answer options (cards):

Option A (radio button)
Option B
Option C
Option D


Submit Answer button (green)

Feedback:

Correct: Green checkmark, "Correct! 🎉" + explanation
Incorrect: Red X, "Not quite. Here's why:" + explanation + correct answer
Next Question button

Quiz Completion:

Score card: "You scored 7/10! 🌟"
Visual gauge (0-10 scale)
Achievements unlocked (if any):

"Medication Master!" badge


Leaderboard (optional): "Top 10% of learners!"
Retry quiz button
Share score (social)

Quiz Library:

Browse available quizzes (grid)
Filter by topic
Difficulty level: Easy / Medium / Hard
Estimated time
Start Quiz button


3.10 Community Screen
Layout: Moderated forum with threads
Header:

"Patient Community" title
Search discussions
New Post button (if allowed)

Filter Bar:

My Condition (auto-filter)
All Topics
Popular
Recent

Discussion Feed (cards):
Each post:

Anonymous avatar (or initials)
Post title
Preview text (truncated)
Tags: #diabetes #support
Posted time: "2 hours ago"
Engagement: Likes, Comments
Moderation badge: "Verified by moderator"

Post Detail View:

Full post content
Author (anonymous or username)
Likes/comments
Comment section:

Nested replies
Add comment input
Respectful tone reminder


Report/flag button (abuse)

Create Post Modal:

Title
Content (text area)

Character limit: 500


Select condition tag
Anonymous toggle
Post button

Moderation:

All posts reviewed before going live
Community guidelines link
Report feature for inappropriate content


3.11 Profile & Settings Screen
Layout: Account management
Profile Section:

Large avatar (editable)
Name
Age, Gender
Patient ID
Edit Profile button

Settings Menu (list):
1. Personal Information:

Edit demographics
Emergency contact

2. Health Information:

Allergies
Chronic conditions
Blood group

3. Notifications:

Push notifications (toggle)
Email notifications (toggle)
SMS notifications (toggle)
Notification times (quiet hours)

4. Reminders:

Medication reminders (manage)
Appointment reminders (manage)
Vitals tracking reminders (daily prompt)

5. Privacy & Security:

Change password
Biometric login (toggle): Face ID / Fingerprint
Data sharing preferences

6. Connected Devices:

Wearables: Fitbit, Apple Watch, Google Fit
Connect/disconnect buttons
Last sync time

7. Language & Region:

Language selector
Time zone

8. Help & Support:

FAQs
Contact support
Tutorial videos

9. About:

App version
Terms of service
Privacy policy

10. Logout:

Logout button (red, confirmation modal)


4. CARETAKER MOBILE APP
4.1 Caretaker Dashboard
Layout: Similar to patient app with multi-patient support
Header:

"Caring for" dropdown (select patient)
Notification bell
Profile avatar

Patient Selector:

If multiple patients:

Cards with patient name, avatar, condition
Tap to switch context
Add patient button (enter patient ID)



Quick Overview (for selected patient):

Today's Vitals: Last logged
Medications: 2/3 taken (tap to see details)
Next Appointment: Tomorrow 10 AM
Recent Alerts: 1 new (red badge)

Action Cards:

Same as patient app but focused on:

View Medications (read-only with adherence tracking)
View Appointments (notifications enabled)
View Health Reports
Contact Doctor (quick call/message)



Notifications Section:

Medication reminders (for patient)
Appointment reminders
Adherence alerts: "John missed 2 doses today"
Critical health alerts (from doctor)

Caretaker-Specific Features:

Log vitals on behalf of patient (if allowed)
Add notes: "Patient reported headache today"
View doctor's updates


5. ADMIN WEB INTERFACE
5.1 Admin Dashboard
Layout: Comprehensive oversight panel
Sidebar Navigation (similar to doctor):

Dashboard
Users Management (Doctors, Patients, Nurses, Lab, Admin)
Appointments Overview
Alerts & Escalations
Analytics & Reports
System Settings
Logs & Audit

Main Dashboard:
Stats Row (5 cards):

Total Patients: 2,547
Active Doctors: 25
Today's Appointments: 134
Critical Alerts: 8 (red)
System Health: 99.2% uptime (green)

Charts Section:

Patient registrations (line graph, last 30 days)
Appointment volumes (bar chart, by day)
Alert distribution (pie chart: Critical/High/Medium)
Doctor workload (bar chart: appointments per doctor)

Recent Activity Feed:

New patient registrations
Doctor logins
Alert escalations
System events

Quick Actions:

Add User (doctor/nurse/lab)
Generate Report
View All Alerts
System Settings


5.2 Users Management
Layout: Tabbed interface for each user role
Tabs: Doctors | Patients | Nurses | Lab Reporters | Admins
Doctor Management Tab:
Toolbar:

Add Doctor button (green)
Search doctors
Filter: Specialty, Status (Active/Inactive)
Export list (CSV)

Table:

Columns: Name, Specialty, Email, Phone, Patients Assigned, Status, Actions
Actions dropdown: Edit, Deactivate, View Profile, Reset Password

Add/Edit Doctor Modal:

Full name
Email
Phone
Specialty (dropdown)
License number
Clinic/department
Assign patients (multi-select)
Status: Active/Inactive
Save button

Similar structure for other roles:

Nurses: Department, shift
Lab Reporters: Lab name, specialization
Admins: Permissions level


5.3 Appointments Overview
Layout: Calendar with administrative controls
Multi-Doctor Calendar:

View all doctors' schedules
Filter by doctor (multi-select)
Color-coded by doctor

No-Show Management:

Table of no-shows (last 30 days)
Columns: Patient, Doctor, Appointment Date, Status
Actions: Contact Patient, Reschedule, Mark Resolved

Appointment Analytics:

No-show rate (%)
Cancellation rate (%)
Average appointment duration
Peak hours heatmap


5.4 Alerts & Escalations
Layout: Alert management center
Critical Alerts Dashboard:

All unresolved critical alerts (from doctors)
Sort by: Time, Severity, Patient
Assign to doctor (if unassigned)
Escalate to specialist
Add admin notes
Mark as resolved

Escalation Workflow:

Trigger: Alert unresolved for 2+ hours
Automated escalation to senior doctor
Email/SMS notification
Tracking timeline


5.5 Analytics & Reports
Layout: BI dashboard with export options
Report Types:

Patient Demographics
Appointment Statistics
Medication Adherence
Alert Trends
Doctor Performance
System Usage

Filters:

Date range
Doctor/patient/condition
Report format: PDF/CSV/Excel

Visualizations:

Interactive charts (Chart.js/Recharts)
Drill-down capability
Export charts as images


6. NURSE WEB INTERFACE
6.1 Nurse Dashboard
Layout: Simplified clinical interface
Sidebar (similar to doctor but limited):

Dashboard
Patients (view-only)
Vitals Entry
Documents
Collaboration

Main Dashboard:
Today's Patients (assigned):

Cards with patient name, room number, condition
Quick actions: Log Vitals, View Profile

Vitals Entry Section:

Patient selector
Quick vitals form (similar to doctor's but nurse-focused):

BP, HR, SpO2, Temp, Weight
Time of measurement
Notes
Submit button



Document Access:

View lab reports, scans
Upload lab reports (if lab role)
Cannot delete documents (permission restricted)

Collaboration:

Same as doctor collaboration hub
Share clinical insights with peers


7. LAB REPORTER WEB INTERFACE
7.1 Lab Dashboard
Layout: Document upload focused
Main Dashboard:
Upload Lab Reports Section:

Patient search (autocomplete)
Report type (dropdown): Blood Test, X-Ray, MRI, etc.
File upload (drag-and-drop)
Report date
Notes
Submit button

Uploaded Reports List:

Table: Patient, Report Type, Upload Date, Status
Status: Pending Review / Reviewed by Doctor
Actions: View, Edit, Delete (before doctor review)

AI Verification (if enabled):

Photo/video uploads verified by AI
Real vs Fake indicator
Approval workflow before vault upload


8. CROSS-CUTTING FEATURES
8.1 Responsive Design Breakpoints

Mobile: <768px (patient/caretaker app)
Tablet: 768px-1024px (responsive web for doctors/nurses)
Desktop: >1024px (full web interface)

Mobile-First Approach:

Touch-friendly button sizes (min 44px)
Swipe gestures (e.g., swipe to delete)
Bottom navigation for easy thumb access


8.2 Accessibility Features

WCAG 2.1 AA compliance
Screen reader support (ARIA labels)
Keyboard navigation
High contrast mode toggle
Font size adjustment
Color-blind friendly palette


8.3 Loading States

Skeleton screens for data loading
Shimmer effects
Progress indicators for long operations
Optimistic UI updates (e.g., mark medication as taken immediately, sync in background)


8.4 Error Handling

Friendly error messages (no technical jargon)
Retry buttons
Offline mode indicators
Network status banner
Form validation (inline and on submit)


8.5 Empty States

Illustrations for empty lists
Call-to-action buttons
Helpful text: "No appointments scheduled. Click 'New Appointment' to get started."


9. DESIGN ASSETS & COMPONENTS
Reusable Components Library

Buttons: Primary, Secondary, Outlined, Text, Icon
Cards: Stat, Patient, Appointment, Document, Alert
Forms: Text input, Dropdown, Date picker, File upload, Rich text editor
Navigation: Sidebar, Bottom nav, Breadcrumbs, Tabs
Feedback: Toast notifications, Modal dialogs, Alert banners
Data Display: Tables, Charts, Timeline, Calendar, Progress bars
Media: Avatar, Image gallery, Video player, Audio player


10. ANIMATION & MICRO-INTERACTIONS
Subtle Animations

Button hover: Scale 1.02, shadow elevation
Card hover: Lift effect (shadow increase)
Page transitions: Fade in/out
Loading: Pulsing skeleton, spinner
Success: Checkmark animation (green circle expands)
Error: Shake animation on invalid input
Notifications: Slide in from top

Micro-Interactions

Medication taken: Pill icon bounces, confetti burst
Mood logged: Emoji grows, happy sound effect (optional)
Appointment scheduled: Calendar icon checkmark
Document uploaded: Progress circle fills, success tick