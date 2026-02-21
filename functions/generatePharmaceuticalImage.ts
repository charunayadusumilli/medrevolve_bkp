import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { productName, form, color, style = 'professional' } = body;

    if (!productName || !form) {
      return Response.json({ error: 'productName and form required' }, { status: 400 });
    }

    // Build detailed prompt for AI image generation
    let prompt = '';
    
    if (form.includes('Pen') || form.includes('Auto')) {
      prompt = `Professional pharmaceutical auto-injector pen with MR MEDREVOLVE branding. The pen is ${color || 'sleek white and blue'} with white MR logo and "MEDREVOLVE" text. Studio lighting, clean white/gray background, premium medical product photography. Realistic, professional, high-end pharmaceutical styling. Product name: ${productName}. Focus on the pen details, metal accents, and branding clarity.`;
    } else if (form.includes('Vial') || form.includes('Injectable')) {
      prompt = `Professional pharmaceutical glass vial with MR MEDREVOLVE branding on black label. ${color || 'Clear glass vial'} with white/silver cap. Liquid visible inside (slightly tinted). Black label band with white MR logo and "MEDREVOLVE" text. Studio photography, clean bright background, professional medical product. Realistic and premium. Product name: ${productName}.`;
    } else if (form.includes('Spray') || form.includes('Nasal')) {
      prompt = `Professional pharmaceutical nasal spray bottle with MR MEDREVOLVE branding. ${color || 'White'} pump bottle with black label band. White MR logo and "MEDREVOLVE" text on the black label. Clean white/translucent design. Studio lighting, premium medical product photography. Professional and sleek. Product name: ${productName}.`;
    } else if (form.includes('Tablet') || form.includes('Capsule') || form.includes('Pill')) {
      prompt = `Professional pharmaceutical pill with MR embossed on top. ${color || 'Golden yellow'} oval-shaped pill with "MR" clearly stamped/embossed on the surface. Close-up studio photography with dramatic lighting showing texture and dimension. Premium medical product styling. Realistic and professional. Product name: ${productName}.`;
    } else if (form.includes('Cream') || form.includes('Topical')) {
      prompt = `Professional pharmaceutical cream jar with MR MEDREVOLVE branding. ${color || 'White'} pump bottle or jar with black label. White MR logo and "MEDREVOLVE" text. Clean, minimal design. Studio lighting on neutral background. Premium skincare/pharmaceutical product photography. Product name: ${productName}.`;
    } else {
      prompt = `Professional pharmaceutical product with MR MEDREVOLVE branding in ${color || 'sleek modern design'}. Clean studio photography with white/gray background. Medical product aesthetic, premium and professional. Product name: ${productName}.`;
    }

    // Call AI image generation
    const response = await base44.integrations.Core.GenerateImage({
      prompt: prompt,
    });

    return Response.json({
      success: true,
      imageUrl: response.url,
      productName: productName,
      form: form,
    });
  } catch (error) {
    console.error('Error generating pharmaceutical image:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});