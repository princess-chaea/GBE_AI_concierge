import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const documentsDir = path.join(process.cwd(), 'data/documents');

    if (!fs.existsSync(documentsDir)) {
      return NextResponse.json({ count: 0, message: 'data/documents 폴더가 존재하지 않습니다.' });
    }

    const files = fs.readdirSync(documentsDir).filter(f => !f.startsWith('.'));
    let successCount = 0;

    for (const fileName of files) {
      const filePath = path.join(documentsDir, fileName);
      const stats = fs.statSync(filePath);
      
      if (!stats.isFile()) continue;

      // 이미 저장된 파일인지 체크 (중복 방지)
      const { data: existing } = await supabaseAdmin
        .from('documents')
        .select('id')
        .contains('metadata', { title: fileName })
        .single();

      if (existing) {
        console.log(`[Sync] Skipping ${fileName} - already exists.`);
        continue;
      }

      console.log(`[Sync] Processing: ${fileName}`);
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');
      const ext = path.extname(fileName).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      if (ext === '.pdf') mimeType = 'application/pdf';
      else if (ext === '.txt') mimeType = 'text/plain';
      else if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';

      // 1. Gemini로 텍스트 추출
      const extractResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "이 파일의 모든 텍스트 내용을 마크다운 형식으로 추출해줘. 문서에 표나 그림이 있다면 설명도 포함해줘." },
                { inline_data: { mime_type: mimeType, data: base64Data } }
              ]
            }]
          }),
        }
      );

      const extractJson = await extractResponse.json();
      if (extractJson.error) {
        console.error(`[Sync] Error extracting ${fileName}:`, extractJson.error.message);
        continue;
      }
      const extractedText = extractJson.candidates[0].content.parts[0].text;

      // 2. 임베딩 생성
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
      if (embedJson.error) {
        console.error(`[Sync] Error embedding ${fileName}:`, embedJson.error.message);
        continue;
      }
      const embedding = embedJson.embedding.values;

      // 3. Supabase 저장
      const { error: insertError } = await supabaseAdmin.from('documents').insert({
        content: extractedText,
        metadata: { title: fileName, originalMimeType: mimeType, source: 'server_folder' },
        embedding: embedding
      });

      if (!insertError) successCount++;
    }

    return NextResponse.json({ success: true, count: successCount });
  } catch (error: any) {
    console.error('[Sync Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
