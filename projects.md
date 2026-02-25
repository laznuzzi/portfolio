# sandbox
title: On-Brand Generative UI
subtitle: Block
logo: ./img/logo-block.png
shortDescription: An AI-assisted code-prototyping tool and starter kit with components and templates for building on-brand interface with Square and Cash App design languages.
thumbnail: ./img/sandbox-thumb.png
hover: ./img/sandbox-hover.png
locked: true
role: Developer + designer
timeline: Q3 2025 – Present
device: macbook-pro
device-image: ./img/sandbox-mock.png
tags: ai, agentic code, enterprise tool, design system, app
people: Nahiyan Khan (DEng)

### Context | No shared foundations for LLMs
When AI in the design org boomed, teams were spending a large amount of time on setup rather than ideation. Designers and engineers repeatedly recreated brand, themes, and existing Square and Cash App surfaces from scratch, with no shared foundation to build from. This led to inconsistent designs, duplicated effort, and slower iteration. Existing design systems were not optimized for rapid code-native experimentation or AI-assisted generation.

### Build + validate | Building a structured sandbox
img: ./img/vibe-code-1.mov::Early stage starter kit docs with Square Market theme, ./img/sandbox-1.png::App: Home with environment-ready themed starters and recent projects, ./img/sandbox-2.png::App: Prototypes, ./img/sandbox-3.mov::Workflow: Create a project and add templates, ./img/sandbox-4.png::App: Template navigator, ./img/sandbox-5.mov::Workflow: Navigate through workflow template in canvas
I wanted to do something about this, so for a few weeks, I spent post-kid-bedtime building a modular vibe code kit (leveraging shadUI) themed with the Square Market design language. When I had the POC ready (~10 components, installable), I shared Applied AI team. In a matter of days, the kit quickly evolved into a broader question: how much setup, scaffolding, and environment configuration do teams really need in order to experiment effectively?

This is when I joined forces with their lead design eng, Nahiyan, and started sandbox: a standalone app with design languages, a canvas, and built-in LLM. The app included pre-seeded design languages, built-in chat, AI rules and guidelines grounded in those design systems, page templates, reusable components, hotspots, and inspect tooling. After many long nights, and weekly demos to Head of Design and Jack, we launched.

### Iterate | Returning to modular foundations
img: ./img/market-starter-1.png::Abstraction architecture, ./img/market-starter-2.png::Workflow architecture for building pages, ./img/market-starter-3.mov::Local sandbox docs, ./img/market-starter-4.mov::Local sandbox build
After launch, usage patterns showed that most designers preferred working in their own IDEs with flexible, cloneable tooling rather than a fixed environment. As a next phase, I abstracted the core primitives from the sandbox and returned to the original modular concept, creating a standalone local playground that anyone could clone and use to spin up Square or Cash projects. This version emphasized portability, composability, and alignment with existing workflows rather than replacing them. Then the next ask came in - "Can we just have production components in here?"

### Build (again, and again) | Integrating production code
img: ./diagrams/sandbox-component-flow.mmd::Experiment 1: Local sandbox uses schemas from external Market component and Dashboard production repos to generate UI
Currently, I'm focused on integrating the local sandbox model directly with production components and products from Squash and Cash repositories. I'm running a controlled set of experiments, each with a different build, to see which path gets us the most intelligent prototyping with the least drift.

### Stack | Tech details
Sandbox app: Tauri desktop app (Rust backend) with a React + TypeScript + Vite frontend, using TailwindCSS and custom Square and Cash App design systems built on shadcn/ui components.

---

# multi-ein
title: Multi-Merchant Platform Experience
subtitle: Square
logo: ./img/logo-square.png
shortDescription: Core platform vision, model and features for complex sellers to organize, manage, and operate across multiple locations and legal entities.
thumbnail: ./img/me-thumb.png
hover: ./img/me-hover.png
// sliderCaption: Account architecture exploration
// slider: ./img/me-3.png::Evaluation, ./img/me-4.png::Evaluation
locked: true
role: Design lead
device: macbook-pro
device-image: ./img/me-mock.mov
timeline: Q2 2023 – Q3 2024

### Context | No shared definition of who we were building for
In 2022, Square product teams increased their focus on building for larger sellers, or as we called them, "upmarket" sellers. They represented a big market opportunity for Square. At the time, teams had different definitions for who upmarket sellers were. In turn, the product began to quickly lack cohesion. Working cross-functionally became a struggle, and for sellers, the Square ecosystem began to break.

### Research + strategy | Crafting the "Upmarket" platform design strategy
img: ./img/me-7.mov::Discovery: Literary and design reviews across Square product teams, ./img/me-9.png::Ideation: Co-design workshops with Square teams to ideate on key opportunity workflows, 
Partnered with the head of Research (Platform) to build a framework and set of upmarket seller archetypes that helped teams share the same understanding on who we are serving and align on what our approach should be. Uncovered product themes and opportunities across onboarding, configuration, permissions, support, and data visibility. Led UX audits, service blueprinting, and cross-team discussions to surface systemic gaps. This work shifted the conversation from adding segmented features to rethinking the platform foundations needed to support complex organizations.

