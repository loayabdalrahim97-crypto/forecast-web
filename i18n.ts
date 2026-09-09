// Shared i18n + profile/demo data, adapted from the FORECAST artifact.

export const RANK: Record<string, number> = { Low: 1, Moderate: 2, High: 3, 'Very High': 4 };
export const RANK_LABEL: Record<string, Record<string,string>> = {
  en: { Low: 'Low', Moderate: 'Moderate', High: 'High', 'Very High': 'Very High' },
  ar: { Low: 'منخفضة', Moderate: 'متوسطة', High: 'عالية', 'Very High': 'مرتفعة جدًا' },
};


/* ============================== PROFILE STRUCTURE (language-agnostic ids/values) ============================== */
export const PROFILE_STEPS = [
  { step: 1, ids: ['decision_style', 'risk_tolerance', 'uncertainty_tolerance'] },
  { step: 2, ids: ['communication_style', 'conflict_style', 'planning_style'] },
  { step: 3, ids: ['decision_speed', 'pressure_response', 'interpretation_style'] },
];
export const OPTION_VALUES: Record<string, string[]> = {
  decision_style: ['gut', 'deliberate', 'seek_input', 'delay'],
  risk_tolerance: ['avoidant', 'calculated', 'comfortable', 'seeking'],
  uncertainty_tolerance: ['wait', 'assume_likely', 'assume_worst', 'proceed'],
  communication_style: ['direct', 'diplomatic', 'reserved', 'overprepared'],
  conflict_style: ['confront', 'compromise', 'avoid', 'anxious_engage'],
  planning_style: ['detailed', 'flexible', 'minimal', 'improvise'],
  decision_speed: ['instant', 'quick', 'slow', 'stalling'],
  pressure_response: ['thrive', 'steady', 'overwhelmed', 'freeze'],
  interpretation_style: ['neutral', 'wait_and_see', 'personalize', 'catastrophize'],
};
export const DEMO_ANSWERS: Record<string, string> = {
  decision_style: 'deliberate', risk_tolerance: 'avoidant', uncertainty_tolerance: 'assume_worst',
  communication_style: 'overprepared', conflict_style: 'avoid', planning_style: 'detailed',
  decision_speed: 'slow', pressure_response: 'overwhelmed', interpretation_style: 'catastrophize',
};
export const DEMO_SITUATION_EN = "My manager suddenly scheduled a meeting with me tomorrow and didn't explain why.";
export const DEMO_CONTEXT_EN = "I tend to overthink situations when I don't have enough information and immediately worry that something bad is going to happen.";
export const DEMO_SITUATION_AR = "مديري طلب مني اجتماع بكرة الصبح وما حكى لي السبب. أنا خايف يكون ناوي يفصلني.";
export const DEMO_CONTEXT_AR = "أميل إلى التفكير الزائد عندما تنقص المعلومات، وأتوقع فورًا أن يكون هناك شيء سيء.";

export function buildProfileSummary(lang: string, answers: Record<string,string>) {
  const P = TXT[lang].profile;
  return PROFILE_STEPS.flatMap((s) => s.ids)
    .map((id) => {
      const val = answers[id];
      if (!val) return null;
      const p = P[id];
      return `${p.dimension}: ${p.options[val]}.`;
    })
    .filter(Boolean)
    .join(' ');
}

