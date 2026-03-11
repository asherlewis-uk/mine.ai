import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://host.docker.internal:11434';

export async function POST(req: Request) {
  try {
    const { model, messages, temperature, stream } = await req.json();
    
    const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, options: { temperature }, stream })
    });

    if (!response.ok) return NextResponse.json({ error: response.statusText }, { status: response.status });

    if (stream) {
      const transformStream = new TransformStream();
      const writer = transformStream.writable.getWriter();
      (async () => {
        const reader = response.body?.getReader();
        if (!reader) return writer.close();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            await writer.write(value);
          }
        } finally { await writer.close(); }
      })();
      return new Response(transformStream.readable, { headers: { 'Content-Type': 'application/x-ndjson' } });
    }

    return NextResponse.json(await response.json());
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

