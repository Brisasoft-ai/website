# AAB copy review against BPMN 2.0 (2026-10-16)

Reviewed by reading the AAB, Products and Home texts as a BPMN practitioner would. Scope: terminology and claims only; no AAB code was inspected.

| # | Finding | Why it matters | Change |
|---|---|---|---|
| 1 | "BPMN workflow on Camunda" with no standard version | Buyers cannot tell if models are executable BPMN 2.0 | Now "BPMN 2.0 process on Camunda" |
| 2 | Old flow diagram: "BPMN process routes it" | A model does not route; the engine executes it. Routing is done by gateways | Reworded: "process instance starts on Camunda"; real gateway drawn |
| 3 | Old flow was a numbered list with no decision or reject path | Real approval processes have a gateway and rework loop | New BPMN-notation diagram: message start event, service tasks, user task, exclusive gateway (Approved? / Rejected: revise), end event, two lanes |
| 4 | "classify, extract, draft" described as one AI step | In BPMN these are separate service tasks | Split into "classify and extract" and "draft reply" |
| 5 | "a full history" of every process | Overstated: history depth depends on Camunda configuration and retention | "records each execution step" |
| 6 | "Human in control" without saying where | Needs to map to user tasks with an approver | "User tasks with a named approver" |
| 7 | AI could be read as deciding routing | Not the design intent | New FAQ: routing, deadlines and approvals live in the BPMN model; AI only runs defined tasks |
| 8 | "Process is visible and versioned" | True for deployed process definitions in Camunda; stated as design property | Kept, in the solution text |

## Left for the product owner
- **Camunda version (7 or 8)**: the site does not name one. Capabilities, deployment model and licensing differ, so state the version once decided.
- **Microsoft 365 scope** (Outlook, Teams, Forms, SharePoint): the site says "Microsoft 365" only, because the exact integrations are not confirmed.
- **AAB is in development**: the diagram is labelled "simplified example"; no customer deployment or measured result is claimed.
