# Apex Advisory Hub

مشروع: المستشار العزي للمشروع — موقع مؤسسي احترافي + CMS + لوحة تحكم مرنة وقابلة لإعادة الاستخدام



1. التعليمات الأساسية



أريد منك بناء مشروع ويب احترافي كامل وليس مجرد Landing Page.



اسم المشروع الحالي:

المستشار العزي للمشروع



طبيعة النشاط:

استشارات الجودة والتطوير المؤسسي



المشروع الحالي هو أول نسخة مخصصة لهذا النشاط، لكن البنية البرمجية والمعمارية يجب أن تكون قابلة لإعادة الاستخدام لاحقًا لبناء مواقع احترافية لعملاء آخرين.



مهم جدًا:



- جودة النسخة الحالية يجب أن تكون بمستوى مشروع مخصص بالكامل.

- لا تجعل التصميم يبدو كقالب جاهز.

- لا تضع المحتوى الأساسي Hard-coded داخل مكونات الواجهة.

- يجب أن يكون المحتوى Dynamic ويتم تحميله من قاعدة البيانات/CMS.

- أي معلومة يمكن أن تتغير مستقبلًا يجب أن تكون قابلة للتعديل من لوحة التحكم.

- لا تفترض أن المحتوى الحالي نهائي.

- لا تخترع شهادات أو أرقام عملاء أو إنجازات أو أسماء جهات لم يتم تزويدك بها.

- استخدم بيانات تجريبية واقعية فقط عندما تكون ضرورية، وميزها بوضوح داخل لوحة التحكم على أنها Demo Content.

- التصميم النهائي يجب أن يكون عربي RTL أولًا، احترافيًا، فاخرًا، سريعًا، ومتجاوبًا بالكامل.



---



2. الهدف من المشروع



نريد تحويل النشاط من مجرد عرض خدمات عبر كتالوج/واتساب إلى منصة رقمية احترافية تساعد على:



1. تعريف الزائر بالنشاط.

2. عرض الخدمات بطريقة احترافية.

3. شرح كل خدمة بالتفصيل.

4. بناء الثقة.

5. تحويل الزائر إلى عميل محتمل.

6. استقبال طلبات الاستشارة.

7. التواصل عبر WhatsApp والهاتف والبريد.

8. نشر المقالات والمحتوى المعرفي.

9. عرض المشاريع والإنجازات الحقيقية عند إضافتها.

10. إدارة الموقع بالكامل من لوحة تحكم احترافية بدون الحاجة لتعديل الكود.



---



3. التقنية والمعمارية



استخدم Stack حديثًا وموثوقًا ومتوافقًا مع بيئة Lovable.



يفضل استخدام:



- React

- TypeScript

- Vite

- Tailwind CSS

- shadcn/ui أو مكونات UI احترافية مشابهة

- Supabase

- PostgreSQL

- Supabase Authentication

- Supabase Storage

- Row Level Security

- React Query أو آلية مناسبة لإدارة البيانات

- React Router



استخدم بنية Components نظيفة وقابلة لإعادة الاستخدام.



لا تكرر الكود بلا داعٍ.



افصل بين:



- UI

- Components

- Pages

- Services

- Database access

- Authentication

- CMS

- Types

- Utilities



---



4. قاعدة البيانات



أنشئ Database حقيقية في Supabase.



لا تستخدم LocalStorage كمصدر البيانات الرئيسي.



أنشئ جداول مناسبة تشمل على الأقل:



site_settings



الإعدادات العامة للموقع.



brand_settings



- اسم العلامة

- الشعار

- favicon

- الألوان

- الخطوط

- إعدادات التصميم

- إعدادات الأزرار

- border radius

- إعدادات المظهر



navigation_items



إدارة عناصر القائمة وترتيبها.



pages



- id

- title

- slug

- status

- meta_title

- meta_description

- og_image

- created_at

- updated_at



page_sections



يجب أن تكون مرنة.



كل Section يحتوي على:



- page_id

- section_type

- title

- subtitle

- content

- settings

- sort_order

- is_visible

- created_at

- updated_at



استخدم JSONB عند الحاجة لإعدادات Sections المختلفة.



services



- title

- slug

- short_description

- full_description

- featured_image

- icon

- category_id

- features

- process_steps

- faq

- cta_title

- cta_description

- is_featured

- is_visible

- sort_order

- meta_title

- meta_description

- created_at

- updated_at



