import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { fileName, fileData, mimeType, metadata: requestMetadata } = await req.json();
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
    // 헬퍼 함수: 텍스트를 적절한 크기로 쪼개기
    function chunkText(text: string, size: number = 1000) {
      const chunks = [];
      for (let i = 0; i < text.length; i += size) {
        chunks.push(text.slice(i, i + size));
      }
      return chunks;
    }

    const textChunks = chunkText(extractedText);
    console.log(`[Ingest] Step 1 Complete: Text extracted. Processing ${textChunks.length} chunks in batches.`);

    let successCount = 0;
    const batchSize = 3; // 한 번에 3개씩만 병렬 처리 (API 제한 방지)

    for (let i = 0; i < textChunks.length; i += batchSize) {
      const batch = textChunks.slice(i, i + batchSize);
      const batchPromises = batch.map(async (chunk, index) => {
        const chunkIdx = i + index;
        try {
          const embedResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: { parts: [{ text: chunk }] },
                task_type: "RETRIEVAL_DOCUMENT", // 문서 저장용 모드임을 명시
                output_dimensionality: 768
              }),
            }
          );

          const embedJson = await embedResponse.json();
          if (embedJson.error) {
            console.error(`[Ingest] Chunk ${chunkIdx} Error:`, embedJson.error.message);
            return null;
          }
          const embedding = embedJson.embedding.values;

          return supabaseAdmin.from('documents').insert({
            content: chunk,
            metadata: { 
              title: fileName, 
              chunkIndex: chunkIdx, 
              totalChunks: textChunks.length,
              originalMimeType: mimeType,
              ...requestMetadata // 연도, 부서 등 추가 정보 포함
            },
            embedding: embedding
          });
        } catch (err) {
          console.error(`[Ingest] Error in chunk ${chunkIdx}:`, err);
          return null;
        }
      });

      const results = await Promise.all(batchPromises);
      successCount += results.filter(r => r && !r.error).length;
      
      // 배치 사이의 짧은 휴식 (안정성 확보)
      if (i + batchSize < textChunks.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`[Ingest] Step 3 Complete: Successfully stored ${successCount}/${textChunks.length} chunks for ${fileName}`);
    return NextResponse.json({ success: true, fileName, chunks: successCount });
  } catch (error: any) {
    console.error('[Ingest Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { error } = await supabaseAdmin.from('documents').delete().neq('id', 0); // 모든 행 삭제
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'All documents deleted.' });
  } catch (error: any) {
    console.error('[Delete Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
