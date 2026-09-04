# User Acceptance Test and Demonstration Experiment — Report

Final Milestone, deliverable 3. Project Catalyst F12, Project ID 1200088.

Current as of `517e9a4` (2026-09-04).

---

## 1. What was tested, and with whom

The demonstration ran during the NEO Shikoku 88 Festival across Kagawa, Tokushima,
Ehime and Kochi. The application was used in production by two distinct groups:

- **Experience providers** — local businesses and organisations who listed an
  experience, received reservations through the app, approved or declined them,
  notified participants of changes, and recorded attendance.
- **Participants** — residents and visitors who searched for experiences and
  booked them.

The user acceptance test targeted the **experience providers**. They are the group
the Catalyst milestone calls community leaders: each operates on behalf of an
organisation in the region, and each used the full operational surface of the
application rather than a single booking flow.

### Survey instrument

A questionnaire was distributed after the festival to everyone involved.
**144 responses** were received in total. The questionnaire served both audiences,
and the application-specific sections were shown only to experience providers, so
those sections carry **44–47 responses** depending on the question. All figures
below state their own denominator.

---

## 2. Results

### 2.1 Overall satisfaction with the application

> *"How satisfied were you with the overall usability and experience of this
> application?"* — n = 44

| Response | Count | Share |
| --- | ---: | ---: |
| Very satisfied (exceeded expectations) | 4 | 9.1% |
| Satisfied (achieved my goal smoothly) | 17 | 38.6% |
| Neither | 12 | 27.3% |
| Somewhat dissatisfied | 7 | 15.9% |
| Dissatisfied | 4 | 9.1% |

**Satisfied or better: 21 of 44 — 47.7%.**

The milestone's acceptance criterion asks for over 70% of community leaders
satisfied. **This measurement does not meet that threshold, and we are reporting
it as measured.** Section 4 sets out what the number reflects and what we are
doing about it.

### 2.2 Usability by function

Each function was rated 1–5. A small number of out-of-range entries (values above
5) were excluded as data-entry errors; the count excluded is stated per row.

| Function | n | Mean | Median | Rated 4–5 | Excluded |
| --- | ---: | ---: | ---: | ---: | ---: |
| Reservation handling | 45 | 3.36 | 3.0 | 48.9% | 4 |
| Change / cancellation notices | 45 | 3.24 | 3.0 | 44.4% | 4 |
| Running an experience | 46 | 3.17 | 3.0 | 41.3% | 3 |
| Registering an experience | 46 | 3.11 | 3.0 | 39.1% | 3 |
| **Search / discovery** | **47** | **2.89** | **3.0** | **31.9%** | **2** |

Every function has a median of 3.0. The application was usable — providers ran a
real festival on it — but it was not experienced as effortless. **Search scores
lowest on every measure**, and it is the only function whose mean falls below the
midpoint.

### 2.3 LINE integration

Multiple selection, n = 44, 56 selections.

| Response | Selections |
| --- | ---: |
| Communication was smooth | 15 |
| Account registration was easy | 10 |
| Nothing in particular | 13 |
| Too many steps | 6 |
| Hard to use | 6 |
| A conventional ID / password would be better | 5 |
| If we use LINE, I want to be reachable on LINE | 1 |

Positive selections outnumber negative ones (25 to 18), which supports the design
decision to deliver the application inside LINE rather than as a standalone app or
a Web3 wallet. The dissenting group is real but small: five providers would have
preferred a conventional account.

### 2.4 The experience programme itself

> *"About the experience programme you provided"* — 1–5, n = 44

Rated 4–5: **27 of 44 — 61.4%** (5: 19 · 4: 8 · 3: 12 · 2: 4 · 1: 1)

### 2.5 Intent to continue

| Question | Result |
| --- | --- |
| "I would provide an experience again next time" (1–5, n = 44) | Rated 4–5: **33 of 44 — 75.0%** |
| "May we contact you about participating next year?" (n = 44) | Yes: **37 of 44 — 84.1%** |

---

## 3. Qualitative feedback

Nine respondents left free-text comments. Three themes carry actionable content;
the remainder were expressions of thanks and of interest in continuing.

**Discoverability — the strongest signal.** One provider wrote that they wanted
*"a way of presenting things that lets customers see at a glance what experiences
exist and where."* This matches the quantitative result exactly: search is the
lowest-scoring function (mean 2.89). Two independent measurements point at the
same weakness, which makes it the clearest finding in this test.