service_categories



projects



- title

- slug

- description

- image

- category

- client_name عند توفره

- completion_date عند توفرها

- is_featured

- is_visible

- sort_order



blog_categories



blog_posts



- title

- slug

- excerpt

- content

- featured_image

- category_id

- author

- status

- published_at

- meta_title

- meta_description



testimonials



لا تظهر أي شهادة على الموقع إلا بعد اعتمادها من لوحة التحكم.



faqs



consultation_requests



- full_name

- phone

- email

- organization

- organization_type

- requested_service

- message

- status

- notes

- created_at

- updated_at



الحالات:



- new

- viewed

- contacted

- qualified

- converted

- closed



media_library



users / profiles



roles



permissions



audit_logs



site_versions



إذا كانت هناك حاجة إلى جداول إضافية لبناء النظام بطريقة صحيحة، أضفها.



---



5. نظام المستخدمين والصلاحيات



استخدم Supabase Authentication.



لا تضع كلمات مرور حقيقية داخل الكود.



أنشئ نظام Roles وPermissions.



الأدوار الأساسية:



Super Admin



صلاحية كاملة.



Admin



إدارة الموقع والمحتوى والطلبات.



Content Manager



إدارة:



- الصفحات

- الخدمات

- المشاريع

- المقالات

- الصور

- الأسئلة الشائعة

- الشهادات



Editor



تعديل المحتوى المسموح به فقط.



Viewer



قراءة البيانات والإحصائيات دون تعديل.



يجب أن تكون الصلاحيات حقيقية ومحمية على مستوى Backend/Database وليس فقط إخفاء الأزرار من الواجهة.



استخدم Row Level Security بشكل صحيح.



---



6. الموقع العام



أنشئ موقعًا مؤسسيًا Premium.



اللغة الأساسية:

العربية RTL



مع إمكانية تجهيز البنية لدعم الإنجليزية مستقبلًا.



التصميم:



- حديث

- مؤسسي

- فاخر

- هادئ

- موثوق

- غير مزدحم

- مساحات بيضاء ممتازة

- Typography قوي

- صور احترافية

- Micro-interactions خفيفة

- Animations ناعمة وليست مبالغًا فيها



لا تجعل الموقع يبدو كـ AI template.



---



7. الهوية البصرية



استلهم من المواد المرجعية المرفقة هوية النشاط الحالية، لكن لا تنسخ تصميم كتالوج واتساب حرفيًا.



استخدم اتجاهًا بصريًا مؤسسيًا أكثر احترافية.



الألوان الأساسية المقترحة:



- Navy / Dark Blue

- Corporate Blue

- White

- Neutral Gray

- Accent ذهبي أو لون ثانوي محدود عند الحاجة



لكن يجب أن تكون جميع الألوان قابلة للتعديل من لوحة التحكم.



لا تجعل اللون ثابتًا داخل Components.



استخدم Design Tokens / CSS Variables.



مثال منطقي:



--primary

--secondary

--background

--foreground

--muted

--accent

--border

--radius



وبذلك يستطيع المسؤول تغيير الهوية من لوحة التحكم.



---



8. الصفحة الرئيسية



اجعل الصفحة الرئيسية Dynamic بالكامل.



الترتيب الافتراضي المقترح:



Section 1 — Hero



اسم النشاط:



المستشار العزي للمشروع



العنوان الرئيسي المقترح:



نحو مؤسسات أكثر كفاءة وتميزًا واستدامة



وصف مختصر:



نقدم حلولًا استشارية متخصصة في الجودة والتطوير المؤسسي، تساعد المنشآت والجمعيات على بناء أنظمة أكثر كفاءة وتحقيق أهدافها بوضوح واستدامة.



الأزرار:



- اطلب استشارة

- استكشف خدماتنا



يمكن تعديل كل هذه العناصر من CMS.



Hero يجب أن يدعم:



- عنوان

- وصف

- صورة

- فيديو اختياري

- خلفية

- CTA buttons

- alignment

- overlay

- إظهار/إخفاء



---



9. Section — نبذة عنا



اعرض نبذة احترافية عن النشاط.



لا تخترع تاريخًا أو أرقامًا أو شهادات.



المحتوى يجب أن يكون Editable.



أضف:



- عنوان

- وصف

- صورة

- زر

- إحصائيات اختيارية



---



10. Section — الخدمات



اعرض الخدمات في Cards احترافية.



