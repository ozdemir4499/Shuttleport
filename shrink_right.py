from PIL import Image, ImageFilter

img = Image.open('public/airport_vip_van_wide_banner.png').convert('RGB')
w, h = img.size

new_w, new_h = int(w * 0.75), int(h * 0.75)
img_small = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

canvas = Image.new('RGB', (w, h))

# Paste small image on the FAR RIGHT, vertically centered
pad_x = w - new_w
pad_y = (h - new_h) // 2
canvas.paste(img_small, (pad_x, pad_y))

# Extend top
top_edge = img_small.crop((0, 0, new_w, 1))
top_pad = top_edge.resize((new_w, pad_y))
canvas.paste(top_pad, (pad_x, 0))

# Extend bottom
bottom_edge = img_small.crop((0, new_h - 1, new_w, new_h))
bottom_pad = bottom_edge.resize((new_w, pad_y))
canvas.paste(bottom_pad, (pad_x, pad_y + new_h))

# Extend left (including corners)
left_edge = canvas.crop((pad_x, 0, pad_x + 1, h))
left_pad = left_edge.resize((pad_x, h))
canvas.paste(left_pad, (0, 0))

# No right padding needed because pad_x + new_w == w

# Blur the canvas
blurred = canvas.filter(ImageFilter.GaussianBlur(radius=20))

# Paste the original sharp image back over the blurred canvas
blurred.paste(img_small, (pad_x, pad_y))

blurred.save('public/airport_vip_van_wide_banner_shrunk_right.png', quality=95)
