# sandbox
title: On-Brand Generative UI
subtitle: Block
logo: ./img/logo-block.png
shortDescription: An AI-assisted code-prototyping tool and starter kit with components and templates for building on-brand interface with Square and Cash App design languages.
thumbnail: ./img/sandbox-thumb.png
hover: ./img/sandbox-hover.png
modal: ./img/vibe-code-1.mov::Early stage starter kit docs with Square Market theme, ./img/sandbox-1.png::App: Home with environment-ready themed starters and recent projects,./img/sandbox-2.png::App: Projects, ./img/sandbox-3.mov::Workflow: Create a project and add templates, ./img/sandbox-4.png::App: Template navigator, ./img/sandbox-5.mov::Workflow: Navigate through workflow template in canvas
locked: true
role: Developer and designer
timeline: Q3 2025 – Present
title1: Context
title2: Work
title3: Tech stack
tags: ai, agentic code, enterprise tool, design system, app
people: Nahiyan Khan (DEng)

### 
Teams were spending a large amount of time on setup rather than ideation. Designers and engineers repeatedly recreated brand, themes, and existing Square and Cash App surfaces from scratch, with no shared foundation to build from. This led to inconsistent experiments, duplicated effort, and slower iteration.

### 
Built Square's Vibe Code Kit (passion project), a starter kit package with built-in themes, tokens, components, and page templates that users could install and use with any IDE. Used shadcn/ui as library.

Kit evolved into experimental tool for building AI-native interfaces in code using Square and Cash App design languages. Designed and developed new features, and focused on the intelligence layer of the tool, integrating ecosystem data and design system knowledge to seed LLM-driven workflows. Features include preconfigured branding and theming, reusable components and page templates, AI-assisted workflows, and context-aware generation grounded in Square's internal patterns—enabling faster, more intelligent iteration without production constraints.

###
Sandbox app: Tauri desktop app (Rust backend) with a React + TypeScript + Vite frontend, using TailwindCSS and custom Square and Cash App design systems built on shadcn/ui components.

---

# multi-ein
title: Multi-Seller Platform Experience
subtitle: Square
logo: ./img/logo-square.png
shortDescription: Core platform vision, model and features for complex sellers to organize, manage, and operate across multiple locations and legal entities.
thumbnail: ./img/me-thumb.png
hover: ./img/me-hover.png
modal: ./img/me-1.mov::Multiple legal entities support: Seller verification workflow, ./img/me-2.mov::Exploration of different account model architecture, ./img/me-3.png::Map of Square Dashboard features across configuration level, ./img/me-4.png::Evaluation map of seller needs against design approaches
locked: true
role: Design lead
timeline: Q4 2023 – Q3 2024
title1: Context
title2: Seller Experience
title3: Platform Strategy
tags: platform strategy, feature, account configuration, web, taxes
people: Graeme Britz (PM), Alison Tarwater (PM), Dax Shepherd (Eng), Curtis Wheeler (Eng)

### 
As Square expanded upmarket, the platform remained optimized for single-entity and single-location sellers. This created friction across organization, permissions, compliance, reporting, and operational workflows for businesses operating at scale. Addressing these gaps required platform-first investments and a clearer definition of what “upmarket” meant for the product.

### 
Led platform work to help complex sellers operate across many locations. Introduced custom location attributes and defined the vision for persistent manual and rule-based location groups, enabling bulk actions and scoped workflows across the dashboard.

### 
Partnered with head of UXR on the strategic initiative to define Square’s upmarket seller model, identifying core platform opportunities, themes, and follow-on areas for teams to build against. Built on this foundation to lead multi-seller and multi-entity account work, including centralized account architecture and compliance remediation experiences.
---

# g2
title: Agentic Console POC
subtitle: Block
logo: ./img/logo-block.png
shortDescription: A role-adaptive console POC showcasing how agentic UIs can automate internal workflows for Sales and Support.
thumbnail: ./img/g2-thumb.png
hover: ./img/g2-thumb.png
modal: ./img/g2-1.mov::Workflow: Customer advocate resolving hardware issue, ./img/g2-2.png::Sales associate launchpad, ./img/g2-3.png::Account manager launchpad, ./img/g2-4.mov::Workflow: Lead sourcing and vetting for sales
locked: true
role: Designer + developer
timeline: July 2025
category: experiments
title1: Context
title2: Approach
title3: Concept
tags: poc, agentic, automation, support, internal tool, experiment

###
As teams across Block explored AI-driven efficiency, internal roles like Customer Service, Sales, and Account Management continued to rely on fragmented tools and manual workflows—slowing down resolution times, duplicating effort, and making it harder to operate proactively. Despite growing interest in automation, there was no shared vision for what an intelligent, scalable solution could look like across functions.

###
Prototyped a live, role-adaptive console experience on top of G2's workflow and automation infrastructure. The proof of concept showcases how AI agents could surfac

###
Prototyped a live, role-adaptive console experience on top of G2's workflow and automation infrastructure. The proof of concept showcases how AI agents could surface relevant insights, suggest actions, and automate execution—shifting human effort from searching and decision-making to reviewing and approving. Designed modular experiences for CS, AM, and Sales, including flows like hardware case resolution, QBR prep, and lead vetting—highlighting how agentic UIs could reduce complexity, scale across roles, and drive alignment around what's possible.

---