الخدمات الأولية المستخرجة من المواد المرجعية تشمل:



- إعداد التقارير الختامية

- تأهيل الجمعيات للمشاركة في جوائز التميز المؤسسي

- تحليل الاحتياج التدريبي

- دراسات الجدوى الاقتصادية

- الرفع على منصة إرب

- ابتكار المشاريع والمبادرات النوعية

- التميز المؤسسي

- بناء المبادرات والمشاريع

- بناء الخطط التدريبية

- البناء المؤسسي الشامل

- بناء الأدلة الإجرائية

- حوكمة الجمعيات الأهلية

- بناء السياسات

- حوكمة الأندية الرياضية

- بناء الخطط الاستراتيجية والتشغيلية

- بناء اللوائح التنظيمية

- بناء الخطط التسويقية

- بناء أنظمة الجودة ISO 9001



هذه القائمة يجب أن تكون Seed Data قابلة للتعديل والحذف والإضافة.



قسم الخدمات يدعم:



- Featured Services

- تصنيفات

- فلترة

- بحث

- ترتيب

- إظهار/إخفاء



---



11. صفحة الخدمات



أنشئ:



/services



تحتوي على:



- Header

- وصف

- Search

- Categories

- Service Cards

- CTA



كل خدمة تفتح صفحة منفصلة.



---



12. صفحة تفاصيل الخدمة



المسار:



/services/:slug



صمم صفحة خدمة احترافية تشمل:



- Breadcrumb

- عنوان الخدمة

- وصف مختصر

- صورة رئيسية

- وصف تفصيلي

- ماذا نقدم؟

- مميزات الخدمة

- خطوات التنفيذ

- النتائج المتوقعة

- FAQ

- خدمات ذات صلة

- CTA



كل جزء قابل للتعديل من CMS.



---



13. القطاعات المستهدفة



أنشئ Section وصفحة:



/sectors



الفئات الأولية:



- الجمعيات الأهلية

- الأندية الرياضية

- المؤسسات والمنشآت

- المشاريع والمبادرات

- الجهات التي تحتاج إلى تطوير مؤسسي



لا تضف ادعاءات أو تخصصات غير مؤكدة.



كل Sector Dynamic.



---



14. لماذا نحن؟



أنشئ قسمًا احترافيًا.



عناصر مبدئية:



فهم الاحتياج



نبدأ بفهم واقع الجهة واحتياجاتها.



حلول مخصصة



نقدم حلولًا تتناسب مع طبيعة الجهة وأهدافها.



منهجية واضحة



من التشخيص والتحليل إلى التخطيط والتنفيذ والتقييم.



تركيز على الأثر



الهدف هو تحقيق تحسين حقيقي قابل للقياس.



اجعل النصوص قابلة للتعديل بالكامل.



---



15. منهجية العمل



أنشئ Timeline:



01 — التشخيص

02 — التحليل

03 — التخطيط

04 — التنفيذ

05 — القياس والتحسين



كل خطوة Dynamic.



---



16. المشاريع والإنجازات



أنشئ:



/projects



لا تخترع مشاريع حقيقية.



إذا لم توجد بيانات، اعرض Empty State احترافيًا في الموقع أو بيانات Demo مخفية عن الجمهور حتى يتم اعتمادها.



لوحة التحكم تسمح بإضافة:



- مشروع

- صورة

- وصف

- فئة

- عميل

- تاريخ

- نتائج

- معرض صور



---



17. آراء العملاء



أنشئ Testimonials.



لكن:

لا تنشئ شهادات وهمية منشورة على الموقع.



إذا لم توجد شهادات حقيقية:



- اجعل القسم قابلًا للإخفاء.

- اعرضه في لوحة التحكم كـ Empty State.



---



18. الأسئلة الشائعة



أنشئ FAQ Dynamic.



مع:



- إضافة

- تعديل

- حذف

- ترتيب

- إظهار/إخفاء



---



19. طلب استشارة



هذه من أهم وظائف الموقع.



أنشئ صفحة:



/consultation



نموذج احترافي:



- الاسم الكامل

- رقم الجوال

- البريد الإلكتروني

- نوع الجهة

- الخدمة المطلوبة

- الرسالة

- زر إرسال



بعد الإرسال:



- تحقق من البيانات.

- خزّن الطلب في consultation_requests.

- أظهر Success State واضح.

- امنع Spam قدر الإمكان.

- لا تعرض البيانات الحساسة للعامة.



