#!/usr/bin/env bash
# Creates cert-acme in Casdoor if missing (fixes BOF login JWT error).
set -euo pipefail

CASDOOR_URL="${CASDOOR_URL:-http://localhost:8000}"
COOKIE_FILE="$(mktemp)"
trap 'rm -f "$COOKIE_FILE"' EXIT

echo "Logging in to Casdoor admin..."
curl -sf -c "$COOKIE_FILE" -X POST "$CASDOOR_URL/api/login" \
  -H "Content-Type: application/json" \
  -d '{"organization":"built-in","username":"admin","password":"123","application":"app-built-in","type":"login"}' \
  >/dev/null

existing="$(curl -sf -b "$COOKIE_FILE" "$CASDOOR_URL/api/get-cert?id=acme/cert-acme" | grep -c '"name": "cert-acme"' || true)"
if [[ "$existing" -ge 1 ]]; then
  echo "cert-acme already exists."
  exit 0
fi

echo "Creating cert-acme..."
result="$(curl -sf -b "$COOKIE_FILE" -X POST "$CASDOOR_URL/api/add-cert" \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "acme",
    "name": "cert-acme",
    "displayName": "Acme JWT Cert",
    "scope": "JWT",
    "type": "x509",
    "cryptoAlgorithm": "RS256",
    "bitSize": 4096,
    "expireInYears": 20,
    "certificate": "",
    "privateKey": ""
  }')"

if echo "$result" | grep -q '"status": "ok"'; then
  echo "cert-acme created. Try logging in to the back office again."
else
  echo "Failed to create cert-acme:"
  echo "$result"
  exit 1
fi
