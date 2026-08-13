insert into public.site_settings (key, value) values
('brand', '{"site_name":"المستشار العزي للمشروع","tagline":"استشارات الجودة والتطوير المؤسسي","logo_url":"","favicon_url":"","logo_text":"المستشار العزي"}'::jsonb),
('theme', '{"primary":"oklch(0.32 0.07 250)","secondary":"oklch(0.55 0.11 250)","accent":"oklch(0.74 0.13 78)","background":"oklch(0.995 0.003 250)","surface":"oklch(1 0 0)","foreground":"oklch(0.21 0.03 250)","muted":"oklch(0.55 0.02 250)","border":"oklch(0.91 0.01 250)","radius":"0.75rem","heading_font":"Tajawal","body_font":"Tajawal","container_width":"1200px","button_style":"solid"}'::jsonb),
('contact', '{"phone":"","whatsapp":"","email":"","address":"","working_hours":"الأحد - الخميس، 9:00 ص - 5:00 م","map_embed":"","whatsapp_message":"السلام عليكم، أرغب في الاستفسار عن خدماتكم","whatsapp_float_enabled":true}'::jsonb),
('social', '{"twitter":"","linkedin":"","instagram":"","youtube":"","snapchat":""}'::jsonb),
('seo', '{"default_title":"المستشار العزي للمشروع | استشارات الجودة والتطوير المؤسسي","default_description":"حلول استشارية متخصصة في الجودة والتطوير المؤسسي تساعد المنشآت والجمعيات على بناء أنظمة أكثر كفاءة واستدامة.","og_image":"","robots":"index, follow","canonical_base":""}'::jsonb),
('analytics', '{"google_analytics_id":"","search_console_verification":"","meta_pixel_id":"","enabled":false}'::jsonb),
('footer', '{"description":"نقدم حلولًا استشارية متخصصة في الجودة والتطوير المؤسسي، تساعد المنشآت والجمعيات على بناء أنظمة أكثر كفاءة وتحقيق أهدافها بوضوح واستدامة.","copyright":"جميع الحقوق محفوظة","show_social":true}'::jsonb),
('header', '{"sticky":true,"cta_label":"اطلب استشارة","cta_url":"/consultation","show_cta":true}'::jsonb),
('sections_visibility', '{"testimonials":false,"projects":true,"blog":true,"faq":true}'::jsonb);

insert into public.navigation_items (location, label, url, sort_order) values
('header','الرئيسية','/',1),
('header','من نحن','/about',2),
('header','الخدمات','/services',3),
('header','القطاعات','/sectors',4),
('header','المشاريع','/projects',5),
('header','المدونة','/blog',6),
('header','تواصل معنا','/contact',7),
('footer','الخدمات','/services',1),
('footer','القطاعات','/sectors',2),
('footer','طلب استشارة','/consultation',3),
('footer','الأسئلة الشائعة','/faq',4),
('footer','تواصل معنا','/contact',5);

insert into public.service_categories (name, slug, description, sort_order) values
('الحوكمة والبناء المؤسسي','governance','أنظمة الحوكمة واللوائح والأدلة الإجرائية',1),
('التخطيط الاستراتيجي','strategy','الخطط الاستراتيجية والتشغيلية والتسويقية',2),
('الجودة والتميز المؤسسي','quality','أنظمة الجودة وجوائز التميز المؤسسي',3),
('المشاريع والمبادرات','projects','ابتكار وبناء المشاريع والمبادرات ودراسات الجدوى',4),
('التدريب وبناء القدرات','training','تحليل الاحتياج التدريبي والخطط التدريبية',5);