---



20. WhatsApp



أضف CTA واضحًا للتواصل عبر WhatsApp.



رقم WhatsApp يجب أن يكون Dynamic من Site Settings.



لا تضع رقمًا حقيقيًا وهميًا داخل الكود.



يمكن أن يكون زر Floating WhatsApp في الموقع ويتم تشغيله/إيقافه من لوحة التحكم.



---



21. صفحة التواصل



أنشئ:



/contact



تحتوي:



- نموذج تواصل

- WhatsApp

- الهاتف

- البريد

- الموقع

- أوقات العمل

- Google Maps اختياري



كلها قابلة للتعديل.



---



22. المدونة



أنشئ:



/blog



و:



/blog/:slug



مع:



- Categories

- Search

- Featured article

- Article cards

- Related articles

- Author

- Date

- Share buttons



محرر المقالات يجب أن يكون عمليًا وسهل الاستخدام.



---



23. لوحة التحكم



المسار:



/admin



صمم Dashboard حقيقية وليست صفحة CRUD بدائية.



Sidebar يحتوي:



الرئيسية



Dashboard



المحتوى



- الصفحات

- أقسام الصفحات

- الخدمات

- تصنيفات الخدمات

- المشاريع

- المقالات

- التصنيفات

- الأسئلة الشائعة

- آراء العملاء

- القطاعات



العملاء المحتملون



- طلبات الاستشارة

- الرسائل



الوسائط



- مكتبة الصور والملفات



المظهر



- الهوية البصرية

- الألوان

- الخطوط

- Header

- Footer

- Navigation

- إعدادات الأقسام



SEO



- إعدادات SEO

- Sitemap

- Metadata



الإعدادات



- معلومات الموقع

- التواصل

- WhatsApp

- الشبكات الاجتماعية

- إعدادات عامة



المستخدمون



- المستخدمون

- الأدوار

- الصلاحيات



النظام



- سجل النشاط

- الإصدارات

- إعدادات النظام



---



24. Dashboard الرئيسية



اعرض Cards:



- إجمالي الزيارات إذا تم ربط Analytics

- طلبات الاستشارة الجديدة

- إجمالي الخدمات

- المقالات المنشورة

- المشاريع

- الرسائل الجديدة



ثم:



- أحدث طلبات الاستشارة

- الخدمات الأكثر مشاهدة إن توفرت Analytics

- نشاط المستخدمين

- آخر التعديلات



---



25. Page Builder / Section Builder



هذه ميزة أساسية.



أريد نظام Sections Dynamic.



يستطيع Admin:



- إضافة Section

- حذف Section

- تعديل Section

- Duplicate

- Hide

- Show

- Drag & Drop

- Reorder

- Preview



أنواع Sections المبدئية:



- Hero

- Text

- Image + Text

- Services Grid

- Services Slider

- Features

- Statistics

- Testimonials

- Projects

- FAQ

- CTA

- Contact

- Team

- Logos

- Gallery

- Video

- Timeline

- Blog

- Custom Content



لا يلزم أن يكون كل Block معقدًا، لكن يجب أن تكون البنية قابلة للتوسع.



---



26. إعدادات كل Section



كل Section يجب أن يدعم قدر الإمكان:



- title

- subtitle

- description

- image

- background

- alignment

- spacing

- max width

- theme

- visibility

- CTA

- buttons

- animation

- custom class عند الحاجة



ولا تجعل إعدادات التصميم تكسر الموقع.



---



27. Global Theme Customizer



أنشئ صفحة:



Appearance / Theme



تتيح:



Brand



- Logo

- Favicon

- Brand Name



Colors



- Primary

- Secondary

- Accent

- Background

- Surface

- Text

- Muted



Typography



- Heading font

- Body font

- Font sizes



UI



- Border radius

- Button style

- Card style

- Shadows

- Container width



Header



- Logo position

- Menu style

- Sticky Header

- CTA



Footer



- Columns

- Logo

- Description

- Links

- Social icons

- Copyright



يجب أن يكون هناك Preview قبل التطبيق إن أمكن.



---



28. Media Library



أنشئ مكتبة وسائط حقيقية باستخدام Supabase Storage.



يدعم:



- Upload

- Delete

- Search

- Preview

- Replace

- Alt text

- File name

- Folder/category

- Copy reference



عند استخدام صورة في الموقع، خزّن Reference مناسبًا لها بدل تكرار الملفات.



