# 🛠 Admin Panel — Test Loyihasi

## 📋 Vazifa haqida

Ushbu loyiha kichik admin panel ko‘rinishida bo‘lib, autentifikatsiya, API orqali ma’lumotlarni olish, tablitsa ko‘rinishida sahifalash va mahsulot nomi bo‘yicha qidirish funksiyalarini o‘z ichiga oladi. Loyiha **TypeScript** asosida ishlab chiqilishi kerak. **Qo‘shimcha paketlardan foydalanish mumkin**, lekin minimal darajada. UI/UX tushunarli va toza bo‘lishi kerak.

---

## 🚀 Texnologiyalar

- React + TypeScript
- Axios (API bilan ishlash uchun)
- React Router (sahifalar orasida navigatsiya)
- Any table UI library (masalan, `react-table` yoki `ant-design table`)
- LocalStorage (token saqlash uchun)

---

## 📁 Loyiha tarkibi

- `/login` — Autentifikatsiya sahifasi
- `/products` — Mahsulotlar sahifasi (token bilan himoyalangan)
- `/search` — Mahsulot nomi bo‘yicha qidiruv sahifasi (client-side)

---

## 🔐 Autentifikatsiya

### API Endpoint

```
POST https://toko.ox-sys.com/security/auth_check
```

### So‘rov yuborish (Body)

- `_username`: `user_task`
- `_password`: `user_task`
- `_subdomain`: `toko`

**Header:**

```bash
Content-Type: application/x-www-form-urlencoded
Accept: application/json
```

### Misol (curl)

```bash
curl -X POST \
  https://toko.ox-sys.com/security/auth_check \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Accept: application/json' \
  -d '_username=user_task&_password=user_task&_subdomain=toko'
```

### Natija:

```json
{
  "token": "JWT_TOKEN",
  "lifetime": 1036800
}
```

Token LocalStorage yoki Context API orqali saqlanadi va keyingi so‘rovlarda ishlatiladi.

---

## 📦 Mahsulotlar sahifasi (`/products`)

### Shartlar:

- Faqat token mavjud bo‘lsa ochiladi
- Tablitsa ko‘rinishida
- Sahifalash (pagination) bo‘lishi kerak

### API Endpoint

```
GET https://toko.ox-sys.com/variations
```

### Parametrlar:

- `size`: Sahifadagi elementlar soni
- `page`: Sahifa raqami

### Header:

```bash
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
Accept: application/json
```

---

## 🔍 Qidiruv sahifasi (`/search`)

### Shartlar:

- Mahsulotlar bir marta API orqali olinadi
- Qidiruv `client-side` amalga oshiriladi
- Qidiruv natijalari tartiblanadi (sort)

### Tartiblash algoritmi:

Misol:

#### Mahsulotlar:

- Olma
- Nok
- Banan
- Ananas
- Olcha
- Anor

#### So‘rov: `an`

Natija:

1. Ananas
2. Anor
3. Banan

#### So‘rov: `o`

Natija:

1. Olcha
2. Olma
3. Nok
4. Anor

Tartiblash: qidiruv so‘zi boshlanishiga qarab, keyin esa boshqa joyda chiqishiga qarab saralanadi.

---

## ⚠️ Eslatma

- Kuchli va katta loyiha qilish shart emas — **muhimi: funksional ishlashi**
- Dizayn oddiy, ammo tartibli va tushunarli bo‘lishi kerak
- Qo‘shimcha kutubxonalarni keragicha ishlating (keragidan ortiq emas)
- Kod **toza**, **tuzilgan** va **TypeScript bilan** yozilgan bo‘lishi kerak

---

## ✅ To‘liq bajarilishi kerak bo‘lgan funksiyalar

| Funksiya                       | Holati |
| ------------------------------ | ------ |
| API orqali login qilish        | ✅     |
| Login sahifasi (form)          | ✅     |
| Tokenni saqlash va ishlatish   | ✅     |
| Mahsulotlar ro‘yxatini olish   | ✅     |
| Sahifalash (pagination)        | ✅     |
| Qidiruv (client-side)          | ✅     |
| Natijalarni tartiblash         | ✅     |
| Faqat login qilganlar ko‘rishi | ✅     |

---

## 👨‍💻 Muallif - Asadbek Rakhimov

Ushbu loyiha test topshirig‘i uchun ishlab chiqilgan.
