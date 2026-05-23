# Cadance Flow - Project Page Container Explanations

## TÜRKÇE (Turkish) 🇹🇷

### 1. **projectMainContainer**

Ana konteyner olarak sayfanın tüm içeriğini tutar. Flex kullanarak içeriği dikey olarak düzenler. `position: relative` özelliği sayesinde içindeki `projectHowItWorksBtn` butonu mutlak konumlandırılabilir.

### 2. **projectDetailsContainer**

Proje bilgilerinin sergilendiği alan. Proje adı, gizlilik durumu, takip kodu ve tarihler bu konteyner içinde gösterilir. Üst kısımda yer alır ve proje hakkında temel bilgileri barındırır.

**İçeriği:**

- Proje adı (projectName)
- Erişim kontrol paneli (accessControlPanel)
- Gizlilik bölümü (privacySection)
- Takip kodu bölümü (trackingSection)
- Proje başlangıç tarihi
- Tahmini teslim tarihi

### 3. **accessControlPanel**

Proje gizliliğini yönetmek ve takip kodunu görmek için kullanılan kontrol paneli.

**Alt Bileşenleri:**

- **privacySection**: Açık/Gizli durumunu gösteren ve değiştiren alan
    - statusIndicator: Mevcut durum göstergesi (AÇIK/GİZLİ)
    - toggleSwitch: Açık/Gizli değiştirmek için switch butonu
- **trackingSection**: Proje takip kodunu gösteren alan
    - codeWrapper: Kod bilgisini içeren konteyner
    - codeLabel: "TAKİP KODU:" yazısı
    - codeValue: Gerçek takip numarası
    - copyIconButton: Kodu panoya kopyalamak için buton

### 4. **carouselWrapper**

Projenin aşamalarını yatay kaydırmalı şekilde gösteren konteyner. Proje ilerleme sürecini görsel olarak takip etmek için kullanılır.

**İçeriği:**

- Sol ok butonu (arrowBtn) - sola kaydırma
- Aşamalar listesi (phasesViewport)
- Sağ ok butonu (arrowBtn) - sağa kaydırma

**Alt Bileşenleri:**

- **phaseItem**: Her aşamayı temsil eden kart
    - Tamamlanmış aşamalar: Yeşil check işareti gösterilir
    - Mevcut aşama (activePhase): Mavi vurgulu gösterilir
    - Gelecek aşamalar: Normal stil

- **emptyPhasesContainer**: Aşama yoksa gösterilen yer tutucu
    - emptyPhasesIcon: Pencil-ruler ikonu
    - emptyPhasesText: "Süreciniz hazırlanıyor" mesajı
    - ghostTimeline: Arka planda görünen zayıf çizgi

### 5. **mediaContainer**

Render görselleri, tasarım dosyaları ve medya içeriğini gösterir. Sol tarafta seçili görseli, sağ tarafta yorum ve dosya işlemlerini içerir.

**Alt Bileşenleri:**

- **leftContainer**: Seçili görseli gösteren alan
    - assetName: Dosya adı
    - imageDisplayContainer: Görsel gösterim alanı
    - fullscreenIcon: Tam ekran açma butonu

- **rightContainer**: Yorum ve araç işlemleri
    - toolsContainer: İndirme, paylaşma vb. araçlar
    - imageGallery: Tüm resimlerin grid gösterimi
    - Yorum bölümü: Proje üzerindeki notlar

**Araçlar (toolsContainer):**

- İndir (Download)
- Paylaş (Share)
- Yorum Yap (Comment)
- Favoriye Ekle (Add to Favorites)

### 6. **projectHowItWorksBtn**

Sağ alt köşede konumlandırılmış "Nasıl Çalışır?" butonu. Kullanıcılara proje sayfasının nasıl çalıştığını gösteren bir tur sunar.

**Özellikleri:**

- Mavi accent renk şeması
- Hover efekti ile yukarı hareket
- Yardım ikonu + metin içerir
- Z-index: 100 (diğer öğelerin üstünde)

---

## ENGLISH (English) 🇬🇧

### 1. **projectMainContainer**

The main container that holds all page content. It uses Flexbox to arrange content vertically. The `position: relative` property allows the `projectHowItWorksBtn` button to be positioned absolutely within it.

### 2. **projectDetailsContainer**

The section where project information is displayed. Project name, privacy status, tracking code, and dates are shown in this container. Located at the top and contains basic project information.

**Contents:**

- Project name (projectName)
- Access control panel (accessControlPanel)
- Privacy section (privacySection)
- Tracking code section (trackingSection)
- Project start date
- Estimated submission date

### 3. **accessControlPanel**

Control panel used to manage project privacy and view the tracking code.

**Sub-components:**

- **privacySection**: Section showing and changing public/private status
    - statusIndicator: Current status indicator (LIVE/PRIVATE)
    - toggleSwitch: Switch button to toggle public/private
- **trackingSection**: Section displaying the project tracking code
    - codeWrapper: Container with code information
    - codeLabel: "TRACKING CODE:" text
    - codeValue: Actual tracking number
    - copyIconButton: Button to copy code to clipboard

### 4. **carouselWrapper**

Container that displays project phases in a horizontal scrollable manner. Used to visually track the project progress process.

**Contents:**

- Left arrow button (arrowBtn) - scroll left
- Phases list (phasesViewport)
- Right arrow button (arrowBtn) - scroll right

**Sub-components:**

- **phaseItem**: Card representing each phase
    - Completed phases: Shows green check mark
    - Current phase (activePhase): Displayed with blue highlight
    - Future phases: Normal styling

- **emptyPhasesContainer**: Placeholder shown when no phases exist
    - emptyPhasesIcon: Pencil-ruler icon
    - emptyPhasesText: "Roadmap is being prepared" message
    - ghostTimeline: Faint line visible in background

### 5. **mediaContainer**

Displays render images, design files, and media content. Left side shows selected image, right side contains comments and file operations.

**Sub-components:**

- **leftContainer**: Area displaying selected image
    - assetName: File name
    - imageDisplayContainer: Image display area
    - fullscreenIcon: Full-screen button

- **rightContainer**: Comments and tool operations
    - toolsContainer: Tools like download, share, etc.
    - imageGallery: Grid display of all images
    - Comment section: Notes on the project

**Tools (toolsContainer):**

- Download
- Share
- Comment
- Add to Favorites

### 6. **projectHowItWorksBtn**

"How it Works?" button positioned at the bottom-right corner. Provides users with a tour showing how the project page functions.

**Features:**

- Blue accent color scheme
- Hover effect with upward movement
- Contains help icon + text
- Z-index: 100 (above other elements)

---

## Summary / Özet

Bu dokümanda, Cadance Flow proje sayfasının tüm ana konteynerları ve bileşenleri açıklanmıştır. Her konteyner belirli bir işlev görür ve projelerinizi etkili bir şekilde yönetmenize yardımcı olur.

This document explains all major containers and components of the Cadance Flow project page. Each container serves a specific function and helps you manage your projects effectively.
