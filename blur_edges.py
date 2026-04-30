from PIL import Image, ImageFilter

img = Image.open('public/airport_vip_van_wide_banner_shrunk.png')
w, h = img.size

# The center image is from pad_x to pad_x+new_w
new_w, new_h = int(w * 0.75), int(h * 0.75)
pad_x = (w - new_w) // 2
pad_y = (h - new_h) // 2

# Blur the whole image
blurred = img.filter(ImageFilter.GaussianBlur(radius=20))

# Paste the original sharp center back over the blurred image
center = img.crop((pad_x, pad_y, pad_x + new_w, pad_y + new_h))
blurred.paste(center, (pad_x, pad_y))

blurred.save('public/airport_vip_van_wide_banner_shrunk_blurred.png', quality=95)