---



29. إدارة Navigation



يستطيع Admin:



- إضافة رابط

- تعديل الرابط

- حذف الرابط

- تغيير الاسم

- تغيير المسار

- تغيير الترتيب

- إضافة Dropdown

- إظهار/إخفاء العنصر



---



30. Header وFooter



يجب أن يكونا Dynamic.



لا تضعهما بشكل ثابت يصعب تغييره.



Admin يستطيع تعديل:



- Logo

- Menu

- CTA

- Social links

- Footer text

- Footer columns

- Contact information



---



31. SEO



كل Page وService وBlog Post يجب أن يدعم:



- SEO Title

- Meta Description

- Slug

- OG Image

- Canonical

- Robots

- Structured Data عند الحاجة



أنشئ:



- sitemap.xml

- robots.txt



واستخدم Semantic HTML.



---



32. Analytics



جهز Settings لربط:



- Google Analytics

- Google Search Console

- Meta Pixel



لكن لا تضع IDs حقيقية.



اجعلها قابلة للإضافة من لوحة التحكم أو environment variables حسب الحاجة.



---



33. Version History



أي تعديل مهم في المحتوى يجب أن يمكن تسجيله في Audit Log.



اعرض:



- المستخدم

- العملية

- العنصر

- التاريخ

- الوقت



ويفضل إنشاء Version History للمحتوى المهم.



أضف:



- Draft

- Preview

- Publish



لا تجعل كل تعديل حساس ينشر مباشرة دون إمكانية المعاينة.



---



34. نظام الإشعارات



داخل لوحة التحكم:



اعرض إشعارات مثل:



- طلب استشارة جديد

- رسالة جديدة

- تعديل محتوى

- مستخدم جديد

- فشل عملية مهمة



---



35. حالات Empty State



صمم Empty States احترافية.



مثال:

إذا لم توجد مشاريع:



«لم تتم إضافة مشاريع بعد.»



ثم زر:



إضافة مشروع



ولا تعرض بيانات وهمية للزوار.



---



36. حالات Loading وError



كل صفحة يجب أن تحتوي على:



- Skeleton Loading

- Error State

- Empty State



لا تعرض صفحة بيضاء عند حدوث مشكلة.



---



37. Responsive



يجب اختبار التصميم على:



- Mobile 320px+

- Mobile 375px

- Mobile 390px

- Tablet

- Laptop

- Desktop

- Large Desktop



خصوصًا:



- Header

- Navigation

- Hero

- Cards

- Forms

- Dashboard

- Tables

- Page Builder



في الجوال يجب أن تكون لوحة التحكم قابلة للاستخدام، وليس مجرد نسخة مصغرة سيئة.



---



38. Accessibility



التزم قدر الإمكان بـ WCAG:



- Semantic HTML

- Keyboard navigation

- Focus states

- Labels

- ARIA عند الحاجة

- Contrast جيد

- Alt text

- Reduced motion عند الحاجة



---



39. الأمان



لا تعتمد على حماية Frontend فقط.



يجب:



- حماية Admin Routes.

- Authentication حقيقي.

- Authorization حقيقي.

- RLS في Supabase.

- عدم كشف مفاتيح سرية.

- Validation للمدخلات.

- حماية النماذج.

- منع المستخدم العادي من الوصول إلى بيانات Admin.

- عدم تخزين كلمات المرور يدويًا.



---



40. Reusable Architecture



هذه نقطة مهمة جدًا.



لا تبنِ المشروع كأن المستشار العزي هو العميل الوحيد الذي سيستخدم النظام.



لكن لا تجعل النسخة الحالية Generic أو بلا هوية.



البنية الداخلية يجب أن تسمح لاحقًا بإعادة استخدام النظام مع مشروع جديد عن طريق تغيير:



- Brand

- Logo

- Colors

- Fonts

- Pages

- Services

- Content

- Media

- Navigation

- Contact information

- SEO

- Social links



لكن الموقع الحالي يجب أن يكون مخصصًا بالكامل للمستشار العزي.



---



41. لا تبالغ في بناء Multi-Tenant SaaS الآن



لا أريد منك تحويل المشروع في هذه المرحلة إلى SaaS ضخم.



نريد:

Reusable Architecture



وليس:

Multi-Tenant SaaS كامل



إذا احتاجت البنية إلى فصل بعض الأشياء مستقبلًا، صممها بطريقة تسمح بالتوسع.



