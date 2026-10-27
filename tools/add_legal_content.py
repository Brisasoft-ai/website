#!/usr/bin/env python3
"""One-off content injection: privacy notice, cookie policy and consent UI strings (VI/EN/JA).

Run from the website folder:  python3 tools/add_legal_content.py
Keeps the JSON pretty-printed and ordered.
"""
import collections
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
I18N = os.path.join(os.path.dirname(HERE), "src", "i18n")

PRIVACY = {
    "vi": {
        "eyebrow": "Pháp lý",
        "title": "Thông báo quyền riêng tư",
        "text": "Thông báo này giải thích Brisasoft thu thập dữ liệu gì khi bạn dùng website, vì sao, giữ trong bao lâu và bạn có những quyền nào.",
        "updated": "Phiên bản 2.0 — cập nhật ngày 27/10/2026. Thay thế mọi bản trước đó.",
        "s1": {"title": "1. Đơn vị chịu trách nhiệm",
               "text": "Công ty Cổ phần Brisasoft (Brisasoft Joint Stock Company), mã số doanh nghiệp 0110870824, Tầng 3 số 3 ngõ 114 Kim Quan Thượng, phường Việt Hưng, Long Biên, Hà Nội, Việt Nam — là đơn vị kiểm soát dữ liệu thu được qua website này. Mọi câu hỏi về dữ liệu xin gửi tới contact@brisasoft.net."},
        "s2": {"title": "2. Dữ liệu chúng tôi thu thập",
               "text": "Chúng tôi chỉ thu thập dữ liệu cần cho mục đích nêu ở mục 3: (a) thông tin bạn tự gửi qua biểu mẫu liên hệ — họ, tên, email công việc, tên công ty, chức vụ, quốc gia/khu vực và nội dung yêu cầu; (b) dữ liệu kỹ thuật tối thiểu khi bạn truy cập — địa chỉ IP, loại trình duyệt, thời điểm và trang được yêu cầu, do nhà cung cấp hạ tầng ghi lại để vận hành và bảo vệ website; (c) lựa chọn lưu trên thiết bị của bạn — ngôn ngữ hiển thị và quyết định về cookie. Chúng tôi không thu thập dữ liệu nhạy cảm và không yêu cầu bạn gửi thông tin đó qua biểu mẫu."},
        "s3": {"title": "3. Mục đích và cơ sở pháp lý",
               "text": "Phản hồi yêu cầu của bạn: cần thiết để thực hiện các bước trước khi ký hợp đồng theo yêu cầu của bạn. Vận hành, bảo mật và chẩn đoán lỗi website: lợi ích hợp pháp của chúng tôi trong việc giữ hệ thống hoạt động và an toàn. Đo lường mức độ sử dụng và cải thiện nội dung: chỉ khi bạn đồng ý qua phần thiết lập cookie. Chúng tôi không dùng dữ liệu của bạn cho quảng cáo tự động và không bán dữ liệu."},
        "s4": {"title": "4. Cookie và công nghệ tương tự",
               "text": "Website mặc định chỉ dùng cookie và bộ nhớ cục bộ cần thiết: giữ lựa chọn ngôn ngữ và ghi nhận quyết định cookie của bạn. Cookie đo lường chỉ được bật sau khi bạn đồng ý và có thể từ chối mà không ảnh hưởng chức năng. Chi tiết theo từng loại, thời hạn lưu và cách thay đổi lựa chọn nằm trong Chính sách cookie."},
        "s5": {"title": "5. Chia sẻ và chuyển dữ liệu",
               "text": "Chúng tôi chia sẻ dữ liệu ở mức tối thiểu với nhà cung cấp dịch vụ cần thiết để vận hành website và nhận yêu cầu: hạ tầng và phân phối nội dung (Cloudflare) và dịch vụ email gửi/nhận thư liên hệ. Các nhà cung cấp này chỉ xử lý dữ liệu theo hướng dẫn của chúng tôi và không được dùng cho mục đích riêng. Dữ liệu có thể được xử lý ngoài Việt Nam; khi đó chúng tôi áp dụng biện pháp bảo vệ theo hợp đồng và chỉ chọn nhà cung cấp có cam kết bảo mật tương đương. Chúng tôi công bố thông tin khi có yêu cầu hợp pháp của cơ quan có thẩm quyền."},
        "s6": {"title": "6. Thời gian lưu trữ",
               "text": "Yêu cầu gửi qua biểu mẫu và thư trao đổi được lưu tối đa 24 tháng kể từ lần liên hệ cuối, sau đó xoá hoặc ẩn danh hoá. Nhật ký máy chủ được lưu ngắn hạn (thường không quá 30 ngày). Bản ghi lựa chọn cookie được lưu 12 tháng. Khi pháp luật yêu cầu giữ lâu hơn cho mục đích kế toán hoặc giải quyết tranh chấp, chúng tôi giữ đúng thời hạn đó."},
        "s7": {"title": "7. Bảo mật",
               "text": "Chúng tôi dùng HTTPS cho toàn bộ website, giới hạn quyền truy cập vào hộp thư và hệ thống, thu thập dữ liệu tối thiểu và yêu cầu nhà cung cấp mã hoá dữ liệu khi lưu trữ. Không có hệ thống nào an toàn tuyệt đối; nếu xảy ra sự cố ảnh hưởng đến dữ liệu của bạn, chúng tôi thông báo theo quy định pháp luật."},
        "s8": {"title": "8. Quyền của bạn",
               "text": "Bạn có quyền được biết dữ liệu nào đang được xử lý, yêu cầu truy cập, chỉnh sửa, xoá, hạn chế hoặc phản đối việc xử lý, yêu cầu chuyển dữ liệu sang đơn vị khác khi khả thi về kỹ thuật, và rút lại sự đồng ý bất cứ lúc nào cho các mục đích dựa trên đồng ý. Gửi yêu cầu tới contact@brisasoft.net; chúng tôi phản hồi trong vòng 30 ngày và có thể đề nghị xác minh danh tính để bảo vệ dữ liệu của bạn. Bạn cũng có quyền khiếu nại tới cơ quan quản lý về bảo vệ dữ liệu cá nhân tại nơi bạn cư trú."},
        "s9": {"title": "9. Trẻ vị thành niên",
               "text": "Website hướng tới khách hàng doanh nghiệp và không dành cho người dưới 16 tuổi. Chúng tôi không chủ động thu thập dữ liệu của trẻ em; nếu phát hiện, chúng tôi sẽ xoá."},
        "s10": {"title": "10. Thay đổi thông báo",
                "text": "Khi nội dung thay đổi, chúng tôi cập nhật số phiên bản và ngày hiệu lực ở đầu trang. Thay đổi quan trọng về mục đích hoặc phạm vi xử lý sẽ được thông báo trên website trước khi áp dụng."},
        "s11": {"title": "11. Liên hệ",
                "text": "Công ty Cổ phần Brisasoft · contact@brisasoft.net · +84 927 997 699 · Tầng 3 số 3 ngõ 114 Kim Quan Thượng, phường Việt Hưng, Long Biên, Hà Nội, Việt Nam."}
    },
    "en": {
        "eyebrow": "Legal",
        "title": "Privacy notice",
        "text": "This notice explains what Brisasoft collects when you use this website, why, how long we keep it and what you can ask us to do.",
        "updated": "Version 2.0 — updated 27 October 2026. Replaces all earlier versions.",
        "s1": {"title": "1. Who is responsible",
               "text": "Brisasoft Joint Stock Company, business registration 0110870824, 3rd floor, No. 3, Lane 114 Kim Quan Thuong, Viet Hung Ward, Long Bien District, Hanoi, Vietnam — is the controller of data collected through this website. Write to contact@brisasoft.net for any data question."},
        "s2": {"title": "2. What we collect",
               "text": "We collect only what the purposes in section 3 require: (a) what you send through the contact form — last name, first name, work email, company, job title, country/region and your message; (b) minimal technical data when you visit — IP address, browser type, time and requested page, recorded by our infrastructure provider to run and protect the site; (c) preferences stored on your device — display language and your cookie choice. We do not ask for sensitive data, and you should not send it through the form."},
        "s3": {"title": "3. Why we use it, and on what basis",
               "text": "Answering your enquiry: necessary to take steps at your request before entering a contract. Operating, securing and debugging the site: our legitimate interest in keeping it available and safe. Measuring usage and improving content: only with your consent through the cookie settings. We do not use your data for automated advertising and we do not sell it."},
        "s4": {"title": "4. Cookies and similar technologies",
               "text": "By default the site uses only what it needs: a local preference for display language and a record of your cookie decision. Measurement cookies are enabled only after you consent and can be refused without losing any functionality. Types, retention and how to change your choice are set out in the Cookie policy."},
        "s5": {"title": "5. Sharing and transfers",
               "text": "We share the minimum necessary with providers that run the site and deliver enquiries: infrastructure and content delivery (Cloudflare) and the email service that sends and receives enquiries. They act on our instructions and may not use the data for their own purposes. Data may be processed outside Vietnam; where that happens we rely on contractual safeguards and select providers with comparable security commitments. We disclose information where a competent authority lawfully requires it."},
        "s6": {"title": "6. How long we keep it",
               "text": "Form enquiries and correspondence are kept for up to 24 months from the last contact, then deleted or anonymised. Server logs are short-lived (normally no more than 30 days). Your cookie record is kept for 12 months. Where accounting or dispute rules require a longer period, we keep the data only for that period."},
        "s7": {"title": "7. Security",
               "text": "The whole site is served over HTTPS; access to the mailbox and systems is restricted; we minimise what we collect; providers are required to encrypt data at rest. No system is perfectly secure. If an incident affects your data, we notify as required by law."},
        "s8": {"title": "8. Your rights",
               "text": "You may ask what data we hold, request access, correction, deletion, restriction or object to processing, ask for portability where technically feasible, and withdraw consent at any time for consent-based purposes. Write to contact@brisasoft.net; we answer within 30 days and may ask you to verify identity to protect your data. You may also complain to the data protection authority where you live."},
        "s9": {"title": "9. Children",
               "text": "This site is aimed at business customers and is not intended for anyone under 16. We do not knowingly collect children's data and will delete it if we learn we have."},
        "s10": {"title": "10. Changes",
                "text": "When the content changes we update the version number and effective date at the top. Material changes to purposes or scope are announced on the site before they take effect."},
        "s11": {"title": "11. Contact",
                "text": "Brisasoft Joint Stock Company · contact@brisasoft.net · +84 927 997 699 · 3rd floor, No. 3, Lane 114 Kim Quan Thuong, Viet Hung Ward, Long Bien District, Hanoi, Vietnam."}
    },
    "ja": {
        "eyebrow": "法務情報",
        "title": "プライバシー通知",
        "text": "本通知は、本ウェブサイトのご利用にあたりBrisasoftが取得する情報、その目的、保存期間、お客様の権利について説明します。",
        "updated": "第2.0版 — 2026年10月27日改定。従前の版に代わるものです。",
        "s1": {"title": "1. 責任主体",
               "text": "ブリサソフト株式会社（Brisasoft Joint Stock Company、企業登録番号0110870824、ベトナム・ハノイ市ロンビエン区ヴィエットフン坊キムクアントゥオン通り114番小路3号3階）が、本ウェブサイトを通じて取得する情報の管理者です。データに関するお問い合わせは contact@brisasoft.net までご連絡ください。"},
        "s2": {"title": "2. 取得する情報",
               "text": "第3項の目的に必要な範囲に限り取得します。(a) お問い合わせフォームでご入力いただく姓・名・業務用メールアドレス・会社名・役職・国／地域・お問い合わせ内容、(b) ご訪問時の最小限の技術情報（IPアドレス、ブラウザ種別、日時、閲覧ページ。サイトの運用と保護のためインフラ事業者が記録）、(c) 端末に保存される設定（表示言語、Cookieの選択）。機微情報は取得せず、フォームでのご入力もお願いしておりません。"},
        "s3": {"title": "3. 利用目的と法的根拠",
               "text": "お問い合わせへの回答：ご依頼に基づく契約締結前の対応として必要。サイトの運用・保全・障害解析：サービスを安全に提供する正当な利益。利用状況の測定と内容改善：Cookie設定でご同意いただいた場合のみ。自動広告には利用せず、データを販売することはありません。"},
        "s4": {"title": "4. Cookie等の技術",
               "text": "初期状態では必要なもののみを使用します（表示言語の設定、Cookie選択の記録）。測定用Cookieはご同意後のみ有効となり、拒否しても機能は損なわれません。種類・保存期間・変更方法は「Cookieポリシー」に記載しています。"},
        "s5": {"title": "5. 第三者提供と越境移転",
               "text": "サイトの運用とお問い合わせの受付に必要な範囲で、インフラ／コンテンツ配信（Cloudflare）およびメール送受信サービスに委託します。委託先は当社の指示に従い、独自目的では利用しません。ベトナム国外で処理される場合は、契約上の保護措置を講じ、同等の安全管理を約する事業者を選定します。法令に基づく正当な要請には開示することがあります。"},
        "s6": {"title": "6. 保存期間",
               "text": "フォームでのお問い合わせとやり取りは最終接触から最大24か月保存し、その後削除または匿名化します。サーバーログは短期（通常30日以内）。Cookieの選択記録は12か月。会計・紛争対応で法令上必要な場合はその期間に限り保存します。"},
        "s7": {"title": "7. 安全管理",
               "text": "サイト全体をHTTPSで配信し、メールボックスとシステムへのアクセスを制限し、取得情報を最小化し、委託先には保存データの暗号化を求めています。完全に安全なシステムは存在しません。お客様のデータに影響する事故が生じた場合は、法令に従い通知します。"},
        "s8": {"title": "8. お客様の権利",
               "text": "保有情報の確認、アクセス、訂正、削除、利用制限、異議申立て、技術的に可能な範囲でのデータ移行、同意の撤回（同意に基づく処理について）を求めることができます。contact@brisasoft.net までご連絡ください。30日以内に回答し、本人確認をお願いする場合があります。お住まいの地域の監督機関に申し立てることもできます。"},
        "s9": {"title": "9. 未成年者",
               "text": "本サイトは法人のお客様向けであり、16歳未満の方の利用を想定していません。児童の情報を故意に取得することはなく、判明した場合は削除します。"},
        "s10": {"title": "10. 改定",
                "text": "内容を変更した場合は、冒頭の版数と施行日を更新します。利用目的や範囲に重要な変更がある場合は、適用前にサイト上でお知らせします。"},
        "s11": {"title": "11. お問い合わせ",
                "text": "ブリサソフト株式会社 · contact@brisasoft.net · +84 927 997 699 · ベトナム・ハノイ市ロンビエン区ヴィエットフン坊キムクアントゥオン通り114番小路3号3階。"}
    }
}

