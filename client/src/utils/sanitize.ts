import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
      'ul', 'ol', 'li', 'blockquote', 'a', 'h1', 'h2', 'h3',
      'h4', 'h5', 'h6', 'hr', 'span', 'div', 'table', 'thead',
      'tbody', 'tr', 'td', 'th', 'img',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'title'],
    ALLOW_DATA_ATTR: false,
  });
}
