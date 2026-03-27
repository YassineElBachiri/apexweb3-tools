import React from 'react';
import JsonLd from '../JsonLd';

interface FAQ {
  question: string;
  answer: string;
}

interface ToolFAQProps {
  toolName: string;
  faqs: FAQ[];
  description: React.ReactNode;
}

export function ToolFAQ({ toolName, faqs, description }: ToolFAQProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="mt-16 pt-12 border-t border-zinc-800">
      <JsonLd schema={jsonLd} />
      
      <div className="max-w-3xl mx-auto space-y-12">
        {/* SEO Description Block */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">About the {toolName}</h2>
          <div className="text-zinc-400 space-y-4 leading-relaxed">
            {description}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{faq.question}</h3>
                <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
