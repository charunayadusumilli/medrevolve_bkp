import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content_type, topic } = await req.json();

    // Content templates based on MedRevolve offerings
    const contentTemplates = {
      telehealth: {
        posts: [
          {
            caption: "🩺 Same-day telehealth appointments available!\n\nConnect with licensed providers from the comfort of your home. Prescriptions sent within 24 hours.\n\n✅ HIPAA-compliant\n✅ 50-state coverage\n✅ Board-certified providers\n\n#Telehealth #HealthcareAccess #WellnessJourney #MedRevolve",
            hook: "Need to see a doctor today?"
          },
          {
            caption: "💊 GLP-1 Weight Loss Protocols Now Available\n\nSemaglutide & Tirzepatide with physician supervision. Personalized dosing, ongoing support, and discreet delivery.\n\n📍 Licensed in all 50 states\n🔒 Private & secure\n⚡ Start in 3 easy steps\n\n#WeightLoss #GLP1 #Semaglutide #Telemedicine #WellnessGoals",
            hook: "Ready to start your weight loss journey?"
          },
          {
            caption: "⚡ Men's Health & TRT Services\n\nComprehensive testosterone optimization with bloodwork review and personalized protocols. Get your energy, vitality, and performance back.\n\n🩺 Licensed providers\n📊 Lab analysis included\n💪 Custom treatment plans\n\n#MensHealth #TRT #Testosterone #Wellness #Vitality",
            hook: "Low T? We can help."
          },
          {
            caption: "🌸 Women's Health & Hormone Balance\n\nFrom BHRT to menopause support — get personalized care that understands your unique needs. Hormone panel review included.\n\n👩‍⚕️ Women-focused care\n🔬 Comprehensive labs\n🌿 Natural & synthetic options\n\n#WomensHealth #Hormones #BHRT #Menopause #Wellness",
            hook: "Hormone imbalance? Let's talk."
          }
        ],
        reels: [
          {
            caption: "⏱️ Your entire visit in 60 seconds:\n1️⃣ Complete online intake (3 min)\n2️⃣ Video consult with provider\n3️⃣ Rx issued instantly\n4️⃣ Medication delivered to your door\n\nThat's it! 🎯\n\n#Telehealth #HealthcareRevolution #MedRevolve #WellnessJourney",
            concept: "Quick process walkthrough with text overlays"
          },
          {
            caption: "🚀 From signup to medication in 3 days:\nDay 1: Complete intake ✅\nDay 2: Meet your provider ✅\nDay 3: Prescription issued ✅\n\nFast, safe, effective. 💪\n\n#FastHealthcare #Telemedicine #GLP1 #WeightLoss",
            concept: "Timeline animation with checkmarks"
          }
        ]
      },
      business: {
        posts: [
          {
            caption: "🚀 Launch Your Own Telehealth Platform in Days!\n\nWhite-label solution includes:\n✅ Branded website\n✅ Provider network access\n✅ Pharmacy fulfillment\n✅ Payment processing\n✅ Compliance built-in\n\nStart your wellness business today! 💼\n\n#TelehealthBusiness #WellnessEntrepreneur #WhiteLabel #DigitalHealth #Startup",
            hook: "Want to own a telehealth company?"
          },
          {
            caption: "💰 Three Revenue Streams. One Platform.\n\n1️⃣ GLP-1 Prescriptions (Rx required)\n2️⃣ RUO Research Compounds\n3️⃣ OTC Supplements & Wellness\n\nChoose your model or run all three! 📈\n\n#BusinessOpportunity #WellnessIndustry #PassiveIncome #Telehealth #Entrepreneur",
            hook: "Multiple products. One dashboard."
          },
          {
            caption: "🛡️ Fully Compliant. Fully Automated.\n\nHIPAA ✓ LegitScript ✓ SOC 2 ✓\n50-state licensing ✓ ePrescribing ✓\n\nFocus on growth. We handle compliance. 🎯\n\n#Compliance #HealthcareBusiness #Automation #SaaS #WellnessTech",
            hook: "Compliance headaches? Solved."
          },
          {
            caption: "📦 End-to-End Fulfillment Network\n\nPCAB-accredited pharmacies\n503A/B compounding available\nNationwide 2-5 day delivery\nCold-chain compliant shipping\n\nYour customers cared for, every step. 🚚\n\n#Fulfillment #Pharmacy #CustomerCare #Ecommerce #Healthcare",
            hook: "From prescription to doorstep."
          }
        ],
        reels: [
          {
            caption: "🎯 Launch your platform in 4 steps:\n1️⃣ Complete onboarding (10 min)\n2️⃣ We build your stack\n3️⃣ Go live in days\n4️⃣ Scale with support\n\nYour business. Your brand. Our infrastructure. 💪\n\n#BusinessLaunch #Entrepreneur #Telehealth #Startup #Wellness",
            concept: "4-step process with icons"
          },
          {
            caption: "💼 What merchants get on Day 1:\n✅ Branded storefront\n✅ Product catalog loaded\n✅ Payment processing active\n✅ Provider/pharmacy access\n✅ Compliance docs ready\n\nEverything you need. Zero headaches. 🎉\n\n#Day1 #BusinessReady #Turnkey #SaaS",
            concept: "Checklist animation"
          }
        ]
      },
      compliance: {
        posts: [
          {
            caption: "🔒 Your Data. Locked Down.\n\nHIPAA-compliant platform\nSOC 2 Type II certified\nEnd-to-end encryption\nDEA-compliant prescribing\n\nYour privacy is non-negotiable. 🔐\n\n#HIPAA #DataSecurity #Privacy #Healthcare #Trust",
            hook: "Is your health data secure?"
          },
          {
            caption: "✅ LegitScript Certified Platform\n\nWe meet the highest standards for:\n• Healthcare compliance\n• Advertising policies\n• Pharmacy verification\n• Consumer protection\n\nTrust matters. 🛡️\n\n#LegitScript #Compliance #TrustHealthcare #Verified",
            hook: "Certified. Verified. Trusted."
          }
        ],
        reels: []
      }
    };

    // Select content based on type
    const selectedContent = contentTemplates[topic] || contentTemplates.telehealth;
    const contentArray = content_type === 'reel' ? selectedContent.reels : selectedContent.posts;
    
    // Pick random content or cycle through
    const randomIndex = Math.floor(Math.random() * contentArray.length);
    const selected = contentArray[randomIndex];

    // Generate image suggestions using AI
    const imagePrompts = {
      telehealth: [
        "Professional doctor video consultation on laptop, modern home office, warm lighting, telehealth concept",
        "Happy patient holding medication package at home, discreet packaging, wellness success",
        "Diverse medical team reviewing patient charts, modern clinic, professional healthcare"
      ],
      business: [
        "Modern entrepreneur working on laptop with analytics dashboard, successful business owner",
        "White-label ecommerce platform interface on multiple devices, professional SaaS",
        "Team celebrating business launch, startup success, modern office"
      ],
      compliance: [
        "Digital security shield with medical cross, data protection, HIPAA compliance visual",
        "Certification badges and compliance documents, professional healthcare standards"
      ]
    };

    const imagePrompt = imagePrompts[topic]?.[Math.floor(Math.random() * imagePrompts[topic].length)] || 
      "Professional healthcare consultation, modern telehealth";

    return Response.json({
      success: true,
      content: {
        type: content_type,
        topic: topic,
        caption: selected.caption,
        hook: selected.hook || selected.concept,
        concept: selected.concept || null,
        image_prompt: imagePrompt,
        hashtags: selected.caption.match(/#[\w]+/g) || [],
        best_time_to_post: "9:00 AM - 11:00 AM EST or 7:00 PM - 9:00 PM EST",
        compliance_notes: [
          "Avoid before/after claims for weight loss",
          "Include 'Results may vary' disclaimer",
          "No medical advice claims - consultation required",
          "RUO products must include 'Research Use Only' label"
        ]
      }
    });

  } catch (error) {
    console.error('Error generating social media content:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});