# Backend Data Requirements for About Page

Dokumen ini menjelaskan data yang perlu diisi di admin panel agar halaman About sesuai dengan planning design.

---

## Ringkasan API yang Digunakan

| Section | API Endpoint | Status |
|---------|--------------|--------|
| Header & Story | `GET /api/v1/about` | ✅ Sudah ada |
| Experience | `GET /api/v1/experiences` | ✅ Sudah ada |
| Education | `GET /api/v1/education` | ✅ Sudah ada |
| Certifications | `GET /api/v1/certifications` | ✅ Sudah ada |
| Profile (untuk avatar) | `GET /api/v1/profile` | ✅ Sudah ada |

---

## 1. About Content Table

**Tabel:** `about_content`  
**API:** `GET /api/v1/about`  
**Perubahan Table:** ❌ Tidak perlu

### Sections yang Harus Diisi

| section_key | title | content | image_url | story_tag | story_year |
|-------------|-------|---------|-----------|-----------|------------|
| `header` | "Behind the Analysis" | - | - | - | - |
| `story` | "It started with a broken spreadsheet." | JSON array paragraf | URL avatar | "Story" | "Est. 2018" |
| `funFact` | "Fun Fact" | Teks deskripsi | - | - | - |
| `offline` | "Offline Mode" | Teks deskripsi | - | - | - |

### Contoh Data untuk `story.content`

Kolom content menyimpan JSON array string paragraf:
```json
[
  "My path into tech wasn't traditional. While working in operations, I noticed my team spending hours manually reconciling data across three different systems. I couldn't ignore the inefficiency.",
  "I taught myself SQL on weekends to automate those reports. That first "aha" moment—seeing a 4-hour task turn into a 5-second query—hooked me on problem-solving. Today, I bring that same relentless drive for efficiency to enterprise-scale systems."
]
```

---

## 2. Certifications Table

**Tabel:** `certifications`  
**API:** `GET /api/v1/certifications`  
**Perubahan Table:** ⚠️ Opsional - Tambah kolom `description`

### Kolom yang Digunakan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `name` | VARCHAR | `"CSPO®"` | Nama sertifikasi |
| `short_name` | VARCHAR | `"CSPO"` | Singkatan (tampil sebagai title) |
| `subtitle` | VARCHAR | `"Certified Scrum Product Owner"` | Deskripsi singkat |
| `issuer` | VARCHAR | `"Scrum Alliance"` | Penerbit sertifikasi |
| `issue_date` | DATE | `2023-06-15` | Untuk ambil tahun |
| `icon` | VARCHAR | `"verified_user"` | Material Symbol icon |
| `description` | TEXT | `"Mastered backlog..."` | **BARU** - Deskripsi detail |

### Kolom Baru: `description`

Target HTML menampilkan deskripsi panjang di setiap kartu sertifikasi. Kolom ini **belum ada** di schema saat ini.

**Opsi:**
1. ✅ **Gunakan kolom yang ada** - Pakai `subtitle` untuk deskripsi
2. ⚡ **Tambah kolom baru** - Lebih fleksibel untuk masa depan

```sql
-- Opsional: Tambah kolom description ke certifications
ALTER TABLE certifications ADD COLUMN description TEXT;
```

### Contoh Data Certifications

```
1. Name: "CSPO®"
   Short Name: "CSPO"
   Subtitle: "Certified Scrum Product Owner"
   Issuer: "Scrum Alliance"
   Issue Date: 2023-06-15
   Icon: "verified_user"
   Description: "Mastered backlog prioritization, stakeholder management, and maximizing value delivery in Agile environments."

2. Name: "IIBA-CBAP"
   Short Name: "CBAP"
   Subtitle: "Certified Business Analysis Professional"
   Issuer: "IIBA"
   Issue Date: 2022-03-10
   Icon: "badge"
   Description: "Deep dive into requirements lifecycle management, strategy analysis, and solution evaluation techniques."

3. Name: "AWS Certified Cloud Practitioner"
   Short Name: "AWS Certified"
   Subtitle: "Cloud Practitioner"
   Issuer: "Amazon Web Services"
   Issue Date: 2021-09-20
   Icon: "cloud"
   Description: "Gained foundational knowledge of cloud architecture, deployment services, and security best practices."
```

