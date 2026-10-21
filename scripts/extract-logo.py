"""
Extrai as partes brancas da logo do Projeto Celeste (banner rosa original)
para PNGs com fundo transparente, sem redesenhar nada.

- Texto branco: o fundo rosa é estimado localmente (abertura morfológica no
  canal verde, que é baixo no rosa e alto no branco) e a transparência é
  "desmisturada": alpha = (G - fundo) / (255 - fundo).
- Emblema do olho: mantido com os pixels originais, recortado num círculo.

Uso:  python scripts/extract-logo.py src/assets/brand/celeste-banner-original.png src/assets/brand
"""
import sys
from pathlib import Path

import numpy as np
from numpy.lib.stride_tricks import sliding_window_view
from PIL import Image

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
SCALE = 2  # exporta @2x para telas de alta densidade

rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)
H, W, _ = rgb.shape
g = rgb[..., 1]


def filt(a, k, fn):
    pad = k // 2
    a = np.pad(a, ((0, 0), (pad, pad)), mode="edge")
    a = fn(sliding_window_view(a, k, axis=1), axis=-1)
    a = np.pad(a, ((pad, pad), (0, 0)), mode="edge")
    return fn(sliding_window_view(a, k, axis=0), axis=-1)


def box_blur(a, k):
    pad = k // 2
    a = np.pad(a, pad, mode="edge")
    c = a.cumsum(0).cumsum(1)
    c = np.pad(c, ((1, 0), (1, 0)))
    return (c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]) / (k * k)


# Fundo local: abertura (min seguida de max) remove traços claros mais finos que a janela.
bg = filt(filt(g, 71, np.min), 71, np.max)
bg = box_blur(box_blur(bg, 31), 31)
alpha = np.clip((g - bg) / np.maximum(255 - bg, 1), 0, 1)
alpha = np.clip((alpha - 0.06) / 0.88, 0, 1)  # limpa o ruído do fundo


def dilate(m):
    p = np.pad(m, 1)
    return np.max([p[dy:dy + H, dx:dx + W] for dy in range(3) for dx in range(3)], axis=0)


# Histerese: as silhuetas rosa-claro do fundo do banner viram "fantasmas" de 20–50%.
# Só fica o que está conectado a traços realmente brancos (a própria logo).
seed, allowed = alpha > 0.9, alpha > 0.45
keep = seed
while True:
    grown = dilate(keep) & allowed
    if (grown == keep).all():
        break
    keep = grown
keep = dilate(dilate(keep))  # preserva a borda suavizada dos traços
alpha = alpha * keep

# Emblema do olho: círculo com pixels originais.
cx, cy, r = 420.5, 148.0, 41.6
yy, xx = np.mgrid[0:H, 0:W]
dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
disc = np.clip(r - dist + 0.5, 0, 1)

white = np.full_like(rgb, 255.0)
color = white * (1 - disc[..., None]) + rgb * disc[..., None]
# Fora do disco, a cor do emblema vira cinza claro para não gerar franja rosa ao redimensionar.
edge_grey = np.array([214, 214, 214], np.float32)
color = np.where((dist < r + 3)[..., None] & (disc < 1)[..., None], edge_grey, color)
a_full = np.maximum(alpha * (dist > r + 0.5), disc)


INK = np.array([42, 23, 51], np.float32)  # roxo-tinta para o tema claro


def export(name, box, ink=False):
    x0, y0, x1, y1 = box
    sub_a = a_full[y0:y1, x0:x1]
    ys, xs = np.nonzero(sub_a > 0.02)
    pad = 4
    bx0, by0 = max(xs.min() - pad, 0), max(ys.min() - pad, 0)
    bx1, by1 = min(xs.max() + pad + 1, x1 - x0), min(ys.max() + pad + 1, y1 - y0)
    crop_a = sub_a[by0:by1, bx0:bx1]
    c = color
    if ink:  # mesma forma, só troca o branco pela tinta; o emblema mantém os pixels originais
        c = INK * (1 - disc[..., None]) + color * disc[..., None]
    crop_c = c[y0:y1, x0:x1][by0:by1, bx0:bx1]
    img = np.dstack([crop_c, crop_a * 255]).round().astype(np.uint8)
    im = Image.fromarray(img, "RGBA")
    im = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
    out = OUT / f"{name}{'-ink' if ink else ''}.webp"
    im.save(out, quality=92, method=6)
    print(out.name, im.size)


OUT.mkdir(parents=True, exist_ok=True)
for ink in (False, True):
    export("celeste-wordmark", (590, 60, 1090, 335), ink)
    export("celeste-lockup-full", (255, 60, 1090, 335), ink)
