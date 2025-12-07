# Libreng Plant Identification API Setup (Tagalog)

## Problema: Hindi makapag-create ng account sa PlantNet?

**Solusyon**: Gamitin ang **Plant.id API** - mas madali at libre!

## 🎯 Plant.id API - Pinakamadaling Option

### Bakit Plant.id?
- ✅ **Libre**: 100 requests kada buwan
- ✅ **Madaling signup**: Walang credit card kailangan
- ✅ **Mabilis**: Makakakuha ka ng API key agad
- ✅ **Maganda ang accuracy**: Parehong maganda sa PlantNet

### Paano Mag-setup:

#### Step 1: Kumuha ng API Key
1. Pumunta sa: https://web.plant.id/plant-identification-api
2. Click "Sign Up" o "Get Started"
3. Gumawa ng account (libre, walang bayad)
4. Kopyahin ang API key mo mula sa dashboard

#### Step 2: I-configure sa App
1. Gumawa ng `.env` file sa project root (kung wala pa)
2. Idagdag ang API key:

```env
VITE_PLANTID_API_KEY=your_api_key_here
VITE_PLANT_API_PROVIDER=plantid
```

#### Step 3: I-restart ang Dev Server
```bash
npm run dev
```

#### Step 4: Test!
- Pumunta sa Plant Identifier
- Kumuha ng picture ng halaman
- Dapat gumana na!

## 📋 Iba pang Libreng Options

### Option 1: Plant.id (RECOMMENDED)
- **Libre**: 100 requests/month
- **Signup**: https://web.plant.id/plant-identification-api
- **Difficulty**: ⭐ Madali

### Option 2: PlantNet (Kung makakapag-signup ka)
- **Libre**: 500 requests/day
- **Signup**: https://my.plantnet.org/
- **Difficulty**: ⭐⭐⭐ Mahirap (may signup issues)

### Option 3: iNaturalist (Walang API key kailangan)
- **Libre**: Unlimited*
- **Signup**: Hindi kailangan
- **Status**: Kailangan pa i-implement

## 🔧 Troubleshooting

### "API key not configured" error
- Tiyakin na nasa project root ang `.env` file
- I-restart ang dev server pagkatapos magdagdag ng API key
- Tiyakin na tama ang variable name

### "Rate limit exceeded"
- Plant.id: 100 requests/month (libre)
- PlantNet: 500 requests/day (libre)
- Pwede mag-upgrade sa paid tier kung kailangan

### Hindi gumagana ang API
- Check ang browser console para sa errors
- Tiyakin na tama ang API key
- Subukan i-restart ang dev server

## 💡 Tips

1. **Plant.id ang pinakamadali** - subukan mo muna ito
2. **100 requests/month** ay sapat na para sa testing at personal use
3. **Pwede mag-upgrade** kung kailangan ng mas maraming requests
4. **Automatic fallback** - kung hindi gumana ang isang API, susubukan ang iba

## 📞 Need Help?

- Check ang `docs/PLANT_IDENTIFIER_SETUP.md` para sa detailed English documentation
- Tingnan ang `src/lib/plant-identifier.ts` para sa implementation details

---

**Good luck sa iyong app! 🌱**