### Design | Building the platform enablers
img: ./img/me-2.mov::Exploration of different account model architecture, ./img/me-mock.mov::Vision: Manage multiple businesses from a central place, ./img/me-8.mov::Tax notices and business verification workflows, ./img/me-1.mov::Workflow: Verify additional business entities, ./img/me-5.mov::Workflow: Create location custom attribute, ./img/me-6.mov::Workflow: Create location group
As design lead, drove the multi-entity initiative that restructured how accounts, entities, and locations relate to one another. Defined hierarchy models, permission scoping, and grouping behaviors so sellers could operate multiple legal entities under a unified structure rather than managing locations in isolation. Prioritized getting hierarchy and permission primitives right before expanding surface features to avoid long-term fragmentation.

In parallel, I led the design of location custom attributes and a broader platform groups vision, enabling sellers to define shared behaviors and configurations across subsets of their business instead of managing each location manually.

### Outcome | Enterprise adoption and compliance
img: ./img/me-outcome-1.png::Square for Enterprises: Organization dashboard, ./img/me-outcome-2.png::Square for Enterprises: Reporting by location group, ./img/me-outcome-3.png::Square for Enterprises: Merchant onboarding for organizations
These structural changes removed blockers for tax remediation and compliance workflows while positioning the platform to support complex organizations operating multiple businesses under a unified account. Although rolling out in phases, this foundation enables enterprise sellers to consider Square as a true end-to-end solution rather than a single-location tool.

---

# g2
title: Agentic Support Console (POC)
subtitle: Block
logo: ./img/logo-block.png
shortDescription: A role-adaptive console POC showcasing how agentic UIs can automate internal workflows for Sales and Support.
thumbnail: ./img/g2-thumb.png
hover: ./img/g2-thumb.png
locked: true
role: Designer + developer
timeline: July 2025
category: experiments

### Context | No shared model for approaching AI
img: ./img/g2-1.mov::Workflow: Customer advocate resolving hardware issue, ./img/g2-2.png::Sales associate launchpad
As teams across Block explored AI-driven efficiency, internal roles like Customer Service, Sales, and Account Management continued to rely on fragmented tools and manual workflows. Despite growing interest in automation, and a recently launched productivity dashboard (g2), there was no shared model for how an intelligent, scalable solution should look like across functions. There was also no shared understanding of what should be automated, how agents should behave, or where human review belonged. Without a common model, conversations stayed abstract and execution stalled.

### Framework | Defining an automation framework
img: ./img/g2-3.png::Account manager launchpad
Established a practical framework for deciding what to automate, how agent responsibilities should be scoped, and how human oversight should function. Facilitated working sessions with operations, engineering, and platform leads to define boundaries for agent autonomy before prototyping. Grounded the framework in real operational flows — hardware case resolution, QBR preparation, and lead vetting — to avoid speculative use cases. Made a deliberate tradeoff to prioritize structured, reviewable automation over fully autonomous execution.

### Prototype | Prototyping a shared system
img: ./img/g2-4.mov::Workflow: Lead sourcing and vetting for sales
Built a role-adaptive console layered onto existing workflow systems to make the framework tangible. Demonstrated contextual insight surfacing, next-best action generation, and embedded approval controls across roles. The prototype acted as a concrete reference point for how agents, humans, and workflows could operate together within one shared system.

---

# rdm
title: Remote Device Management
subtitle: Square
logo: ./img/logo-square.png
shortDescription: Centralized, remote device hub on Square Dashboard web and Point of Sale, for sellers to monitor and manage hardware fleets in real-time.
thumbnail: ./img/rdm-thumb.png
hover: ./img/rdm-hover.png
role: Design lead
timeline: Q1 2022 – Q2 2023
device: macbook-pro
device-image: ./img/rdm-mock.png

### Context | In-person device management
img: ./img/rdm-7.png::Hardware Hub: Space in each POS where sellers could manage locally connected devices
Before 2022, Square sellers managed devices like checkout systems, printers, and card readers in person. For larger sellers managing hundreds of devices, this meant relying on on-site staff and manual processes, losing significant time to setup, monitoring, and troubleshooting.

### Approach | Establishing a foundation
img: ./img/rdm-3.mov::Discovery: Design sprint synthesis + feature evaluation + prioritization ./img/rdm-3.png::Framework: Status definitions + status by device type, ./img/rdm-4.png::Framework: Logic for device metadata, ./img/rdm-4.mov::Exploration: Device details, ./img/rdm-5.png::Exploration: Data visualization, ./img/rdm-1.mov::Device fleet overview dashboard, ./img/rdm-2.mov::Real-time device monitoring
Led the 0–1 definition and design of Device Hub, a remote device management platform. Ran design sprints with multiple hardware and device teams across Square to co-define the strategy, system models, and information architecture needed to support large device fleets across locations, while aligning with existing device management experiences on iOS and Android. Partnered directly with enterprise sellers managing large fleets to validate onboarding friction and prioritize monitoring over custom visualization views and bulk actions in the initial release.

