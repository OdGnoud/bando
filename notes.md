# Ghi chú thay đổi — Góc Đồ Lướt

## 2026-08-20 21:00 (Asia/Ho_Chi_Minh) — ✅ Facebook auto-post HOẠT ĐỘNG

- Test thành công: tạo sản phẩm "Test" → bài tự đăng lên Fanpage Góc Đồ Lướt với đúng format: 📱 tên / 💰 giá / 📍 vị trí + tình trạng + "Còn hàng — chốt nhanh kẻo lỡ!" / mô tả / link sản phẩm / hashtag
- Token chính thức: app `gocdoluot` (**4582676832056886**, Business, chế độ Phát triển) + page token đã có `pages_manage_posts` (Advanced access — cấp sau khi thực hiện 1 lệnh gọi API thành công + bấm "Yêu cầu", dev mode cấp ngay không chờ duyệt)
- Bài test đã được gỡ qua Graph API (DELETE post id) ✓
- Lưu ý: token page không hết hạn trong dev mode; nếu đổi mật khẩu FB / thu hồi quyền → token chết → lấy lại qua Graph Explorer `/me/accounts`

## 2026-08-18 23:00 (Asia/Ho_Chi_Minh) — debug Facebook token + làm sạch Vercel

### Facebook token (đã debug bằng Graph API debug_token)

- Token lúc đầu là **USER token**, scopes: `pages_show_list, business_management, pages_read_engagement, public_profile` — THIẾU `pages_manage_posts` (quyền đăng bài) → publish "Test" fail, `facebook_post_id = null`
- Giải pháp: user tạo token mới có `pages_manage_posts` và **dán lên Vercel admin** (Settings > Env) — local `apps/admin/.env` vẫn token cũ → cần dán lại để đồng bộ + tự test Graph API
- `META_PAGE_ID=1239586675907947` khớp page thật ✓ (debug qua /me/accounts)
- **KHÔNG dùng** `vercel deploy --prod` CLI làm nguồn env runtime: CLI deploy không nạp `.env` local vào deployment env (xác nhận qua API deployment env rỗng META_*) → runtime dùng đúng env Vercel dashboard

### Vercel

- Dọn deployments cũ: giữ 2 READY mới nhất mỗi project (web + admin), xoá bản còn lại qua `DELETE /v13/deployments/{uid}`
- Production admin hiện tại: `dpl_HkbdpUHVkTmnuanzv7vVsypf4MGw` (CLI 21:44)
- Env API: `GET /v9/projects/{id}/env` trả 403 với token CLI (chỉ dùng cho deployments) — kiểm tra env phải qua dashboard

### Sự cố "sản phẩm biến mất khỏi list admin"

- KHÔNG mất dữ liệu: DB + web đều còn 2 sản phẩm; trang list admin là dynamic (λ, xác nhận qua `vercel build`) nên không đông cứng dữ liệu
- Nguyên nhân nghi ngờ: cache trình duyệt (RSC payload cũ) → xử lý bằng hard refresh / tab ẩn danh

## 2026-08-18 22:30 (Asia/Ho_Chi_Minh) — đăng bài tự động lên Facebook (Graph API)

### Tính năng

- **Tự đăng lên Fanpage khi tạo/lưu sản phẩm**: checkbox "Đăng lên Facebook khi lưu" (mặc định bật) trong form sản phẩm
  - Tạo mới → đăng bài mới (tối đa 5 ảnh từ R2, kèm giá/location/tình trạng/link sản phẩm + hashtag)
  - Sửa (đã có bài) → cập nhật nội dung bài FB
  - Hiện badge "Đã đăng lên Facebook" + nút "Gỡ bài trên Facebook" trên form sửa
- `apps/admin/lib/facebook.ts`: Graph API v25 — upload ảnh `/{page}/photos?url=...&published=false` → `/{page}/feed` với `attached_media`; `POST {post_id}` update message; `DELETE {post_id}` gỡ bài
- `apps/admin/app/api/admin/facebook/route.ts`: POST/DELETE đăng-gỡ thủ công
- `apps/admin/app/api/admin/products/route.ts`: auto-publish khi tạo/cập nhật; lỗi FB KHÔNG làm hỏng lưu sản phẩm — trả `facebook: {ok:false, error}` để client toast cảnh báo
- DB: `products.facebook_post_id` + `facebook_posted_at` — **MIGRATION `20260818160000_facebook_auto_post.sql` CHƯA CHẠY — bắt buộc bấm SQL Editor**
- Web: `generateMetadata` thêm `openGraph` (image = ảnh đại diện) để link card FB hiện ảnh + giá

