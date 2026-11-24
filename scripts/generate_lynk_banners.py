#!/usr/bin/env python3
"""
Generator Banner & Foto Profil Lynk.id untuk Aplikasi Jalur Langit.
Menggunakan screenshot nyata (real screenshots) dari aplikasi PWA yang diunggah pengguna.
Menghasilkan 5 aset beresolusi tinggi dengan estetika Luxury Emerald Green & Gold Islamic Minimalism:
1. foto-profil-lynkid.png (800x800)
2. banner-toko-lynkid.jpg (1600x900)
3. banner-paket-starter.jpg (1080x1080)
4. banner-paket-bundling.jpg (1080x1080)
5. banner-paket-vip.jpg (1080x1080)
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "public", "screenshots")
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "banners")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Screenshot files
SS_KALENDER = os.path.join(SCREENSHOTS_DIR, "01-amalan-kalender.jpg")
SS_AMALAN = os.path.join(SCREENSHOTS_DIR, "02-menu-amalan.jpg")
SS_GLOWUP = os.path.join(SCREENSHOTS_DIR, "03-menu-glowup.jpg")
SS_TASBIH = os.path.join(SCREENSHOTS_DIR, "04-tasbih-digital.jpg")
SS_VISION = os.path.join(SCREENSHOTS_DIR, "05-menu-vision.jpg")
SS_QURAN = os.path.join(SCREENSHOTS_DIR, "06-menu-quran.jpg")

# Windows System Fonts
FONT_SERIF_BOLD = r"C:\Windows\Fonts\georgiab.ttf"
FONT_SERIF = r"C:\Windows\Fonts\georgia.ttf"
FONT_SANS_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_SANS = r"C:\Windows\Fonts\segoeui.ttf"
FONT_ARIAL_BOLD = r"C:\Windows\Fonts\arialbd.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

# Palet Warna Luxury Emerald & Gold
C_DARK_BG = (2, 24, 17)        # Emerald Sangat Gelap #021811
C_EMERALD_MID = (4, 58, 42)    # Emerald Menengah #043a2a
C_EMERALD_LIGHT = (6, 95, 70)  # Emerald Terang #065f46
C_GOLD_LIGHT = (251, 191, 36)  # Emas Cerah #fbbf24
C_GOLD_RICH = (217, 119, 6)    # Emas Kuning Tua #d97706
C_AMBER = (245, 158, 11)       # Amber Hangat #f59e0b
C_PURPLE = (126, 34, 206)      # Ungu Royal VIP #7e22ce
C_WHITE = (255, 255, 255)
C_CREAM = (251, 249, 245)      # Ivory Cream Jalur Langit #fbf9f5
C_TEXT_MUTED = (167, 196, 185) # Muted Emerald Text

def create_luxury_background(width, height, theme="emerald"):
    """Membuat latar belakang gradient mewah dengan efek radial glow dan border emas."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    
    # 1. Gradient Vertikal / Diagonal
    for y in range(height):
        ratio = y / height
        if theme == "emerald":
            r = int(C_DARK_BG[0] * (1 - ratio) + 3 * ratio)
            g = int(C_DARK_BG[1] * (1 - ratio) + 38 * ratio)
            b = int(C_DARK_BG[2] * (1 - ratio) + 26 * ratio)
        elif theme == "vip":
            # Emerald dengan nuansa ungu royal
            r = int(C_DARK_BG[0] * (1 - ratio) + 28 * ratio)
            g = int(C_DARK_BG[1] * (1 - ratio) + 20 * ratio)
            b = int(C_DARK_BG[2] * (1 - ratio) + 48 * ratio)
        elif theme == "starter":
            r = int(C_DARK_BG[0] * (1 - ratio) + 2 * ratio)
            g = int(C_DARK_BG[1] * (1 - ratio) + 48 * ratio)
            b = int(C_DARK_BG[2] * (1 - ratio) + 32 * ratio)
        else:
            r = int(C_DARK_BG[0] * (1 - ratio) + 8 * ratio)
            g = int(C_DARK_BG[1] * (1 - ratio) + 42 * ratio)
            b = int(C_DARK_BG[2] * (1 - ratio) + 28 * ratio)
        for x in range(width):
            img.putpixel((x, y), (r, g, b, 255))
            
    # 2. Ambient Glowing Orbs (Cahaya Emas & Zamrud Melayang)
    glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow_layer)
    
    # Top-right Golden Orb
    gdraw.ellipse([width - 350, -100, width + 250, 500], fill=(245, 158, 11, 45))
    # Bottom-left Emerald Orb
    gdraw.ellipse([-150, height - 400, 450, height + 200], fill=(16, 185, 129, 40))
    # Center ambient if VIP
    if theme == "vip":
        gdraw.ellipse([width//2 - 200, height//2 - 200, width//2 + 200, height//2 + 200], fill=(147, 51, 234, 35))
        
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, glow_layer)
    
    # 3. Geometric Islamic Border Inset
    draw = ImageDraw.Draw(img)
    inset = 24
    draw.rounded_rectangle([inset, inset, width - inset, height - inset], radius=24, outline=(212, 175, 55, 75), width=2)
    # Corner diamonds
    corner_size = 8
    corners = [
        (inset, inset),
        (width - inset, inset),
        (inset, height - inset),
        (width - inset, height - inset)
    ]
    for cx, cy in corners:
        draw.polygon([
            (cx, cy - corner_size),
            (cx + corner_size, cy),
            (cx, cy + corner_size),
            (cx - corner_size, cy)
        ], fill=(251, 191, 36, 180))
        
    return img

def render_phone_mockup(ss_path, width=320, height=690, angle=0):
    """
    Merender screenshot asli ke dalam mockup smartphone titanium hitam/emas
    lengkap dengan drop shadow gaussian realistis dan dynamic island.
    """
    if not os.path.exists(ss_path):
        print(f"Warning: Screenshot {ss_path} tidak ditemukan!")
        return Image.new("RGBA", (width, height), (0, 0, 0, 0))
        
    ss = Image.open(ss_path).convert("RGBA")
    
    # Canvas frame untuk menampung phone + bayangan
    pad = 50
    pw, ph = width, height
    total_w = pw + pad * 2
    total_h = ph + pad * 2
    canvas = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    
    # 1. Realistic Drop Shadow
    shadow = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        [pad + 12, pad + 18, pad + pw - 12, pad + ph + 24],
        radius=40,
        fill=(0, 0, 0, 190)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    canvas.paste(shadow, (0, 0), shadow)
    
    # 2. Phone Chassis (Bodi HP Titanium dengan Garis Tepi Emas)
    body = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(body)
    
    # Metallic gold / titanium frame
    bdraw.rounded_rectangle([0, 0, pw, ph], radius=38, fill=(28, 34, 30, 255), outline=(212, 175, 55, 200), width=3)
    # Bezel dalam hitam
    bdraw.rounded_rectangle([5, 5, pw - 5, ph - 5], radius=34, fill=(12, 15, 14, 255))
    
    # 3. Area Layar (Screen Area)
    sw = pw - 20
    sh = ph - 24
    screen_img = ss.resize((sw, sh), Image.Resampling.LANCZOS)
    
    # Screen Corner Mask
    smask = Image.new("L", (sw, sh), 0)
    smdraw = ImageDraw.Draw(smask)
    smdraw.rounded_rectangle([0, 0, sw, sh], radius=26, fill=255)
    
    # 4. Dynamic Island Pill
    didraw = ImageDraw.Draw(screen_img)
    di_w, di_h = int(sw * 0.26), 14
    di_x = (sw - di_w) // 2
    didraw.rounded_rectangle([di_x, 6, di_x + di_w, 6 + di_h], radius=7, fill=(0, 0, 0, 255))
    # Kamera kecil di dalam dynamic island
    didraw.ellipse([di_x + di_w - 18, 9, di_x + di_w - 10, 17], fill=(20, 28, 45, 255))
    
    # 5. Glossy Specular Glass Reflection
    specular = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    spdraw = ImageDraw.Draw(specular)
    spdraw.polygon([(0, 0), (sw * 0.7, 0), (0, sh * 0.5)], fill=(255, 255, 255, 22))
    screen_img = Image.alpha_composite(screen_img, specular)
    
    body.paste(screen_img, (10, 12), smask)
    canvas.paste(body, (pad, pad), body)
    
    # Rotasi jika angle ditentukan
    if angle != 0:
        canvas = canvas.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
        
    return canvas

def draw_crescent_moon(draw, cx, cy, radius, fill_color=(251, 191, 36)):
    """Menggambar bulan sabit emas khas Jalur Langit."""
    # Lingkaran luar emas
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=fill_color)
    # Lingkaran pemotong dalam
    cut_r = int(radius * 0.85)
    offset_x = int(radius * 0.45)
    draw.ellipse([cx - cut_r + offset_x, cy - cut_r - offset_x // 4, cx + cut_r + offset_x, cy + cut_r - offset_x // 4], fill=C_DARK_BG)

# ==============================================================================
# 1. FOTO PROFIL LYNK.ID (800x800)
# ==============================================================================
def generate_profile_picture():
    print("-> Membuat Foto Profil Lynk.id (foto-profil-lynkid.png)...")
    size = 800
    img = create_luxury_background(size, size, theme="emerald")
    draw = ImageDraw.Draw(img)
    
    cx, cy = size // 2, size // 2
    
    # Lingkaran Emas Konsentris
    draw.ellipse([cx - 330, cy - 330, cx + 330, cy + 330], outline=(212, 175, 55, 120), width=3)
    draw.ellipse([cx - 310, cy - 310, cx + 310, cy + 310], outline=(251, 191, 36, 220), width=5)
    draw.ellipse([cx - 280, cy - 280, cx + 280, cy + 280], fill=(6, 52, 38, 240), outline=(212, 175, 55, 100), width=2)
    
    # Bulan Sabit Emas Besar di Tengah
    moon_r = 110
    draw_crescent_moon(draw, cx, cy - 40, moon_r, fill_color=(251, 191, 36))
    
    # Bintang 8 Sudut
    star_x = cx + 70
    star_y = cy - 110
    star_r = 22
    for a in range(8):
        rad = math.radians(a * 45)
        rad_inner = math.radians(a * 45 + 22.5)
        p1 = (star_x + math.cos(rad) * star_r, star_y + math.sin(rad) * star_r)
        p2 = (star_x + math.cos(rad_inner) * (star_r * 0.4), star_y + math.sin(rad_inner) * (star_r * 0.4))
        draw.line([(star_x, star_y), p1], fill=(251, 230, 160), width=3)
        draw.line([(star_x, star_y), p2], fill=(251, 191, 36), width=2)
        
    # Teks: Jalur Langit
    font_title = get_font(FONT_SERIF_BOLD, 64)
    font_sub = get_font(FONT_SANS_BOLD, 22)
    
    title_text = "Jalur Langit"
    tb = draw.textbbox((0, 0), title_text, font=font_title)
    draw.text((cx - (tb[2] - tb[0]) // 2, cy + 105), title_text, font=font_title, fill=C_CREAM)
    
    # Badge Pill: SELF IMPROVEMENT EDITION
    sub_text = "SELF IMPROVEMENT EDITION"
    stb = draw.textbbox((0, 0), sub_text, font=font_sub)
    sw = stb[2] - stb[0]
    pill_w = sw + 36
    pill_h = 36
    pill_x = cx - pill_w // 2
    pill_y = cy + 190
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=18, fill=(245, 158, 11, 230), outline=(251, 191, 36), width=2)
    draw.text((cx - sw // 2, pill_y + 6), sub_text, font=font_sub, fill=(15, 23, 20))
    
    out_path = os.path.join(OUTPUT_DIR, "foto-profil-lynkid.png")
    img.save(out_path, format="PNG")
    print(f"   [OK] Disimpan: {out_path}")

# ==============================================================================
# 2. BANNER TOKO UTAMA LYNK.ID (1600x900 Landscape)
# ==============================================================================
def generate_store_banner():
    print("-> Membuat Banner Toko Utama Lynk.id (banner-toko-lynkid.jpg)...")
    w, h = 1600, 900
    img = create_luxury_background(w, h, theme="emerald")
    draw = ImageDraw.Draw(img)
    
    # Fonts
    f_badge = get_font(FONT_SANS_BOLD, 20)
    f_title = get_font(FONT_SERIF_BOLD, 74)
    f_tagline = get_font(FONT_SERIF, 32)
    f_feature = get_font(FONT_SANS_BOLD, 24)
    f_cta = get_font(FONT_SANS_BOLD, 22)
    
    # Sisi Kiri: Branding & Value Proposition
    start_x = 90
    
    # 1. Badge Top
    badge_txt = "🌙 APLIKASI WEB PWA MUSLIMAH MODERN"
    draw.rounded_rectangle([start_x, 100, start_x + 470, 146], radius=23, fill=(16, 185, 129, 45), outline=(16, 185, 129, 140), width=2)
    draw.text((start_x + 22, 112), badge_txt, font=f_badge, fill=C_GOLD_LIGHT)
    
    # 2. Judul Utama
    draw.text((start_x, 175), "Jalur Langit", font=f_title, fill=C_CREAM)
    
    # Badge Subtitle Emas
    draw.rounded_rectangle([start_x, 268, start_x + 360, 308], radius=10, fill=(245, 158, 11), outline=(251, 191, 36), width=1)
    draw.text((start_x + 16, 276), "SELF IMPROVEMENT EDITION", font=get_font(FONT_SANS_BOLD, 18), fill=(20, 28, 24))
    
    # 3. Tagline Syahdu
    draw.text((start_x, 340), "Kuatkan Ikhtiar Bumi,\nPasrahkan di Langit.", font=f_tagline, fill=C_GOLD_LIGHT)
    
    # 4. Poin Fitur Utama (Checklist Emas)
    features = [
        "30 Hari Kalender Amalan & Sholat Berbasis GPS",
        "Tasbih Digital 3D dengan Getar Haptik & Audio",
        "Vision Board Impian, Papan Hajat & Sedekah Subuh",
        "Al-Qur'an Journaling & Mutaba'ah Khatam 30 Juz"
    ]
    
    fy = 450
    for feat in features:
        # Checkmark icon circle
        draw.ellipse([start_x, fy + 2, start_x + 28, fy + 30], fill=(245, 158, 11, 230))
        draw.text((start_x + 8, fy + 4), "✓", font=get_font(FONT_SANS_BOLD, 18), fill=(10, 20, 16))
        draw.text((start_x + 42, fy + 3), feat, font=f_feature, fill=C_WHITE)
        fy += 48
        
    # 5. Lifetime Seal Badge (Sekali Bayar)
    draw.rounded_rectangle([start_x, 680, start_x + 620, 755], radius=20, fill=(6, 52, 38, 220), outline=(212, 175, 55, 180), width=2)
    draw.text((start_x + 28, 696), "⚡ SEKALI BAYAR SEUMUR HIDUP (LIFETIME ACCESS)", font=f_cta, fill=C_GOLD_LIGHT)
    draw.text((start_x + 28, 726), "Buka instan di layar HP tanpa download Play Store • Tanpa langganan bulanan", font=get_font(FONT_SANS, 16), fill=C_TEXT_MUTED)
    
    # Sisi Kanan: 3 Smartphone Mockup Berlapis (Layered Mockups)
    # Phone 1 (Kiri/Belakang): Screenshot Amalan (miring -6 derajat)
    phone_amalan = render_phone_mockup(SS_AMALAN, width=280, height=600, angle=-5)
    img.paste(phone_amalan, (830, 130), phone_amalan)
    
    # Phone 3 (Kanan/Belakang): Screenshot Tasbih (miring +5 derajat)
    phone_tasbih = render_phone_mockup(SS_TASBIH, width=280, height=600, angle=5)
    img.paste(phone_tasbih, (1160, 140), phone_tasbih)
    
    # Phone 2 (Tengah/Depan): Screenshot Kalender Amalan (Tegak & Paling Besar)
    phone_kalender = render_phone_mockup(SS_KALENDER, width=320, height=690, angle=0)
    img.paste(phone_kalender, (980, 110), phone_kalender)
    
    out_path = os.path.join(OUTPUT_DIR, "banner-toko-lynkid.jpg")
    img.convert("RGB").save(out_path, format="JPEG", quality=95)
    print(f"   [OK] Disimpan: {out_path}")

# ==============================================================================
# 3. BANNER PAKET 1: STARTER (1080x1080 Square, Rp 49.000)
# ==============================================================================
def generate_paket_starter():
    print("-> Membuat Banner Paket 1: Starter (banner-paket-starter.jpg)...")
    size = 1080
    img = create_luxury_background(size, size, theme="starter")
    draw = ImageDraw.Draw(img)
    
    # Fonts
    f_badge = get_font(FONT_SANS_BOLD, 22)
    f_title = get_font(FONT_SERIF_BOLD, 54)
    f_sub = get_font(FONT_SANS_BOLD, 26)
    f_price = get_font(FONT_SERIF_BOLD, 56)
    f_strike = get_font(FONT_SANS, 26)
    f_feat = get_font(FONT_SANS_BOLD, 23)
    f_pill = get_font(FONT_SANS_BOLD, 20)
    
    # 1. Top Ribbon Badge
    draw.rounded_rectangle([70, 60, 480, 110], radius=25, fill=(16, 185, 129, 50), outline=(16, 185, 129, 180), width=2)
    draw.text((95, 73), "🟢 PILIHAN HEMAT • FONDASI HARIAN", font=f_badge, fill=C_GOLD_LIGHT)
    
    # 2. Judul Paket
    draw.text((70, 140), "PAKET STARTER", font=f_title, fill=C_CREAM)
    draw.text((70, 215), "Fondasi Amalan & Dzikir Harian", font=f_sub, fill=C_GOLD_LIGHT)
    
    # 3. Harga Box
    draw.rounded_rectangle([70, 280, 520, 395], radius=24, fill=(4, 52, 36, 220), outline=(212, 175, 55, 160), width=2)
    draw.text((95, 298), "Rp 49.000", font=f_price, fill=C_GOLD_LIGHT)
    # Coret harga asli
    draw.text((360, 316), "Rp 99.000", font=f_strike, fill=(180, 130, 130))
    draw.line([(355, 332), (480, 332)], fill=(239, 68, 68), width=3)
    draw.text((95, 362), "Sekali bayar selamanya • Akses Instan", font=get_font(FONT_SANS, 17), fill=C_TEXT_MUTED)
    
    # 4. Fitur-fitur
    features = [
        "Peta Kalender Amalan 30 Hari",
        "Waktu Sholat Akurat Berbasis GPS",
        "Alur Sholat Malam & Qiyamul Lail",
        "Tasbih Digital 3D (Haptik & Audio)",
        "Mutaba'ah Evaluasi Harian Otomatis"
    ]
    
    fy = 430
    for feat in features:
        draw.ellipse([70, fy + 2, 98, fy + 30], fill=(16, 185, 129, 220))
        draw.text((78, fy + 4), "✓", font=get_font(FONT_SANS_BOLD, 18), fill=(255, 255, 255))
        draw.text((112, fy + 3), feat, font=f_feat, fill=C_WHITE)
        fy += 54
        
    # 5. Badge Bawah
    draw.rounded_rectangle([70, 730, 520, 785], radius=16, fill=(245, 158, 11), outline=(251, 191, 36), width=2)
    draw.text((95, 744), "⚡ LIFETIME ACCESS • AKSES SELAMANYA", font=f_pill, fill=(20, 28, 22))
    
    # Sisi Kanan: 2 Smartphone Mockup (Screenshot Asli: Kalender & Tasbih)
    phone_tasbih = render_phone_mockup(SS_TASBIH, width=270, height=580, angle=6)
    img.paste(phone_tasbih, (740, 320), phone_tasbih)
    
    phone_kalender = render_phone_mockup(SS_KALENDER, width=320, height=690, angle=-4)
    img.paste(phone_kalender, (550, 160), phone_kalender)
    
    out_path = os.path.join(OUTPUT_DIR, "banner-paket-starter.jpg")
    img.convert("RGB").save(out_path, format="JPEG", quality=95)
    print(f"   [OK] Disimpan: {out_path}")

# ==============================================================================
# 4. BANNER PAKET 2: FULL BUNDLING (1080x1080 Square, Rp 89.000)
# ==============================================================================
def generate_paket_bundling():
    print("-> Membuat Banner Paket 2: Full Bundling (banner-paket-bundling.jpg)...")
    size = 1080
    img = create_luxury_background(size, size, theme="emerald")
    draw = ImageDraw.Draw(img)
    
    # Fonts
    f_badge = get_font(FONT_SANS_BOLD, 22)
    f_title = get_font(FONT_SERIF_BOLD, 52)
    f_sub = get_font(FONT_SANS_BOLD, 26)
    f_price = get_font(FONT_SERIF_BOLD, 56)
    f_strike = get_font(FONT_SANS, 26)
    f_feat = get_font(FONT_SANS_BOLD, 22)
    f_pill = get_font(FONT_SANS_BOLD, 20)
    
    # 1. Top Ribbon Badge BEST SELLER
    draw.rounded_rectangle([70, 60, 480, 110], radius=25, fill=(245, 158, 11, 230), outline=(251, 191, 36), width=2)
    draw.text((95, 73), "🔥 BEST SELLER • PALING LARIS", font=f_badge, fill=(20, 24, 20))
    
    # 2. Judul Paket
    draw.text((70, 140), "PAKET FULL BUNDLING", font=f_title, fill=C_CREAM)
    draw.text((70, 215), "6 Fitur Spiritual Lengkap Muslimah", font=f_sub, fill=C_GOLD_LIGHT)
    
    # 3. Harga Box
    draw.rounded_rectangle([70, 280, 520, 395], radius=24, fill=(6, 52, 38, 230), outline=(251, 191, 36, 200), width=2)
    draw.text((95, 298), "Rp 89.000", font=f_price, fill=C_GOLD_LIGHT)
    # Coret harga asli
    draw.text((360, 316), "Rp 189.000", font=f_strike, fill=(180, 130, 130))
    draw.line([(355, 332), (490, 332)], fill=(239, 68, 68), width=3)
    draw.text((95, 362), "Semua fitur spiritual lengkap • Sekali bayar", font=get_font(FONT_SANS, 17), fill=C_TEXT_MUTED)
    
    # 4. Fitur-fitur
    features = [
        "Semua Fitur Paket Starter (Kalender & Tasbih)",
        "Papan Hajat Spesifik & Afirmasi Langit",
        "Sedekah Subuh Tracker & Akumulasi Infaq",
        "Vision Board Impian (Target Umrah & Karir)",
        "Qur'an Journaling, Tilawah & Gratitude Note"
    ]
    
    fy = 425
    for feat in features:
        draw.ellipse([70, fy + 2, 98, fy + 30], fill=(245, 158, 11, 230))
        draw.text((78, fy + 4), "✓", font=get_font(FONT_SANS_BOLD, 18), fill=(20, 28, 22))
        draw.text((112, fy + 3), feat, font=f_feat, fill=C_WHITE)
        fy += 52
        
    # 5. Badge Bawah
    draw.rounded_rectangle([70, 725, 520, 780], radius=16, fill=(16, 185, 129, 45), outline=(16, 185, 129, 160), width=2)
    draw.text((95, 739), "✨ PILIHAN TERBAIK & PALING DIMINATI", font=f_pill, fill=C_GOLD_LIGHT)
    
    # Sisi Kanan: 2 Smartphone Mockup (Screenshot Asli: Vision Board & Quran Gratitude)
    phone_quran = render_phone_mockup(SS_QURAN, width=270, height=580, angle=6)
    img.paste(phone_quran, (740, 310), phone_quran)
    
    phone_vision = render_phone_mockup(SS_VISION, width=320, height=690, angle=-4)
    img.paste(phone_vision, (550, 150), phone_vision)
    
    out_path = os.path.join(OUTPUT_DIR, "banner-paket-bundling.jpg")
    img.convert("RGB").save(out_path, format="JPEG", quality=95)
    print(f"   [OK] Disimpan: {out_path}")

# ==============================================================================
# 5. BANNER PAKET 3: VIP ULTIMATE + LAB (1080x1080 Square, Rp 149.000)
# ==============================================================================
def generate_paket_vip():
    print("-> Membuat Banner Paket 3: VIP Ultimate + Lab (banner-paket-vip.jpg)...")
    size = 1080
    img = create_luxury_background(size, size, theme="vip")
    draw = ImageDraw.Draw(img)
    
    # Fonts
    f_badge = get_font(FONT_SANS_BOLD, 22)
    f_title = get_font(FONT_SERIF_BOLD, 46)
    f_sub = get_font(FONT_SANS_BOLD, 25)
    f_price = get_font(FONT_SERIF_BOLD, 56)
    f_strike = get_font(FONT_SANS, 26)
    f_feat = get_font(FONT_SANS_BOLD, 21)
    f_pill = get_font(FONT_SANS_BOLD, 20)
    
    # 1. Top Ribbon Badge VIP
    draw.rounded_rectangle([70, 60, 520, 110], radius=25, fill=(126, 34, 206, 230), outline=(216, 180, 254), width=2)
    draw.text((95, 73), "👑 ALL-IN-ONE VIP • TIER TERTINGGI", font=f_badge, fill=(255, 255, 255))
    
    # 2. Judul Paket
    draw.text((70, 140), "PAKET VIP ULTIMATE + LAB", font=f_title, fill=C_CREAM)
    draw.text((70, 215), "Akses Paling Lengkap Seumur Hidup", font=f_sub, fill=C_GOLD_LIGHT)
    
    # 3. Harga Box
    draw.rounded_rectangle([70, 275, 520, 390], radius=24, fill=(45, 16, 75, 220), outline=(216, 180, 254, 180), width=2)
    draw.text((95, 293), "Rp 149.000", font=f_price, fill=C_GOLD_LIGHT)
    # Coret harga asli
    draw.text((375, 311), "Rp 299.000", font=f_strike, fill=(200, 150, 180))
    draw.line([(370, 327), (505, 327)], fill=(239, 68, 68), width=3)
    draw.text((95, 357), "Seluruh 7 Tab + Fitur Lab Masa Depan", font=get_font(FONT_SANS, 17), fill=(216, 180, 254))
    
    # 4. Fitur-fitur
    features = [
        "Seluruh 7 Tab Lengkap Tanpa Batas",
        "Self-Care & Glow Up Habits (Skincare/Air)",
        "Kapsul Waktu: Surat Harapan Masa Depan",
        "Akses Seluruh Update Fitur Baru di Roadmap/Lab",
        "Prioritas Fitur Eksklusif Mendatang Seumur Hidup"
    ]
    
    fy = 420
    for feat in features:
        draw.ellipse([70, fy + 2, 98, fy + 30], fill=(168, 85, 247, 230))
        draw.text((78, fy + 4), "✓", font=get_font(FONT_SANS_BOLD, 18), fill=(255, 255, 255))
        draw.text((112, fy + 3), feat, font=f_feat, fill=C_WHITE)
        fy += 50
        
    # 5. Badge Bawah
    draw.rounded_rectangle([70, 715, 520, 770], radius=16, fill=(245, 158, 11), outline=(251, 191, 36), width=2)
    draw.text((95, 729), "💎 SUPER VIP LIFETIME ACCESS & UPDATES", font=f_pill, fill=(20, 28, 22))
    
    # Sisi Kanan: 3 Smartphone Mockup (Screenshot Asli: Glow Up Self-Care, Vision Board & Tasbih)
    phone_tasbih = render_phone_mockup(SS_TASBIH, width=250, height=540, angle=-10)
    img.paste(phone_tasbih, (520, 270), phone_tasbih)
    
    phone_vision = render_phone_mockup(SS_VISION, width=260, height=560, angle=8)
    img.paste(phone_vision, (760, 280), phone_vision)
    
    phone_glowup = render_phone_mockup(SS_GLOWUP, width=320, height=690, angle=0)
    img.paste(phone_glowup, (620, 140), phone_glowup)
    
    out_path = os.path.join(OUTPUT_DIR, "banner-paket-vip.jpg")
    img.convert("RGB").save(out_path, format="JPEG", quality=95)
    print(f"   [OK] Disimpan: {out_path}")

def main():
    print("=== MEMULAI GENERASI ASET LYNK.ID BERDASARKAN SCREENSHOT ASLI ===")
    generate_profile_picture()
    generate_store_banner()
    generate_paket_starter()
    generate_paket_bundling()
    generate_paket_vip()
    print("=== SEMUA ASET SELESAI DIBUAT 100%! ===")

if __name__ == "__main__":
    main()
