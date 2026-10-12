# State Bank of India (भारतीय स्टेट बैंक) — Smart Branch e-Token & Queue Management System (QMS)
### Complete Architectural, Technical, and Operational Manual (SBI Grahak Mitra Portal)

---

## 1. Executive Summary & Overview

The **State Bank of India (SBI) Smart Branch e-Token & Queue Management System** is modeled directly on the design language, layout standards, and customer service workflows of the **official State Bank of India portals (`onlinesbi.sbi` and `sbi.co.in`)**, alongside SBI's historical **"State Bank No Queue"** and in-branch **Grahak Mitra QMS** implementations.

The system is designed to organize branch customer traffic, eliminate crowding at Single Window Operator (SWO) counters, provide priority assisted lanes for Senior Citizens (*Varishta Nagrik*) and Persons with Disabilities (*Divyangjan*), and route transactional grievances directly to the CMS (Customer Complaint Management System) desk.

---

## 2. Official SBI UI Reference & Design System

### 2.1 SBI Brand Color Palette
The color hierarchy adheres strictly to official State Bank of India brand guidelines:

| Brand Color | Hex Code | SBI Brand Usage & Rationale |
|---|---|---|
| **SBI Neon Navy / Deep Indigo** | `#292075` | Primary brand color used across headers, active tabs, buttons, and card borders. Conveys security, institutional longevity, and authority. |
| **SBI Vivid Cerulean / Keyhole Cyan** | `#00B5EF` | Official accent color of the SBI keyhole symbol. Used for live beacons, active pill badges, focus rings, and ticker tape highlights. |
| **SBI Deep Indigo Navy** | `#1A1450` | Primary dark backdrop for top utility bars, ticker announcements, and footer ribbons. |
| **SBI Cerulean Tint (Surface Light)** | `#E6F8FE` | Soft background fill for active token chips, prefix tags, and counter cards. |
| **SBI Accent Gold / Ochre** | `#F8A51D` / `#F59E0B` | Priority and alert highlights (CMS grievance desk, wait time counters, and security advisories). |
| **Emerald Green** | `#059669` / `#10B981` | "Now Serving" real-time counter pulse and completed transaction receipts. |

### 2.2 Typography & Font Layout
- **Primary Typeface:** **Inter / Modern Geometric Sans-Serif** (customized to replicate the sturdy, institutional aesthetic of SBI’s modernized digital identity designed by Design Stack).
- **Weight Hierarchy:**
  - *Black / Extra Bold (800/900):* Used for token numbers (e.g., `A-026`, `C-019`) and bank title headers for readability from a distance.
  - *Bold (700):* Used for counter numbers, service card titles, and action buttons.
  - *Medium / Regular (400/500):* Used for customer information and descriptions.
- **Bilingual Headings:** Reflecting official SBI public branch signage:
  - `भारतीय स्टेट बैंक / STATE BANK OF INDIA`
  - `टोकन पर्ची / DIGITAL e-TOKEN PASS`
  - `सेवारत काउंटर / NOW SERVING COUNTER`
  - `सुरक्षा प्रतिज्ञा / SBI SECURITY ADVISORY`

### 2.3 The SBI Keyhole Emblem
Incorporates the SVG implementation of the iconic SBI logo:
- The circular blue badge with the white central opening and vertical slit, symbolizing the security of a vault keyhole and the open doors of the bank welcoming the common citizen.

---

## 3. SBI Working Mechanism: Grahak Mitra & Counter Routing

The operational flow mirrors the multi-counter branch architecture of a high-footfall SBI branch:

