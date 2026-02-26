# Skills & Scripts

## Claude skills (slash commands)

| Command | What it does |
|---|---|
| `/audit-assets` | Audits `img/` against `projects.md`, shows a rename diff, and fixes mismatched filenames + updates paths on confirmation |

## npm scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts live-server at `http://localhost:3000` with hot reload |
| `npm run convert` | Converts all `.mov` files in `img/` to `.mp4` (CRF 18), updates references in `projects.md`, and archives originals to `img/mov/` |

## Typical asset workflow

```
# 1. Drop new .mov files into img/
npm run convert        # convert + archive + fix .mov refs in projects.md

# 2. If files were renamed or moved around
/audit-assets          # review rename diff, confirm to apply
```
