# Portfolio Case Study Interview 001

**Date:** July 29, 2026
**Status:** In progress

## Purpose

Recover and organize the product designer's memories of a past project, then use only supported details to develop a credible portfolio case study.

## Interview approach

- Ask questions in short rounds.
- Start with facts the designer remembers most clearly.
- Separate confirmed memories from uncertainty and inferred rationale.
- Do not invent missing project details.
- Turn the recovered material into a structured case-study narrative.

## Conversation transcript

**Designer:**

> So my current bottleneck is that I'm trying to rewrite some of my project, which I didn't have a lot of documentation. I do have some memory and not a lot of knowledge about what this project is, but I need help with writing the case study and then organizing information that I remember. Can you help me? by interviewing me asking me question to help me put things together

**Copilot:**

> Yes. I’ll interview you in short rounds, separate remembered facts from uncertainty, and gradually shape the material into a credible case-study narrative without inventing details. Let’s begin with the project’s basic frame.

**Designer:**

> Now ask me question about this project

**Copilot:**

> We’ll start with facts you’re most likely to remember, then use those answers to recover the problem, process, and outcome without filling gaps with guesses. Short or incomplete answers are completely usable.

## Recovered project context

The following details appeared in Copilot's visible summaries of the earlier interview. The designer's original answers are not available in the current transcript, so these are working notes rather than direct quotations and must be verified.

### Product and problem

- The project involved a professional dashboard connected to a text-heavy Performance Discussion Form (PDF) table.
- The intended change was to transform records into actionable information and historical trends.
- Managers exported records to Excel because the existing table did not clearly expose urgency, workflow state, or trends.
- One possible product objective was to bring that work back into the product.

### Users and permissions

- Direct managers may have needed detailed case-management information for immediate action.
- Supervisors may have needed aggregate information for broader oversight.
- The product had role-based data permissions.

### Proposed information model

- A live operational layer supported immediate actions.
- A historical analytics layer supported broader pattern recognition.
- PDFs may have needed to include positive events as well as negative performance events.
- Leaders may have used PDF records as supporting evidence during performance reviews.

### Design context

- The designer reportedly owned the full design process.
- The work was constrained by an outdated framework and an existing design system.
- The case study may focus on balancing detailed case management with aggregate oversight.
- Testing iterations and concrete before-and-after design decisions still need to be recovered.

## Verification questions for the next round

1. Is “Performance Discussion Form” the correct name, and does PDF stand for that in this project?
2. Who used the product, and what did each role need to decide or do?
3. Which details above are confirmed memories, which are uncertain, and which are incorrect?
4. What was the first version or concept shown to users?
5. What feedback caused the design to change?
6. What evidence, if any, showed that the final design improved the workflow?

## User feedback interview

### Question 1: Who gave feedback?

**Designer response:**

> The user who we interviews are regional managers, supervisor,, and they manage about fifty to eighty people in their region and department as well as design manager, which is a second level manager and then first level team manager who directly manage IC in their team

### Confirmed participant groups

- Regional managers or supervisors responsible for approximately 50–80 people across a region or department.
- Second-level managers who managed other managers. The exact title, possibly “design manager,” needs clarification.
- First-level team managers who directly managed individual contributors (ICs).

### Follow-up needed

- Confirm whether “design manager” is the correct title or a transcription error.
- Determine which participant groups provided each piece of feedback.

### Question 2: What did participants see, and how was feedback collected?

**Designer response:**

> So we talk to this manager before and after our design prototype., so we did the fur in the first round of interview we asked them question about their user patterns., what's their needs about from performance discussion forms as well as what they think performs discussion form is their day to day responsibility how often they interact with this module the volume of discussions they submit and use and act on and how often they use them whatever action they usually use the dis discussion forms for as well as asking them what are some actionable and critical data that they track on their own we also ask them what external tools they use or if there is any external tools that they use to help them complete their text within PDF yeah and we ask them some preferences about what metrics they tracks et cetera and then the second round of interview which is after we have completed our final prototype we did another round which we ask them to do a user testing of clickable prototype and have them walk through and just kind of observe if there's any obstacle they have and and there's any things that we could improve so and then we improve on that and then we did another quick interview with these people to see if there's anything that's being fixed and that yeah we also in the first round we also ask them to show us how they performs and utilize the current existing odes dashboard not dashboard the the table data table

### Confirmed research sequence

1. **Contextual interviews and workflow observation:** Before designing, the team interviewed managers about their current behavior and asked them to demonstrate how they used the existing data table.
2. **Prototype usability testing:** After completing a clickable prototype, the team asked participants to walk through it while the team observed obstacles and opportunities for improvement.
3. **Follow-up validation:** The team revised the prototype and held a shorter follow-up session to determine whether the identified issues had been addressed.