```
┌────────────────────────────────────────────────────────────────────────┐
│             STATE BANK OF INDIA BRANCH QUEUE ECOSYSTEM                 │
│                  SBI Smart Branch Queue System                         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  GRAHAK MITRA    │      │  LOBBY TV BOARD  │      │ SWO / OFFICER    │
│  e-TOKEN KIOSK   │      │ (DISPLAYS 1-6)   │      │ COUNTER DESK     │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  INTELLIGENT ROUTING & ESCALATION                    │
│  • Single Window Operator (SWO)  • CMS Grievance Redressal (Counter 6)│
│  • Varishta Nagrik Fast-Track    • Dual-Tone Loudspeaker Chime & Voice│
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. High-Level System Architecture & Roles

```
┌────────────────────────────────────────────────────────────────────────┐
│               APEX NATIONAL BANK SMART QUEUE ECOSYSTEM                 │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ CUSTOMER PORTAL  │      │  TV STATUS BOARD │      │ STAFF / ADMIN    │
│  & SUPPORT DESK  │      │  (LOBBY KIOSK)   │      │    DASHBOARD     │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    CENTRALIZED QUEUE ENGINE                         │
│  • Token Generation (Prefix + Seq)  • Priority Queue Sorter          │
│  • Compatible Counter Allocator     • Web Audio & Voice Synthesizer  │
│  • State Persistence (Local/Sync)   • Full Audit Trail Logger        │
└──────────────────────────────────────────────────────────────────────┘
```

The system provides 3 primary user roles and 5 main operational views:

1. **Customer View:**
   - **Get Token Kiosk:** 3-step self-service flow to generate sequential queue token.
   - **Support Desk:** Specialized fast-track routing for payment failures, ATM errors, and fraud alerts.
   - **Digital Token Pass:** Boarding-pass styled ticket with print, download, and notification previews.

2. **Lobby TV Display View:**
   - **Live TV Status Board:** Fullscreen high-contrast display for lobby television screens with auto-ticker and loudspeaker calls.

3. **Bank Staff & Administration:**
   - **Officer Workstation:** Operational serving console with timer, call next, recall, complete, transfer, skip, and no-show controls.
   - **Admin Operations Portal:** Branch KPIs, hourly traffic charts, counter allocation, officer roster, and audit exports.

---

## 4. Comprehensive Feature Walkthrough

### 4.1 Step-by-Step Customer Token Flow

```
Step 1: Choose Service  ──►  Step 2: Enter Details  ──►  Step 3: Digital Token Pass
   (15 Categories)            (Name, Mobile, Priority)      (Print / Download / Alerts)
```

#### Step 1: Select Banking Service
The customer browses 15 primary banking services organized with category tabs:
- **Cash Deposit** (Prefix `C`, ~5m handling time)
- **Cash Withdrawal** (Prefix `C`, ~6m handling time)
- **Account Opening** (Prefix `A`, ~18m handling time)
- **Passbook Printing / Update** (Prefix `P`, ~4m handling time)
- **Cheque Deposit** (Prefix `C`, ~5m handling time)
- **Demand Draft (DD)** (Prefix `D`, ~10m handling time)
- **Fund Transfer / NEFT / RTGS** (Prefix `T`, ~8m handling time)
- **ATM / Debit Card Services** (Prefix `D`, ~9m handling time)
- **Internet / Mobile Banking Support** (Prefix `M`, ~12m handling time)
- **KYC Update** (Prefix `K`, ~10m handling time)
- **Loan Enquiry** (Prefix `L`, ~20m handling time)
- **Account Statement Request** (Prefix `S`, ~5m handling time)
- **Customer Complaints** (Prefix `Q`, ~15m handling time)
- **General Enquiry** (Prefix `G`, ~6m handling time)
- **Other Banking Services** (Prefix `O`, ~10m handling time)

Each card displays:
- Service icon & prefix letter
- Short description of the service
- Current waiting queue count
- Estimated turnaround time

#### Step 2: Customer Information & Priority Category Form
Collects only necessary queue management data:
- **Customer Full Name** *(Required)*
- **Mobile Number** *(Required, 10 digits validation)*
- **Account Number** *(Optional — explicitly marked as never needed for general inquiries or new accounts)*
- **Customer Category**:
  - `General Citizen`: Standard sequential queue processing.
  - `Senior Citizen (60+ Years)`: Automatically activates priority queue sorting and lowers estimated wait.
  - `Person with Disability (PwD)`: High-priority queue allocation and accessible counter matching.
- **Preferred Language**: English, Hindi, Spanish, French, Bengali, Marathi, Tamil, etc.
- **Short Remarks / Notes**: Optional notes passed directly to the serving officer.
- **Zero-Credential Security Notice**: Reassures the customer that Apex National Bank never requests PINs, passwords, OTPs, or CVVs.

#### Step 3: Digital Token Pass (Step 4 in User Flow)
Generates an official digital token pass containing:
- Bank Name and Branch ID (`Apex National Bank — Metro Central Branch #402`)
- Large Prominent Token Number (e.g., `A-024`)
- Assigned Counter Number (e.g., `Counter 03`)
- Serving Officer's Name and Photo/Role (e.g., `Mr. Rahul Patil - Relationship Manager`)
- Number of Customers Ahead in this service queue
- Calculated Estimated Waiting Time
- Live Status Badge (`Waiting`, `Now Serving`, `Completed`)
- Dynamic Reassignment Notice: *"Counter and officer assignment may be dynamically reassigned by bank administration to expedite queue flow."*

