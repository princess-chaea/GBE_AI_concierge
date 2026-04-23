import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. 질문을 임베딩 벡터로 변환 (Gemini API 호출 필요)
    // 이 부분은 클라이언트나 서버에서 Gemini Embedding API를 사용하여 구현합니다.
    // 여기서는 개념적 흐름을 보여줍니다.
    const queryEmbedding = await getGeminiEmbedding(message);

    // 2. Supabase에서 유사한 문서 검색
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5,
    });

    if (error) throw error;

    // 3. 검색된 문맥(Context) 생성
    const contextText = documents
      ?.map((doc: any) => doc.content)
      .join('\n\n---\n\n') || '관련 자료를 찾을 수 없습니다.';

    // 4. Gemini에게 최종 질문 (Strict Context 적용)
    const prompt = `
      당신은 학교 행정 전문가입니다. 
      아래에 제공된 [참고 자료]를 바탕으로 사용자의 질문에 답변하세요.
      자료에 없는 내용이라면 절대로 추측하지 말고 "제공된 자료에서 관련 내용을 찾을 수 없습니다"라고 답변하세요.

      [참고 자료]:
      ${contextText}

      질문: ${message}
    `;

    const answer = await callGeminiGenerate(prompt);

    return NextResponse.json({ answer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 헬퍼 함수: Gemini 임베딩 생성 (Gemini Embedding 2 최신 가이드 적용)
async function getGeminiEmbedding(text: string) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  const model = "gemini-embedding-2";
  
  // RAG 질문용 접두사 추가 (최신 가이드 권장 사항)
  const formattedText = `task: question answering | query: ${text}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text: formattedText }] },
        output_dimensionality: 768 // 차원 고정으로 효율성 증대
      }),
    }
  );

  const json = await response.json();
  if (json.error) throw new Error(json.error.message);
  
  return json.embedding.values;
}

// 헬퍼 함수: Gemini 답변 생성 (사용자 요청에 따라 2.5-flash 적용)
async function callGeminiGenerate(prompt: string) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  const model = "gemini-2.5-flash"; // 최신 2.5-flash 모델 적용

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    }
  );

  const json = await response.json();
  if (json.error) throw new Error(json.error.message);

  return json.candidates[0].content.parts[0].text;
}