insert into public.services (title, slug, short_description, full_description, icon, category_id, is_featured, sort_order, features, process_steps, outcomes, meta_title, meta_description) values
('البناء المؤسسي الشامل','institutional-building','بناء متكامل للهيكل والأنظمة والعمليات بما يرفع كفاءة الجهة.','نعمل على تأسيس البنية المؤسسية للجهة من الهيكل التنظيمي والوصف الوظيفي إلى الأنظمة واللوائح والعمليات، بما يحقق الوضوح في الأدوار والانضباط في التنفيذ.','Building2',(select id from public.service_categories where slug='governance'),true,1,
 '["تشخيص الوضع الحالي","تصميم الهيكل التنظيمي","الوصف الوظيفي","بناء العمليات والإجراءات"]'::jsonb,
 '[{"title":"التشخيص","description":"دراسة واقع الجهة وتحديد الفجوات."},{"title":"التصميم","description":"إعداد الهيكل والأنظمة المقترحة."},{"title":"التنفيذ","description":"اعتماد الوثائق وتمكين الفريق."},{"title":"القياس","description":"متابعة التطبيق وتحسينه."}]'::jsonb,
 '["وضوح الأدوار والمسؤوليات","انضباط العمليات التشغيلية","جاهزية أعلى للتقييم والاعتماد"]'::jsonb,
 'البناء المؤسسي الشامل | المستشار العزي للمشروع','خدمة البناء المؤسسي الشامل: الهيكل التنظيمي والأنظمة والعمليات لرفع كفاءة الجهة.'),
('حوكمة الجمعيات الأهلية','ngo-governance','تطبيق ممارسات الحوكمة وفق المتطلبات التنظيمية للقطاع غير الربحي.','نساعد الجمعيات على بناء منظومة حوكمة واضحة تشمل أدلة الحوكمة واللجان والسياسات والفصل بين الصلاحيات بما يعزز الشفافية والامتثال.','ShieldCheck',(select id from public.service_categories where slug='governance'),true,2,
 '["دليل الحوكمة","لوائح اللجان","سياسات تعارض المصالح","مصفوفة الصلاحيات"]'::jsonb,
 '[{"title":"التشخيص","description":"مراجعة الوضع الحوكمي الحالي."},{"title":"البناء","description":"إعداد الأدلة والسياسات."},{"title":"الاعتماد","description":"عرض الوثائق على مجلس الإدارة."},{"title":"التمكين","description":"ورش تعريفية للفريق."}]'::jsonb,
 '["امتثال أعلى للمتطلبات","شفافية في اتخاذ القرار","تعزيز ثقة الشركاء"]'::jsonb,
 'حوكمة الجمعيات الأهلية | المستشار العزي للمشروع','بناء منظومة حوكمة متكاملة للجمعيات الأهلية: أدلة، لوائح، سياسات، ومصفوفة صلاحيات.'),
('حوكمة الأندية الرياضية','sports-club-governance','منظومة حوكمة تناسب طبيعة الأندية والكيانات الرياضية.','نصمم إطار حوكمة يناسب الأندية الرياضية من حيث الهياكل واللجان والسياسات وآليات المساءلة والإفصاح.','Trophy',(select id from public.service_categories where slug='governance'),false,3,
 '["إطار الحوكمة","لوائح اللجان","سياسات الإفصاح"]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('بناء اللوائح التنظيمية','regulations','إعداد لوائح تنظيمية دقيقة ومتوافقة مع أنظمة الجهة.','نعد اللوائح التنظيمية التي تنظم العمل الداخلي للجهة وتضمن الاتساق بين الممارسات والأنظمة المعتمدة.','ScrollText',(select id from public.service_categories where slug='governance'),false,4,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('بناء السياسات','policies','سياسات مكتوبة وواضحة تحكم الممارسات اليومية.','نصيغ السياسات الإدارية والمالية والتشغيلية بلغة واضحة قابلة للتطبيق والقياس.','FileText',(select id from public.service_categories where slug='governance'),false,5,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('بناء الأدلة الإجرائية','procedures','توثيق الإجراءات خطوة بخطوة لضمان جودة التنفيذ.','نوثق الإجراءات التشغيلية بخرائط عمليات واضحة ونماذج ومؤشرات، بما يقلل الاعتماد على الأشخاص.','ListChecks',(select id from public.service_categories where slug='governance'),false,6,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('بناء الخطط الاستراتيجية والتشغيلية','strategic-planning','خطط استراتيجية واقعية مرتبطة بخطط تشغيلية قابلة للقياس.','نبني الخطة الاستراتيجية انطلاقًا من التحليل البيئي وتحديد التوجه الاستراتيجي والأهداف والمبادرات، ثم نترجمها إلى خطط تشغيلية سنوية بمؤشرات أداء.','Target',(select id from public.service_categories where slug='strategy'),true,7,
 '["التحليل البيئي","التوجه الاستراتيجي","الأهداف والمبادرات","مؤشرات الأداء"]'::jsonb,
 '[{"title":"التحليل","description":"تحليل البيئة الداخلية والخارجية."},{"title":"التوجه","description":"صياغة الرؤية والرسالة والقيم."},{"title":"التخطيط","description":"بناء الأهداف والمبادرات."},{"title":"التشغيل","description":"إعداد الخطة التشغيلية والمؤشرات."}]'::jsonb,
 '["وضوح الاتجاه المؤسسي","ربط الموارد بالأولويات","قياس دوري للأداء"]'::jsonb,
 'بناء الخطط الاستراتيجية والتشغيلية | المستشار العزي','خطط استراتيجية وتشغيلية بمؤشرات أداء قابلة للقياس للمنشآت والجمعيات.'),
