import { useEffect } from 'react';

// Turns a tech name like "Next.js" or "scikit-learn" into a safe CSS class ("next-js", "scikit-learn")
export const techClass = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const isExternalLink = (link: string): boolean => /^https?:\/\//.test(link);

const SITE_NAME = 'Guillermo Villar Sánchez';

export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Portfolio`;
  }, [title]);
};
