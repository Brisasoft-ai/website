#!/usr/bin/env python3
"""Recreate the DNS records needed after moving brisasoft.net to the Brisasoft Cloudflare account.

Why: the active zone lives in the old ReactPlus account. After the domain is transferred / NS changed,
the new zone must already contain the mail records, otherwise Google Workspace mail stops.

Does NOT create A/AAAA for the site: attaching the Worker custom domain creates those (proxied) itself.

Usage:
    export CLOUDFLARE_API_TOKEN=...      # needs Zone:DNS:Edit on brisasoft.net
    export CF_ZONE_ID=...
    python3 rebuild_dns.py               # idempotent: skips values that already exist

Values captured from the live zone on 2026-10-27.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.request

API = "https://api.cloudflare.com/client/v4"
ZONE = os.environ.get("CF_ZONE_ID", "").strip()
TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()

RECORDS = [
    # Mail: Google Workspace
    {"type": "MX", "name": "brisasoft.net", "content": "smtp.google.com", "priority": 10, "ttl": 1},
    {"type": "TXT", "name": "brisasoft.net", "content": "v=spf1 include:_spf.google.com ~all", "ttl": 1},
    {"type": "TXT", "name": "brisasoft.net",
     "content": "google-site-verification=jQWFWf31ZzSNnbEnCRJxh_owp-2d6-gptHIC5teSuFw", "ttl": 1},
    # Google DKIM (selector "google"); key captured from the live zone
    {"type": "TXT", "name": "google._domainkey.brisasoft.net",
     "content": "v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApJ+g2zpc2T8uUmC5oSuPKeK/7O0BbVTP6wxzuAL8eDuyO08spHc6xFVKJS0HKi7TA+TAyxL1bdSNHT5sOB27u64nJ7E/G5isF2HoLEuK+pC8rpcG3l/nojSA6Ipv+V0D3ghqtUCaWNCyAKrTOnJansY7dckRdvbzubfCv6wctF3jWB8qxVdq3xdoDOyVPCOOeUa"
                "ByBTPPqw3kaPd1uHATV5ogtT73NQ1O1iCQqBRG54zIjOqd5gh3DcCtWMhZa+SJFzo5DmlRSm+Xjgo/EF1MZenaGwtlw6AuS3ulwNwXeUKloVxQeiq5ZrAotowRdt7AJGwm/LS2fWvJekGOd6mmQIDAQAB",
     "ttl": 1},
    # Start DMARC in monitor mode; tighten to quarantine after 2-4 weeks of clean reports
    {"type": "TXT", "name": "_dmarc.brisasoft.net", "content": "v=DMARC1; p=none; rua=mailto:dmarc@brisasoft.net", "ttl": 1},
]


def call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"{API}{path}", data=data, method=method,
                                 headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def main():
    if not TOKEN or not ZONE:
        print("Set CLOUDFLARE_API_TOKEN (Zone:DNS:Edit) and CF_ZONE_ID first.", file=sys.stderr)
        return 2
    existing = call("GET", f"/zones/{ZONE}/dns_records?per_page=100").get("result", [])
    seen = {(r["type"], r["name"], r["content"]) for r in existing}
    created = skipped = 0
    for rec in RECORDS:
        key = (rec["type"], rec["name"], rec["content"])
        if key in seen:
            print("skip  ", rec["type"], rec["name"])
            skipped += 1
            continue
        res = call("POST", f"/zones/{ZONE}/dns_records", rec)
        if not res.get("success"):
            print("FAIL  ", rec["type"], rec["name"], res.get("errors"))
            return 1
        print("create", rec["type"], rec["name"])
        created += 1
    print(f"done: {created} created, {skipped} already present")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
