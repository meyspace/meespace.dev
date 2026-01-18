# Backend Data Requirements for Home Page

Dokumen ini menjelaskan data yang perlu diisi di admin panel agar landing page sesuai dengan planning design.

---

## Ringkasan API yang Digunakan

| Section | API Endpoint | Status |
|---------|--------------|--------|
| Hero & Profile | `GET /api/v1/profile` | ✅ Sudah ada |
| Stats | `GET /api/v1/stats` | ✅ Sudah ada |
| Tools | `GET /api/v1/tech-stack` | ✅ Sudah ada |
| Skills | `GET /api/v1/skills` | ✅ Sudah ada |
| Projects | `GET /api/v1/projects` | ✅ Sudah ada |
| Blog | `GET /api/v1/blog` | ✅ Sudah ada |
| Settings | `GET /api/v1/settings` | ✅ Sudah ada |

---

## 1. Stats Table

**Tabel:** `stats`  
**API:** `GET /api/v1/stats`  
**Perubahan Table:** ❌ Tidak perlu

### Kolom yang Digunakan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `value` | VARCHAR(100) | `"5+"`, `"20+"` | Teks nilai statistik |
| `label` | VARCHAR(255) | `"Years of Experience in FinTech & SaaS"` | Deskripsi singkat |
| `icon` | VARCHAR(100) | `"verified"`, `"deployed_code"` | Material Symbol icon name |
| `color` | VARCHAR(50) | `"blue"`, `"green"` | Warna tema icon |
| `display_order` | INT | `1`, `2` | Urutan tampil |
| `is_active` | BOOLEAN | `true` | Aktif/tidak |

### Data yang Perlu Diisi di Admin

```
1. Value: "5+"
   Label: "Years of Experience in FinTech & SaaS"
   Icon: "verified"
   Color: "blue"

2. Value: "20+"
   Label: "Successful Enterprise Projects Delivered"
   Icon: "deployed_code"
   Color: "green"
```

**Admin URL:** `/admin/stats` (jika ada) atau via Database/Supabase

---

## 2. Tech Stack Table

**Tabel:** `tech_stack`  
**API:** `GET /api/v1/tech-stack`  
**Perubahan Table:** ✅ Opsional - Tambah `icon_url`

### Kolom yang Digunakan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `name` | VARCHAR(255) | `"Jira"`, `"Figma"` | Nama tool |
| `icon` | VARCHAR(100) | `"task_alt"` | Material Symbol (fallback) |
| `icon_url` | TEXT | `"https://..."` | URL gambar logo (prioritas) |
| `color` | VARCHAR(50) | `"blue"`, `"purple"` | Warna hover |

### Opsi Implementasi

**Opsi A: Pakai `icon` (Material Symbols)**
- Tidak perlu upload gambar
- Icon terbatas pada Material Symbols
- Admin isi: name, icon, color

**Opsi B: Pakai `icon_url` (Gambar Logo)**
- Upload gambar logo tiap tool
- Lebih akurat dengan logo asli (Jira, Confluence, dll)
- Perlu upload ke storage/bucket

> **Rekomendasi:** Gunakan `icon_url` untuk tools populer dengan logo yang berbeda (Jira, Confluence, Figma, dll)

---

## 3. Profile Table

**Tabel:** `profile`  
**API:** `GET /api/v1/profile`, `PUT /api/v1/profile`  
**Perubahan Table:** ❌ Tidak perlu

### Kolom yang Perlu Diisi

| Kolom | Contoh | Keterangan |
|-------|--------|------------|
| `full_name` | `"Sarah Jenkins"` | Nama ditampilkan di header, footer |
| `role` | `"Senior Business System Analyst"` | Role/jabatan |
| `status` | `"Open to Work"` | Badge status |
| `tagline` | `"Bridging Business Needs..."` | Headline hero |
| `short_bio` | `"Hi, I'm Sarah..."` | Bio singkat di hero |
| `avatar_url` | `"https://..."` | Foto profil |
| `resume_url` | `"https://..."` | **PENTING:** URL file CV/Resume |
| `email` | `"hello@sarahjenkins.com"` | Email kontak |
| `location` | `"San Francisco, CA"` | Lokasi |
| `social_links` | `{"linkedin":"...", "github":"..."}` | JSON object social |

