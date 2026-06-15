import { useEffect } from 'react';

const SITE_NAME = 'Shree Suryodaya Khadya Udhyog Limited';
const SITE_URL  = 'https://shreesuryodayakhadyaudhyog.com.np';
const DEFAULT_DESC =
  'Premium quality rice milling company in Gaindakot, Nawalpur, Nepal. Supplying the finest rice varieties — Basmati, Katarni, Jeera Masino, and more — across Nepal since 2009.';

export default function useSEO({ title, description } = {}) {
  useEffect(() => {
    const prev = document.title;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    const setMeta = (selector, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [, attr, val] = selector.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/);
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    const desc    = description || DEFAULT_DESC;
    const pageUrl = `${SITE_URL}${window.location.pathname}`;

    setMeta('meta[name="description"]',       desc);
    setMeta('meta[property="og:title"]',      fullTitle);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:url"]',        pageUrl);
    setLink('canonical', pageUrl);

    return () => { document.title = prev; };
  }, [title, description]);
}
