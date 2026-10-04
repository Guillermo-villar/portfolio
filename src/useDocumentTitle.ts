import { useEffect } from 'react';

const SITE_NAME = 'Guillermo Villar';

/** Sets the tab title: "<page> | Guillermo Villar", or just the site name on the home page. */
export const useDocumentTitle = (page?: string) => {
  useEffect(() => {
    document.title = page ? `${page} | ${SITE_NAME}` : SITE_NAME;
  }, [page]);
};
