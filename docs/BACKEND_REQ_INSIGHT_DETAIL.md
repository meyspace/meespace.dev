# Backend Data Requirements for Insight Detail Page

Dokumen ini menjelaskan data yang perlu diisi di admin panel agar halaman Detail Insight sesuai dengan planning design.

---

## Ringkasan API yang Digunakan

| Section | API Endpoint | Status |
|---------|--------------|--------|
| Post Detail | `GET /api/v1/blog/{slug}` | ✅ Sudah ada |
| Related Posts | `GET /api/v1/blog?limit=4` | ✅ Sudah ada |
| Author Info | `GET /api/v1/profile` | ✅ Sudah ada |
| Comments | `GET /api/v1/blog/{slug}/comments` | ✅ Sudah ada |

---

## 1. Blog Posts Table

**Tabel:** `blog_posts`  
**API:** `GET /api/v1/blog/{slug}`  
**Perubahan Table:** ⚠️ Opsional - Lihat kolom baru di bawah

### Kolom yang Digunakan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `title` | VARCHAR | `"Migrating Legacy Monoliths"` | Judul artikel (tampil di hero) |
| `slug` | VARCHAR | `"migrating-legacy-monoliths"` | URL slug |
| `excerpt` | TEXT | `"A Business System Analyst's..."` | Subtitle/deskripsi singkat di hero |
| `content` | TEXT | Markdown text | Konten utama (support Markdown) |
| `featured_image_url` | TEXT | `"https://..."` | **PENTING:** Gambar hero full-bleed |
| `reading_time` | INT | `12` | Waktu baca dalam menit |
| `published_at` | TIMESTAMP | `2024-09-12` | Tanggal publish |
| `status` | VARCHAR | `"published"` | Harus "published" |
| `category_id` | UUID | FK to categories | Untuk badge kategori |

### Kolom Baru yang Mungkin Dibutuhkan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `author_id` | UUID | FK to profile | Link ke author profile |
| `author_name` | VARCHAR | `"Sarah Jenkins"` | Override nama author |
| `author_avatar_url` | TEXT | `"https://..."` | Override avatar author |
| `author_role` | VARCHAR | `"Business Systems Analyst"` | Override role author |

> **Note:** Jika `author_*` fields kosong, sistem akan fallback ke data dari `profile` table.

---

## 2. Categories Table

**Tabel:** `categories` (atau `blog_categories`)  
**Perubahan Table:** ❌ Tidak perlu

### Kolom yang Digunakan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `id` | UUID | | Primary key |
| `name` | VARCHAR | `"Case Study"`, `"Technical"` | Nama kategori (tampil sebagai badge) |

### Contoh Kategori

```
- Case Study (artikel studi kasus)
- Technical (artikel teknis)
- Process (artikel proses)
- Industry Insights
- Best Practices
```

---

## 3. Profile Table (untuk Author)

**Tabel:** `profile`  
**API:** `GET /api/v1/profile`  
**Perubahan Table:** ❌ Tidak perlu

### Kolom yang Digunakan untuk Author Section

| Kolom | Contoh | Keterangan |
|-------|--------|------------|
| `full_name` | `"Sarah Jenkins"` | Nama author |
| `role` | `"Business Systems Analyst"` | Role/jabatan author |
| `avatar_url` | `"https://..."` | Foto author |

---

## 4. Comments Table

**Tabel:** `blog_comments`  
**API:** `GET/POST /api/v1/blog/{slug}/comments`  
**Perubahan Table:** ❌ Tidak perlu (sudah ada)

### Kolom yang Digunakan

| Kolom | Tipe | Contoh | Keterangan |
|-------|------|--------|------------|
| `author_name` | VARCHAR | `"Michael King"` | Nama commenter |
| `author_email` | VARCHAR | (opsional) | Email commenter |
| `content` | TEXT | Markdown | Isi komentar (support Markdown) |
| `parent_comment_id` | UUID | null atau FK | Untuk reply thread |
| `created_at` | TIMESTAMP | | Waktu komentar |

---

## 5. Featured Image Guidelines

Untuk tampilan hero yang optimal:

| Property | Rekomendasi |
|----------|-------------|
| **Aspect Ratio** | 16:9 atau lebih lebar |
| **Minimum Width** | 1920px |
| **Format** | WebP atau JPEG |
| **File Size** | < 500KB (compressed) |
| **Style** | Abstract, tech-related, atau relevan dengan topik |

### Contoh Image Sources

Untuk placeholder/testing:
- Unsplash: `https://images.unsplash.com/photo-xxx?w=1920&q=80`
- Pexels
- Upload ke storage (Supabase/S3)

---

## Markdown Content Support

Konten artikel mendukung format Markdown berikut:

### Didukung ✅
- **Paragraf biasa**
- **Heading** (`### Judul`)
- **Bold/Italic** (`**bold**`, `*italic*`)
- **Blockquote** (`> Quote text`) - Akan ditampilkan dengan styling khusus
- **Images** (`![alt](url)`) - Carousel support
- **Lists** (ordered/unordered)
- **Code blocks** (inline dan fenced)
- **Links**

### Contoh Blockquote (Rendered)

```markdown
> "The goal isn't just to replicate features, but to reimagine the business capability using modern patterns."
```

Akan ditampilkan dengan:
- Background abu-abu
- Border kiri hijau (primary color)
- Icon quote di kiri
- Font serif italic

---

## Related Posts Logic

Related posts diambil dengan logika:
1. Fetch 4 post terbaru dengan status `published`
2. Filter out post yang sedang dibaca (by slug)
3. Tampilkan maksimal 2 post

### Improvement Opsional

Untuk related posts yang lebih relevan:

```sql
-- Tambah kolom tags atau category matching
SELECT * FROM blog_posts 
WHERE status = 'published' 
  AND slug != :current_slug
  AND category_id = :current_category_id
ORDER BY published_at DESC
LIMIT 2;
```

---

## Checklist Setup Data

### Blog Post (Wajib per artikel)
- [ ] `title` terisi
- [ ] `slug` unique dan SEO-friendly
- [ ] `excerpt` terisi (untuk hero subtitle)
- [ ] `content` terisi dengan Markdown
- [ ] `featured_image_url` terisi (gambar hero)
- [ ] `reading_time` terisi (menit)
- [ ] `status` = "published"
- [ ] `category_id` linked

### Profile (untuk Author fallback)
- [ ] `full_name` terisi
- [ ] `role` terisi
- [ ] `avatar_url` terisi

### Categories
- [ ] Minimal 3-4 kategori tersedia

---

## Tidak Perlu Perubahan Database

Semua field utama **sudah ada di schema database**. Yang perlu dilakukan:

1. **Isi data lengkap** untuk setiap blog post
2. **Upload gambar hero** untuk setiap artikel
3. **Set kategori** untuk badge yang relevan
4. **Pastikan profile lengkap** untuk author section

### Opsional

Jika ingin author per-post berbeda dari profile:
```sql
ALTER TABLE blog_posts ADD COLUMN author_name VARCHAR(255);
ALTER TABLE blog_posts ADD COLUMN author_role VARCHAR(255);
ALTER TABLE blog_posts ADD COLUMN author_avatar_url TEXT;
```
