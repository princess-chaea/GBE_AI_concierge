import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { fileName, fileData, mimeType } = await req.json();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    console.log(`[Ingest] Processing file: ${fileName} (${mimeType})`);

    // 1. Gemini를 사용하여 파일에서 텍스트 추출 (OCR/텍스트 추출)
    // Gemini 2.5 Flash는 멀티모달이므로 파일을 읽고 텍스트로 변환할 수 있습니다.
    const extractResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "이 파일의 모든 텍스트 내용을 마크다운 형식으로 추출해줘. 문서에 표나 그림이 있다면 설명도 포함해줘." },
              { inline_data: { mime_type: mimeType, data: fileData } }
            ]
          }]
        }),
      }
    );

    const extractJson = await extractResponse.json();
    if (extractJson.error) throw new Error(extractJson.error.message);
    const extractedText = extractJson.candidates[0].content.parts[0].text;

    // 2. 추출된 텍스트를 최신 가이드 형식에 맞춰 임베딩 생성
    const embedResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { 
            parts: [{ text: `title: ${fileName} | text: ${extractedText}` }] 
          },
          output_dimensionality: 768
        }),
      }
    );

    const embedJson = await embedResponse.json();
    if (embedJson.error) throw new Error(embedJson.error.message);
    const embedding = embedJson.embedding.values;

    // 3. Supabase에 원본 텍스트와 임베딩 저장
    const { error } = await supabase.from('documents').insert({
      content: extractedText,
      metadata: { title: fileName, originalMimeType: mimeType },
      embedding: embedding
    });

    if (error) throw error;

    return NextResponse.json({ success: true, fileName });
  } catch (error: any) {
    console.error('[Ingest Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
