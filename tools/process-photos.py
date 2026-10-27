"""Turn raw product photos into Shahd-branded square photos.

- Square crop focused on the sweets (keeps packaging and logos out of frame)
- Upscale to 800px with sharpening
- Brand grade: turquoise backgrounds become a soft pastel mint, sweets get a
  gentle warm lift, plus a light cream vignette

Usage: python3 tools/process-photos.py <raw_dir> <out_dir> [name ...]
Edit JOBS below to add a photo: (source file, crop x, y, size in 300px space, output name[, cleanup]).
cleanup: list of areas to retouch before cropping (filled from the surrounding pixels):
  ('e', cx, cy, rx, ry) ellipse, or ('r', x0, y0, x1, y1) rectangle — also in 300px space.
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

SIZE = 800

# (source, x, y, size) — coordinates are on a 300x300 version of the photo
JOBS = [
    ('84503b05-image.webp', 104, 92, 195, 'konafa-cream'),
    ('f2bfb157-image.png', 25, 50, 250, 'konafa-round'),
    ('bfc09382-image.png', 25, 50, 250, 'konafa-naama'),
    ('4d333e7e-image.png', 40, 75, 225, 'konafa-naama-box'),
    ('0a7952e9-image.webp', 104, 105, 195, 'konafa-naama-squares'),
    ('79913010-image.webp', 28, 90, 210, 'balah'),
    ('5215016f-image.webp', 0, 35, 255, 'basbousa'),
    ('3ce462ab-image.webp', 110, 108, 190, 'basbousa-cream'),
    ('e42f77ae-image.webp', 10, 10, 230, 'basbousa-nutella'),
    ('7f375ab8-image.webp', 5, 60, 240, 'harissa'),
    ('fab1e518-image.webp', 110, 105, 190, 'harissa-squares'),
    ('96d6f19a-image.webp', 50, 90, 210, 'shakarbara'),
    ('78a03c49-image.webp', 122, 110, 178, 'baklava'),
    ('7e7d71ac-image.png', 10, 35, 265, 'baklava-tray'),
    ('1d6b97ad-image.webp', 5, 25, 275, 'assorted-tray'),
    ('1b8a17bf-image.webp', 20, 20, 250, 'fingers'),
    ('a0c124f1-image.webp', 110, 110, 190, 'fingers-mini'),
    ('8d4b8b25-image.webp', 110, 100, 190, 'triangles'),
    ('73f459b3-image.png', 70, 85, 215, 'gift-box'),
    # كحك وبسكويت
    ('4faa51bc-image.webp', 90, 85, 210, 'kahk'),
    ('9f138ce1-image.webp', 90, 105, 195, 'cookies'),
    ('dc862206-image.webp', 0, 125, 175, 'biscuit-fingers'),
    ('9b26f33b-image.webp', 30, 50, 250, 'petit-four'),
    # كاسات
    ('9ab03452-image.png', 15, 40, 255, 'rice'),
    ('c01dcf03-image.png', 15, 40, 255, 'rice-nuts'),
    ('407ae8b0-image.png', 15, 40, 255, 'rice-caramel'),
    ('78b3da49-image.webp', 75, 60, 225, 'mahalabia'),
    ('ff86986b-image.webp', 95, 45, 205, 'fruit-cream', [('r', 92, 40, 124, 78)]),
    ('f281ce6d-image.webp', 0, 40, 260, 'om-ali', [('e', 53, 158, 11, 11), ('r', 60, 166, 74, 176), ('r', 131, 219, 164, 246)]),
    # تورت وجاتوه
    ('5e63d7e3-image.png', 95, 65, 205, 'gateau-roll'),
    ('4048b9b2-image.webp', 60, 40, 240, 'millefeuille', [('r', 55, 38, 112, 84)]),
    ('ca466ea0-image.webp', 10, 45, 255, 'cake-mango', [('e', 144, 153, 29, 22), ('r', 18, 38, 85, 74)]),
    ('edafb658-image.webp', 5, 40, 260, 'cake-mix', [('e', 82, 107, 18, 18), ('r', 148, 233, 196, 268), ('e', 29, 205, 7, 13), ('r', 22, 22, 102, 56), ('r', 0, 34, 42, 64)]),
    ('d72c7d12-image.webp', 20, 50, 250, 'cake-bw', [('e', 200, 130, 19, 21)]),
    ('8d96666c-image.webp', 40, 65, 235, 'cake-chocolate', [('e', 212, 151, 21, 24)]),
    ('aa96fc19-image.webp', 0, 20, 280, 'cake-oreo', [('e', 89, 63, 17, 23)]),
]


def grade(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    hsv = np.asarray(im.convert('HSV')).astype(np.float32)
    h, s, v = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2] / 255
    # turquoise/teal backgrounds -> soft pastel mint
    teal = np.clip(1 - np.abs(h - 178) / 32, 0, 1) * np.clip((s - .12) / .2, 0, 1)
    gray = a.mean(axis=2, keepdims=True)
    mint = np.array([0.80, 0.93, 0.86])
    soft = gray * 0.35 + mint * 0.65
    soft = soft * (0.75 + 0.35 * v[..., None])
    t = teal[..., None] * 0.78
    a = a * (1 - t) + soft * t
    # warm lift on sweets (orange/brown hues)
    warm = np.clip(1 - np.abs(h - 32) / 26, 0, 1)[..., None] * 0.08
    a = a + warm * np.array([0.10, 0.04, -0.04])
    # brighten slightly and add a cream vignette
    a = a * 1.03 + 0.015
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    r = np.hypot((xx - a.shape[1] / 2) / (a.shape[1] / 2), (yy - a.shape[0] / 2) / (a.shape[0] / 2))
    vig = np.clip((r - 0.9) / 0.6, 0, 1)[..., None] * 0.35
    a = a * (1 - vig) + np.array([1.0, 0.97, 0.94]) * vig
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return ImageEnhance.Color(out).enhance(1.06)


def cleanup(im, areas, k):
    import cv2
    from PIL import ImageDraw
    mask = Image.new('L', im.size, 0)
    d = ImageDraw.Draw(mask)
    for a in areas:
        if a[0] == 'e':
            _, cx, cy, rx, ry = a
            d.ellipse(((cx - rx) * k, (cy - ry) * k, (cx + rx) * k, (cy + ry) * k), fill=255)
        else:
            _, x0, y0, x1, y1 = a
            d.rectangle((x0 * k, y0 * k, x1 * k, y1 * k), fill=255)
    mask = mask.filter(ImageFilter.MaxFilter(3))
    arr = cv2.inpaint(np.asarray(im)[..., ::-1].copy(), np.asarray(mask), 7, cv2.INPAINT_TELEA)[..., ::-1]
    # light grain so the filled area matches the photo
    noise = np.random.default_rng(1).normal(0, 3, arr.shape)
    m = (np.asarray(mask) > 0)[..., None]
    arr = np.where(m, np.clip(arr + noise, 0, 255), arr).astype(np.uint8)
    return Image.fromarray(arr)


def process(src, x, y, s, raw_dir, areas=()):
    im = Image.open(os.path.join(raw_dir, src)).convert('RGB')
    k = im.width / 300
    if areas:
        im = cleanup(im, areas, k)
    im = im.crop((round(x * k), round(y * k), round((x + s) * k), round((y + s) * k)))
    im = im.resize((SIZE, SIZE), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
    return grade(im)


if __name__ == '__main__':
    raw, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    only = set(sys.argv[3:])
    done = 0
    for src, x, y, s, name, *rest in JOBS:
        if only and name not in only:
            continue
        process(src, x, y, s, raw, rest[0] if rest else ()).save(os.path.join(out, name + '.webp'), quality=86, method=6)
        done += 1
    print(done, 'photos')
