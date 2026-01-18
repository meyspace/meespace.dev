# Backend Data Requirements for Project Detail Page

Dokumen ini menjelaskan data yang perlu diisi di admin panel agar halaman Detail Project sesuai dengan planning design.

---

## Ringkasan API yang Digunakan

| Section | API Endpoint | Status |
|---------|--------------|--------|
| Project Detail | `GET /api/v1/projects/{slug}` | ✅ Sudah ada |
| Related Projects | `GET /api/v1/projects?limit=4` | ✅ Sudah ada |
| Author Info | `GET /api/v1/profile` | ✅ Sudah ada |

---

## 1. Projects Table

**Tabel:** `projects`  
**API:** `GET /api/v1/projects/{slug}`  
**Perubahan Table:** ⚠️ Beberapa kolom baru opsional

### Kolom yang Digunakan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `title` | VARCHAR | `"Global ERP System Migration"` | Judul project |
| `slug` | VARCHAR | `"global-erp-migration"` | URL slug |
| `short_description` | TEXT | `"Harmonizing cross-border..."` | Deskripsi singkat (hero subtitle) |
| `full_description` | TEXT | Markdown | Deskripsi lengkap |
| `category` | VARCHAR | `"System Migration"` | Kategori project (badge utama) |
| `status` | VARCHAR | `"completed"` | Status (completed/in-progress) |
| `year` | VARCHAR | `"Oct 2023"` | Waktu selesai |
| `featured_image_url` | TEXT | `"https://..."` | **PENTING:** Gambar hero |
| `problem_statement` | TEXT | Markdown | Deskripsi masalah |
| `solution_description` | TEXT | Markdown | Deskripsi solusi |

### Kolom Baru yang Direkomendasikan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `duration` | VARCHAR | `"18 Months"` | Durasi project |
| `client_type` | VARCHAR | `"Fortune 500"` | Tipe klien (badge) |
| `industry` | VARCHAR | `"Retail"` | Industri klien (badge) |
| `tags` | JSONB | `["Enterprise", "Migration"]` | Tag tambahan (badges) |

```sql
-- Opsional: Tambah kolom baru
ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_type VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
```

---

## 2. Deliverables (JSONB Column)

**Kolom:** `deliverables` di tabel `projects`  
**Tipe:** JSONB array

### Format Data

```json
[
  {
    "title": "PRD Documentation",
    "description": "Authored comprehensive Product Requirement Documents detailing 200+ functional requirements.",
    "icon": "description"
  },
  {
    "title": "UML Modeling",
    "description": "Created activity diagrams and sequence charts to visualize complex cross-border workflows.",
    "icon": "schema"
  },
  {
    "title": "Stakeholder Alignment",
    "description": "Mediated conflicting requirements between regional VPs to achieve process standardization.",
    "icon": "groups"
  },
  {
    "title": "Data Migration",
    "description": "Defined mapping rules for migrating 10TB of historical transaction data.",
    "icon": "database"
  }
]
```

### Icon Options (Material Symbols)

| Icon | Penggunaan |
|------|------------|
| `description` | Documentation, PRD, BRD |
| `schema` | UML, diagrams, architecture |
| `groups` | Stakeholder, team, workshops |
| `database` | Data, migration, storage |
| `code` | Development, programming |
| `analytics` | Analysis, reporting |
| `security` | Security, compliance |
| `integration_instructions` | API, integration |

---

## 3. Outcomes (JSONB Column)

**Kolom:** `outcomes` di tabel `projects`  
**Tipe:** JSONB array

### Format Data

```json
[
  {
    "value": "25%",
    "label": "Efficiency Boost",
    "description": "Streamlined operations by replacing 4 legacy systems with a single unified cloud ERP.",
    "icon": "speed"
  },
  {
    "value": "4h",
    "label": "Reconciliation Time",
    "description": "Reduced monthly financial close time from 12 days to just 4 hours.",
    "icon": "timeline"
  },
  {
    "value": "$2.4M",
    "label": "Annual Savings",
    "description": "Cost reduction from decommissioning obsolete infrastructure.",
    "icon": "savings"
  }
]
```

### Icon Options for Outcomes

