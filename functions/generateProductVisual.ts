import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Prompt templates per product form — MedRevolve branded pharmaceutical studio style
const FORM_PROMPTS = {
  'injection': `Professional pharmaceutical product photography. A single glass injectable vial with dark forest green (#2D3A2D) rubber stopper and crisp white label reading "MEDREVOLVE" in bold, sitting on a clean matte white surface. Soft studio lighting from upper left, subtle shadow. Clinical yet premium, like a high-end telehealth brand. Background: pure off-white cream (#FDFBF7). Macro lens, razor sharp focus, minimal depth of field. No hands, no people.`,
  
  'pen': `Professional pharmaceutical product photography. A sleek auto-injector pen in deep forest green (#2D3A2D) with a minimalist white "MR" logo embossed on the side. Modern EpiPen-style form factor. Studio lighting on a clean cream/off-white surface. Premium medical device aesthetic — like Hims or Ro packaging. Shallow depth of field, soft bokeh background. No hands.`,
  
  'tablet': `Professional pharmaceutical product photography. A small white prescription tablet pill resting on a clean matte white ceramic dish or surface. One single pill, sharp focus. "MR" subtle emboss on tablet. Soft natural studio light, cream background (#FDFBF7). Premium minimalist wellness brand aesthetic. No blister pack, no bottle.`,
  
  'capsule': `Professional pharmaceutical product photography. A single white and forest-green (#2D3A2D) capsule pill on a clean white marble surface. Premium pharmaceutical aesthetic. Soft diffused studio lighting, macro lens. Clean cream background. Minimal, elegant, clinical. No text visible except subtle MR emboss.`,
  
  'drops': `Professional pharmaceutical product photography. A small amber/frosted glass dropper bottle with a dark green cap, white label reading "MEDREVOLVE" in clean sans-serif. Sublingual oral drops. Placed on a clean white surface with soft natural light. Premium wellness brand aesthetic — like Hims or Keeps. Soft shadow, clean background.`,
  
  'spray': `Professional pharmaceutical product photography. A slim frosted glass nasal spray bottle with a forest green (#2D3A2D) pump mechanism and minimalist white label. Clean, medical-grade aesthetic. Studio lighting on an off-white surface. Premium telehealth brand look. Macro close-up, shallow depth of field.`,
  
  'cream': `Professional pharmaceutical product photography. A small white squeeze tube with a dark forest green (#2D3A2D) flip cap. Minimalist label reading "MEDREVOLVE" in clean typography. Pharmaceutical cream or topical gel tube. Premium wellness aesthetic. Soft studio lighting, clean white/cream background. No hands.`,
  
  'default': `Professional pharmaceutical product photography. A premium MedRevolve branded pharmaceutical product in dark forest green (#2D3A2D) and white packaging. Clean studio lighting, off-white cream background. Premium telehealth brand aesthetic like Hims, Ro, or Function Health. Minimal, clinical, beautiful.`
};

function getPromptKey(form) {
  const f = (form || '').toLowerCase();
  if (f.includes('vial')) return 'injection';
  if (f.includes('pen') || f.includes('injector')) return 'pen';
  if (f.includes('capsule')) return 'capsule';
  if (f.includes('tablet')) return 'tablet';
  if (f.includes('drop') || f.includes('sublingual')) return 'drops';
  if (f.includes('spray') || f.includes('nasal')) return 'spray';
  if (f.includes('cream') || f.includes('topical') || f.includes('gel')) return 'cream';
  return 'default';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { productName, form, category } = await req.json();

    if (!form && !productName) {
      return Response.json({ error: 'productName or form required' }, { status: 400 });
    }

    const promptKey = getPromptKey(form);
    const basePrompt = FORM_PROMPTS[promptKey];
    
    // Enhance prompt with product-specific context
    const categoryContext = category ? `, used for ${category} treatment` : '';
    const fullPrompt = `${basePrompt} Product name context: ${productName || form}${categoryContext}. Ultra high quality, 4K, professional product photography.`;

    console.log(`Generating image for: ${productName} (${form}) using prompt key: ${promptKey}`);

    const result = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt: fullPrompt,
    });

    if (!result?.url) {
      return Response.json({ error: 'Image generation failed — no URL returned' }, { status: 500 });
    }

    console.log(`✅ Image generated for ${productName}: ${result.url}`);
    return Response.json({ imageUrl: result.url, promptKey });

  } catch (error) {
    console.error('generateProductVisual error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});