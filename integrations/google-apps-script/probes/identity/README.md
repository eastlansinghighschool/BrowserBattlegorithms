# Gate 2: tenant identity probe

This is a separate minimal Apps Script web app. It evaluates
`Session.getActiveUser().getEmail()` and `Session.getEffectiveUser().getEmail()` on the server,
then renders the values only in the page returned to the person who opened it. It writes no Drive
file, Sheet row, Script Property, or execution-log identity record, and it has no client-to-server
result call. The page provides a deidentified, allowlisted result block for email or chat; it does
not make the displayed identity values safe to copy.

## Run

1. Deploy this folder as a **separate** Apps Script web app from the nested-frame probe. Use
   **execute as the deploying user** and **who has access: anyone in the Workspace domain**. The
   exact settings matter because the gate is about server-derived identity under the intended
   teacher-owned deployment model.
2. Open it as the teacher/deployer account. Choose the fixed account-role, condition, intended-viewer
   match, execute-as, and access values. Enter the expected domain only for the private on-page
   comparison, then choose **Evaluate private domain check**. Do not copy the displayed email or
   expected domain into a report.
3. Run Tier A with one non-teacher domain account. Prefer a synthetic account for repeatability;
   one real student may substitute under the safeguards below.
4. Run Tier B with the teacher account plus one other domain account in one Chrome profile. Test
   both a second signed-in account and account switching mid-session. For each complete run, choose
   whether the displayed active identity matches the intended viewer without typing an email. Record
   only the **Copy email-safe report** block's pass/fail/unknown aggregates and condition labels.
5. Leave Tier C (renamed and disabled accounts) as a pre-pilot checklist item if provisioned test
   accounts become available. Tier C is not a Gate 2 blocker. Unrostered/late-enrollee behavior is
   a later roster-validation concern and is not measured by this identity-only probe.

## Tiered matrix and falsifiers

| Tier | Condition | Needs | Falsifies |
| --- | --- | --- | --- |
| **A — hard fail** | Non-teacher active identity is nonblank, correct, and expected-domain under execute-as-deployer | One synthetic non-teacher account, or one real student | Account-attributed cloud mode entirely; if it fails, stop downstream cloud work |
| **A — hard fail** | Teacher/deployer identity is nonblank, correct, and expected-domain | Owner's account | Teacher-side operation |
| **B — pilot correctness** | Two accounts in one browser profile report the active account, not the first-signed-in account | Teacher plus any one other domain account; a teacher/student pair is sufficient | Shared-computer attribution story; a wrong result is the F2 failure mode |
| **B — pilot correctness** | Switching accounts mid-session reports the newly active account | Same two accounts | Shared-computer attribution story |
| **C — degradation, deferrable** | Renamed account | IT-provisioned test account; cannot be done with a real student | Graceful mid-year rename behavior, not architecture viability |
| **C — degradation, deferrable** | Disabled account | IT-provisioned test account; cannot be done with a real student | Graceful withdrawal behavior, not architecture viability |

### Email-safe result and real-student safeguards

The **Copy email-safe report** control emits only the probe version, random run id, fixed account and
condition labels, identity nonblank/read statuses, intended-viewer match, expected-domain match,
active/effective relationship (`same`, `different`, `blank`, or `unavailable`), and fixed deployment
settings labels. It excludes email addresses, expected domains, raw settings, URLs, and account
identifiers. A student can paste this block into an email or chat, but should not send a screenshot
or raw page/JSON output.

Prefer one synthetic account because the run can be repeated after redeploy or settings changes.
If a real student supplies Tier A or B, record pass/fail only and never an email address in any
tracked file; the student uses only their own normal sign-in and never enters credentials in front
of others; and explain plainly what the identity behavior is being tested. A real student also
reveals the true student authorization/consent experience, which should be noted without recording
identity.

## Hard stop

Blank, wrong, outside-domain, or ambiguous server-derived identity is a hard fail for
account-attributed cloud mode. Do not work around it by trusting a client-supplied email. Local
play may continue, but the cloud design must return to an owner decision.