### Format social_links (JSONB)

```json
{
  "linkedin": "https://linkedin.com/in/username",
  "github": "https://github.com/username",
  "twitter": "https://twitter.com/username"
}
```

---

## 4. Projects Table

**Tabel:** `projects`  
**API:** `GET /api/v1/projects`  
**Perubahan Table:** ❌ Tidak perlu

### Kolom yang Digunakan

| Kolom | Contoh | Keterangan |
|-------|--------|------------|
| `title` | `"E-commerce API Integration"` | Judul project |
| `short_description` | `"Facilitated the integration..."` | Ringkasan singkat |
| `year` | `"2023"`, `"2024"` | Tahun project (tampil sebagai badge) |
| `icon` | `"shopping_cart"` | Material Symbol |
| `icon_color` | `"blue"`, `"purple"` | Warna icon |
| `status` | `"published"` | Harus "published" untuk tampil |

### Tags untuk Project

**Tabel relasi:** `project_tag_relations` + `project_tags`

Perlu menambah tags ke setiap project:
- `PRD`, `UML`, `Agile`, `BPMN`, `SQL`, `Jira`, dll

**Admin:** `/admin/projects` → Edit Project → Tambah Tags

---

## 5. Blog Posts Table

**Tabel:** `blog_posts`  
**API:** `GET /api/v1/blog`  
**Perubahan Table:** ❌ Tidak perlu

### Kolom yang Digunakan

| Kolom | Contoh | Keterangan |
|-------|--------|------------|
| `title` | `"The Art of Writing PRDs"` | Judul artikel |
| `excerpt` | `"Mastering Product Requirement..."` | Ringkasan untuk card |
| `read_time_minutes` | `5`, `7` | Waktu baca (menit) |
| `featured_image_url` | `"https://..."` | Gambar card (opsional) |
| `status` | `"published"` | Harus "published" |

> **Note:** Jika `featured_image_url` kosong, akan tampil placeholder dengan overlay warna

---

## 6. Site Settings Table

**Tabel:** `site_settings`  
**API:** `GET /api/v1/settings`  
**Perubahan Table:** ❌ Tidak perlu

### Kolom untuk Footer/Contact

| Kolom | Contoh | Keterangan |
|-------|--------|------------|
| `contact_email` | `"hello@..."` | Email di contact section |
| `location` | `"San Francisco, CA"` | Lokasi di contact |
| `copyright_text` | `"© 2024 Sarah Jenkins..."` | Teks copyright footer |

---

## Checklist Sebelum Go-Live

### Profile (Wajib)
- [ ] `full_name` terisi
- [ ] `role` terisi
- [ ] `status` terisi (misal "Open to Work")
- [ ] `tagline` terisi
- [ ] `short_bio` atau `bio` terisi
- [ ] `avatar_url` upload foto
- [ ] `resume_url` upload file CV
- [ ] `email` terisi
- [ ] `social_links` terisi (LinkedIn, GitHub)

### Stats (Wajib untuk tampilan seperti design)
- [ ] Minimal 2 stats aktif
- [ ] Tiap stat punya value, label, icon, color

### Tech Stack (Wajib)
- [ ] Minimal 6 item untuk grid penuh
- [ ] Tiap item punya name dan icon/icon_url

### Projects (Wajib)
- [ ] Minimal 2-4 project published
- [ ] Tiap project punya year dan short_description
- [ ] Tiap project punya minimal 1-3 tags

### Blog Posts (Opsional)
- [ ] Minimal 3 post published jika ingin tampil
- [ ] Tiap post punya excerpt dan read_time_minutes

### Skills (Opsional)
- [ ] Minimal 4 skills jika ingin section tampil
- [ ] Tiap skill punya title, description, icon

---

## Tidak Perlu Perubahan Database

Semua field yang dibutuhkan **sudah ada di schema database**. Yang perlu dilakukan hanyalah:

1. **Isi data di admin panel** untuk setiap tabel di atas
2. **Upload aset** (avatar, resume, tool icons) ke storage
3. **Publish** projects dan blog posts yang ingin ditampilkan

Tidak ada perubahan schema/tabel/kolom yang diperlukan.
