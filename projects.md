# sandbox
title: On-Brand Generative UI
subtitle: Block
logo: ./img/logo-block.png
shortDescription: An AI-assisted code-prototyping tool and starter kit with components and templates for building on-brand interface with Square and Cash App design languages.
thumbnail: ./img/sandbox/sandbox-thumb.png
hover: ./img/sandbox/sandbox-hover.png
locked: true
role: Developer + designer
timeline: Q3 2025 – Present
device: macbook-pro
device-image: ./img/sandbox/sandbox-mock.png
tags: ai, agentic code, enterprise tool, design system, app
people: Nahiyan Khan (DEng)

### Context | No shared foundations for LLMs
When AI in the design org boomed, teams were spending a large amount of time on setup rather than ideation. Designers and engineers repeatedly recreated brand, themes, and existing Square and Cash App surfaces from scratch, with no shared foundation to build from. This led to inconsistent designs, duplicated effort, and slower iteration. Existing design systems were not optimized for rapid code-native experimentation or AI-assisted generation.

### Build + validate | Building a structured sandbox
img: ./img/sandbox/sandbox-build-1.mp4::Early stage starter kit docs with Square Market theme, ./img/sandbox/sandbox-build-2.mp4::Adapt prototype to POS app experience, ./img/sandbox/sandbox-build-3.mp4::Toggle hotspots on prototypes, ./img/sandbox/sandbox-build-4.mp4::Workflow: Create a project and add templates, ./img/sandbox/sandbox-build-5.mp4::Workflow: Navigate through workflow template in canvas, ./img/sandbox/sandbox-build-6.mp4::Ungroup a workflow and edit states individually
I wanted to do something about this, so for a few weeks, I spent post-kid-bedtime building a modular vibe code kit (leveraging shadUI) themed with the Square Market design language. When I had the POC ready (~10 components, installable), I shared Applied AI team. In a matter of days, the kit quickly evolved into a broader question: how much setup, scaffolding, and environment configuration do teams really need in order to experiment effectively?

This is when I joined forces with their lead design eng, Nahiyan, and started sandbox: a standalone app with design languages, a canvas, and built-in LLM. The app included pre-seeded design languages, built-in chat, AI rules and guidelines grounded in those design systems, page templates, reusable components, hotspots, and inspect tooling. After many long nights, and weekly demos to Head of Design and Jack, we launched.

### Iterate | Returning to modular foundations
img: ./diagrams/market-starter-architecture.mmd::Abstraction architecture, ./diagrams/market-starter-workflow.mmd::Workflow architecture for building pages, ./img/sandbox/sandbox-iterate-1.mp4::Local sandbox docs, ./img/sandbox/sandbox-iterate-2.mp4::Local sandbox build
After launch, usage patterns showed that most designers preferred working in their own IDEs with flexible, cloneable tooling rather than a fixed environment. As a next phase, I abstracted the core primitives from the sandbox and returned to the original modular concept, creating a standalone local playground that anyone could clone and use to spin up Square or Cash projects. This version emphasized portability, composability, and alignment with existing workflows rather than replacing them. Then the next ask came in - "Can we just have production components in here?"

### Build (again, and again) | Integrating production code
img: ./diagrams/sandbox-component-flow.mmd::Experiment 1: Local sandbox uses schemas from external Market component and Dashboard production repos to generate UI
Currently, I'm focused on integrating the local sandbox model directly with production components and products from Squash and Cash repositories. I'm running a controlled set of experiments, each with a different build, to see which path gets us the most intelligent prototyping with the least drift.

### Stack | Tech details
Sandbox app: Tauri desktop app (Rust backend) with a React + TypeScript + Vite frontend, using TailwindCSS and custom Square and Cash App design systems built on shadcn/ui components.

---

# multi-ein
title: Multi-Seller Platform Experience
subtitle: Square
logo: ./img/logo-square.png
shortDescription: Core platform vision, model and features for complex sellers to organize, manage, and operate across multiple locations and legal entities.
thumbnail: ./img/multi-ein/me-thumb.png
hover: ./img/multi-ein/me-hover.png
// sliderCaption: Account architecture exploration
// slider: ./img/multi-ein/me-3.png::Evaluation, ./img/multi-ein/me-4.png::Evaluation
locked: true
role: Design lead
device: macbook-pro
device-image: ./img/multi-ein/multi-ein-design-2.mp4
timeline: Q2 2023 – Q3 2024