**Interactive Actions on Token Pass:**
- **Print Token:** Opens optimized print layout that prints only the clean token slip.
- **Download Token:** Generates a timestamped `.txt` formatted receipt slip.
- **Live Queue:** Direct jump to the lobby live board tracking this token.
- **Preview SMS Alert:** Interactive modal showing a simulated smartphone with incoming SMS from `APEX-BNK`.
- **Preview WhatsApp Alert:** Interactive modal displaying the official WhatsApp message with verified badge.
- **Cancel Token:** Cancels the token and releases counter queue position.

---

### 4.2 Dedicated Customer Support Queue

For urgent transaction complaints, a specialized **Support Desk** offers fast-track escalation for:
1. **Failed UPI / Digital Payment** (Urgency: High, ~10m)
2. **ATM Transaction Issue** (Urgency: High, ~10m)
3. **Debit / Credit Card Assistance** (Urgency: Medium, ~12m)
4. **Account Access Issue** (Urgency: Medium, ~8m)
5. **Incorrect Transaction / Complaint** (Urgency: High, ~15m)
6. **KYC or Account Details Update** (Urgency: Normal, ~10m)
7. **Other Banking Assistance** (Urgency: Normal, ~12m)

Support tokens automatically route to **Counter 06 (Customer Support Lead — Ms. Ananya Sen)** with priority resolution tags.

---

### 4.3 Lobby Live Queue Display (TV Board)

Designed for high-visibility TV lobby screens and customer smartphones:
- **Now Serving Counters Grid:** Displays all open counters with active tokens, green pulse beacons, officer names, and counter category.
- **Next In Line Queue Table:** Displays upcoming waiting tokens sorted by priority and issuance order.
- **Recently Completed List:** Transparent log of processed tokens.
- **TV Kiosk Fullscreen Mode:** Toggle for full-screen borderless kiosk layout.
- **Sound Chime & Voice Announcer:**
  - Melodic chime triggers automatically when an officer calls or recalls a token.
  - Browser voice reads: *"Attention please: Token A 024, please proceed to Counter 03, with officer Mr. Rahul Patil."*
  - Includes a manual **Test Voice Announcement** button.
- **Bottom Bank Ticker Tape:** Scrolling banner displaying operating hours, branch notices, and priority guidelines.

---

### 4.4 Staff Queue Management Dashboard (Officer Workstation)

Each bank officer has a dedicated workstation view:
- **Workstation Switcher:** Switch seamlessly between:
  - Counter 01: Ms. Priya Sharma (Head Teller - Cash & Quick Services)
  - Counter 02: Mr. Amit Roy (Senior Teller - Cash & Cheques)
  - Counter 03: Mr. Rahul Patil (Relationship Manager - Accounts & Deposits)
  - Counter 04: Ms. Sneha Verma (Digital Banking Officer - Cards & Mobile)
  - Counter 05: Mr. Michael Chen (Loans Specialist - Advisory)
  - Counter 06: Ms. Ananya Sen (Support Lead - Grievances & Priority)
- **Active Serving Panel:**
  - Displays customer name, masked mobile number (`+91 98*** 4210`), account number, language, and notes.
  - **Live Elapsed Timer (`MM:SS`):** Tracks exact time spent handling the current customer.
