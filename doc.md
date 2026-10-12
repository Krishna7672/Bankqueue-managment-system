# State Bank of India — Smart Queue Management System (QMS)
## System Architecture & Process Flowcharts (`doc.md`)

This document provides visual flowcharts explaining the end-to-end working of the SBI Branch Queue Management System, the priority queue algorithm, the SWO officer counter lifecycle, the CMS grievance routing, and the role-based security separation.

---

## 1. Customer e-Token Generation Flowchart

This flowchart illustrates the 3-step self-service flow for a customer entering an SBI branch kiosk or visiting the portal on their smartphone.

```mermaid
flowchart TD
    Start([Customer Enters SBI Branch / Kiosk]) --> Step1[Step 1: Browse & Select Banking Service]
    
    subgraph ServiceCategories["SBI Service Catalog"]
        SC1[Cash & Remittance: C-XXX]
        SC2[Deposits & YONO Accounts: A-XXX]
        SC3[Debit Cards & Digital: D-XXX]
        SC4[Retail Loans Hub: L-XXX]
        SC5[Pension & Varishta Nagrik: V-XXX]
        SC6[CMS Customer Grievance: Q-XXX]
    end
    
    Step1 --> ServiceCategories
    ServiceCategories --> Step2[Step 2: Enter Basic Information]
    
    subgraph InputForm["Customer Details & Verification"]
        F1[Customer Full Name]
        F2[10-Digit Mobile Number]
        F3[Account Number - Optional]
        F4{Select Category}
        F5[Preferred Language]
    end
    
    Step2 --> InputForm
    F4 -->|General Citizen| CatGeneral[Standard Queue]
    F4 -->|Senior Citizen 60+| CatSenior[Priority Score: 2]
    F4 -->|Person with Disability| CatPwD[Priority Score: 3]
    
    CatGeneral --> TokenEngine[Sequential Token Generator Engine]
    CatSenior --> TokenEngine
    CatPwD --> TokenEngine
    
    subgraph AllocationEngine["Routing & Estimation"]
        TE1[Determine Prefix & Next Sequence e.g. A-024]
        TE2[Filter Compatible Available Counters]
        TE3[Count Customers Ahead in Matching Queue]
        TE4[Calculate Estimated Wait Time in Minutes]
    end
    
    TokenEngine --> AllocationEngine
    AllocationEngine --> Step3[Step 3: Issue Digital e-Token Slip]
    
    subgraph TokenCard["e-Token Pass / Parchi"]
        TC1[Display Token Number, Counter & Officer]
        TC2[Print Physical Token Slip]
        TC3[Download Digital Text Receipt]
        TC4[Simulated SBI-INB SMS Alert]
        TC5[Simulated Verified WhatsApp Alert]
        TC6[Track on Live Lobby TV Board]
    end
    
    Step3 --> TokenCard
    TokenCard --> EndWaiting([Customer Waits in Lobby / Seating Area])
```

---

## 2. Priority-First Queue Sorting Algorithm

SBI provides dedicated fast-track attention to senior citizens (*Varishta Nagrik*) and persons with disabilities (*Divyangjan*). This flowchart illustrates how tokens are ranked when a counter officer clicks **Call Next Token**.

```mermaid
flowchart TD
    OfficerTrigger([SWO Officer Clicks 'Call Next Token']) --> MatchCounter[Filter Waiting Tokens Matching Counter's Services]
    
    MatchCounter --> CheckPool{Eligible Tokens Exist?}
    CheckPool -->|No| NotifyIdle[Alert: No customers waiting for this counter]
    
    CheckPool -->|Yes| ScoreLoop[Iterate Tokens and Calculate Priority Score]
    
    subgraph ScoringRules["Multi-Tier Priority Weighting"]
        Tier3["Tier 3: Person with Disability (PwD)<br/>Score = 3"]
        Tier2["Tier 2: Senior Citizen (60+)<br/>Score = 2"]
        Tier1["Tier 1: General Citizen<br/>Score = 1"]
    end
    
    ScoreLoop --> ScoringRules
    ScoringRules --> Sorter[Sort Candidates by Priority Score DESC]
    
    Sorter --> TieBreaker{Scores Equal?}
    TieBreaker -->|Yes| FIFOSort[Sort by CreatedAt Timestamp ASC<br/>First-In, First-Out]
    TieBreaker -->|No| HighestScore[Pick Highest Priority Token]
    
    FIFOSort --> PickToken[Select Target Token]
    HighestScore --> PickToken
    
    PickToken --> AnnounceToken[Trigger Loudspeaker Chime & Web Speech Call]
    AnnounceToken --> SetServingState[Update Counter to 'Busy' & Token to 'Serving']
    SetServingState --> ActiveDesk([Customer Approaches Counter])
```

---

## 3. SWO Officer Workstation Lifecycle State Machine

This flowchart demonstrates the complete operational lifecycle of a Single Window Operator (SWO) managing customers at a bank counter.

```mermaid
stateDiagram-v2
    [*] --> Idle: Counter Open / Ready
    
    Idle --> Calling: Officer clicks 'Call Next Token'
    Calling --> Serving: Customer Arrives (Timer Starts MM:SS)
    
    Serving --> Serving: Recall Token (Re-announce Chime)
    
    Serving --> Completed: Click 'Complete Service' with Remarks
    Completed --> Idle: Counter status set to 'Open' (Served count +1)
    
    Serving --> Transferred: Click 'Transfer Token'
    Transferred --> WaitingQueue: Target Counter/Service Reassigned
    Transferred --> Idle: Source Counter freed
    
    Serving --> Skipped: Click 'Skip Token' (Customer delayed)
    Skipped --> Idle: Counter freed
    
    Serving --> NoShow: Click 'Mark No-Show' (Unresponsive)
    NoShow --> Idle: Counter freed
    
    Idle --> Paused: Click 'Pause / Break' (Lunch / Tea break)
    Paused --> Idle: Click 'Resume Desk'
```

