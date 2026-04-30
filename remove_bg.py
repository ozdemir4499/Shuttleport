from PIL import Image
import numpy as np

img = Image.open('public/red_lion_icon.png').convert('RGBA')
data = np.array(img).astype(float)

r = data[:,:,0]
g = data[:,:,1]
b = data[:,:,2]

# Whiteness is the minimum of RGB
w = np.minimum(np.minimum(r, g), b)

# New alpha is 255 - whiteness
a = 255.0 - w

# Avoid division by zero
a_safe = np.maximum(a, 1.0)

# Recover original color
r_new = np.clip((r - w) * 255.0 / a_safe, 0, 255)
g_new = np.clip((g - w) * 255.0 / a_safe, 0, 255)
b_new = np.clip((b - w) * 255.0 / a_safe, 0, 255)

data[:,:,0] = r_new
data[:,:,1] = g_new
data[:,:,2] = b_new
data[:,:,3] = a

# Hardcode pure white to 0 alpha
data[w > 250, 3] = 0

img_out = Image.fromarray(data.astype(np.uint8))
img_out.save('src/app/icon.png')
print('Successfully removed white background!')
