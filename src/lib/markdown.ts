function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isSafeUrl(url: string): boolean {
  try {
    const decoded = url.replace(/&amp;/g, '&')
    const parsed = new URL(decoded)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

function parseInline(text: string): string {
  let result = escapeHtml(text)

  result = result.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (match, alt, url) => {
    if (!isSafeUrl(url)) return match
    return `<img src="${url}" alt="${alt}" />`
  })

  result = result.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, linkText, url) => {
    if (!isSafeUrl(url)) return match
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
  })

  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>')

  return result
}

export function markdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) return ''

  const lines = markdown.split('\n')
  const blocks: string[] = []
  let inList: 'ul' | 'ol' | null = null
  let inBlockquote = false
  let paragraphBuffer: string[] = []

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push(`<p>${parseInline(paragraphBuffer.join(' '))}</p>`)
      paragraphBuffer = []
    }
  }

  const closeList = () => {
    if (inList) {
      blocks.push(`</${inList}>`)
      inList = null
    }
  }

  const closeBlockquote = () => {
    if (inBlockquote) {
      blocks.push('</blockquote>')
      inBlockquote = false
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      closeList()
      closeBlockquote()
      continue
    }

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      flushParagraph()
      closeList()
      closeBlockquote()
      blocks.push('<hr />')
      continue
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/)
    if (headingMatch) {
      flushParagraph()
      closeList()
      closeBlockquote()
      const level = headingMatch[1].length
      blocks.push(`<h${level}>${parseInline(headingMatch[2])}</h${level}>`)
      continue
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph()
      closeList()
      if (!inBlockquote) {
        blocks.push('<blockquote>')
        inBlockquote = true
      }
      blocks.push(`<p>${parseInline(trimmed.slice(2))}</p>`)
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph()
      closeBlockquote()
      if (inList !== 'ul') {
        closeList()
        blocks.push('<ul>')
        inList = 'ul'
      }
      blocks.push(`<li>${parseInline(trimmed.replace(/^[-*]\s+/, ''))}</li>`)
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph()
      closeBlockquote()
      if (inList !== 'ol') {
        closeList()
        blocks.push('<ol>')
        inList = 'ol'
      }
      blocks.push(`<li>${parseInline(trimmed.replace(/^\d+\.\s+/, ''))}</li>`)
      continue
    }

    closeList()
    closeBlockquote()
    paragraphBuffer.push(trimmed)
  }

  flushParagraph()
  closeList()
  closeBlockquote()

  return blocks.join('\n')
}