COOKIES = {
    "vi": {
        "eyebrow": "Pháp lý", "title": "Chính sách cookie",
        "text": "Website dùng một lượng cookie tối thiểu. Bạn quyết định loại nào được bật.",
        "updated": "Phiên bản 1.0 — 27/10/2026.",
        "s1": {"title": "1. Cookie là gì",
               "text": "Cookie là tệp nhỏ được lưu trên thiết bị khi bạn truy cập website; bộ nhớ cục bộ (local storage) có chức năng tương tự. Chúng giúp website ghi nhớ lựa chọn của bạn và, khi được đồng ý, đo lường cách nội dung được sử dụng."},
        "s2": {"title": "2. Loại cookie chúng tôi dùng",
               "text": "Cần thiết (luôn bật): giữ ngôn ngữ hiển thị và bản ghi quyết định cookie; lưu 12 tháng; không định danh cá nhân. Đo lường (mặc định tắt): thống kê tổng hợp lượt xem, trang phổ biến, quốc gia và loại thiết bị; lưu tối đa 6 tháng. Tiếp thị (mặc định tắt, hiện chưa sử dụng): nếu sau này dùng để đo hiệu quả chiến dịch, chúng tôi sẽ cập nhật chính sách trước."},
        "s3": {"title": "3. Thay đổi lựa chọn",
               "text": "Mở phần thiết lập cookie bất cứ lúc nào từ liên kết ở chân trang, hoặc xoá dữ liệu trang trong trình duyệt để đưa mọi thứ về mặc định. Từ chối cookie đo lường không ảnh hưởng đến việc đọc nội dung hay gửi biểu mẫu."},
        "s4": {"title": "4. Bên thứ ba",
               "text": "Hạ tầng và phân phối nội dung do Cloudflare cung cấp; Cloudflare có thể đặt cookie kỹ thuật cần thiết để bảo vệ website. Chúng tôi không nhúng trình theo dõi quảng cáo của mạng xã hội."},
        "s5": {"title": "5. Thay đổi và liên hệ",
               "text": "Khi danh mục cookie thay đổi, chúng tôi cập nhật trang này và số phiên bản. Câu hỏi xin gửi tới contact@brisasoft.net."}
    },
    "en": {
        "eyebrow": "Legal", "title": "Cookie policy",
        "text": "This website uses a minimal set of cookies. You decide which categories run.",
        "updated": "Version 1.0 — 27 October 2026.",
        "s1": {"title": "1. What cookies are",
               "text": "Cookies are small files stored on your device when you visit a website; local storage works in a similar way. They let the site remember your choices and, with consent, measure how content is used."},
        "s2": {"title": "2. The categories we use",
               "text": "Necessary (always on): keeps your display language and a record of your cookie decision; stored 12 months; no personal identification. Measurement (off by default): aggregate page views, popular pages, country and device type; kept up to 6 months. Marketing (off, not currently used): if we later measure campaign performance, this policy is updated first."},
        "s3": {"title": "3. Changing your choice",
               "text": "Open the cookie settings at any time from the footer link, or clear site data in your browser to return to defaults. Refusing measurement cookies does not affect reading content or sending the contact form."},
        "s4": {"title": "4. Third parties",
               "text": "Infrastructure and content delivery are provided by Cloudflare, which may set strictly necessary technical cookies to protect the site. We do not embed social-media advertising trackers."},
        "s5": {"title": "5. Changes and contact",
               "text": "If the categories change we update this page and the version number. Questions: contact@brisasoft.net."}
    },
    "ja": {
        "eyebrow": "法務情報", "title": "Cookieポリシー",
        "text": "本サイトは必要最小限のCookieのみを使用します。有効にする種類はお客様が選択できます。",
        "updated": "第1.0版 — 2026年10月27日。",
        "s1": {"title": "1. Cookieとは",
               "text": "Cookieはウェブサイトの閲覧時に端末へ保存される小さなファイルで、ローカルストレージも同様の役割を持ちます。サイトがお客様の選択を記憶し、同意がある場合にコンテンツの利用状況を測定するために使用します。"},
        "s2": {"title": "2. 使用する種類",
               "text": "必須（常時有効）：表示言語とCookie選択の記録。保存期間12か月。個人を特定しません。測定（初期は無効）：閲覧数・人気ページ・国・端末種別の集計。最長6か月。マーケティング（無効・現在未使用）：将来キャンペーン効果の測定に用いる場合は、事先に本ポリシーを改定します。"},
        "s3": {"title": "3. 選択の変更",
               "text": "フッターのリンクからいつでもCookie設定を開けます。ブラウザでサイトデータを消去すると初期状態に戻ります。測定Cookieを拒否しても、閲覧やお問い合わせの送信に影響はありません。"},
        "s4": {"title": "4. 第三者",
               "text": "インフラとコンテンツ配信はCloudflareが提供しており、サイト保護のため厳密に必要な技術的Cookieを設定する場合があります。SNSの広告トラッカーは埋め込んでいません。"},
        "s5": {"title": "5. 改定・お問い合わせ",
               "text": "種類を変更する場合は本ページと版数を更新します。ご質問は contact@brisasoft.net まで。"}
    }
}