---

## 3. Experiences Table

**Tabel:** `experiences`  
**API:** `GET /api/v1/experiences`  
**Perubahan Table:** ❌ Tidak perlu

### Kolom yang Digunakan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `title` | VARCHAR | `"Senior Business System Analyst"` | Job title |
| `company` | VARCHAR | `"FinTech Corp"` | Nama perusahaan |
| `location` | VARCHAR | `"New York, NY"` | Lokasi |
| `start_date` | DATE | `2021-01-01` | Tanggal mulai |
| `end_date` | DATE | null | null = current |
| `is_current` | BOOLEAN | true | Apakah masih bekerja |
| `highlights` | JSONB | `["Spearheaded..."]` | Array bullet points |
| `tags` | JSONB | `["JIRA", "Salesforce"]` | Array skill tags |

### Format `highlights` (JSONB)

```json
[
  "Spearheaded the migration of legacy CRM to Salesforce, reducing data redundancy by <strong>40%</strong>.",
  "Led requirement gathering workshops for 5 major product releases."
]
```

> **Note:** Gunakan `<strong>` untuk highlight metrics

---

## 4. Education Table

**Tabel:** `education`  
**API:** `GET /api/v1/education`  
**Perubahan Table:** ❌ Tidak perlu

### Kolom yang Digunakan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `degree` | VARCHAR | `"B.S. Information Systems"` | Gelar |
| `school` | VARCHAR | `"University of Technology"` | Nama universitas |
| `start_year` | INT | `2014` | Tahun mulai |
| `end_year` | INT | `2018` | Tahun lulus |
| `gpa` | VARCHAR | `"3.8"` | IPK opsional |
| `achievements` | JSONB | `["Dean's List"]` | Pencapaian |

---

## 5. Profile Table (untuk avatar)

**Tabel:** `profile`  
**API:** `GET /api/v1/profile`  
**Perubahan Table:** ❌ Tidak perlu

Yang dipakai:
- `avatar_url`: Foto ditampilkan di story card
- `resume_url`: Link download CV di experience section

---

## Checklist Setup Data

### About Content (Wajib)
- [ ] Section `header` dengan title dan subtitle
- [ ] Section `story` dengan title, content (JSON array), story_tag, story_year
- [ ] Section `funFact` dengan title dan content
- [ ] Section `offline` dengan title dan content

### Certifications (Wajib - minimal 3)
- [ ] Cert 1: name, short_name, subtitle, issue_date, icon, description
- [ ] Cert 2: name, short_name, subtitle, issue_date, icon, description
- [ ] Cert 3: name, short_name, subtitle, issue_date, icon, description

### Experiences (Wajib - minimal 2)
- [ ] Experience 1 (current): title, company, location, start_date, is_current=true, highlights, tags
- [ ] Experience 2 (past): title, company, location, start_date, end_date, highlights

### Education (Wajib - minimal 1)
- [ ] Primary education: degree, school, end_year, achievements

### Profile
- [ ] `avatar_url` terisi
- [ ] `resume_url` terisi

---

## Perubahan Database yang Dibutuhkan

### Opsional: Tambah kolom `description` ke `certifications`

```sql
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS description TEXT;
```

Ini memungkinkan deskripsi yang lebih panjang terpisah dari `subtitle`.

---

## Catatan Hardcode Fallback

Halaman about saat ini memiliki **hardcoded fallback** yang akan ditampilkan jika data dari API kosong:
- 3 certification cards (CSPO, CBAP, AWS)
- 2 experience entries
- 1 education entry
- Story, Fun Fact, dan Offline content default

Setelah data diisi di admin, hardcode fallback tidak akan muncul.
