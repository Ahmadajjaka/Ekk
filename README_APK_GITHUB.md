# دليل تحويل «محاسب خردوات المامو» إلى تطبيق Android APK عبر GitHub وتشغيل Firebase بدون أخطاء SHA

تم تجهيز المشروع بالكامل باستخدام **Capacitor Android** وإعدادات **GitHub Actions** لتوليد ملف **`.apk`** موقّع وجاهز للتثبيت مباشرة على هواتف أندرويد، مع معالجة كاملة لمشكلة **بصمات Firebase (SHA-1 / SHA-256 / `DEVELOPER_ERROR`)**.

---

## 1. كيف يبني GitHub ملف APK تلقائياً؟

عند رفع المشروع إلى مستودع GitHub (`main` أو `master`) أو تشغيل Workflow يدوياً:
1. افتح مستودعك على GitHub ثم انتقل إلى تبويب **Actions**.
2. اختر الـ Workflow المسمّى **`Build Android APK (خردوات المامو)`**.
3. يمكنك تشغيله فوراً بالضغط على **Run workflow**.
4. بعد انتهاء التنفيذ (حوالي دقيقتين)، ستجد في أسفل الصفحة قسم **Artifacts** وبداخله ملف:
   - **`almamo-hardware-store-apk`** (بداخله ملف `almamo-hardware-store.apk` الجاهز للتثبيت على الهاتف).
5. وإذا قمت بإنشاء Tag يبدأ بحرف `v` (مثل `v1.0.0`)، فسيقوم GitHub تلقائياً بنشر ملف APK داخل **GitHub Releases**.

---

## 2. لماذا يعمل Firebase بدون أخطاء SHA-1 / SHA-256 بعد التثبيت؟

عادةً في تطبيقات أندرويد تظهر أخطاء مثل:
- `ApiException: 10` أو `DEVELOPER_ERROR`
- `auth/unauthorized-domain`
- فشل مزامنة Firestore أو حظر نافذة تسجيل الدخول

تم حل كل هذه المشاكل جذرياً في البنية الحالية عبر:
1. **تشغيل التطبيق داخل Capacitor على النطاق الآمن `https://localhost`**:
   - النطاق `localhost` مفعّل ومصرح به افتراضياً في **Firebase Authentication** بدون الحاجة لتسجيل بصمة SHA-1 في كل مرة.
   - يعمل **Firestore** وقاعدة البيانات المحلية (**IndexedDB**) وكاميرا مسح الباركود والتقاط لقطات الأمان (`getUserMedia`) داخل سياق HTTPS آمن بالكامل.
2. **تفعيل ملفات تعريف الارتباط للطرف الثالث (`CookieManager`)** داخل `MainActivity.java` وطلب صلاحيات الكاميرا والتخزين تلقائياً عند التشغيل.
3. **الانتقال الذكي عند تسجيل الدخول بـ Google**:
   - يحاول أولاً عبر النافذة المنبثقة ثم ينتقل تلقائياً إلى `signInWithRedirect` عند اللزوم، مع بقاء خيار الدخول السريع بكلمة المرور أو رمز PIN متاحاً دائماً.
4. **ثبات بصمة التوقيع عبر `Keystore` مخزّن مؤقتاً (`actions/cache`)**:
   - يحتفظ GitHub بنفس شهادة التوقيع عبر كل البناءات بدلاً من توليد بصمة عشوائية في كل مرة.
   - يطبع الـ Workflow بصمتي **SHA-1** و **SHA-256** واضحتين داخل **Build Summary**، ويحقنها تلقائياً داخل `public/.well-known/assetlinks.json`.

---

## 3. متغيرات وأسرار اختيارية (GitHub Secrets & Variables)

المشروع يبني APK فوراً **بدون أي إعداد إضافي**، لكن يُنصح اختيارياً بما يلي:
- **`VITE_API_BASE_URL`** (في GitHub → Settings → Secrets and variables → Actions → **Variables**):
  - ضع رابط خادم Render الخاص بك (مثلاً `https://almamo-accounting.onrender.com`) حتى يعمل المساعد الذكي `/api/ai/chat` من داخل ملف APK مباشرة.
  - يمكنك أيضاً تعديله أو إدخاله لاحقاً من داخل التطبيق في: **الإعدادات ← تجهيز تطبيق الأندرويد (APK) وبصمة Firebase SHA**.
- **`ANDROID_KEYSTORE_BASE64` / `ANDROID_KEYSTORE_PASSWORD` / `ANDROID_KEY_ALIAS` / `ANDROID_KEY_PASSWORD`** (في **Secrets**):
  - اختياري فقط إذا كان لديك ملف توقيع `.jks` خاص بك وتريد استخدامه بدلاً من التوقيع التلقائي.

---

## 4. استخراج وفحص SHA-256 من داخل التطبيق

من صفحة **الإعدادات** داخل التطبيق يمكنك:
- نسخ معرّف الحزمة: `com.almamo.hardware`
- نسخ معرّف مشروع Firebase ونطاق المصادقة
- لصق بصمة **SHA-256** المطبوعة في GitHub لتوليد ونسخ ملف **`assetlinks.json`** الجاهز أو إضافتها في متغير البيئة **`ANDROID_SHA256_FINGERPRINTS`** على Render.
