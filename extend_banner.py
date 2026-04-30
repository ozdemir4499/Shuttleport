from PIL import Image, ImageFilter
import numpy as np

img = Image.open('public/airport_vip_van_wide_banner.png').convert('RGB')
target_h = 1000
target_w = int(1000 * 4.5) # 4500

img_resized = img.resize((target_h, target_h), Image.Resampling.LANCZOS)
banner = Image.new('RGB', (target_w, target_h))

# Paste car on the right
paste_x = target_w - target_h
banner.paste(img_resized, (paste_x, 0))

# Extract left 200 pixels
left_slice = img_resized.crop((0, 0, 200, target_h))
# Stretch it
left_stretched = left_slice.resize((paste_x + 50, target_h), Image.Resampling.LANCZOS)

# Apply strong blur to the stretched part so it looks like soft bokeh background
left_blurred = left_stretched.filter(ImageFilter.GaussianBlur(radius=80))

# Create a gradient mask to blend the blurred background with the car image
# We want the transition to happen around paste_x
mask = Image.new('L', (target_w, target_h), 255)
# Draw gradient on the mask
import math
for x in range(target_w):
    if x < paste_x - 300:
        alpha = 255
    elif x > paste_x + 100:
        alpha = 0
    else:
        # smooth transition
        progress = (x - (paste_x - 300)) / 400.0
        alpha = int(255 * (1 - progress))
    for y in range(target_h):
        mask.putpixel((x, y), alpha)

# Create a composite image
bg = Image.new('RGB', (target_w, target_h))
bg.paste(left_blurred, (0, 0))
# extend bg to right just in case
right_slice = left_blurred.crop((left_blurred.width-1, 0, left_blurred.width, target_h)).resize((target_w - left_blurred.width, target_h))
bg.paste(right_slice, (left_blurred.width, 0))

final_banner = Image.composite(bg, banner, mask)
final_banner.save('public/airport_vip_van_wide_banner_extended.png', quality=95)
print('Extended banner created!')