لكن الأولوية الحالية هي جودة موقع المستشار العزي.



---



42. تجربة المستخدم



الموقع يجب أن يقود الزائر منطقيًا:



التعرف على النشاط

↓

فهم الخدمات

↓

اختيار الخدمة

↓

قراءة التفاصيل

↓

بناء الثقة

↓

طلب الاستشارة

↓

التواصل



لا تجعل كل شيء عبارة عن Cards بلا تسلسل.



---



43. Call To Action



استخدم CTA واضحة لكن غير مزعجة.



أمثلة:



اطلب استشارة



تحدث معنا



استكشف خدماتنا



هل لديك تحدٍ مؤسسي؟ لنناقشه معًا.



كل CTA يجب أن تكون قابلة للتعديل.



---



44. الصور



لا تستخدم صورًا عشوائية بشكل مبالغ فيه.



الصور يجب أن تعكس:



- المؤسسات

- الإدارة

- التخطيط

- الاجتماعات المهنية

- التطوير

- الجودة

- الاستراتيجية



لا تستخدم صور أشخاص معروفين أو صورًا تحمل شعارات شركات أخرى بطريقة توحي بأنها عملاء.



استخدم صورًا مرخصة/مناسبة أو placeholders احترافية إلى حين توفير الصور الحقيقية.



---



45. البيانات الأولية



أدخل الخدمات المذكورة سابقًا كـ Seed Data مبدئية.



لكن اجعل:



- الصور قابلة للتغيير

- الأوصاف قابلة للتغيير

- التصنيفات قابلة للتغيير

- الترتيب قابلًا للتغيير

- الخدمات قابلة للحذف

- الخدمات الجديدة قابلة للإضافة



لا تعتبر هذه القائمة نهائية.



---



46. اللغة



الموقع العربي هو الأولوية.



استخدم لغة عربية احترافية ومحايدة.



لا تستخدم لهجة عامية.



النصوص التسويقية يجب أن تكون:



- واضحة

- مختصرة

- مهنية

- غير مبالغ فيها

- لا تحتوي على وعود غير مؤكدة



---



47. تصميم لوحة التحكم



لا تستخدم Dashboard تقليدية قبيحة.



أريد:



- Sidebar حديث

- Cards

- Tables احترافية

- Filters

- Search

- Tabs

- Modals

- Toast notifications

- Confirm dialogs

- Breadcrumbs

- Responsive layout



استخدم Icons واضحة.



اجعل تجربة لوحة التحكم متناسقة مع الموقع العام.



---



48. لوحة تحرير المحتوى



في كل مكان يوجد محتوى، يجب أن يكون هناك CRUD كامل عند الحاجة:



Create

Read

Update

Delete



مع:



- Search

- Filter

- Sort

- Pagination عند الحاجة

- Bulk actions عند الحاجة

- Status

- Visibility



---



49. منع فقدان البيانات



عند حذف عنصر مهم:

أظهر Confirm Dialog.



مثال:



«هل أنت متأكد من حذف هذه الخدمة؟

قد يؤثر ذلك على الصفحات المرتبطة بها.»



ولا تحذف البيانات المرتبطة بشكل كارثي.



استخدم Soft Delete حيث يكون مناسبًا.



---



50. جودة الكود



قبل إنهاء التنفيذ:



- أصلح TypeScript errors.

- أصلح console errors.

- لا تترك TODOs حرجة.

- لا تترك صفحات وهمية.

- لا تترك أزرارًا بلا وظيفة.

- لا تترك روابط ميتة.

- لا تضع بيانات حساسة.

- اختبر CRUD.

- اختبر Authentication.

- اختبر RLS.

- اختبر Responsive.

- اختبر Forms.

- اختبر Navigation.

- اختبر الحالات الفارغة.



---



51. لا تقل لي "تم البناء" إذا لم يتم



إذا واجهتك مشكلة تقنية:



- تعامل معها.

- أصلحها.

- أكمل التنفيذ.



إذا كان هناك شيء لا يمكن تنفيذه بالكامل بسبب قيود البيئة، وضحه في نهاية التنفيذ بدل إخفائه.



---



52. ترتيب التنفيذ



نفذ المشروع على مراحل داخل نفس المشروع:



Phase 1



Foundation + Routing + Design System



Phase 2



Supabase + Database + Authentication



Phase 3



Public Website



Phase 4



CMS



Phase 5



Admin Dashboard