### Env (server-side, admin project)

- `META_APP_ID`, `META_APP_SECRET`, `META_PAGE_ID`, `META_PAGE_ACCESS_TOKEN` — user đã tự cấu hình (đã có trong `apps/admin/.env`; phải check trên Vercel admin Settings > Env)
- App Meta chế độ Development + admin page → token không hết hạn, không cần App Review
- Nếu FB đổi quyền (đổi mật khẩu/quyền) → token có thể hết hạn → lấy lại qua Graph Explorer `/me/accounts`

### Việc cần làm

1. ⏳ Chạy migration `20260818160000_facebook_auto_post.sql` trong Supabase SQL Editor
2. ⏳ Confirm META_* đã có trên Vercel admin (cả production lẫn preview)
3. ⏳ Test: tạo sản phẩm (tick FB) → kiểm tra bài đăng trên Fanpage

## 2026-08-18 21:30 (Asia/Ho_Chi_Minh) — fix mô tả chi tiết bị cắt + nâng giới hạn text

### Bug: mô tả chi tiết hiển thị bị cắt ("...vừa nổi bật về ng") dù DB đã lưu đủ

- **Triệu chứng**: DB đầy 231 ký tự ("...ngoại hình."), API anon đầy, code render thẳng `{product.full_description}` — nhưng trang `/san-pham/[slug]` serve ra chỉ 222 ký tự (cắt 9 ký tự cuối)
- **Chẩn đoán**: route debug tạm (`/api/debug`) cùng server trả ĐỦ 231 → không phải query/DB/CF cache → **trang `[slug]` thiếu `export const dynamic = 'force-dynamic'` → Vercel cache RSC payload cũ từ build trước** (cùng họ lỗi với trang chủ 0 sản phẩm commit `c1bc35d`)
- **Fix**: thêm `force-dynamic` vào `apps/web/app/(web)/san-pham/[slug]/page.tsx` → verify render đủ 231 ký tự ✓
- **Bài học**: trang nào query DB cũng phải `force-dynamic`, kể cả khi build manifest báo `λ (Dynamic)`

### Nâng giới hạn text sản phẩm (yêu cầu chạy migration)

- `apps/admin/lib/validation.ts` (zod): short_description 300→1000, full_description 20000→100000, defects_notes 10000→20000, accessories 5000→10000
- `supabase/migrations/20260818150000_raise_text_limits.sql` (mới): nâng CHECK constraint tương ứng — **CHƯA CHẠY — bấm trong Supabase SQL Editor**
- `product-form.tsx`: textarea "Mô tả chi tiết" rows 6→10 + `min-h-[240px]`

## 2026-08-18 04:30 (Asia/Ho_Chi_Minh) — tối ưu cấu trúc lưu ảnh R2

### Ảnh sản phẩm theo thư mục `products/<product_id>/<image_id>.<ext>` (thay cho phẳng `products/<uuid>.webp`)

- Chọn **id sản phẩm làm thư mục** (ổn định, không đổi khi đổi tên/slug) + **id row `product_images` làm tên file** → mở R2 là thấy ngay sản phẩm nào, đối chiếu được với DB
- `apps/admin/lib/r2.ts`: thêm `r2DeleteObject` (DELETE 204/404), `keyFromR2Url`
- `apps/admin/app/api/admin/images/route.ts`: bắt buộc field `productId` (uuid) → key = `products/<productId>/<uuid>.<ext>`
- `product-form.tsx`: sản phẩm mới sinh `crypto.randomUUID()` một lần — dùng cho cả upload lẫn tạo sản phẩm; form edit dùng `initial.id`
- `apps/admin/app/api/admin/products/route.ts`:
  - POST nhận `id` optional từ client (chỉ uuid hợp lệ)
  - PATCH: xoá object R2 của ảnh bị bỏ (so old vs new URLs)
  - DELETE: xoá toàn bộ object R2 của sản phẩm trước khi xoá DB (hết ảnh mồ côi)
