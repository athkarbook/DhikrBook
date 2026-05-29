import React, { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, Settings, Info, BookOpen, CheckCircle, RotateCcw, Clock, Star, X, Plus, Minus, Type, Flame, Volume2, VolumeX, Vibrate, VibrateOff, Target, Sunrise, MoonStar, ChevronDown, ChevronUp } from 'lucide-react';

// --- البيانات المستخرجة حصرياً من ملف د. مطلق الجاسر ---
const adhkarData = [
  // ========================================
  // --- أذكار الاستيقاظ والتعار من الليل ---
  // ========================================
  {
    id: 201,
    target: 1,
    category: 'الذكر الوارد إذا تعار من الليل (التقلب والانتباه)',
    textMorning: 'لا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ ، سُبْحَانَ اللهِ ، وَالْحَمْدُ لِلَّهِ ، وَلاَ إِلَهَ إِلَّا اللهُ ، وَاللهُ أَكْبَرُ ، وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلا بِاللهِ الْعَلِيَّ الْعَظِيم ، اللهم اغْفِرْ لِي.',
    takhreej: 'رواه البخاري (1145) عن عبادة بن الصامت رضي الله عنه.',
    fadl: 'من قال ذلك ثم دعا استجيب له، فإن توضأ وصلى قبلت صلاته.',
    fawaid: 'التعار: هو السهر والتقلب على الفراش ليلاً مع كلام.',
    wakeOnly: true,
    isTaar: true,
  },
  {
    id: 202,
    target: 1,
    category: 'الذكر الوارد إذا تعار من الليل (التقلب والانتباه)',
    textMorning: 'لا إله إلا الله الْوَاحِدُ الْقَهَّارُ ، رَبُّ السَّمَاوَاتِ وَالْأَرْضِ وَمَا بَيْنَهُمَا الْعَزِيزُ الْغَفَّار.',
    takhreej: 'رواه ابن حبان في صحيحه (5530) وابن السني عن عائشة رضي الله عنها.',
    wakeOnly: true,
    isTaar: true,
  },
  {
    id: 203,
    target: 1,
    category: 'أذكار الاستيقاظ من النوم',
    textMorning: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا ، وَإِلَيْهِ النُّشُور.',
    takhreej: 'متفق عليه، رواه البخاري ومسلم.',
    wakeOnly: true,
  },
  {
    id: 204,
    target: 1,
    category: 'أذكار الاستيقاظ من النوم',
    textMorning: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لي بِذِكْرِهِ.',
    takhreej: 'رواه الترمذي (3401) عن أبي هريرة رضي الله عنه، وجود إسناده النووي.',
    wakeOnly: true,
  },
  {
    id: 205,
    target: 1,
    category: 'أذكار الاستيقاظ من النوم',
    textMorning: 'يُستحب مسح أثر النوم عن الوجه باليد، ثم قراءة خواتيم سورة آل عمران:\n\n﴿إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ...﴾ إلى آخر السورة [الآيات 190-200].',
    takhreej: 'رواه البخاري (183) ومسلم (763) عن ابن عباس رضي الله عنهما.',
    fawaid: 'قال النووي: وفيه استحباب قراءة هذه الآيات عند القيام من النوم.',
    wakeOnly: true,
  },

  // ==========================
  // --- أذكار الصباح والمساء ---
  // ==========================
  {
    id: 1,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: '﴿اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾ [البقرة: 255].',
    takhreej: 'رواه النسائي في عمل اليوم والليلة والطبراني في المعجم الكبير وصححه الألباني.',
    fadl: 'من قالها حين يمسي أجير منها (أي من الجن) حتى يصبح، ومن قالها حين يصبح أجير منا حتى يمسي.',
  },
  {
    id: 2,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنا عَبْدُكَ، وَأَنا عَلَى عَهْدِكَ وَوَعْدِكَ ما اسْتَطَعْت، أَعوذُ بِكَ مِنْ شَرِ ما صَنَعْت، أبوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبوءُ بِذَنْبي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنوبَ إِلَّا أَنْتَ.',
    takhreej: 'رواه البخاري.',
    fadl: 'سيد الاستغفار... من قالها من النهار موقناً بها فمات من يومه قبل أن يمسي فهو من أهل الجنة، ومن قالها من الليل وهو موقن بها فمات قبل أن يصبح فهو من أهل الجنة.',
    fawaid: 'أبوء: أي أقرّ وأعترف.'
  },
  {
    id: 3,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'أَصْبَحْنا وَأَصْبَحَ المُلْكُ لله، وَالحَمدُ لله، لا إلهَ إِلَّا اللهُ وَحدَهُ لا شَرِيكَ له، له الملك وله الحمد، وهُوَ على كلّ شَيءٍ قدير، رَبِّ أَسْأَلُكَ خَيرَ ما في هذا اليوم وَخَيرَ ما بَعْدَه، وَأَعُوذُ بِكَ مِنْ شَرِ ما في هذا اليوم وَشَرِّ ما بَعْدَه، رَبِّ أَعوذُ بِكَ مِنَ الْكَسَلِ وَسوءِ الْكِبَر، رَبِّ أَعوذُ بِكَ مِنْ عَذابٍ في النَّارِ وَعَذابٍ في القَبْر.',
    textEvening: 'أَمْسَيْنَا وَأَمْسَى المُلْكُ لله، وَالحَمدُ لله، لا إلهَ إِلَّا اللهُ وَحدَهُ لا شَرِيكَ له، له الملك وله الحمد، وهُوَ على كلّ شَيءٍ قدير، رَبِّ أَسْأَلُكَ خَيْرَ ما في هذه الليلة وَخَيْرَ ما بَعْدَها، وَأَعوذُ بِكَ مِنْ شَرِ ما في هذه الليلة وَشَرِ ما بَعْدَها، رَبِّ أَعوذُ بِكَ مِنَ الْكَسَلِ وَسوءِ الْكِبَر، رَبِّ أَعوذُ بِكَ مِنْ عَذابٍ في النَّارِ وَعَذابٍ في القَبْر.',
    takhreej: 'رواه مسلم من حديث ابن مسعود.',
    fawaid: '(سوء الكِبَر): بكسر الكاف وفتح الباء، استعاذ بالله من آفات طول العمر، وما يجلبه الكبر من الخرف، وذهاب العقل، وضعف القوى (قاله الخطابي).'
  },
  {
    id: 4,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'أَصْبَحْنا وَأَصْبَحَ المُلكُ للهِ رَبِّ العالمين، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هذا اليَوْم، فَتْحَهُ، وَنَصْرَهُ، وَنُورَهُ وَبَرَكَتَهُ، وَهُداهُ، وَأَعوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ ما بَعْدَه.',
    textEvening: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ رَبِّ الْعَالَمَيْنِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَهُ اللَّيْلَةِ فَتْحَهَا، ونَصْرَهَا، ونُوْرَهَا وَبَرَكَتِهَا، وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيها وَشَرَّ مَا بَعْدَهَا.',
    takhreej: 'رواه أبو داود، وحسنه ابن القيم.',
  },
  {
    id: 5,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'أَصْبَحْنا على فطرة الإسلام، وعلى كلمة الإخلاص، وعلى دين نبينا محمد ﷺ، وعلى ملة أبينا إبراهيم حنيفا مسلماً وما كان من المشركين.',
    textEvening: 'أَمْسَينا على فطرة الإسلام، وعلى كلمة الإخلاص، وعلى دين نبينا محمد ﷺ، وعلى ملة أبينا إبراهيم حنيفا مسلماً وما كان من المشركين.',
    takhreej: 'رواه أحمد وصحح إسناده الشيخ ابن باز.',
  },
  {
    id: 6,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'اللَّهُمَّ بِكَ أَصْبَحْنا وبك أَمْسَينا، وَبِكَ نَحْيا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُور.',
    textEvening: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيا وَبِكَ نَمُوتُ وَإِلَيْكَ المصير.',
    takhreej: 'رواه أبو داود والترمذي والنسائي وابن ماجه، وصححه النووي وابن القيم.',
  },
  {
    id: 7,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'اللَّهُمَّ ما أَصْبَحَ بي مِنْ نِعْمَةٍ أَو بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لا شريكَ لك، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْر.',
    textEvening: 'اللَّهُمَّ ما أَمْسَى بي مِنْ نِعْمَةٍ أَو بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لا شريكَ لك، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْر.',
    takhreej: 'رواه أبو داود والنسائي، وجود إسناده النووي وحسنه ابن باز.',
    fadl: 'من قالها حين يصبح فقد أدى شكر يومه، ومن قال ذلك حين يمسي فقد أدى شكر ليلته.',
  },
  {
    id: 8,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'اللهُمَّ إِنِّي أَسْأَلُكَ العفو والعافية في الدُّنْيا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ العَفْوَ والعافية في ديني وَدُنْيايَ وَأهْلي وَمالي، اللّهُمَّ اسْتُرْ عَوْراتي وَآمِنْ رَوْعاتـي، اللّهُمَّ احْفَظْني مِن بَيْنِ يَدَيَّ وَمِن خَلْفِي وَعَنِ يميني وَعَن شمالي، وَمِن فَوْقي، وَأَعوذُ بِعَظَمَتِكَ أَن أُغْتَالَ مِن تَحْتِي.',
    takhreej: 'أخرجه أحمد وأبو داود وابن ماجه والبخاري في الأدب المفرد، وصححه الألباني.',
    fawaid: 'لم يكن النبي ﷺ يدع هؤلاء الدعوات حين يمسي وحين يصبح.'
  },
  {
    id: 9,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.',
    textEvening: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.',
    takhreej: 'رواه ابن ماجه، وقال الأرناؤوط: له شاهد عند الطبراني فالحديث حسن به.',
    morningOnly: true,
  },
  {
    id: 10,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'اللَّهُمَّ فَاطِرَ السَّماواتِ وَالْأَرْضِ، عالِمَ الغَيْبِ وَالشَّهَادَةِ، رَبَ كلِّ شَيْءٍ وَمَليكَه، أَشْهَدُ أَنْ لا إِلهَ إِلَّا أَنْت، أَعوذُ بِكَ مِن شَرِ نَفْسِي وَمِن شَرِ الشَّيْطَانِ وَشِرْكِه، وَأَنْ أَقْتَرِفَ عَلَى نَفْسي سوءاً أَوْ أَجُرَّهُ إِلَى مُسْلِم.',
    takhreej: 'رواه أحمد وأبو داود والترمذي والنسائي والبخاري في الأدب المفرد وابن حبان، وصححه النووي وابن القيم.',
    fawaid: 'شِركِه: روي بكسر الشين وإسكان الراء (أي ما يدعو إليه من الإشراك)، والثاني: شَرَكه بفتح الشين والراء (أي حبائله ومصايده).'
  },
  {
    id: 11,
    target: 1,
    category: 'أولاً: ما يُقال مرة واحدة',
    textMorning: 'يا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغيث، أَصْلِحْ لِي شَأْنِي كُلَّه وَلَا تَكِلني إِلَى نَفْسِي طَرْفَةَ عَين.',
    takhreej: 'أخرجه النسائي في الكبرى والحاكم وقال صحيح على شرط الشيخين، وصحح إسناده المنذري والألباني.',
  },
  {
    id: 12,
    target: 3,
    category: 'ثانياً: ما يُقال ثلاث مرات',
    textMorning: 'سورة الإخلاص: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ...﴾\nسورة الفلق: ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...﴾\nسورة الناس: ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ...﴾',
    takhreej: 'رواه أبو داود والترمذي والنسائي وصححه النووي وحسنه ابن حجر.',
    fadl: 'من قالها حين يمسي وحين يصبح ثلاث مرات تكفيك من كل شيء.',
  },
  {
    id: 13,
    target: 3,
    category: 'ثانياً: ما يُقال ثلاث مرات',
    textMorning: 'بِسمِ اللهِ الذي لا يَضُرُّ مَعَ اسمِهِ شَيْءٌ في الأَرْضِ وَلا في السَّمَاءِ وَهوَ السميع العليم.',
    takhreej: 'رواه أحمد والترمذي وابن ماجه وأبو داود، وصححه الترمذي وابن القيم والألباني وابن باز.',
    fadl: 'لم تصبه فجأة بلاء حتى يصبح/يمسي، ولن يضره شيء.',
  },
  {
    id: 14,
    target: 3,
    category: 'ثانياً: ما يُقال ثلاث مرات',
    textMorning: 'رَضِيتُ بِاللهِ رَبّا، وَبِالإِسْلامِ دينا، وَبِمُحَمَّدٍ ﷺ نَبِيّاً.',
    takhreej: 'رواه أحمد وأبو داود وابن ماجه، وحسن إسناده ابن باز.',
    fadl: 'كان حقاً على الله أن يُرضيه يوم القيامة.',
    fawaid: 'استحب النووي أن يجمع الإنسان فيقول: (نبياً ورسولاً) خروجاً من الخلاف بين الروايات.'
  },
  {
    id: 15,
    target: 3,
    category: 'ثانياً: ما يُقال ثلاث مرات',
    textMorning: 'سُبْحانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ وَرِضا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدادَ كَلِمَاتِهِ.',
    takhreej: 'أخرجه مسلم.',
    fadl: 'لقد قلت بعدك أربع كلمات ثلاث مرات لو وزنت بما قلت منذ اليوم لوزنتهن.',
    morningOnly: true,
  },
  {
    id: 16,
    target: 3,
    category: 'ثانياً: ما يُقال ثلاث مرات',
    textMorning: 'اللهم عافني في بدني، اللهُمَّ عافني في سمعي، اللهم عافني في بَصَري، لا إلهَ إِلَّا أَنْتَ، اللَّهُمَّ إِنِّي أَعوذُ بِكَ مِنَ الْكُفْرِ وَالفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ القَبْر، لا إلهَ إِلَّا أَنْت.',
    takhreej: 'رواه أحمد والبخاري في الأدب المفرد وأبو داود والنسائي، وحسن إسناده ابن باز.',
  },
  {
    id: 17,
    target: 3,
    category: 'ثانياً: ما يُقال ثلاث مرات',
    textMorning: 'أعوذُ بكلماتِ الله التَّامَّاتِ مِنْ شَرِّ مَا خَلَق.',
    textEvening: 'أعوذُ بكلماتِ الله التَّامَّاتِ مِنْ شَرِّ مَا خَلَق.',
    takhreej: 'رواه مسلم وأحمد، وحسنه ابن باز.',
    fadl: 'لم تضرك (لم تضره حمة تلك الليلة).',
    eveningOnly: true,
  },
  {
    id: 18,
    target: 4,
    category: 'ثالثاً: ما يقال أربع مرات',
    textMorning: 'اللهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلائِكَتَكَ وَجَميعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لا إلهَ إِلَّا أَنْتَ، وَحْدَكَ لا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسولُك.',
    textEvening: 'اللهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلائِكَتَكَ وَجَميعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لا إلهَ إِلَّا أَنْتَ، وَحْدَكَ لا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسولُك.',
    takhreej: 'رواه أبو داود والبخاري في الأدب المفرد والنسائي، وجوده النووي وحسنه ابن باز.',
    fadl: 'من قالها أعتق الله ربعه من النار... فإن قالها أربعاً أعتقه الله من النار.',
  },
  {
    id: 19,
    target: 7,
    category: 'رابعاً: ما يقال سبع مرات',
    textMorning: 'حَسْبِيَ اللهُ لا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلتُ وَهُوَ رَبُّ العَرْشِ العَظيم.',
    takhreej: 'رواه ابن السني وابن عساكر، وصحح إسناده الأرناؤوط.',
    fadl: 'من قالها سبع مرات كفاه الله همه من أمر الدنيا والآخرة.',
  },
  {
    id: 20,
    target: 10,
    category: 'خامساً: ما يقال عشر مرات',
    textMorning: 'لا إلهَ إِلَّا اللهُ وَحْدَهُ لا شَريكَ لهُ، لهُ المُلْكُ ولهُ الحَمْدُ وهُوَ على كُلِّ شَيْءٍ قدير.',
    takhreej: 'رواه أحمد وحسن إسناده ابن باز. وفي الصحيحين فضل المئة مرة.',
    fadl: 'عشر مرات: كتب الله له مائة حسنة ومحا مائة سيئة وعدل رقبة وحفظ. (فإن زادها إلى مئة مرة فأفضل).',
  },
  {
    id: 21,
    target: 10,
    category: 'خامساً: ما يقال عشر مرات',
    textMorning: 'اللهم صل وسلم على نبينا محمد.',
    takhreej: 'رواه الطبراني وابن أبي عاصم، وجوده المنذري (مع الإشارة إلى خلاف في الانقطاع).',
    fadl: 'من صلى علي حين يصبح عشراً وحين يمسي عشراً أدركته شفاعتي يوم القيامة.',
  },
  {
    id: 22,
    target: 100,
    category: 'سادساً: ما يقال مئة مرة',
    textMorning: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.',
    takhreej: 'رواه مسلم.',
    fadl: 'لم يأت أحد يوم القيامة بأفضل مما جاء به إلا أحد قال مثل ما قال أو زاد عليه.',
  },
  
  // =====================
  // --- أذكار النوم ---
  // =====================
  {
    id: 101,
    target: 1,
    category: 'الذكر من القرآن',
    textMorning: '﴿اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾ [البقرة: 255].',
    takhreej: 'رواه البخاري (2311) عن أبي هريرة رضي الله عنه.',
    fadl: 'لن يزال معك من الله تعالى حافظ، ولا يقربك شيطان حتى تصبح.',
    fawaid: 'قال علي بن أبي طالب رضي الله عنه: ما أرى رجلاً ولد في الإسلام يبيت أبداً حتى يقرأ هذه الآية.',
    sleepOnly: true,
  },
  {
    id: 102,
    target: 1,
    category: 'الذكر من القرآن',
    textMorning: '﴿آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ * لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَّنَا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ﴾ [البقرة: 285-286].',
    takhreej: 'رواه البخاري (509) ومسلم (808) عن أبي مسعود الأنصاري البدري.',
    fadl: 'الآيتان من قرأهما في ليلة كفتاه (من كل سوء، وقيل: من الشيطان).',
    fawaid: 'قال علي رضي الله عنه: ما كنت أرى أن أحداً يعقل ينام حتى يقرأ هؤلاء الآيات وإنهن من كنز تحت العرش.',
    sleepOnly: true,
  },
  {
    id: 103,
    target: 1,
    category: 'الذكر من القرآن',
    textMorning: 'سورة الكافرون: ﴿قُلْ يَا أَيُّهَا الْكَافِرُونَ * لَا أَعْبُدُ مَا تَعْبُدُونَ * وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ * وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ * وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ * لَكُمْ دِينُكُمْ وَلِيَ دِينِ﴾.',
    takhreej: 'رواه أبو داود (5055) والترمذي (3403) عن نوفل الأشجعي، وصححه الألباني.',
    fadl: 'اقرأ ﴿قُلْ يَا أَيُّهَا الْكَافِرُونَ﴾ ثم نم على خاتمتها فإنها براءة من الشرك.',
    sleepOnly: true,
  },
  {
    id: 104,
    target: 3,
    category: 'الذكر من القرآن',
    textMorning: 'يجمع كفيه ثم ينفث فيهما فيقرأ (الإخلاص) و(المعوذتين) ثم يمسح بهما ما استطاع من جسده.\n\n(يفعل ذلك ثلاث مرات)',
    takhreej: 'متفق عليه، رواه البخاري (6319) ومسلم (2192) عن عائشة رضي الله عنها.',
    fawaid: 'يبدأ بهما على رأسه ووجهه وما أقبل من جسده.',
    sleepOnly: true,
  },
  {
    id: 105,
    target: 1,
    category: 'الأذكار التي تبدأ بالبسملة',
    textMorning: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.',
    takhreej: 'متفق عليه، رواه البخاري (6324) من رواية حذيفة، ومسلم (2711) من رواية البراء بن عازب.',
    sleepOnly: true,
  },
  {
    id: 106,
    target: 1,
    category: 'الأذكار التي تبدأ بالبسملة',
    textMorning: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.',
    takhreej: 'متفق عليه، رواه البخاري (6320) ومسلم (2714) عن أبي هريرة رضي الله عنه.',
    sleepOnly: true,
  },
  {
    id: 107,
    target: 1,
    category: 'الأذكار التي تبدأ بالبسملة',
    textMorning: 'بِاسْمِ اللَّهِ وَضَعْتُ جَنْبِي، اللَّهُمَّ اغْفِرْ لِي ذَنْبِي، وَأَخْسِئْ شَيْطَانِي، وَفُكَّ رِهَانِي، وَاجْعَلْنِي فِي النَّدِيِّ الْأَعْلَى.',
    takhreej: 'رواه أبو داود (5054) وصححه الألباني.',
    fawaid: 'الندي الأعلى: هم الملائكة صلوات الله عليهم (قاله الخطابي).',
    sleepOnly: true,
  },
  {
    id: 108,
    target: 1,
    category: 'الأذكار التي تبدأ بالحمدلة',
    textMorning: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ.',
    takhreej: 'رواه مسلم (2715) عن أنس رضي الله عنه.',
    sleepOnly: true,
  },
  {
    id: 109,
    target: 1,
    category: 'الأذكار التي تبدأ بالحمدلة',
    textMorning: 'الْحَمْدُ لِلَّهِ الَّذِي كَفَانِي وَآوَانِي وَأَطْعَمَنِي وَسَقَانِي، وَالَّذِي مَنَّ عَلَيَّ فَأَفْضَلَ، وَالَّذِي أَعْطَانِي فَأَجْزَلَ. الْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ؛ اللَّهُمَّ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، وَإِلَهَ كُلِّ شَيْءٍ، أَعُوذُ بِكَ مِنَ النَّارِ.',
    takhreej: 'رواه أبو داود (5058) وابن حبان وإسناده صحيح على شرط الشيخين.',
    sleepOnly: true,
  },
  {
    id: 110,
    target: 33,
    category: 'التسبيح والتحميد والتكبير',
    textMorning: 'سُبْحَانَ اللَّهِ.',
    takhreej: 'متفق عليه، رواه البخاري (6318) ومسلم (2727) عن علي رضي الله عنه.',
    fawaid: 'قال شيخ الإسلام ابن تيمية: بلغنا أنه من حافظ على هؤلاء الكلمات لم يأخذه إعياء فيما يعانيه من شغل ونحوه.',
    sleepOnly: true,
  },
  {
    id: 111,
    target: 33,
    category: 'التسبيح والتحميد والتكبير',
    textMorning: 'الْحَمْدُ لِلَّهِ.',
    takhreej: 'متفق عليه، رواه البخاري (6318) ومسلم (2727) عن علي رضي الله عنه.',
    fawaid: 'قال النبي ﷺ لفاطمة وعلي: ألا أدلكما على خير مما سألتما؟ (يعني خير من الخادم).',
    sleepOnly: true,
  },
  {
    id: 112,
    target: 34,
    category: 'التسبيح والتحميد والتكبير',
    textMorning: 'اللَّهُ أَكْبَرُ.',
    takhreej: 'متفق عليه، رواه البخاري (6318) ومسلم (2727) عن علي رضي الله عنه.',
    fadl: 'خصلتان لا يحافظ عليهما عبد مسلم إلا دخل الجنة.. (منها التسبيح والتحميد والتكبير عند النوم).',
    sleepOnly: true,
  },
  {
    id: 113,
    target: 1,
    category: 'أدعية قبل النوم بلفظ: (اللهم)',
    textMorning: 'اللَّهُمَّ رَبَّ السَّمَوَاتِ وَرَبَّ الْأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ ذِي شَرٍّ أَنْتَ آخِذٌ بِنَاصِيَتِهِ، أَنْتَ الْأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الْآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ، وَأَغْنِنِي مِنَ الْفَقْرِ.',
    takhreej: 'رواه مسلم (2713) عن أبي هريرة رضي الله عنه.',
    sleepOnly: true,
  },
  {
    id: 114,
    target: 1,
    category: 'أدعية قبل النوم بلفظ: (اللهم)',
    textMorning: 'اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ.',
    takhreej: 'رواه الإمام أحمد وأبو داود (5067) والترمذي وصححه النووي وابن القيم.',
    sleepOnly: true,
  },
  {
    id: 115,
    target: 1,
    category: 'أدعية قبل النوم بلفظ: (اللهم)',
    textMorning: 'اللَّهُمَّ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ.',
    takhreej: 'رواه مسلم (2712) عن عبد الله بن عمر رضي الله عنهما.',
    sleepOnly: true,
  },
  {
    id: 116,
    target: 3,
    category: 'أدعية قبل النوم بلفظ: (اللهم)',
    textMorning: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.',
    takhreej: 'رواه أحمد وأبو داود (5045) عن حفصة، وحسنه الحافظ ابن حجر وابن باز.',
    sleepOnly: true,
  },
  {
    id: 117,
    target: 1,
    category: 'أدعية قبل النوم بلفظ: (اللهم)',
    textMorning: 'اللَّهُمَّ إِنِّي أَعُوذُ بِوَجْهِكَ الْكَرِيمِ وَكَلِمَاتِكَ التَّامَّةِ مِنْ شَرِّ مَا أَنْتَ آخِذٌ بِنَاصِيَتِهِ، اللَّهُمَّ أَنْتَ تَكْشِفُ الْمَغْرَمَ وَالْمَأْثَمَ، اللَّهُمَّ لَا يُهْزَمُ جُنْدُكَ، وَلَا يُخْلَفُ وَعْدُكَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ، سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ.',
    takhreej: 'رواه أبو داود (5052) والنسائي وصحح إسناده البيهقي والنووي.',
    sleepOnly: true,
  },
  {
    id: 118,
    target: 1,
    category: 'أدعية قبل النوم بلفظ: (اللهم)',
    textMorning: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.',
    takhreej: 'متفق عليه، رواه البخاري (6313) ومسلم (2710) عن البراء بن عازب رضي الله عنه.',
    fadl: 'فإن مت من ليلتك مت على الفطرة.',
    fawaid: 'يجعله آخر ما يقول قبل نومه.',
    sleepOnly: true,
  }
];

