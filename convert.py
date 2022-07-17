with open('fuck.js', 'r') as f:
    content = f.read()

    striped = content.replace('\n', '')

    with open('fuck_stripped.js', 'w') as fw:
        fw.write(striped)