### Evolution | Expanding platform capabilities
img: ./img/rdm-network-2.mov::Exploration: Diagnostic test flow and visual patterns, ./img/rdm-network-1.mov::Workflow: Run device diagnostic test, ./img/dev-codes.mov::Workflow: Bulk create device codes, ./img/dev-codes.png::Exploration: Device code details
Expanded the platform beyond basic monitoring to a more actionable system. Designed bulk device code configuration so sellers could apply settings across many devices at once, dramatically simplifying onboarding and updates. Added real-time device and network diagnostics to shift sellers from reactive support escalation to structured self-serve troubleshooting, reducing reliance on support teams and making fleet management proactive rather than reactive.

---

# automation-portal
title: Automation Developer Portal
subtitle: GlaxoSmithKline
logo: ./img/logo-gsk.png
shortDescription: Self-service bot promotion engine that replaces manual audit gates with codified compliance rules.
thumbnail: ./img/rpa-thumb.png
hover: ./img/rpa-hover.png
role: Design lead
timeline: 2020
tags: rpa bots, dev portal, enterprise tool, sox compliance
people:

### Context | Manual and slow controls
img: ./img/rpa-1.jpg::Detail: Bot promotion request, ./img/rpa-8.mp4::Process: Workflow wireframes
Fragmented deployment and strict regulatory requirements (SOX, GxP) slowed the automation workforce at GSK. Moving an RPA bot to production required four separate platforms and extensive manual checklists, creating a 13-day lead time per promotion and diverting technical leads to time-consuming manual support roles.

### Approach | Embedding compliance into workflows
img: ./img/rpa-2.mp4::Workflow: Register bot, ./img/rpa-3.mp4::Workflow: Edit permissions, ./img/rpa-4.mp4::Workflow: Assess automation opportunity
Mapped the full bot lifecycle with engineering, risk, and automation teams to surface redundancies and undocumented decision points. Facilitated alignment sessions to consolidate ownership and clarify where compliance checks should become system-enforced rather than manually reviewed. Introduced an automated screening tool to validate automation suitability upstream, intentionally shifting risk evaluation earlier in the lifecycle.

### Design | Streamlining RPA bot deployment
img: ./img/rpa-5.mp4::Concept: Robotic process automation landing page, ./img/rpa-6.mp4::Blueprint: Prod files monitoring, ./img/rpa-7.jpg::Developer Portal: RPA bot catalog
Designed and launched a centralized promotion console within the Developer Portal that unified lifecycle tracking and embedded regulatory checkpoints directly into workflow logic. Developers could self-serve and promote their bots through environments, eliminatiing reduntant validation handoff and reducing the dependency on tech leads.

---

# design-system
title: GSK Design System
logo: ./img/logo-gsk.png
subtitle: GlaxoSmithKline
shortDescription: Global, enterprise design system including MWC LitElement components, starter pages, Sketch + Adobe XD UI kits and tutorials.
thumbnail: ./img/dsm-thumb.jpg
hover: ./img/dsm-hover.png
role: Lead designer + design engineer
timeline: 2019 – 2020
tags: MWC components, ui kit, material ui, documentation
people: Alex Voorhees (DL), Jeff Taylor (Eng)

### Context | Decentralized development
img: ./img/dsm-5.jpg::Developer workflow and opportunity mapping
At a global, 300-year-old pharmaceutical like GSK, digital product development was historically throttled by a decentralized approach to design and code. Without a common infrastructure, individual teams were rebuilding similar components from scratch, leading to fragmented user experiences and high technical debt.

### Approach | Establishing a shared foundation
img: ./img/dsm-3.png::Sketch UI kit: Overview docs, ./img/dsm-4.png::Sketch UI kit: Typography guidelines
Defined a token-based theming architecture aligned with enterprise brand requirements and served as the connective layer between Global Brand and engineering. Partnered with Google to pressure-test architectural decisions before scaling implementation. Conducted workshops and implementation sessions with distributed teams to identify friction in adoption and refined the system based on real integration constraints.

### Design | Building the system end-to-end
img: ./img/dsm-1.mp4::Launch walkthrough, ./img/dsm-2.jpg::Docs: CDN install, ./img/dsm-6.jpg::Developer Portal: Component in catalog, ./img/dsm-7.mp4::Adobe XD UI kit, ./img/dsm-8.mp4::Docs: npm install
Designed the component, pattern and theme libraries. Built the UI kits for designers alongside production-ready components and multi-framework starters (Vue, React, Angular, Vanilla JS) so teams could implement without reinventing structure. Created practical usage guidelines, installation documentation, real examples, and starter templates to remove ambiguity for both designers and engineers. Co-led the launch strategy with GSK Brand team through workshops and tutorials.

### Stack | Tech details
Google Material MWC LitElement web components. Vue, React, Angular and Vanilla JS starters. Sass mixins and CSS custom properties.