- **Đã migrate dữ liệu cũ** (script `apps/admin/scripts/r2-reorganize.mjs` — đọc `.env`, copy+delete+update DB):
  - 5 ảnh của Zfold 5 → `products/33f8b030-e042-4044-b096-c753e37e0204/<row_id>.webp` ✓ (web verify hiển thị đủ 5 ảnh)
  - Xoá 8 object mồ côi không được DB tham chiếu ✓ (R2 giờ chỉ còn thư mục `products/33f8b030-.../`)
- Lưu ý: ảnh URL dán tay (không phải R2 của mình) không bị đụng tới

## 2026-08-18 04:00 (Asia/Ho_Chi_Minh) — phiên làm việc tiếp theo

### Fix lỗi vòng lặp đăng nhập (login → OTP → quay về login) — commit `0d7c13e`

- **Nguyên nhân**: khi đổi danh tính thiết bị sang SHA-256(User-Agent), `setAuthCookies` không còn set cookie `gdl_device_id` nữa, **NHƯNG `middleware.ts` vẫn kiểm tra cookie này** → middleware thấy có session nhưng thiếu device cookie → **xoá luôn session cookie** + redirect về `/admin` → vòng lặp vĩnh viễn
- **Fix**: viết lại `apps/admin/middleware.ts` (bỏ ~58 dòng): chỉ còn redirect khi chưa đăng nhập + chuyển `/admin` → `/admin/tong-quan`. Kiểm tra thiết bị (revoked/active) giờ chỉ nằm trong `getAdminSession()` qua UA hash

### Danh tính thiết bị = SHA-256(User-Agent) — commit `dc15fa7` (đã deploy)

- `apps/admin/lib/device.ts`: thêm `hashUserAgent` (sha256Hex), `deviceNameFromUA` ("Windows - Chrome")
- `apps/admin/lib/auth.ts`: `getAdminSession` lấy `deviceId` từ `headers().get('user-agent')` hash — hết tình trạng 1 browser thành nhiều thiết bị
- `apps/admin/app/api/admin/auth/device/route.ts`: `deviceId = hash(body.user_agent)`, `device_label` tính server-side, bỏ cookie `gdl_device_id`
- Migration `supabase/migrations/20260818120000_device_identity_by_ua_hash.sql` (đã chạy):
  `UPDATE public.user_sessions SET status='revoked' WHERE device_id !~ '^[0-9a-f]{64}$';`
- **Cảnh báo lỗi**: nếu sau này ai đó bảo "bỏ device check", phải nhớ sửa CẢ middleware lẫn getAdminSession

### Admin upgrade: dashboard + traffic + events — commit `ad4a685` (đã deploy)

- `/admin/tong-quan` (dashboard), `/admin/luot-truy-cap` (traffic), `/admin/su-kien` (events) + sidebar mới, login redirect `/admin/tong-quan`
- Bảng mới: `page_views`, `promo_events` — **MIGRATION `supabase/migrations/20260818000000_analytics_and_promo_events.sql` CHƯA CHẠY** (phải bấm trong Supabase SQL Editor)
- Web: `/api/track` + PageTracker + PromoBanner (promo hiện trên trang chủ)
- **Lưu ý**: lúc mới deploy, `/api/track` trả 200 nhưng insert fail (bảng chưa có) — sau khi chạy migration là OK

### Fix R2 upload — commit `452279b` (đã deploy, user xác nhận OK)

- **Nguyên nhân**: `PUT 411 Length Required` — aws4fetch ký mà không đính Content-Length, không tương thích undici của Vercel
- **Fix**: bỏ aws4fetch, viết tay SigV4 (mẫu RoomMe) trong `apps/admin/lib/r2.ts` — không cần signed content-length, nhớ `X-Amz-Content-Sha256` — xác nhận upload hoạt động
- `5857ab8`: hiện chi tiết lỗi R2 ngay trên UI

### Fix web hiện 0 sản phẩm — commit `c1bc35d` (đã deploy, verified)

