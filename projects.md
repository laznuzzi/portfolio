# sandbox
title: Design Sandbox
subtitle: Block
shortDescription: An AI-assisted code-prototyping tool and starter kit with components and templates for building on-brand interface with Square and Cash App design languages.
thumbnail: ./img/sandbox-thumb.png
hover: ./img/sandbox-hover.png
modal: ./img/sandbox-hover.png, ./img/vibe-code-1.mov
locked: true

**Role:** Developer, Designer
**Timeline:** Oct 2025 – Present

### Context
Teams were spending a large amount of time on setup rather than ideation. Designers and engineers repeatedly recreated brand, themes, and existing Square and Cash App surfaces from scratch, with no shared foundation to build from. This led to inconsistent experiments, duplicated effort, and slower iteration.

### Description
Built Square's Vibe Code Kit (passion project), a git package with built-in themes, tokens, components, and page templates that users could install and use with any IDE. 

Kit evolved into experimental tool for building AI-native interfaces in code using Square and Cash App design languages. Designed and developed new features, and focused on the intelligence layer of the tool, integrating ecosystem data and design system knowledge to seed LLM-driven workflows. Features include preconfigured branding and theming, reusable components and page templates, AI-assisted workflows, and context-aware generation grounded in Square's internal patterns—enabling faster, more intelligent iteration without production constraints.

### Tech Stack
Vibe code kit: Shadcn
Sandbox app: Tauri desktop app (Rust backend) with a React + TypeScript + Vite frontend, using TailwindCSS and custom Square and Cash App design systems built on shadcn/ui components.

---

# multi-ein
title: Multi-Merchant Accounts
subtitle: Square
shortDescription: Lightweight, IDE agnostic, ui-kit of Square design language with semantic tokens, components and starter page templates.
thumbnail: ./img/vibe-thumb.jpg
hover: ./img/vibe-code-hover.mov
modal: ./img/vibe-code-1.mov
locked: true

**Role:** Developer
**Timeline:** Sept – Oct 2025

### Context
Teams were spending a large amount of time on setup rather than ideation. Designers and engineers repeatedly recreated brand, themes, and existing Square and Cash App surfaces from scratch, with no shared foundation to build from. This led to inconsistent experiments, duplicated effort, and slower iteration.

### Description
Built Square's Vibe Code Kit (passion project), a git package with built-in themes, tokens, components, and page templates that users could install and use with any IDE. Leveraged shadCN as base and wrapped components.

---

# g2
title: Agentic Console POC
subtitle: Block
shortDescription: A role-adaptive console POC showcasing how agentic UIs can automate internal workflows for Sales and Support.
thumbnail: ./img/g2-thumb.png
hover: ./img/g2-hover.mp4
modal: ./img/g2-1.mp4, ./img/g2-2.png, ./img/g2-3.png, ./img/g2-4.mp4
locked: true

**Role:** Designer & Developer
**Timeline:** Jul 2025

### Context
As teams across Block explored AI-driven efficiency, internal roles like Customer Service, Sales, and Account Management continued to rely on fragmented tools and manual workflows—slowing down resolution times, duplicating effort, and making it harder to operate proactively. Despite growing interest in automation, there was no shared vision for what an intelligent, scalable solution could look like across functions.

### Description
Prototyped a live, role-adaptive console experience on top of G2's workflow and automation infrastructure. The proof of concept showcases how AI agents could surface relevant insights, suggest actions, and automate execution—shifting human effort from searching and decision-making to reviewing and approving. Designed modular experiences for CS, AM, and Sales, including flows like hardware case resolution, QBR prep, and lead vetting—highlighting how agentic UIs could reduce complexity, scale across roles, and drive alignment around what's possible.

---

# rdm
title: Remote Device Management
subtitle: Square
shortDescription: Centralized, remote device hub on Square Dashboard web and Point of Sale, for sellers to monitor and manage hardware fleets in real-time.
thumbnail: ./img/rdm-thumb.png
hover: ./img/rdm-hover.png
modal: ./img/rdm-1.mp4, ./img/rdm-2.mp4, ./img/rdm-3.png, ./img/rdm-4.mp4, ./img/rdm-5.png

**Role:** Design lead | Web + iOS
**Timeline:** Q2 2025 (4 Months)

### Context
For large-scale enterprise merchants—like SoFi or Chase Stadium—managing a fleet of 300+ point-of-sale devices was historically a manual, localized effort. Monitoring hardware or updating settings required physical access to each individual unit, leading to significant operational downtime and a reactive approach to hardware health.

### Description
Led the design of a centralized portal for managing and monitoring devices remotely. Conducted user research and co-defined strategy with Square hardware teams through multiple design sprints. This work involved building a unified visual framework for device types, status and proactive alerts, that function across on Dashboard web and all Square POS applications.

---

# design-system
title: GSK Design System
tags: box: Shipped in 2020
subtitle: GlaxoSmithKline
shortDescription: Global, enterprise design system including MWC LitElement components, starter pages, Sketch + Adobe XD UI kits and tutorials.
thumbnail: ./img/dsm-thumb.jpg
hover: ./img/dsm-hover.png
modal: ./img/dsm-1.mp4, ./img/dsm-2.jpg, ./img/dsm-3.png, ./img/dsm-4.png, ./img/dsm-5.jpg, ./img/dsm-6.jpg, ./img/dsm-7.mp4, ./img/dsm-8.mp4

**Role:** Lead designer, design engineer | Web
**Timeline:** 2020

### Context
At a global organization like GSK, digital product development was historically throttled by a decentralized approach to design and code. Without a common infrastructure, individual teams were rebuilding similar components from scratch, leading to fragmented user experiences and high technical debt.

### Description
Designed the GSK design system, serving as the primary bridge between Global Brand and engineering. Focused on the structural theming of Material UI to align with enterprise requirements and collaborated with partners at Google to refine the system's architecture. Designed and maintained the core UI kit and documentation, and spearheaded the launch strategy through global workshops and tutorials. 

### Tech Stack
Google Material MWC LitElement web components. Vue, React, Angular and Vanilla JS starters. Sass mixins and CSS Custom Properties. 

---

# automation-portal
title: Bot Developer Portal
subtitle: GlaxoSmithKline
shortDescription: Self-service bot promotion engine that replaces manual audit gates with codified compliance rules.
thumbnail: ./img/rpa-thumb.jpg
hover: ./img/rpa-hover.png
modal: ./img/rpa-1.jpg, ./img/rpa-2.mp4, ./img/rpa-3.mp4, ./img/rpa-4.mp4, ./img/rpa-5.mp4, ./img/rpa-6.mp4, ./img/rpa-7.jpg, ./img/rpa-8.mp4

**Role:** Design lead
**Timeline:** Q1 2026 (2 Months)

### Context
Fragmented deployment and strict regulatory requirements (SOX, GxP) slowed the automation workforce at GSK. Moving an RPA bot to production required four separate platforms and extensive manual checklists, creating a 13-day lead time per promotion and diverting technical leads to time-consuming manual support roles.

### Description
Designed a centralized console to automate the promotion and governance of RPA bots. Replaced a manual, 13-day deployment process with a self-service workflow integrated into the GSK Developer Portal. Key work focused on mapping the E2E bot lifecycle with tech leads, risk teams and automation engineers, and building an automated screening tool that instantly evaluated business processes for automation suitability. 