import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. 질문을 임베딩 벡터로 변환 (Gemini API 호출 필요)
    // 이 부분은 클라이언트나 서버에서 Gemini Embedding API를 사용하여 구현합니다.
    // 여기서는 개념적 흐름을 보여줍니다.
    const queryEmbedding = await getGeminiEmbedding(message);

    // 2. Supabase에서 유사 문서 검색 (문턱값을 0.01로 낮추어 검색 범위 극대화)
    const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.01, // 무엇이라도 검색되도록 최저로 낮춤
      match_count: 5
    });

    if (searchError) throw searchError;

    console.log(`[Chat] Found ${documents?.length || 0} relevant documents.`);
    
    // 디버깅: 매칭된 문서와 점수 로그 출력
    documents?.forEach((doc: any, i: number) => {
      console.log(`  - Match ${i+1}: Similarity ${doc.similarity.toFixed(4)} | Title: ${doc.metadata?.title || 'Unknown'} | Content: ${doc.content.substring(0, 50)}...`);
    });

    if (!documents || documents.length === 0) {
      return NextResponse.json({ answer: "현재 학습된 데이터베이스에서 관련 정보를 찾을 수 없습니다. (검색된 내용 없음)" });
    }

    // 3. 검색된 문맥(Context) 생성
    const contextText = documents
      ?.map((doc: any) => doc.content)
      .join('\n\n---\n\n') || '관련 자료를 찾을 수 없습니다.';

    // 4. Gemini에게 최종 질문 (Strict Context 적용)
    const prompt = `
      당신은 경상북도교육청의 지능형 학교행정 컨시어지 '이지플로우(EasyFlow)'입니다. 
      아래에 제공된 [참고 자료]를 바탕으로 사용자의 질문에 친절하게 답변하세요.
      
      [지침]:
      1. 반드시 [참고 자료]의 내용만을 근거로 답변하세요.
      2. 자료에 없는 내용이라면 "현재 학습된 자료에는 해당 내용이 없습니다."라고 안내하고, 아는 범위 내에서 행정 절차를 설명해 주세요.

      [참고 자료]:
      ${contextText}

      질문: ${message}
    `;

    const answer = await callGeminiGenerate(prompt);

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("[Chat API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 헬퍼 함수: Gemini 임베딩 생성 (검색용 모드 적용)
async function getGeminiEmbedding(text: string) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  const model = "gemini-embedding-2";
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { 
          parts: [{ text: text }] 
        },
        task_type: "RETRIEVAL_QUERY", // 검색용 쿼리임을 명시
        output_dimensionality: 768
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