- **Nguyên nhân**: home + `/san-pham` bị prerender tĩnh lúc build (query DB khi build → 0 sản phẩm)
- **Fix**: thêm `force-dynamic`; **đồng thời** env Vercel web bị thiếu/sai → đã xoá env theo ID rồi POST lại (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Verified: trang chủ hiện Zfold 5, `/san-pham` + `/san-pham/zfold-5` OK

### Navbar + gallery — `c5a735f`, `404d464` (đã deploy, verified)

- Navbar chỉ còn 3 mục (Trang chủ, Sản phẩm, Liên hệ) + menu drawer mobile kiểu RoomMe
- `ProductGallery`: chọn thumbnail + lightbox (phím mũi tên/ESC)

### Vận hành / quản lý deploy

- **Git integration Vercel hoạt động trở lại** (github/cudhna): mỗi push main tự deploy CẢ 2 project — **KHÔNG cần `vercel deploy` CLI nữa**; CLI deploy tạo bản trùng
- Đã dọn 12 deploy cũ (web + admin), giữ 2 bản mới nhất mỗi project (rollback): web `dpl_97D3Y7` + `dpl_NShvWy8`; admin `dpl_49NFVN` + `dpl_6Cqvr2X` (+ `dpl_PDhqJaX` mới)
- Xoá deploy qua API: `DELETE https://api.vercel.com/v13/deployments/{dpl_id}` (endpoint /v9/projects/... trả not_found)
- Bỏ được lệnh CLI deploy thì nhớ `Remove-Item -Recurse -Force .vercel` (git dùng CLI deploy cần link lại)

### Việc cần làm

1. ⏳ Chạy migration `20260818000000_analytics_and_promo_events.sql` (bảng `page_views`, `promo_events`) trong Supabase SQL Editor
2. ⏳ User xác nhận login admin hết loop (fix `0d7c13e`)
3. Nếu muốn rollback nhanh: chuyển production alias về deploy cũ trong Vercel Deployments

## 2026-08-18 (Asia/Ho_Chi_Minh)

### Upload ảnh trực tiếp lên Cloudflare R2 (admin)

- `apps/admin/lib/r2.ts` (mới): upload object qua S3 API (aws4fetch), endpoint `https://619f47f641f5625825d59b48a0c2020b.r2.cloudflarestorage.com` — **LƯU Ý: account ID đúng là `619f47f641f5625825d59b48a0c2020b` (32 ký tự), mục cũ dưới đây ghi thừa số `0` cuối → TLS fail**
- `apps/admin/app/api/admin/images/route.ts` (mới): POST multipart, auth admin + rate limit, validate type (jpeg/png/webp) + size ≤ 8MB, key `products/<uuid>.<ext>`
- `product-form.tsx`: thay ô dán URL bằng nút "Thêm ảnh từ máy" — nén ảnh client-side (max 1600px, WebP 0.82) → upload qua API → preview + alt + ảnh đại diện là ảnh đầu
- Bucket: `roomme-images`; public URL: `https://pub-66298fc1a5e24d15a4dd0f3f02d47d41.r2.dev`
- Env: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL` (đã set local `.env` + Vercel admin production/preview)

### Khác

- Đổi nhãn trạng thái: `Chưa bán / Đã có người đặt cọc / Đã bán`; tình trạng + khu vực thành select (`CONDITION_OPTIONS`, `LOCATION_OPTIONS` trong `packages/shared/lib/types.ts`)
- Seed 9 danh mục vào bảng `categories`
- Bỏ giới hạn 3 thiết bị + chờ duyệt: mọi thiết bị tự động active (single-admin); "Thu hồi" = đăng xuất từ xa
- Fix: session cookie bỏ `httpOnly` (client auth-provider đọc được qua `document.cookie` — fix vòng lặp "Đang chuyển về đăng nhập...")
- Fix: `registerDevice` bọc try/catch — không còn kẹt "Đang kiểm tra thiết bị..." khi lỗi mạng
- Fix: root `/` redirect dùng `force-dynamic` (static redirect trước đó render error page)
- LƯU Ý BẢO MẬT: R2 access key + secret đã từng nằm trong file này (commit cũ) — **đã xoá khỏi file hiện tại, NHƯNG vẫn còn trong lịch sử git**; nên tạo lại token/access key mới trên dashboard Cloudflare và xoá cái cũ, và xoá lịch sử nhạy cảm nếu repo public sau này

## 2026-08-17 18:05 (Asia/Ho_Chi_Minh)

### Thêm credentials Cloudflare R2 vào `.env` (chuẩn bị deploy Vercel)

- `.env` (gitignored): thêm 5 biến R2 (giá trị thật KHÔNG ghi vào file này — xem `apps/admin/.env.example`)
  - `CLOUDFLARE_ACCOUNT_ID=619f47f641f5625825d59b48a0c2020b` (sửa: trước ghi `...2020b0` — sai, thừa số 0; account ID không phải secret)
  - `CLOUDFLARE_R2_ENDPOINT=https://619f47f641f5625825d59b48a0c2020b.r2.cloudflarestorage.com` (sửa tương ứng)
  - `CLOUDFLARE_R2_ACCESS_KEY_ID=<bí mật — đã xoá khỏi repo>`
  - `CLOUDFLARE_R2_SECRET_ACCESS_KEY=<bí mật — đã xoá khỏi repo>`
  - `CLOUDFLARE_R2_API_TOKEN=<bí mật — đã xoá khỏi repo>` (token Cloudflare API — tạo/list/xoá bucket, đọc/ghi object)
- `.env.example`: cập nhật placeholder tương ứng
- Lưu ý: app hiện tại vẫn dùng URL ảnh dán tay từ R2 — các biến này dự trữ cho chức năng upload ảnh trực tiếp sau này; tất cả đều là secret phía server (không có tiền tố `NEXT_PUBLIC_`), trên Vercel khai ở Settings > Environment Variables

## 2026-08-17 17:40 (Asia/Ho_Chi_Minh)

### Bảo mật hardening toàn diện (web + admin)

Bối cảnh: website bán đồ công nghệ cũ (landing page + admin), storage Supabase (text), ảnh Cloudflare R2 (URL thủ công), deploy Vercel. Yêu cầu: chống SQLi/XSS/flood DB, bảo vệ admin (MFA, thiết bị đăng nhập, tối đa 3 thiết bị + duyệt chéo), giấu secret.

#### 1. Database (Supabase) — migration mới `supabase/migrations/20260817100000_security_hardening.sql`

- Bảng `app_admins`: chỉ user trong bảng này được ghi vào catalog (seed admin: `INSERT INTO public.app_admins (user_id) SELECT id FROM auth.users WHERE email = '...';`)
- Bảng `user_sessions`: registry thiết bị đăng nhập — `device_id`, `device_label`, `user_agent`, `ip`, `refresh_hash` (SHA-256), `status` (active/pending/revoked), `approval_token`, `last_seen_at`, `approved_at/by`; trigger `guard_max_active_devices` chặn cứng tối đa 3 thiết bị active
- Sửa lại toàn bộ policy ghi (`products`, `categories`, `product_images`) → chỉ `is_app_admin_aal2()` (admin + đã xác thực MFA). User đăng ký trái phép chỉ đọc được, không thể flood
- CHECK constraints: độ dài các trường text, slug regex `^[a-z0-9]+(-[a-z0-9]+)*$`, `price BETWEEN 0 AND 2000000000`, `status IN (...)`, URL ảnh bắt buộc `https://` và ≤ 2048 ký tự
- Trigger `set_updated_at` tự cập nhật `products.updated_at`

#### 2. Server-side protection (Next.js)

- Cài `@supabase/ssr@0.12.4` — session chuyển sang cookie (trước đây client-only localStorage, ai cũng vào được /admin)
- `middleware.ts` (mới): refresh session mỗi request; chặn `/admin/*` khi chưa đăng nhập; **soft-revoke thiết bị**: thiết bị bị thu hồi bị chặn ngay tại middleware (chỉ thiết bị đó, không đụng 2 thiết bị kia); chống vòng lặp redirect khi thiếu device cookie
- RSC guard `app/admin/(app)/layout.tsx`: `getAdminSession()` + redirect — lớp bảo vệ thứ 2
- Mọi thao tác ghi của admin chuyển từ client-direct-Supabase sang **API routes** (verify session + device + admin → validate zod → ghi bằng service role):
  - `app/api/admin/products/route.ts` (POST/PATCH/DELETE)
  - `app/api/admin/categories/route.ts`
  - `app/api/admin/devices/route.ts` (danh sách, duyệt, thu hồi)
  - `app/api/admin/auth/device/route.ts` (đăng ký thiết bị + poll trạng thái, rate limit theo IP)

#### 3. Login 3 lớp + quản lý thiết bị

- `components/admin/login-form.tsx` (viết lại): mật khẩu → **MFA TOTP bắt buộc** (enroll QR lần đầu) → kiểm tra thiết bị
- Luồng thiết bị: thiết bị đầu tiên tự duyệt; thiết bị mới → `pending` → duyệt/từ chối tại `/admin/thiet-bi` (kèm UA, IP, thời gian); poll 5s tự đăng nhập sau khi được duyệt; quá 3 thiết bị → báo lỗi
- `app/admin/(app)/thiet-bi/page.tsx` + `components/admin/device-manager.tsx` (mới): danh sách active/pending/revoked, nút Duyệt/Thu hồi, tự làm mới 5s
- `components/admin/auth-provider.tsx` (viết lại): `createBrowserClient` đọc session từ cookie
- Rate limit in-memory theo IP cho các endpoint auth/device

#### 4. Vệ sinh chung

- `next.config.js`: security headers — CSP, X-Content-Type-Options (nosniff), X-Frame-Options (SAMEORIGIN), Referrer-Policy, Permissions-Policy
- `components/admin/product-form.tsx`: validate URL ảnh phải `https://` ngay trên form (hiển thị lỗi, chặn submit)
- `.env.example` (mới): placeholder, không chứa key thật
- Xoá `lib/actions.ts` + `lib/supabase/client.ts` (code chết dùng session cũ localStorage)
- `types/lucide-react.d.ts`: ambient declaration cho lucide-react (gói cài về thiếu type — lỗi có sẵn từ trước)

#### 5. Secret management

- `.env` (gitignored): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- anon key là public theo thiết kế (RLS chặn ghi); `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng server-side (middleware/API), không bao giờ có tiền tố `NEXT_PUBLIC_`

### Việc cần làm khi deploy (chưa làm)

1. Chạy 2 migration trên Supabase project `lnsmjeyiitvjnuotynwd` (CLI `supabase db push` hoặc SQL Editor)
2. Tạo user admin trong **Authentication → Users** → seed vào `app_admins`
3. Tắt Public signup trong **Authentication → Providers → Email** (khuyến nghị)
4. Vercel: khai báo 3 biến env (xem `.env.example`)
5. Lần đầu đăng nhập sẽ tự bắt bật MFA rồi duyệt thiết bị đầu tiên

### Trạng thái kiểm tra

- `npm run typecheck` ✓ | `npm run lint` ✓ | `npm run build` ✓ (17/17 route)

## 2026-08-17 20:30 (Asia/Ho_Chi_Minh)

### Tach monorepo: web va admin la 2 app Next.js rieng

- Cau truc moi:
  - `apps/web`: trang cong khai (Goc Do Luot) - `npm run dev:web`
  - `apps/admin`: trang quan tri + API + middleware - `npm run dev:admin`
  - `packages/ui`: Shadcn/ui (47 components, `@gdl/ui`), import noi bo la relative
  - `packages/shared`: types/queries/contact/anon-server (`@gdl/shared`), app import qua stub `lib/*.ts`
- npm workspaces o root; env tach rieng `apps/web/.env` (2 bien) va `apps/admin/.env` (3 bien)
- Favicon: copy logo `apps/{web,admin}/app/icon.png`
- CONTACT_LINKS: messenger/facebook = profile id 61593582713829, zalo = zalo.me/0376631650, phone = 0376631650
- Build: `npm run build:web` ✓ + `npm run build:admin` ✓ (typecheck sach ca 2)
- Deploy Vercel: tao 2 project, Root Directory = `apps/web` va `apps/admin`, khai env rieng tung project

## 2026-08-17 21:10 (Asia/Ho_Chi_Minh)

### Fix deploy Vercel (loi routes-manifest.json khong thay .next)

- Nguyen nhan: project Vercel cu van gan o repo ROOT, build ca 2 app roi tim .next o root -> khong co
- Fix qua Vercel API (token tu auth.json CLI):
  - PATCH project `goc-do-luot` -> `rootDirectory: apps/web` (giu URL goc-do-luot.vercel.app)
  - POST project moi `goc-do-luot-admin` -> `rootDirectory: apps/admin` + git link github
  - Env: web them 2 bien cho target preview; admin them 3 bien cho production + preview
- Ket qua: ca 2 deployment READY
  - WEB: https://goc-do-luot.vercel.app (200)
  - ADMIN: https://goc-do-luot-admin.vercel.app/admin (200)
- Tu nay moi push main tu dong deploy ca 2 project (Vercel tu skip project khong thay doi file)