// أحجام الخطوط المتاحة للمتن
const fontSizes = [
  'text-lg md:text-xl',
  'text-xl md:text-2xl',
  'text-2xl md:text-3xl',  // الافتراضي (المنتصف)
  'text-3xl md:text-4xl',
  'text-4xl md:text-5xl'
];

// تعريف الـ Styles خارج المكون يمنع وميض الشاشة ويحافظ على استقرار الخطوط
const globalStyles = {
  __html: `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    .font-cairo { font-family: 'Cairo', sans-serif; }
    .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .card-hover:hover { transform: translateY(-2px); }
    body { -webkit-tap-highlight-color: transparent; scroll-behavior: smooth; }
    
    @keyframes confettiFall {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    .confetti {
      position: fixed;
      top: -10vh;
      z-index: 9999;
      animation: confettiFall 4s linear forwards;
    }
  `
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('morning');
  const [showTakhreej, setShowTakhreej] = useState(true);
  const [showFadl, setShowFadl] = useState(true);
  const [showFawaid, setShowFawaid] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(2); 
  const [progress, setProgress] = useState({});
  
  // -- الحالات الجديدة للصوت والاهتزاز والمواظبة --
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [streak, setStreak] = useState(0);

  // -- حالة الاحتفال (Confetti) --
  const [showConfetti, setShowConfetti] = useState(false);

  // -- المسبحة الحرة --
  const [showTasbeehModal, setShowTasbeehModal] = useState(false);
  const [tasbeehCount, setTasbeehCount] = useState(0);

  // -- حالة إظهار قسم التعار --
  const [showTaarSection, setShowTaarSection] = useState(false);

  // دالة المؤثرات الصوتية (المحدثة بناءً على طلبك)
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!window.audioCtx) window.audioCtx = new AudioContext();
      if (window.audioCtx.state === 'suspended') window.audioCtx.resume();
      
      const now = window.audioCtx.currentTime;
      
      if (type === 'click') {
        // صوت نقرة هادئة (Soft Tap/Drop)
        const osc = window.audioCtx.createOscillator();
        const gain = window.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(window.audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        osc.start(now);
        osc.stop(now + 0.05);
        
      } else if (type === 'success') {
        // صوت إنجاز هادئ ومريح (Soft Chime/Bell) مكون من 3 نغمات متوافقة
        const frequencies = [523.25, 659.25, 783.99]; // كورد C Major
        frequencies.forEach((freq, index) => {
          const osc = window.audioCtx.createOscillator();
          const gain = window.audioCtx.createGain();
          
          osc.connect(gain);
          gain.connect(window.audioCtx.destination);
          
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          gain.gain.setValueAtTime(0, now);
          // تأخير بسيط لكل نغمة لإعطاء تأثير رنين لطيف
          const attackTime = now + (index * 0.05) + 0.02;
          gain.gain.linearRampToValueAtTime(0.05, attackTime);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
          
          osc.start(now);
          osc.stop(now + 1.5);
        });
      } else if (type === 'celebration') {
        // صوت فرقعات بسيطة متتالية للكونفيتي (بدون نغم موسيقي)
        const popTimes = [0, 0.08, 0.15, 0.2, 0.28, 0.35, 0.4];
        popTimes.forEach(delay => {
          const osc = window.audioCtx.createOscillator();
          const gain = window.audioCtx.createGain();
          osc.connect(gain);
          gain.connect(window.audioCtx.destination);
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now + delay);
          osc.frequency.exponentialRampToValueAtTime(100, now + delay + 0.05);
          
          gain.gain.setValueAtTime(0, now + delay);
          gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
          
          osc.start(now + delay);
          osc.stop(now + delay + 0.05);
        });
      }
    } catch (e) {
      // تجاهل إذا كان المتصفح لا يدعم
    }
  };

  // دالة تشغيل الاهتزاز المحدثة
  const triggerVibration = (pattern) => {
    if (!vibrationEnabled) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // تجاهل الخطأ لو كان المتصفح لا يدعم الاهتزاز
    }
  };

  // استرجاع البيانات وتحديد الوقت تلقائياً
  useEffect(() => {
    const hour = new Date().getHours();
    let currentPeriod = 'sleep';
    
    // الخوارزمية الجديدة لـ 4 فترات
    if (hour >= 3 && hour < 6) {
        currentPeriod = 'wake'; // من 3 الفجر إلى 6 صباحاً استيقاظ
    } else if (hour >= 6 && hour < 15) {
        currentPeriod = 'morning'; // من 6 صباحاً إلى 3 عصراً صباح
    } else if (hour >= 15 && hour < 20) { 
        currentPeriod = 'evening'; // من 3 عصراً إلى 8 مساءً مساء
    } else { 
        currentPeriod = 'sleep'; // ما عدا ذلك نوم
    }
    
    setActiveTab(currentPeriod);

    // تصفير التقدم عند انتقال الوقت
    const lastPeriod = localStorage.getItem('lastSavedPeriod');
    if (lastPeriod && lastPeriod !== currentPeriod) {
      localStorage.removeItem('adhkarProgress'); 
      setProgress({}); 
    }
    localStorage.setItem('lastSavedPeriod', currentPeriod);

    // استرجاع بيانات التقدم المحفوظة
    try {
      const savedProgress = localStorage.getItem('adhkarProgress');
      if (savedProgress && lastPeriod === currentPeriod) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (e) {
      setProgress({});
    }

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') setIsDarkMode(true);

    const savedFontSize = localStorage.getItem('fontSizeIndex');
    if (savedFontSize) setFontSizeIndex(parseInt(savedFontSize));

    // استرجاع إعدادات الصوت والاهتزاز
    const savedSound = localStorage.getItem('soundEnabled');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    const savedVibration = localStorage.getItem('vibrationEnabled');
    if (savedVibration !== null) setVibrationEnabled(savedVibration === 'true');

    // حساب المواظبة اليومية (Streaks)
    const todayStr = new Date().toLocaleDateString('en-CA');
    const lastActive = localStorage.getItem('lastActiveDate');
    let currentStreak = parseInt(localStorage.getItem('streakCount') || '0', 10);
    
    if (lastActive !== todayStr) {
      if (lastActive) {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) currentStreak += 1;
        else currentStreak = 1; 
      } else {
        currentStreak = 1; 
      }
      localStorage.setItem('lastActiveDate', todayStr);
      localStorage.setItem('streakCount', currentStreak.toString());
    }
    setStreak(currentStreak);

    // استرجاع المسبحة الحرة
    const savedTasbeehCount = localStorage.getItem('tasbeehCount');
    if (savedTasbeehCount) setTasbeehCount(parseInt(savedTasbeehCount, 10));

  }, []);

  // حفظ التغييرات 
  useEffect(() => {
    localStorage.setItem('adhkarProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('vibrationEnabled', vibrationEnabled.toString());
  }, [vibrationEnabled]);

  useEffect(() => {
    localStorage.setItem('tasbeehCount', tasbeehCount.toString());
  }, [tasbeehCount]);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('fontSizeIndex', fontSizeIndex.toString());
  }, [fontSizeIndex]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // فلترة الأذكار حسب التبويب النشط (بدون أذكار التعار)
  const currentTabAdhkar = useMemo(() => {
    return adhkarData.filter(dhikr => {
      if (activeTab === 'wake') return dhikr.wakeOnly && !dhikr.isTaar;
      if (activeTab === 'morning') return !dhikr.eveningOnly && !dhikr.sleepOnly && !dhikr.wakeOnly;
      if (activeTab === 'evening') return !dhikr.morningOnly && !dhikr.sleepOnly && !dhikr.wakeOnly;
      if (activeTab === 'sleep') return dhikr.sleepOnly;
      return true;
    });
  }, [activeTab]);

  // أذكار التعار مفصولة
  const taarAdhkar = useMemo(() => {
    return adhkarData.filter(dhikr => dhikr.isTaar);
  }, []);

  // حساب النسبة المئوية للتقدم الكلي في التبويب الحالي بطريقة نفسية (كل بطاقة لها وزن متساوٍ)
  const totalProgressPercentage = useMemo(() => {
    if (currentTabAdhkar.length === 0) return 0;
    
    const totalCards = currentTabAdhkar.length;
    let isAllCompleted = true;
    
    const currentProgress = currentTabAdhkar.reduce((acc, curr) => {
      const count = progress[`${activeTab}-${curr.id}`] || 0;
      if (count < curr.target) {
        isAllCompleted = false;
      }
      // نسبة إنجاز هذه البطاقة تحديداً (من 0 إلى 1)
      const cardCompletion = Math.min(count, curr.target) / curr.target;
      return acc + cardCompletion;
    }, 0);
    
    if (isAllCompleted) return 100;
    
    // النسبة النهائية هي مجموع إنجاز البطاقات مقسوماً على عددها واستخدام floor لتجنب التقريب لـ 100
    return Math.floor((currentProgress / totalCards) * 100);
  }, [currentTabAdhkar, progress, activeTab]);

  // مراقبة الوصول لنسبة 100% لتشغيل الاحتفال البصري
  useEffect(() => {
    if (totalProgressPercentage === 100 && currentTabAdhkar.length > 0) {
      setShowConfetti(true);
      playSound('celebration');
      // اهتزاز مميز للاحتفال
      triggerVibration([100, 50, 100, 50, 100, 50, 200]); 
      
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // إخفاء التأثير بعد 5 ثوان
      
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [totalProgressPercentage, currentTabAdhkar.length]);

  // تحديث العداد المحدث بالصوت
  const handleDhikrClick = (id, target) => {
    const key = `${activeTab}-${id}`;
    setProgress((prev) => {
      const current = prev[key] || 0;
      if (current < target) {
        const newCount = current + 1;
        if (newCount === target) {
          triggerVibration([100, 50, 100]); 
          playSound('success');
        } else {
          triggerVibration(50);
          playSound('click');
        }
        return { ...prev, [key]: newCount };
      }
      return prev;
    });
  };

  // تصفير ذكر واحد
  const resetSingleDhikr = (id) => {
    const key = `${activeTab}-${id}`;
    setProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[key];
      return newProgress;
    });
  };

  // تصفير كل الأذكار في التبويب الحالي
  const resetAllProgress = () => {
    setProgress(prev => {
      const newProgress = { ...prev };
      Object.keys(newProgress).forEach(key => {
        if (key.startsWith(`${activeTab}-`)) {
          delete newProgress[key];
        }
      });
      return newProgress;
    });
  };

  // دوال المسبحة الحرة
  const handleTasbeehClick = () => {
    setTasbeehCount(prev => prev + 1);
    triggerVibration(50);
    playSound('click');
  };

  const resetTasbeeh = () => {
    setTasbeehCount(0);
  };

  return (
    <div dir="rtl" className={`min-h-screen font-cairo transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <style dangerouslySetInnerHTML={globalStyles} />
      
      {/* --- تأثير الاحتفال بالإنجاز (Confetti) --- */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="confetti absolute w-2 h-4 sm:w-3 sm:h-6"
              style={{
                left: `${Math.random() * 100}vw`,
                backgroundColor: ['#14b8a6', '#facc15', '#a855f7', '#ec4899', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 6)],
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* --- شريط التنقل العلوي --- */}
      <header className="sticky top-0 z-40 shadow-md bg-teal-600 dark:bg-slate-800 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">أذكار المسلم</h1>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse md:space-x-4">
            
            {/* شعلة المواظبة اليومية */}
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-100 px-2.5 py-1 rounded-full text-sm md:text-base font-bold border border-yellow-400/30" title="أيام المواظبة المتتالية">
                <Flame className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                <span>{streak}</span>
              </div>
            )}

            {/* زر المسبحة الحرة */}
            <button 
              onClick={() => setShowTasbeehModal(true)} 
              className="flex items-center gap-1 md:gap-2 p-2 px-3 rounded-full md:rounded-xl bg-teal-700/50 hover:bg-teal-700 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition text-white font-bold shadow-sm"
              title="المسبحة الحرة"
            >
              <Target className="w-5 h-5 md:w-6 md:h-6" />
              <span className="hidden md:inline text-sm">المسبحة</span>
            </button>

            <button 
              onClick={() => setShowSettingsModal(true)} 
              className="p-2 rounded-full bg-teal-700/50 hover:bg-teal-700 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition" 
              aria-label="إعدادات التطبيق"
            >
              <Settings className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full bg-teal-700/50 hover:bg-teal-700 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition" 
              aria-label="تغيير المظهر"
            >
              {isDarkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6" /> : <Moon className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>

        {/* --- التبويبات الـ 4 --- */}
        <div className="flex border-t border-teal-500 dark:border-slate-700">
          <button 
            onClick={() => setActiveTab('wake')}
            className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm md:text-xl transition-colors ${activeTab === 'wake' ? 'bg-teal-700 dark:bg-slate-700 text-white border-b-4 border-sky-400' : 'text-teal-100 hover:bg-teal-500 dark:hover:bg-slate-600'}`}
          >
            الاستيقاظ
          </button>
          <button 
            onClick={() => setActiveTab('morning')}
            className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm md:text-xl transition-colors ${activeTab === 'morning' ? 'bg-teal-700 dark:bg-slate-700 text-white border-b-4 border-yellow-400' : 'text-teal-100 hover:bg-teal-500 dark:hover:bg-slate-600'}`}
          >
            الصباح
          </button>
          <button 
            onClick={() => setActiveTab('evening')}
            className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm md:text-xl transition-colors ${activeTab === 'evening' ? 'bg-teal-700 dark:bg-slate-700 text-white border-b-4 border-indigo-400' : 'text-teal-100 hover:bg-teal-500 dark:hover:bg-slate-600'}`}
          >
            المساء
          </button>
          <button 
            onClick={() => setActiveTab('sleep')}
            className={`flex-1 py-3 text-center font-bold text-xs sm:text-sm md:text-xl transition-colors ${activeTab === 'sleep' ? 'bg-teal-700 dark:bg-slate-700 text-white border-b-4 border-purple-400' : 'text-teal-100 hover:bg-teal-500 dark:hover:bg-slate-600'}`}
          >
            النوم
          </button>
        </div>
        
        {/* --- شريط التقدم --- */}
        <div className="w-full bg-black/10 dark:bg-black/20 h-1.5 shadow-inner">
          <div 
            className={`h-full transition-all duration-500 ease-out flex justify-end items-center 
              ${activeTab === 'wake' ? 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]' : 
                activeTab === 'sleep' ? 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.6)]' : 
                'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]'}`}
            style={{ width: `${totalProgressPercentage}%` }}
          >
            {totalProgressPercentage > 10 && (
              <span className="text-[9px] font-bold text-teal-900 px-1 select-none">
                {totalProgressPercentage}%
              </span>
            )}
          </div>
        </div>
      </header>

      {/* --- نافذة المسبحة الحرة (Modal) --- */}
      {showTasbeehModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 relative border border-slate-200 dark:border-slate-700 flex flex-col items-center">
            <button 
              onClick={() => setShowTasbeehModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-8 text-teal-700 dark:text-teal-400 flex items-center gap-2">
              <Target className="w-7 h-7" />
              المسبحة الحرة
            </h3>

            {/* زر العداد الضخم */}
            <button
              onClick={handleTasbeehClick}
              className="w-48 h-48 md:w-56 md:h-56 bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-full shadow-[0_10px_30px_rgba(20,184,166,0.3)] dark:shadow-[0_10px_30px_rgba(13,148,136,0.3)] flex items-center justify-center text-white text-5xl md:text-6xl font-extrabold active:scale-95 transition-all mb-8 border-4 border-teal-200 dark:border-teal-400"
            >
              {tasbeehCount}
            </button>

            <button
              onClick={resetTasbeeh}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl transition font-bold text-lg"
            >
              <RotateCcw className="w-5 h-5" />
              تصفير المسبحة
            </button>
          </div>
        </div>
      )}

      {/* --- نافذة الإعدادات --- */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-teal-700 dark:text-teal-400 border-b pb-4 dark:border-slate-700">
              <Settings className="w-6 h-6" />
              إعدادات التطبيق
            </h3>
            
            <div className="space-y-4">

              {/* أزرار الصوت والاهتزاز */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${soundEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  {soundEnabled ? <Volume2 className="w-6 h-6 mb-2" /> : <VolumeX className="w-6 h-6 mb-2 opacity-50" />}
                  <span className="font-bold text-sm">الصوت</span>
                </button>
                <button 
                  onClick={() => setVibrationEnabled(!vibrationEnabled)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${vibrationEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  {vibrationEnabled ? <Vibrate className="w-6 h-6 mb-2" /> : <VibrateOff className="w-6 h-6 mb-2 opacity-50" />}
                  <span className="font-bold text-sm">الاهتزاز</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">حجم الخط</span>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                  <button 
                    onClick={() => setFontSizeIndex(p => Math.min(p + 1, fontSizes.length - 1))}
                    disabled={fontSizeIndex === fontSizes.length - 1}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 rounded-md transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-lg min-w-[20px] text-center">{fontSizeIndex + 1}</span>
                  <button 
                    onClick={() => setFontSizeIndex(p => Math.max(p - 1, 0))}
                    disabled={fontSizeIndex === 0}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 rounded-md transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={showTakhreej} onChange={(e) => setShowTakhreej(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">عرض تخريج الأحاديث</span>
              </label>
              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={showFadl} onChange={(e) => setShowFadl(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">عرض فضل الذكر</span>
              </label>
              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={showFawaid} onChange={(e) => setShowFawaid(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">عرض الفوائد اللغوية</span>
              </label>
            </div>
            
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="mt-8 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition shadow-md"
            >
              حفظ وإغلاق
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        
        {/* --- تنبيه أوقات الأذكار --- */}
        <div className="mb-8 p-5 bg-teal-50 dark:bg-slate-800 rounded-2xl shadow-sm border border-teal-100 dark:border-slate-700 transition-all duration-300">
          <div className="flex items-start gap-3">
            {activeTab === 'sleep' ? (
                <Moon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
            ) : activeTab === 'wake' ? (
                <Sunrise className="w-6 h-6 text-sky-500 dark:text-sky-400 shrink-0 mt-1" />
            ) : (
                <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0 mt-1" />
            )}
            <div>
              <h2 className="text-lg font-bold text-teal-800 dark:text-teal-300 mb-2">
                {activeTab === 'sleep' ? 'سنن وآداب النوم' : activeTab === 'wake' ? 'عند الاستيقاظ والتعار من الليل' : 'وقت الأذكار المفضل'}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {activeTab === 'sleep' ? (
                  <span>
                    يُستحب للمسلم إذا أتى فراشه أن يكون على <strong className="text-indigo-700 dark:text-indigo-400">طهارة</strong>، وأن <strong className="text-indigo-700 dark:text-indigo-400">ينفض فراشه</strong> بداخلة إزاره، وأن يضطجع على <strong className="text-indigo-700 dark:text-indigo-400">جنبه الأيمن</strong>، وأن يضع يده تحت خده الأيمن، ثم يأتي بالأذكار.
                  </span>
                ) : activeTab === 'wake' ? (
                  <span>
                    يُستحب للمسلم أول ما يستيقظ من نومه أن <strong className="text-sky-700 dark:text-sky-400">يمسح النوم عن وجهه</strong> بيده، ثم يأتي بأذكار الاستيقاظ. ولمن استيقظ من الليل وتَقَلَّب أن يأتي بذكر <strong className="text-sky-700 dark:text-sky-400">التعار من الليل</strong> فدعوته مستجابة.
                  </span>
                ) : activeTab === 'morning' ? (
                  <span>
                    <strong className="text-teal-700 dark:text-teal-400">وقت الصباح:</strong> يبدأ من طلوع الفجر الصادق، ويمتد إلى شروق الشمس.
                  </span>
                ) : (
                  <span>
                    <strong className="text-teal-700 dark:text-teal-400">وقت المساء:</strong> يبدأ من بعد صلاة العصر، ويمتد إلى غروب الشمس.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* --- زر أذكار التعار - يظهر فقط في نافذة الاستيقاظ --- */}
        {activeTab === 'wake' && (
          <div className="mb-8">
            <button
              onClick={() => setShowTaarSection(!showTaarSection)}
              className={`w-full p-5 rounded-3xl flex items-center justify-between transition-all shadow-lg active:scale-95 ${showTaarSection ? 'bg-slate-800 text-white' : 'bg-gradient-to-r from-teal-600 to-teal-800 text-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${showTaarSection ? 'bg-slate-700' : 'bg-white/20'}`}>
                  <MoonStar className={showTaarSection ? 'text-yellow-400' : 'text-white'} />
                </div>
                <div className="text-right">
                  <h3 className="font-black text-lg">أذكار التعار من الليل</h3>
                  <p className="text-xs opacity-80">إذا استيقظت أو تقلبت في الليل</p>
                </div>
              </div>
              {showTaarSection ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* --- قسم التعار المنسدل --- */}
            {showTaarSection && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl text-amber-800 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-800 flex gap-3">
                  <Info className="w-5 h-5 shrink-0" />
                  <p>هذه الأذكار لها فضل عظيم جداً؛ فمن قالها ثم دعا استُجيب له، وإن توضأ وصلى قُبلت صلاته.</p>
                </div>
                
                {taarAdhkar.map(dhikr => {
                  const count = progress[`${activeTab}-${dhikr.id}`] || 0;
                  const done = count >= dhikr.target;
                  return (
                    <div key={dhikr.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                      <p className={`font-bold leading-relaxed mb-4 ${fontSizes[fontSizeIndex]}`}>{dhikr.textMorning}</p>
                      
                      {showTakhreej && dhikr.takhreej && (
                        <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl mb-3 border border-slate-100 dark:border-slate-800">
                          <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                          <span><strong className="text-slate-700 dark:text-slate-300">التخريج:</strong> {dhikr.takhreej}</span>
                        </div>
                      )}
                      {showFadl && dhikr.fadl && (
                        <div className="flex items-start gap-3 text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl mb-6 border border-rose-100 dark:border-rose-900/20">
                          <Star className="w-4 h-4 shrink-0 mt-0.5" />
                          <span><strong>فضل الذكر:</strong> {dhikr.fadl}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleDhikrClick(dhikr.id, dhikr.target)}
                        className={`w-full py-4 rounded-xl font-black text-lg shadow-md transition-all flex items-center justify-center gap-2 ${done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}
                      >
                        {done ? <CheckCircle className="mx-auto" /> : `كرر: ${count} / ${dhikr.target}`}
                      </button>
                    </div>
                  );
                })}
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-full my-4" />
              </div>
            )}
          </div>
        )}

        {/* --- عنوان القسم وزر تصفير الكل --- */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            {activeTab === 'morning' && 'أذكار الصباح'}
            {activeTab === 'evening' && 'أذكار المساء'}
            {activeTab === 'sleep' && 'أذكار النوم'}
            {activeTab === 'wake' && 'أذكار الاستيقاظ'}
          </h2>
          <button 
            onClick={resetAllProgress}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors text-sm md:text-base font-bold shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            تصفير الكل
          </button>
        </div>

        {/* --- قائمة الأذكار الرئيسية (تتغير حسب التبويب) --- */}
        <div className="space-y-6 md:space-y-8">
          {currentTabAdhkar.map((dhikr) => {
            const currentCount = progress[`${activeTab}-${dhikr.id}`] || 0;
            const isCompleted = currentCount >= dhikr.target;
            const percentage = dhikr.target > 1 ? (currentCount / dhikr.target) : (currentCount > 0 ? 1 : 0);
            
            const displayText = (activeTab === 'evening' && dhikr.textEvening) ? dhikr.textEvening : dhikr.textMorning;

            let counterBgClass = "bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-600 text-white shadow-lg";
            
            if (isCompleted) {
              counterBgClass = "bg-emerald-100 text-emerald-800 border-2 border-emerald-400 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-600 cursor-default";
            } else if (activeTab === 'sleep') {
              if (percentage > 0.6) counterBgClass = "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 text-white shadow-lg";
              else if (percentage > 0.3) counterBgClass = "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 text-white shadow-lg";
              else counterBgClass = "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 text-white shadow-lg";
            } else if (activeTab === 'wake') {
              if (percentage > 0.6) counterBgClass = "bg-sky-400 hover:bg-sky-500 dark:bg-sky-500 text-white shadow-lg";
              else if (percentage > 0.3) counterBgClass = "bg-blue-400 hover:bg-blue-500 dark:bg-blue-500 text-white shadow-lg";
              else counterBgClass = "bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 text-white shadow-lg";
            } else {
              if (percentage > 0.6) counterBgClass = "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 text-white shadow-lg";
              else if (percentage > 0.3) counterBgClass = "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 text-white shadow-lg";
            }

            return (
              <div 
                key={dhikr.id} 
                id={`dhikr-${dhikr.id}`}
                className={`card-hover relative bg-white dark:bg-slate-800 rounded-3xl shadow-sm border ${isCompleted ? 'border-emerald-300 dark:border-emerald-700/50 opacity-90' : 'border-slate-200 dark:border-slate-700'} overflow-hidden scroll-mt-24`}
              >
                <div className={`py-3 px-6 text-sm md:text-base font-bold border-b border-slate-200 dark:border-slate-700 
                  ${activeTab === 'sleep' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300' : 
                    activeTab === 'wake' ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-800 dark:text-sky-300' : 
                    'bg-slate-100 dark:bg-slate-700/40 text-teal-700 dark:text-teal-300'}`}>
                  {dhikr.category}
                </div>

                <div className="p-6 md:p-8">
                  <p className={`font-cairo font-semibold leading-[2.4] md:leading-[2.6] text-slate-800 dark:text-slate-100 mb-8 whitespace-pre-line text-justify md:text-right ${fontSizes[fontSizeIndex]}`}>
                    {displayText}
                  </p>

                  <div className="space-y-3 mb-8">
                    {showTakhreej && dhikr.takhreej && (
                      <div className="flex items-start gap-3 text-sm md:text-base text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <BookOpen className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
                        <span><strong className="text-slate-700 dark:text-slate-300">التخريج:</strong> {dhikr.takhreej}</span>
                      </div>
                    )}
                    {showFadl && dhikr.fadl && (
                      <div className="flex items-start gap-3 text-sm md:text-base text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/20">
                        <Star className="w-5 h-5 shrink-0 mt-0.5" />
                        <span><strong>فضل الذكر:</strong> {dhikr.fadl}</span>
                      </div>
                    )}
                    {showFawaid && dhikr.fawaid && (
                      <div className="flex items-start gap-3 text-sm md:text-base text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <span><strong>فائدة:</strong> {dhikr.fawaid}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row-reverse gap-3 items-stretch justify-center w-full md:w-5/6 mx-auto">
                    <button
                      onClick={() => resetSingleDhikr(dhikr.id)}
                      className="px-5 md:px-8 rounded-3xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-500 hover:text-slate-700 dark:text-slate-300 transition-all flex justify-center items-center active:scale-95 border border-slate-200 dark:border-slate-600"
                      title="إعادة تصفير هذا الذكر"
                    >
                      <RotateCcw className="w-7 h-7 md:w-8 md:h-8" />
                    </button>

                    <button
                      onClick={() => handleDhikrClick(dhikr.id, dhikr.target)}
                      disabled={isCompleted}
                      className={`flex-1 relative overflow-hidden h-[120px] md:h-[140px] rounded-3xl font-bold text-2xl md:text-4xl transition-all duration-300 flex justify-center items-center gap-4 active:scale-95 ${counterBgClass}`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-8 h-8 md:w-10 md:h-10" />
                          <span>تم الانتهاء</span>
                        </>
                      ) : (
                        <>
                          <span className="bg-black/10 dark:bg-white/10 px-5 py-2 rounded-2xl text-3xl md:text-5xl font-extrabold tracking-wider z-10">
                            {currentCount} <span className="text-xl md:text-2xl text-white/70">/ {dhikr.target}</span>
                          </span>
                          <span className="hidden md:inline text-white/90 z-10 font-semibold">اضغط للعد</span>
                        </>
                      )}
                      
                      {!isCompleted && dhikr.target > 1 && currentCount > 0 && (
                        <div 
                          className="absolute top-0 right-0 h-full bg-black/10 z-0 transition-all duration-300" 
                          style={{ width: `${percentage * 100}%` }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-slate-200 dark:bg-slate-950 py-8 text-center text-slate-600 dark:text-slate-400 mt-12 border-t border-slate-300 dark:border-slate-800">
        <p className="font-bold text-lg">تنسيق: قصي مسالمة</p>
        <p className="text-sm mt-2 opacity-80">تم التصميم بناءًا على رسائل د. مطلق الجاسر</p>
      </footer>
    </div>
  );
}