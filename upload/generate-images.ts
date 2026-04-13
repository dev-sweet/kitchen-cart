import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const products = JSON.parse(fs.readFileSync('/home/z/my-project/upload/parsed-products.json', 'utf-8'));

async function generateImage(prompt: string, outputPath: string, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const zai = await ZAI.create();
      const response = await zai.images.generations.create({ prompt, size: '1024x1024' });
      if (!response.data?.[0]?.base64) throw new Error('No image data');
      const buffer = Buffer.from(response.data[0].base64, 'base64');
      fs.writeFileSync(outputPath, buffer);
      return outputPath;
    } catch (e: any) {
      console.error(`  Retry ${attempt} failed for ${outputPath}: ${e.message}`);
      if (attempt < retries) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return null;
}

async function main() {
  const outDir = '/home/z/my-project/public/images/products';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  
  const total = products.length;
  let done = 0;
  let failed = 0;
  
  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const filename = `${slug}.png`;
    const outputPath = `${outDir}/${filename}`;
    
    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      done++;
      console.log(`✓ [${done}/${total}] SKIP (exists): ${p.name}`);
      continue;
    }
    
    const prompt = `Professional product photography of ${p.name}, clean white/light gray background, studio lighting, e-commerce style product photo, high quality, centered composition`;
    
    const result = await generateImage(prompt, outputPath);
    if (result) {
      done++;
      console.log(`✓ [${done}/${total}] ${p.name}`);
    } else {
      failed++;
      // Use the original CSV image as fallback
      done++;
      console.log(`✗ [${done}/${total}] FAILED (using original): ${p.name}`);
      p.useOriginalImage = true;
    }
  }
  
  // Save updated data
  fs.writeFileSync('/home/z/my-project/upload/parsed-products.json', JSON.stringify(products, null, 2));
  console.log(`\nDone! ${total - failed} generated, ${failed} using originals`);
}

main().catch(console.error);
