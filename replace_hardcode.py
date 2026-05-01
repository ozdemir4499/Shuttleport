import os
import re

d = "/home/bedir/Documents/code/Shuttleport_Front/src"
for root, _, files in os.walk(d):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            path = os.path.join(root, f)
            with open(path) as file: txt = file.read()
            
            # Replace 'https://...' -> `${...}`
            txt = re.sub(r"'https://turizm\.bedirkaraabali\.com([^']*)'", r"`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}\1`", txt)
            # Replace "https://..." -> `${...}`
            txt = re.sub(r'"https://turizm\.bedirkaraabali\.com([^"]*)"', r"`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}\1`", txt)
            # Replace remaining inside backticks
            txt = txt.replace("https://turizm.bedirkaraabali.com", "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}")
            
            with open(path, 'w') as file: file.write(txt)
