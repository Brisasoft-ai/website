# Chuyển brisasoft.net khỏi account ReactPlus sang account Brisasoft

> Hiện trạng 27/10/2026
> - Domain đăng ký tại **Cloudflare Registrar**, zone ACTIVE nằm ở account cũ (`binhnt@reactplus.com`) — NS `dakota` / `diana`.
> - Account Brisasoft (`binhnt@brisasoft.net`) đã có sẵn zone `brisasoft.net` nhưng **pending**, NS `kristina` / `miguel`, zone id `32245237a8de0249e30e8afb57976052`.
> - Site đang chạy bản cũ từ account ReactPlus. Bản mới đã deploy ở preview:
>   `https://brisasoft-web-preview.brisasoft.workers.dev`

## Nguyên tắc: DNS trước, NS sau

Đổi NS khi zone mới chưa có bản ghi mail = **mất email Google Workspace**. Vì vậy làm đúng thứ tự dưới đây.

## Bước 1 — Tạo bản ghi mail ở zone Brisasoft (làm trước, chưa ảnh hưởng gì)

Cần token Cloudflare của account Brisasoft có quyền **Zone → DNS → Edit** cho `brisasoft.net`:

```bash
cd website/migration
export CLOUDFLARE_API_TOKEN=...        # Zone:DNS:Edit
export CF_ZONE_ID=32245237a8de0249e30e8afb57976052
python3 rebuild_dns.py
```

Tạo: MX `smtp.google.com` (10) · SPF · google-site-verification · DKIM `google._domainkey` · DMARC `p=none`.
Không tạo A/AAAA: khi gắn Worker custom domain, Cloudflare tự tạo bản ghi proxy.

## Bước 2 — Chuyển domain (chọn 1)

### 2A. Transfer nội bộ Cloudflare Registrar (khuyến nghị — không downtime, giữ hạn 10/2027)

1. Đăng nhập account cũ (`binhnt@reactplus.com`) lần cuối.
2. **Domain Registration → brisasoft.net → Configuration → Transfer domain to another Cloudflare account**.
3. Nhập email đích: `binhnt@brisasoft.net` → xác nhận.
4. Sang account Brisasoft: **Domains → chấp nhận transfer**.
5. Kiểm tra NS của zone trong account Brisasoft đã thành `kristina` / `miguel`; nếu chưa, sửa NS tại Registrar cho đúng cặp này.

### 2B. Nếu chỉ muốn đổi NS (giữ đăng ký ở account cũ)

1. Account cũ → **brisasoft.net → DNS → Nameservers** (hoặc Registrar → Configuration).
2. Đổi `dakota` / `diana` → **`kristina.ns.cloudflare.com`** và **`miguel.ns.cloudflare.com`**.
3. Lưu. Cloudflare account Brisasoft sẽ tự chuyển zone sang **Active** (thường 5–30 phút, tối đa 24h).

> 2A sạch hơn: không còn phụ thuộc account cũ. 2B nhanh hơn nhưng đăng ký domain vẫn nằm ở account cũ.

## Bước 3 — Deploy + gắn domain (máy này)

```bash
cd website
export PATH="$HOME/.local/node-v22/bin:$PATH"
npx wrangler deploy          # zone đã Active thì custom domain gắn được
```

Kiểm tra:

```bash
curl -s https://brisasoft.net/vi/ | grep -c cookie-banner     # = 1
dig +short NS brisasoft.net                                    # kristina / miguel
dig +short MX brisasoft.net                                    # 10 smtp.google.com.
```

## Bước 4 — Kiểm tra email (quan trọng)

1. Gửi thử từ ngoài vào `binhnt@brisasoft.net` và `contact@brisasoft.net` → phải nhận được.
2. Gửi thử từ `binhnt@brisasoft.net` ra ngoài → không bị spam (SPF/DKIM pass).
3. Sau 2–4 tuần xem báo cáo DMARC; nếu sạch thì nâng `p=none` → `p=quarantine`.

## Bước 5 — Dọn account cũ

- Xoá zone `brisasoft.net` khỏi account ReactPlus sau khi NS đã trỏ đi (tránh 2 zone trùng tên).
- Xoá Worker/Pages cũ (nếu còn) để không deploy nhầm.
- Gỡ domain khỏi mọi cấu hình còn tham chiếu trong account cũ.

## Rollback

Nếu site/mail lỗi sau khi đổi NS: đổi NS ngược về `dakota` / `diana` ở Registrar (hoặc huỷ transfer trong 5 ngày đầu với 2A). Giữ zone cũ nguyên vẹn đến khi xác nhận xong bước 4.

## Checklist

- [ ] Token Cloudflare account Brisasoft có Zone:DNS:Edit + Workers Scripts/Routes:Edit
- [ ] `rebuild_dns.py` chạy xong, đủ MX/SPF/DKIM/DMARC
- [ ] Transfer (2A) hoặc đổi NS (2B) hoàn tất, zone **Active**
- [ ] `wrangler deploy` gắn được `brisasoft.net` + `www`
- [ ] Site mới live, 3 ngôn ngữ, cookie banner, form liên hệ
- [ ] Email vào/ra OK, SPF+DKIM pass
- [ ] Xoá zone + worker cũ ở account ReactPlus