- **Officer Action Controls:**
  - `Call Next Token`: Runs priority queue algorithm to fetch the next eligible customer.
  - `Recall Token`: Re-triggers loudspeaker audio chime and voice announcement.
  - `Complete Service`: Concludes the transaction, records completion remarks, and increments served count.
  - `Transfer Token`: Modal to transfer customer to another counter or banking service without losing queue priority.
  - `Skip Token`: Temporarily skips customer who is not at the counter.
  - `Mark No-Show`: Logs customer as absent.
  - `Pause / Resume Desk`: Pauses counter for tea/lunch breaks.
- **Counter Queue List:** Shows all customers waiting specifically for services handled by this counter.
- **Live Activity Audit Trail:** Timestamped log of calls, transfers, and completions.

---

### 4.5 Admin Operations Portal & Analytics

The administrative portal empowers bank branch managers with operational control:
- **Real-Time KPIs:** Total tokens generated, currently waiting, currently serving, completed tickets, skipped/no-show, average wait time, and average service duration.
- **Hourly Traffic Trend Chart:** Visual bar chart tracking customer volume from 09:00 AM to 04:30 PM, identifying peak congestion periods.
- **Queue Volume by Category:** Percentage breakdown across Cash, Accounts, Cards, Loans, and Customer Support.
- **Counter Allocation & Status Grid:** Real-time visibility of all counters with open/busy/paused/closed states.
- **Officer Efficiency Leaderboard:** Real-time metrics showing total customers served and average handling time per officer.
- **Queue Priority Policy Toggles:**
  - Toggle Senior Citizen Priority on/off.
  - Toggle Disability (PwD) Priority on/off.
  - Loudspeaker sound chimes and voice announcement volume controls.
- **Data Export:**
  - **Export CSV:** Detailed table of all customer tokens, timestamps, and status for spreadsheet analysis.
  - **Export JSON Audit:** Machine-readable audit file for bank compliance.
- **Sub-Modules:**
  - `Counters & Officers`: Assign officers, re-assign supported services, and open/close counters.
  - `Service Configuration`: Adjust token prefix letters, average service durations, and active statuses.
  - `Audit & Reports`: Searchable, filterable history of every token created today.

---

## 5. Queue Algorithm & Priority Logic

