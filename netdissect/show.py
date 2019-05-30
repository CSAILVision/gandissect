# show.py
#
# An abbreviated way to output simple HTML layout of text and images
# into a python notebook.
#
# - show a PIL image to show an inline HTML <img>.
# - show an array of items to vertically stack them, centered in a block.
# - show an array of arrays to horizontally lay them out as inline blocks.
# - show an array of tuples to create a table.

import PIL, base64, io, IPython, types, sys
import html as html_module
from IPython.display import display

def blocks(obj, space=''):
    return IPython.display.HTML(space.join(blocks_tags(obj)))

def rows(obj, space=''):
    return IPython.display.HTML(space.join(rows_tags(obj)))

def rows_tags(obj):
    if isinstance(obj, dict):
        obj = obj.items()
    results = []
    results.append('<table style="display:inline-table">')
    for row in obj:
        results.append('<tr style="padding:0">')
        for item in row:
            results.append('<td style="text-align:left; vertical-align:top;' +
                'padding:1px">')
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
        results.extend(blocks_tags([(k, v) for k, v in obj.items()]))
    elif hasattr(obj, '__iter__'):
        blockstart, blockend, tstart, tend, rstart, rend, cstart, cend = [
          '<div style="display:inline-block;text-align:center;line-height:1;' +
              'vertical-align:top;padding:1px">',
          '</div>',
          '<table style="display:inline-table">',
          '</table>',
          '<tr style="padding:0">',
          '</tr>',
          '<td style="text-align:left; vertical-align:top; padding:1px">',
          '</td>',
          ]
        needs_end = False
        table_mode = False
        for i, line in enumerate(obj):
            if i == 0:
                needs_end = True
                if isinstance(line, tuple):
                    table_mode = True
                    results.append(tstart)
                else:
                    results.append(blockstart)
            if table_mode:
                results.append(rstart)
                if not isinstance(line, str) and hasattr(line, '__iter__'):
                    for cell in line:
                        results.append(cstart)
                        results.extend(blocks_tags(cell))
                        results.append(cend)
                else:
                    results.append(cstart)
                    results.extend(blocks_tags(line))
                    results.append(cend)
                results.append(rend)
            else:
                results.extend(blocks_tags(line))
        if needs_end:
            results.append(table_mode and tend or blockend)
    return results

def pil_to_b64(img, format='png'):
    buffered = io.BytesIO()
    img.save(buffered, format=format)
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def pil_to_html(img):
    return '<img src="data:image/png;base64,%s">' % (pil_to_b64(img))
    

class CallableModule(types.ModuleType):
    def __init__(self):
        # or super().__init__(__name__) for Python 3
        types.ModuleType.__init__(self, __name__)
        self.__dict__.update(sys.modules[__name__].__dict__)
    def __call__(self, x, *args, **kwargs):
        return display(blocks(x, *args, **kwargs))

sys.modules[__name__] = CallableModule()