/* ============================== TRANSLATIONS ============================== */
export const TXT: any = {
  en: {
    dir: 'ltr',
    brand: 'FORECAST',
    nav_start: 'Start Free Forecast',
    hero_eyebrow: 'BEHAVIORAL SCENARIO FORECASTING',
    hero_line1: 'Your brain sees one possibility.',
    hero_line2: 'FORECAST shows you the others.',
    hero_sub: "Turn uncertainty into scenarios, signals, and better decisions. FORECAST doesn't predict the future — it helps you prepare for what could happen next.",
    start_cta: 'Start a Free Forecast',
    demo_cta: 'Try a Demo',
    example_eyebrow: 'EXAMPLE — SCENARIO MAP',
    example_caption: 'From a real FORECAST run on a manager-meeting situation.',
    example_scenarios: [
      { t: 'Routine management discussion', r: 'High' },
      { t: 'Project reassignment', r: 'Moderate' },
      { t: 'Performance concern raised', r: 'Low' },
    ],
    how_eyebrow: 'HOW FORECAST WORKS',
    how_title: 'Four steps between not knowing and having a plan.',
    how_steps: [
      { t: 'Understand your patterns', d: 'FORECAST learns how you typically respond to uncertainty and decisions.' },
      { t: 'Analyze the situation', d: 'It separates facts, assumptions, unknowns, and the variables that matter.' },
      { t: 'Explore multiple scenarios', d: 'Instead of locking onto one explanation, it maps plausible outcomes.' },
      { t: 'Prepare your response', d: 'Get a recommended action, warning signs, and a contingency plan.' },
    ],
    why_eyebrow: 'WHY NOT JUST ASK A CHATBOT',
    why_title: "FORECAST structures uncertainty. It doesn't just answer a question.",
    why_points: [
      'Separates facts from assumptions, every time',
      'Maps several plausible scenarios instead of one guess',
      'Reads your behavioral tendencies into the analysis',
      'Tells you what would change the forecast',
      'Updates the forecast as new information arrives',
      'Recommends what to do, not just what might happen',
    ],
    pricing_eyebrow: 'PRICING PREVIEW',
    pricing_title: "Start free. Go deeper when you're ready.",
    tiers: [
      { tier: 'Free', price: '$0', items: ['1 full forecast', 'Scenario map', 'Recommended action'] },
      { tier: 'Pro', price: '$9.99/mo', items: ['Unlimited forecasts', 'Forecast updates', 'Outcome tracking'], highlight: true },
      { tier: 'Premium', price: '$19.99/mo', items: ['Everything in Pro', 'Forecast history', 'Personalization'] },
    ],
    faq_eyebrow: 'FAQ',
    faq_title: 'Common questions',
    faqs: [
      { q: 'Does FORECAST actually predict the future?', a: 'No. FORECAST evaluates plausible scenarios based on available information, behavioral patterns, and uncertainty — it never claims to know what will happen.' },
      { q: 'Can FORECAST know what another person is thinking?', a: "No. FORECAST cannot know another person's thoughts. It evaluates possible explanations based on observable information only." },
      { q: 'Is FORECAST therapy or diagnosis?', a: 'No. FORECAST is a decision-support and scenario-analysis tool, not a medical or psychological diagnosis.' },
      { q: 'How accurate is it?', a: 'Accuracy depends on the quality and completeness of the information you give it. FORECAST represents uncertainty explicitly rather than pretending to know more than it does.' },
    ],
    final_title: 'Ready to see the other possibilities?',
    final_sub: 'Takes about 3 minutes. No account required for this preview.',
    footer: 'FORECAST is a decision-support tool. It does not predict the future or diagnose mental health conditions.',

    step_profile: 'BEHAVIORAL PROFILE', step_situation: 'SITUATION', step_analysis: 'SITUATION ANALYSIS',
    step_analyzing: 'ANALYZING', step_forecasting: 'FORECASTING', step_forecast: 'FORECAST',
    step_of: (c: number, t: number) => `STEP ${c} OF ${t}`,
    back: 'Back', next: 'Next', continue_situation: 'Continue to Situation',

    situation_title: 'What situation are you trying to understand?',
    situation_placeholder: "My manager suddenly scheduled a meeting with me tomorrow and didn't explain why.",
    context_label: 'What else should FORECAST know? (optional)',
    context_placeholder: "Any extra context — how you're feeling about it, recent history, anything relevant.",
    situation_hint: 'Describe the situation to continue.',
    analyze_btn: 'Analyze Situation',

    analysis_title: "Here's what your situation breaks down to.",
    analysis_sub: "FORECAST separates what's known from what's assumed before generating any scenario.",
    g_facts: 'Facts', g_facts_sub: 'What is actually known',
    g_assumptions: 'Assumptions', g_assumptions_sub: 'What you believe or suspect',
    g_unknowns: 'Unknowns', g_unknowns_sub: "What isn't known yet",
    g_variables: 'Key variables', g_variables_sub: 'What could change the outcome',
    none_identified: 'None identified',
    questions_label: 'A FEW QUESTIONS THAT WOULD SHARPEN THIS FORECAST',
    type_answer: 'Type your answer',
    generate_forecast: 'Generate Forecast',
    default_choice_options: ['Yes', 'No', 'Not sure'],

    demo_banner: 'This is a demo forecast, generated from a sample situation so you can see the full product.',
    demo_run_own: 'Run your own',

    forecast_summary: 'FORECAST SUMMARY',
    most_likely: 'Most likely', alternative: 'Alternative', highest_impact: 'Highest impact', data_quality: 'Data quality',
    scenario_map: 'SCENARIO MAP', scenario_detail: 'SCENARIO DETAIL',
    likelihood: 'Likelihood', confidence: 'Confidence', impact: 'Impact',
    d_rationale: 'Rationale', d_evidence: 'Evidence', d_triggers: 'Triggers', d_warning: 'Early warning signs',
    d_likely_response: 'Likely response from you', d_recommended_response: 'Recommended response', d_contingency: 'Contingency plan',
    behavioral_context: 'YOUR BEHAVIORAL CONTEXT',
    decision_support: 'WHAT SHOULD YOU DO NOW?',
    recommended_action: 'RECOMMENDED ACTION', what_not_to_do: 'WHAT NOT TO DO',
    if_happens: (title: string) => `If "${title}" happens`,
    suggested_wording: 'SUGGESTED WORDING',
    what_could_change: 'WHAT COULD CHANGE THIS FORECAST',

    update_forecast: 'UPDATE FORECAST', forecast_updated: 'FORECAST UPDATED',
    new_recommended: 'New recommended action:', add_more_info: 'Add more information',
    update_placeholder: 'e.g. My manager told me the meeting is about a new project.',
    updating: 'Updating forecast…',
    update_error: "FORECAST couldn't update your analysis right now. Please try again.",
    retry: 'Retry Analysis',

    outcome_title: 'WHAT ACTUALLY HAPPENED?',
    outcome_options: ['This scenario happened', 'Something similar happened', 'Something completely different happened', 'Nothing happened yet'],
    outcome_placeholder: 'What happened? (optional)',
    record_outcome: 'Record Outcome', recorded: 'Recorded:',
    outcome_note: 'Saved for this session — this is what future personalization will learn from.',

    go_deeper: 'YOUR FORECAST IS READY — GO DEEPER',
    locked: [
      { title: 'Deeper Behavioral Analysis', desc: 'A full breakdown of every dimension in your profile, not just the ones relevant to this forecast.' },
      { title: 'Advanced Scenario Comparison', desc: 'Compare scenarios side by side across every variable at once.' },
      { title: 'Forecast History', desc: 'Every forecast you run, saved and searchable over time.' },
      { title: 'Personalization', desc: 'FORECAST calibrates to your actual outcomes the more you use it.' },
    ],
    unlock: 'Unlock Full Forecast',
    unlock_alert: 'This is a pricing preview — payment is not implemented in this MVP.',
    start_new: 'Start a New Forecast', back_home: 'Back to Home',

    analyze_error: "FORECAST couldn't complete the analysis right now. Please try again.",
    forecast_error: "FORECAST couldn't generate scenarios right now. Please try again.",
    analyze_stages: ['Analyzing situation…', 'Separating facts from assumptions…', 'Identifying key variables…'],
    forecast_stages: ['Evaluating behavioral patterns…', 'Generating scenarios…', 'Building your decision map…'],

    profile: {
      decision_style: { dimension: 'Decision style', q: 'When you need to make a decision, you usually...', options: {
        gut: 'Trust your gut and move quickly', deliberate: 'Weigh the options carefully first',
        seek_input: 'Check in with someone else first', delay: 'Put it off until you have to decide' } },
      risk_tolerance: { dimension: 'Risk tolerance', q: 'How do you generally feel about taking risks?', options: {
        avoidant: 'I avoid risk when I can', calculated: 'I take calculated risks',
        comfortable: "I'm comfortable with risk", seeking: 'I actively seek it out' } },
      uncertainty_tolerance: { dimension: 'Uncertainty tolerance', q: 'When information is incomplete, what do you usually do?', options: {
        wait: 'Wait until I know more', assume_likely: 'Assume the most likely explanation',
        assume_worst: 'Imagine the worst case', proceed: 'Move forward without dwelling on it' } },
      communication_style: { dimension: 'Communication style', q: 'In a difficult conversation, you tend to be...', options: {
        direct: 'Direct and to the point', diplomatic: 'Diplomatic, softening the message',
        reserved: "Quiet until it's necessary to speak", overprepared: 'Over-prepared, rehearsing what to say' } },
      conflict_style: { dimension: 'Conflict style', q: 'When conflict comes up, you typically...', options: {
        confront: 'Address it head-on', compromise: 'Look for a middle ground',
        avoid: 'Avoid it if I can', anxious_engage: 'Feel anxious but engage anyway' } },
      planning_style: { dimension: 'Planning style', q: 'Your natural approach to planning is...', options: {
        detailed: 'Detailed plans for most things', flexible: 'A loose plan, adjusted as I go',
        minimal: 'Plan only when I have to', improvise: 'Improvise as it happens' } },
      decision_speed: { dimension: 'Decision speed', q: 'How quickly do you usually land on a decision?', options: {
        instant: 'Almost instantly', quick: 'Quickly, after a brief think',
        slow: 'I need real time to deliberate', stalling: 'I put it off as long as possible' } },
      pressure_response: { dimension: 'Pressure response', q: 'Under pressure, you tend to...', options: {
        thrive: 'Perform better than usual', steady: 'Stay roughly steady',
        overwhelmed: 'Feel overwhelmed', freeze: 'Freeze up temporarily' } },
      interpretation_style: { dimension: 'Social interpretation style', q: "If someone's tone seems a little off, your first assumption is...", options: {
        neutral: "Nothing — I don't read into it", wait_and_see: "I'll wait and see",
        personalize: 'They might be upset with me', catastrophize: "Something is wrong, and it's probably my fault" } },
    },
  },

  ar: {
    dir: 'rtl',
    brand: 'FORECAST',
    nav_start: 'ابدأ توقعًا مجانيًا',
    hero_eyebrow: 'التنبؤ السلوكي بالسيناريوهات',
    hero_line1: 'عقلك يرى احتمالًا واحدًا.',
    hero_line2: 'و«توقع» يُريك البقية.',
    hero_sub: 'حوّل الغموض إلى سيناريوهات وإشارات وقرارات أفضل. توقع لا يتنبأ بالمستقبل — بل يساعدك على الاستعداد لما قد يحدث.',
    start_cta: 'ابدأ توقعًا مجانيًا',
    demo_cta: 'جرّب عرضًا توضيحيًا',
    example_eyebrow: 'مثال — خريطة السيناريوهات',
    example_caption: 'من تحليل حقيقي لتوقع حول اجتماع مع مدير.',
    example_scenarios: [
      { t: 'نقاش إداري روتيني', r: 'High' },
      { t: 'إعادة تكليف بمشروع', r: 'Moderate' },
      { t: 'إثارة مخاوف متعلقة بالأداء', r: 'Low' },
    ],
    how_eyebrow: 'كيف يعمل توقع',
    how_title: 'أربع خطوات بين الحيرة وامتلاك خطة.',
    how_steps: [
      { t: 'افهم أنماطك', d: 'يتعرّف توقع على طريقتك المعتادة في التعامل مع الغموض والقرارات.' },
      { t: 'حلّل الموقف', d: 'يفصل الحقائق عن الافتراضات والمجهولات والمتغيرات المهمة.' },
      { t: 'استكشف سيناريوهات متعددة', d: 'بدلاً من التمسك بتفسير واحد، يرسم خريطة للاحتمالات الممكنة.' },
      { t: 'جهّز استجابتك', d: 'احصل على إجراء موصى به، وعلامات إنذار، وخطة بديلة.' },
    ],
    why_eyebrow: 'لماذا لا نكتفي بسؤال روبوت محادثة؟',
    why_title: 'توقع يُنظّم حالة عدم اليقين، ولا يكتفي بالإجابة عن سؤال.',
    why_points: [
      'يفصل الحقائق عن الافتراضات في كل مرة',
      'يرسم عدة سيناريوهات محتملة بدلاً من تخمين واحد',
      'يُدخل ميولك السلوكية في صميم التحليل',
      'يوضح لك ما الذي قد يغيّر التوقع',
      'يحدّث التوقع كلما وصلت معلومات جديدة',
      'يوصي بما يجب فعله، لا فقط بما قد يحدث',
    ],
    pricing_eyebrow: 'معاينة الأسعار',
    pricing_title: 'ابدأ مجانًا، وتعمّق أكثر حين تكون جاهزًا.',
    tiers: [
      { tier: 'مجاني', price: '0$', items: ['توقع كامل واحد', 'خريطة السيناريوهات', 'الإجراء الموصى به'] },
      { tier: 'احترافي', price: '9.99$ / شهريًا', items: ['توقعات غير محدودة', 'تحديث التوقع', 'تتبع النتائج'], highlight: true },
      { tier: 'مميز', price: '19.99$ / شهريًا', items: ['كل ما في الاحترافي', 'سجل التوقعات', 'التخصيص'] },
    ],
    faq_eyebrow: 'الأسئلة الشائعة',
    faq_title: 'أسئلة متكررة',
    faqs: [
      { q: 'هل يتنبأ توقع فعلاً بالمستقبل؟', a: 'لا. يقيّم توقع السيناريوهات المحتملة بناءً على المعلومات المتاحة والأنماط السلوكية وحالة عدم اليقين — ولا يدّعي أبدًا معرفة ما سيحدث.' },
      { q: 'هل يمكن لتوقع معرفة ما يفكر فيه شخص آخر؟', a: 'لا. لا يستطيع توقع معرفة أفكار شخص آخر. هو يقيّم التفسيرات المحتملة بناءً على المعلومات القابلة للملاحظة فقط.' },
      { q: 'هل توقع علاج نفسي أو تشخيص؟', a: 'لا. توقع أداة لدعم القرار وتحليل السيناريوهات، وليس تشخيصًا طبيًا أو نفسيًا.' },
      { q: 'ما مدى دقته؟', a: 'تعتمد الدقة على جودة واكتمال المعلومات التي تزوّده بها. يعبّر توقع عن حالة عدم اليقين بوضوح، بدلاً من التظاهر بمعرفة أكثر مما يعرف.' },
    ],
    final_title: 'جاهز لرؤية الاحتمالات الأخرى؟',
    final_sub: 'يستغرق نحو ٣ دقائق. لا حاجة لإنشاء حساب في هذه المعاينة.',
    footer: 'توقع أداة لدعم اتخاذ القرار. لا يتنبأ بالمستقبل ولا يشخّص حالات نفسية.',

    step_profile: 'الملف السلوكي', step_situation: 'الموقف', step_analysis: 'تحليل الموقف',
    step_analyzing: 'جارٍ التحليل', step_forecasting: 'جارٍ إعداد التوقع', step_forecast: 'التوقع',
    step_of: (c: number, t: number) => `الخطوة ${c} من ${t}`,
    back: 'رجوع', next: 'التالي', continue_situation: 'المتابعة إلى الموقف',

    situation_title: 'ما الموقف الذي تحاول فهمه؟',
    situation_placeholder: 'طلب مني مديري اجتماعًا غدًا فجأة، ولم يوضح السبب.',
    context_label: 'ما الذي تريد أن يعرفه توقع أيضًا؟ (اختياري)',
    context_placeholder: 'أي سياق إضافي — شعورك تجاه الأمر، خلفية سابقة، أو أي تفصيل مهم.',
    situation_hint: 'صف الموقف للمتابعة.',
    analyze_btn: 'تحليل الموقف',

    analysis_title: 'إليك كيف ينقسم موقفك.',
    analysis_sub: 'يفصل توقع بين المعروف والمفترض قبل توليد أي سيناريو.',
    g_facts: 'الحقائق', g_facts_sub: 'ما هو معروف فعلاً',
    g_assumptions: 'الافتراضات', g_assumptions_sub: 'ما تعتقده أو تشك فيه',
    g_unknowns: 'المجهولات', g_unknowns_sub: 'ما لم يُعرف بعد',
    g_variables: 'المتغيرات الرئيسية', g_variables_sub: 'ما قد يغيّر النتيجة',
    none_identified: 'لم يتم تحديد شيء',
    questions_label: 'بضعة أسئلة قد تُحسّن دقة هذا التوقع',
    type_answer: 'اكتب إجابتك',
    generate_forecast: 'إنشاء التوقع',
    default_choice_options: ['نعم', 'لا', 'غير متأكد'],

    demo_banner: 'هذا توقع تجريبي، تم إنشاؤه من موقف نموذجي لتتمكن من رؤية المنتج كاملاً.',
    demo_run_own: 'جرّب موقفك الخاص',

    forecast_summary: 'ملخص التوقع',
    most_likely: 'الأكثر احتمالًا', alternative: 'سيناريو بديل', highest_impact: 'الأعلى تأثيرًا', data_quality: 'جودة البيانات',
    scenario_map: 'خريطة السيناريوهات', scenario_detail: 'تفاصيل السيناريو',
    likelihood: 'احتمالية الحدوث', confidence: 'مستوى الثقة', impact: 'التأثير',
    d_rationale: 'المبرر', d_evidence: 'الأدلة', d_triggers: 'المحفزات', d_warning: 'علامات الإنذار المبكر',
    d_likely_response: 'استجابتك المتوقعة', d_recommended_response: 'الاستجابة الموصى بها', d_contingency: 'الخطة البديلة',
    behavioral_context: 'السياق السلوكي الخاص بك',
    decision_support: 'ماذا يجب أن تفعل الآن؟',
    recommended_action: 'الإجراء الموصى به', what_not_to_do: 'ما يجب تجنبه',
    if_happens: (title: string) => `إذا حدث "${title}"`,
    suggested_wording: 'صياغة مقترحة',
    what_could_change: 'ما الذي يمكن أن يغيّر هذا التوقع؟',

    update_forecast: 'تحديث التوقع', forecast_updated: 'تم تحديث التوقع',
    new_recommended: 'الإجراء الموصى به الجديد:', add_more_info: 'أضف معلومات إضافية',
    update_placeholder: 'مثال: أخبرني مديري أن الاجتماع بخصوص مشروع جديد.',
    updating: 'جارٍ تحديث التوقع…',
    update_error: 'تعذّر على توقع تحديث التحليل الآن. يُرجى المحاولة مرة أخرى.',
    retry: 'إعادة المحاولة',

    outcome_title: 'ماذا حدث فعليًا؟',
    outcome_options: ['حدث هذا السيناريو', 'حدث شيء مشابه', 'حدث شيء مختلف تمامًا', 'لم يحدث شيء بعد'],
    outcome_placeholder: 'ما الذي حدث؟ (اختياري)',
    record_outcome: 'تسجيل النتيجة', recorded: 'تم التسجيل:',
    outcome_note: 'تم الحفظ لهذه الجلسة — وهذا ما سيتعلم منه التخصيص المستقبلي لاحقًا.',

    go_deeper: 'توقعك جاهز — تعمّق أكثر',
    locked: [
      { title: 'تحليل سلوكي أعمق', desc: 'تفصيل كامل لكل بُعد في ملفك السلوكي، وليس فقط ما يخص هذا التوقع.' },
      { title: 'مقارنة سيناريوهات متقدمة', desc: 'قارن بين السيناريوهات جنبًا إلى جنب عبر كل المتغيرات دفعة واحدة.' },
      { title: 'سجل التوقعات', desc: 'كل توقع تُجريه، محفوظ وقابل للبحث عبر الزمن.' },
      { title: 'التخصيص', desc: 'يتكيّف توقع مع نتائجك الفعلية كلما استخدمته أكثر.' },
    ],
    unlock: 'افتح التوقع الكامل',
    unlock_alert: 'هذه معاينة للأسعار — الدفع غير مُفعّل في هذه النسخة التجريبية.',
    start_new: 'ابدأ توقعًا جديدًا', back_home: 'العودة للرئيسية',

    analyze_error: 'تعذّر على توقع إتمام التحليل الآن. يُرجى المحاولة مرة أخرى.',
    forecast_error: 'تعذّر على توقع إنشاء السيناريوهات الآن. يُرجى المحاولة مرة أخرى.',
    analyze_stages: ['جارٍ تحليل الموقف…', 'جارٍ فصل الحقائق عن الافتراضات…', 'جارٍ تحديد المتغيرات الرئيسية…'],
    forecast_stages: ['جارٍ تقييم الأنماط السلوكية…', 'جارٍ توليد السيناريوهات…', 'جارٍ بناء خريطة القرار…'],

    profile: {
      decision_style: { dimension: 'أسلوب اتخاذ القرار', q: 'عندما تحتاج إلى اتخاذ قرار، عادةً...', options: {
        gut: 'تثق بحدسك وتتحرك بسرعة', deliberate: 'تزن الخيارات بعناية أولاً',
        seek_input: 'تستشير شخصًا آخر أولاً', delay: 'تؤجل القرار حتى تضطر لاتخاذه' } },
      risk_tolerance: { dimension: 'درجة تحمّل المخاطرة', q: 'كيف تشعر عمومًا تجاه خوض المخاطر؟', options: {
        avoidant: 'أتجنب المخاطرة قدر الإمكان', calculated: 'أخوض مخاطرة محسوبة',
        comfortable: 'أشعر بارتياح تجاه المخاطرة', seeking: 'أسعى إليها بنشاط' } },
      uncertainty_tolerance: { dimension: 'التعامل مع الغموض', q: 'عندما تكون المعلومات ناقصة، ما الذي تفعله عادةً؟', options: {
        wait: 'أنتظر حتى أعرف المزيد', assume_likely: 'أفترض التفسير الأكثر ترجيحًا',
        assume_worst: 'أتخيّل أسوأ احتمال', proceed: 'أمضي قدمًا دون قلق كبير' } },
      communication_style: { dimension: 'أسلوب التواصل', q: 'في محادثة صعبة، تميل إلى أن تكون...', options: {
        direct: 'مباشرًا وواضحًا', diplomatic: 'دبلوماسيًا، تخفف من حدة الرسالة',
        reserved: 'هادئًا إلى أن يصبح الكلام ضروريًا', overprepared: 'مفرط التحضير، تتمرّن على ما ستقوله' } },
      conflict_style: { dimension: 'أسلوب التعامل مع الخلاف', q: 'عندما ينشأ خلاف، عادةً...', options: {
        confront: 'تواجهه مباشرة', compromise: 'تبحث عن حل وسط',
        avoid: 'تتجنبه إن استطعت', anxious_engage: 'تشعر بالقلق لكنك تخوض فيه رغم ذلك' } },
      planning_style: { dimension: 'أسلوب التخطيط', q: 'أسلوبك الطبيعي في التخطيط هو...', options: {
        detailed: 'خطط تفصيلية لمعظم الأمور', flexible: 'خطة مرنة تُعدَّل أثناء التنفيذ',
        minimal: 'التخطيط فقط عند الضرورة', improvise: 'الارتجال أثناء الموقف' } },
      decision_speed: { dimension: 'سرعة اتخاذ القرار', q: 'ما مدى سرعتك عادةً في الوصول إلى قرار؟', options: {
        instant: 'شبه فوري', quick: 'بسرعة، بعد تفكير موجز',
        slow: 'أحتاج وقتًا فعليًا للتروي', stalling: 'أؤجله قدر الإمكان' } },
      pressure_response: { dimension: 'الاستجابة تحت الضغط', q: 'تحت الضغط، تميل إلى...', options: {
        thrive: 'الأداء بشكل أفضل من المعتاد', steady: 'البقاء على حالك تقريبًا',
        overwhelmed: 'الشعور بالإرهاق', freeze: 'التجمّد مؤقتًا' } },
      interpretation_style: { dimension: 'أسلوب تفسير المواقف الاجتماعية', q: 'إذا بدت نبرة شخص ما غريبة قليلًا، فافتراضك الأول هو...', options: {
        neutral: 'لا شيء — لا أحلل الأمر كثيرًا', wait_and_see: 'سأنتظر وأرى',
        personalize: 'ربما يكون غاضبًا مني', catastrophize: 'هناك خطأ ما، وعلى الأرجح أنه بسببي' } },
    },
  },
};