# rdm
title: Remote Device Management
subtitle: Square
logo: ./img/logo-square.png
shortDescription: Centralized, remote device hub on Square Dashboard web and Point of Sale, for sellers to monitor and manage hardware fleets in real-time.
thumbnail: ./img/rdm-thumb.png
hover: ./img/rdm-hover.png
modal: ./img/rdm-1.mov::Device fleet overview dashboard, ./img/rdm-2.mov::Real-time device monitoring, ./img/rdm-3.png::Status by device types, ./img/rdm-4.mov::Exploration: Device details, ./img/rdm-5.png::Exploration: Data visualization, ./img/dev-codes.mov::Workflow: Bulk create device codes, ./img/dev-codes.png::Exploration: Device code details
role: Design lead
timeline: Q1 2022 – Q2 2023
title1: Context
title2: Foundation: Device Hub
title3: Evolution
tags: platform, feature, web, ios/android, hardware
people: Anjali Arakali (PM), Tyler Doyle (PM), Zachary Drayer (ENG), Joah (ENG)

###
Before 2022, Square sellers managed devices like checkout systems, printers, and card readers in person. For larger sellers managing hundreds of devices, this meant relying on on-site staff and manual processes, losing significant time to setup, monitoring, and troubleshooting.

### 
Led the design of Device Hub, a 0-1 remote device management platform that centralized device health, connectivity, and status into a single web experience. This work included leading design sprints with multiple hardware and device teams across Square to co-define the strategy, system models, and information architecture needed to support large device fleets across locations, while aligning with existing device management experiences on iOS and Android.

### 
Built close relationships with hero enterprise sellers, co-evolving platform from basic monitoring to a more actionable system. Improved large-scale device onboarding through bulk device code configuration, which allowed sellers to apply settings across many devices at once. Also led work that introduced real-time diagnostic tests for device and network issues, improving issue analysis and giving both sellers and support teams clearer visibility into what was failing.

---

# design-system
title: GSK Design System 
logo: ./img/logo-gsk.png
subtitle: GlaxoSmithKline
shortDescription: Global, enterprise design system including MWC LitElement components, starter pages, Sketch + Adobe XD UI kits and tutorials.
thumbnail: ./img/dsm-thumb.jpg
hover: ./img/dsm-hover.png
modal: ./img/dsm-1.mp4::Launch walkthrough, ./img/dsm-2.jpg::Docs: CDN install, ./img/dsm-3.png::Sketch UI kit: Overview docs, ./img/dsm-4.png::Sketch UI kit: Typography guidelines, ./img/dsm-5.jpg:: Developer workflow and opportunity mapping, ./img/dsm-6.jpg::Developer Portal: Component in catalog, ./img/dsm-7.mp4::Adobe XD UI kit, ./img/dsm-8.mp4::Docs: npm install
role: Designed system, UI kits, token map, documentation and tutorials.
timeline: 2019 – 2020
title1: Context
title2: Work
title3: Tech Stack
tags: MWC components, ui kit, material ui, documentation
people: Alex Voorhees (DL), Jeff Taylor (Eng)

###
At a global organization like GSK, digital product development was historically throttled by a decentralized approach to design and code. Without a common infrastructure, individual teams were rebuilding similar components from scratch, leading to fragmented user experiences and high technical debt.

###
Designed the GSK design system, serving as the primary bridge between Global Brand and engineering. Focused on the structural theming of Material UI to align with enterprise requirements and collaborated with partners at Google to refine the system's architecture. Designed and maintained the core UI kit and documentation, and spearheaded the launch strategy through global workshops and tutorials. 

###
Google Material MWC LitElement web components. Vue, React, Angular and Vanilla JS starters. Sass mixins and CSS Custom Properties. 

---

# automation-portal
title: Automation Developer Portal
subtitle: GlaxoSmithKline
logo: ./img/logo-gsk.png
shortDescription: Self-service bot promotion engine that replaces manual audit gates with codified compliance rules.
thumbnail: ./img/rpa-thumb.png
hover: ./img/rpa-hover.png
modal: ./img/rpa-1.jpg::Detail: Bot promotion request, ./img/rpa-2.mp4::Workflow: Register bot, ./img/rpa-3.mp4::Workflow: Edit permissions, ./img/rpa-4.mp4::Workflow: Assess automation opportunity, ./img/rpa-5.mp4::Concept: Robotic process automation landing page, ./img/rpa-6.mp4::Blueprint: Prod files monitoring, ./img/rpa-7.jpg::Developer Portal: RPA bot catalog, ./img/rpa-8.mp4::Process: Workflow wireframes
role: Designed experience, led service blueprint and systems documentation work. 
timeline: 2020
title1: Context
title2: Work
title3:
tags: rpa bots, dev portal, enterprise tool, sox compliance
people: 

###
Fragmented deployment and strict regulatory requirements (SOX, GxP) slowed the automation workforce at GSK. Moving an RPA bot to production required four separate platforms and extensive manual checklists, creating a 13-day lead time per promotion and diverting technical leads to time-consuming manual support roles.

###
Designed a centralized console to automate the promotion and governance of RPA bots. Replaced a manual, 13-day deployment process with a self-service workflow integrated into the GSK Developer Portal. Key work focused on mapping the E2E bot lifecycle with tech leads, risk teams and automation engineers, and building an automated screening tool that instantly evaluated business processes for automation suitability. 