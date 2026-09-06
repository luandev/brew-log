import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

function prefixSiteUrls(html: string): string {
  return html
    .replaceAll(/href="\/(?!brew-log\/)/g, 'href="/brew-log/')
    .replaceAll(/src="\/(?!brew-log\/)/g, 'src="/brew-log/');
}

export function Markdown({ source }: { source?: string | null }) {
  if (!source || !source.trim()) return null;
  const html = prefixSiteUrls(String(marked.parse(source, { async: false })));
  return <div className="md-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
