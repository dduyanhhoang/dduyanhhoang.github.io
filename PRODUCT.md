# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Four audiences arrive at the same single page, and none is being traded away for another:

- **Research supervisors and graduate admissions** — professors, lab PIs, and MSc/PhD admissions readers deciding whether this person is a real researcher worth replying to.
- **Internship and job recruiters** — AI/ML hiring contacts scanning for competence and a way to make contact.
- **Peers and collaborators** — researchers and developers arriving from a repo, a paper, or a conversation, looking for the rest of the work.
- **Social audience** — viewers from YouTube and Instagram who want the one link that leads everywhere else.

The shared job across all four is the same and it is short: *establish who this person is, and get to the right destination.* Nobody stays. The page succeeds when a visitor leaves it on purpose, via the correct link.

## Product Purpose

A personal link hub for Hoang Dinh Duy Anh at `dduyanhhoang.github.io` — the canonical, permanent address to hand out. It states identity (name, field, location, availability) and routes to the places the actual work lives: email, GitHub, LinkedIn, YouTube, Instagram.

Success is a visitor who, within seconds, knows who this is and clicks through to the destination they came for.

## Positioning

This is a person, not a product. The only durable claim is factual identity: an Artificial Intelligence student at FPT University (Hoa Lac Campus), grounded in applied mathematics, doing Quantum Machine Learning research at QMOS Lab, based in Hanoi, Vietnam.

**The page deliberately shows less than this.** On 2026-08-22 the user removed the institution, the lab, and the city from the surface, on the grounds that LinkedIn and ORCID already carry them. The page now states role, field, and country only. These facts remain true and remain product truth; they are withheld from the surface by choice, not because they are unconfirmed. Recorded because the cost is real and was accepted knowingly: the pinned form is a preprint title block, where an empty affiliation slot is a legible signal to exactly the audience the page most needs to convince, and recovering the affiliation costs an admissions reader a click during a visit that lasts well under a minute. Prior published site copy named the research areas as quantum kernel methods applied to EEG biosignal processing, Hamiltonian/QUBO constraint formulation for scheduling optimization, and Vietnamese lip-reading dataset work, alongside teaching-assistant experience in data analytics.

## Operating Context

The link is pasted into email signatures, CVs, LinkedIn and GitHub profiles, and social bios. Most arrivals are mobile, from a tap in another app, and last well under a minute. Many arrivals are cold: the visitor may know only a name or a repo.

## Capabilities and Constraints

- **Scope is one page.** As of 2026-08-22 the site is deliberately reduced to a single link-hub card. The former multi-page portfolio (Home, About, Research, Projects, Achievements, Resume, Writings, Links, Thanks) is deleted and is not planned to return. Adding pages is a decision the user has not made.
- **Why it was cut:** the portfolio structure existed ahead of content to fill it and shipped "Under Construction" pages. The link hub is the honest size of what exists today.
- **Stack** is React 18 + Vite, deployed as a static build to GitHub Pages via `.github/workflows/deploy.yml`. Client-side only; no backend, no database, no analytics.
- **Open decision:** whether the site ever grows past a single page. Recorded as undecided, not as "no".

## Brand Commitments

Name and identity as published: **Hoang Dinh Duy Anh**. Existing self-description on the site is "AI Student · Quantum ML Researcher", Hanoi, Vietnam, with an "Open to Research & Internships" status. Avatar is sourced live from the GitHub profile image. Voice in prior copy is plain, first-person, and unembellished — no superlatives about himself.

## Evidence on Hand

**The links are the entire verified inventory.** Seven destinations exist and can be linked: Email, ORCID (`0009-0006-9245-8896`), GitHub, LinkedIn, YouTube, Instagram, Facebook.

**The page ships four of them.** On 2026-08-22 the user cut YouTube, Instagram and Facebook from the surface, leaving Email, ORCID, GitHub and LinkedIn. The three removed accounts still exist and remain product truth; they are withheld from this surface by choice. The trade: the page now addresses the professional and research audiences only, and the social audience recorded under `## Users` arrives at a page that no longer routes them anywhere they came for.

An ORCID iD is a registered identifier, not a publication record. It must not be presented as evidence of published work.

Nothing else is confirmed publishable as of 2026-08-22. Specifically, future work must **not** present as finished, published, or verifiable:

- Psipose (the scikit-learn-compatible quantum ML library on PennyLane) — described in deleted source, not confirmed public.
- QSVM-EEG, the timetabling QUBO work, or the Vietnamese lip-reading dataset work — described as research activity, with no confirmed paper, preprint, or link.
- Any CV or resume file — none confirmed to exist.

Metrics, citation counts, testimonials, employers, awards, and project counts do not exist and must never be invented. The prior site's "Project Two" / "Project Three" placeholder cards are exactly the failure mode to avoid.

## Product Principles

1. **Say only what is true today.** No "Under Construction", no placeholder cards, no implied output. An honest short page beats a padded long one.
2. **Routing is the job.** Every element either establishes identity or moves the visitor to a destination. Anything that does neither is decoration to be justified or cut.
3. **One page, held to one page.** Growth pressure gets answered with content, not with new routes.
4. **Serve four audiences with one artifact.** The same card must read credibly to an admissions reader and to a YouTube viewer; that rules out both academic stiffness and creator-flavored hype.
5. **Mobile arrival is the default case**, from a tap in another app, on a slow connection.

## Accessibility & Inclusion

No user-specific requirement was established. Standard obligations apply: the page is a list of links and must work as one — real anchors, visible focus, sufficient contrast, and full function without hover or pointer precision.
