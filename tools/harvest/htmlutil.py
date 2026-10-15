import re, html as _html

def main_html(d):
    m = re.search(r'(?is)<main.*?</main>', d)
    s = m.group(0) if m else d
    return re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>', '', s)

def text(fragment):
    s = re.sub(r'(?i)<br\s*/?>', '\n', fragment)
    s = re.sub(r'(?i)</(p|li|h[1-6]|div)>', '\n', s)
    s = re.sub(r'(?s)<[^>]+>', '', s)
    s = _html.unescape(s).replace('\xa0', ' ')
    lines = [re.sub(r'[ \t]+', ' ', l).strip() for l in s.split('\n')]
    return '\n'.join(l for l in lines if l and l != '¨')

def h1(d):
    m = re.search(r'(?is)<h1[^>]*>(.*?)</h1>', d)
    return text(m.group(1)).strip() if m else None

def imgs(fragment):
    out = []
    for m in re.finditer(r'<img[^>]*\ssrc="([^"]+)"', fragment):
        u = _html.unescape(m.group(1)).split('?')[0]
        if '/sites/default/files/' in u and u not in out:
            out.append(u if u.startswith('/') else re.sub(r'^https?://[^/]+', '', u))
    return out

def block(d, start_marker, end_markers=('<div class="views-element-container', '<div id="block-')):
    i = d.find(start_marker)
    if i < 0: return ''
    j = len(d)
    for em in end_markers:
        k = d.find(em, i + len(start_marker))
        if 0 < k < j: j = k
    return d[i:j]
