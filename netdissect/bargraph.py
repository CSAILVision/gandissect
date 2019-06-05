from xml.etree import ElementTree as et

def make_svg_bargraph(labels, heights, categories=None, palette=None,
        barheight=100, barwidth=12, show_labels=True, file_header=False):
    if palette is None:
        palette = default_bargraph_palette
    if categories is None:
        categories = [('', len(labels))]
    unitheight = float(barheight) / max(max(heights, default=1), 1)
    textheight = barheight if show_labels else 0
    labelsize = float(barwidth)
    gap = float(barwidth) / 4
    textsize = barwidth + gap
    rollup = max(heights, default=1)
    textmargin = float(labelsize) * 2 / 3
    leftmargin = 32
    rightmargin = 8
    svgwidth = len(heights) * (barwidth + gap) + 2 * leftmargin + rightmargin
    svgheight = barheight + textheight

    # create an SVG XML element
    svg = et.Element('svg', width=str(svgwidth), height=str(svgheight),
            version='1.1', xmlns='http://www.w3.org/2000/svg')

    # Draw the bar graph
    basey = svgheight - textheight
    x = leftmargin
    # Add units scale on left
    if len(heights):
        for h in [1, (max(heights) + 1) // 2, max(heights)]:
            et.SubElement(svg, 'text', x='0', y='0',
                style=('font-family:sans-serif;font-size:%dpx;' +
                'text-anchor:end;alignment-baseline:hanging;' +
                'transform:translate(%dpx, %dpx);') %
                (textsize, x - gap, basey - h * unitheight)).text = str(h)
        et.SubElement(svg, 'text', x='0', y='0',
                style=('font-family:sans-serif;font-size:%dpx;' +
                'text-anchor:middle;' +
                'transform:translate(%dpx, %dpx) rotate(-90deg)') %
                (textsize, x - gap - textsize, basey - h * unitheight / 2)
                ).text = 'units'
    # Draw big category background rectangles
    for catindex, (cat, catcount) in enumerate(categories):
        if not catcount:
            continue
        et.SubElement(svg, 'rect', x=str(x), y=str(basey - rollup * unitheight),
                width=(str((barwidth + gap) * catcount - gap)),
                height = str(rollup*unitheight),
                fill=palette[catindex % len(palette)][1])
        x += (barwidth + gap) * catcount
    # Draw small bars as well as 45degree text labels
    x = leftmargin
    catindex = -1
    catcount = 0
    for label, height in zip(labels, heights):
        while not catcount and catindex <= len(categories):
            catindex += 1
            catcount = categories[catindex][1]
            color = palette[catindex % len(palette)][0]
        et.SubElement(svg, 'rect', x=str(x), y=str(basey-(height * unitheight)),
                width=str(barwidth), height=str(height * unitheight),
                fill=color)
        x += barwidth
        if show_labels:
            et.SubElement(svg, 'text', x='0', y='0',
                style=('font-family:sans-serif;font-size:%dpx;text-anchor:end;'+
                'transform:translate(%dpx, %dpx) rotate(-45deg);') %
                (labelsize, x, basey + textmargin)).text = label
        x += gap
        catcount -= 1
    # Text labels for each category
    x = leftmargin
    for cat, catcount in categories:
        if not catcount:
            continue
        et.SubElement(svg, 'text', x='0', y='0',
            style=('font-family:sans-serif;font-size:%dpx;text-anchor:end;'+
            'transform:translate(%dpx, %dpx) rotate(-90deg);') %
            (textsize, x + (barwidth + gap) * catcount - gap,
                basey - rollup * unitheight + gap)).text = '%d %s' % (
                    catcount, cat + ('s' if catcount != 1 else ''))
        x += (barwidth + gap) * catcount
    # Output - this is the bare svg.
    result = et.tostring(svg).decode('utf-8')
    if file_header:
        result = (
            '<?xml version=\"1.0\" standalone=\"no\"?>\n',
            '<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\"\n',
            '\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n'
            + result)
    return result

default_bargraph_palette = [
    ('#4B4CBF', '#B6B6F2'),
    ('#55B05B', '#B6F2BA'),
    ('#50BDAC', '#A5E5DB'),
    ('#81C679', '#C0FF9B'),
    ('#F0883B', '#F2CFB6'),
    ('#D4CF24', '#F2F1B6'),
    ('#D92E2B', '#F2B6B6'),
    ('#AB6BC6', '#CFAAFF'),
]

