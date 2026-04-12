# Google Maps Veri Kazıyıcı

n8n destekli Google Maps işletme verisi kazıyıcı web uygulaması. Doğal dilde arama yapın (Türkçe), sonuçları Excel dosyası olarak indirin.

## Nasıl Çalışır

```
Tarayıcı → Next.js → /api/search (proxy) → n8n webhook → iş akışı → .xlsx yanıtı
```

n8n iş akışı:
1. Kullanıcının mesajını LLM ile Google Maps sorgusuna çevirir
2. SerpAPI ile Google Maps'te arar
3. Sonuçları işler ve `.xlsx` dosyası olarak döndürür

## Gereksinimler

- Node.js 22+
- pnpm
- Çalışan bir n8n örneği (scraper iş akışı kurulu)

## Yerel Geliştirme

```bash
# Bağımlılıkları yükle
pnpm install

# Ortam değişkenlerini ayarla
cp .env.example .env.local
# .env.local dosyasını düzenle

# Geliştirme sunucusunu başlat
pnpm dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

## Ortam Değişkenleri

| Değişken | Zorunlu | Varsayılan | Açıklama |
|----------|---------|------------|----------|
| `N8N_WEBHOOK_URL` | Evet | — | n8n webhook endpoint URL'si |
| `N8N_WEBHOOK_SECRET` | Hayır | — | `X-Webhook-Secret` header değeri |
| `MAX_MESSAGE_LENGTH` | Hayır | `500` | Maksimum karakter limiti |
| `REQUEST_TIMEOUT_MS` | Hayır | `120000` | n8n isteği zaman aşımı (ms) |

## Docker

```bash
# .env dosyası oluştur
cp .env.example .env

# Derle ve çalıştır
docker compose -f docker-compose.app.yml up --build
```

## CI/CD

- **CI** (GitHub Actions): PR ve `main` push'larında lint + typecheck + build
- **CD** (Dokploy): CI başarılı olduğunda Dokploy webhook'u tetiklenir

### GitHub Secrets

| Secret | Açıklama |
|--------|----------|
| `DOKPLOY_DEPLOY_WEBHOOK` | Dokploy deploy webhook URL'si |

### Dokploy Kurulumu

1. Dokploy'da yeni uygulama oluştur (kaynak: GitHub, build: Dockerfile)
2. Ortam değişkenlerini Dokploy UI'da ayarla
3. Uygulamayı n8n ile aynı Docker ağına bağla
4. Deploy webhook URL'sini GitHub secrets'a ekle

## n8n Yapılandırması

### Webhook Güvenliği
n8n Webhook node'unda **Header Auth** etkinleştir:
- Header: `X-Webhook-Secret`
- Değer: güçlü bir rastgele string (Dokploy'daki `N8N_WEBHOOK_SECRET` ile aynı)

### Zaman Aşımı
n8n container ortam değişkenlerine ekle:
```
EXECUTIONS_TIMEOUT=180
EXECUTIONS_TIMEOUT_MAX=300
```