Phase 6



Page Builder / Sections



Phase 7



Consultation Leads



Phase 8



SEO + Analytics Settings



Phase 9



Security + RLS + Permissions



Phase 10



Testing + Polish



لا تتوقف بعد إنشاء الواجهة فقط.



---



53. أهم شرط في المشروع



أكرر:



لا تجعل الموقع يعتمد على بيانات Hard-coded إذا كان من المنطقي أن تكون قابلة للتعديل.



مثال:



❌ لا تكتب اسم الشركة داخل Component ثابت.



❌ لا تكتب الخدمات داخل Array ثابت في الواجهة.



❌ لا تجعل لون الموقع ثابتًا.



❌ لا تجعل Footer ثابتًا.



❌ لا تجعل قائمة Navigation ثابتة.



❌ لا تجعل رقم WhatsApp ثابتًا.



بل:



Database → CMS → Components → Website



---



54. المطلوب النهائي



أريد في نهاية التنفيذ:



Public Website



موقع عربي مؤسسي Premium للمستشار العزي للمشروع.



Admin Dashboard



لوحة تحكم كاملة.



CMS



إدارة كل المحتوى.



Dynamic Page Builder



إدارة وترتيب Sections.



Database



Supabase/PostgreSQL.



Authentication



تسجيل دخول آمن.



Roles & Permissions



صلاحيات متعددة.



Leads



إدارة طلبات الاستشارة.



Media Library



إدارة الصور.



Theme Customizer



التحكم بالهوية.



SEO



إعدادات SEO كاملة.



Analytics Integration



جاهزية للربط.



Audit Logs



سجل التعديلات.



Draft / Preview / Publish



نظام نشر احترافي.



---



55. أهم أولوية



لا تجعل الهدف أن يكون لدينا أكبر عدد من الميزات.



الهدف:



موقع جميل جدًا + سريع + سهل الاستخدام + مقنع للعميل + قابل للتعديل + قابل للتوسع.



أريد منك اتخاذ قرارات UX/UI احترافية عند وجود تفاصيل غير محددة بدل إيقاف التنفيذ.



لكن:

لا تخترع معلومات تجارية حقيقية عن النشاط.



استخدم Placeholder أو اجعل المحتوى قابلًا للتعديل.



---



56. قبل إنهاء المشروع



نفذ مراجعة نهائية شاملة:



Public



- [ ] جميع الصفحات تعمل.

- [ ] جميع الروابط تعمل.

- [ ] RTL صحيح.

- [ ] Mobile ممتاز.

- [ ] Desktop ممتاز.

- [ ] الصور لا تسبب مشاكل.

- [ ] Forms تعمل.

- [ ] WhatsApp Dynamic.

- [ ] SEO موجود.

- [ ] Loading/Error/Empty states موجودة.



Admin



- [ ] تسجيل الدخول يعمل.

- [ ] Dashboard تعمل.

- [ ] CRUD يعمل.

- [ ] الخدمات Dynamic.

- [ ] الصفحات Dynamic.

- [ ] Sections Dynamic.

- [ ] Media Library تعمل.

- [ ] Theme Settings تعمل.

- [ ] Navigation قابلة للتعديل.

- [ ] Footer قابل للتعديل.

- [ ] Consultation Requests تعمل.

- [ ] Roles/Permissions تعمل.

- [ ] Audit Log يعمل.



Database/Security



- [ ] RLS مفعل.

- [ ] المستخدم لا يستطيع الوصول لما لا يملك صلاحية الوصول إليه.

- [ ] لا توجد أسرار في Frontend.

- [ ] Validation موجود.

- [ ] لا توجد أخطاء Console حرجة.



---



57. النتيجة المطلوبة



لا أريد مجرد Prototype بصري.



أريد نسخة أولى قابلة للتشغيل فعليًا يمكنني عرضها على صاحب النشاط كـDemo احترافي.



وفي الوقت نفسه يجب أن تكون قاعدة المشروع قوية بحيث أستطيع لاحقًا تخصيصها لعميل آخر دون إعادة كتابة الموقع بالكامل.



ابدأ التنفيذ الآن، وابنِ المشروع كاملًا وفق هذه المواصفات، مع إعطاء الأولوية لجودة التصميم وتجربة المستخدم وقابلية التعديل من لوحة التحكم.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bizwiz-nexus.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/216c99e0-1e22-4940-aff7-455ceec0b194).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