### Context | No shared definition of who we were building for
In 2022, Square product teams increased their focus on building for larger sellers, or as we called them, "upmarket" sellers. They represented a big market opportunity for Square. At the time, teams had different definitions for who upmarket sellers were. In turn, the product began to quickly lack cohesion. Working cross-functionally became a struggle, and for sellers, the Square ecosystem began to break.

### Research + strategy | Crafting the "Upmarket" platform design strategy
img: ./img/multi-ein/multi-ein-research-1.mp4::Discovery: Literary and design reviews across Square product teams, ./img/multi-ein/multi-ein-research-2.png::Ideation: Co-design workshops with Square teams to ideate on key opportunity workflows,
Partnered with the head of Research (Platform) to build a framework and set of upmarket seller archetypes that helped teams share the same understanding on who we are serving and align on what our approach should be. Uncovered product themes and opportunities across onboarding, configuration, permissions, support, and data visibility. Led UX audits, service blueprinting, and cross-team discussions to surface systemic gaps. This work shifted the conversation from adding segmented features to rethinking the platform foundations needed to support complex organizations.

### Design | Building the platform enablers
img: ./img/multi-ein/multi-ein-design-1.mp4::Exploration of different account model architecture, ./img/multi-ein/multi-ein-design-2.mp4::Vision: Manage multiple businesses from a central place, ./img/multi-ein/multi-ein-design-3.mp4::Tax notices and business verification workflows, ./img/multi-ein/multi-ein-design-4.mp4::Workflow: Verify additional business entities, ./img/multi-ein/multi-ein-design-5.mp4::Workflow: Create location custom attribute, ./img/multi-ein/multi-ein-design-6.mp4::Workflow: Create location group
As design lead, drove the multi-entity initiative that restructured how accounts, entities, and locations relate to one another. Defined hierarchy models, permission scoping, and grouping behaviors so sellers could operate multiple legal entities under a unified structure rather than managing locations in isolation. Prioritized getting hierarchy and permission primitives right before expanding surface features to avoid long-term fragmentation.

In parallel, I led the design of location custom attributes and a broader platform groups vision, enabling sellers to define shared behaviors and configurations across subsets of their business instead of managing each location manually.

### Outcome | Enterprise adoption and compliance
img: ./img/multi-ein/multi-ein-outcome-1.png::Square for Enterprises: Organization dashboard, ./img/multi-ein/multi-ein-outcome-2.png::Square for Enterprises: Reporting by location group, ./img/multi-ein/multi-ein-outcome-3.png::Square for Enterprises: Merchant onboarding for organizations
These structural changes removed blockers for tax remediation and compliance workflows while positioning the platform to support complex organizations operating multiple businesses under a unified account. Although rolling out in phases, this foundation enables enterprise sellers to consider Square as a true end-to-end solution rather than a single-location tool.

---

# g2
title: Agentic Support Console (POC)
subtitle: Block
logo: ./img/logo-block.png
shortDescription: A role-adaptive console POC showcasing how agentic UIs can automate internal workflows for Sales and Support.
thumbnail: ./img/g2/g2-thumb.png
hover: ./img/g2/g2-thumb.png
locked: true
role: Designer + developer
timeline: July 2025
category: experiments

### Context | No shared model for approaching AI
img: ./img/g2/g2-context-1.mp4::Workflow: Customer advocate resolving hardware issue, ./img/g2/g2-context-2.png::Sales associate launchpad
As teams across Block explored AI-driven efficiency, internal roles like Customer Service, Sales, and Account Management continued to rely on fragmented tools and manual workflows. Despite growing interest in automation, and a recently launched productivity dashboard (g2), there was no shared model for how an intelligent, scalable solution should look like across functions. There was also no shared understanding of what should be automated, how agents should behave, or where human review belonged. Without a common model, conversations stayed abstract and execution stalled.

