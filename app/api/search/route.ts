import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("N8N_WEBHOOK_URL is not configured");
    return NextResponse.json(
      { error: "Sunucu yapılandırma hatası" },
      { status: 500 }
    );
  }

  // Parse and validate
  let message: string;
  try {
    const body = await request.json();
    message = typeof body.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json(
      { error: "Geçersiz istek formatı" },
      { status: 400 }
    );
  }

  if (!message) {
    return NextResponse.json(
      { error: "Mesaj alanı boş bırakılamaz" },
      { status: 400 }
    );
  }

  const maxLength = parseInt(process.env.MAX_MESSAGE_LENGTH || "500", 10);
  if (message.length > maxLength) {
    return NextResponse.json(
      { error: `Mesaj çok uzun (maksimum ${maxLength} karakter)` },
      { status: 400 }
    );
  }

  // Proxy to n8n
  const timeoutMs = parseInt(process.env.REQUEST_TIMEOUT_MS || "120000", 10);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const secret = process.env.N8N_WEBHOOK_SECRET;
    if (secret) {
      headers["X-Webhook-Secret"] = secret;
    }

    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!n8nRes.ok) {
      const errorText = await n8nRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: "İş akışı başarısız oldu",
          details: errorText || `Durum kodu: ${n8nRes.status}`,
        },
        { status: 502 }
      );
    }

    // Stream the xlsx response through
    const contentType =
      n8nRes.headers.get("content-type") ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const contentDisposition =
      n8nRes.headers.get("content-disposition") ||
      'attachment; filename="google-maps-sonuclar.xlsx"';

    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    };

    const contentLength = n8nRes.headers.get("content-length");
    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength;
    }

    return new Response(n8nRes.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err) {
    clearTimeout(timer);

    if (err instanceof DOMException && err.name === "AbortError") {
      return NextResponse.json(
        { error: "İşlem zaman aşımına uğradı. Lütfen tekrar deneyin." },
        { status: 504 }
      );
    }

    console.error("n8n proxy error:", err);
    return NextResponse.json(
      {
        error: "n8n servisine ulaşılamadı",
        details: err instanceof Error ? err.message : undefined,
      },
      { status: 502 }
    );
  }
}
