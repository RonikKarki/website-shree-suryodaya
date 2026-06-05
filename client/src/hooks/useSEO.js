import { useEffect } from 'react';

const SITE_NAME = 'Shree Suryodaya Khadya Udhyog Limited';
const DEFAULT_DESC =
  'Premium quality rice milling company in Gaindakot, Nawalpur, Nepal. Supplying the finest rice varieties — Basmati, Katarni, Jeera Masino, and more — across Nepal since 2009.';

export default function useSEO({ title, description } = {}) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

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

    const desc = description || DEFAULT_DESC;
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', title ? `${title} | ${SITE_NAME}` : SITE_NAME);
    setMeta('meta[property="og:description"]', desc);

    return () => {
      document.title = prev;
    };
  }, [title, description]);
}