### Framework | Defining an automation framework
img: ./img/g2/g2-framework-1.png::Account manager launchpad
Established a practical framework for deciding what to automate, how agent responsibilities should be scoped, and how human oversight should function. Facilitated working sessions with operations, engineering, and platform leads to define boundaries for agent autonomy before prototyping. Grounded the framework in real operational flows — hardware case resolution, QBR preparation, and lead vetting — to avoid speculative use cases. Made a deliberate tradeoff to prioritize structured, reviewable automation over fully autonomous execution.

### Prototype | Prototyping a shared system
img: ./img/g2/g2-prototype-1.mp4::Workflow: Lead sourcing and vetting for sales
Built a role-adaptive console layered onto existing workflow systems to make the framework tangible. Demonstrated contextual insight surfacing, next-best action generation, and embedded approval controls across roles. The prototype acted as a concrete reference point for how agents, humans, and workflows could operate together within one shared system.

---

# rdm
title: Remote Device Management
subtitle: Square
logo: ./img/logo-square.png
shortDescription: Centralized, remote device hub on Square Dashboard web and Point of Sale, for sellers to monitor and manage hardware fleets in real-time.
thumbnail: ./img/rdm/rdm-thumb.png
hover: ./img/rdm/rdm-hover.png
role: Design lead
timeline: Q1 2022 – Q2 2023
device: macbook-pro
device-image: ./img/rdm/rdm-mock.png

### Context | In-person device management
img: ./img/rdm/rdm-context-1.png::Hardware Hub: Space in each POS where sellers could manage locally connected devices
Before 2022, Square sellers managed devices like checkout systems, printers, and card readers in person. For larger sellers managing hundreds of devices, this meant relying on on-site staff and manual processes, losing significant time to setup, monitoring, and troubleshooting.

### Approach | Establishing a foundation
img: ./img/rdm/rdm-approach-1.mp4::Discovery: Design sprint synthesis + feature evaluation + prioritization ./img/rdm/rdm-approach-2.png::Framework: Status definitions + status by device type, ./img/rdm/rdm-approach-3.png::Framework: Logic for device metadata, ./img/rdm/rdm-approach-4.mp4::Exploration: Device details, ./img/rdm/rdm-approach-5.png::Exploration: Data visualization, ./img/rdm/rdm-approach-6.mp4::Device fleet overview dashboard, ./img/rdm/rdm-approach-7.mp4::Real-time device monitoring
Led the 0–1 definition and design of Device Hub, a remote device management platform. Ran design sprints with multiple hardware and device teams across Square to co-define the strategy, system models, and information architecture needed to support large device fleets across locations, while aligning with existing device management experiences on iOS and Android. Partnered directly with enterprise sellers managing large fleets to validate onboarding friction and prioritize monitoring over custom visualization views and bulk actions in the initial release.

### Evolution | Expanding platform capabilities
img: ./img/rdm/rdm-evolution-1.mp4::Exploration: Diagnostic test flow and visual patterns, ./img/rdm/rdm-evolution-2.mp4::Workflow: Run device diagnostic test, ./img/rdm/rdm-evolution-3.mp4::Workflow: Bulk create device codes, ./img/rdm/rdm-evolution-4.png::Exploration: Device code details
Expanded the platform beyond basic monitoring to a more actionable system. Designed bulk device code configuration so sellers could apply settings across many devices at once, dramatically simplifying onboarding and updates. Added real-time device and network diagnostics to shift sellers from reactive support escalation to structured self-serve troubleshooting, reducing reliance on support teams and making fleet management proactive rather than reactive.

---

# automation-portal
title: Automation Developer Portal
subtitle: GlaxoSmithKline
logo: ./img/logo-gsk.png
shortDescription: Self-service bot promotion engine that replaces manual audit gates with codified compliance rules.
thumbnail: ./img/automation-portal/rpa-thumb.png
hover: ./img/automation-portal/rpa-hover.png
role: Design lead
timeline: 2020
device: macbook-pro
device-image: ./img/automation-portal/rpa-hover.png

### Context | Manual and slow controls
img: ./img/automation-portal/automation-portal-context-1.png::Manual automation assessments + file tracking + permissions management
Fragmented deployment and strict regulatory requirements (SOX, GxP) slowed the automation workforce at GSK. Moving an RPA bot to production required four separate platforms and extensive manual checklists, creating a 13-day lead time per promotion and diverting technical leads to time-consuming manual support roles.

