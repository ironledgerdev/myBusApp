import os
from PIL import Image, ImageDraw

def create_icon(size, name):
    img = Image.new('RGBA', (size, size), (248, 166, 34)) # #f8a622
    draw = ImageDraw.Draw(img)
    
    # Draw a simple bus shape (white rectangle)
    margin = size // 4
    draw.rectangle(
        [margin, margin, size - margin, size - margin],
        fill="white"
    )
    
    img.save(os.path.join('public', name))

def create_masked_icon(size, name):
    # Masked icon should be on transparent background for some purposes, 
    # but for "any maskable" usually just a full bleed background is fine.
    # Let's make a simple version.
    img = Image.new('RGBA', (size, size), (248, 166, 34))
    draw = ImageDraw.Draw(img)
    
    # Draw a simple bus shape
    margin = size // 3
    draw.rectangle(
        [margin, margin, size - margin, size - margin],
        fill="white"
    )
    
    img.save(os.path.join('public', name))

if not os.path.exists('public'):
    os.makedirs('public')

create_icon(192, 'pwa-192x192.png')
create_icon(512, 'pwa-512x512.png')

# Create apple-touch-icon
create_icon(180, 'apple-touch-icon.png')

# Create favicon.ico (32x32)
img = Image.new('RGBA', (32, 32), (248, 166, 34))
img.save(os.path.join('public', 'favicon.ico'))

# Create SVG icon
with open(os.path.join('public', 'masked-icon.svg'), 'w') as f:
    f.write('''<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="512" height="512" fill="#F8A622"/>
<rect x="128" y="128" width="256" height="256" fill="white"/>
</svg>''')