### 5.1 Token Sequence Generation
Tokens are generated using the service prefix and a 3-digit padded sequential integer:
$$\text{Token Number} = \text{Prefix} + \text{"-"} + \text{Pad3}(\max(\text{Today's Sequence}) + 1)$$
*Example:* `A-024` $\rightarrow$ `A-025`.

### 5.2 Priority-First Queue Ranking
When an officer clicks **Call Next Token**, eligible tokens matching the counter's assigned services are evaluated using a multi-tier ranking formula:

$$\text{Priority Score}(T) = \begin{cases} 
3 & \text{if Category} = \text{"Person with Disability"} \\
2 & \text{if Category} = \text{"Senior Citizen"} \\
1 & \text{if Category} = \text{"General Citizen"}
\end{cases}$$

**Sorting Criteria:**
1. $\text{Priority Score}$ (Descending — Tier 3 $\rightarrow$ Tier 2 $\rightarrow$ Tier 1)
2. $\text{CreatedAt Timestamp}$ (Ascending — First-In, First-Out within the same priority tier)

This guarantees that elderly customers and persons with disabilities are promptly assisted without delaying standard FIFO queues unnecessarily.

### 5.3 Dynamic Waiting Time Calculation
$$\text{Estimated Wait (Mins)} = (\text{Customers Ahead} \times \text{Avg Service Mins}) + \text{Counter Factor}$$
For Senior Citizens and Persons with Disability:
$$\text{Estimated Wait} = \max(3, \text{Round}(\text{Estimated Wait} \times 0.5))$$

---

## 6. How to Run the Application Locally

### Prerequisites
- Node.js (v18 or higher recommended; works seamlessly on Node 20+)
- npm (v9 or higher)

### Installation & Launch Steps
```bash
# 1. Navigate to the project root directory
cd "c:\Users\kj901\Desktop\field project"

# 2. Install all dependencies
npm install

# 3. Start the Vite local development server
npm run dev

# 4. Open in browser
# Access http://localhost:3000/
```

### Production Build
```bash
# Build the production bundle
npm run build

# Preview the production bundle locally
npm run preview
```

---

## 7. User Guide: How to Test Each Feature

### For Customers:
1. Open the website at `http://localhost:3000/`.
2. Click **Get Token** in the top navigation.
3. Choose any service (e.g. *Account Opening* or *Cash Deposit*).
4. Enter customer name (`e.g. Sunita Sharma`), mobile number (`e.g. 9876543210`), and choose **Senior Citizen (60+)**.
5. Click **Generate Queue Token**.
6. View the **Digital Token Pass** with your assigned Counter and Officer.
7. Click **Print Token** to see the print layout, or **Download** to save a receipt.
8. Click **Preview SMS Alert** or **Preview WhatsApp Alert** to see realistic incoming notifications.

### For Bank Officers:
1. Click **Officer Workstation** in the top navigation.
2. Select your workstation from the dropdown (e.g. `Counter 03 - Mr. Rahul Patil`).
3. Notice the **Currently Serving Customer** panel and the active handling timer counting up in seconds.
4. Click **Recall Token** to hear the loudspeaker chime and voice announcement.
5. Click **Complete Service** with resolution remarks to finish the customer's request.
6. Click **Call Next Eligible Customer** to automatically call the next person in line.
7. Try the **Transfer Token** button to transfer a customer to another counter.

### For Lobby TV Display:
1. Click **Live TV Board** in the top navigation.
2. Observe the **Now Serving** cards with flashing green indicators.
3. Click **TV Kiosk Mode** for full-screen presentation.
4. Click **Test Voice Announcement** to verify speaker output.

### For Bank Administrators:
1. Click **Admin Portal** in the top navigation.
2. View real-time KPI metrics, the hourly traffic bar chart, and service volume distribution.
3. Click the **Counters & Officers** sub-tab to edit counter service assignments or toggle counter availability.
4. Click **Service Configuration** to modify token prefixes or estimated turnaround times.
5. Click **Audit & Reports** and click **Export CSV** to download a full operational report.
6. Click **Reset Demo** in the top header at any time to return the system to pristine sample data.

---

## 8. Real-World Backend & Cloud Integration Roadmap

To transition this frontend from a high-fidelity prototype to a national bank production deployment:
1. **Backend API:** Replace `localStorage` handlers with RESTful or GraphQL endpoints (`POST /api/tokens`, `POST /api/counters/call-next`).
2. **Database:** Deploy PostgreSQL with Row-Level Security (RLS) on Supabase or AWS RDS with atomic sequence generators (`SELECT nextval('token_seq') FOR UPDATE`).
3. **Real-Time WebSockets:** Replace local storage listeners with WebSocket rooms or Supabase Realtime channels (`supabase.channel('queue-updates')`).
4. **SMS & WhatsApp Gateway:** Connect the notification module to Twilio or WhatsApp Cloud API for actual customer SMS/WhatsApp delivery.
5. **Hardware Integration:** Connect thermal kiosk receipt printers (`ESC/POS` USB protocol) for physical ticket printing at branch entrances.

---

## 9. System Flowcharts & Visual Architecture

Comprehensive visual diagrams and flowcharts explaining the system's operational logic have been prepared in:
👉 **[`doc.md`](doc.md)**

### Flowcharts Available in `doc.md`:
1. **Customer e-Token Generation & Routing Flowchart**: Step-by-step from service catalog to token slip.
2. **Priority Queue Sorter Algorithm**: Multi-tier priority calculations for Senior Citizens and Persons with Disabilities.
3. **SWO Officer Workstation Lifecycle State Machine**: Idle $\rightarrow$ Calling $\rightarrow$ Serving $\rightarrow$ Completed / Transferred / Skipped / No-Show.
4. **CMS Grievance Redressal Flowchart**: High-urgency UPI & ATM complaint routing directly to Counter 06.
5. **Role-Based Security & Separation Architecture**: Strict boundary separating public customer views from protected staff & admin portals.
6. **Real-Time Cross-Tab Synchronization Sequence**: State mutations and storage event propagation.

---
*State Bank of India — Smart Queue Management System (QMS) Documentation Revision 3.1.0 (2026)*