### Approach | Embedding compliance into workflows
img: ./img/automation-portal/automation-portal-approach-1.mp4::Blueprint: Production files monitoring workflow, ./img/automation-portal/automation-portal-approach-2.mp4::Concept: Robotic process automation landing page, ./img/automation-portal/automation-portal-approach-3.mp4::Exploration: Key workflows across different roles
Mapped the full bot lifecycle with engineering, risk, and automation teams to surface redundancies and undocumented decision points. Facilitated alignment sessions to consolidate ownership and clarify where compliance checks should become system-enforced rather than manually reviewed. Introduced an automated screening tool to validate automation suitability upstream, intentionally shifting risk evaluation earlier in the lifecycle.

### Design | Streamlining RPA bot deployment
img: ./img/automation-portal/automation-portal-design-1.mp4::Workflow: Assess automation opportunity, ./img/automation-portal/automation-portal-design-2.mp4::Workflow: Register bot, ./img/automation-portal/automation-portal-design-3.mp4::Workflow: Edit permissions, ./img/automation-portal/automation-portal-design-4.mp4::Developer Portal: Workflow: Review requests, ./img/automation-portal/automation-portal-design-5.jpg::Detail: Bot promotion request
Designed and launched a centralized promotion console within the Developer Portal that unified lifecycle tracking and embedded regulatory checkpoints directly into workflow logic. Developers could self-serve and promote their bots through environments, eliminatiing reduntant validation handoff and reducing the dependency on tech leads.

---

# design-system
title: GSK Design System
logo: ./img/logo-gsk.png
subtitle: GlaxoSmithKline
shortDescription: Global, enterprise design system including MWC LitElement components, starter pages, Sketch + Adobe XD UI kits and tutorials.
thumbnail: ./img/design-system/dsm-thumb.jpg
hover: ./img/design-system/dsm-hover.png
role: Lead designer + design engineer
timeline: 2019 – 2020
device: macbook-pro
device-image: ./img/design-system/design-system-design-3.jpg

### Context | Decentralized development
img: ./img/design-system/design-system-context-1.png::GSK experiences using different themes and code,
./img/design-system/design-system-context-2.mp4::Inventory audits for components across 5+ experiences
At a global, 300-year-old pharmaceutical like GSK, digital product development was historically throttled by a decentralized approach to design and code. Without a common infrastructure, individual teams were rebuilding similar components from scratch, leading to fragmented user experiences and high technical debt.

### Approach | Establishing a shared foundation
img:   ./img/design-system/design-system-approach-1.png +  ./img/design-system/design-system-approach-2.png::Exploration: Themes, 
./img/design-system/design-system-approach-3.png::Theming: Tokens and mapping leveraging Material, 
./img/design-system/design-system-approach-4.jpg::Discovery: Developer workflow and opportunity mapping,
./img/design-system/design-system-approach-5.mp4::Concept: Design system landing page,
./img/design-system/design-system-approach-6.mp4::Sketch UI kit

Defined a token-based theming architecture aligned with enterprise brand requirements and served as the connective layer between Global Brand and engineering. Partnered with Google to pressure-test architectural decisions before scaling implementation. Conducted workshops and implementation sessions with distributed teams to identify friction in adoption and refined the system based on real integration constraints.

### Design | Building the system end-to-end
img: ./img/design-system/design-system-design-1.mp4::Launch walkthrough, 
./img/design-system/design-system-design-2.jpg::Docs: CDN install, 
./img/design-system/design-system-design-3.jpg::Docs: Component detail page in Developer Portal catalog, 
./img/design-system/design-system-design-4.png::Comms for launches + workshops + events
Designed the component, pattern and theme libraries. Built the UI kits for designers alongside production-ready components and multi-framework starters (Vue, React, Angular, Vanilla JS) so teams could implement without reinventing structure. Created practical usage guidelines, installation documentation, real examples, and starter templates to remove ambiguity for both designers and engineers. Co-led the launch strategy with GSK Brand team through workshops and tutorials.

### Stack | Tech details
Google Material MWC LitElement web components. Vue, React, Angular and Vanilla JS starters. Sass mixins and CSS custom properties.
