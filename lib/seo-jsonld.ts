import { capitalize } from './seo-params';

export function getCalculatorJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Crypto Average Cost Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function getConverterJsonLd(from: string, to: string, rateStr: string) {
  const cFrom = capitalize(from);
  const cTo = capitalize(to);

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${cFrom} to ${cTo} Converter`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the current rate of ${cFrom} to ${cTo}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `As of right now, the live conversion rate is ${rateStr}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I convert ${cFrom} to ${cTo}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can use the ApexWeb3 Crypto Converter tool to simulate conversions between ${cFrom} and ${cTo} with real-time exchange rates.`,
        },
      },
    ],
  };

  return [software, faq];
}

export function getFiatJsonLd(
  crypto: string,
  countryName: string,
  currencyCode: string,
  priceStr: string,
  bestOnRamp: string,
  pppString: string
) {
  const cCrypto = capitalize(crypto);

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much is 1 ${cCrypto} in ${currencyCode} today?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Currently, 1 ${cCrypto} is worth approximately ${priceStr} in ${countryName}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the cheapest way to buy ${cCrypto} in ${countryName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Based on local exchange spreads, ${bestOnRamp} is typically the most cost-effective way to purchase ${crypto} in ${countryName}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How does ${cCrypto} compare to the average salary in ${countryName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: pppString,
        },
      },
    ],
  };
}