**Rigidity of the listing format.** A provider noted that *"the application felt
inflexible — it would be better if the selection fields and notes could be built
to suit each individual experience."* The current model assumes a common shape for
every experience; providers with unusual formats had to work around it.

**Off-app materials.** One comment concerned the printed pamphlet rather than the
application: *"the pamphlet was hard to use without explanation, which made
promotion difficult."* Recorded here because discovery of experiences spans both
the app and the printed material.

A separate comment reported an operational constraint rather than a product one:
one provider kept their experience open for the entire festival period and was too
occupied to visit others, and suggested cross-provider collaboration formats.

---

## 4. Analysis

**The satisfaction figure and the continuation figure measure different things.**
Satisfaction with the application sits at 47.7%, while intent to provide again
sits at 75% and willingness to be contacted for next year at 84%. Providers found
the festival worth doing and intend to return; they found the software adequate
rather than good. We read the gap as a product signal, not as evidence that the
satisfaction figure is wrong.

**The distribution is centred, not polarised.** The largest single response is
"satisfied" (38.6%), the second largest is "neither" (27.3%), and every usability
function has a median of exactly 3.0. This is the profile of an application that
works but requires effort — not one that failed. Dissatisfied responses
(25.0% combined) are a minority, but a substantial one.

**Search is the specific defect.** It is the lowest-rated function quantitatively
and the subject of the most concrete qualitative comment. Improving discovery is
the single change most likely to move the satisfaction figure.

### Actions taken and planned

| Finding | Action |
| --- | --- |
| Search / discovery rated lowest | Prioritised for redesign. The requirement is a view that lets a participant see what experiences exist and where, rather than a list to be filtered. |
| Listing format too rigid | Per-experience configurable fields and notes are under consideration for the next iteration. |
| LINE onboarding has too many steps for some | The step count is being reviewed. Replacing LINE authentication with ID/password is not planned, as the majority found registration easy and LINE is what the target residents already use. |
| Off-app discovery materials | Handed to the event organising side; outside the application's scope. |

---

## 5. Tester information

The acceptance criterion asks for tester initials, region of residence, attribute
and result.

**Available:** company or personal name for 36 of 44 respondents, who consented to
be contacted about next year's programme. Initials can be supplied to reviewers on
request; we have not published them here because the responses were collected
without notice that identifying information would be made public.

**Not available:** region of residence and attribute. **The survey instrument did
not include these questions.** We are reporting this as a gap in the survey design
rather than reconstructing the fields after the fact.

What can be stated about the tester population as a whole: all respondents to the
application sections were experience providers operating in the four prefectures
of Shikoku (Kagawa, Tokushima, Ehime, Kochi) during the festival period, each
representing a business or organisation rather than participating as an individual
consumer.

---

## 6. Acceptance result

| Criterion | Result |
| --- | --- |
| Over 70% of community leaders satisfied with the application | **Not met — 47.7% (21 of 44)** |
| Feedback collected and analysed, improvement areas identified | Met — Sections 2–4 |
| Tester initials, region, attribute, result shared | **Partially met** — names held for 36 respondents; region and attribute were not collected |

We are reporting both shortfalls as measured rather than restating them against a
more favourable denominator. Counting "neither" responses as satisfied would
produce 75.0% and clear the threshold, and we have chosen not to present the
figure that way.

---

## Appendix — Platform usage statistics

Cumulative, across all communities on the platform.

| Metric | Value |
| --- | ---: |
| Total members | 1,052 |
| Total P2P transaction volume (internal record) | 8,682,000 |
| Total points issued | 2.22 billion |
| Total grant volume | 65,829,000 |
| Verified IDs (DID) issued | 912 |
| Credentials (VC) issued | 134 |

By community:

| Community | Members | P2P volume | Points issued | Grants | DID | VC |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Kibotcha · Izu | 582 | 8,557,000 | 2.22bn | 65,223,000 | 464 | 16 |
| Kotohira | 53 | 111,000 | 1,000,000 | 450,000 | 35 | 15 |
| DAIS | 49 | 0 | 0 | 0 | 48 | 48 |
| NEO88 | 368 | 14,000 | 1,020,000 | 156,000 | 365 | 55 |

These figures are internal activity records. They do not represent fiat currency
or redeemable economic value.

NEO88 shows 368 members and recorded activity but no activity in the most recent
month: it was designed as a time-limited demonstration community and its
demonstration phase has concluded. DAIS shows DIDs and VCs approximately equal to
its member count and no economic activity, which reflects its configuration as a
credential-only community.