('بناء الخطط التسويقية','marketing-plans','خطط تسويقية مبنية على تحليل الجمهور والرسائل والقنوات.','نضع خطة تسويقية متكاملة تشمل تحليل الجمهور والرسائل والقنوات والمحتوى ومؤشرات القياس.','Megaphone',(select id from public.service_categories where slug='strategy'),false,8,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('التميز المؤسسي','institutional-excellence','رفع نضج الجهة وفق نماذج التميز المعتمدة.','نطبق منهجيات التميز المؤسسي لقياس النضج الحالي وبناء خطة تحسين تقود إلى نتائج ملموسة.','Award',(select id from public.service_categories where slug='quality'),true,9,
 '["تقييم النضج المؤسسي","خطة التحسين","تمكين فرق العمل"]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('تأهيل الجمعيات للمشاركة في جوائز التميز','awards-readiness','إعداد الجهة وملف الترشح للمشاركة في جوائز التميز المؤسسي.','نساعد الجهة على فهم معايير الجائزة وتقييم جاهزيتها وبناء ملف الترشح والأدلة الداعمة.','Medal',(select id from public.service_categories where slug='quality'),true,10,
 '["تحليل معايير الجائزة","تقييم الجاهزية","إعداد ملف الترشح","تجهيز الأدلة"]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('بناء أنظمة الجودة ISO 9001','iso-9001','تأسيس نظام إدارة الجودة والتهيئة للحصول على الشهادة.','نبني نظام إدارة الجودة وفق متطلبات ISO 9001 من توثيق العمليات إلى التدقيق الداخلي والتهيئة للتدقيق الخارجي.','BadgeCheck',(select id from public.service_categories where slug='quality'),true,11,
 '["توثيق نظام الجودة","خرائط العمليات","التدقيق الداخلي","التهيئة للتدقيق الخارجي"]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('إعداد التقارير الختامية','final-reports','تقارير ختامية احترافية توثق المشروع ونتائجه وأثره.','نعد التقارير الختامية للمشاريع والبرامج بصياغة مهنية تعرض المخرجات والنتائج والأثر والدروس المستفادة.','FileBarChart',(select id from public.service_categories where slug='projects'),true,12,
 '["توثيق المخرجات","عرض النتائج والأثر","الدروس المستفادة","إخراج بصري احترافي"]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('دراسات الجدوى الاقتصادية','feasibility-studies','دراسة جدوى تحلل السوق والتشغيل والجانب المالي.','نعد دراسات جدوى تشمل الجوانب السوقية والفنية والتشغيلية والمالية لدعم قرار الاستثمار أو إطلاق المشروع.','LineChart',(select id from public.service_categories where slug='projects'),true,13,
 '["الدراسة السوقية","الدراسة الفنية","الدراسة المالية","تحليل المخاطر"]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('ابتكار المشاريع والمبادرات النوعية','innovative-initiatives','توليد أفكار مشاريع نوعية مرتبطة بأهداف الجهة.','نستخدم أدوات الابتكار لتوليد أفكار مشاريع ومبادرات نوعية وتقييمها واختيار الأنسب منها للتنفيذ.','Lightbulb',(select id from public.service_categories where slug='projects'),false,14,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('بناء المبادرات والمشاريع','project-design','تصميم المشروع من الفكرة إلى خطة تنفيذ متكاملة.','نحوّل الفكرة إلى مشروع متكامل بأهداف ونطاق وخطة تنفيذ وموازنة ومؤشرات قياس.','Boxes',(select id from public.service_categories where slug='projects'),false,15,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('الرفع على منصة إرب','erb-platform','إعداد ورفع المشاريع على المنصة وفق المتطلبات المعتمدة.','نساعد الجهات في تجهيز بيانات المشروع ومتطلباته ورفعه على المنصة بصورة مكتملة وصحيحة.','UploadCloud',(select id from public.service_categories where slug='projects'),false,16,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('تحليل الاحتياج التدريبي','training-needs','تحديد الفجوات المعرفية والمهارية لدى فرق العمل.','نحلل الاحتياج التدريبي على مستوى الجهة والوظائف والأفراد لبناء تدخلات تدريبية فعالة.','Search',(select id from public.service_categories where slug='training'),false,17,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null),
('بناء الخطط التدريبية','training-plans','خطة تدريبية سنوية مرتبطة بالاحتياج والأولويات.','نبني الخطة التدريبية السنوية بمسارات واضحة وموازنة ومؤشرات لقياس أثر التدريب.','GraduationCap',(select id from public.service_categories where slug='training'),false,18,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,null,null);

insert into public.sectors (title, slug, description, icon, sort_order) values
('الجمعيات الأهلية','ngos','دعم الجمعيات في الحوكمة والتخطيط والتميز المؤسسي.','HeartHandshake',1),
('الأندية الرياضية','sports-clubs','بناء الأنظمة والحوكمة المناسبة للكيانات الرياضية.','Trophy',2),
('المؤسسات والمنشآت','enterprises','رفع كفاءة الأنظمة والعمليات في المنشآت.','Building2',3),
('المشاريع والمبادرات','initiatives','تصميم المشاريع والمبادرات ودراسات الجدوى.','Rocket',4),
('الجهات التي تحتاج تطويرًا مؤسسيًا','institutional-development','تشخيص الواقع وبناء خطة تطوير مؤسسي متكاملة.','Compass',5);

insert into public.faqs (question, answer, sort_order) values
('كيف أبدأ العمل معكم؟','يمكنك إرسال طلب استشارة عبر الموقع أو التواصل معنا مباشرة، ثم نحدد موعدًا لفهم احتياج الجهة قبل تقديم أي مقترح.',1),
('هل تقدمون خدماتكم للجمعيات والأندية والمنشآت؟','نعم، نعمل مع الجمعيات الأهلية والأندية الرياضية والمؤسسات والمنشآت والجهات التي ترغب في تطوير أنظمتها المؤسسية.',2),
('كم تستغرق مدة تنفيذ المشروع الاستشاري؟','تختلف المدة حسب نوع الخدمة وحجم الجهة ونطاق العمل، ويتم تحديدها بوضوح في مقترح العمل قبل البدء.',3),
('هل يمكن تنفيذ العمل عن بُعد؟','نعم، يمكن تنفيذ جزء كبير من الأعمال عن بُعد مع ترتيب اللقاءات الحضورية عند الحاجة.',4),
('هل تقدمون متابعة بعد انتهاء المشروع؟','نحرص على مرحلة القياس والتحسين لضمان تطبيق المخرجات، ويمكن الاتفاق على متابعة إضافية حسب الحاجة.',5);

insert into public.blog_categories (name, slug, description, sort_order) values
('التطوير المؤسسي','institutional-development','مقالات في البناء والتطوير المؤسسي',1),
('الحوكمة','governance','مقالات في الحوكمة والامتثال',2),
('الجودة والتميز','quality','مقالات في أنظمة الجودة والتميز المؤسسي',3),
('التخطيط الاستراتيجي','strategy','مقالات في التخطيط والاستراتيجية',4);

insert into public.pages (title, slug, status, meta_title, meta_description) values
('الصفحة الرئيسية','home','published','المستشار العزي للمشروع | استشارات الجودة والتطوير المؤسسي','حلول استشارية متخصصة في الجودة والتطوير المؤسسي للمنشآت والجمعيات والأندية.');

insert into public.page_sections (page_id, section_type, title, subtitle, content, settings, sort_order) values
((select id from public.pages where slug='home'),'hero','نحو مؤسسات أكثر كفاءة وتميزًا واستدامة','المستشار العزي للمشروع','نقدم حلولًا استشارية متخصصة في الجودة والتطوير المؤسسي، تساعد المنشآت والجمعيات على بناء أنظمة أكثر كفاءة وتحقيق أهدافها بوضوح واستدامة.','{"primary_cta_label":"اطلب استشارة","primary_cta_url":"/consultation","secondary_cta_label":"استكشف خدماتنا","secondary_cta_url":"/services","alignment":"right","overlay":0.72,"image":""}'::jsonb,1),
((select id from public.pages where slug='home'),'about','نبذة عنا','من نحن','جهة استشارية متخصصة في الجودة والتطوير المؤسسي، نعمل مع الجمعيات والأندية والمنشآت على بناء أنظمة إدارية واضحة وقابلة للتطبيق، انطلاقًا من فهم دقيق للواقع وصولًا إلى أثر ملموس وقابل للقياس.','{"cta_label":"تعرّف علينا","cta_url":"/about","image":"","stats":[]}'::jsonb,2),
((select id from public.pages where slug='home'),'services','خدماتنا','ما نقدمه','باقة من الخدمات الاستشارية المصممة لرفع كفاءة الجهات وتمكينها من تحقيق أهدافها.','{"limit":6,"featured_only":true,"cta_label":"جميع الخدمات","cta_url":"/services"}'::jsonb,3),
((select id from public.pages where slug='home'),'features','لماذا نحن؟','ما يميز عملنا','','{"items":[{"title":"فهم الاحتياج","description":"نبدأ بفهم واقع الجهة واحتياجاتها.","icon":"Search"},{"title":"حلول مخصصة","description":"نقدم حلولًا تتناسب مع طبيعة الجهة وأهدافها.","icon":"Puzzle"},{"title":"منهجية واضحة","description":"من التشخيص والتحليل إلى التخطيط والتنفيذ والتقييم.","icon":"Route"},{"title":"تركيز على الأثر","description":"الهدف هو تحقيق تحسين حقيقي قابل للقياس.","icon":"TrendingUp"}]}'::jsonb,4),
((select id from public.pages where slug='home'),'sectors','القطاعات التي نخدمها','قطاعاتنا','نعمل مع جهات متنوعة تجمعها الرغبة في بناء مؤسسي أفضل.','{"cta_label":"تفاصيل القطاعات","cta_url":"/sectors"}'::jsonb,5),
((select id from public.pages where slug='home'),'timeline','منهجية العمل','كيف نعمل','منهجية واضحة تضمن انتقال الجهة من التشخيص إلى الأثر.','{"steps":[{"number":"01","title":"التشخيص","description":"قراءة واقع الجهة وتحديد نقاط القوة والفجوات."},{"number":"02","title":"التحليل","description":"تحليل البيانات وترتيب الأولويات."},{"number":"03","title":"التخطيط","description":"بناء الحلول والخطط القابلة للتطبيق."},{"number":"04","title":"التنفيذ","description":"تمكين الفريق ومرافقة التطبيق."},{"number":"05","title":"القياس والتحسين","description":"قياس الأثر وتحسين الممارسات."}]}'::jsonb,6),
((select id from public.pages where slug='home'),'faq','الأسئلة الشائعة','استفسارات متكررة','','{"limit":5}'::jsonb,7),
((select id from public.pages where slug='home'),'cta','هل لديك تحدٍ مؤسسي؟ لنناقشه معًا','','ابدأ بخطوة بسيطة: أخبرنا عن احتياج جهتك وسنعود إليك بمقترح واضح.','{"primary_cta_label":"اطلب استشارة","primary_cta_url":"/consultation","secondary_cta_label":"تواصل معنا","secondary_cta_url":"/contact"}'::jsonb,8);