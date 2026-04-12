/* FAQ Data + Renderer — Branched 3-level accordion */
(function() {
const faqData = [
  { cat: "AI Visibility", subs: [
    { sub: "What is AI visibility?", qs: [
      { q: "What is AI visibility for a business?", a: "AI visibility refers to how accurately and completely AI systems like ChatGPT, Google Gemini, and Perplexity can read, understand, and represent a business when answering user queries. A business with high AI visibility will be accurately described and recommended by AI. A business with low AI visibility will either be misrepresented or not appear in AI answers at all." },
      { q: "How is AI visibility different from SEO?", a: "Traditional SEO optimises a website to rank in Google's list of search results. AI visibility optimises a website so that AI systems can accurately understand and recommend a business directly in their answers. As AI search replaces traditional search results, a website can rank well in traditional SEO but remain completely invisible to AI systems." },
      { q: "What is an AI visibility score?", a: "An AI visibility score measures how accurately and completely AI systems represent a business on a scale of 1 to 9. Level 1 means AI knows the business name but hallucinates services and pricing. Level 9 means AI accurately knows exact services, pricing, differentiators, and recommends the business by name to relevant searchers. Upserv moves businesses from Level 1-2 to Level 7-9." },
    ]},
    { sub: "Why it matters now", qs: [
      { q: "How does ChatGPT decide who to recommend?", a: "ChatGPT recommends businesses based on the quality, clarity, and structure of information available about them across the internet. Websites with clear service descriptions, structured data, schema markup, accurate pricing, and consistent business details across platforms are more likely to be recommended. Websites that lack this structure are typically ignored or misrepresented." },
      { q: "What is Google AI Overviews?", a: "Google AI Overviews appears at the top of Google search results and directly answers user questions without showing a list of websites. Businesses whose websites contain clear structured content are cited in AI Overviews. Businesses with unstructured or image-heavy websites are not included — meaning they lose traffic even if they previously ranked well in traditional Google search." },
      { q: "What is the hallucination problem?", a: "AI hallucination occurs when an AI system invents or misrepresents information about a business because it cannot find accurate structured data on that business's website. Common examples include AI listing wrong services, incorrect pricing, outdated hours, or procedures the business does not offer. This actively damages a business's reputation and sends potential customers to competitors. Upserv solves this by providing AI systems with verified, structured business data." },
    ]},
    { sub: "How AI reads websites", qs: [
      { q: "What is schema markup?", a: "Schema markup is structured data code added to a website that tells AI systems exactly what a business does, what services it offers, where it is located, and what its hours and prices are. Without schema markup, AI systems must guess at this information from unstructured text, leading to inaccuracies. Upserv implements Organisation, Service, LocalBusiness, and FAQ schema on every website we build." },
      { q: "Why can't AI read my current website?", a: "Most websites are built primarily for human visitors using visual layouts, images, and graphic elements that AI systems cannot parse. AI reads text — specifically structured, factual, declarative text that clearly states what a business does, who it serves, and what it offers. Image-heavy, visually designed websites built on DIY platforms typically contain very little of the structured text AI needs to understand a business." },
      { q: "What is a training document?", a: "A training document is a comprehensive structured text document that describes a business completely — including its name, location, services, pricing, hours, staff qualifications, and frequently asked questions. Upserv creates a verified training document for every client and uses it as the source of truth for pushing accurate business information across 19 AI platforms simultaneously." },
    ]},
    { sub: "Measuring visibility", qs: [
      { q: "How do I know my current AI visibility?", a: "You can test your AI visibility yourself by asking ChatGPT, Google Gemini, or Perplexity to recommend a business like yours in your area and seeing whether your business appears and whether it is described accurately. Upserv also offers a free comprehensive AI visibility audit that queries 19 platforms and documents exactly how your business is currently represented." },
      { q: "How long before AI recommends me?", a: "After Upserv completes a website build and pushes business data to AI platforms, most clients begin seeing improvements in AI visibility within 30 to 60 days. Speed varies depending on how frequently AI platforms update their knowledge bases. Some platforms update within days while others may take several weeks to reflect new information." },
      { q: "What is a free AI visibility audit?", a: "An AI visibility audit is an assessment of how a business currently appears across major AI platforms. Upserv queries ChatGPT, Google Gemini, Perplexity, and other AI systems with questions about your business and documents the accuracy of responses. The audit identifies gaps, inaccuracies, and hallucinations and is completely free with no obligation to proceed." },
    ]},
  ]},
  { cat: "Our Service", subs: [
    { sub: "What we build", qs: [
      { q: "What does Upserv do exactly?", a: "Upserv is a web design agency that builds AI-optimised websites for small and medium sized businesses. We design and build websites structured for AI discovery, implement schema markup and structured data, create verified training documents, optimise local business profiles, and push accurate business information across 19 major AI platforms." },
      { q: "How is an Upserv website different?", a: "A regular website is designed primarily for human visitors using visual layouts and images that AI cannot read. An Upserv website is designed for both humans and AI simultaneously. Every section contains structured factual content AI can parse, all business information is marked up with schema data, and content is written using the specific language patterns AI systems use to categorise and recommend businesses." },
      { q: "What technology does Upserv use?", a: "Upserv builds websites using modern web technologies including clean semantic HTML, CSS, and JavaScript. We avoid heavy visual builders and page constructors that generate bloated code AI systems struggle to parse. Every Upserv website is built with performance and AI readability as primary technical requirements." },
    ]},
    { sub: "What is included", qs: [
      { q: "What is included in a website build?", a: "Every Upserv website includes complete website design and build, AI-readable content written for both human visitors and AI systems, schema markup implementation, a verified training document, local business profile optimisation, and an initial push of business data across 19 AI platforms. Monthly plans include ongoing updates, FAQ expansion, and monthly AI visibility reports." },
      { q: "What are the 19 AI platforms?", a: "Upserv pushes verified business information to ChatGPT, Google Gemini, Perplexity, Microsoft Copilot, Meta AI, Claude, Grok, You.com, Brave Leo, Poe, HuggingChat, Mistral, Pi, Cohere, DeepSeek, Llama, Komo, Phind, and Bing AI. These represent the 19 major AI platforms currently used by consumers to search for and discover local businesses." },
      { q: "Does Upserv write the website content?", a: "Yes. Upserv writes all website content as part of every engagement. Our content is written specifically to be engaging for human visitors and structured for AI readability. We do not use placeholder text. Every word on an Upserv website is final production-ready copy that accurately represents the business and is optimised for AI discovery." },
    ]},
    { sub: "The process", qs: [
      { q: "How long does a build take?", a: "A standard Upserv website build takes between two and four weeks from initial brief to launch. This includes discovery, content writing, design, development, schema implementation, training document creation, and AI platform push. Complex builds with additional functionality may take longer." },
      { q: "What happens after launch?", a: "After launch Upserv continues working through monthly service plans that include regular website content updates, FAQ expansion for AI readability, local profile management, technical maintenance, and monthly AI visibility reports. Ongoing work ensures the website continues to be accurately represented as AI platforms update their knowledge bases." },
      { q: "What is the monthly visibility report?", a: "Every month Upserv queries major AI platforms with relevant questions about the client's business and documents the responses. The report shows exactly how the business is represented, identifies any inaccuracies, and tracks improvements over time. This gives business owners clear transparent evidence of progress." },
    ]},
    { sub: "Technical questions", qs: [
      { q: "Do you handle website hosting?", a: "Upserv can recommend and set up hosting for clients or work with existing hosting arrangements. We ensure hosting configurations support fast load times and efficient AI crawler access — both of which contribute to AI visibility." },
      { q: "Can you fix my existing website?", a: "Upserv can work with existing websites in some cases, adding structured content, schema markup, and AI optimisation layers to the current site. However websites built on DIY platforms often have technical limitations that prevent proper AI optimisation. The free audit will determine whether your existing website can be optimised or whether a rebuild is recommended." },
      { q: "Do you build mobile-responsive websites?", a: "Yes. Every Upserv website is built desktop-first and fully optimised for mobile devices. We ensure consistent performance, readability, and AI visibility across all screen sizes and devices." },
    ]},
  ]},
  { cat: "Industries", subs: [
    { sub: "Healthcare & Wellness", qs: [
      { q: "Do you work with dental practices?", a: "Yes. Dental practices are one of Upserv's primary focus areas. Patients increasingly use ChatGPT and Google AI to find dentists and ask about procedures and pricing. Upserv builds AI-optimised websites for dental practices that ensure AI systems accurately represent services, accepted insurance, pricing, and location when patients search for dental care." },
      { q: "Do you work with medical clinics?", a: "Yes. Medical clinics, GP practices, specialist consultants, physiotherapists, chiropractors, and other healthcare providers benefit significantly from AI visibility optimisation. Patients research medical providers extensively on AI before booking. Upserv ensures medical websites contain the structured content AI systems need to accurately recommend them." },
      { q: "Do you work with allied health?", a: "Yes. Allied health professionals including physiotherapists, occupational therapists, speech therapists, nutritionists, psychologists, and dietitians are served by Upserv. Patients searching for specialist allied health services on AI need to find providers who match their specific needs. Upserv ensures allied health websites clearly communicate specialties, conditions treated, and patient types served." },
    ]},
    { sub: "Professional Services", qs: [
      { q: "Do you work with law firms?", a: "Yes. Legal professionals including law firms, solicitors, and migration agents benefit from Upserv's services. People searching for legal representation use AI to identify specialists in specific areas of law. Upserv ensures law firm websites clearly communicate practice areas, jurisdictions, and client types so AI systems make accurate referrals." },
      { q: "Do you work with accountants?", a: "Yes. Accountants, bookkeepers, tax agents, and financial advisors are served by Upserv. Clients searching for financial professionals on AI need to find providers who specialise in their specific situation. Upserv ensures accounting websites clearly communicate specialisations, client types, and services offered so AI makes accurate referrals." },
      { q: "Do you work with consultants?", a: "Yes. Business consultants, management consultants, HR consultants, and other professional service providers benefit from AI visibility optimisation. Most consultant websites use vague language that AI cannot parse into specific service recommendations. Upserv restructures consultant websites with clear service definitions and outcome statements AI systems can understand and cite." },
    ]},
    { sub: "Food & Trades", qs: [
      { q: "Do you work with restaurants?", a: "Yes. Restaurants, cafes, bakeries, catering companies, and hotels are served by Upserv. People ask AI where to eat more frequently than almost any other local business query. Upserv structures restaurant websites with clear cuisine descriptions, menu information, dietary options, location data, and booking information so AI accurately recommends them to relevant searchers." },
      { q: "Do you work with tradespeople?", a: "Yes. Plumbers, electricians, builders, landscapers, cleaners, and contractors benefit from Upserv's services. Homeowners search AI urgently when they need trades. Upserv ensures trade business websites clearly state services offered, service areas covered, availability, and pricing so AI systems accurately match them with people searching for their services." },
      { q: "Do you work with retailers?", a: "Yes. Independent retailers, boutiques, specialty stores, and local shops benefit from AI visibility optimisation. As consumers increasingly ask AI where to find specific products locally, retailers with AI-optimised websites are more likely to be recommended. Upserv structures retail websites with clear product categories, brands stocked, location, and hours." },
    ]},
    { sub: "Other Businesses", qs: [
      { q: "Do you work with real estate agencies?", a: "Yes. Real estate agencies, property managers, and individual agents use Upserv to ensure AI systems accurately represent their specialties, service areas, and the types of properties they handle. Buyers and sellers increasingly research agents on AI before making contact, making AI visibility essential for real estate professionals." },
      { q: "Do you work outside Australia?", a: "Yes. Upserv works with businesses globally. AI visibility is relevant to any business in any country where consumers use AI systems to search for local services. Upserv has worked with businesses across Australia, the United States, the Philippines, Saudi Arabia, and other markets." },
      { q: "Do you work with brand new businesses?", a: "Yes. Upserv works with businesses at every stage including those with no existing website. Starting from scratch means there are no existing technical limitations to work around, making it easier to build a fully AI-optimised website from the ground up." },
    ]},
  ]},
  { cat: "Pricing & Getting Started", subs: [
    { sub: "Our Pricing", qs: [
      { q: "How much does Upserv cost?", a: "Upserv offers three service tiers. Launch costs $1,000 one-time plus $150 per month and includes a five-section AI-ready website, training document, LLM push across 19 platforms, and monthly refresh. Grow costs $5,000 and includes full website rebuild, chatbot deployment, and deep LLM knowledge injection. Dominate costs $10,000 and includes complete AI knowledge infrastructure, hallucination correction, and custom LLM training." },
      { q: "What is included in $150 per month?", a: "The monthly service includes regular website content updates to maintain AI readability, FAQ expansion to capture new AI search queries, monthly AI visibility reports, local profile monitoring, and technical maintenance. This ongoing work ensures the website continues to be accurately represented by AI systems as they update their knowledge bases." },
      { q: "Can I upgrade my plan later?", a: "Yes. Clients can upgrade from Launch to Grow or Dominate at any time. Upserv will apply a credit for work already completed and build on the existing foundation rather than starting from scratch. Upgrading is straightforward because all Upserv websites share the same underlying architecture." },
    ]},
    { sub: "Getting Started", qs: [
      { q: "How do I get started with Upserv?", a: "Getting started begins with a free AI visibility audit. Contact Upserv through the website, provide your business name and website address, and our team will run a comprehensive audit across 19 AI platforms and share the results with you within two to three business days. From there we recommend the most appropriate service tier." },
      { q: "Is there a free audit available?", a: "Yes. Upserv offers a free AI visibility audit for any business. The audit queries major AI platforms with questions about your business, documents how you are currently represented, identifies inaccuracies and gaps, and provides a clear picture of your current AI visibility level. There is no obligation to proceed after the audit." },
      { q: "How long does the audit take?", a: "The free AI visibility audit typically takes two to three business days. Upserv queries multiple AI platforms, documents responses, identifies inaccuracies, and prepares a clear report showing exactly how your business is currently represented by AI systems across 19 platforms." },
    ]},
  ]},
];

// Render
const container = document.getElementById('faqAccordion');
if (container) {
  let html = '';
  faqData.forEach((cat, ci) => {
    html += `<div class="faq-category" data-cat="${ci}">
      <button class="cat-header"><span>${cat.cat}</span><span class="cat-icon"></span></button>
      <div class="cat-body">`;
    cat.subs.forEach((sub, si) => {
      html += `<div class="faq-sub" data-sub="${ci}-${si}">
        <button class="sub-header"><span>${sub.sub}</span><span class="sub-chevron">›</span></button>
        <div class="sub-body">`;
      sub.qs.forEach((item, qi) => {
        html += `<div class="faq-question" data-q="${ci}-${si}-${qi}">
          <button class="q-header"><span>${item.q}</span><span class="q-chevron">›</span></button>
          <div class="q-answer"><div class="q-answer-inner">${item.a}</div></div>
        </div>`;
      });
      html += `</div></div>`;
    });
    html += `</div></div>`;
  });
  container.innerHTML = html;

  // Accordion logic
  document.querySelectorAll('.cat-header').forEach(h => {
    h.addEventListener('click', () => {
      const cat = h.closest('.faq-category');
      const isOpen = cat.classList.contains('open');
      document.querySelectorAll('.faq-category').forEach(c => c.classList.remove('open'));
      if (!isOpen) cat.classList.add('open');
    });
  });
  document.querySelectorAll('.sub-header').forEach(h => {
    h.addEventListener('click', (e) => {
      e.stopPropagation();
      const sub = h.closest('.faq-sub');
      const isOpen = sub.classList.contains('open');
      sub.closest('.faq-category').querySelectorAll('.faq-sub').forEach(s => s.classList.remove('open'));
      if (!isOpen) sub.classList.add('open');
    });
  });
  document.querySelectorAll('.q-header').forEach(h => {
    h.addEventListener('click', (e) => {
      e.stopPropagation();
      const q = h.closest('.faq-question');
      const isOpen = q.classList.contains('open');
      q.closest('.faq-sub').querySelectorAll('.faq-question').forEach(qu => qu.classList.remove('open'));
      if (!isOpen) q.classList.add('open');
    });
  });
}
})();
