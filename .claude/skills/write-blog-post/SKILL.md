---
name: write-blog-post
description: Research and write a new blog post for the LENGOLF website. Use when the user wants to create a new blog article.
argument-hint: "[topic or title]"
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch, Bash
---

# Write Blog Post for LENGOLF

You are writing a blog post for LENGOLF, an indoor golf simulator and bar in Bangkok at The Mercury Ville @ BTS Chidlom.

## Process

Follow these steps in order. Do NOT skip the research phase.

### 1. Check Existing Content

Before writing, check what already exists to avoid overlap:

Query the `blog_posts` table for existing titles and slugs so you don't duplicate
an existing post. Read `lib/blog.ts` for the query helpers; the table is reachable
only server-side (see the Supabase rules in CLAUDE.md).

**Do not shell out to `npx -y <name>` to do this.** The line that used to sit here
invoked `supabase-mcp-server`, which does not exist on npm (the real package is the
scoped `@supabase/mcp-server-supabase`). `npx -y` installs and executes without
confirmation, so an unregistered name is a squat vector on a machine whose
`.env.local` holds `SUPABASE_SERVICE_ROLE_KEY` - and `2>/dev/null || true` made the
failure invisible, so this step silently did nothing.

### 2. Research the Topic

**This step is mandatory.** Do at least 3 web searches relevant to the topic:
- Search for the specific topic + "Bangkok" to get local context
- Search for competitor/alternative content on the same topic
- Search for recent facts, data, or trends (use current year)

Gather verified facts: venue names, locations, prices, dates, descriptions. Never invent details.

### 3. Write the Post

**Voice and style:**
- Conversational and direct. Write like a knowledgeable friend, not a marketing brochure.
- Open with a hook that earns the next paragraph — no "Welcome to our guide about..." openings.
- Use specific Bangkok details (BTS stations, neighbourhood names, real prices in THB, weather facts).
- Avoid generic filler phrases: "vibrant city," "bustling metropolis," "rich culture," "hidden gem."
- Don't over-bold keywords for SEO. Use `<strong>` only where emphasis genuinely helps the reader.
- LENGOLF should appear naturally in the content, not be shoehorned in as a sales pitch.
- End with a clear but non-pushy CTA linking to `booking.len.golf` or `len.golf`.

**Structure:**
- Use proper HTML tags: `<h3>` for sections, `<h4>` for subsections, `<p>` for paragraphs, `<ul><li>` for lists.
- Keep paragraphs short (2-4 sentences max).
- Aim for 1,000-1,500 words (roughly 5,000-8,000 characters of HTML).
- Every `<li>` must be inside a single `<ul>` — never wrap each `<li>` in its own `<ul>`.
- Don't start content with a `<strong>` tag repeating the title.

**What NOT to include:**
- Manufacturer specs nobody cares about (e.g., "1000fps cameras," "Game Space Co., Ltd.")
- Generic descriptions of Bangkok that could be in any travel article
- Overly salesy language about LENGOLF ("unparalleled experience," "premier destination")
- Information you haven't verified through research

### 4. Create the Database Entry

Insert into Supabase `blog_posts` table with these fields:

```sql
INSERT INTO blog_posts (title, slug, excerpt, content, meta_title, meta_description, published_at, status)
VALUES (
  'Post Title',
  'post-slug-here',
  'A 1-2 sentence excerpt that makes someone want to read the full article.',
  '<p>HTML content here...</p>',
  'SEO Title',             -- under 60 chars; NO '| LENGOLF' (see below)
  'Meta description for search results.',  -- under 160 chars
  NOW(),
  'published'
);
```

- **slug**: lowercase, hyphenated, no special characters
- **excerpt**: 1-2 sentences, no HTML, compelling
- **meta_title**: under 60 characters, include primary keyword. **Never append
  `| LENGOLF`.** The root layout sets `title.template = '%s | LENGOLF'`, and the
  blog route returns `post.meta_title` as a plain string, so the brand is appended
  for you. Writing it yourself ships `... | LENGOLF | LENGOLF` - live on 9 of 27
  posts today because this block previously told you to.
- **meta_description**: under 160 characters, include a call-to-action or key benefit

### 5. Redeploy, or the post 404s

`app/[locale]/blog/[slug]/page.tsx` sets `dynamicParams = false`, so the route
serves only the slugs `generateStaticParams` produced at build time. `revalidate`
refreshes pages that were already built; it never adds new ones. **A post inserted
into the DB is unreachable at its own URL until a redeploy regenerates the params.**

Push any commit to `main` (an empty one is enough) and confirm the new URL returns
200 before telling anyone it is live. Smoke section L exists to catch exactly this
data-ahead-of-deploy state.

## LENGOLF Facts (verified)

Use these when referencing LENGOLF — do not embellish:

**These are a convenience copy. `lib/site-facts.ts` is the single source of truth**
(it says so in its own header) and already holds the opening hours, location and
max-players-per-bay. Check it before trusting anything below: the 10 AM opening
time this file shipped with was drift from exactly that module, and a copy that
cannot drift is better than a copy that is currently right.

- **Name:** LENGOLF
- **Location:** The Mercury Ville @ BTS Chidlom, Floor 4, Bangkok
- **Simulators:** Bravo simulators from South Korea
- **Capacity:** Up to 5 people per bay, no extra charge per person
- **Hours:** 9 AM - 11 PM daily
- **Features:** Full bar, food service to bays, professional coaching available
- **Booking:** booking.len.golf
- **Website:** len.golf
- **Bay rates page:** len.golf/golf
- **Events page:** len.golf/events
- **Lessons page:** len.golf/lessons
