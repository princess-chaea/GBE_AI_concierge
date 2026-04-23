import { supabase } from './supabase';

/**
 * 이 스크립트는 data/documents 폴더의 파일을 읽어 
 * Gemini Embedding 2 모델로 벡터화한 뒤 Supabase에 저장하는 핵심 로직입니다.
 */

export async function ingestDocument(title: string, content: string) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  const model = "gemini-embedding-2";

  // 1. 문서용 접두사 추가 (최신 가이드: title: {title} | text: {content})
  const formattedContent = `title: ${title} | text: ${content}`;

  console.log(`[Ingest] Processing: ${title}...`);

  try {
    // 2. Gemini 임베딩 API 호출
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { parts: [{ text: formattedContent }] }
        }),
      }
    );

    const json = await response.json();
    if (json.error) throw new Error(json.error.message);

    const embedding = json.embedding.values;

    // 3. Supabase에 저장
    const { error } = await supabase.from('documents').insert({
      content: content,
      metadata: { title: title },
      embedding: embedding
    });

    if (error) throw error;
    
    console.log(`[Success] ${title} has been indexed.`);
  } catch (err: any) {
    console.error(`[Error] Failed to ingest ${title}:`, err.message);
  }
}
