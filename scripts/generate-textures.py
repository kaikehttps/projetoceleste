"""
Gera as texturas procedurais do site (sem imagens externas):

- fog-a / fog-b: névoa em faixas, contínua no eixo X (pode repetir e deslizar);
- paper: fibras e manchas de papel envelhecido, para sobrepor a qualquer cor;
- grain: granulação de filme bem sutil.

Uso:  python scripts/generate-textures.py src/assets/textures
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)


def spectral_noise(h, w, beta, stretch_x=1.0, seed=0):
    """Ruído 1/f^beta (periódico nos dois eixos, portanto contínuo nas bordas)."""
    rng = np.random.default_rng(seed)
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.rfftfreq(w)[None, :] * stretch_x
    f = np.sqrt(fx**2 + fy**2)
    f[0, 0] = 1
    spectrum = (rng.normal(size=f.shape) + 1j * rng.normal(size=f.shape)) / f**beta
    spectrum[0, 0] = 0
    n = np.fft.irfft2(spectrum, s=(h, w))
    return (n - n.mean()) / n.std()


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def fog(name, seed, w=1280, h=400, stretch=3.0):
    n = spectral_noise(h, w, 2.35, stretch, seed)
    n += 0.18 * spectral_noise(h, w, 1.7, stretch * 1.4, seed + 7)
    y = np.linspace(0, 1, h)[:, None]
    # mais densa embaixo, dissolvendo para cima
    band = smoothstep(0.0, 0.75, y) ** 1.4
    a = smoothstep(-1.6, 2.2, n + band * 1.2 - 0.3) * band
    a = np.clip(a, 0, 1) * 0.72
    img = np.zeros((h, w, 4), np.uint8)
    img[..., :3] = 255
    img[..., 3] = (a * 255).round().astype(np.uint8)
    Image.fromarray(img, "RGBA").save(OUT / f"{name}.webp", quality=80, method=6)
    print(name, img.shape)


def paper(size=512, seed=11):
    rng = np.random.default_rng(seed)
    blot = spectral_noise(size, size, 1.9, 1.0, seed)  # manchas grandes
    fibers = spectral_noise(size, size, 0.9, 6.0, seed + 1)  # fibras alongadas
    fine = rng.normal(size=(size, size))
    v = 0.3 * smoothstep(0.8, 3.2, blot) + 0.35 * np.clip(fibers * 0.4, 0, 1) + 0.12 * np.abs(fine) * 0.5
    a = np.clip(v, 0, 1) * 0.3
    img = np.zeros((size, size, 4), np.uint8)
    img[..., 0], img[..., 1], img[..., 2] = 70, 46, 38  # sépia escuro
    img[..., 3] = (a * 255).round().astype(np.uint8)
    Image.fromarray(img, "RGBA").save(OUT / "paper.webp", quality=72, method=6)
    print("paper", img.shape)


def grain(size=240, seed=3):
    rng = np.random.default_rng(seed)
    lum = rng.random((size, size)) > 0.5
    img = np.zeros((size, size, 4), np.uint8)
    img[..., :3] = np.where(lum, 255, 0)[..., None]
    img[..., 3] = rng.integers(8, 30, (size, size))
    Image.fromarray(img, "RGBA").save(OUT / "grain.png", optimize=True)
    print("grain", img.shape)


fog("fog-a", seed=21)
fog("fog-b", seed=42, stretch=2.4)
paper()
grain()