---

## 4. CMS Grievance Redressal Flowchart (Failed UPI / ATM Discrepancies)

Transactions requiring technical dispute redressal bypass standard queues and route directly to **Counter 06 (Grahak Mitra & Grievance Redressal Lead)**.

```mermaid
flowchart TD
    GrievanceCustomer([Customer Experiences Transaction Issue]) --> OpenCMS[Opens CMS Grievance Portal]
    
    subgraph IssueMatrix["Specialized Grievance Categories"]
        I1[Failed UPI / YONO Pay Reversal - High Urgency]
        I2[ATM Cash Not Dispensed - High Urgency]
        I3[Urgent Debit Card Compromise / Block - High Urgency]
        I4[Internet Banking / YONO Lockout - Medium Urgency]
        I5[CMS Formal Banking Dispute / Ombudsman - High Urgency]
        I6[Dormant Account Re-activation - Normal]
        I7[Deceased Depositor Settlement Claim - Normal]
    end
    
    OpenCMS --> IssueMatrix
    IssueMatrix --> CollectGrievance[Collect Account Number & Transaction Slip Notes]
    
    CollectGrievance --> PrefixQ[Generate Q-Series Token e.g. Q-011]
    PrefixQ --> DedicatedRouting[Route Exclusively to Counter 06]
    
    subgraph Counter06Action["Counter 06: Grahak Mitra Desk"]
        C6A[Review Core Banking Host Log / CBS]
        C6B[Execute Chargeback / Reversal Form]
        C6C[Issue Physical / Digital Acknowledgment]
    end
    
    DedicatedRouting --> Counter06Action
    Counter06Action --> Resolution([Complaint Resolved / Ticket Closed])
```

---

## 5. Role-Based Security & Separation Architecture

This flowchart illustrates the strict architectural boundary preventing public customers from accessing administrative controls or officer workstations.

```mermaid
flowchart TD
    UserTraffic([Incoming Web User]) --> RoleRouter{User Role?}
    
    %% Public Customer Path
    RoleRouter -->|General Public / Customer| PublicPortal[Public Customer Zone]
    
    subgraph PublicZone["Customer Accessible Views Only"]
        P1[1. Get e-Token Kiosk]
        P2[2. CMS Grievance Portal]
        P3[3. Lobby Live TV Status Display]
        P4[4. Digital Token Pass & SMS Preview]
    end
    
    PublicPortal --> PublicZone
    
    %% Official Staff Path
    RoleRouter -->|Bank Personnel| AuthGateway[Official Staff Login Gateway]
    
    subgraph AuthBarrier["Security Gatekeeper"]
        AG1{Credentials Provided?}
        AG2[Officer: Employee ID + 4-Digit PIN]
        AG3[Admin: Manager ID + Master Password]
    end
    
    AuthGateway --> AuthBarrier
    AG1 -->|Invalid / Unauthorized| AccessDenied[Access Denied / Return to Customer Portal]
    
    AG1 -->|Valid Officer| OfficerZone[Counter Workstation Zone]
    subgraph StaffZone["Officer Workstation Controls"]
        OZ1[Live Handling Timer]
        OZ2[Call Next / Recall Buttons]
        OZ3[Complete / Transfer / Skip / No-Show]
        OZ4[Specific Counter Queue View]
    end
    OfficerZone --> StaffZone
    
    AG1 -->|Valid Admin| AdminZone[Branch Operations Portal]
    subgraph ManagerZone["Branch Administration Controls"]
        AZ1[Real-Time KPIs & Hourly Traffic Chart]
        AZ2[Counter Service Re-assignment]
        AZ3[Officer Roster & Leaderboard]
        AZ4[Priority Rule Policy Toggles]
        AZ5[Export CSV / JSON Audit Log]
    end
    AdminZone --> ManagerZone
```

---

## 6. Real-Time Data & Cross-Tab Synchronization Flow

This flowchart shows how state mutations (e.g., token generation, officer calls) automatically sync across customer phones, branch kiosks, and lobby TV screens.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Kiosk
    participant Engine as Queue Context (React)
    participant Storage as LocalStorage & Storage Events
    actor Officer as Counter Officer (SWO)
    actor TV as Lobby TV Display Board
    actor Admin as Branch Manager Portal

    Customer->>Engine: Generate Token (e.g. A-024)
    Engine->>Storage: Persist Token Array & Update Audit Log
    Storage-->>Officer: Syncs Active Waiting Queue (Storage Event)
    Storage-->>TV: Syncs Upcoming Next Queue
    Storage-->>Admin: Updates Total Token KPI (+1)

    Officer->>Engine: Clicks 'Call Next Token'
    Engine->>Engine: Synthesizes Web Audio Melodic Chime
    Engine->>Engine: Synthesizes Web Speech Voice Announcement
    Engine->>Storage: Updates Token Status to 'Serving' & Counter to 'Busy'
    
    Storage-->>TV: Flashes Counter 03 with Green Beacon (Now Serving A-024)
    Storage-->>Customer: Digital Pass status updates to 'Now Serving'
    Storage-->>Admin: Updates 'Being Served' count

    Officer->>Engine: Clicks 'Complete Service'
    Engine->>Storage: Updates Token Status to 'Completed' & Counter to 'Open'
    Storage-->>TV: Moves A-024 to 'Recently Completed' list
    Storage-->>Admin: Updates 'Completed' count & recalculates Avg Handling Time
```

---
*State Bank of India — Smart Queue Management System (QMS) Architecture Manual 2026*
