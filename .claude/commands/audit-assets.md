# Audit and fix asset names

Audit the `img/` folder against `projects.md` and rename any files that don't match the naming convention. Update all references in `projects.md` to match.

## Naming convention

Every content image follows: **`{project-id}-{bucket}-{n}.{ext}`**

- **project-id** — the slug on the `# slug` line that opens each project block (e.g. `# sandbox` → `sandbox`)
- **bucket** — the first word of the section label before `|`, lowercased, alphanumeric only (e.g. `### Build + validate | ...` → `build`, `### Research + strategy | ...` → `research`)
- **n** — 1-based sequential position of that file within the bucket's `img:` list, counting only `img/` files (not diagrams)
- **ext** — unchanged from the current file

### What to exclude from renaming

- Thumbnails: `*-thumb.*`
- Hover images: `*-hover.*`
- Device frame images: `*-mock.*` (unless it's a `device-image:` that was already renamed into the convention — leave those alone)
- Logos: `logo-*`
- Diagrams: `.mmd` files referenced in `img:` fields
- Files in `img/mov/` (already archived originals)
- Any file not referenced anywhere in `projects.md`

### Special case: `device-image:`

The `device-image:` field uses the same file as one of the `img:` entries in the Design section. When that file is renamed, update both references.

---

## Steps

1. **Read `projects.md`** in full.

2. **Build the expected rename map.** For each project:
   - Note the project-id from the `# slug` line
   - For each `### Section | ...` that contains an `img:` field:
     - Derive the bucket slug (first word before `|`, lowercased, letters only)
     - List the `img/` file paths in order (skip diagrams — `.mmd` files)
     - Assign sequential numbers starting at 1
     - Compute expected filename: `{project-id}-{bucket}-{n}.{ext}`
   - Also note any `device-image:` values that point to the same file as an `img:` entry

3. **List actual files** in `img/` (excluding `img/mov/` and excluded categories above).

4. **Produce a diff table** with three columns:
   - Current filename
   - Expected filename
   - Status: `rename` / `already correct` / `not in projects.md`

   Show the full table — including files that are already correct — so the full picture is clear.

5. **Ask for confirmation** before making any changes. If there are no renames needed, say so and stop.

6. **Execute on confirmation:**
   - `mv` each file that needs renaming
   - Update every occurrence of the old path in `projects.md` (both `img:` fields and `device-image:` fields)
   - Report what was changed
