import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { fileName, fileData, mimeType } = await req.json();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 환경 변수 누락 체크 (디버깅용)
    if (!apiKey || !supabaseUrl || !supabaseServiceKey) {
      console.error('[Ingest Error] Missing Env Vars:', {
        hasApiKey: !!apiKey,
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey
      });
      throw new Error(`환경 변수가 설정되지 않았습니다. (API Key: ${!!apiKey}, URL: ${!!supabaseUrl}, ServiceKey: ${!!supabaseServiceKey})`);
    }

    if (!supabaseAdmin) {
      throw new Error('Supabase Admin 클라이언트가 초기화되지 않았습니다. 환경 변수를 확인해 주세요.');
    }

    console.log(`[Ingest] Processing file: ${fileName} (${mimeType})`);

    // 1. Gemini를 사용하여 텍스트 추출 시작
    console.log(`[Ingest] Step 1: Extracting text using Gemini 2.5 Flash...`);
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
    if (extractJson.error) throw new Error(`Extraction Error: ${extractJson.error.message}`);
    const extractedText = extractJson.candidates[0].content.parts[0].text;
    console.log(`[Ingest] Step 1 Complete: Text extracted (${extractedText.length} chars)`);

    // 2. 추출된 텍스트 임베딩 생성 시작
    console.log(`[Ingest] Step 2: Generating embeddings using Gemini Embedding 2...`);
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
    if (embedJson.error) throw new Error(`Embedding Error: ${embedJson.error.message}`);
    const embedding = embedJson.embedding.values;
    console.log(`[Ingest] Step 2 Complete: Embedding generated`);

    // 3. Supabase 저장 시작
    console.log(`[Ingest] Step 3: Storing in Supabase...`);
    const { error } = await supabaseAdmin.from('documents').insert({
      content: extractedText,
      metadata: { title: fileName, originalMimeType: mimeType },
      embedding: embedding
    });

    if (error) throw error;
    console.log(`[Ingest] Step 3 Complete: Successfully stored ${fileName}`);
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
