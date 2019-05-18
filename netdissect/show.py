import PIL, base64, io, IPython
import html as html_module

def rows(obj):
    return IPython.display.HTML('\n'.join(rows_tags(obj)))

def blocks(obj):
    return IPython.display.HTML('\n'.join(blocks_tags(obj)))

def rows_tags(obj):
    if isinstance(obj, dict):
        obj = obj.items()
    results = []
    results.append('<table style="display:inline-table">')
    for row in obj:
        results.append('<tr style="padding:0">')
        for item in row:
            results.append('<td style="text-align:left; vertical-align:top;' +
                'padding:2px">')
            results.extend(blocks_tags(item))
            results.append('</td>')
        results.append('</tr>')
    results.append('</table>')
    return results

def blocks_tags(obj):
    results = []
    if isinstance(obj, PIL.Image.Image):
        results.append(pil_to_html(obj))
    elif isinstance(obj, (str, int, float)):
        results.append('<div>')
        results.append(html_module.escape(str(obj)))
        results.append('</div>')
    elif isinstance(obj, IPython.display.HTML):
        results.append(obj.data)
    elif isinstance(obj, dict):
        results.extend(blocks_tags([(v, k) for k, v in obj.items()]))
    elif isinstance(obj, (list, tuple)) or hasattr(obj, '__iter__'):
        results.append(
            '<div style="display:inline-block; text-align:center">')
        for line in obj:
            results.extend(blocks_tags(line))
        results.append('</div>')
    return results

def pil_to_b64(img, format='png'):
    buffered = io.BytesIO()
    img.save(buffered, format=format)
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def pil_to_html(img):
    return '<img src="data:image/png;base64,%s">' % (pil_to_b64(img))
    

