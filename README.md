# ece.hormozgan.github.io

سایت مستندات دانشکده مهندسی کامپیوتر دانشگاه هرمزگان.

## افزودن محتوای یک درس

هر درس یک پوشه در `courses/<نام‌درس>/` دارد که شامل `index.html` و `data.json` است. برای افزودن محتوا فقط `data.json` را ویرایش کنید:

```json
{
  "videos": [{ "title_fa": "جلسه ۱", "title_en": "Session 1", "src": "videos/session1.mp4" }],
  "notes": [{ "title_fa": "جزوه فصل ۱", "title_en": "Chapter 1 notes", "href": "notes/ch1.pdf" }],
  "exercises": [{ "title_fa": "تمرین ۱", "title_en": "Exercise 1", "href": "exercises/hw1.pdf" }],
  "code": [{ "title_fa": "کد جلسه ۱", "title_en": "Session 1 code", "href": "https://github.com/..." }]
}
```

`src` و `href` می‌توانند مسیر نسبی به فایلی در همان پوشه، یا لینک کامل (مثلاً لینک raw فایل mp4 آپلودشده در گیت‌هاب) باشند.

## افزودن یک درس جدید

1. پوشه‌ای مثل `courses/NEW/` بسازید و `index.html` یکی از دروس موجود را در آن کپی کنید (فقط عنوان‌ها را عوض کنید).
2. یک `data.json` خالی مثل بقیه دروس در همان پوشه بسازید.
3. یک رکورد جدید به `courses/index.json` اضافه کنید.