### First-round research topics

- How Performance Discussion Forms fit into managers' day-to-day responsibilities.
- How often managers interacted with the module.
- The volume of discussions they submitted, reviewed, used, or acted upon.
- The actions managers took using discussion forms.
- The actionable or critical data managers tracked independently.
- External tools managers used to complete related tasks.
- Metrics managers preferred to track.
- How managers navigated and used the existing data table.

### Follow-up needed

- Confirm the correct name of the existing product or module; “ODES” may be a transcription error.
- Clarify what “complete their tasks within PDF” means and whether PDF stands for Performance Discussion Form.
- Identify the specific usability obstacles observed in the clickable prototype.
- Identify the changes made after testing and whether the follow-up sessions confirmed improvement.

### Question 3: What problems did managers experience with the existing data table?

**Designer response:**

> So when they demonstrate with the existing data table we see that they struggle with pulling out immediate important actions having difficult with that because the current data table is fully text based so they do have to go into the details and understand and analyze those information in order to see how severe and important they are so when we ask them about do you know if there's anything that you need that requires immediate actions they kind of will take a minute or sorry a few seconds to go in there and kind of go through the list of items if for a higher up manager they might have to go through more items in order to find that specific things they need to act on as well as that old system have not doesn't have a very advanced filtering system so user having difficulties to locate things that's important and need to act on it did they complain a lot about that there are just lacked of usability consideration in the space which because they have seen other modules having advanced dashboards and so when they are in the PDF module they doesn't want to stay for long because they feel like system is difficult to navigate and lacked the proper a feature that they need so just the usability and aesthetic aspect it's not very attractive and appealing for them as well some user doesn't even understand a lot about performs discussions form so they kind of either lack trainings or just not interested in kind of using this tool to their full ability because how outdated and it is right now

### Observed behavior

- Managers could not identify items requiring immediate action at a glance.
- Because the table was text-heavy, managers had to open or read individual records and interpret their severity and importance.
- Participants paused and scanned multiple entries when asked to locate something requiring immediate action.
- Higher-level managers had more records to review, which increased the effort required to find priority items.
- Limited filtering made important or actionable records difficult to locate.

### Participant feedback

- Managers described the module as difficult to navigate and lacking features available in more advanced modules.
- They found its usability and visual design outdated and unappealing.
- Some participants avoided spending time in the module or did not use its full capabilities.

### Working interpretation

The existing table supported urgent work, but provided limited decision support. Managers had to manually translate dense text into urgency, severity, and next actions. This burden was greater for managers responsible for larger organizations.

Low adoption may have resulted from a combination of limited training, low awareness of the form's value, and the outdated experience. The relative influence of these factors is not yet confirmed.

### Follow-up needed

- Identify the fields or signals managers used to judge urgency and severity.
- Confirm which filters were missing from the existing table.
- Determine whether the project measured adoption or time spent finding priority records.

### Question 4: What workarounds did managers use?

**Designer response:**

> The table could help them to do urgent work. but it just gonna take them more brain power and time to find the items that they need to act on the things that require them to use external tools are when they want to track patterns and historical trend of a certain time frame so they will have to export it to Excel and kind of do the mapping from outside of the system and either comparison from outside of the system they do have a separate spreadsheet for that purpose they yeah and there is are a lot more manual labor to track the records

### Confirmed workflow

- Managers could locate urgent work in the existing table, but doing so required additional time and cognitive effort.
- Managers exported records to Excel when they needed to analyze patterns or historical trends over a selected period.
- They maintained separate spreadsheets to map, compare, and track records outside the product.
- Historical analysis involved substantial manual effort.

### Design opportunity

The product could reduce cognitive load for immediate action while bringing historical pattern analysis and comparisons into the module. These were related but distinct user needs: operational prioritization and longitudinal analysis.

### Follow-up needed

- Determine which time periods they commonly analyzed.
- Identify whether managers manually categorized or cleaned exported records before analysis.

### Question 5: What patterns or comparisons did managers create in Excel?

**Designer response:**

> These are specific based on manager level, so I don't think we should or need to dive very deep into here, but mainly they are tracking for example which department. have more conversation about employee being late or which department utilize PIP mores or which departments having maybe misbehaviors and stuff

### Representative analysis needs

- Analysis needs varied by management level.
- Managers compared departments to identify where lateness-related discussions occurred more frequently.
- They compared the use of Performance Improvement Plans (PIPs) across departments.
- They looked for departmental patterns in discussions concerning employee misconduct or other behavioral issues.

### Scope decision

The case study should use these as representative examples rather than documenting every role-specific metric. Their purpose is to demonstrate the need for departmental comparison and historical trend analysis.