CONSENT = {
    "vi": {
        "title": "Cookie trên website này",
        "text": "Chúng tôi dùng cookie cần thiết để website hoạt động và, khi bạn đồng ý, cookie đo lường để hiểu nội dung nào hữu ích. Bạn có thể chấp nhận, từ chối hoặc chọn từng loại. Xem Chính sách cookie và Thông báo quyền riêng tư.",
        "accept": "Chấp nhận tất cả", "reject": "Từ chối tất cả", "settings": "Thiết lập cookie",
        "save": "Lưu lựa chọn", "close": "Đóng",
        "settingsTitle": "Thiết lập cookie",
        "settingsText": "Bật hoặc tắt từng loại. Cookie cần thiết luôn bật vì website không hoạt động thiếu chúng.",
        "necessary": "Cần thiết", "necessaryText": "Ngôn ngữ hiển thị và bản ghi quyết định cookie. Không định danh cá nhân.",
        "analytics": "Đo lường", "analyticsText": "Thống kê tổng hợp về lượt xem và thiết bị để cải thiện nội dung.",
        "marketing": "Tiếp thị", "marketingText": "Hiện chưa dùng. Nếu bật sau này sẽ dùng để đo hiệu quả chiến dịch.",
        "alwaysOn": "Luôn bật",
        "cookiePolicy": "Chính sách cookie", "privacyPolicy": "Thông báo quyền riêng tư",
        "footerLink": "Thiết lập cookie"
    },
    "en": {
        "title": "Cookies on this website",
        "text": "We use necessary cookies to run the site and, with your consent, measurement cookies to understand which content helps. You can accept, reject or choose per category. See the Cookie policy and Privacy notice.",
        "accept": "Accept all cookies", "reject": "Reject all", "settings": "Cookies settings",
        "save": "Save preferences", "close": "Close",
        "settingsTitle": "Cookie settings",
        "settingsText": "Turn each category on or off. Necessary cookies stay on because the site cannot work without them.",
        "necessary": "Necessary", "necessaryText": "Display language and your cookie decision. No personal identification.",
        "analytics": "Measurement", "analyticsText": "Aggregate page views and device statistics, used to improve content.",
        "marketing": "Marketing", "marketingText": "Not used today. If enabled later, it measures campaign performance.",
        "alwaysOn": "Always on",
        "cookiePolicy": "Cookie policy", "privacyPolicy": "Privacy notice",
        "footerLink": "Cookie settings"
    },
    "ja": {
        "title": "本サイトのCookieについて",
        "text": "サイトの動作に必要なCookieを使用し、ご同意いただいた場合は内容改善のため測定用Cookieを使用します。すべて許可、すべて拒否、種類ごとの選択が可能です。詳しくは「Cookieポリシー」および「プライバシー通知」をご覧ください。",
        "accept": "すべて許可", "reject": "すべて拒否", "settings": "Cookie設定",
        "save": "選択を保存", "close": "閉じる",
        "settingsTitle": "Cookie設定",
        "settingsText": "種類ごとにオン／オフできます。必須Cookieはサイトの動作に必要なため常時オンです。",
        "necessary": "必須", "necessaryText": "表示言語とCookie選択の記録。個人を特定しません。",
        "analytics": "測定", "analyticsText": "閲覧数や端末の集計情報。コンテンツ改善に使用します。",
        "marketing": "マーケティング", "marketingText": "現在は未使用。将来有効にする場合はキャンペーン効果の測定に使用します。",
        "alwaysOn": "常時オン",
        "cookiePolicy": "Cookieポリシー", "privacyPolicy": "プライバシー通知",
        "footerLink": "Cookie設定"
    }
}

META = {
    "vi": {"title": "Chính sách cookie | Brisasoft", "description": "Cookie website Brisasoft dùng, thời hạn lưu và cách thay đổi lựa chọn."},
    "en": {"title": "Cookie policy | Brisasoft", "description": "Cookies used by the Brisasoft website, how long they last and how to change your choice."},
    "ja": {"title": "Cookieポリシー | Brisasoft", "description": "Brisasoftサイトで使用するCookie、保存期間、選択の変更方法。"},
}

for code in ("vi", "en", "ja"):
    path = os.path.join(I18N, f"{code}.json")
    with open(path, encoding="utf-8") as f:
        d = json.load(f, object_pairs_hook=collections.OrderedDict)
    d["privacy"] = PRIVACY[code]
    d["cookies"] = COOKIES[code]
    d["consent"] = CONSENT[code]
    d["meta"]["cookies"] = META[code]
    d["footer"]["cookieSettings"] = CONSENT[code]["footerLink"]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("updated", code)