| Icon | Penggunaan |
|------|------------|
| `speed` | Efficiency, performance |
| `timeline` | Time reduction |
| `savings` | Cost savings, ROI |
| `trending_up` | Growth, improvement |
| `inventory` | Inventory, stock |
| `verified` | Quality, compliance |

---

## 4. Tools (JSONB Column atau Relasi)

**Opsi 1:** JSONB column `tools` di `projects`  
**Opsi 2:** Relasi ke tabel `tech_stack`

### Format JSONB

```json
[
  { "name": "Jira", "icon": "task_alt", "icon_url": null },
  { "name": "SQL Server", "icon": "database", "icon_url": null },
  { "name": "Lucidchart", "icon": "draw", "icon_url": null },
  { "name": "Python", "icon": "code", "icon_url": "https://..." },
  { "name": "Tableau", "icon": "table_view", "icon_url": null }
]
```

Jika `icon_url` ada, akan digunakan gambar. Jika tidak, akan pakai Material Symbol dari `icon`.

---

## 5. Gallery Images (JSONB Column)

**Kolom:** `gallery_images` di tabel `projects`  
**Tipe:** JSONB array

### Format Data

```json
[
  {
    "url": "https://storage.example.com/project1/screenshot1.png",
    "alt": "Dashboard Overview",
    "caption": "Main dashboard showing real-time metrics"
  },
  {
    "url": "https://storage.example.com/project1/screenshot2.png",
    "alt": "Data Flow Diagram",
    "caption": "Architecture diagram of the data pipeline"
  }
]
```

Gambar akan ditampilkan dalam carousel yang sudah ada (`ImageCarousel` component).

---

## 6. Profile Table (untuk Author)

**Tabel:** `profile`  
**API:** `GET /api/v1/profile`

Yang digunakan:
- `full_name` - Nama author
- `role` - Role/jabatan  
- `avatar_url` - Foto author

---

## Featured Image Guidelines

| Property | Rekomendasi |
|----------|-------------|
| **Aspect Ratio** | 16:9 atau lebih lebar |
| **Minimum Width** | 1920px |
| **Format** | WebP atau JPEG |
| **File Size** | < 500KB (compressed) |
| **Style** | Relevan dengan project (screenshot, diagram, abstract) |

---

## Checklist Setup Data per Project

### Basic Info (Wajib)
- [ ] `title` terisi
- [ ] `slug` unique
- [ ] `short_description` terisi (hero subtitle)
- [ ] `category` terisi (badge utama)
- [ ] `featured_image_url` terisi (hero image)
- [ ] `status` = "completed" atau "in-progress"

### Content (Wajib minimal salah satu)
- [ ] `problem_statement` terisi (Markdown)
- [ ] `solution_description` terisi (Markdown)
- [ ] `full_description` terisi (Markdown)

### Optional (Recommended)
- [ ] `year` - Tahun/bulan selesai
- [ ] `duration` - Durasi project
- [ ] `client_type` - Tipe klien
- [ ] `industry` - Industri
- [ ] `tags` - Array tag tambahan
- [ ] `deliverables` - Array JSONB
- [ ] `outcomes` - Array JSONB dengan metrics
- [ ] `tools` - Array JSONB tools
- [ ] `gallery_images` - Array JSONB screenshots

### Profile (untuk Author fallback)
- [ ] `full_name` terisi
- [ ] `role` terisi
- [ ] `avatar_url` terisi

---

## Perubahan Database yang Dibutuhkan

### Opsional: Penambahan kolom

```sql
-- Kolom baru untuk project detail
ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_type VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS outcomes JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tools JSONB DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]';
```

> **Note:** Semua kolom di atas bersifat opsional. Jika tidak ada, halaman akan tetap bekerja dengan data yang tersedia atau menampilkan fallback hardcoded.

---

## Catatan Hardcode Fallback

Halaman saat ini memiliki **hardcoded fallback** yang ditampilkan jika data dari API kosong:
- Demo project "Global ERP System Migration"
- 4 deliverables contoh
- 3 outcomes metrics
- 5 tools
- 2 related projects

Setelah data asli diisi, fallback tidak akan muncul.
