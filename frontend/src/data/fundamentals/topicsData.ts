// Auto-generated from web-fundamental-crash-course
export interface TopicContent {
  id: number;
  icon: string;
  depth: string;
  tr: {
    title: string;
    summary: string;
    html: string;
  };
  en: {
    title: string;
    summary: string;
    html: string;
  };
}

export interface LearningResource {
  title: string;
  source: string;
  url: string;
  additional?: {
    title: string;
    source: string;
    url: string;
  };
}

export interface GlossaryEntry {
  terms: string[];
  title: string;
  topic: number;
  definition: string;
}

export interface FaqItem {
  tr: { q: string; a: string };
  en: { q: string; a: string };
}

export const FUNDAMENTALS_STR = {
  "tr": {
    "brandSub": "STAJ EĞİTİM MERKEZİ",
    "drawerTitle": "İçindekiler",
    "navTopics": "Konular",
    "navUtil": "Diğer",
    "heroEyebrow": "STAJYER EĞİTİM PROGRAMI",
    "heroTitleA": "Yüzeyin",
    "heroTitleHL": "altına",
    "heroTitleB": "dalın.",
    "heroLede": "Web geliştirmenin temelini, bir buzdağının görünmeyen kısmı gibi katman katman keşfedin. 11 konu, yüzeyden derine doğru sıralanır — her biri bir öncekinin üzerine inşa edilir.",
    "metaTopics": "Konu",
    "metaLevel": "Seviye",
    "metaLevelVal": "Başlangıç",
    "metaFormat": "Format",
    "metaFormatVal": "Kendi hızında",
    "waterline": "SU YÜZEYİ — BURADAN AŞAĞIYA İNİYORUZ",
    "quizTag": "BÖLÜM 12",
    "quizTitle": "Bilgini Test Et",
    "quizDesc": "11 konuyu bitirdikten sonra 20 soru ve 5 eşleştirmeden oluşan 100 puanlık quiz ile kendini sına. Her denemede içerikler soru havuzundan rastgele seçilir.",
    "quizBtn": "Quiz'e Git",
    "quizStart": "Quiz'i Başlat",
    "quizNext": "Sonraki Soru",
    "quizFinish": "Sonuçları Gör",
    "quizRestart": "Yeniden Başla",
    "faqTag": "DAHA FAZLA BİLGİ",
    "faqTitle": "More Knowledge",
    "backHome": "Menüye Dön",
    "allTopics": "Tüm Konular",
    "prevTopic": "Önceki",
    "nextTopic": "Sonraki",
    "toQuiz": "Quiz'e Geç",
    "footerLine": "Staj Eğitim Programı",
    "footerLine2": "11 Konu · Quiz · More Knowledge",
    "depthLabel": "derinlik"
  },
  "en": {
    "brandSub": "INTERNSHIP TRAINING HUB",
    "drawerTitle": "Contents",
    "navTopics": "Topics",
    "navUtil": "More",
    "heroEyebrow": "INTERN TRAINING PROGRAM",
    "heroTitleA": "Dive",
    "heroTitleHL": "beneath",
    "heroTitleB": "the surface.",
    "heroLede": "Explore the fundamentals of web development layer by layer, like the hidden mass of an iceberg. 11 topics, ordered from tip to depth — each one builds on the last.",
    "metaTopics": "Topics",
    "metaLevel": "Level",
    "metaLevelVal": "Beginner",
    "metaFormat": "Format",
    "metaFormatVal": "Self-paced",
    "waterline": "WATERLINE — DESCENDING FROM HERE",
    "quizTag": "CHAPTER 12",
    "quizTitle": "Test Your Knowledge",
    "quizDesc": "After all 11 topics, take a 100-point quiz with 20 questions and 5 matches. Each attempt draws a new random selection from the question pools.",
    "quizBtn": "Go to Quiz",
    "quizStart": "Start Quiz",
    "quizNext": "Next Question",
    "quizFinish": "View Results",
    "quizRestart": "Restart",
    "faqTag": "MORE KNOWLEDGE",
    "faqTitle": "More Knowledge",
    "backHome": "Back to Menu",
    "allTopics": "All Topics",
    "prevTopic": "Previous",
    "nextTopic": "Next",
    "toQuiz": "Go to Quiz",
    "footerLine": "Internship Training Program",
    "footerLine2": "11 Topics · Quiz · More Knowledge",
    "depthLabel": "depth"
  }
};

export const LEARNING_RESOURCES: Record<number, LearningResource> = {
  "1": {
    "title": "How the Web Works",
    "source": "MDN Web Docs",
    "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works"
  },
  "2": {
    "title": "Client-Server Overview",
    "source": "MDN Web Docs",
    "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview"
  },
  "3": {
    "title": "Overview of HTTP",
    "source": "MDN Web Docs",
    "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview"
  },
  "4": {
    "title": "Web API Design Best Practices",
    "source": "Microsoft Learn",
    "url": "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design"
  },
  "5": {
    "title": "Session, Cookie, JWT, Token, SSO, and OAuth 2.0",
    "source": "ByteByteGo",
    "url": "https://bytebytego.com/guides/session-cookie-jwt-token-sso-and-oauth-2/"
  },
  "6": {
    "title": "Web Security",
    "source": "MDN Web Docs",
    "url": "https://developer.mozilla.org/en-US/docs/Web/Security",
    "additional": {
      "title": "Web Performance",
      "source": "MDN Web Docs",
      "url": "https://developer.mozilla.org/en-US/docs/Web/Performance"
    }
  },
  "7": {
    "title": "What Is a Database?",
    "source": "AWS",
    "url": "https://aws.amazon.com/what-is/database/"
  },
  "8": {
    "title": "Best Practices for Background Jobs",
    "source": "Microsoft Learn",
    "url": "https://learn.microsoft.com/en-us/azure/architecture/best-practices/background-jobs"
  },
  "9": {
    "title": "Learn Testing",
    "source": "Google web.dev",
    "url": "https://web.dev/learn/testing"
  },
  "10": {
    "title": "Publishing Your Website",
    "source": "MDN Web Docs",
    "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Publishing_your_website"
  },
  "11": {
    "title": "Hello World",
    "source": "GitHub Docs",
    "url": "https://docs.github.com/en/get-started/using-github/hello-world"
  }
};

export const FUNDAMENTALS_TOPICS: TopicContent[] = [
  {
    "id": 1,
    "icon": "globe",
    "depth": "-40 m",
    "tr": {
      "title": "Web Nedir ve Neden Önemlidir?",
      "summary": "Web (World Wide Web), internet üzerinden birbirine bağlanan web sayfaları ve uygulamalardan oluşan bir bilgi sistemidir.",
      "html": "\n      <div class=\"tsec\">\n        <h3>Web Nedir?</h3>\n        <p>Web (World Wide Web), internet üzerinden birbirine bağlanan web sayfaları ve uygulamalardan oluşan bir bilgi sistemidir.</p>\n        <p>İnternet büyük bir ağdır. Web, bu ağın üzerinde çalışan hizmetlerden yalnızca biridir.</p>\n        <p>İnterneti bir şehir olarak düşün:</p>\n        <ul class=\"plain\">\n          <li>İnternet → Şehirdeki tüm yollar</li>\n          <li>Web → Bu yollar üzerindeki binalar</li>\n          <li>Web siteleri → Binalar</li>\n          <li>Sayfalar → Odalar</li>\n        </ul>\n        <p>Gerçek Hayattan Örnek</p>\n        <p>Google'ı açıp \"en yakın restoran\" diye aradığında:</p>\n        <ul class=\"plain\">\n          <li>Tarayıcı isteğini gönderir.</li>\n          <li>Google'ın sunucuları bir yanıt gönderir.</li>\n          <li>Sonuçları ekranında görürsün.</li>\n        </ul>\n        <p>Bu sürecin tamamı Web sayesinde gerçekleşir.</p>\n        <p>Neden Önemli?</p>\n        <p>Web'in nasıl çalıştığını anlamadan şunları tam olarak kavrayamazsın:</p>\n        <ul class=\"plain\">\n          <li>Frontend kodunun neden bu şekilde çalıştığını,</li>\n          <li>Backend'in neden gerekli olduğunu,</li>\n          <li>API'lerin arkasındaki mantığı,</li>\n          <li>Verinin nasıl taşındığını</li>\n        </ul>\n        <p>Bu nedenle bir sonraki bölümde, bir web sitesini ziyaret ettiğinde perde arkasında kimin ne yaptığını (İstemci ve Sunucu) öğreneceğiz.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>İnternet, Web ve WWW Protokolleri</h3>\n        <p>Başlangıç düzeyinde Web'in internetin \"üzerinde\" çalıştığını bilmek yeterlidir. Orta düzeyde ise sıklıkla birbirinin yerine kullanılan üç katmanı ayırmak faydalıdır:</p>\n        <ul class=\"plain\">\n          <li>İnternet — fiziksel/mantıksal ağ katmanı: kablolar, yönlendiriciler ve makineler arasında ham paketleri taşıyan IP protokolü.</li>\n          <li>WWW (World Wide Web) — HTTP/HTTPS, HTML ve bağlantılar kullanarak internet üzerinde çalışan bir uygulamadır. Birçok internet hizmetinden biridir.</li>\n          <li>Diğer internet hizmetleri — e-posta (SMTP), dosya aktarımı (FTP), gerçek zamanlı mesajlaşma ve akış protokolleri de internet üzerinde çalışır; ancak bunlar \"Web\" değildir.</li>\n        </ul>\n        <p>Orta düzeyde faydalı bir diğer ayrım, statik ve dinamik içeriktir:</p>\n        <ul class=\"plain\">\n          <li>Statik içerik — her ziyaretçiye aynı HTML/CSS/JS dosyası sunulur (örneğin basit bir açılış sayfası).</li>\n          <li>Dinamik içerik — sunucu, sayfayı veya yanıtı her istek için çoğunlukla bir veritabanına dayanarak oluşturur (örneğin kişiselleştirilmiş Instagram akışın).</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Statik hosting ile dinamik backend arasında seçim yapmak, gerçek bir projedeki ilk mimari kararlardan biridir. Maliyeti, ölçeklenebilirliği ve yazman gereken sunucu tarafı kodun miktarını doğrudan etkiler.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>Web Nasıl Çalışır?</h3>\n        <p>Temel düzeyde Web, tarayıcının sunucudan bir sayfa istemesi ve sunucunun bu sayfayı göndermesiyle çalışır. Bu basit alışverişin altında belirli bir adımlar dizisi vardır.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Bir İsteğin Tam Yaşam Döngüsü</h3>\n        <p>Bir URL yazıp Enter'a bastığında, her biri bir öncekinin üzerine kurulan birkaç farklı adım sırayla gerçekleşir:</p>\n        <ul class=\"plain\">\n          <li>1. DNS Çözümlemesi — tarayıcı, DNS sunucusundan alan adını (örneğin example.com) bir IP adresine çevirmesini ister.</li>\n          <li>2. TCP Bağlantısı — tarayıcı üç aşamalı el sıkışma (SYN, SYN-ACK, ACK) kullanarak bu IP adresine bir TCP bağlantısı açar.</li>\n          <li>3. TLS El Sıkışması (HTTPS) — site HTTPS kullanıyorsa gerçek veriler gönderilmeden önce şifreli bir kanal kurulur (6. bölümde ayrıntılı olarak ele alınır).</li>\n          <li>4. HTTP İsteği — tarayıcı güvenli bağlantı üzerinden belirli bir kaynağı isteyen bir HTTP isteği gönderir.</li>\n          <li>5. Sunucuda İşleme — sunucu isteği yönlendirir, backend mantığını çalıştırır, gerekirse veritabanını sorgular ve yanıtı oluşturur.</li>\n          <li>6. HTTP Yanıtı — sunucu durum kodunu, header'ları ve gövdeyi (HTML, JSON vb.) geri gönderir.</li>\n          <li>7. Rendering — tarayıcı HTML'i ayrıştırır, DOM'u oluşturur, CSS'i uygular, JavaScript'i çalıştırır ve pikselleri ekrana çizer.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Performans sorunlarını gidermek neredeyse her zaman bu yedi adımdan hangisinin yavaş olduğunu belirlemekle başlar. Yavaş DNS çözümlemesi, yavaş veritabanı sorgusu ve yavaş JavaScript paketi kullanıcıya aynı şekilde hissettirir (\"sayfa yükleniyor\"); ancak tamamen farklı çözümler gerektirir.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>Frontend ve Backend Rolleri</h3>\n        <p>İstemci tarafında çalışan koda frontend, sunucu tarafında çalışan koda backend denir. Burada da önceki bölümdeki restoran benzetmesini kullanmayı sürdüreceğiz.</p>\n        <p>İstemci Tarafı ve Sunucu Tarafı Mantık Arasındaki Fark Nedir?</p>\n        <p>Temel fark, kodun nerede çalıştığıdır.</p>\n        <ul class=\"plain\">\n          <li>İstemci tarafı: Kod, kullanıcının kendi cihazında (tarayıcıda) çalışır. Tarayıcı bu kodu indirir ve kendisi çalıştırır. Kullanıcı, tarayıcının \"geliştirici araçları\" ile kodu görebilir, hatta değiştirebilir.</li>\n          <li>Sunucu tarafı: Kod sunucuda çalışır. Kullanıcı bu kodu doğrudan göremez veya değiştiremez; yalnızca sonucunu (HTML sayfası, JSON yanıtı vb.) alır.</li>\n        </ul>\n        <p>Bu ayrım en çok güvenlik açısından önemlidir: şifre kontrolü, ödeme veya veritabanı erişimi gibi hassas işlemler istemci tarafında yapılmaz; çünkü istemci tarafındaki her şey kullanıcı tarafından görülebilir ve değiştirilebilir. Bu nedenle bu tür işler her zaman sunucu tarafında yapılır.</p>\n        <h4 class=\"content-subheading\">Frontend</h4>\n        <p>Kullanıcının gördüğü ve etkileşim kurduğu kısımdır.</p>\n        <p>Örneğin: düğmeler, menüler, renkler, animasyonlar ve sayfa düzeni.</p>\n        <p>Bir restoranda müşterinin gördüğü bölümdür: masalar, menü tasarımı ve dekorasyon.</p>\n        <p>Kullanılan Teknolojiler: HTML, CSS, JavaScript, React, Angular, Vue.</p>\n        <p>Neden önemli?</p>\n        <p>Kullanıcı deneyimini şekillendirir. Kötü bir frontend kullanıcıyı zorlar ve siteden ayrılmasına neden olur.</p>\n        <h4 class=\"content-subheading\">Backend</h4>\n        <p>Bir web uygulamasının görünmeyen, işlemleri yürüten kısmıdır. Görevleri:</p>\n        <ul class=\"plain\">\n          <li>Veriyi işlemek</li>\n          <li>Kullanıcıların kimliğini doğrulamak</li>\n          <li>Veritabanıyla iletişim kurmak</li>\n          <li>Güvenliği sağlamak</li>\n        </ul>\n        <p>Bir restoranda mutfak ve aşçılardır: müşteri görmez ama asıl iş burada gerçekleşir.</p>\n        <p>Kullanılan Teknolojiler: C#, Java, Python, Node.js, PHP.</p>\n        <p>Başlangıçta Sık Yapılan Hatalar</p>\n        <ul class=\"plain\">\n          <li>❌ Frontend'in yalnızca tasarımdan ibaret olduğunu düşünmek. Frontend; kullanıcı deneyimini, performansı ve veri işlemeyi de kapsar.</li>\n          <li>❌ Backend'in yalnızca veri getirmekten ibaret olduğunu düşünmek. Backend; güvenliği, yetkilendirmeyi ve iş kurallarını da kapsar.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Rendering Stratejileri ve Mimari Seçimler</h3>\n        <p>Modern framework'ler sınırları belirsizleştirdiği için orta düzey geliştiriciler, frontend/backend ayrımının ötesinde rendering işleminin nerede gerçekleştiğini de bilmelidir:</p>\n        <table class=\"tcompare\">\n          <tr><th>Strateji</th><th>HTML Nerede Oluşturulur?</th><th>Tipik Kullanım Alanı</th></tr>\n          <tr><td>CSR (İstemci Tarafında Rendering)</td><td>Sayfa yüklendikten sonra tarayıcıda, JavaScript ile</td><td>Yoğun etkileşimli paneller (örneğin basit bir React SPA)</td></tr>\n          <tr><td>SSR (Sunucu Tarafında Rendering)</td><td>Sunucuda, her istek için</td><td>Kişiselleştirme de gerektiren, SEO'nun önemli olduğu sayfalar (örneğin Next.js)</td></tr>\n          <tr><td>SSG (Statik Site Üretimi)</td><td>Dağıtımdan önce, build sırasında</td><td>Bloglar, dokümantasyon ve pazarlama sayfaları</td></tr>\n          <tr><td>Hibrit / ISR</td><td>Build sırasında ve istek başına üretimin birleşimi</td><td>Büyük e-ticaret katalogları</td></tr>\n        </table>\n        <p>Bu aşamada bilinmesi faydalı olan ilgili mimari yaklaşımlar:</p>\n        <ul class=\"plain\">\n          <li>SPA (Tek Sayfalı Uygulama) — tek bir HTML iskeleti vardır; gezinme, sayfanın tamamı yeniden yüklenmeden JavaScript tarafından yönetilir.</li>\n          <li>MPA (Çok Sayfalı Uygulama) — her gezinme işleminde yeni bir HTML sayfası için sunucuya yeni bir istek gönderilir.</li>\n          <li>API öncelikli / ayrıştırılmış mimari — backend doğrudan HTML üretmek yerine yalnızca bir API sunar; bir veya daha fazla bağımsız frontend (web, mobil) bu API'yi kullanır.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">CSR, SSR ve SSG arasında seçim yapmak yalnızca teknik bir ayrıntı değildir. SEO'yu, ilk yükleme süresini, hosting maliyetini ve çalıştırıp bakımını yapman gereken sunucu altyapısının miktarını etkiler.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>Erişilebilirlik ve SEO Temelleri</h3>\n        <p>Kodun nerede çalıştığını (istemci veya sunucu) bilmek tek başına yeterli değildir. Gerçek insanların ve arama motorlarının geliştirdiğin ürüne erişip onu kullanabilmesini iki konu daha belirler.</p>\n        <h4 class=\"content-subheading\">Erişilebilirlik (a11y)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Bir siteyi, ekran okuyucu, yalnızca klavyeyle gezinme veya sesle kontrol kullananlar dahil engelli bireylerin kullanabileceği şekilde geliştirmektir.</li>\n          <li>Gerçek Hayattan Örnek: Rampası olmayan ve menüsü yalnızca küçük harflerle basılmış bir restoran, tekerlekli sandalye kullanan veya küçük yazıları okuyamayan müşterileri fark ettirmeden geri çevirir. Yemekler iyidir ama binanın kendisi bir engeldir.</li>\n          <li>Neden Önemli?: Erişilemeyen bir site yalnızca kullanıcı kaybetme riski taşımaz; birçok ülkede erişilebilirlikle ilgili yasal gereklilikler de vardır. Doğru etiketler ve klavye desteği gibi iyileştirmeler, ürünü genellikle herkes için daha iyi hale getirir.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Semantik HTML ve Temel SEO Sinyalleri</h3>\n        <p>Erişilebilirlik ve SEO büyük ölçüde aynı temele dayanır: öğelerin yalnızca nasıl göründüğünü değil, *ne olduğunu* açıklayan HTML.</p>\n        <ul class=\"plain\">\n          <li>Semantik HTML — düğme gibi görünecek şekilde biçimlendirilmiş bir &lt;div&gt; yerine &lt;button&gt;, &lt;nav&gt;, &lt;header&gt; ve doğru başlık düzeylerini kullanmaktır. Ekran okuyucular ve arama motoru tarayıcıları sayfayı anlamak için bu yapıya dayanır.</li>\n          <li>ARIA nitelikleri — &lt;div&gt; öğelerinden oluşturulmuş özel bir açılır menü gibi, yerleşik erişilebilirlik bilgisi olmayan öğelere rol ve durum bilgisi eklemenin yoludur. Yalnızca semantik HTML tek başına yeterli olmadığında kullanılır.</li>\n          <li>Temel SEO sinyalleri — &lt;title&gt; etiketi, meta açıklaması, görsellerin alternatif metinleri ve canonical URL, arama motorunun sayfanın konusunu ve sonuçlarda nasıl listeleneceğini belirlemek için okuduğu bilgilerdir.</li>\n        </ul>\n        <p>1. bölümdeki rendering stratejisi seçimi burada yeniden önem kazanır: arama motoru tarayıcısı ilk gönderilen HTML'i okur. Bu nedenle JavaScript çalışana kadar boş kalan bir sayfanın (saf CSR) indekslenmesi, sunucuda oluşturulan bir sayfaya (SSR/SSG) göre çok daha zor olabilir.</p>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Ekran okuyucunun kullanamadığı bir açılır menü veya arama motorunun okuyamadığı, istemcide oluşturulan bir blog, backend ne kadar iyi çalışırsa çalışsın fark edilmeden kullanıcı kaybettirir. Bunlar isteğe bağlı süslemeler değil, frontend'in doğru çalışmasıyla ilgili konulardır.</p>\n      </div>"
    },
    "en": {
      "title": "What Is the Web and Why Does It Matter?",
      "summary": "The Web (World Wide Web) is an information system made up of web pages and applications that are linked to one another over the internet.",
      "html": "\n      <div class=\"tsec\">\n        <h3>What Is the Web?</h3>\n        <p>The Web (World Wide Web) is an information system made up of web pages and applications that are linked to one another over the internet.</p>\n        <p>The internet is a large network. The Web is just one of the services that runs on top of that network.</p>\n        <p>Think of the internet as a city:</p>\n        <ul class=\"plain\">\n          <li>Internet → All the roads in the city</li>\n          <li>Web → The buildings along those roads</li>\n          <li>Websites → Buildings</li>\n          <li>Pages → Rooms</li>\n        </ul>\n        <p>Real-Life Example</p>\n        <p>When you open Google and search for \"nearest restaurant\":</p>\n        <ul class=\"plain\">\n          <li>The browser sends your request.</li>\n          <li>Google's servers send back a response.</li>\n          <li>You see the results on your screen.</li>\n        </ul>\n        <p>This entire process happens thanks to the Web.</p>\n        <p>Why Does It Matter?</p>\n        <p>Without understanding how the Web works, you can't fully grasp:</p>\n        <ul class=\"plain\">\n          <li>Why frontend code works the way it does,</li>\n          <li>Why the backend is needed,</li>\n          <li>The logic behind APIs,</li>\n          <li>How data is transported</li>\n        </ul>\n        <p>That's why, in the next section, we'll learn who does what behind the scenes (the Client and the Server) when you visit a website.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>Internet vs. Web vs. WWW Protocols</h3>\n        <p>At the beginner level it's enough to know the Web sits \"on top of\" the internet. At the intermediate level, it helps to separate three layers that are often used interchangeably:</p>\n        <ul class=\"plain\">\n          <li>Internet — the physical/logical network layer: cables, routers, and the IP protocol that moves raw packets between machines.</li>\n          <li>WWW (World Wide Web) — an application built on top of the internet using HTTP/HTTPS, HTML, and hyperlinks. It is one internet service among many.</li>\n          <li>Other internet services — email (SMTP), file transfer (FTP), real-time messaging, and streaming protocols also run on the internet but are not \"the Web.\"</li>\n        </ul>\n        <p>A useful intermediate distinction is static vs. dynamic content:</p>\n        <ul class=\"plain\">\n          <li>Static content — the same HTML/CSS/JS file is served to every visitor (e.g., a plain landing page).</li>\n          <li>Dynamic content — the server builds the page or response per request, often based on a database (e.g., your personalized Instagram feed).</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">choosing static hosting vs. a dynamic backend is one of the first architectural decisions in any real project, and it directly affects cost, scalability, and how much server-side code you need to write.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>How the Web Works</h3>\n        <p>At a beginner level, \"the Web works\" by your browser asking a server for a page and the server sending it back. Underneath that simple exchange there is a well-defined sequence of steps.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>The Full Request Lifecycle</h3>\n        <p>When you type a URL and press Enter, several distinct steps happen in order, each building on the previous one:</p>\n        <ul class=\"plain\">\n          <li>1. DNS Resolution — the browser asks a DNS server to translate the domain name (e.g., example.com) into an IP address.</li>\n          <li>2. TCP Connection — the browser opens a TCP connection to that IP address using a three-way handshake (SYN, SYN-ACK, ACK).</li>\n          <li>3. TLS Handshake (HTTPS) — if the site uses HTTPS, an encrypted channel is negotiated before any real data is sent (covered in depth in Section 6).</li>\n          <li>4. HTTP Request — the browser sends an HTTP request over that secure connection, asking for a specific resource.</li>\n          <li>5. Server Processing — the server routes the request, runs backend logic, queries a database if needed, and builds a response.</li>\n          <li>6. HTTP Response — the server sends back status code, headers, and a body (HTML, JSON, etc.).</li>\n          <li>7. Rendering — the browser parses the HTML, builds the DOM, applies CSS, runs JavaScript, and paints pixels on screen.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">performance debugging almost always means identifying which of these seven steps is slow — a slow DNS lookup, a slow database query, and a slow JavaScript bundle all feel the same to the user (\"the page is loading\") but require completely different fixes.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>Frontend and Backend Roles</h3>\n        <p>Code that runs on the client side is called frontend, and code that runs on the server side is called backend. We'll keep using the same restaurant analogy from the previous section here too.</p>\n        <p>What Is the Difference Between Client-Side and Server-Side Logic?</p>\n        <p>The key difference is where the code runs.</p>\n        <ul class=\"plain\">\n          <li>Client-side: The code runs on the user's own device (in the browser). The browser downloads this code and runs it on its own. The user can view — and even change — this code using the browser's \"developer tools.\"</li>\n          <li>Server-side: The code runs on the server. The user never sees or touches this code directly; they only receive its result (an HTML page, a JSON response, etc.).</li>\n        </ul>\n        <p>This distinction matters most for security: sensitive operations such as password checks, payments, or database access are never done on the client side, because anything on the client side can be seen and altered by the user. That's why this kind of work is always done on the server.</p>\n        <h4 class=\"content-subheading\">Frontend</h4>\n        <p>The part the user sees and interacts with.</p>\n        <p>For example: buttons, menus, colors, animations, page layout.</p>\n        <p>In a restaurant, it's the part the customer sees: the tables, the menu design, the decor.</p>\n        <p>Technologies Used: HTML, CSS, JavaScript, React, Angular, Vue.</p>\n        <p>Why does it matter?</p>\n        <p>It shapes the user experience. A poor frontend frustrates users, and they leave the site.</p>\n        <h4 class=\"content-subheading\">Backend</h4>\n        <p>The invisible, processing part of a web application. Its jobs:</p>\n        <ul class=\"plain\">\n          <li>Process data</li>\n          <li>Authenticate users</li>\n          <li>Talk to the database</li>\n          <li>Provide security</li>\n        </ul>\n        <p>In a restaurant, this is the kitchen and the cooks: the customer doesn't see it, but the real work happens there.</p>\n        <p>Technologies Used: C#, Java, Python, Node.js, PHP.</p>\n        <p>Common Beginner Mistakes</p>\n        <ul class=\"plain\">\n          <li>❌ Thinking frontend is only about design. Frontend also covers user experience, performance, and data handling.</li>\n          <li>❌ Thinking backend is only about fetching data. Backend also covers security, authorization, and business rules.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Rendering Strategies and Architecture Choices</h3>\n        <p>Beyond \"frontend vs. backend,\" intermediate developers need to know where rendering happens, since modern frameworks blur the line:</p>\n        <table class=\"tcompare\">\n          <tr><th>Strategy</th><th>Where HTML Is Built</th><th>Typical Use Case</th></tr>\n          <tr><td>CSR (Client-Side Rendering)</td><td>In the browser, via JavaScript, after the page loads</td><td>Highly interactive dashboards (e.g., a plain React SPA)</td></tr>\n          <tr><td>SSR (Server-Side Rendering)</td><td>On the server, per request</td><td>SEO-sensitive pages that also need personalization (e.g., Next.js)</td></tr>\n          <tr><td>SSG (Static Site Generation)</td><td>At build time, before deployment</td><td>Blogs, docs, marketing pages</td></tr>\n          <tr><td>Hybrid / ISR</td><td>Mix of build time and per-request</td><td>Large e-commerce catalogs</td></tr>\n        </table>\n        <p>Related architectural patterns worth knowing at this stage:</p>\n        <ul class=\"plain\">\n          <li>SPA (Single Page Application) — one HTML shell; navigation is handled by JavaScript without full page reloads.</li>\n          <li>MPA (Multi Page Application) — each navigation triggers a fresh request to the server for a new HTML page.</li>\n          <li>API-first / decoupled architecture — the backend only exposes an API; one or more separate frontends (web, mobile) consume it, rather than the backend directly rendering HTML.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">choosing CSR vs. SSR vs. SSG is not just a technical detail — it affects SEO, initial load time, hosting cost, and how much server infrastructure you need to run and maintain.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>Accessibility and SEO Basics</h3>\n        <p>Knowing where code runs (client vs. server) is not enough on its own — two more questions decide whether real people, and search engines, can actually reach and use what you built.</p>\n        <h4 class=\"content-subheading\">Accessibility (a11y)</h4>\n        <ul class=\"plain\">\n          <li>Definition: Building a site so it can be used by people with disabilities — including those using a screen reader, keyboard-only navigation, or voice control.</li>\n          <li>Real-Life Example: A restaurant with no ramp and a menu printed only in tiny text quietly turns away customers who use a wheelchair or can’t read small print — the food is fine, but the building itself is the barrier.</li>\n          <li>Why This Matters: An inaccessible site doesn’t just risk losing users; in many countries it also carries legal requirements, and the fixes (proper labels, keyboard support) usually make the product better for everyone.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Semantic HTML and Core SEO Signals</h3>\n        <p>Accessibility and SEO turn out to rely on much of the same foundation: HTML that describes what things *are*, not just how they look.</p>\n        <ul class=\"plain\">\n          <li>Semantic HTML — using &lt;button&gt;, &lt;nav&gt;, &lt;header&gt;, and proper heading levels instead of a &lt;div&gt; styled to look like a button — screen readers and search engine crawlers both depend on this structure to understand the page.</li>\n          <li>ARIA attributes — a way to add accessibility information (roles, states) to elements that don’t have it natively, such as a custom dropdown built from &lt;div&gt;s; used only when semantic HTML alone can’t express it.</li>\n          <li>Core SEO signals — the &lt;title&gt; tag, meta description, alt text on images, and a canonical URL are what a search engine reads to decide what a page is about and how to list it in results.</li>\n        </ul>\n        <p>This is also where Section 1’s rendering-strategy choice comes back: a search engine crawler reads whatever HTML is sent first, so a page that’s blank until JavaScript runs (pure CSR) can be far harder to index than one rendered on the server (SSR/SSG).</p>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">a dropdown menu a screen reader can’t operate, or a client-rendered blog a search engine can’t read, silently loses users no matter how well the backend performs — these are frontend correctness issues, not nice-to-haves.</p>\n      </div>"
    }
  },
  {
    "id": 2,
    "icon": "swap",
    "depth": "-80 m",
    "tr": {
      "title": "İstemci–Sunucu İletişimi",
      "summary": "Web uygulamalarının temel mantığı, İstemci ile Sunucu arasındaki iletişimdir. Neyin neyi temsil ettiğini kolayca hatırlamak için bu bölüm boyunca her şeyi tek bir restoran benzetmesiyle açıklayacağız:",
      "html": "\n      <div class=\"tsec\">\n        <p>Web uygulamalarının temel mantığı, İstemci ile Sunucu arasındaki iletişimdir. Neyin neyi temsil ettiğini kolayca hatırlamak için bu bölüm boyunca her şeyi tek bir restoran benzetmesiyle açıklayacağız:</p>\n        <ul class=\"plain\">\n          <li>Müşteri (sen) → Kullanıcı</li>\n          <li>Sipariş verdiğin tablet → Tarayıcı</li>\n          <li>Mutfak → Sunucu</li>\n          <li>Sipariş → İstek</li>\n          <li>Yemek → Yanıt</li>\n        </ul>\n        <h4 class=\"content-subheading\">Tarayıcı (Browser)</h4>\n        <p>Web sitelerini açmamızı sağlayan programdır.</p>\n        <p class=\"content-detail\"><strong>Örnek:</strong> Chrome, Firefox, Edge.</p>\n        <p>Tarayıcı, restoran masasındaki sipariş tableti gibidir: ne istediğini tablete söylersin, o da isteğini mutfağa (sunucuya) iletir.</p>\n        <p>Neden önemli? Çünkü kullanıcı ile web sistemi arasındaki ilk temas noktasıdır.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Tarayıcı Aslında Ne Yapar?</h3>\n        <p>Bir tarayıcı tek bir programdan değil, birlikte çalışan birkaç motordan oluşur. Bunları anlamak, gerçek hayatta karşılaşılan birçok hatayı açıklar:</p>\n        <ul class=\"plain\">\n          <li>Rendering motoru (örneğin Chrome'da Blink, Safari'de WebKit, Firefox'ta Gecko) — HTML/CSS'i ayrıştırır ve sayfayı çizer. Farklı motorlar aynı CSS'i biraz farklı gösterebilir; bu yüzden farklı tarayıcılarda test yapmak önemlidir.</li>\n          <li>JavaScript motoru (örneğin V8) — JS'i derler ve çalıştırır. Tek iş parçacıklıdır ve bir event loop kullanır. Bu nedenle uzun süren tek bir script tüm sayfayı dondurabilir (\"sayfa yanıt vermiyor\").</li>\n          <li>Ağ katmanı — DNS önbelleğini, TCP/TLS bağlantılarını ve istekler arasında bağlantıların yeniden kullanılmasını yönetir.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">\"Benim bilgisayarımda çalışıyor\" türündeki hatalar çoğunlukla backend sorunlarından değil, tarayıcıların rendering veya JavaScript motorları arasındaki farklardan kaynaklanır.</p>\n        <h4 class=\"content-subheading\">İstemci (Client)</h4>\n        <p>Sunucudan hizmet isteyen cihaz veya uygulamadır.</p>\n        <p>Örneğin: telefonundaki uygulama, bilgisayarındaki tarayıcı.</p>\n        <p>Restoranda müşteri yemek ister; istemci de aynı şekilde sunucudan veri veya hizmet ister.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Kalın ve İnce İstemciler</h3>\n        <p>Her istemci aynı şekilde davranmaz. Sistem tasarlarken bu ayrım önemlidir:</p>\n        <ul class=\"plain\">\n          <li>İnce istemci (thin client) — yerelde az işlem yapar; çoğunlukla sunucunun gönderdiğini gösterir (klasik, sunucuda oluşturulan web siteleri).</li>\n          <li>Kalın istemci (thick client) — önemli miktarda mantığı ve durumu yerelde tutar (bir React SPA veya yerel mobil uygulama); sunucuyla çoğunlukla API üzerinden iletişim kurar.</li>\n        </ul>\n        <p>Yerel mobil uygulamalar, masaüstü uygulamaları ve hatta diğer backend servisleri (sunucudan sunucuya çağrılar) API açısından birer \"istemcidir\". İstemci rolü web tarayıcısıyla sınırlı değildir.</p>\n        <h4 class=\"content-subheading\">Sunucu (Server)</h4>\n        <p>Gelen istekleri karşılayan güçlü bilgisayarlardır. Görevleri:</p>\n        <ul class=\"plain\">\n          <li>Veriyi saklamak</li>\n          <li>İşlemleri yürütmek</li>\n          <li>Yanıt göndermek</li>\n        </ul>\n        <p>Restoranın mutfağına benzetebiliriz: sipariş girer, yemek çıkar.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Durumsuzluk ve Ölçeklendirme</h3>\n        <p>Orta düzeydeki temel kavramlardan biri, çoğu web sunucusunun durumsuz (stateless) tasarlanmasıdır: her istek bağımsız işlenir; sunucu istekler arasında istemciyi \"hatırlamaz\". Gereken durum bilgisi veritabanında, önbellekte veya token'da tutulur (bkz. Bölüm 5).</p>\n        <p>Bu önemlidir; çünkü durumsuz sunucular yatay ölçeklendirilebilir. Tek bir sunucuyu güçlendirmek (dikey ölçeklendirme) yerine, gelen istekleri aralarında dağıtan bir yük dengeleyicinin arkasında çok sayıda aynı sunucu örneği çalıştırırsın. Sunucu istemciye özgü bilgiyi belleğinde tutmuyorsa her örnek her isteği işleyebilir; bu da bu tür ölçeklendirmeyi mümkün kılar.</p>\n        <h4 class=\"content-subheading\">İstek (Request)</h4>\n        <p>İstemcinin sunucuya gönderdiği taleptir.</p>\n        <p class=\"content-detail\"><strong>Örnek:</strong> \"Profil bilgilerimi getir.\"</p>\n        <p>Tablet ekranında \"Bir pizza istiyorum\" seçeneğine dokunup siparişi mutfağa göndermek gibidir.</p>\n        <h4 class=\"content-subheading\">Yanıt (Response)</h4>\n        <p>Sunucunun istemciye geri gönderdiği sonuçtur.</p>\n        <p class=\"content-detail\"><strong>Örnek:</strong> \"İşte kullanıcı bilgilerin.\"</p>\n        <p>Mutfakta hazırlanan yemeğin sana ulaşması veya tablette \"Siparişiniz hazır\" yazısını görmen gibidir.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>İstek ve Yanıtın Yapısı</h3>\n        <p>İster tarayıcı sayfa yüklesin ister mobil uygulama API çağırsın, her HTTP isteği ve yanıtı aynı üç parçadan oluşur:</p>\n        <ul class=\"plain\">\n          <li>Başlangıç satırı — istekte: metot + yol + HTTP sürümü (örneğin GET /profile HTTP/1.1); yanıtta: sürüm + durum kodu (örneğin HTTP/1.1 200 OK).</li>\n          <li>Header'lar — mesaj hakkındaki üst veriler (3. bölümde ayrıntılı ele alınır).</li>\n          <li>Gövde (body) — varsa asıl taşınan veri (çoğunlukla JSON). GET isteklerinde genellikle gövde bulunmaz; POST/PUT/PATCH isteklerinde genellikle bulunur.</li>\n        </ul>\n        <p>Burada bilinmesi faydalı bir diğer orta düzey kavram idempotency'dir: bir isteği bir kez veya birçok kez yapmak sunucuda aynı sonucu üretiyorsa istek idempotent'tir. GET, PUT ve DELETE'in idempotent olması beklenir; POST genellikle değildir (aynı \"sipariş oluştur\" isteğini iki kez göndermek iki sipariş oluşturabilir). Bu, istemci başarısız istekleri otomatik tekrarladığında önem kazanır; idempotent olmayan bir isteği tekrarlamak mükerrer yan etkilere yol açabilir.</p>\n      </div>"
    },
    "en": {
      "title": "Client–Server Communication",
      "summary": "The core logic of web applications is the communication between the Client and the Server. Throughout this section we'll explain everything using a single restaurant analogy, so that it's easy to remember what stands for what:",
      "html": "\n      <div class=\"tsec\">\n        <p>The core logic of web applications is the communication between the Client and the Server. Throughout this section we'll explain everything using a single restaurant analogy, so that it's easy to remember what stands for what:</p>\n        <ul class=\"plain\">\n          <li>Customer (you) → User</li>\n          <li>The tablet you order from → Browser</li>\n          <li>Kitchen → Server</li>\n          <li>Order → Request</li>\n          <li>Meal → Response</li>\n        </ul>\n        <h4 class=\"content-subheading\">Browser</h4>\n        <p>The program that lets us open websites.</p>\n        <p class=\"content-detail\"><strong>Example:</strong> Chrome, Firefox, Edge.</p>\n        <p>The browser is like the ordering tablet on a restaurant table: you tell the tablet what you want, and it passes your request on to the kitchen (the server).</p>\n        <p>Why does it matter? Because it's the first point of contact between the user and the web system.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>What a Browser Actually Does</h3>\n        <p>A browser is not one program but several engines working together, and understanding them explains a lot of real-world bugs:</p>\n        <ul class=\"plain\">\n          <li>Rendering engine (e.g., Blink in Chrome, WebKit in Safari, Gecko in Firefox) — parses HTML/CSS and paints the page. Different engines can render the same CSS slightly differently, which is why cross-browser testing matters.</li>\n          <li>JavaScript engine (e.g., V8) — compiles and runs JS. It's single-threaded and uses an event loop, which is why one long-running script can freeze an entire page (\"the page is unresponsive\").</li>\n          <li>Networking stack — manages DNS caching, TCP/TLS connections, and connection reuse across requests.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">\"it works on my machine\" bugs are frequently rendering-engine or JS-engine differences between browsers, not backend problems.</p>\n        <h4 class=\"content-subheading\">Client</h4>\n        <p>The device or application that requests a service from the server.</p>\n        <p>For example: the app on your phone, the browser on your computer.</p>\n        <p>In a restaurant, the customer wants food; a client asks the server for data or a service in the same way.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>Thick vs. Thin Clients</h3>\n        <p>Not all clients behave the same way, and the split matters when designing a system:</p>\n        <ul class=\"plain\">\n          <li>Thin client — does little logic locally; mostly displays what the server sends (classic server-rendered websites).</li>\n          <li>Thick client — holds significant logic and state locally (a React SPA, a native mobile app) and talks to the server mainly through an API.</li>\n        </ul>\n        <p>Native mobile apps, desktop apps, and even other backend services (server-to-server calls) are all \"clients\" from the API's point of view — the client role isn't limited to a web browser.</p>\n        <h4 class=\"content-subheading\">Server</h4>\n        <p>Powerful computers that handle incoming requests. Their jobs:</p>\n        <ul class=\"plain\">\n          <li>Store data</li>\n          <li>Process operations</li>\n          <li>Send back responses</li>\n        </ul>\n        <p>We can compare it to the restaurant's kitchen: the order goes in, the meal comes out.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>Statelessness and Scaling</h3>\n        <p>A core intermediate concept is that most web servers are designed to be stateless: each request is handled independently, without the server \"remembering\" the client between requests (state, when needed, is kept in a database, cache, or token — see Section 5).</p>\n        <p>This matters because stateless servers can be scaled horizontally: instead of making one server more powerful (vertical scaling), you run many identical server instances behind a load balancer, which distributes incoming requests across them. If a server holds no client-specific memory, any instance can handle any request, which makes this kind of scaling possible.</p>\n        <h4 class=\"content-subheading\">Request</h4>\n        <p>The ask that the client sends to the server.</p>\n        <p class=\"content-detail\"><strong>Example:</strong> \"Fetch my profile information.\"</p>\n        <p>It's like tapping \"I'd like a pizza\" on the tablet screen and sending the order to the kitchen.</p>\n        <h4 class=\"content-subheading\">Response</h4>\n        <p>The result that the server sends back to the client.</p>\n        <p class=\"content-detail\"><strong>Example:</strong> \"Here is your user information.\"</p>\n        <p>It's like the meal prepared in the kitchen reaching you, or seeing \"Your order is ready\" appear on the tablet.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>Anatomy of a Request and Response</h3>\n        <p>Every HTTP request and response is made of the same three parts, whether it's a browser loading a page or a mobile app calling an API:</p>\n        <ul class=\"plain\">\n          <li>Start line — for a request: method + path + HTTP version (e.g., GET /profile HTTP/1.1); for a response: version + status code (e.g., HTTP/1.1 200 OK).</li>\n          <li>Headers — metadata about the message (covered in depth in Section 3).</li>\n          <li>Body — the actual payload, if any (often JSON). GET requests typically have no body; POST/PUT/PATCH usually do.</li>\n        </ul>\n        <p>Another intermediate idea worth knowing here is idempotency: a request is idempotent if making it once or many times produces the same result on the server. GET, PUT, and DELETE are expected to be idempotent; POST usually is not (sending the same \"create order\" request twice can create two orders). This becomes important when a client automatically retries failed requests — retrying a non-idempotent request can cause duplicate side effects.</p>\n      </div>"
    }
  },
  {
    "id": 3,
    "icon": "code",
    "depth": "-120 m",
    "tr": {
      "title": "HTTP İletişimi",
      "summary": "HTTP (HyperText Transfer Protocol), cihazların veri alışverişi yapmasını sağlayan iletişim kuralları bütünüdür.",
      "html": "\n      <div class=\"tsec\">\n        <h3>HTTP Nedir?</h3>\n        <p>HTTP (HyperText Transfer Protocol), cihazların veri alışverişi yapmasını sağlayan iletişim kuralları bütünüdür.</p>\n        <p>HTTP, iki insanın ortak dili gibidir: biri Türkçe, diğeri Japonca konuşursa birbirlerini anlayamazlar. HTTP, bilgisayarların birbirini anlamasını sağlar ve Web'deki tüm veri alışverişinin temelidir.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>HTTP/1.1, HTTP/2 ve HTTP/3</h3>\n        <p>HTTP tek ve değişmez bir protokol değildir; zamanla gelişmiştir ve kullanılan sürüm gerçek hayattaki performansı etkiler:</p>\n        <table class=\"tcompare\">\n          <tr><th>Sürüm</th><th>Temel Özellik</th><th>Pratik Etkisi</th></tr>\n          <tr><td>HTTP/1.1</td><td>Bağlantı başına aynı anda tek istek (veya sınırlı pipelining)</td><td>Tarayıcılar bunu telafi etmek için alan adı başına birden fazla paralel bağlantı açar</td></tr>\n          <tr><td>HTTP/2</td><td>Multiplexing — birçok istek tek bir TCP bağlantısını paylaşır</td><td>Daha hızlı sayfa yüklemesi; daha az bağlantı ihtiyacı</td></tr>\n          <tr><td>HTTP/3</td><td>TCP yerine QUIC (UDP tabanlı) üzerinde çalışır</td><td>Head-of-line blocking sorununu önler; kararsız ağlarda daha iyi çalışır</td></tr>\n        </table>\n        <p>Şunu da bilmek faydalıdır: bağlantılar kalıcı olabilir (Connection: keep-alive). Böylece aynı TCP bağlantısı birden fazla istekte kullanılır ve her seferinde yeni bir el sıkışmanın maliyetinden kaçınılır. HTTP/1.0'ın modern HTTP'ye göre daha yavaş hissettirmesinin nedenlerinden biri budur.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>HTTP Metotları</h3>\n        <p>İstemcinin ne yapmak istediğini sunucuya bildiren komutlardır:</p>\n        <table class=\"tcompare\">\n          <tr><th>Metot</th><th>Kullanım Amacı</th><th>Günlük Hayattan Örnek</th></tr>\n          <tr><td>GET</td><td>Yalnızca veri okumak/getirmek için.</td><td>Başkasının Instagram profiline bakmak.</td></tr>\n          <tr><td>POST</td><td>Yeni veri oluşturmak veya göndermek için.</td><td>Yeni bir fotoğraf paylaşmak.</td></tr>\n          <tr><td>PUT</td><td>Mevcut bir veriyi tamamen değiştirmek veya sıfırdan oluşturmak için.</td><td>Profil fotoğrafını değiştirmek.</td></tr>\n          <tr><td>PATCH</td><td>Mevcut verinin yalnızca belirli bir kısmını güncellemek (değiştirmek) için.</td><td>Profil biyografindeki tek bir kelimeyi düzeltmek.</td></tr>\n          <tr><td>DELETE</td><td>Mevcut veriyi silmek için.</td><td>Hesabını kalıcı olarak kapatmak.</td></tr>\n        </table>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Güvenli, İdempotent ve Önbelleğe Alınabilir Metotlar</h3>\n        <p>HTTP, her metodun kullanım amacının ötesinde, sunucuların ve tarayıcıların dayandığı biçimsel özellikler tanımlar:</p>\n        <table class=\"tcompare\">\n          <tr><th>Metot</th><th>Güvenli mi?</th><th>İdempotent mi?</th><th>Genellikle Önbelleğe Alınabilir mi?</th></tr>\n          <tr><td>GET</td><td>Evet</td><td>Evet</td><td>Evet</td></tr>\n          <tr><td>POST</td><td>Hayır</td><td>Hayır</td><td>Nadiren</td></tr>\n          <tr><td>PUT</td><td>Hayır</td><td>Evet</td><td>Hayır</td></tr>\n          <tr><td>PATCH</td><td>Hayır</td><td>Hayır (genellikle)</td><td>Hayır</td></tr>\n          <tr><td>DELETE</td><td>Hayır</td><td>Evet</td><td>Hayır</td></tr>\n        </table>\n        <p>\"Güvenli\", metodun sunucu durumunu değiştirmediği anlamına gelir (kötü yazılmış bir sunucunun bunu yapmasını teknik olarak hiçbir şey engellemese de GET asla veri silmemelidir). PUT ve PATCH sık karıştırılır: PUT kaynağın tamamını bekler ve bütünüyle değiştirir; PATCH ise yalnızca değişen alanları gönderir. PUT endpoint'ine eksik bir nesne göndermek, gönderilmeyen alanları istemeden silebilir.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>HTTP Durum Kodları</h3>\n        <p>Sunucunun bildirdiği işlem sonucu:</p>\n        <ul class=\"plain\">\n          <li>1xx (Bilgilendirme): \"İsteğini aldım ve işlemeye devam ediyorum.\" (Arka planda çalışır; kullanıcılar bunu nadiren görür.)</li>\n          <li>2xx (Başarılı): \"Harika, her şey yolunda ve isteğini yerine getirdim.\"</li>\n          <li>3xx (Yönlendirme): \"Aradığın şey başka bir yere taşındı; seni yeni adrese yönlendiriyorum.\"</li>\n          <li>4xx (İstemci Hatası): \"Sen (kullanıcı veya tarayıcı) bir hata yaptın: yanlış adres girdin, eksik veri gönderdin veya iznin yok.\"</li>\n          <li>5xx (Sunucu Hatası): \"Sorun sende değil; benim (sunucunun) tarafımda bir şey ters gitti veya çöktü.\"</li>\n        </ul>\n        <p>En sık kullanılan durum kodları:</p>\n        <table class=\"tcompare\">\n          <tr><th>Kod</th><th>Adı</th><th>Anlamı</th><th>Günlük Hayattan Örnek</th></tr>\n          <tr><td>200</td><td>OK</td><td>İstek başarılı oldu ve istenen veri döndürüldü.</td><td>Bir sitenin ana sayfasını sorunsuz yüklemek.</td></tr>\n          <tr><td>201</td><td>Created</td><td>İstek (genellikle POST) başarılı oldu ve yeni bir kayıt oluşturuldu.</td><td>Siparişi tamamlayıp \"Siparişiniz alındı\" mesajını görmek.</td></tr>\n          <tr><td>204</td><td>No Content</td><td>İşlem (genellikle DELETE) başarılı oldu; ancak gösterilecek yeni bilgi yok.</td><td>Bir fotoğrafı silmek ve sistemin arka planda sessizce \"tamamlandı\" onayı vermesi.</td></tr>\n          <tr><td>301</td><td>Moved Permanently</td><td>İstenen sayfa kalıcı olarak farklı bir URL'ye taşındı.</td><td>Kapanmış eski bir sitenin adresini yazıp yeni siteye yönlendirilmek.</td></tr>\n          <tr><td>400</td><td>Bad Request</td><td>Sunucu, gönderdiğin verinin biçimini veya mantığını anlayamadı.</td><td>Yaş alanına sayı yerine \"yirmi\" yazıp göndermeye çalışmak.</td></tr>\n          <tr><td>401</td><td>Unauthorized</td><td>Bu işlemi yapmak için giriş yapman gerekiyor.</td><td>Şifre girmeden gelen kutunu açmaya çalışmak.</td></tr>\n          <tr><td>403</td><td>Forbidden</td><td>Giriş yaptın ancak bu işlemi yapma iznin yok.</td><td>Standart hesapla \"Yönetici\" sayfasına erişmeye çalışmak.</td></tr>\n          <tr><td>404</td><td>Not Found</td><td>İstenen sayfa veya veri sunucuda bulunmuyor.</td><td>Bir sitenin adresini yanlış veya eksik yazmak.</td></tr>\n          <tr><td>500</td><td>Internal Server Error</td><td>Sunucuda beklenmeyen bir hata oluştu.</td><td>Bir sitenin yazılım hatası nedeniyle çökmesi.</td></tr>\n          <tr><td>503</td><td>Service Unavailable</td><td>Sunucu şu anda aşırı yüklü veya bakımda.</td><td>Sınav sonuçları açıklanınca herkes aynı anda giriş yapmaya çalıştığı için sitenin kilitlenmesi.</td></tr>\n        </table>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>İstemcide Durum Kodlarını Doğru Ele Almak</h3>\n        <p>Kodları bilmek işin yalnızca yarısıdır. Orta düzey geliştiriciler, iyi tasarlanmış bir istemcinin her kod grubuna nasıl tepki vermesi gerektiğini de bilmelidir:</p>\n        <ul class=\"plain\">\n          <li>401 ve 403 — 401 genellikle \"yeniden giriş yap\" anlamına gelir (örneğin giriş ekranına yönlendir veya kimlik doğrulama token'ını yenile). 403 ise kullanıcının tanındığını ancak izinli olmadığını belirtir; dolayısıyla yeniden kimlik doğrulamak yardımcı olmaz.</li>\n          <li>429 (Too Many Requests) — hız sınırlamasını belirtir (Bölüm 6). İstemci hemen yeniden denemek yerine, çoğunlukla Retry-After header'ını kullanarak yavaşlamalıdır.</li>\n          <li>5xx hataları — istemci hatası yerine geçici bir sunucu sorununu belirttiklerinden, bekleme süresini artırarak yeniden denemek genellikle güvenlidir. 4xx hatalarında sorun isteğin kendisi olduğu için istek genellikle değiştirilmeden tekrarlanmamalıdır.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Her hatayı aynı şekilde (\"Bir şeyler ters gitti\") ele alan bir frontend, kötü kullanıcı deneyimi oluşturur ve hata ayıklama sırasında gerçek sorunları geliştiricilerden gizler.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>Header'lar (Başlıklar)</h3>\n        <p>İstek veya yanıt hakkında ek bilgi taşıyan bölümdür; kargo paketinin üzerindeki etiket (gönderen, alıcı, içerik) gibidir.</p>\n        <p>İstek ve yanıt header'ları, istemci ile sunucu arasında iletişimi sağlayan HTTP protokolünün görünmeyen kahramanlarıdır. Ekranda gördüğümüz sayfanın dışında, arka planda üst veri taşırlar. Bu, mektuptaki yazı ile zarf üzerindeki gönderen, alıcı ve pul bilgileri arasındaki ilişkiye benzer.</p>\n        <p>İstek Header'ları</p>\n        <p>Tarayıcının sunucudan sayfa isterken gönderdiği teknik notlardır: \"Ben kimim, ne istiyorum ve bu veriyi bana nasıl göndermelisin?\"</p>\n        <table class=\"tcompare\">\n          <tr><th>Header</th><th>Amacı</th><th>Örnek Değer</th></tr>\n          <tr><td>Host</td><td>Hangi alan adına istek yapıldığını belirtir.</td><td>www.ornek.com</td></tr>\n          <tr><td>User-Agent</td><td>İsteği yapan tarayıcıyı, işletim sistemini ve cihazı tanımlar.</td><td>Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0…</td></tr>\n          <tr><td>Accept</td><td>İstemcinin hangi veri türlerini okuyabildiğini sunucuya bildirir.</td><td>text/html, application/json, image/webp</td></tr>\n          <tr><td>Accept-Language</td><td>Kullanıcının tercih ettiği dili belirtir.</td><td>en-US, en;q=0.9</td></tr>\n          <tr><td>Authorization</td><td>Giriş yapmış kullanıcının kimlik doğrulama bilgilerini taşır.</td><td>Bearer eyJhbGciOiJIUzI1Ni…</td></tr>\n        </table>\n        <p>GET /profile HTTP/1.1</p>\n        <p>Host: www.ornek.com</p>\n        <p>User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)</p>\n        <p>Accept-Language: en-US</p>\n        <p>Authorization: Bearer abc123xyz</p>\n        <p>Yanıt Header'ları</p>\n        <p>Sunucunun veri (HTML, JSON, görsel vb.) gönderirken pakete eklediği teknik notlardır. Tarayıcıya veriyi nasıl işlemesi veya saklaması gerektiğini söylerler.</p>\n        <table class=\"tcompare\">\n          <tr><th>Header</th><th>Amacı</th><th>Örnek Değer</th></tr>\n          <tr><td>Content-Type</td><td>Gelen verinin türünü belirtir.</td><td>text/html; charset=UTF-8</td></tr>\n          <tr><td>Content-Length</td><td>Gönderilen verinin boyutunu bayt olarak gösterir.</td><td>3495</td></tr>\n          <tr><td>Set-Cookie</td><td>Kullanıcıyı hatırlamak için tarayıcıya bir cookie saklamasını söyler.</td><td>session_id=987654321; Secure; HttpOnly</td></tr>\n          <tr><td>Cache-Control</td><td>Verinin tarayıcı önbelleğinde ne kadar tutulabileceğini tanımlar.</td><td>max-age=3600</td></tr>\n          <tr><td>Server</td><td>Arka planda çalışan sunucu yazılımının adını belirtir.</td><td>Apache/2.4.41 veya cloudflare</td></tr>\n        </table>\n        <p>HTTP/1.1 200 OK</p>\n        <p>Content-Type: application/json; charset=utf-8</p>\n        <p>Content-Length: 142</p>\n        <p>Cache-Control: max-age=3600</p>\n        <p>Set-Cookie: user_session=abc987; Secure; HttpOnly</p>\n        <p>{\"user\": \"Ahmet\", \"status\": \"active\"}</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Güvenlik ve CORS Header'ları</h3>\n        <p>Bazı header'lar özellikle canlı ortamdaki bir uygulamayı güvenli hale getirirken veya sorun giderirken karşına çıkar. Bunları gördüğünde tanımak faydalıdır:</p>\n        <table class=\"tcompare\">\n          <tr><th>Header</th><th>Amacı</th></tr>\n          <tr><td>Access-Control-Allow-Origin</td><td>CORS'un bir parçasıdır (Bölüm 6); tarayıcıya bu yanıtı hangi origin'lerin okuyabileceğini söyler.</td></tr>\n          <tr><td>Content-Security-Policy (CSP)</td><td>Sayfanın yükleyebileceği script'leri, stilleri ve kaynakları sınırlandırarak XSS riskini azaltır.</td></tr>\n          <tr><td>Strict-Transport-Security (HSTS)</td><td>Kullanıcı http:// yazsa bile tarayıcının siteyle yalnızca HTTPS üzerinden iletişim kurmasını söyler.</td></tr>\n          <tr><td>ETag</td><td>Önbellek doğrulamasında kullanılan, kaynak içeriğinin parmak izidir (Bölüm 6).</td></tr>\n          <tr><td>X-Request-ID / Correlation-ID</td><td>Bir isteği birden fazla servis ve log boyunca takip etmek için kullanılan özel bir header'dır (resmî standart değildir).</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Frontend ile backend arasındaki iletişim bozulduğunda gerçek yanıt çoğu zaman header'larda saklıdır. Eksik CORS header'ı, güncelliğini yitirmiş ETag veya CSP'nin engellediği script, tarayıcı geliştirici araçlarındaki yanıt header'larından doğrudan teşhis edilebilir.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>Gerçek Zamanlı İletişim: WebSocket ve SSE</h3>\n        <p>Bu bölümde şimdiye kadar ele alınan her şey tek bir düzeni izler: istemci sorar, sunucu yanıtlar. Canlı sohbet, borsa fiyat akışı veya çok oyunculu imleç gibi özelliklerde ise sunucunun olay gerçekleşir gerçekleşmez yeni veriyi göndermesi gerekir; bu düzen yeterli olmaz.</p>\n        <p>İlk akla gelen çözüm polling'dir: istemci, garsona sürekli yemeğin hazır olup olmadığını sormak gibi, birkaç saniyede bir \"Yeni bir şey var mı?\" diye sorar. Çalışır; ancak gereksiz istek üretir ve gecikmeye yol açar.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>WebSocket ve Server-Sent Events (SSE)</h3>\n        <p>İki standart, sürekli polling yapmadan bu sorunu çözer; ancak birbirlerinin yerine kullanılamazlar:</p>\n        <table class=\"tcompare\">\n          <tr><th>Teknoloji</th><th>Nasıl Çalışır?</th><th>Uygun Kullanım Alanı</th></tr>\n          <tr><td>WebSocket</td><td>Tek bir bağlantı, HTTP'den tam çift yönlü bir kanala yükseltilir; iki taraf da istediği anda mesaj gönderebilir.</td><td>Canlı sohbet, çok oyunculu oyunlar, ortak düzenleme</td></tr>\n          <tr><td>SSE (Server-Sent Events)</td><td>Normal HTTP üzerinden sunucudan istemciye tek yönlü akıştır; istemci aynı kanaldan geri mesaj gönderemez.</td><td>Canlı akışlar, bildirimler, yalnızca güncelleme alması gereken paneller</td></tr>\n        </table>\n        <p>WebSocket bağlantısı, Upgrade: websocket header'ı taşıyan normal bir HTTP isteği olarak başlar (yukarıdaki Header'lar anlatımıyla bağlantılıdır). Sunucu kabul ederse bağlantı protokol değiştirir ve açık kalır.</p>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">WebSocket önemli bir karmaşıklık getirir: bağlantı durumunu takip etmek, kopunca yeniden bağlanmak ve yük dengeleyici arkasında çok sayıda örnek varken mesajları doğru sunucuya yönlendirmek gerekir. Orta düzey geliştiriciler, veri yalnızca tek yönde akacaksa önce SSE'yi tercih etmeli; WebSocket'i istemcinin de sık sık geri mesaj göndermesi gerektiğinde kullanmalıdır.</p>\n      </div>"
    },
    "en": {
      "title": "HTTP Communication",
      "summary": "HTTP (HyperText Transfer Protocol) is the set of communication rules that lets devices exchange data.",
      "html": "\n      <div class=\"tsec\">\n        <h3>What Is HTTP?</h3>\n        <p>HTTP (HyperText Transfer Protocol) is the set of communication rules that lets devices exchange data.</p>\n        <p>HTTP is like a shared language between two people — if one speaks Turkish and the other Japanese, they can't understand each other. HTTP lets computers understand one another, and it's the foundation of all data exchange on the Web.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>HTTP/1.1 vs. HTTP/2 vs. HTTP/3</h3>\n        <p>\"HTTP\" is not a single fixed protocol — it has evolved, and the version in use affects real-world performance:</p>\n        <table class=\"tcompare\">\n          <tr><th>Version</th><th>Key Characteristic</th><th>Practical Effect</th></tr>\n          <tr><td>HTTP/1.1</td><td>One request per connection at a time (or limited pipelining)</td><td>Browsers open multiple parallel connections per domain to compensate</td></tr>\n          <tr><td>HTTP/2</td><td>Multiplexing — many requests share a single TCP connection</td><td>Faster page loads; fewer connections needed</td></tr>\n          <tr><td>HTTP/3</td><td>Runs over QUIC (UDP-based) instead of TCP</td><td>Avoids head-of-line blocking; better on unstable networks</td></tr>\n        </table>\n        <p>Also worth knowing: connections can be persistent (Connection: keep-alive) so the same TCP connection is reused for multiple requests, avoiding the cost of a new handshake every time — this is one of the reasons HTTP/1.0 felt slower than modern HTTP.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>HTTP Methods</h3>\n        <p>These are the commands that tell the server what the client wants to do:</p>\n        <table class=\"tcompare\">\n          <tr><th>Method</th><th>What It's For</th><th>Everyday Example</th></tr>\n          <tr><td>GET</td><td>For reading/fetching data only.</td><td>Looking at someone else's Instagram profile.</td></tr>\n          <tr><td>POST</td><td>For creating or submitting new data.</td><td>Sharing a new photo.</td></tr>\n          <tr><td>PUT</td><td>For completely replacing an existing piece of data, or creating it from scratch.</td><td>Changing your profile photo.</td></tr>\n          <tr><td>PATCH</td><td>For updating (modifying) only a specific part of existing data.</td><td>Fixing a single word in your profile bio.</td></tr>\n          <tr><td>DELETE</td><td>For deleting existing data.</td><td>Permanently closing your account.</td></tr>\n        </table>\n        <h3><span class=\"tag\">DEEP DIVE</span>Safe, Idempotent, and Cacheable Methods</h3>\n        <p>Beyond what each method \"is for,\" HTTP defines formal properties that servers and browsers rely on:</p>\n        <table class=\"tcompare\">\n          <tr><th>Method</th><th>Safe?</th><th>Idempotent?</th><th>Typically Cacheable?</th></tr>\n          <tr><td>GET</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>\n          <tr><td>POST</td><td>No</td><td>No</td><td>Rarely</td></tr>\n          <tr><td>PUT</td><td>No</td><td>Yes</td><td>No</td></tr>\n          <tr><td>PATCH</td><td>No</td><td>No (usually)</td><td>No</td></tr>\n          <tr><td>DELETE</td><td>No</td><td>Yes</td><td>No</td></tr>\n        </table>\n        <p>\"Safe\" means the method doesn't change server state (a GET should never delete data, even though nothing stops a poorly written server from doing so). PUT vs. PATCH is a common point of confusion: PUT expects the full resource and replaces it entirely, while PATCH sends only the fields that changed — sending a partial object to a PUT endpoint can unintentionally wipe out the missing fields.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>HTTP Status Codes</h3>\n        <p>The outcome of an operation, as reported by the server:</p>\n        <ul class=\"plain\">\n          <li>1xx (Informational): \"I received your request and I'm still processing it.\" (Runs in the background; users rarely see this.)</li>\n          <li>2xx (Success): \"Great, everything's fine and I've carried out your request.\"</li>\n          <li>3xx (Redirection): \"What you're looking for has moved elsewhere, I'm redirecting you to the new address.\"</li>\n          <li>4xx (Client Error): \"You (the user or the browser) made a mistake — you entered the wrong address, sent incomplete data, or don't have permission.\"</li>\n          <li>5xx (Server Error): \"This isn't about you — something went wrong, or crashed, on my (the server's) side.\"</li>\n        </ul>\n        <p>The most commonly used status codes:</p>\n        <table class=\"tcompare\">\n          <tr><th>Code</th><th>Name</th><th>What It Means</th><th>Everyday Example</th></tr>\n          <tr><td>200</td><td>OK</td><td>The request succeeded and the requested data was returned.</td><td>Loading a website's homepage without any issues.</td></tr>\n          <tr><td>201</td><td>Created</td><td>The request (usually a POST) succeeded and a new record was created.</td><td>Completing an order and seeing \"Your order has been placed.\"</td></tr>\n          <tr><td>204</td><td>No Content</td><td>The operation (usually DELETE) succeeded, but there's no new information to show.</td><td>Deleting a photo and the system quietly confirming \"done\" in the background.</td></tr>\n          <tr><td>301</td><td>Moved Permanently</td><td>The requested page has permanently moved to a different URL.</td><td>Typing the address of an old, closed site and being redirected to the new one.</td></tr>\n          <tr><td>400</td><td>Bad Request</td><td>The server couldn't understand the format or logic of the data you sent.</td><td>Typing \"twenty\" instead of a number into an age field and trying to submit it.</td></tr>\n          <tr><td>401</td><td>Unauthorized</td><td>You need to log in to perform this action.</td><td>Trying to open your inbox without entering a password.</td></tr>\n          <tr><td>403</td><td>Forbidden</td><td>You're logged in, but you don't have permission to do this.</td><td>Trying to access an \"Admin\" page with a standard account.</td></tr>\n          <tr><td>404</td><td>Not Found</td><td>The requested page or data doesn't exist on the server.</td><td>Typing a site's address incorrectly or incompletely.</td></tr>\n          <tr><td>500</td><td>Internal Server Error</td><td>An unexpected error occurred on the server.</td><td>A site crashing because of a software bug.</td></tr>\n          <tr><td>503</td><td>Service Unavailable</td><td>The server is currently overloaded or under maintenance.</td><td>A site locking up because everyone tries to log in at once when exam results are released.</td></tr>\n        </table>\n        <h3><span class=\"tag\">DEEP DIVE</span>Handling Status Codes Correctly on the Client</h3>\n        <p>Knowing the codes is only half the skill — intermediate developers also need to know how a well-built client should react to each family:</p>\n        <ul class=\"plain\">\n          <li>401 vs. 403 — a 401 usually means \"log in again\" (e.g., redirect to a login screen or refresh the auth token); a 403 means the user is identified but not allowed, so re-authenticating won't help.</li>\n          <li>429 (Too Many Requests) — signals rate limiting (Section 6); the client should slow down, often using the Retry-After header, rather than retrying immediately.</li>\n          <li>5xx errors — are usually safe to retry with backoff, since they indicate a transient server problem rather than a client mistake; 4xx errors generally should not be retried unchanged, since the request itself is the problem.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">a frontend that treats every error the same way (\"Something went wrong\") produces a poor user experience and hides real problems from developers during debugging.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>Headers</h3>\n        <p>A section that carries extra information about a request or a response — like the label on a shipping package (sender, recipient, contents).</p>\n        <p>Request headers and response headers are the unsung heroes of the HTTP protocol that enables communication between client and server. Traveling in the background, outside the page we see on screen, these headers carry metadata — much like the relationship between the writing in a letter and the sender/recipient/stamp information on the envelope.</p>\n        <p>Request Headers</p>\n        <p>Technical notes the browser sends when it asks the server for a page: \"Who am I, what do I want, and how should you send this data to me?\"</p>\n        <table class=\"tcompare\">\n          <tr><th>Header</th><th>Purpose</th><th>Example Value</th></tr>\n          <tr><td>Host</td><td>Specifies which domain is being requested.</td><td>www.ornek.com</td></tr>\n          <tr><td>User-Agent</td><td>Identifies the browser, operating system, and device making the request.</td><td>Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0…</td></tr>\n          <tr><td>Accept</td><td>Tells the server what types of data the client can read.</td><td>text/html, application/json, image/webp</td></tr>\n          <tr><td>Accept-Language</td><td>States the user's preferred language.</td><td>en-US, en;q=0.9</td></tr>\n          <tr><td>Authorization</td><td>Carries the authentication credentials of a logged-in user.</td><td>Bearer eyJhbGciOiJIUzI1Ni…</td></tr>\n        </table>\n        <p>GET /profile HTTP/1.1</p>\n        <p>Host: www.ornek.com</p>\n        <p>User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)</p>\n        <p>Accept-Language: en-US</p>\n        <p>Authorization: Bearer abc123xyz</p>\n        <p>Response Headers</p>\n        <p>Technical notes the server attaches to the package when sending data (HTML, JSON, an image, etc.) — they tell the browser how to handle or store that data.</p>\n        <table class=\"tcompare\">\n          <tr><th>Header</th><th>Purpose</th><th>Example Value</th></tr>\n          <tr><td>Content-Type</td><td>Specifies the type of the incoming data.</td><td>text/html; charset=UTF-8</td></tr>\n          <tr><td>Content-Length</td><td>Shows the size of the data sent, in bytes.</td><td>3495</td></tr>\n          <tr><td>Set-Cookie</td><td>Instructs the browser to store a cookie so it can remember the user.</td><td>session_id=987654321; Secure; HttpOnly</td></tr>\n          <tr><td>Cache-Control</td><td>Defines how long the data can be kept in the browser's cache.</td><td>max-age=3600</td></tr>\n          <tr><td>Server</td><td>States the name of the server software running behind the scenes.</td><td>Apache/2.4.41 or cloudflare</td></tr>\n        </table>\n        <p>HTTP/1.1 200 OK</p>\n        <p>Content-Type: application/json; charset=utf-8</p>\n        <p>Content-Length: 142</p>\n        <p>Cache-Control: max-age=3600</p>\n        <p>Set-Cookie: user_session=abc987; Secure; HttpOnly</p>\n        <p>{\"user\": \"Ahmet\", \"status\": \"active\"}</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>Security and CORS Headers</h3>\n        <p>A few headers show up specifically when hardening or debugging a production application, and are worth recognizing on sight:</p>\n        <table class=\"tcompare\">\n          <tr><th>Header</th><th>Purpose</th></tr>\n          <tr><td>Access-Control-Allow-Origin</td><td>Part of CORS (Section 6) — tells the browser which origins may read this response.</td></tr>\n          <tr><td>Content-Security-Policy (CSP)</td><td>Restricts which scripts, styles, and resources a page is allowed to load, reducing XSS risk.</td></tr>\n          <tr><td>Strict-Transport-Security (HSTS)</td><td>Tells the browser to only ever contact this site over HTTPS, even if the user types http://.</td></tr>\n          <tr><td>ETag</td><td>A fingerprint of a resource's content, used for cache validation (Section 6).</td></tr>\n          <tr><td>X-Request-ID / Correlation-ID</td><td>A custom header (not a formal standard) used to trace one request across multiple services and logs.</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">when something breaks between frontend and backend, the headers are often where the real answer is hiding — a missing CORS header, a stale ETag, or a blocked script under CSP are all diagnosable directly from the response headers in browser dev tools.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>Real-Time Communication: WebSockets and SSE</h3>\n        <p>Everything covered so far in this section follows one pattern: the client asks, the server answers. That breaks down for features like a live chat, a stock ticker, or a multiplayer cursor, where the server needs to push new data the instant something happens.</p>\n        <p>The naive fix is polling — the client just asks “anything new?” every few seconds, like repeatedly asking a waiter if the food is ready. It works, but it wastes requests and adds delay.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>WebSockets vs. Server-Sent Events (SSE)</h3>\n        <p>Two standards solve this without constant polling, and they are not interchangeable:</p>\n        <table class=\"tcompare\">\n          <tr><th>Technology</th><th>How It Works</th><th>Good Fit For</th></tr>\n          <tr><td>WebSocket</td><td>A single connection is upgraded from HTTP to a full-duplex channel — both sides can send messages at any time.</td><td>Live chat, multiplayer games, collaborative editing</td></tr>\n          <tr><td>SSE (Server-Sent Events)</td><td>A one-way stream from server to client over plain HTTP; the client cannot send messages back on the same channel.</td><td>Live feeds, notifications, dashboards that only need updates pushed to them</td></tr>\n        </table>\n        <p>A WebSocket connection starts life as an ordinary HTTP request carrying an Upgrade: websocket header (tying back to the Headers discussion above); if the server agrees, the connection switches protocols and stays open.</p>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">WebSockets bring real complexity — tracking connection state, reconnecting after a drop, and routing messages to the right server when there are many instances behind a load balancer. Intermediate developers should reach for SSE first when data only needs to flow one way, and use WebSockets only when the client also needs to send frequent messages back.</p>\n      </div>"
    }
  },
  {
    "id": 4,
    "icon": "plug",
    "depth": "-160 m",
    "tr": {
      "title": "API'ler ve Veri Alışverişi",
      "summary": "Farklı yazılımların birbiriyle iletişim kurmasını sağlayan bir köprüdür.",
      "html": "\n      <div class=\"tsec\">\n        <h3>API Nedir?</h3>\n        <p>Farklı yazılımların birbiriyle iletişim kurmasını sağlayan bir köprüdür.</p>\n        <p>API, restorandaki garson gibidir: \"Bir pizza istiyorum\" dersin, garson bunu mutfağa iletir. Mutfağa (sunucuya) kendin hiç girmezsin.</p>\n        <p>Gerçek Hayattan Örnek: Hava durumu uygulamasını açarsın → uygulama hava durumu API'sine sorar → API sıcaklığı geri gönderir.</p>\n        <p>Neden önemli? Modern uygulamalar (mobil uygulamalar, web siteleri, ödeme sistemleri) birbirleriyle API'ler üzerinden iletişim kurar.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>API Versiyonlama ve Gateway'ler</h3>\n        <p>Bir API'nin gerçek kullanıcıları olduğunda onu istediğin gibi değiştiremezsin; geriye dönük uyumluluğu bozan değişiklikler, ona bağlı tüm uygulamaları bozabilir. İki uygulama bu sorunu ele alır:</p>\n        <ul class=\"plain\">\n          <li>Versiyonlama — /api/v1/users ve /api/v2/users gibi endpoint'leri yan yana sunmaktır. Yeni istemciler yeni sürüme geçerken mevcut istemciler çalışmaya devam eder.</li>\n          <li>API Gateway — bir veya daha fazla backend servisinin önünde bulunan tek giriş noktasıdır. Kimlik doğrulama, hız sınırlama, yönlendirme ve loglama gibi ortak işleri yönetir; böylece her servis bunları ayrı ayrı uygulamak zorunda kalmaz.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Proje tek bir backend'den birden fazla servise büyüdüğünde API gateway ortak giriş kapısı olur. Versiyonlama ise eski ve yeni istemcilerin aynı anda uyumlu çalışmasını sağlayan sözleşmeye dönüşür.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>REST API'ler</h3>\n        <p>Web üzerinde API oluşturmak için kullanılan standart yaklaşımdır ve genellikle HTTP kullanır.</p>\n        <p>İstek: GET /users/5</p>\n        <p>Anlamı: \"5 numaralı kullanıcıyı getir.\"</p>\n        <p>Yanıt:</p>\n        <p>{</p>\n        <p>\"name\": \"Ali\",</p>\n        <p>\"age\": 25</p>\n        <p>}</p>\n        <p>REST API, restoranın standart sipariş sistemi gibidir: herkes aynı kurallara uyarak sipariş verir.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Bir API'yi RESTful Yapan Nedir ve Alternatifleri Nelerdir?</h3>\n        <p>REST (Representational State Transfer), yalnızca \"HTTP kullanan bir API\" değil, bir dizi mimari kısıttır. Pratikte en ilgili olanları şunlardır:</p>\n        <ul class=\"plain\">\n          <li>Durumsuzluk — her istek, kendisini anlamak için gereken tüm bilgileri içermelidir; sunucu önceki istekleri hatırlamaya dayanmaz (2. bölümle bağlantılıdır).</li>\n          <li>Kaynak tabanlı URL'ler — URL'ler eylemleri değil kaynakları (isimleri) tanımlar: /getUser?id=5 yerine /users/5 kullanılır; eylemi HTTP metodu (GET/POST/PUT/DELETE) ifade eder.</li>\n          <li>Tek tip arayüz — tüm endpoint'lerde tutarlı ve öngörülebilir kurallar kullanılır (örneğin POST işleminde oluşturulan nesneyi her zaman 201 koduyla döndürmek).</li>\n        </ul>\n        <p>REST'in karşına çıkacak diğer API yaklaşımlarından farkını bilmek de faydalıdır:</p>\n        <table class=\"tcompare\">\n          <tr><th>Yaklaşım</th><th>Temel Fikir</th><th>Uygun Kullanım Alanı</th></tr>\n          <tr><td>REST</td><td>HTTP üzerinden kaynaklar; her kaynak için bir endpoint</td><td>Genel amaçlı, dışa açık veya kurum içi API'ler</td></tr>\n          <tr><td>GraphQL</td><td>Tek endpoint; istemci tam olarak hangi alanlara ihtiyaç duyduğunu belirtir</td><td>Tek çağrıda esnek ve iç içe veri gerektiren karmaşık arayüzler</td></tr>\n          <tr><td>gRPC</td><td>Hız için tasarlanmış, Protocol Buffers kullanan ikili protokol</td><td>Backend içindeki servisler arası iletişim</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">REST tek seçenek değildir. Belirli bir problem için doğru yaklaşımı seçmek (örneğin veri yoğun bir panelde GraphQL, kurum içi mikroservisler arasında gRPC) orta düzeyde sık karşılaşılan bir mimari karardır.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>JSON (JavaScript Object Notation)</h3>\n        <p>Veri taşımak için kullanılan hafif bir veri biçimidir. İnsanlar tarafından okunabilir ve veriyi, garsonun sipariş fişi gibi, \"anahtar-değer\" çiftlerinde saklar.</p>\n        <p>{</p>\n        <p>\"name\": \"Fatma\",</p>\n        <p>\"age\": 20</p>\n        <p>}</p>\n        <p>JSON bir form gibidir: alanlar bellidir — İsim, Yaş, E-posta.</p>\n        <p>Neden önemli?</p>\n        <p>Frontend ile backend arasındaki en yaygın veri alışverişi biçimidir.</p>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>İç İçe Yapılar, Serileştirme ve Doğrulama</h3>\n        <p>Gerçek API'ler nadiren düz nesneler gönderir. JSON, iç içe nesneleri ve dizileri destekler; ilişkili veriler tek bir yanıtta bu şekilde temsil edilir:</p>\n        <p>{</p>\n        <p>\"id\": 5,</p>\n        <p>\"name\": \"Ali\",</p>\n        <p>\"roles\": [\"editor\", \"viewer\"],</p>\n        <p>\"address\": {</p>\n        <p>\"city\": \"Adana\",</p>\n        <p>\"zip\": \"01000\"</p>\n        <p>}</p>\n        <p>}</p>\n        <p>Her JSON alışverişinin arkasında iki orta düzey kavram bulunur:</p>\n        <ul class=\"plain\">\n          <li>Serialization / Deserialization (Serileştirme / Geri Serileştirme) — backend, bellekteki nesneleri (örneğin veritabanı satırını) göndermek için JSON metnine dönüştürür (serialize); frontend ise JSON metnini yeniden kullanılabilir nesneye çevirir (deserialize). Çoğu framework bunu otomatik yapar; ancak tarihlerin veya büyük sayıların bazen beklenmeyen biçimde gelmesinin nedeni budur.</li>\n          <li>JSON Schema — JSON verisinin beklenen yapısını (zorunlu alanlar, türleri, izin verilen değerler) biçimsel olarak tanımlamanın yoludur. Gelen veriyi doğrulamak ve API dokümantasyonunu otomatik üretmek için kullanılır.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">\"Frontend ve backend anlaşamıyor\" hatalarının çoğu, beklenen JSON yapısındaki uyumsuzluktan kaynaklanır: frontend'in her zaman var sandığı isteğe bağlı bir alan veya backend'in haber vermeden değiştirdiği tarih biçimi gibi. Deneyimli ekipler bunu ortak şema ve API dokümantasyonu (örneğin OpenAPI/Swagger) ile önler.</p>\n      </div>"
    },
    "en": {
      "title": "APIs and Data Exchange",
      "summary": "A bridge that lets different pieces of software talk to one another.",
      "html": "\n      <div class=\"tsec\">\n        <h3>What Is an API?</h3>\n        <p>A bridge that lets different pieces of software talk to one another.</p>\n        <p>An API is like a waiter in a restaurant: you say \"I'd like a pizza,\" the waiter relays it to the kitchen — you never step into the kitchen (the server) yourself.</p>\n        <p>Real-Life Example: You open a weather app → the app asks a weather API → the API sends back the temperature.</p>\n        <p>Why does it matter? Modern applications (mobile apps, websites, payment systems) talk to one another through APIs.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>API Versioning and Gateways</h3>\n        <p>Once an API has real users, you can't just change it freely — breaking changes would break every app that depends on it. Two practices address this:</p>\n        <ul class=\"plain\">\n          <li>Versioning — exposing endpoints like /api/v1/users and /api/v2/users side by side so existing clients keep working while new clients adopt the new version.</li>\n          <li>API Gateway — a single entry point in front of one or more backend services that handles cross-cutting concerns (authentication, rate limiting, routing, logging) so individual services don't each reimplement them.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">as a project grows from \"one backend\" into multiple services, the API gateway becomes the shared front door, and versioning becomes the contract that keeps old and new clients compatible at the same time.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>REST APIs</h3>\n        <p>The standard approach for building APIs on the Web, and it typically uses HTTP.</p>\n        <p>Request: GET /users/5</p>\n        <p>Meaning: \"Fetch user number 5.\"</p>\n        <p>Response:</p>\n        <p>{</p>\n        <p>\"name\": \"Ali\",</p>\n        <p>\"age\": 25</p>\n        <p>}</p>\n        <p>A REST API is like a restaurant's standard ordering system: everyone places orders following the same rules.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>What Makes an API \"RESTful,\" and the Alternatives</h3>\n        <p>REST (Representational State Transfer) is a set of architectural constraints, not just \"an API that uses HTTP.\" The ones most relevant in practice:</p>\n        <ul class=\"plain\">\n          <li>Statelessness — each request must contain everything needed to understand it; the server doesn't rely on memory of previous requests (ties back to Section 2).</li>\n          <li>Resource-based URLs — URLs identify resources (nouns), not actions: /users/5 rather than /getUser?id=5, with the HTTP method (GET/POST/PUT/DELETE) expressing the action.</li>\n          <li>Uniform interface — consistent, predictable conventions across all endpoints (e.g., always returning the created object with a 201 from a POST).</li>\n        </ul>\n        <p>It's also useful to know how REST compares to other API styles you'll encounter:</p>\n        <table class=\"tcompare\">\n          <tr><th>Style</th><th>Core Idea</th><th>Good Fit For</th></tr>\n          <tr><td>REST</td><td>Resources over HTTP, one endpoint per resource</td><td>General-purpose public/internal APIs</td></tr>\n          <tr><td>GraphQL</td><td>One endpoint; the client specifies exactly which fields it needs</td><td>Complex UIs that need flexible, nested data in one call</td></tr>\n          <tr><td>gRPC</td><td>Binary protocol using Protocol Buffers, built for speed</td><td>Service-to-service communication inside a backend</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">REST is not the only option, and picking the right style for a given problem (e.g., GraphQL for a data-heavy dashboard vs. gRPC between internal microservices) is a common intermediate-level architecture decision.</p>\n      </div>\n      <div class=\"tsec\">\n        <h3>JSON (JavaScript Object Notation)</h3>\n        <p>A lightweight data format used to transport data. It's human-readable and stores data as \"key-value\" pairs — like a waiter's order slip.</p>\n        <p>{</p>\n        <p>\"name\": \"Fatma\",</p>\n        <p>\"age\": 20</p>\n        <p>}</p>\n        <p>JSON is like a form: the fields are fixed — Name, Age, Email.</p>\n        <p>Why does it matter?</p>\n        <p>It's the most common data-exchange format between frontend and backend.</p>\n        <h3><span class=\"tag\">DEEP DIVE</span>Nested Structures, Serialization, and Validation</h3>\n        <p>Real APIs rarely send flat objects — JSON supports nested objects and arrays, which is how related data is represented in a single response:</p>\n        <p>{</p>\n        <p>\"id\": 5,</p>\n        <p>\"name\": \"Ali\",</p>\n        <p>\"roles\": [\"editor\", \"viewer\"],</p>\n        <p>\"address\": {</p>\n        <p>\"city\": \"Adana\",</p>\n        <p>\"zip\": \"01000\"</p>\n        <p>}</p>\n        <p>}</p>\n        <p>Two intermediate concepts sit behind every JSON exchange:</p>\n        <ul class=\"plain\">\n          <li>Serialization / Deserialization — the backend turns in-memory objects (e.g., a database row) into a JSON string to send (\"serialize\"), and the frontend turns that JSON string back into a usable object (\"deserialize\"). Most frameworks do this automatically, but it's the reason things like dates or big numbers sometimes arrive in an unexpected format.</li>\n          <li>JSON Schema — a way to formally describe the expected shape of a JSON payload (which fields are required, their types, allowed values). It's used to validate incoming data and to auto-generate API documentation.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">most \"the frontend and backend don't agree\" bugs come down to a mismatch in the expected JSON shape — an optional field the frontend assumes always exists, or a date format the backend changed without telling anyone. A shared schema (and API documentation, e.g., OpenAPI/Swagger) is how mature teams prevent this.</p>\n      </div>"
    }
  },
  {
    "id": 5,
    "icon": "key",
    "depth": "-200 m",
    "tr": {
      "title": "Kimlik Doğrulama ve Kullanıcı Yönetimi",
      "summary": "Genel Bakış",
      "html": "\n      <div class=\"tsec\">\n        <p>Genel Bakış</p>\n        <p>Kullanıcıların güvenle giriş yapmasını, kimliklerinin doğrulanmasını, izinlerinin yönetilmesini ve oturumlarının kesintisiz sürdürülmesini sağlayan yapıdır.</p>\n        <p>Terimlerin Açıklaması</p>\n        <h4 class=\"content-subheading\">Authentication (Kimlik Doğrulama)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Kullanıcının beyan ettiği kimliğin doğrulanması sürecidir (örneğin kullanıcı adı ve şifre).</li>\n          <li>Gerçek Hayattan Örnek: Bir otelin resepsiyonuna geldiğini düşün. Resepsiyoniste adını söyler ve kim olduğunu kanıtlamak için kimlik kartını verirsin.</li>\n          <li>Neden Önemli?: Kimlik doğrulama olmadan yetkisiz herhangi biri hesap sahibi olduğunu iddia edebilir; bu da güvenliğin tamamen çökmesine ve veri ihlallerine yol açabilir.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Şifrenin Ötesi</h3>\n        <p>Yalnızca şifreyle kimlik doğrulama, başlangıç düzeyindeki temeldir. Gerçek sistemler genellikle şunları ekler:</p>\n        <ul class=\"plain\">\n          <li>MFA / 2FA (Çok Faktörlü Kimlik Doğrulama) — şifreye ek olarak, uygulamadan veya SMS'ten gelen tek kullanımlık kod gibi ikinci bir kimlik kanıtı ister. Çalınmış veya sızdırılmış şifrelere karşı korur.</li>\n          <li>OAuth 2.0 — kullanıcının şifresini paylaşmadan, bir uygulamaya başka bir hizmetteki verilerine sınırlı erişim vermesini sağlayan yetkilendirme çerçevesidir (örneğin \"Google ile devam et\").</li>\n          <li>SSO (Tek Oturum Açma) — kullanıcının bir kez giriş yapıp birden fazla ilişkili uygulamaya erişmesini sağlar. Şirketlerde yaygındır (e-postana giriş yaptığında kurum içi araçlara da giriş yapmış olursun).</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Orta düzey geliştiricilerin eklediği \"Google/GitHub ile devam et\" düğmeleri, arka planda neredeyse her zaman özel bir kimlik doğrulama sistemi yerine OAuth 2.0 kullanır.</p>\n        <h4 class=\"content-subheading\">Authorization (Yetkilendirme)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Kimliği doğrulanmış kullanıcının hangi kaynaklara erişmesine izin verildiğini belirleme sürecidir.</li>\n          <li>Gerçek Hayattan Örnek: Otel resepsiyonisti kimliğini doğruladıktan sonra sana yalnızca 304 numaralı odayı açacak şekilde programlanmış bir kart verir. Diğer konukların odalarına veya yönetim ofislerine girmeni engeller.</li>\n          <li>Neden Önemli?: Authentication kim olduğunu doğrular; Authorization ise normal kullanıcıların yönetici kontrollerini veya diğer kullanıcıların kişisel verilerini değiştirememesi için kesin sınırlar uygular.</li>\n        </ul>\n        <p>Karşılaştırma Tablosu: Authentication ve Authorization</p>\n        <table class=\"tcompare\">\n          <tr><th>Özellik</th><th>Authentication</th><th>Authorization</th></tr>\n          <tr><td>Temel Soru</td><td>\"Sen kimsin?\"</td><td>\"Ne yapmana izin var?\"</td></tr>\n          <tr><td>Kontrol Süreci</td><td>Kimliği doğrular (şifre, biyometri, OTP)</td><td>İzinleri doğrular (roller, erişim kontrol listeleri)</td></tr>\n          <tr><td>İşlem Sırası</td><td>Önce gerçekleşir</td><td>Kimlik doğrulamadan sonra gerçekleşir</td></tr>\n        </table>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>RBAC ve ABAC</h3>\n        <p>Uygulamada birden fazla kullanıcı türü olduğunda yetkilendirme bir modele ihtiyaç duyar:</p>\n        <ul class=\"plain\">\n          <li>RBAC (Rol Tabanlı Erişim Kontrolü) — izinler rollere (\"yönetici\", \"editör\", \"görüntüleyici\") bağlanır; kullanıcılara bir veya daha fazla rol atanır. Anlaşılması kolaydır ve çoğu uygulamanın ihtiyacını karşılar.</li>\n          <li>ABAC (Nitelik Tabanlı Erişim Kontrolü) — izinler kullanıcı, kaynak ve bağlamın niteliklerinden hesaplanır (örneğin \"yönetici yalnızca kendi departmanının harcamalarını ve yalnızca mesai saatlerinde onaylayabilir\"). Daha esnektir; ancak uygulaması ve denetimi daha karmaşıktır.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Aslında ABAC tarzı kurallar gerekirken RBAC seçmek, kodun her yanına dağılmış özel durum \"if\" ifadeleriyle dolu bir sisteme yol açar. İhtiyacı erken fark etmek, izin mantığını merkezi ve denetlenebilir tutar.</p>\n        <h4 class=\"content-subheading\">Cookies (Çerezler)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Küçük verileri ve kullanıcı tercihlerini tutmak için kullanıcının tarayıcısında saklanan küçük metin dosyalarıdır.</li>\n          <li>Gerçek Hayattan Örnek: Otelde kalırken resepsiyona fazladan yastık tercih ettiğini söylersin. Gelecekteki konaklamalarında tercihini hatırlamak için bunu bankoda tutulan küçük bir karta yazarlar.</li>\n          <li>Neden Önemli?: Küçük tercihleri istemci tarafında saklamak, backend sunucularına gereksiz veri işleme yükü getirmeden kullanıcı deneyimini kişiselleştirir.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Cookie Güvenlik Nitelikleri</h3>\n        <p>Bir cookie'nin davranışı ve güvenliği büyük ölçüde oluşturulurken ayarlanan bayraklara bağlıdır. Bunlar gerçek güvenlik hatalarının sık görülen nedenlerindendir:</p>\n        <table class=\"tcompare\">\n          <tr><th>Nitelik</th><th>Ne Yapar?</th></tr>\n          <tr><td>HttpOnly</td><td>JavaScript'in cookie'yi okumasını engelleyerek XSS saldırısının etkisini azaltır.</td></tr>\n          <tr><td>Secure</td><td>Cookie yalnızca HTTPS üzerinden gönderilir; düz HTTP üzerinden asla gönderilmez.</td></tr>\n          <tr><td>SameSite</td><td>Cookie'nin siteler arası isteklerde gönderilip gönderilmeyeceğini kontrol eder. CSRF saldırılarına karşı temel savunmalardandır (Strict, Lax veya None).</td></tr>\n          <tr><td>Expires / Max-Age</td><td>Cookie'nin ne kadar süre kalacağını belirler. Süresi belirtilmeyen oturum cookie'si tarayıcı kapanınca kaybolur.</td></tr>\n        </table>\n        <h4 class=\"content-subheading\">Sessions (Oturumlar)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Kullanıcının aktif durumunu birden fazla istek boyunca takip etmek için kullanılan sunucu tarafı durum yönetimi mekanizmalarıdır.</li>\n          <li>Gerçek Hayattan Örnek: Otel resepsiyonu aktif konaklamanı merkezi misafir defterine kaydeder. Çıkış yapmadığın sürece personel binadaki aktif varlığını tanır.</li>\n          <li>Neden Önemli?: Oturumlar, sunucunun kullanıcının giriş yapmış olduğunu birden fazla sayfa görüntüleme boyunca hatırlamasını sağlar; her tıklamada şifre yazma ihtiyacını ortadan kaldırır.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Oturum Verisi Gerçekte Nerede Tutulur?</h3>\n        <p>Bir oturum genellikle cookie'de saklanan bir kimlikle temsil edilir; arkasındaki gerçek veri sunucuda yaşar. Her istekte \"Bu kullanıcı giriş yapmış mı?\" kontrolü daha yavaş, disk tabanlı depolamaya yük getirmesin diye ana veritabanı yerine çoğunlukla Redis gibi hızlı, bellek içi bir depoda tutulur. Bilinen risklerden biri session fixation'dır: saldırgan kullanıcıyı bilinen bir oturum kimliğini kullanmaya yönlendirir. Standart savunma, girişten hemen sonra tamamen yeni bir oturum kimliği üretmektir.</p>\n        <h4 class=\"content-subheading\">Tokens (Jetonlar)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: İstemci ile sunucu arasında güvenlik bilgisini güvenle aktarmak için kullanılan dijital erişim bilgileridir.</li>\n          <li>Gerçek Hayattan Örnek: Otele girişte verilen oda kartı fiziksel erişim token'ı gibi davranır. Her kapıyı elle açmaları için resepsiyonu aramak yerine kartı kapıda okutursun.</li>\n          <li>Neden Önemli?: Token'lar, hassas kimlik bilgilerini açığa çıkarmadan mikroservisler ve dış platformlar arasında durumsuz ve güvenli doğrulamaya olanak tanır.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Access Token ve Refresh Token</h3>\n        <p>Canlı sistemler genellikle güvenlik ile kullanım kolaylığı arasında denge kurarak tek token yerine iki token verir:</p>\n        <ul class=\"plain\">\n          <li>Access token (erişim token'ı) — kısa ömürlüdür (dakikalar); kimliği kanıtlamak için her API isteğiyle gönderilir.</li>\n          <li>Refresh token (yenileme token'ı) — uzun ömürlüdür, daha dikkatli saklanır ve yalnızca eski erişim token'ının süresi dolduğunda kullanıcıyı yeniden giriş yapmaya zorlamadan yenisini almak için kullanılır.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Bu ayrım, kullanıcıyı günlerce veya haftalarca giriş yapmış tutarken sızan erişim token'ının zararını sınırlar; çünkü token hızla sona erer. Erişimi iptal etmek (örneğin çıkışta veya \"tüm cihazlardan çıkış yap\" işleminde), sunucuda yenileme token'ını geçersiz kılmak demektir. Durumsuz bir erişim token'ı normalde kendi süresi dolmadan geri alınamaz.</p>\n        <h4 class=\"content-subheading\">JWT (JSON Web Token)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Dijital imzalar kullanarak taraflar arasında doğrulanmış beyanları JSON biçiminde güvenle ileten standart token biçimidir.</li>\n          <li>Gerçek Hayattan Örnek: Otel kartında, son kullanım zamanı (öğlen 12.00 çıkış saati) ile kriptografik olarak imzalanmış dijital bir çip bulunur. Asansör ve oda kapıları konaklamanı anında doğrulamak için bu imzalı çipi çevrimdışı okur.</li>\n          <li>Neden Önemli?: JWT'ler imzalı beyanlar içerdiğinden backend sunucuları her seferinde veritabanını sorgulamadan istekleri doğrulayabilir; bu da yüksek ölçeklenebilirlik sağlar.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>JWT Yapısı ve Ödünleşimler</h3>\n        <p>JWT, noktalarla ayrılmış Base64 kodlu üç parçadan oluşur: header, payload ve signature:</p>\n        <p>header.payload.signature</p>\n        <p>eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjV9.4f3c9a…</p>\n        <ul class=\"plain\">\n          <li>Header — kullanılan imzalama algoritmasını belirtir (örneğin HS256, RS256).</li>\n          <li>Payload — asıl beyanlardır (kullanıcı kimliği, roller, son kullanım zamanı). Not: bu kısım yalnızca kodlanmıştır, şifrelenmemiştir. Herkes kodunu çözüp okuyabilir; bu yüzden JWT payload'ına asla hassas veri konulmamalıdır.</li>\n          <li>Signature — token'ın değiştirilmediğini kanıtlar; yalnızca sırrı (veya özel anahtarı) bilen sunucu geçerli imza üretebilir.</li>\n        </ul>\n        <p>JWT ile geleneksel sunucu tarafı oturumlar arasında seçim, orta düzeyde sık karşılaşılan bir tasarım kararıdır:</p>\n        <table class=\"tcompare\">\n          <tr><th></th><th>Oturum Tabanlı Kimlik Doğrulama</th><th>JWT Tabanlı Kimlik Doğrulama</th></tr>\n          <tr><td>Sunucunun durum saklaması gerekir mi?</td><td>Evet (oturum deposu)</td><td>Hayır (kendi bilgilerini taşıyan token)</td></tr>\n          <tr><td>Hemen iptal etmek kolay mı?</td><td>Evet (oturumu sil)</td><td>Zor (token süresi dolana kadar geçerlidir)</td></tr>\n          <tr><td>Servisler arasında kolay ölçeklenir mi?</td><td>Ortak oturum deposu gerekir</td><td>Evet — her servis imzayı doğrulayabilir</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">JWT'ler durumsuz, dağıtık sistemlerde popülerdir; ancak süre dolmadan iptal edilmelerinin zorluğu gerçek bir ödünleşimdir. Pratikte kısa geçerlilik süreleri ile refresh token akışı birlikte kullanılarak veya ele geçirilmiş hesap gibi kritik durumlarda sunucu tarafı token engelleme listesiyle bu sorun azaltılır.</p>\n      </div>"
    },
    "en": {
      "title": "Authentication & User Management",
      "summary": "General Overview",
      "html": "\n      <div class=\"tsec\">\n        <p>General Overview</p>\n        <p>The framework responsible for allowing users to log in securely, verifying their identity, managing their permissions, and handling their sessions seamlessly.</p>\n        <p>Term Breakdown</p>\n        <h4 class=\"content-subheading\">Authentication</h4>\n        <ul class=\"plain\">\n          <li>Definition: The process of verifying the identity claimed by a user (e.g., username and password).</li>\n          <li>Real-Life Example: Imagine walking into a hotel reception. You tell the receptionist your name and hand over your ID card to prove who you are.</li>\n          <li>Why This Matters: Without identity verification, any unauthorized user could claim to be an account owner, leading to complete security failure and data breaches.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Beyond the Password</h3>\n        <p>Password-only authentication is a beginner-level baseline. Real systems typically add:</p>\n        <ul class=\"plain\">\n          <li>MFA / 2FA (Multi-Factor Authentication) — requires a second proof of identity beyond the password, such as a one-time code from an app or SMS. It defends against stolen or leaked passwords.</li>\n          <li>OAuth 2.0 — an authorization framework that lets a user grant one app limited access to their data on another service without sharing their password (e.g., \"Continue with Google\").</li>\n          <li>SSO (Single Sign-On) — lets a user log in once and gain access to multiple related applications, common inside companies (log in to your email, and you're also signed into internal tools).</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">\"Continue with Google/GitHub\" buttons that intermediate developers implement are almost always OAuth 2.0 under the hood, not custom authentication.</p>\n        <h4 class=\"content-subheading\">Authorization</h4>\n        <ul class=\"plain\">\n          <li>Definition: The process of determining what resources an authenticated user is allowed to access.</li>\n          <li>Real-Life Example: After verifying your ID, the hotel receptionist hands you a keycard programmed strictly to open Room 304, preventing you from entering other guests' rooms or administrative offices.</li>\n          <li>Why This Matters: Authentication confirms who you are, but Authorization enforces strict boundaries so regular users cannot tamper with admin controls or other users' personal data.</li>\n        </ul>\n        <p>Comparison Table: Authentication vs. Authorization</p>\n        <table class=\"tcompare\">\n          <tr><th>Feature</th><th>Authentication</th><th>Authorization</th></tr>\n          <tr><td>Primary Question</td><td>\"Who are you?\"</td><td>\"What are you allowed to do?\"</td></tr>\n          <tr><td>Check Process</td><td>Validates identity (Passwords, Biometrics, OTP)</td><td>Validates permissions (Roles, Access Control Lists)</td></tr>\n          <tr><td>Execution Order</td><td>Happens first</td><td>Happens after authentication</td></tr>\n        </table>\n        <h3><span class=\"tag\">DEEP DIVE</span>RBAC vs. ABAC</h3>\n        <p>Once an application has more than one type of user, authorization needs a model:</p>\n        <ul class=\"plain\">\n          <li>RBAC (Role-Based Access Control) — permissions are attached to roles (\"admin,\" \"editor,\" \"viewer\"), and users are assigned one or more roles. Simple to reason about and covers most applications.</li>\n          <li>ABAC (Attribute-Based Access Control) — permissions are computed from attributes of the user, resource, and context (e.g., \"a manager can approve expenses only for their own department, and only during business hours\"). More flexible, but more complex to implement and audit.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">choosing RBAC when ABAC-style rules are actually needed leads to a system full of special-case \"if\" statements scattered through the code; recognizing the pattern early keeps permission logic centralized and auditable.</p>\n        <h4 class=\"content-subheading\">Cookies</h4>\n        <ul class=\"plain\">\n          <li>Definition: Small text files stored on the user's browser to hold lightweight data and user preferences.</li>\n          <li>Real-Life Example: During your hotel stay, you inform the front desk that you prefer extra pillows. They write this note on a small card kept at the desk so they remember your preference for future stays.</li>\n          <li>Why This Matters: Storing light preferences client-side personalizes the user experience without placing unnecessary data-processing overhead on the backend servers.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Cookie Security Attributes</h3>\n        <p>A cookie's behavior and safety depend heavily on the flags set when it's created — this is a frequent source of real security bugs:</p>\n        <table class=\"tcompare\">\n          <tr><th>Attribute</th><th>What It Does</th></tr>\n          <tr><td>HttpOnly</td><td>Blocks JavaScript from reading the cookie, reducing the impact of an XSS attack.</td></tr>\n          <tr><td>Secure</td><td>The cookie is only ever sent over HTTPS, never plain HTTP.</td></tr>\n          <tr><td>SameSite</td><td>Controls whether the cookie is sent on cross-site requests, which is a key defense against CSRF attacks (Strict, Lax, or None).</td></tr>\n          <tr><td>Expires / Max-Age</td><td>Defines how long the cookie persists — a session cookie (no expiry) disappears when the browser closes.</td></tr>\n        </table>\n        <h4 class=\"content-subheading\">Sessions</h4>\n        <ul class=\"plain\">\n          <li>Definition: Server-side state management mechanisms used to keep track of a user's active status across multiple requests.</li>\n          <li>Real-Life Example: The hotel desk logs your active stay in their central guest register. As long as you remain checked in, the staff recognizes your active presence in the building.</li>\n          <li>Why This Matters: Sessions allow the server to remember that a user is actively logged in across multiple page views, eliminating the need to type passwords on every click.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Where Session Data Actually Lives</h3>\n        <p>A session is usually just an ID stored in a cookie; the real data behind it lives on the server, commonly in a fast in-memory store like Redis rather than the main database, so that checking \"is this user logged in?\" doesn't add load to slower, disk-based storage on every single request. A known risk is session fixation, where an attacker tricks a user into using a known session ID; the standard defense is to generate a brand-new session ID immediately after login.</p>\n        <h4 class=\"content-subheading\">Tokens</h4>\n        <ul class=\"plain\">\n          <li>Definition: Digital access credentials used to exchange security information safely between client and server.</li>\n          <li>Real-Life Example: The hotel keycard given to you at check-in acts as a physical access token. You scan it at doors instead of calling the front desk to unlock every door manually.</li>\n          <li>Why This Matters: Tokens allow stateless and secure verification across microservices and external platforms without exposing sensitive credentials.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Access Tokens vs. Refresh Tokens</h3>\n        <p>Production systems typically issue two tokens instead of one, trading off security against convenience:</p>\n        <ul class=\"plain\">\n          <li>Access token — short-lived (minutes), sent with every API request to prove identity.</li>\n          <li>Refresh token — long-lived, stored more carefully, and used only to obtain a new access token once the old one expires, without forcing the user to log in again.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">this split limits the damage of a leaked access token (it expires quickly) while still keeping the user logged in for days or weeks. Revoking access (e.g., on logout, or \"log out of all devices\") means invalidating the refresh token on the server, since a stateless access token normally can't be un-issued before it naturally expires.</p>\n        <h4 class=\"content-subheading\">JWT (JSON Web Token)</h4>\n        <ul class=\"plain\">\n          <li>Definition: A standard token format used to transmit verified claims between parties securely in JSON format using digital signatures.</li>\n          <li>Real-Life Example: Your hotel keycard contains a digital chip cryptographically signed with an expiration date (12:00 PM check-out). The elevator and room doors read this signed chip offline to verify your stay instantly.</li>\n          <li>Why This Matters: Because JWTs contain signed claims, backend servers can verify requests without querying a database every time, allowing high scalability.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>JWT Structure and Trade-offs</h3>\n        <p>A JWT is three Base64-encoded parts separated by dots — header, payload, and signature:</p>\n        <p>header.payload.signature</p>\n        <p>eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjV9.4f3c9a…</p>\n        <ul class=\"plain\">\n          <li>Header — specifies the signing algorithm used (e.g., HS256, RS256).</li>\n          <li>Payload — the actual claims (user ID, roles, expiration time). Note: this part is only encoded, not encrypted — anyone can decode and read it, so sensitive data should never go in a JWT payload.</li>\n          <li>Signature — proves the token wasn't tampered with; only the server that knows the secret (or private key) can produce a valid signature.</li>\n        </ul>\n        <p>JWT vs. traditional server-side sessions is a common intermediate design decision:</p>\n        <table class=\"tcompare\">\n          <tr><th></th><th>Session-Based Auth</th><th>JWT-Based Auth</th></tr>\n          <tr><td>Server needs to store state?</td><td>Yes (session store)</td><td>No (self-contained token)</td></tr>\n          <tr><td>Easy to revoke immediately?</td><td>Yes (delete the session)</td><td>Hard (token is valid until it expires)</td></tr>\n          <tr><td>Scales across services easily?</td><td>Needs a shared session store</td><td>Yes — any service can verify the signature</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">JWTs are popular for stateless, distributed systems, but their difficulty to revoke early is a real trade-off — mitigated in practice with short expirations plus a refresh-token flow, or a server-side token blocklist for critical cases like a compromised account.</p>\n      </div>"
    }
  },
  {
    "id": 6,
    "icon": "shield",
    "depth": "-240 m",
    "tr": {
      "title": "Güvenlik ve Performans",
      "summary": "Genel Bakış",
      "html": "\n      <div class=\"tsec\">\n        <p>Genel Bakış</p>\n        <p>Web uygulamalarını dış tehditlere karşı korumak, yetkisiz erişimi önlemek ve hızlı, güvenilir kullanıcı deneyimleri sunmak için tasarlanmış temel mekanizmalardır.</p>\n        <p>Terimlerin Açıklaması</p>\n        <h4 class=\"content-subheading\">CORS (Cross-Origin Resource Sharing)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Kaynakların farklı origin'ler (alan adları) arasında güvenli şekilde nasıl paylaşılacağını düzenleyen bir tarayıcı güvenlik kuralıdır.</li>\n          <li>Gerçek Hayattan Örnek: Güvenli bir banka binası düşün. Güvenlik görevlisi yalnızca güvenilen, önceden onaylanmış ortak kuruluşlarla işlem yapılmasına izin verir; bilinmeyen üçüncü tarafların araçla hizmet şeridine girmesini engeller.</li>\n          <li>Neden Önemli?: Kötü amaçlı sitelerin, durumdan habersiz bir ziyaretçi adına backend servislerine sessizce yetkisiz istekler göndermesini önler.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Preflight İsteği</h3>\n        <p>CORS'u sunucu değil tarayıcı uygular; sunucu yalnızca Access-Control-Allow-Origin header'ıyla neye izin verdiğini bildirir. Basit olmayan isteklerde (örneğin PUT/DELETE veya Authorization gibi özel header'lar kullanıldığında) tarayıcı, asıl isteği göndermeden önce \"Bu isteğe izin verir misin?\" diye soran, preflight adı verilen otomatik bir OPTIONS isteği gönderir:</p>\n        <p>OPTIONS /api/users/5 HTTP/1.1</p>\n        <p>Origin: https://myapp.com</p>\n        <p>Access-Control-Request-Method: DELETE</p>\n        <p>HTTP/1.1 204 No Content</p>\n        <p>Access-Control-Allow-Origin: https://myapp.com</p>\n        <p>Access-Control-Allow-Methods: GET, POST, DELETE</p>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Orta düzey geliştiricileri sık şaşırtan durumlardan biri, tek API çağrısı gibi görünen işlem için iki ağ isteği görmektir. Nedeni görünmeyen OPTIONS preflight isteğidir; bunu doğru yanıtlamayan, yanlış yapılandırılmış sunucu pratikteki en yaygın CORS hatalarından biridir.</p>\n        <h4 class=\"content-subheading\">Cache (Önbellek)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Sık erişilen veriyi, sonraki isteklerde daha hızlı getirmek için geçici olarak saklamaktır.</li>\n          <li>Gerçek Hayattan Örnek: Banka görevlisi, müşteri döviz kurunu her sorduğunda merkezi dosya odasına yürümek yerine günlük faiz oranlarının basılı bir listesini masasında tutar.</li>\n          <li>Neden Önemli?: Önbellekleme, veritabanı yükünü ve gecikmeyi büyük ölçüde azaltarak son kullanıcıya neredeyse anlık yanıtlar sunar.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Önbellekleme Nerede Yapılır ve Nasıl Geçersiz Kılınır?</h3>\n        <p>Önbellekleme tek bir katmandan oluşmaz; istek yolu boyunca farklı noktalarda yapılır ve her katman farklı bir sorunu çözer:</p>\n        <table class=\"tcompare\">\n          <tr><th>Katman</th><th>Örnek</th><th>Tipik Kullanım</th></tr>\n          <tr><td>Tarayıcı önbelleği</td><td>Statik dosyalardaki Cache-Control header'ı</td><td>Değişmeyen görsellerin, CSS ve JS dosyalarının tekrar indirilmesini önlemek</td></tr>\n          <tr><td>CDN (İçerik Dağıtım Ağı)</td><td>Önbellekteki sayfa ve dosyaları kullanıcıya yakın noktadan sunan Cloudflare, Fastly</td><td>Dünya genelinde gecikmeyi ve kaynak sunucunun yükünü azaltmak</td></tr>\n          <tr><td>Uygulama / sunucu önbelleği</td><td>Redis, Memcached</td><td>Maliyetli sorguları veya hesaplamaları tekrar çalıştırmamak</td></tr>\n          <tr><td>Veritabanı önbelleği</td><td>Veritabanı motoru içinde sorgu sonuçlarının önbelleğe alınması</td><td>Tekrarlanan aynı sorguları hızlandırmak</td></tr>\n        </table>\n        <p>Önbelleklemenin en zor kısmı geçersiz kılmadır (invalidation): önbellekteki verinin ne zaman eskidiğini bilmek. İki yaygın strateji:</p>\n        <ul class=\"plain\">\n          <li>TTL (Time To Live) — önbellek kaydı belirli bir süreden sonra otomatik sona erer (basittir; ancak veri kısa süreliğine güncelliğini yitirmiş olabilir).</li>\n          <li>ETag / koşullu istekler — sunucu kaynağın her sürümüne bir parmak izi (ETag) verir. İstemci bunu sonraki istekte geri gönderir; hiçbir şey değişmediyse sunucu hafif bir \"304 Not Modified\" yanıtı vererek aynı verinin tekrar gönderilmesini önler.</li>\n        </ul>\n        <h4 class=\"content-subheading\">Frontend Performansı</h4>\n        <ul class=\"plain\">\n          <li>Tanım: İlk baytın alınmasından kullanıcının gerçekten etkileşime geçebildiği ana kadar, bir sayfanın tarayıcıda ne kadar hızlı ve akıcı kullanılabilir hale geldiğidir.</li>\n          <li>Gerçek Hayattan Örnek: Kasa (sunucu) anında yanıt verse bile müşteri, görevliye ulaşmadan önce kapılarla dolu bir labirentten geçiyorsa veya form imzalarken banko sürekli yana kayıyorsa bankayı yavaş hisseder.</li>\n          <li>Neden Önemli?: Backend'in 50 ms'de yanıt vermesi, herhangi bir şey tıklanabilir olmadan önce tarayıcı üç saniye JavaScript indirip çalıştırıyorsa boşa gider. Kullanıcılar hızı yalnızca sunucu yanıt süresiyle değil, yaşadıkları deneyimle değerlendirir.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Core Web Vitals</h3>\n        <p>Google, kullanıcının gerçekte hissettiklerini yaklaşık olarak yansıtan üç metriği tanımladı. Bunlar frontend performansını ölçmek ve izlemek için yaygın kullanılır:</p>\n        <table class=\"tcompare\">\n          <tr><th>Metrik</th><th>Neyi Ölçer?</th><th>İyi Hedef</th></tr>\n          <tr><td>LCP (Largest Contentful Paint)</td><td>Ana içeriğin (örneğin büyük açılış görseli veya başlığın) görünür olmasına kadar geçen süre.</td><td>2,5 saniyenin altında</td></tr>\n          <tr><td>INP (Interaction to Next Paint)</td><td>Tıklama, dokunma veya tuşa basma sonrasında sayfanın yanıt vermesi için geçen süre.</td><td>200 ms'nin altında</td></tr>\n          <tr><td>CLS (Cumulative Layout Shift)</td><td>Sayfa yüklenirken görünür içeriğin beklenmedik şekilde ne kadar yer değiştirdiği.</td><td>0,1'in altında</td></tr>\n        </table>\n        <p>Bunları iyileştirmek için yaygın teknikler: kod bölme ve lazy loading (yalnızca sayfanın o anda ihtiyaç duyduğu JavaScript'i göndermek), görsel optimizasyonu ve modern biçimler, tarayıcının indirip ayrıştıracağı veriyi azaltmak için küçültme ve paketleme.</p>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Bu metrikler artık arama sıralamasını ve dönüşüm oranlarını doğrudan etkiliyor. Teknik olarak doğru çalışan backend, yavaş hissettiren frontend ile birleştiğinde yine kullanıcı kaybettirir. Bu nedenle performans yalnızca backend'in değil, tüm katmanların ortak sorumluluğu olarak ele alınır.</p>\n        <h4 class=\"content-subheading\">HTTPS / SSL</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Dinlemeyi ve değiştirmeyi önlemek için istemci ile sunucu arasındaki tüm veri trafiğini şifreleyen güvenli protokoldür.</li>\n          <li>Gerçek Hayattan Örnek: Banka görevlisiyle konuşurken aranızdaki kurşun geçirmez cam, çevreden geçenlerin alışverişini yaptığınız para ve notları ele geçirmesini veya değiştirmesini önler.</li>\n          <li>Neden Önemli?: Şifrelenmemiş HTTP trafiği, açık Wi-Fi ağlarındaki saldırganların kimlik bilgilerini, kredi kartı ayrıntılarını ve özel uygulama verilerini çalmasına olanak tanır.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>TLS El Sıkışması ve Sertifikalar</h3>\n        <p>HTTPS, TLS (Transport Layer Security) üzerinde çalışan HTTP'dir; SSL ise onun eski, kullanım dışı öncülüdür. HTTP verisi gönderilmeden önce istemci ve sunucu TLS el sıkışması yapar:</p>\n        <ul class=\"plain\">\n          <li>Sunucu, güvenilen bir Sertifika Yetkilisi (CA) tarafından verilen ve gerçekten iddia ettiği alan adına ait olduğunu kanıtlayan dijital sertifika sunar.</li>\n          <li>İstemci ve sunucu, ortak bir sır üzerinde anlaşmak için asimetrik (açık/özel anahtar) kriptografi kullanır.</li>\n          <li>Bundan sonra gerçek trafiğin hızlı simetrik şifrelemesinde bu ortak sır kullanılır.</li>\n        </ul>\n        <p>Let's Encrypt gibi sağlayıcıların ücretsiz, otomatik sertifikaları, HTTPS'i yalnızca ödeme alan siteler için değil tüm siteler için fiilen ücretsiz ve standart hale getirdi. Modern tarayıcılar artık düz HTTP sitelerini \"Güvenli Değil\" olarak işaretliyor.</p>\n        <h4 class=\"content-subheading\">Rate Limiting (Hız Sınırlama)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Kullanıcının veya IP adresinin belirli bir zaman aralığında yapabileceği istek sayısını sınırlayan koruma stratejisidir.</li>\n          <li>Gerçek Hayattan Örnek: Banka girişindeki güvenlik görevlisi, yoğun saatlerde düzeni korumak ve şubenin aşırı kalabalıklaşmasını önlemek için dakikada yalnızca 10 kişiyi içeri alır.</li>\n          <li>Neden Önemli?: Uygulama sunucularını hizmet reddi (DoS) saldırılarından, kaba kuvvet denemelerinden ve ani trafik artışlarında kaynak tükenmesinden korur.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Hız Sınırlama Algoritmaları</h3>\n        <p>Sınır uygulamanın birden fazla yolu vardır. Seçilen algoritma, ani trafik patlamalarının nasıl ele alınacağını etkiler:</p>\n        <ul class=\"plain\">\n          <li>Sabit pencere (fixed window) — örneğin her dakika başında sıfırlanan \"dakikada 100 istek\". Basittir; ancak pencere sınırında 200 istek patlamasına izin verebilir.</li>\n          <li>Kayan pencere (sliding window) — istekleri sabit saat sınırı yerine kayan bir zaman aralığında sayarak bu ani yığılma sorununu yumuşatır.</li>\n          <li>Token bucket — her kullanıcının sabit hızda yeniden dolan bir token \"kovası\" vardır; her istek bir token tüketir. Uzun vadeli ortalama hızı sınırlandırırken kısa patlamalara izin verir. Canlı API gateway'lerinde en yaygın yaklaşımdır.</li>\n        </ul>\n        <p>İyi tasarlanmış API, sınırlarını X-RateLimit-Remaining ve Retry-After gibi header'larla istemciye bildirir. Böylece istemciler sunucuyu istek yağmuruna tutmak yerine uygun şekilde bekleyebilir (3. bölümdeki 429 durum koduyla bağlantılıdır).</p>\n      </div>"
    },
    "en": {
      "title": "Security & Performance",
      "summary": "General Overview",
      "html": "\n      <div class=\"tsec\">\n        <p>General Overview</p>\n        <p>Core mechanisms designed to protect web applications against external threats, prevent unauthorized access, and deliver high-speed, reliable user experiences.</p>\n        <p>Term Breakdown</p>\n        <h4 class=\"content-subheading\">CORS (Cross-Origin Resource Sharing)</h4>\n        <ul class=\"plain\">\n          <li>Definition: A browser security rule that governs how resources are shared safely across different origins (domains).</li>\n          <li>Real-Life Example: Think of a secure bank building. The security guard only permits transactions with trusted, pre-approved partner agencies, blocking unknown third parties from entering the drive-thru lane.</li>\n          <li>Why This Matters: It prevents malicious websites from silently executing unauthorized requests against your backend services on behalf of an unsuspecting visitor.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>The Preflight Request</h3>\n        <p>CORS is enforced by the browser, not the server — the server simply announces what it allows, via the Access-Control-Allow-Origin header. For \"non-simple\" requests (e.g., using PUT/DELETE, or custom headers like Authorization), the browser first sends an automatic OPTIONS request called a preflight, asking the server \"would you allow this real request?\" before sending the actual one:</p>\n        <p>OPTIONS /api/users/5 HTTP/1.1</p>\n        <p>Origin: https://myapp.com</p>\n        <p>Access-Control-Request-Method: DELETE</p>\n        <p>HTTP/1.1 204 No Content</p>\n        <p>Access-Control-Allow-Origin: https://myapp.com</p>\n        <p>Access-Control-Allow-Methods: GET, POST, DELETE</p>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">a common source of confusion for intermediate developers is seeing two network requests for what looks like one API call — the invisible OPTIONS preflight is the reason, and a misconfigured server that doesn't answer it correctly is one of the most common CORS bugs in practice.</p>\n        <h4 class=\"content-subheading\">Cache</h4>\n        <ul class=\"plain\">\n          <li>Definition: Temporary storage of frequently accessed data to allow faster retrieval in future requests.</li>\n          <li>Real-Life Example: Real-Life Example: Instead of walking back to the central file room every time a customer asks for exchange rates, the bank teller keeps a printed sheet of daily interest rates right on their desk.</li>\n          <li>Why This Matters: Caching drastically reduces database load and latency, delivering near-instant responses to end users.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Where Caching Happens, and How It's Invalidated</h3>\n        <p>Caching isn't one layer — it happens at several points along the request path, and each layer solves a different problem:</p>\n        <table class=\"tcompare\">\n          <tr><th>Layer</th><th>Example</th><th>Typical Use</th></tr>\n          <tr><td>Browser cache</td><td>Cache-Control header on static assets</td><td>Avoid re-downloading unchanged images, CSS, JS</td></tr>\n          <tr><td>CDN (Content Delivery Network)</td><td>Cloudflare, Fastly serving cached pages/assets near the user</td><td>Reduce latency and origin server load globally</td></tr>\n          <tr><td>Application / server cache</td><td>Redis, Memcached</td><td>Avoid re-running expensive queries or computations</td></tr>\n          <tr><td>Database cache</td><td>Query result caching inside the database engine</td><td>Speed up repeated identical queries</td></tr>\n        </table>\n        <p>The hardest part of caching is invalidation — knowing when cached data has gone stale. Two common strategies:</p>\n        <ul class=\"plain\">\n          <li>TTL (Time To Live) — the cache entry automatically expires after a fixed time (simple, but data can be briefly stale).</li>\n          <li>ETag / conditional requests — the server gives each version of a resource a fingerprint (ETag); the client sends it back on the next request, and the server replies with a lightweight \"304 Not Modified\" if nothing changed, avoiding re-sending the same data.</li>\n        </ul>\n        <h4 class=\"content-subheading\">Frontend Performance</h4>\n        <ul class=\"plain\">\n          <li>Definition: How quickly and smoothly a page becomes usable in the browser — from the first byte received to the moment the user can actually interact with it.</li>\n          <li>Real-Life Example: Even if the vault (the server) responds instantly, a customer still feels the bank is slow if the lobby is a maze of doors before reaching the teller, or if the counter keeps sliding sideways while they’re trying to sign a form.</li>\n          <li>Why This Matters: A backend that responds in 50ms is wasted if the browser then spends three seconds downloading and running JavaScript before anything is clickable — users judge speed by what they experience, not by server response time alone.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Core Web Vitals</h3>\n        <p>Google formalized three metrics that approximate what a user actually feels, and they are commonly used to measure and monitor frontend performance:</p>\n        <table class=\"tcompare\">\n          <tr><th>Metric</th><th>What It Measures</th><th>Good Target</th></tr>\n          <tr><td>LCP (Largest Contentful Paint)</td><td>How long until the main content (e.g., a hero image or headline) is visible.</td><td>Under 2.5s</td></tr>\n          <tr><td>INP (Interaction to Next Paint)</td><td>How long the page takes to respond after a click, tap, or key press.</td><td>Under 200ms</td></tr>\n          <tr><td>CLS (Cumulative Layout Shift)</td><td>How much visible content unexpectedly jumps around as the page loads.</td><td>Under 0.1</td></tr>\n        </table>\n        <p>Common techniques to improve these: code splitting and lazy loading (only sending the JavaScript a page actually needs right now), image optimization and modern formats, and minification/bundling to shrink what the browser has to download and parse.</p>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">these metrics now directly affect search ranking and conversion rates — a technically correct backend paired with a slow-feeling frontend still loses users, which is why performance is treated as a shared responsibility across the stack, not just a backend concern.</p>\n        <h4 class=\"content-subheading\">HTTPS / SSL</h4>\n        <ul class=\"plain\">\n          <li>Definition: A secure protocol that encrypts all data traffic between the client and server to prevent eavesdropping and tampering.</li>\n          <li>Real-Life Example: When you speak with a teller at the bank, a bulletproof glass partition ensures that passersby cannot intercept or alter the money and notes you exchange.</li>\n          <li>Why This Matters: Unencrypted HTTP traffic allows attackers on open Wi-Fi networks to steal credentials, credit card details, and private application data.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>The TLS Handshake and Certificates</h3>\n        <p>\"HTTPS\" is HTTP running over TLS (Transport Layer Security; SSL is its older, retired predecessor). Before any HTTP data is sent, client and server perform a TLS handshake:</p>\n        <ul class=\"plain\">\n          <li>The server presents a digital certificate, issued by a trusted Certificate Authority (CA), proving it really is the domain it claims to be.</li>\n          <li>Client and server use asymmetric (public/private key) cryptography to agree on a shared secret.</li>\n          <li>From then on, that shared secret is used for fast symmetric encryption of the actual traffic.</li>\n        </ul>\n        <p>Free, automated certificates from providers like Let's Encrypt made HTTPS effectively free and standard for all sites, not just those handling payments — modern browsers now flag plain HTTP sites as \"Not Secure.\"</p>\n        <h4 class=\"content-subheading\">Rate Limiting</h4>\n        <ul class=\"plain\">\n          <li>Definition: A protective strategy that caps the number of requests a user or IP address can make within a set timeframe.</li>\n          <li>Real-Life Example: A security guard at the bank entrance lets only 10 people enter per minute during peak hours to maintain order and prevent overcrowding inside the branch.</li>\n          <li>Why This Matters: It protects application servers from Denial of Service (DoS) attacks, brute-force attempts, and resource exhaustion during traffic spikes.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Rate Limiting Algorithms</h3>\n        <p>There's more than one way to implement a limit, and the algorithm chosen affects how \"bursty\" traffic is handled:</p>\n        <ul class=\"plain\">\n          <li>Fixed window — e.g., \"100 requests per minute,\" reset at the top of each minute. Simple, but allows a burst of 200 requests right at the window boundary.</li>\n          <li>Sliding window — counts requests in a rolling time frame instead of a fixed clock boundary, smoothing out that burst problem.</li>\n          <li>Token bucket — each user has a \"bucket\" of tokens that refills at a steady rate; each request consumes a token. Allows short bursts while still enforcing a long-term average rate — the most common approach in production API gateways.</li>\n        </ul>\n        <p>A well-behaved API communicates its limits back to the client with headers like X-RateLimit-Remaining and Retry-After, so clients can back off gracefully instead of hammering the server (tying back to the 429 status code from Section 3).</p>\n      </div>"
    }
  },
  {
    "id": 7,
    "icon": "db",
    "depth": "-280 m",
    "tr": {
      "title": "Veri Depolama",
      "summary": "Genel Bakış",
      "html": "\n      <div class=\"tsec\">\n        <p>Genel Bakış</p>\n        <p>Veriyi güvenilir ve güvenli biçimde saklama, kaydetmeden önce girdileri doğrulama ve kayıtları kullanıcı için verimli şekilde getirme sürecinin tamamıdır.</p>\n        <p>Terimlerin Açıklaması</p>\n        <h4 class=\"content-subheading\">Veritabanları (Databases)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Uygulama verilerini kalıcı olarak saklamak, sorgulamak, düzenlemek ve yönetmek için kullanılan yapılandırılmış sistemlerdir.</li>\n          <li>Gerçek Hayattan Örnek: Binlerce kitabı sistematik biçimde sınıflandırılmış raflarda saklayan, istenen herhangi bir kitabın bulunabildiği büyük bir üniversite kütüphanesi düşün.</li>\n          <li>Neden Önemli?: Veritabanları, backend sunucuları yeniden başlasa veya ölçeklense bile uygulama durumunun ve kullanıcı kayıtlarının güvenle korunmasını sağlar.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>SQL, NoSQL ve İndekslerin Önemi</h3>\n        <p>\"Veritabanı\" kavramının arkasında önemli bir seçim vardır: ilişkisel (SQL) veya ilişkisel olmayan (NoSQL).</p>\n        <table class=\"tcompare\">\n          <tr><th></th><th>SQL (İlişkisel)</th><th>NoSQL</th></tr>\n          <tr><td>Yapı</td><td>Sabit şema: tablolar, satırlar, sütunlar</td><td>Esnek: belgeler, anahtar-değer, graflar, geniş sütun</td></tr>\n          <tr><td>İlişkiler</td><td>Yabancı anahtarlar ve JOIN'ler ile güçlü destek</td><td>Çoğunlukla denormalize; ilişkiler uygulama kodunda ele alınır</td></tr>\n          <tr><td>Örnekler</td><td>PostgreSQL, MySQL, SQL Server</td><td>MongoDB, Redis, DynamoDB, Cassandra</td></tr>\n          <tr><td>Uygun kullanım</td><td>İlişkileri net, yapılandırılmış veriler (siparişler, hesaplar)</td><td>Hızla değişen şemalar, çok büyük ölçek, basit erişim kalıpları</td></tr>\n        </table>\n        <p>Başlangıç düzeyinden orta düzey veritabanı kullanımına geçişte iki kavram daha öne çıkar:</p>\n        <ul class=\"plain\">\n          <li>İndeksleme — veritabanı indeksi, kitabın dizini gibi, tüm tabloyu taramak yerine eşleşen satırlara doğrudan ulaşmayı sağlar. Sık aranan sütunda indeks yoksa 100 satırda hızlı olan sorgular 1 milyon satırda çok yavaşlayabilir.</li>\n          <li>Normalizasyon — ilişkisel veriyi aynı bilginin birden fazla tabloda tekrarlanmasını önleyecek şekilde düzenlemektir (örneğin kullanıcı adresini her sipariş satırına kopyalamak yerine bir kez saklayıp kimliğiyle referans vermek).</li>\n          <li>ACID özellikleri — Atomicity (Atomiklik), Consistency (Tutarlılık), Isolation (Yalıtım), Durability (Kalıcılık): ilişkisel veritabanlarının bir transaction'ın (örneğin \"A'dan B'ye para aktar\") ya tamamen tamamlanmasını ya da tamamen başarısız olmasını, veriyi asla yarım güncellenmiş bırakmamasını sağlayan güvenceleridir.</li>\n        </ul>\n        <h4 class=\"content-subheading\">Validation (Doğrulama)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Gelen kullanıcı verisini kaydetmeden veya işlemeden önce tanımlanmış kurallara göre kontrol etme sürecidir.</li>\n          <li>Gerçek Hayattan Örnek: Bir okuyucu kütüphaneye kitap bağışladığında kütüphaneci, rafa yerleştirmeden önce kitabın hasarlı olmadığını, eksik sayfa veya sahte bilgi içermediğini dikkatle kontrol eder.</li>\n          <li>Neden Önemli?: Girdi doğrulama, veri depolama katmanlarına ulaşmadan önce bozuk veriyi, uygulama çökmelerini ve ciddi enjeksiyon açıklarını (örneğin SQL Injection, XSS) önler.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>İstemci Tarafı ve Sunucu Tarafı Doğrulama</h3>\n        <p>Doğrulama genellikle iki farklı nedenle iki kez yapılır:</p>\n        <ul class=\"plain\">\n          <li>İstemci tarafı doğrulama — tarayıcıdaki kontroller (örneğin \"bu alan boş bırakılamaz\"), sunucuya gidip gelmeden kullanıcıya anında geri bildirim verir. Kullanıcı deneyimi için iyidir.</li>\n          <li>Sunucu tarafı doğrulama — aynı ve daha sıkı kontroller sunucuda tekrarlanır; çünkü istemci tarafı kontroller her zaman atlatılabilir (kullanıcı tarayıcı formunu tamamen atlayarak API'yi doğrudan çağırabilir). Veriyi gerçekten koruyan kontrol budur.</li>\n        </ul>\n        <p>Orta düzeyde yaygın bir kural: güvenlik veya veri bütünlüğü için istemci tarafı doğrulamaya asla güvenme; o bir kolaylık katmanıdır, savunma değildir. Şema doğrulama kütüphaneleri (örneğin JSON verisini iş mantığına ulaşmadan önce tanımlı şemayla doğrulamak), bunu sunucuda tutarlı uygulamanın standart yoludur.</p>\n        <h4 class=\"content-subheading\">Pagination (Sayfalama)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Büyük veri kümelerini tek seferde yüklemek yerine daha küçük parçalara (sayfalara) ayırma stratejisidir.</li>\n          <li>Gerçek Hayattan Örnek: Kütüphane kataloğunda arama yaptığında sistem, 50.000 kayıttan oluşan bunaltıcı tek liste yerine sayfa başına 10 öğelik düzenli liste verir.</li>\n          <li>Neden Önemli?: Milyonlarca veritabanı kaydını aynı anda getirmek aşırı bellek tüketimine ve uzun yükleme sürelerine yol açar. Sayfalama, sayfaların hızlı yüklenmesini ve belleğin verimli kullanılmasını sağlar.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Offset ve Cursor Tabanlı Sayfalama</h3>\n        <p>Sayfalamanın yaygın iki uygulama yöntemi vardır ve aralarında gerçek bir ödünleşim bulunur:</p>\n        <table class=\"tcompare\">\n          <tr><th>Yaklaşım</th><th>Nasıl Çalışır?</th><th>Ödünleşim</th></tr>\n          <tr><td>Offset tabanlı</td><td>?page=3&amp;limit=20 — (page-1)×limit satırı atla, sonraki limit kadar satırı getir</td><td>Basittir ve herhangi bir sayfaya atlamaya izin verir; ancak büyük offset değerlerinde yavaşlar ve istekler arasında veri değişirse öğeleri atlayabilir veya tekrarlayabilir</td></tr>\n          <tr><td>Cursor tabanlı</td><td>?after=&lt;last_item_id&gt; — belirli bir işaretçiden sonraki öğeleri getir</td><td>Her derinlikte hızlı ve tutarlı kalır; ancak rastgele bir sayfaya doğrudan atlayamaz</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Birkaç bin satırlık yönetim tablosunda offset sayfalama yeterlidir. Ancak verinin sürekli değiştiği, sosyal medya benzeri sonsuz kaydırmalı akışlar, tekrarlanan veya eksik öğe sorununu önlemek için neredeyse her zaman cursor tabanlı sayfalama kullanır.</p>\n      </div>"
    },
    "en": {
      "title": "Data Storage",
      "summary": "General Overview",
      "html": "\n      <div class=\"tsec\">\n        <p>General Overview</p>\n        <p>The end-to-end process of storing data reliably and securely, validating inputs before persistence, and retrieving records efficiently for the user.</p>\n        <p>Term Breakdown</p>\n        <h4 class=\"content-subheading\">Databases</h4>\n        <ul class=\"plain\">\n          <li>Definition: Structured systems used to store, query, organize, and manage application data permanently.</li>\n          <li>Real-Life Example: Imagine a massive university library designed to store thousands of books in systematically categorized shelves so any title can be retrieved on demand.</li>\n          <li>Why This Matters: Databases ensure that application state and user records persist safely even when backend servers restart or scale up.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>SQL vs. NoSQL, and Why Indexes Matter</h3>\n        <p>\"Database\" hides an important choice: relational (SQL) vs. non-relational (NoSQL).</p>\n        <table class=\"tcompare\">\n          <tr><th></th><th>SQL (Relational)</th><th>NoSQL</th></tr>\n          <tr><td>Structure</td><td>Fixed schema: tables, rows, columns</td><td>Flexible: documents, key-value, graphs, wide-column</td></tr>\n          <tr><td>Relationships</td><td>Strong support via foreign keys and JOINs</td><td>Often denormalized; relationships handled in application code</td></tr>\n          <tr><td>Examples</td><td>PostgreSQL, MySQL, SQL Server</td><td>MongoDB, Redis, DynamoDB, Cassandra</td></tr>\n          <tr><td>Good fit for</td><td>Structured data with clear relationships (orders, accounts)</td><td>Rapidly changing schemas, huge scale, simple access patterns</td></tr>\n        </table>\n        <p>Two more concepts separate beginner from intermediate database use:</p>\n        <ul class=\"plain\">\n          <li>Indexing — a database index (much like a book's index) lets the database jump straight to matching rows instead of scanning the entire table. Without an index on a frequently searched column, queries that are fast with 100 rows can become painfully slow with 1 million rows.</li>\n          <li>Normalization — structuring relational data to avoid duplicating the same information across multiple tables (e.g., storing a user's address once, referenced by ID, rather than copying it into every order row).</li>\n          <li>ACID properties — Atomicity, Consistency, Isolation, Durability — the guarantees relational databases give that a transaction (e.g., \"transfer money from A to B\") either fully completes or fully fails, never leaving data half-updated.</li>\n        </ul>\n        <h4 class=\"content-subheading\">Validation</h4>\n        <ul class=\"plain\">\n          <li>Definition: The process of checking incoming user data against defined rules before saving or processing it.</li>\n          <li>Real-Life Example: When a patron donates a book to the library, the librarian inspects it thoroughly to ensure it isn't damaged, missing pages, or containing fake information before placing it on the shelves.</li>\n          <li>Why This Matters: Input validation prevents corrupt data, application crashes, and severe injection vulnerabilities (e.g., SQL Injection, XSS) before data reaches storage layers.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Client-Side vs. Server-Side Validation</h3>\n        <p>Validation typically happens twice, for two different reasons:</p>\n        <ul class=\"plain\">\n          <li>Client-side validation — checks in the browser (e.g., \"this field can't be empty\") that give the user instant feedback without a round trip to the server. Good for user experience.</li>\n          <li>Server-side validation — the same (and stricter) checks repeated on the server, because client-side checks can always be bypassed (a user can call the API directly, skipping the browser form entirely). This is the check that actually protects the data.</li>\n        </ul>\n        <p>A common intermediate-level rule: never trust client-side validation for security or data integrity — it's a convenience layer, not a defense. Schema-validation libraries (e.g., validating a JSON payload against a defined schema before it touches business logic) are the standard way to enforce this consistently on the server.</p>\n        <h4 class=\"content-subheading\">Pagination</h4>\n        <ul class=\"plain\">\n          <li>Definition: A strategy to break large datasets into smaller chunks (pages) rather than loading everything at once.</li>\n          <li>Real-Life Example: When you search the library catalog, the system prints a neat list of 10 items per page rather than handing you a single, overwhelming list of 50,000 entries.</li>\n          <li>Why This Matters: Fetching millions of database records simultaneously causes extreme memory consumption and high load times. Pagination ensures fast page loads and optimized memory usage.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Offset vs. Cursor-Based Pagination</h3>\n        <p>There are two common ways to implement pagination, with a real trade-off between them:</p>\n        <table class=\"tcompare\">\n          <tr><th>Approach</th><th>How It Works</th><th>Trade-off</th></tr>\n          <tr><td>Offset-based</td><td>?page=3&amp;limit=20 — skip (page-1)×limit rows, return the next limit</td><td>Simple and allows jumping to any page, but gets slower on large offsets and can skip/repeat items if data changes between requests</td></tr>\n          <tr><td>Cursor-based</td><td>?after=&lt;last_item_id&gt; — return items after a specific marker</td><td>Stays fast and consistent at any depth, but can't jump directly to an arbitrary page</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">offset pagination is fine for an admin table with a few thousand rows, but social-media-style infinite-scroll feeds with constantly changing data almost always use cursor-based pagination to avoid the duplicate/missing item problem.</p>\n      </div>"
    }
  },
  {
    "id": 8,
    "icon": "clock",
    "depth": "-320 m",
    "tr": {
      "title": "Arka Plan İşlemleri",
      "summary": "Webhook'lar",
      "html": "\n      <div class=\"tsec\">\n        <h4 class=\"content-subheading\">Webhook'lar</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Bir olay gerçekleştiğinde servisin sana otomatik bilgi göndermesinin yoludur. Normal API çağrısında sen sorarsın; webhook'ta karşı taraf sana haber verir.</li>\n          <li>Örnek: WhatsApp'a bir mesaj geldiğinde servis URL'ne otomatik POST isteği gönderir. Gönderen hızlı yanıt beklediği için bu genellikle hemen kuyruğa aktarılır.</li>\n          <li>Neden önemli?: Sistemlerin sürekli polling yapmadan olaylara anında tepki vermesini sağlar; WhatsApp, ödeme sağlayıcıları ve Zoom gibi entegrasyonların temelidir.</li>\n          <li>Sık yapılan hata: Gelen istekleri doğrulamadan kabul etmek (imza kontrolü yapmamak); ağır işleri doğrudan webhook işleyicisinde yapmak.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Webhook'ları Güvenle Doğrulamak ve Yeniden Denemek</h3>\n        <p>Webhook entegrasyonu canlıya alındığında iki sorun ortaya çıkar:</p>\n        <ul class=\"plain\">\n          <li>İmza doğrulama — webhook URL'si dışa açık bir endpoint olduğu için herkes sahte veri gönderebilir (örneğin sahte \"ödeme başarılı\" olayı). Sağlayıcılar her veriyi gizli anahtarla imzalar; alıcı veriye güvenmeden önce imzayı yeniden hesaplayıp karşılaştırmalıdır.</li>\n          <li>İdempotency ve yeniden denemeler — alıcı sunucu hızlı yanıt vermezse (genellikle birkaç saniye içinde) gönderen başarısızlık varsayar ve yeniden dener. Aynı olay birden fazla kez iletilebilir. İşleyiciler, örneğin müşteriden iki kez ücret almak yerine, tekrarları belirleyip yok saymak için idempotency anahtarı (benzersiz olay kimliği) kullanmalıdır.</li>\n        </ul>\n        <p>Yukarıdaki başlangıç notunda ağır işlerin işleyicinin içinde çalışmaması gerektiğinin söylenmesi tam da bu yüzdendir: işleyici imzayı doğrulamalı, olayı kaydetmeli, kuyruğa aktarmalı ve hemen 200 yanıtı vermelidir. Asıl işleme arka plan worker'ına bırakılmalıdır.</p>\n        <h4 class=\"content-subheading\">Queues (Kuyruklar)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: İşlerin sıraya alındığı ve arka planda bir worker tarafından işlendiği yapıdır.</li>\n          <li>Örnek: Kayıt sırasında hoş geldin e-postası göndermek yerine \"e-posta gönder\" görevi kuyruğa alınır; kullanıcı hemen yanıt alır.</li>\n          <li>Neden önemli?: Ağır görevlerin kullanıcıyı bekletmesini önleyerek sistemi daha hızlı ve dayanıklı hale getirir.</li>\n          <li>Sık yapılan hata: Her şeyi senkron yapmaya çalışmak; başarısız işler için yeniden deneme mantığı oluşturmamak.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Mesaj Aracıları ve Kuyruk Yaklaşımları</h3>\n        <p>Pratikte kuyruklar, üreticiler ile worker'lar arasında mesajları güvenilir biçimde saklayıp ileten özel yazılım olan message broker ile uygulanır. RabbitMQ, Amazon SQS ve Redis tabanlı kuyruklar yaygın örneklerdir. İki iletim yaklaşımını ayırmak faydalıdır:</p>\n        <ul class=\"plain\">\n          <li>İş kuyruğu (work queue) — her mesaj tam olarak bir worker tarafından işlenir (örneğin \"bu e-postayı gönder\"). Yükü birden fazla worker'a dağıtmak için uygundur.</li>\n          <li>Pub/Sub (Yayınla/Abone Ol) — her mesaj ilgili tüm abonelere iletilir (örneğin \"sipariş verildi\" olayı, e-posta, analitik ve stok servislerine bağımsız olarak haber verebilir).</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Basit iş kuyruğu yerine pub/sub seçmek, olayları üreten kodu değiştirmeden sisteme yeni özellikler eklemeyi sağlar; örneğin mevcut olaylara tepki veren yeni bir analitik servisi eklenebilir.</p>\n        <h4 class=\"content-subheading\">Background Jobs (Arka Plan İşleri)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Kullanıcıdan bağımsız çalışan, kuyruk kaynaklı veya zamanlanmış (cron) görevlerdir. Kuyruk bir mekanizmadır; arka plan işi bu mekanizma üzerinden çalışan işin kendisidir.</li>\n          <li>Örnek: Tüm kullanıcılar için özet rapor oluşturan gece görevi.</li>\n          <li>Neden önemli?: Bakım, temizleme ve raporlamayı elle yapmak yerine otomatik yürütür.</li>\n          <li>Sık yapılan hata: İşlerin gerçekten çalışıp çalışmadığını izlememek (sessizce başarısız olabilirler).</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Zamanlama ve Gözlemlenebilirlik</h3>\n        <p>Zamanlanmış arka plan işleri genellikle tekrar eden zamanları kısa bir sözdizimiyle tanımlayan cron ifadeleriyle çalışır (örneğin 0 2 * * *, \"her gün saat 02.00\" demektir). Özel iş zamanlayıcıları (örneğin framework'ün yerleşik zamanlayıcısı veya dış araçlar), cron'un tek başına sunmadığı özellikleri ekler: bir çalıştırma çok uzarsa aynı işin kendisiyle çakışmasını önleme ve başarısızlıkta otomatik yeniden deneme gibi.</p>\n        <p>Yukarıdaki sık hata olan sessiz başarısızlıklar, gözlemlenebilirlikle çözülür: işler, raporun gelmediğini birinin fark etmesini beklemek yerine metrik veya uyarı üretmelidir (\"bu iş 24 saattir başarılı olmadı\").</p>\n        <h4 class=\"content-subheading\">Logging (Günlükleme)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Uygulama içinde gerçekleşenleri kaydetmektir: istekler, hatalar, olaylar.</li>\n          <li>Örnek: Webhook başarısız olduğunda ne zaman ve neden olduğunu içeren bir log kaydı yazmak.</li>\n          <li>Neden önemli?: Loglar, canlı ortamdaki sorunları ayıklamanın genellikle tek yoludur.</li>\n          <li>Sık yapılan hata: Şifre veya API anahtarı gibi hassas verileri loglamak; tüm logları aynı önemde görmek.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Log Seviyeleri ve Merkezi Günlükleme</h3>\n        <p>Yukarıdaki ikinci sık hata, yani tüm logları eşit önemde görmek, geliştiricilerin önemli bilgiyi gürültüden ayırmasını sağlayan log seviyeleriyle çözülür:</p>\n        <table class=\"tcompare\">\n          <tr><th>Seviye</th><th>Ne Zaman Kullanılır?</th></tr>\n          <tr><td>DEBUG</td><td>Yalnızca aktif hata ayıklamada faydalı olan ayrıntılı iç durum bilgisi</td></tr>\n          <tr><td>INFO</td><td>Normal işleyiş olayları (\"kullanıcı giriş yaptı\", \"iş tamamlandı\")</td></tr>\n          <tr><td>WARN</td><td>Beklenmeyen ama henüz bozulmaya yol açmayan durum (\"istek yeniden deneniyor\")</td></tr>\n          <tr><td>ERROR</td><td>Başarısız olan ve ilgilenilmesi gereken işlem</td></tr>\n        </table>\n        <p>Gerçek ölçekte, birçok sunucu ve servisin logları merkezi bir günlükleme sistemine (örneğin ELK: Elasticsearch, Logstash, Kibana veya yönetilen bir eşdeğeri) gönderilir. Böylece tek tek makinelere SSH ile bağlanmak yerine hepsi tek yerde aranabilir ve ilişkilendirilebilir. Yapılandırılmış günlükleme, serbest metin cümleleri yerine tutarlı alanlar (zaman damgası, istek kimliği, kullanıcı kimliği) içeren JSON logları yazmaktır. Aramayı uygulanabilir kılar ve 3. bölümdeki correlation ID kullanılarak tek bir isteğin birçok servis boyunca izlenmesini sağlar.</p>\n      </div>"
    },
    "en": {
      "title": "Background Processing",
      "summary": "Webhooks",
      "html": "\n      <div class=\"tsec\">\n        <h4 class=\"content-subheading\">Webhooks</h4>\n        <ul class=\"plain\">\n          <li>Definition: A way for a service to automatically send you information when an event happens. In a normal API call you ask; with a webhook, the other side notifies you.</li>\n          <li>Example: When a message arrives on WhatsApp, the service sends an automatic POST request to your URL. This is usually pushed to a queue right away, since the sender expects a fast response.</li>\n          <li>Why it matters: Lets systems react to events instantly without constant polling; it's the backbone of integrations like WhatsApp, payment providers, Zoom.</li>\n          <li>Common mistake: Accepting incoming requests without verifying them (no signature check); doing heavy work directly inside the webhook handler.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Verifying and Retrying Webhooks Safely</h3>\n        <p>Two problems come up as soon as a webhook integration goes to production:</p>\n        <ul class=\"plain\">\n          <li>Signature verification — since a webhook URL is a public endpoint, anyone could send it a fake payload (e.g., a fake \"payment succeeded\" event). Providers sign each payload with a secret key; the receiver must recompute and compare that signature before trusting the data.</li>\n          <li>Idempotency and retries — if the receiving server doesn't respond quickly (usually within a few seconds), the sender assumes failure and retries, which can deliver the same event more than once. Handlers should use an idempotency key (a unique event ID) to detect and ignore duplicates, rather than, say, charging a customer twice.</li>\n        </ul>\n        <p>This is exactly why the beginner note above says heavy work shouldn't run inside the handler itself: the handler should verify the signature, record the event, push it to a queue, and respond 200 immediately — leaving the actual processing to a background worker.</p>\n        <h4 class=\"content-subheading\">Queues</h4>\n        <ul class=\"plain\">\n          <li>Definition: A structure where jobs are lined up and processed in the background by a \"worker.\"</li>\n          <li>Example: Instead of sending a welcome email during signup, the \"send email\" task is queued — the user gets a response immediately.</li>\n          <li>Why it matters: Keeps heavy tasks from blocking the user, making the system faster and more resilient.</li>\n          <li>Common mistake: Trying to do everything synchronously; not building retry logic for failed jobs.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Message Brokers and Queue Patterns</h3>\n        <p>In practice, queues are implemented with a message broker — dedicated software that reliably stores and delivers messages between producers and workers. Common examples include RabbitMQ, Amazon SQS, and Redis-backed queues. Two delivery patterns are worth telling apart:</p>\n        <ul class=\"plain\">\n          <li>Work queue — each message is processed by exactly one worker (e.g., \"send this one email\"), useful for distributing load across multiple workers.</li>\n          <li>Pub/Sub (Publish/Subscribe) — each message is delivered to every interested subscriber (e.g., \"order placed\" might notify the email service, the analytics service, and the inventory service independently).</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">choosing pub/sub over a simple work queue is how systems add new features (like a new analytics service reacting to existing events) without modifying the code that produces those events.</p>\n        <h4 class=\"content-subheading\">Background Jobs</h4>\n        <ul class=\"plain\">\n          <li>Definition: Tasks that run independently of the user, either queue-driven or scheduled (cron). A queue is a mechanism; a background job is the work that runs through it.</li>\n          <li>Example: A nightly job that generates a summary report for all users.</li>\n          <li>Why it matters: Handles maintenance, cleanup, and reporting automatically instead of manually.</li>\n          <li>Common mistake: Not monitoring whether jobs actually run (they can fail silently).</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Scheduling and Observability</h3>\n        <p>Scheduled background jobs are usually driven by cron expressions — a compact syntax describing recurring times (e.g., 0 2 * * * means \"every day at 2:00 AM\"). Dedicated job schedulers (e.g., a framework's built-in scheduler, or external tools) add features cron alone doesn't have: preventing the same job from overlapping itself if a run takes too long, and automatic retries on failure.</p>\n        <p>The \"common mistake\" above — silent failures — is solved with observability: jobs should emit metrics or alerts (\"this job hasn't succeeded in 24 hours\") rather than relying on someone noticing the report never arrived.</p>\n        <h4 class=\"content-subheading\">Logging</h4>\n        <ul class=\"plain\">\n          <li>Definition: Recording what happens inside an application — requests, errors, events.</li>\n          <li>Example: Writing a log entry when a webhook fails, including when and why.</li>\n          <li>Why it matters: Logs are usually the only way to debug issues in production.</li>\n          <li>Common mistake: Logging sensitive data like passwords or API keys; treating all logs as equally important.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Log Levels and Centralized Logging</h3>\n        <p>The second common mistake above — treating all logs as equally important — is addressed with log levels, which let developers filter noise from signal:</p>\n        <table class=\"tcompare\">\n          <tr><th>Level</th><th>When to Use</th></tr>\n          <tr><td>DEBUG</td><td>Detailed internal state, useful only while actively debugging</td></tr>\n          <tr><td>INFO</td><td>Normal operational events (\"user logged in,\" \"job completed\")</td></tr>\n          <tr><td>WARN</td><td>Something unexpected but not yet broken (\"retrying request\")</td></tr>\n          <tr><td>ERROR</td><td>An operation failed and needs attention</td></tr>\n        </table>\n        <p>At any real scale, logs from many servers and services are shipped to a centralized logging system (e.g., an ELK stack — Elasticsearch, Logstash, Kibana — or a managed equivalent) so they can be searched and correlated in one place, rather than SSH-ing into individual machines. Structured logging — writing logs as JSON with consistent fields (timestamp, request ID, user ID) instead of free-text sentences — is what makes that searching practical, and it's also what lets a single request be traced across multiple services using the correlation ID mentioned in Section 3.</p>\n      </div>"
    }
  },
  {
    "id": 9,
    "icon": "code",
    "depth": "-360 m",
    "tr": {
      "title": "Test ve Kalite Güvencesi",
      "summary": "Genel Bakış",
      "html": "\n      <div class=\"tsec\">\n        <p>Genel Bakış</p>\n        <p>Kod gerçek kullanıcılara ulaşmadan önce beklendiği gibi davrandığını doğrulamak ve bir değişikliğin daha önce çalışan bir şeyi sessizce bozmasından önce regresyonları yakalamak için kullanılan uygulamalardır.</p>\n        <p>Terimlerin Açıklaması</p>\n        <h4 class=\"content-subheading\">Unit Testleri (Birim Testleri)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Küçük bir mantık parçasını, tek bir fonksiyonu veya metodu, sistemin geri kalanından yalıtılmış olarak kontrol eden testlerdir.</li>\n          <li>Örnek: calculateDiscount() fonksiyonunun sıfır veya negatif fiyat gibi uç durumlar dahil çeşitli girdiler için doğru değeri döndürdüğünü test etmek.</li>\n          <li>Neden önemli?: Mantık hatalarını erken ve oluştukları yere yakın yakalar; günde yüzlerce kez çalıştırılabilecek kadar hızlıdır.</li>\n          <li>Sık yapılan hata: Gözlemlenebilir davranış yerine iç uygulama ayrıntılarını test etmek; uç durumları atlayıp yalnızca sorunsuz akışı (happy path) test etmek.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Test Piramidi</h3>\n        <p>Tüm testler aynı türde olmamalıdır. Sağlıklı bir test paketi, hızlı ve düşük maliyetli katmanlarda daha fazla test bulunan bir piramit şeklindedir:</p>\n        <table class=\"tcompare\">\n          <tr><th>Katman</th><th>Neyi Kontrol Eder?</th><th>Ödünleşim</th></tr>\n          <tr><td>Unit</td><td>Tek bir fonksiyonu veya modülü yalıtılmış olarak</td><td>Hızlı ve düşük maliyetli — çok sayıda yaz</td></tr>\n          <tr><td>Integration</td><td>Birlikte çalışan birkaç parçayı (örneğin API endpoint'i ve veritabanı)</td><td>Daha yavaş — birim testlerinin kaçırdığı sorunları yakalar</td></tr>\n          <tr><td>End-to-End (E2E)</td><td>Gerçek arayüz üzerinden tam kullanıcı akışını; çoğunlukla Cypress veya Playwright gibi araçlarla</td><td>Yavaş ve kırılgan — kritik akışlar için sınırlı kullan</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Çok fazla E2E testi olan paket yavaşlar ve kararsız sonuçlar verir; 10. bölümde anlatılan tüm CI/CD hattını yavaşlatır. Çok az birim testi olan paket ise mantık hatalarının çok daha geç bir aşamaya kadar fark edilmeden geçmesine izin verir.</p>\n        <h4 class=\"content-subheading\">Test Odaklı Geliştirme (TDD)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Testi geçirecek koddan önce testin yazıldığı çalışma biçimidir.</li>\n          <li>Örnek: Red-green-refactor döngüsü: başarısız test yaz (kırmızı), testi geçirecek kadar kod yaz (yeşil), ardından davranışını değiştirmeden kodu düzenle (refactor).</li>\n          <li>Neden önemli?: Geliştiriciyi uygulamayı yazmadan önce beklenen davranışı ve arayüzü düşünmeye zorlar; bu da çoğunlukla daha test edilebilir ve daha düzenli kod üretir.</li>\n          <li>Sık yapılan hata: TDD'yi faydalı olduğunda kullanılacak bir araç yerine her kod satırı için zorunlu dogma saymak; davranış yerine uygulamayı kopyalayan testler yazmak.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Mock Kullanımı ve Test Doubles</h3>\n        <p>Bir birimi gerçekten yalıtılmış test etmek için veritabanı, dış API veya message broker gibi gerçek bağımlılıkları çoğunlukla mock, stub veya fake ile değiştirilir. Böylece test gerçek sisteme dokunmadan hızlı çalışır ve her seferinde aynı sonucu verir.</p>\n        <p>Bu, doğrudan 8. bölümle bağlantılıdır: webhook işleyicisinin birim testi, test paketi her çalıştığında gerçek broker'a mesaj göndermek yerine yayın yaptığı kuyruğu mock ile temsil eder.</p>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Gerçek veritabanlarına veya dış API'lere erişen testler yavaş, kararsız ve yan etkilere açık olabilir. Mock kullanımı, piramidin hızlı birim testi katmanını gerçekten hızlı tutar; gerçek bağlantıların çalıştığını doğrulama görevi integration ve E2E testlerinde kalır.</p>\n      </div>"
    },
    "en": {
      "title": "Testing & Quality Assurance",
      "summary": "General Overview",
      "html": "\n      <div class=\"tsec\">\n        <p>General Overview</p>\n        <p>The practices used to verify that code behaves as expected before it reaches real users, and to catch regressions before a change quietly breaks something that used to work.</p>\n        <p>Term Breakdown</p>\n        <h4 class=\"content-subheading\">Unit Tests</h4>\n        <ul class=\"plain\">\n          <li>Definition: Tests that check one small piece of logic — a single function or method — in isolation from the rest of the system.</li>\n          <li>Example: Testing that a calculateDiscount() function returns the right value for a range of inputs, including edge cases like zero or a negative price.</li>\n          <li>Why it matters: Catches logic errors early, close to where they happen, and runs fast enough to execute hundreds of times a day.</li>\n          <li>Common mistake: Testing internal implementation details instead of observable behavior; skipping edge cases and only testing the “happy path.”</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>The Testing Pyramid</h3>\n        <p>Not all tests should be the same type — a healthy test suite is shaped like a pyramid, with more tests at the fast, cheap layers:</p>\n        <table class=\"tcompare\">\n          <tr><th>Layer</th><th>What It Checks</th><th>Trade-off</th></tr>\n          <tr><td>Unit</td><td>One function or module in isolation</td><td>Fast and cheap — write many</td></tr>\n          <tr><td>Integration</td><td>Several pieces working together (e.g., an API endpoint plus the database)</td><td>Slower — catches issues units miss</td></tr>\n          <tr><td>End-to-End (E2E)</td><td>A full user flow through the real UI, often with tools like Cypress or Playwright</td><td>Slow and brittle — use sparingly, for critical flows</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">a suite with too many E2E tests becomes slow and flaky, dragging down the whole CI/CD pipeline discussed in Section 10, while a suite with too few unit tests lets logic bugs slip through unnoticed until much later.</p>\n        <h4 class=\"content-subheading\">Test-Driven Development (TDD)</h4>\n        <ul class=\"plain\">\n          <li>Definition: A workflow where the test is written before the code that makes it pass.</li>\n          <li>Example: The “red-green-refactor” cycle: write a failing test (red), write just enough code to pass it (green), then clean up the code without changing its behavior (refactor).</li>\n          <li>Why it matters: Forces the developer to think through the expected behavior and interface before writing implementation, which often leads to more testable, better-organized code.</li>\n          <li>Common mistake: Treating TDD as mandatory dogma for every line of code rather than a tool to reach for when it helps; writing tests that mirror the implementation instead of the behavior.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Mocking and Test Doubles</h3>\n        <p>To test a unit in true isolation, its real dependencies — a database, an external API, a message broker — are often replaced with a mock, stub, or fake so the test runs fast and gives the same result every time, without touching a real system.</p>\n        <p>This connects directly back to Section 8: a unit test for a webhook handler would mock the queue it publishes to, rather than actually pushing a message to a real broker every time the test suite runs.</p>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">tests that hit real databases or external APIs are slow, flaky, and can have side effects — mocking keeps the fast unit-testing layer of the pyramid actually fast, while integration and E2E tests remain the layer that verifies the real connections work.</p>\n      </div>"
    }
  },
  {
    "id": 10,
    "icon": "cloud",
    "depth": "-400 m",
    "tr": {
      "title": "Dağıtım ve Altyapı",
      "summary": "Deployment (Dağıtım)",
      "html": "\n      <div class=\"tsec\">\n        <h4 class=\"content-subheading\">Deployment (Dağıtım)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Uygulamayı geliştirme ortamından gerçek kullanıcıların erişebildiği canlı sunucuya (production) taşıma sürecidir.</li>\n          <li>Örnek: Kod main dalına birleştirilir → otomatik testler geçer → uygulama sunucuya dağıtılır.</li>\n          <li>Neden önemli?: Harika kod bile doğru şekilde yayına alınmadığında kullanıcı için işe yaramaz.</li>\n          <li>Sık yapılan hata: Test etmeden dağıtım yapmak; dağıtım sonrası kontrolü atlamak.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>CI/CD ve Daha Güvenli Yayınlama Stratejileri</h3>\n        <p>Yukarıdaki örnek (\"birleştir → testler geçsin → dağıt\") bir CI/CD hattını tanımlar:</p>\n        <ul class=\"plain\">\n          <li>CI (Sürekli Entegrasyon) — her kod değişikliği gönderilir gönderilmez otomatik derlenir ve test edilir. Sorunlar diğer geliştiricilere ulaşmadan yakalanır.</li>\n          <li>CD (Sürekli Dağıtım/Teslimat) — CI kontrollerini geçen kod, elle yapılan ve hataya açık yayın süreci yerine otomatik (veya tek tıkla) canlıya alınır.</li>\n        </ul>\n        <p>Orta düzey ekipler yalnızca yeni sürümü dağıtmanın ötesinde, hatalı dağıtımın tüm kullanıcıları aynı anda etkileme riskini azaltan yayınlama stratejileri kullanır:</p>\n        <table class=\"tcompare\">\n          <tr><th>Strateji</th><th>Nasıl Çalışır?</th></tr>\n          <tr><td>Blue-Green Deployment</td><td>İki aynı ortam çalıştırılır (\"blue\" = canlı, \"green\" = yeni). Green doğrulandıktan sonra tüm trafik ona geçirilir; blue anında geri dönüş için tutulur.</td></tr>\n          <tr><td>Canary Deployment</td><td>Yeni sürüm önce küçük bir kullanıcı yüzdesine açılır, hatalar izlenir ve ardından kademeli olarak herkese sunulur.</td></tr>\n          <tr><td>Rollback</td><td>Yeni sürüm hatalara yol açarsa önceki çalışan sürüme otomatik veya elle geri dönülür.</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Yeni dağıtımı önce trafiğin yalnızca %5'i gördüğünde, yukarıdaki başlangıç hatası olan dağıtım sonrası kontrolü atlamanın riski çok azalır. Canary yayınlar, tam kesintiye dönüşmeden önce bu tür sorunları yakalamak için tasarlanır.</p>\n        <h4 class=\"content-subheading\">Container'lar ve Bulut Altyapısı</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Container, uygulamayı çalışması için gereken her şeyle (kod, bağımlılıklar, çalışma zamanı) birlikte, her yerde aynı davranan taşınabilir tek bir birime paketler.</li>\n          <li>Örnek: Node.js uygulamasını geliştirildiği tam Node sürümü ve kütüphanelerle birlikte paketleyen Docker container'ı, geliştiricinin dizüstünde ve canlı sunucuda aynı şekilde çalışır.</li>\n          <li>Neden önemli?: Çalışma ortamını her makinenin elle eşleştirmesi gereken bir şey olmaktan çıkarıp gönderilen paketin parçası yaparak klasik \"benim bilgisayarımda çalışıyor\" sorununu ortadan kaldırır.</li>\n          <li>Sık yapılan hata: Container imajını tam bir sanal makine sanmak (değildir; ana makinenin çekirdeğini paylaşır); API anahtarı gibi sırları çalışma anında ortam değişkeniyle vermek yerine doğrudan imaja gömmek.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Orkestrasyon ve Yönetilen Bulut Hizmetleri</h3>\n        <p>Tek container paketlemeyi çözer; ancak gerçek uygulama genellikle birçok makinede çalışan çok sayıda container'dan oluşur. Yeni sorular doğar: çöken container'ı ne yeniden başlatır, trafik artınca ne olur, container'lar birbirini nasıl bulur?</p>\n        <ul class=\"plain\">\n          <li>Kubernetes (orkestrasyon) — container'ları makine kümesi üzerinde çalıştıran; başarısız olanları otomatik yeniden başlatan, yükü dağıtan ve çalışan örnek sayısını artırıp azaltan sistemdir.</li>\n          <li>Yönetilen bulut hizmetleri — AWS, Azure ve Google Cloud gibi sağlayıcılar işlem gücü, depolama ve yönetilen veritabanlarını hizmet olarak sunar. Ekip kendi fiziksel donanımını satın almak, kurmak ve bakımını yapmak zorunda kalmaz.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Container'lar ve orkestrasyon, 2. bölümdeki yatay ölçeklendirme ve durumsuz sunucu fikirlerinin canlı ortamda uygulanma biçimidir. Her container örneği herhangi bir isteği işleyebilir; o anda kaç örnek bulunması gerektiğine orkestrasyon sistemi karar verir.</p>\n        <h4 class=\"content-subheading\">Environment Variables (Ortam Değişkenleri)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Koda gömülmek yerine kod dışından sağlanan, ortama özgü değerlerdir (şifreler, API anahtarları).</li>\n          <li>Örnek: DATABASE_URL veya API_KEY gibi değerler kodun okuduğu .env dosyasında bulunur; .env Git'e commit edilmez.</li>\n          <li>Neden önemli?: Gizli bilgileri koddan uzak tutar (güvenlik) ve aynı kodun farklı ortamlarda çalışmasını sağlar (esneklik).</li>\n          <li>Sık yapılan hata: API anahtarlarını koda gömmek; .env dosyasını yanlışlıkla commit etmek.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Farklı Ortamlarda Gizli Bilgileri Yönetmek</h3>\n        <p>Gerçek projede genellikle en az üç ortam vardır: development (geliştirme), staging (canlıya benzeyen test ortamı) ve production (canlı). Her biri aynı değişken adları için kendi değerlerine ihtiyaç duyar (örneğin her ortam için farklı DATABASE_URL). Küçük ölçekte ortam başına ayrı .env dosyaları yeterlidir. Daha büyük ölçekte ekipler, sırları şifreli saklayan, kimin erişebileceğini kontrol eden ve ele geçirilmiş anahtarı kodu yeniden dağıtmadan değiştirmeyi destekleyen özel gizli bilgi yöneticilerine (örneğin bulut sağlayıcısının secret manager'ı veya HashiCorp Vault) geçer.</p>\n        <h4 class=\"content-subheading\">DNS</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Alan adını (www.site.com) IP adresine çeviren sistemdir.</li>\n          <li>Örnek: Yayına alınan sunucunun IP'si A kaydıyla alan adına bağlanır; alan adını yazmak tarayıcının bu IP'ye bağlanmasını sağlar.</li>\n          <li>Neden önemli?: İnternetin \"adres defteridir\". Yanlış yapılandırılmış DNS, kusursuz çalışan uygulamaya bile kullanıcıların ulaşamaması demektir.</li>\n          <li>Sık yapılan hata: DNS değişikliklerinin anında etkili olduğunu varsaymak (yayılması saatler alabilir); alan adını yenilemeyi unutmak.</li>\n        </ul>\n        <p>Kayıt türü</p>\n        <table class=\"tcompare\">\n          <tr><th>Kayıt türü</th><th>Ne yapar?</th></tr>\n          <tr><td>A</td><td>Alan adını doğrudan IP adresine yönlendirir</td></tr>\n          <tr><td>CNAME</td><td>Alan adını başka bir alan adına yönlendirir</td></tr>\n          <tr><td>MX</td><td>Gelen e-postayı hangi sunucunun işleyeceğini belirler</td></tr>\n          <tr><td>TXT</td><td>Doğrulama ve diğer metin tabanlı bilgiler için kullanılır</td></tr>\n        </table>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>TTL ve Yayılma</h3>\n        <p>Her DNS kaydının TTL (Time To Live) değeri vardır. Diğer DNS sunucularına, güncellemeyi yeniden kontrol etmeden önce kaydı ne kadar süre önbellekte tutabileceklerini söyler. Yukarıdaki \"DNS değişiklikleri anında etkili olur\" hatasının nedeni budur: kaydın TTL'i 24 saatse güncellemeden sonra bile bazı kullanıcılar bir güne kadar eski IP'yi görmeye devam edebilir. Orta düzeyde yaygın uygulama, planlanan değişiklikten (örneğin sunucu taşıma) önce TTL'i düşürmek, yayılmasını beklemek, değişikliği yapmak ve sonra TTL'i yeniden yükseltmektir. Böylece kullanıcıların eski sonuçları gördüğü süre azaltılır.</p>\n      </div>"
    },
    "en": {
      "title": "Deployment & Infrastructure",
      "summary": "Deployment",
      "html": "\n      <div class=\"tsec\">\n        <h4 class=\"content-subheading\">Deployment</h4>\n        <ul class=\"plain\">\n          <li>Definition: The process of moving an application from a development environment to a live server (production) where real users can access it.</li>\n          <li>Example: Code is merged into main → automated tests pass → the app is deployed to the server.</li>\n          <li>Why it matters: Even great code is useless to users if it's never deployed correctly.</li>\n          <li>Common mistake: Deploying without testing; skipping a post-deploy check.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>CI/CD and Safer Rollout Strategies</h3>\n        <p>The example above (\"merge → tests pass → deploy\") describes a CI/CD pipeline:</p>\n        <ul class=\"plain\">\n          <li>CI (Continuous Integration) — every code change is automatically built and tested as soon as it's pushed, catching problems before they reach other developers.</li>\n          <li>CD (Continuous Deployment/Delivery) — code that passes CI is automatically (or with one click) released to production, instead of a manual, error-prone release process.</li>\n        </ul>\n        <p>Beyond \"deploy the new version,\" intermediate teams use rollout strategies that reduce the risk of a bad deploy affecting all users at once:</p>\n        <table class=\"tcompare\">\n          <tr><th>Strategy</th><th>How It Works</th></tr>\n          <tr><td>Blue-Green Deployment</td><td>Run two identical environments (\"blue\" = live, \"green\" = new); switch all traffic to green only once it's verified, keeping blue as an instant rollback.</td></tr>\n          <tr><td>Canary Deployment</td><td>Release the new version to a small percentage of users first, watch for errors, then gradually roll out to everyone.</td></tr>\n          <tr><td>Rollback</td><td>Automatically or manually reverting to the previous working version if the new one causes errors.</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">\"skipping a post-deploy check\" (the beginner mistake above) becomes far less risky when only 5% of traffic sees a new deploy first — this is exactly what canary releases are designed to catch before it becomes a full outage.</p>\n        <h4 class=\"content-subheading\">Containers and Cloud Infrastructure</h4>\n        <ul class=\"plain\">\n          <li>Definition: A container packages an application together with everything it needs to run — code, dependencies, runtime — into one portable unit that behaves the same way everywhere.</li>\n          <li>Example: A Docker container that bundles a Node.js app with the exact Node version and libraries it was built against, so it runs identically on a developer’s laptop and on the production server.</li>\n          <li>Why it matters: Eliminates the classic “works on my machine” problem by making the runtime environment part of what gets shipped, not something each machine has to match by hand.</li>\n          <li>Common mistake: Treating a container image as a full virtual machine (it isn’t — it shares the host’s kernel); baking secrets like API keys directly into the image instead of injecting them as environment variables at runtime.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Orchestration and Managed Cloud Services</h3>\n        <p>A single container solves packaging, but a real application usually runs as many containers across many machines — which raises new problems: what restarts a crashed container, what happens when traffic spikes, how do containers find each other?</p>\n        <ul class=\"plain\">\n          <li>Kubernetes (orchestration) — a system that runs containers across a cluster of machines, automatically restarting failed ones, distributing load, and scaling the number of running instances up or down.</li>\n          <li>Managed cloud services — providers like AWS, Azure, and Google Cloud offer compute, storage, and managed databases as a service, so a team doesn’t have to buy, rack, and maintain its own physical hardware.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">containers and orchestration are how the horizontal scaling and stateless-server ideas from Section 2 actually get implemented in production — any container instance can handle any request, and the orchestrator is what decides how many instances should exist right now.</p>\n        <h4 class=\"content-subheading\">Environment Variables</h4>\n        <ul class=\"plain\">\n          <li>Definition: Environment-specific values (passwords, API keys) provided from outside the code instead of being hardcoded.</li>\n          <li>Example: Values like DATABASE_URL or API_KEY live in a .env file the code reads; .env is not committed to Git.</li>\n          <li>Why it matters: Keeps secrets out of the code (security) and lets the same code run in different environments (flexibility).</li>\n          <li>Common mistake: Hardcoding API keys in the code; accidentally committing .env.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Managing Secrets Across Environments</h3>\n        <p>A real project usually has at least three environments — development, staging (a production-like testing environment), and production — each needing its own values for the same variable names (e.g., a different DATABASE_URL for each). At small scale, separate .env files per environment are enough; at larger scale, teams move to dedicated secrets managers (e.g., a cloud provider's secret manager, or HashiCorp Vault) that store secrets encrypted, control who can access them, and support rotating a compromised key without redeploying code.</p>\n        <h4 class=\"content-subheading\">DNS</h4>\n        <ul class=\"plain\">\n          <li>Definition: The system that translates a domain name (www.site.com) into an IP address.</li>\n          <li>Example: A deployed server's IP is linked to a domain via an A record; typing the domain makes the browser connect to that IP.</li>\n          <li>Why it matters: It's the internet's \"address book\" — misconfigured DNS means users can't reach a perfectly working app.</li>\n          <li>Common mistake: Assuming DNS changes take effect instantly (propagation can take hours); forgetting to renew the domain.</li>\n        </ul>\n        <p>Record type</p>\n        <table class=\"tcompare\">\n          <tr><th>Record type</th><th>What it does</th></tr>\n          <tr><td>A</td><td>Points a domain directly to an IP address</td></tr>\n          <tr><td>CNAME</td><td>Points a domain to another domain</td></tr>\n          <tr><td>MX</td><td>Determines which server handles incoming email</td></tr>\n          <tr><td>TXT</td><td>Used for verification and other text-based info</td></tr>\n        </table>\n        <h3><span class=\"tag\">DEEP DIVE</span>TTL and Propagation</h3>\n        <p>Each DNS record has a TTL (Time To Live) — a value telling other DNS servers how long they're allowed to cache that record before checking for updates again. This is exactly why \"DNS changes take effect instantly\" (the common mistake above) is false: if a record's TTL is set to 24 hours, some users may keep seeing the old IP address for up to a day, even after the record is updated. A common intermediate-level practice is to lower the TTL in advance of a planned change (e.g., a server migration), let it propagate, make the change, and raise the TTL again afterward — reducing the window where users see stale results.</p>\n      </div>"
    }
  },
  {
    "id": 11,
    "icon": "branch",
    "depth": "-440 m",
    "tr": {
      "title": "İşbirliği ve Versiyon Kontrolü",
      "summary": "Git",
      "html": "\n      <div class=\"tsec\">\n        <h4 class=\"content-subheading\">Git</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Kod değişikliklerini zaman içinde takip eden versiyon kontrol sistemidir.</li>\n          <li>Örnek: Bir hata ortaya çıktığında onu hangi değişikliğin getirdiğini görmek için geçmiş incelenebilir.</li>\n          <li>Neden önemli?: Ekiplerin birbirinin çalışmasını ezmeden çalışmasını ve önceki sürümlere dönmesini sağlar.</li>\n          <li>Sık yapılan hata: Uzun süre commit yapmayıp ardından tek dev commit göndermek.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Git Değişiklikleri Aslında Nasıl Takip Eder?</h3>\n        <p>Başlangıç düzeyindeki \"değişiklikleri takip eder\" açıklamasının altında Git, geliştiricilerin değişiklikleri taşıdığı üç alanla çalışır:</p>\n        <ul class=\"plain\">\n          <li>Çalışma dizini (working directory) — diskte düzenlediğin gerçek dosyalar.</li>\n          <li>Hazırlama alanı (staging area / index) — git add ile işaretlenen, sonraki commit'e girmesi seçilen değişiklikler.</li>\n          <li>Repository (commit geçmişi) — git commit ile oluşturulan kalıcı kayıt.</li>\n        </ul>\n        <p>Bu hazırlama adımı, geliştiricinin aynı anda değişikliklerinin yalnızca bir kısmını commit etmesini sağlar. Çalışma dizininde birden fazla ilgisiz düzenleme olsa bile commit'ler odaklı kalır. git diff, git log ve git revert (geçmişi silmeden yeni bir ters commit oluşturarak commit'i geri alır) gibi komutlar doğrudan bu modele dayanır.</p>\n        <h4 class=\"content-subheading\">Branches (Dallar)</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Ana kod tabanından (main) ayrılan bağımsız çalışma koludur.</li>\n          <li>Örnek: feature/login-page üzerinde çalışmak, main'i etkilemeden geliştirme yapmanı sağlar.</li>\n          <li>Neden önemli?: Main'i kararlı tutarken ekipte paralel çalışmayı mümkün kılar.</li>\n          <li>Sık yapılan hata: Dalı uzun süre main ile eşitlemeyip ardından büyük çakışmalarla karşılaşmak.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Dallanma Stratejileri</h3>\n        <p>Ekip bir veya iki geliştiriciyi aştığında, gayriresmî \"bir dal aç yeter\" yaklaşımı yerine ortak bir kural fayda sağlar:</p>\n        <table class=\"tcompare\">\n          <tr><th>Strateji</th><th>Temel Fikir</th></tr>\n          <tr><td>Git Flow</td><td>Uzun ömürlü develop ve main dalları ile ayrı feature, release ve hotfix dalları. Daha yapılandırılmıştır; planlı yayınlara uygundur.</td></tr>\n          <tr><td>Trunk-Based Development</td><td>Herkes küçük ve sık değişiklikleri doğrudan (veya çok kısa ömürlü dallarla) tek main dalına gönderir; feature flag'lerle birlikte kullanılır. Hızlı, sürekli dağıtıma uygundur.</td></tr>\n          <tr><td>GitHub Flow</td><td>Hafif bir orta yol: main'den açılan kısa ömürlü özellik dalları, hazır olup incelendiklerinde pull request ile birleştirilir.</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Yukarıdaki büyük çakışma hatası, çoğunlukla uzun ömürlü dalların belirtisidir. Kısa ömürlü dalları tercih eden stratejiler (trunk-based, GitHub Flow), birleştirme çakışmalarını seyrek ve devasa olmak yerine küçük ve sık tutmak için vardır.</p>\n        <h4 class=\"content-subheading\">Commits</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Açıklayıcı mesajla birlikte kaydedilen değişiklik anlık görüntüsüdür.</li>\n          <li>Örnek: \"Webhook imza doğrulaması eklendi\" gibi açık mesajla commit yapmak.</li>\n          <li>Neden önemli?: Küçük ve açık commit'ler geçmişi okunabilir, geri almayı kolay hale getirir.</li>\n          <li>Sık yapılan hata: İlgisiz değişiklikleri tek commit'e sıkıştırmak; \"fix\" gibi belirsiz mesajlar yazmak.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>Conventional Commit Mesajları</h3>\n        <p>Birçok ekip, mesajın başına tür ekleyen Conventional Commits gibi bir biçimle commit mesajlarını standartlaştırır:</p>\n        <p>feat: webhook imza doğrulaması ekle</p>\n        <p>fix: sayfalamadaki bir eksik/fazla hesaplama hatasını düzelt</p>\n        <p>docs: API kimlik doğrulama rehberini güncelle</p>\n        <p>refactor: token doğrulamasını ayrı bir fonksiyona çıkar</p>\n        <p>Bu kuralın okunabilirlik dışında pratik kullanımları da vardır: otomatik değişiklik günlüğü (changelog) üretebilir ve bir kişinin elle karar vermesi yerine doğrudan commit geçmişinden semantik versiyonlamayı (sonraki yayının patch, minor veya major olacağını) yönlendirebilir.</p>\n        <h4 class=\"content-subheading\">Pull Requests</h4>\n        <ul class=\"plain\">\n          <li>Tanım: Değişiklikleri bir daldan diğerine (main) birleştirme isteğidir. Birleştirmeden önce ekip arkadaşları inceleyip yorum yapar.</li>\n          <li>Örnek: Daldaki çalışma bitince PR açılır, ekip inceler ve onaydan sonra birleştirilir.</li>\n          <li>Neden önemli?: Kodun ana kod tabanına katılmadan incelenmesini sağlar ve ekibi bilgilendirir.</li>\n          <li>Sık yapılan hata: Onlarca dosyaya dokunan dev PR'lar açmak; PR açıklamasını boş bırakmak.</li>\n        </ul>\n        <h3><span class=\"tag\">DERİNLEŞTİR</span>İyi Bir Kod İnceleme Kültürü Nasıl Olur?</h3>\n        <p>PR açmanın ötesinde, etkili inceleme yapan ekipleri değişikliklere yalnızca onay verenlerden ayıran birkaç uygulama vardır:</p>\n        <ul class=\"plain\">\n          <li>Birleştirme için CI kontrolleri — PR birleştirilmeye uygun hale gelmeden önce otomatik testler, lint kontrolleri ve build işlemleri (9. bölümdeki CI) geçmelidir. Böylece mekanik sorunlar insan inceleyici zaman harcamadan yakalanır.</li>\n          <li>Küçük, odaklı PR'lar — yukarıdaki dev PR hatasını doğrudan çözer. Küçük farklar daha hızlı ve dikkatli incelenir; çünkü inceleyen kişi değişikliğin tamamını zihninde tutabilir.</li>\n          <li>Zorunlu inceleyiciler / dal koruması — en az bir onay olmadan main'e birleştirmeyi engelleyen repository ayarlarıdır. Böylece inceleme nezaket değil, zorunlu adımdır.</li>\n        </ul>\n        <div class=\"content-label why-label\">Neden Önemli?</div><p class=\"key-content\">Kod tabanı ve ekip büyüdükçe pull request, kod kalitesinin, bilgi paylaşımının ve güvenlik incelemesinin gerçekleştiği ana kontrol noktası olur. Bunu formalite saymak, hataların ve tutarsız yaklaşımların birikmesinin en hızlı yollarından biridir.</p>\n      </div>"
    },
    "en": {
      "title": "Collaboration & Version Control",
      "summary": "Git",
      "html": "\n      <div class=\"tsec\">\n        <h4 class=\"content-subheading\">Git</h4>\n        <ul class=\"plain\">\n          <li>Definition: A version control system that tracks code changes over time.</li>\n          <li>Example: When a bug appears, the history can be checked to see which change introduced it.</li>\n          <li>Why it matters: Lets teams work without overwriting each other and roll back to earlier versions.</li>\n          <li>Common mistake: Going long stretches without committing, then dumping one giant commit.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>How Git Actually Tracks Changes</h3>\n        <p>Underneath the beginner-level \"it tracks changes\" description, Git works with three areas developers move changes through:</p>\n        <ul class=\"plain\">\n          <li>Working directory — the actual files on disk that you edit.</li>\n          <li>Staging area (index) — changes marked with git add, chosen to go into the next commit.</li>\n          <li>Repository (commit history) — the permanent record created by git commit.</li>\n        </ul>\n        <p>This staging step is what lets a developer commit only part of their changes at a time, keeping commits focused even when several unrelated edits exist in the working directory simultaneously. Commands like git diff, git log, and git revert (which undoes a commit by creating a new, opposite commit, without erasing history) build directly on this model.</p>\n        <h4 class=\"content-subheading\">Branches</h4>\n        <ul class=\"plain\">\n          <li>Definition: An independent line of work that splits off from the main codebase (main).</li>\n          <li>Example: Working on feature/login-page lets you build without affecting main.</li>\n          <li>Why it matters: Enables parallel work across the team while keeping main stable.</li>\n          <li>Common mistake: Not syncing a branch with main for a long time, then hitting massive conflicts.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Branching Strategies</h3>\n        <p>Once a team grows beyond one or two developers, an informal \"just make a branch\" approach benefits from a shared convention:</p>\n        <table class=\"tcompare\">\n          <tr><th>Strategy</th><th>Core Idea</th></tr>\n          <tr><td>Git Flow</td><td>Long-lived develop and main branches, plus dedicated feature, release, and hotfix branches — more structure, suited to scheduled releases.</td></tr>\n          <tr><td>Trunk-Based Development</td><td>Everyone commits small, frequent changes directly to (or via very short-lived branches into) a single main branch, paired with feature flags — suited to fast, continuous deployment.</td></tr>\n          <tr><td>GitHub Flow</td><td>A lightweight middle ground: short-lived feature branches off main, merged via pull request as soon as they're ready and reviewed.</td></tr>\n        </table>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">the \"massive conflicts\" mistake above is largely a symptom of long-lived branches — strategies that favor short-lived branches (trunk-based, GitHub Flow) exist specifically to keep merge conflicts small and frequent instead of rare and huge.</p>\n        <h4 class=\"content-subheading\">Commits</h4>\n        <ul class=\"plain\">\n          <li>Definition: A saved snapshot of a change, paired with a descriptive message.</li>\n          <li>Example: Committing with a clear message like \"Added webhook signature verification\".</li>\n          <li>Why it matters: Small, clear commits make history readable and easy to revert.</li>\n          <li>Common mistake: Cramming unrelated changes into one commit; writing vague messages like \"fix\".</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>Conventional Commit Messages</h3>\n        <p>Many teams standardize commit messages using a format such as Conventional Commits, which prefixes the message with a type:</p>\n        <p>feat: add webhook signature verification</p>\n        <p>fix: correct off-by-one error in pagination</p>\n        <p>docs: update API authentication guide</p>\n        <p>refactor: extract token validation into its own function</p>\n        <p>Beyond readability, this convention has practical uses: it can automatically generate a changelog, and it can drive semantic versioning (deciding whether the next release is a patch, minor, or major version) directly from the commit history, rather than a person deciding by hand.</p>\n        <h4 class=\"content-subheading\">Pull Requests</h4>\n        <ul class=\"plain\">\n          <li>Definition: A request to merge changes from one branch into another (main), where teammates review and comment before it's merged.</li>\n          <li>Example: Once a branch is done, a PR is opened, the team reviews it, and it's merged after approval.</li>\n          <li>Why it matters: Ensures code is reviewed before joining the main codebase and keeps the team informed.</li>\n          <li>Common mistake: Opening huge PRs touching dozens of files; leaving the PR description empty.</li>\n        </ul>\n        <h3><span class=\"tag\">DEEP DIVE</span>What Good Review Culture Looks Like</h3>\n        <p>Beyond opening the PR, a few practices separate teams that review effectively from ones that just rubber-stamp changes:</p>\n        <ul class=\"plain\">\n          <li>CI checks gating merges — automated tests, linting, and builds (Section 9's CI) must pass before a PR is even eligible to merge, catching mechanical problems before a human reviewer spends time on them.</li>\n          <li>Small, focused PRs — directly addresses the \"huge PR\" mistake above; smaller diffs get reviewed faster and more carefully, since a reviewer can actually hold the whole change in their head.</li>\n          <li>Required reviewers / branch protection — repository settings that prevent merging into main without at least one approval, so review isn't just a courtesy but an enforced step.</li>\n        </ul>\n        <div class=\"content-label why-label\">Why This Matters</div><p class=\"key-content\">as a codebase and team grow, the pull request becomes the main checkpoint where code quality, knowledge sharing, and security review actually happen — treating it as a formality is one of the fastest ways for bugs and inconsistent patterns to accumulate.</p>\n      </div>"
    }
  }
];

export const FUNDAMENTALS_FAQS: FaqItem[] = [
  {
    "tr": {
      "q": "Bir kullanıcı tarayıcıya bir URL girdiğinde ne olur?",
      "a": "Tarayıcı, sunucunun IP adresini bulmak için DNS kullanır ve ardından bir HTTP/HTTPS isteği gönderir. Sunucu isteği işler ve bir yanıt gönderir; tarayıcı bu yanıtı kullanarak istenen sayfayı gösterir. Bu süreç, perde arkasında kullanıcıyı, tarayıcıyı, sunucuyu ve web uygulamasını birbirine bağlar."
    },
    "en": {
      "q": "What happens when a user enters a URL in the browser?",
      "a": "The browser uses DNS to find the server's IP address and then sends an HTTP/HTTPS request. The server processes the request and sends a response, which the browser uses to display the requested page. This process connects the user, browser, server, and web application behind the scenes."
    }
  },
  {
    "tr": {
      "q": "JSON nedir ve API'lerde neden bu kadar yaygın kullanılır?",
      "a": "JSON, uygulamalar arasında bilgi alışverişi yapmak için kullanılan hafif bir veri formatıdır. Veriyi basit anahtar-değer çiftleri halinde saklar ve hem insanlar hem de makineler tarafından kolayca okunabilir, bu yüzden API'lerde yaygın olarak kullanılır. Farklı sistemlerin, değiş tokuş edilen veriyi anlaması için basit ve tutarlı bir yol sağlar."
    },
    "en": {
      "q": "What is JSON and why is it commonly used in APIs?",
      "a": "JSON is a lightweight data format used to exchange information between applications. It stores data in simple key-value pairs and is easy for both humans and machines to read, making it widely used in APIs. It provides a simple and consistent way for different systems to understand exchanged data."
    }
  },
  {
    "tr": {
      "q": "CORS nedir ve frontend geliştiricileri neden sık sık CORS hataları görür?",
      "a": "CORS, farklı domain'ler arasındaki istekleri kontrol eden bir tarayıcı güvenlik kuralıdır. Yetkisiz web sitelerinin başka bir uygulamanın kaynaklarına erişmesini önler; bu yüzden sunucu belirli bir origin'e izin vermediğinde bir CORS hatası oluşabilir. Bu durum, genellikle frontend ve backend farklı domain veya port'larda çalıştığında ortaya çıkar."
    },
    "en": {
      "q": "What is CORS and why do frontend developers often see CORS errors?",
      "a": "CORS is a browser security rule that controls requests between different domains. It prevents unauthorized websites from accessing another application's resources, so a CORS error can occur when the server does not allow a specific origin. This commonly appears when a frontend and backend are running on different domains or ports."
    }
  },
  {
    "tr": {
      "q": "Session ile token arasındaki fark nedir?",
      "a": "Bir session, kullanıcının aktif giriş durumunu sunucuda saklar; bir token ise istemci ve sunucu arasında değiş tokuş edilen dijital bir kimlik bilgisi olarak işlev görür. Her ikisi de sistemlerin, kimliği doğrulanmış kullanıcıları birden fazla istek boyunca tanımasına yardımcı olur. Temel fark, kimlik doğrulama durumunun nerede tutulduğu ve nasıl doğrulandığıdır."
    },
    "en": {
      "q": "What is the difference between a session and a token?",
      "a": "A session stores a user's active login state on the server, while a token acts as a digital credential exchanged between the client and server. Both help systems recognize authenticated users across multiple requests. The main difference is where the authentication state is maintained and how it is verified."
    }
  },
  {
    "tr": {
      "q": "Webhook nedir ve normal bir API isteğinden farkı nedir?",
      "a": "Normal bir API isteğinde istemci bir servisten bilgi ya da eylem talep eder. Webhook'ta ise servis, belirli bir olay gerçekleştiğinde her seferinde sorulmadan otomatik olarak başka bir sisteme istek gönderir. Bu, uygulamaların sürekli güncelleme kontrolü yapmak yerine olaylara anında tepki vermesini sağlar."
    },
    "en": {
      "q": "What is a webhook, and how is it different from a normal API request?",
      "a": "In a normal API request, the client asks a service for information or an action. With a webhook, the service automatically sends a request to another system when a specific event occurs, without being asked each time. This allows applications to react to events immediately instead of constantly checking for updates."
    }
  },
  {
    "tr": {
      "q": "Web uygulamaları neden kuyruk ve arka plan işleri kullanır?",
      "a": "Kuyruklar, görevlerin kullanıcıyı bitmesini beklemeye zorlamak yerine arka planda işlenmesine olanak tanır. Örneğin, hoş geldin e-postası göndermek kayıttan sonra gerçekleşebilirken kullanıcı hemen bir yanıt alır. Bu, özellikle zaman alan görevlerde uygulamaları daha hızlı ve daha duyarlı hale getirir."
    },
    "en": {
      "q": "Why do web applications use queues and background jobs?",
      "a": "Queues allow tasks to be processed in the background instead of making users wait for them to finish. For example, sending a welcome email can happen after signup while the user receives an immediate response. This keeps applications faster and more responsive, especially when handling time-consuming tasks."
    }
  },
  {
    "tr": {
      "q": "Web uygulamalarında ortam değişkenleri (environment variables) neden kullanılır?",
      "a": "Ortam değişkenleri, API anahtarları, şifreler ve veritabanı adresleri gibi hassas ya da ortama özgü değerleri ana kodun dışında saklar. Bu, güvenliği artırır ve aynı uygulamanın geliştirme ile production ortamlarında farklı ayarlarla çalışmasına olanak tanır. Ayrıca hassas bilgilerin koda gömülmesini ve yanlışlıkla başkalarıyla paylaşılmasını önler."
    },
    "en": {
      "q": "Why are environment variables used in web applications?",
      "a": "Environment variables store sensitive or environment-specific values such as API keys, passwords, and database URLs outside the main code. This improves security and allows the same application to use different settings in development and production. They also prevent sensitive information from being hardcoded and accidentally shared with others."
    }
  }
];

export const TOPIC_DEEPENING: Record<number, { tr: string; en: string }> = {
  "1": {
    "tr": "Gerçek bir sayfa yüklenirken DNS çözümlemesi, bağlantı kurulması, HTTP isteği, sunucuda işleme ve tarayıcıda rendering aşamalarından geçilir. Bu zincirin her halkası performansı ve kullanıcı deneyimini etkiler.",
    "en": "A real page load moves through DNS resolution, connection setup, an HTTP request, server processing, and browser rendering. Every link in this chain affects performance and user experience."
  },
  "2": {
    "tr": "Frontend etkileşimi yönetir, backend iş kurallarını uygular, veritabanı ise durumu korur. Sorumlulukların açıkça ayrılması, sistemi test etmeyi ve değiştirmeyi kolaylaştırır.",
    "en": "The frontend manages interaction, the backend enforces business rules, and the database preserves state. Clear boundaries make the system easier to test and change."
  },
  "3": {
    "tr": "HTTP iletişimini incelerken metot, URL, header’lar, gövde ve durum kodunu birlikte değerlendirin. Hata ayıklama çoğunlukla tarayıcının Network panelinde bu parçaları kontrol etmekle başlar.",
    "en": "When inspecting HTTP, consider method, URL, headers, body, and status code together. Debugging often starts by checking these pieces in the browser Network panel."
  },
  "4": {
    "tr": "İyi bir API yalnızca veri sunmaz; tutarlı kaynak adları, açık hatalar, doğrulama ve geriye dönük uyumluluk sağlar. Bu da istemcilerin değişikliklerden daha az etkilenmesini sağlar.",
    "en": "A good API provides consistent resource names, clear errors, validation, and backward compatibility—not merely data. This reduces disruption for clients."
  },
  "5": {
    "tr": "Authentication kimliği kanıtlar; authorization izni kontrol eder. Canlı sistemler, kısa ömürlü erişim bilgilerini, güvenli cookie ayarlarını ve sunucu tarafı erişim kontrollerini birlikte kullanır.",
    "en": "Authentication proves identity; authorization checks permission. Production systems combine short-lived credentials, secure cookie settings, and server-side access checks."
  },
  "6": {
    "tr": "Güvenlik katmanlıdır: girdiyi doğrulama, trafiği şifreleme, istekleri sınırlandırma, gizli bilgileri koruma ve olağandışı davranışı izleme tek bir sistem olarak birlikte çalışır.",
    "en": "Security is layered: validate input, encrypt traffic, limit requests, protect secrets, and monitor unusual behavior as one system."
  },
  "7": {
    "tr": "Veri modeli gelecekteki sorguları şekillendirir. İndeksler okumayı hızlandırır, doğrulama ve transaction’lar tutarlılığı korur, sayfalama ise büyük sonuç kümelerinin maliyetini sınırlar.",
    "en": "The data model shapes future queries. Indexes speed reads, validation and transactions protect consistency, and pagination limits the cost of large result sets."
  },
  "8": {
    "tr": "Uzun görevleri istek döngüsünden çıkarmak yanıtların hızlı kalmasını sağlar. Kuyruk worker’ları, geçici hatalarda kaybı önlemek için yeniden deneme, idempotency ve hata kaydına ihtiyaç duyar.",
    "en": "Moving long tasks out of the request cycle keeps responses fast. Queue workers need retries, idempotency, and error logging to prevent loss during transient failures."
  },
  "9": {
    "tr": "Kalite güvencesi hata bulmaktan fazlasıdır. Unit, integration ve E2E testlerinin dengeli birleşimi değişiklikleri daha güvenli kılar; CI ise bu kontrolleri otomatik tekrarlar.",
    "en": "Quality assurance is more than finding bugs. A balanced mix of unit, integration, and E2E tests makes changes safer, while CI repeats those checks automatically for every change."
  },
  "10": {
    "tr": "Dağıtım yalnızca dosya yüklemekten ibaret değildir; build, test, yapılandırma, migration, sağlık kontrolleri ve rollback adımlarını içerir. Otomasyon süreci tekrarlanabilir hale getirir.",
    "en": "Deployment includes build, test, configuration, migrations, health checks, and rollback—not merely uploading files. Automation makes the process repeatable."
  },
  "11": {
    "tr": "Küçük, odaklı branch, commit ve pull request’ler incelemeyi hızlandırır. Açık açıklamalar, otomatik testler ve güncel bir main dalı çakışmaları azaltır.",
    "en": "Small, focused branches, commits, and pull requests accelerate review. Clear descriptions, automated tests, and an up-to-date main branch reduce conflicts."
  }
};

export const FUNDAMENTALS_GLOSSARY: Record<'tr' | 'en', GlossaryEntry[]> = {
  "tr": [
    {
      "terms": [
        "DNS servers",
        "DNS server",
        "DNS sunucuları",
        "DNS sunucusu"
      ],
      "title": "DNS sunucusu",
      "topic": 10,
      "definition": "Alan adını karşılık gelen IP adresine çözümleyen, Domain Name System altyapısının parçası olan sunucudur."
    },
    {
      "terms": [
        "Web servers",
        "Web server",
        "Web sunucuları",
        "Web sunucusu",
        "HTTP servers",
        "HTTP server"
      ],
      "title": "Web sunucusu",
      "topic": 2,
      "definition": "HTTP isteklerini kabul edip HTML, görsel veya API yanıtı gibi web kaynaklarını istemciye sunan yazılım ve sistemdir."
    },
    {
      "terms": [
        "Application server",
        "Uygulama sunucusu"
      ],
      "title": "Uygulama sunucusu",
      "topic": 2,
      "definition": "İş kurallarını çalıştıran, veri kaynaklarıyla iletişim kuran ve dinamik yanıt üreten sunucu katmanıdır."
    },
    {
      "terms": [
        "HTTP requests",
        "HTTP request",
        "HTTP istekleri",
        "HTTP isteği"
      ],
      "title": "HTTP isteği",
      "topic": 3,
      "definition": "Bir istemcinin belirli bir kaynak veya işlem için HTTP kurallarına göre sunucuya gönderdiği mesajdır."
    },
    {
      "terms": [
        "HTTP responses",
        "HTTP response",
        "HTTP yanıtları",
        "HTTP yanıtı"
      ],
      "title": "HTTP yanıtı",
      "topic": 3,
      "definition": "Sunucunun bir HTTP isteğine karşılık durum kodu, header ve isteğe bağlı body ile döndürdüğü mesajdır."
    },
    {
      "terms": [
        "Access Token",
        "Erişim tokenı"
      ],
      "title": "Access Token",
      "topic": 5,
      "definition": "Bir istemcinin korunan kaynağa erişim yetkisini kısa süre boyunca kanıtlayan kimlik bilgisidir."
    },
    {
      "terms": [
        "Refresh Token",
        "Yenileme tokenı"
      ],
      "title": "Refresh Token",
      "topic": 5,
      "definition": "Kullanıcıyı yeniden girişe zorlamadan yeni access token almak için kullanılan daha uzun ömürlü kimlik bilgisidir."
    },
    {
      "terms": [
        "Session cookie",
        "Oturum cookie’si"
      ],
      "title": "Session cookie",
      "topic": 5,
      "definition": "Tarayıcı ile sunucu arasındaki oturumu tanımlayan session kimliğini taşıyan cookie’dir."
    },
    {
      "terms": [
        "IP address",
        "IP adresi"
      ],
      "title": "IP adresi",
      "topic": 10,
      "definition": "Bir cihazın veya ağ arayüzünün ağ üzerindeki sayısal adresidir."
    },
    {
      "terms": [
        "Domain name",
        "Alan adı"
      ],
      "title": "Alan adı",
      "topic": 10,
      "definition": "İnsanların okuyabildiği ve DNS aracılığıyla bir IP adresine çözümlenen internet adresidir."
    },
    {
      "terms": [
        "Load balancer",
        "Yük dengeleyici"
      ],
      "title": "Load balancer",
      "topic": 6,
      "definition": "Gelen trafiği birden fazla sunucu örneğine dağıtarak kapasiteyi ve erişilebilirliği artıran bileşendir."
    },
    {
      "terms": [
        "Message broker",
        "Mesaj aracısı"
      ],
      "title": "Message broker",
      "topic": 8,
      "definition": "Üreticiler ile tüketiciler arasında mesajları kabul eden, saklayan ve ileten ara yazılımdır."
    },
    {
      "terms": [
        "Background job",
        "Arka plan işi"
      ],
      "title": "Background job",
      "topic": 8,
      "definition": "Kullanıcının isteğini bekletmeden ayrı bir süreçte veya worker üzerinde çalıştırılan görevdir."
    },
    {
      "terms": [
        "Database index",
        "Veritabanı indeksi"
      ],
      "title": "Veritabanı indeksi",
      "topic": 7,
      "definition": "Tablodaki satırlara daha hızlı erişmek için belirli sütunlar üzerinde oluşturulan yardımcı veri yapısıdır."
    },
    {
      "terms": [
        "Static content",
        "Statik içerik"
      ],
      "title": "Statik içerik",
      "topic": 1,
      "definition": "Sunucu tarafından saklandığı biçimde, istek başına yeniden üretilmeden sunulan içeriktir."
    },
    {
      "terms": [
        "Dynamic content",
        "Dinamik içerik"
      ],
      "title": "Dinamik içerik",
      "topic": 1,
      "definition": "İstek, kullanıcı veya güncel veriye göre sunucuda ya da istemcide üretilen veya güncellenen içeriktir."
    },
    {
      "terms": [
        "Pull Request"
      ],
      "title": "Pull Request",
      "topic": 11,
      "definition": "Bir branch’teki değişikliklerin incelenip başka bir branch’e birleştirilmesi için açılan iş birliği kaydıdır."
    },
    {
      "terms": [
        "Version Control",
        "Versiyon kontrolü"
      ],
      "title": "Version Control",
      "topic": 11,
      "definition": "Dosya ve kod değişikliklerinin geçmişini kaydeden, karşılaştırmayı ve ekip çalışmasını kolaylaştıran sistemdir."
    },
    {
      "terms": [
        "Client-Side Rendering",
        "Client-side"
      ],
      "title": "Client-Side Rendering (CSR)",
      "topic": 2,
      "definition": "Sayfa arayüzünün ve içeriğinin büyük bölümünün tarayıcıda JavaScript ile oluşturulduğu render yaklaşımıdır."
    },
    {
      "terms": [
        "Server-Side Rendering",
        "Server-side"
      ],
      "title": "Server-Side Rendering (SSR)",
      "topic": 2,
      "definition": "Bir sayfanın HTML çıktısının sunucuda hazırlanıp tarayıcıya gönderildiği render yaklaşımıdır."
    },
    {
      "terms": [
        "World Wide Web",
        "Web"
      ],
      "title": "Web (World Wide Web)",
      "topic": 1,
      "definition": "İnternet altyapısı üzerinde çalışan, bağlantılarla birbirine bağlanmış sayfa ve uygulamalardan oluşan bilgi sistemidir."
    },
    {
      "terms": [
        "İnternet"
      ],
      "title": "İnternet",
      "topic": 1,
      "definition": "Dünya çapındaki cihazların ve ağların veri alışverişi yapmasını sağlayan fiziksel ve mantıksal ağ altyapısıdır."
    },
    {
      "terms": [
        "Tarayıcı",
        "Browser"
      ],
      "title": "Tarayıcı (Browser)",
      "topic": 2,
      "definition": "Web kaynaklarını sunucudan isteyen, gelen HTML, CSS ve JavaScript’i işleyerek kullanıcıya gösteren istemci uygulamasıdır."
    },
    {
      "terms": [
        "İstemci",
        "Client"
      ],
      "title": "İstemci (Client)",
      "topic": 2,
      "definition": "Bir sunucudan veri veya hizmet talep eden cihaz, tarayıcı ya da uygulamadır."
    },
    {
      "terms": [
        "Sunucu",
        "Server"
      ],
      "title": "Sunucu (Server)",
      "topic": 2,
      "definition": "İstemcilerden gelen istekleri işleyen ve uygun yanıtı üreten sistem veya yazılımdır."
    },
    {
      "terms": [
        "Frontend"
      ],
      "title": "Frontend",
      "topic": 2,
      "definition": "Uygulamanın tarayıcıda çalışan, kullanıcının gördüğü ve etkileşim kurduğu katmanıdır."
    },
    {
      "terms": [
        "Backend"
      ],
      "title": "Backend",
      "topic": 2,
      "definition": "İş kurallarını, güvenliği ve veri işlemlerini sunucu tarafında yürüten görünmeyen uygulama katmanıdır."
    },
    {
      "terms": [
        "İstek",
        "Request"
      ],
      "title": "İstek (Request)",
      "topic": 2,
      "definition": "İstemcinin bir kaynak veya işlem talep etmek amacıyla sunucuya gönderdiği mesajdır."
    },
    {
      "terms": [
        "Yanıt",
        "Response"
      ],
      "title": "Yanıt (Response)",
      "topic": 2,
      "definition": "Sunucunun bir isteği işledikten sonra istemciye gönderdiği sonuç ve durum bilgisidir."
    },
    {
      "terms": [
        "HTTP"
      ],
      "title": "HTTP",
      "topic": 3,
      "definition": "İstemci ile sunucunun web üzerinde nasıl istek ve yanıt alışverişi yapacağını belirleyen uygulama katmanı protokolüdür."
    },
    {
      "terms": [
        "HTTPS"
      ],
      "title": "HTTPS",
      "topic": 3,
      "definition": "HTTP iletişimini TLS ile şifreleyerek veri bütünlüğü ve gizliliği sağlayan güvenli sürümdür."
    },
    {
      "terms": [
        "Durum kodu",
        "Status code"
      ],
      "title": "HTTP durum kodu",
      "topic": 3,
      "definition": "Bir HTTP isteğinin başarılı, hatalı veya yönlendirilmiş olduğunu sayısal olarak bildiren koddur; örneğin 200 veya 404."
    },
    {
      "terms": [
        "Header"
      ],
      "title": "HTTP Header",
      "topic": 3,
      "definition": "İstek veya yanıtla birlikte taşınan içerik tipi, yetkilendirme ve önbellek gibi ek bilgilerdir."
    },
    {
      "terms": [
        "API"
      ],
      "title": "API",
      "topic": 4,
      "definition": "Farklı yazılımların önceden tanımlanmış kurallar üzerinden veri ve işlev alışverişi yapmasını sağlayan arayüzdür."
    },
    {
      "terms": [
        "Endpoint"
      ],
      "title": "Endpoint",
      "topic": 4,
      "definition": "Bir API içindeki belirli kaynağa veya işleme erişmek için kullanılan URL adresidir."
    },
    {
      "terms": [
        "REST API",
        "REST"
      ],
      "title": "REST API",
      "topic": 4,
      "definition": "Kaynakları URL’lerle temsil eden ve HTTP metotlarını kullanan yaygın web API tasarım yaklaşımıdır."
    },
    {
      "terms": [
        "JSON"
      ],
      "title": "JSON",
      "topic": 4,
      "definition": "Veriyi anahtar-değer yapısında taşıyan, insanlar ve makineler tarafından kolay okunabilen hafif veri formatıdır."
    },
    {
      "terms": [
        "Authentication",
        "Kimlik doğrulama"
      ],
      "title": "Authentication",
      "topic": 5,
      "definition": "Bir kullanıcının iddia ettiği kişi olup olmadığını parola, token veya başka bir yöntemle doğrulama sürecidir."
    },
    {
      "terms": [
        "Authorization",
        "Yetkilendirme"
      ],
      "title": "Authorization",
      "topic": 5,
      "definition": "Kimliği doğrulanmış bir kullanıcının hangi kaynaklara ve işlemlere erişebileceğini belirleme sürecidir."
    },
    {
      "terms": [
        "Token"
      ],
      "title": "Token",
      "topic": 5,
      "definition": "Kullanıcının kimliğini veya yetkilerini sonraki isteklerde kanıtlamak için taşınan dijital kimlik bilgisidir."
    },
    {
      "terms": [
        "Session"
      ],
      "title": "Session",
      "topic": 5,
      "definition": "Bir kullanıcının oturum durumunun genellikle sunucuda tutulduğu kimlik doğrulama yaklaşımıdır."
    },
    {
      "terms": [
        "CORS"
      ],
      "title": "CORS",
      "topic": 6,
      "definition": "Tarayıcıların farklı origin’ler arasındaki isteklere hangi koşullarda izin vereceğini belirleyen güvenlik mekanizmasıdır."
    },
    {
      "terms": [
        "Cache",
        "Önbellek"
      ],
      "title": "Cache (Önbellek)",
      "topic": 6,
      "definition": "Sık kullanılan veriyi daha hızlı sunmak için geçici ve hızlı bir alanda saklama yöntemidir."
    },
    {
      "terms": [
        "Rate Limiting"
      ],
      "title": "Rate Limiting",
      "topic": 6,
      "definition": "Bir istemcinin belirli süre içinde yapabileceği istek sayısını sınırlayarak sistemi kötüye kullanımdan koruyan yöntemdir."
    },
    {
      "terms": [
        "Validation",
        "Doğrulama"
      ],
      "title": "Validation",
      "topic": 7,
      "definition": "Bir verinin işlenmeden veya kaydedilmeden önce beklenen biçim ve kurallara uygunluğunu kontrol etme işlemidir."
    },
    {
      "terms": [
        "Pagination",
        "Sayfalama"
      ],
      "title": "Pagination",
      "topic": 7,
      "definition": "Büyük veri kümelerini daha küçük parçalar hâlinde getirerek yük ve yanıt süresini azaltma tekniğidir."
    },
    {
      "terms": [
        "Veritabanı",
        "Database"
      ],
      "title": "Veritabanı",
      "topic": 7,
      "definition": "Uygulama verilerinin düzenli, kalıcı ve sorgulanabilir biçimde saklandığı sistemdir."
    },
    {
      "terms": [
        "Queue",
        "Kuyruk"
      ],
      "title": "Queue (Kuyruk)",
      "topic": 8,
      "definition": "Uzun süren görevleri sıraya alıp arka planda güvenilir biçimde işlemek için kullanılan yapıdır."
    },
    {
      "terms": [
        "Webhook"
      ],
      "title": "Webhook",
      "topic": 8,
      "definition": "Belirli bir olay gerçekleştiğinde bir sistemin başka bir sisteme otomatik HTTP isteği göndermesidir."
    },
    {
      "terms": [
        "Logging",
        "Loglama"
      ],
      "title": "Logging",
      "topic": 8,
      "definition": "Uygulamadaki olayların, isteklerin ve hataların daha sonra incelenmek üzere kaydedilmesidir."
    },
    {
      "terms": [
        "Unit test",
        "Integration",
        "End-to-End",
        "E2E"
      ],
      "title": "Test katmanları",
      "topic": 9,
      "definition": "Yazılım davranışını tek birimden tam kullanıcı akışına kadar farklı kapsam seviyelerinde doğrulayan test gruplarıdır."
    },
    {
      "terms": [
        "Continuous Integration",
        "CI"
      ],
      "title": "Continuous Integration (CI)",
      "topic": 9,
      "definition": "Her kod değişikliğinde test, lint ve build kontrollerini otomatik çalıştıran entegrasyon sürecidir."
    },
    {
      "terms": [
        "DNS"
      ],
      "title": "DNS",
      "topic": 10,
      "definition": "Alan adlarını cihazların iletişim kurabildiği IP adreslerine çeviren dağıtık isimlendirme sistemidir."
    },
    {
      "terms": [
        "Deployment",
        "Dağıtım"
      ],
      "title": "Deployment",
      "topic": 10,
      "definition": "Bir uygulama sürümünü kullanıcıların erişebileceği hedef ortama yayınlama sürecidir."
    },
    {
      "terms": [
        "Environment variable",
        "Ortam değişkenleri"
      ],
      "title": "Ortam değişkeni",
      "topic": 10,
      "definition": "Yapılandırma ve gizli değerleri uygulama kodundan ayrı tutmaya yarayan çalışma ortamı değeridir."
    },
    {
      "terms": [
        "Git"
      ],
      "title": "Git",
      "topic": 11,
      "definition": "Dosya değişikliklerinin geçmişini izleyen ve ekiplerin paralel çalışmasını sağlayan dağıtık versiyon kontrol sistemidir."
    },
    {
      "terms": [
        "Commit"
      ],
      "title": "Commit",
      "topic": 11,
      "definition": "Bir değişiklik grubunun açıklayıcı mesajla birlikte versiyon geçmişine kaydedilmiş hâlidir."
    },
    {
      "terms": [
        "Branch"
      ],
      "title": "Branch",
      "topic": 11,
      "definition": "Ana kod akışını etkilemeden bağımsız geliştirme yapılmasını sağlayan paralel çalışma koludur."
    },
    {
      "terms": [
        "Merge"
      ],
      "title": "Merge",
      "topic": 11,
      "definition": "Bir branch üzerindeki değişiklikleri başka bir branch’in geçmişiyle birleştirme işlemidir."
    }
  ],
  "en": [
    {
      "terms": [
        "DNS servers",
        "DNS server"
      ],
      "title": "DNS server",
      "topic": 10,
      "definition": "A server in the Domain Name System that resolves domain names to their corresponding IP addresses."
    },
    {
      "terms": [
        "Web servers",
        "Web server",
        "HTTP servers",
        "HTTP server"
      ],
      "title": "Web server",
      "topic": 2,
      "definition": "Software and infrastructure that accepts HTTP requests and serves web resources such as HTML, images, or API responses."
    },
    {
      "terms": [
        "Application server"
      ],
      "title": "Application server",
      "topic": 2,
      "definition": "The server layer that runs business logic, communicates with data sources, and produces dynamic responses."
    },
    {
      "terms": [
        "HTTP requests",
        "HTTP request"
      ],
      "title": "HTTP request",
      "topic": 3,
      "definition": "A message a client sends to a server under HTTP rules to request a resource or operation."
    },
    {
      "terms": [
        "HTTP responses",
        "HTTP response"
      ],
      "title": "HTTP response",
      "topic": 3,
      "definition": "A server message containing a status code, headers, and an optional body in reply to an HTTP request."
    },
    {
      "terms": [
        "Access Token"
      ],
      "title": "Access Token",
      "topic": 5,
      "definition": "A short-lived credential that proves a client is authorized to access a protected resource."
    },
    {
      "terms": [
        "Refresh Token"
      ],
      "title": "Refresh Token",
      "topic": 5,
      "definition": "A longer-lived credential used to obtain a new access token without requiring the user to sign in again."
    },
    {
      "terms": [
        "Session cookie"
      ],
      "title": "Session cookie",
      "topic": 5,
      "definition": "A cookie carrying the session identifier that connects a browser request to server-maintained login state."
    },
    {
      "terms": [
        "IP address"
      ],
      "title": "IP address",
      "topic": 10,
      "definition": "The numeric network address assigned to a device or network interface."
    },
    {
      "terms": [
        "Domain name"
      ],
      "title": "Domain name",
      "topic": 10,
      "definition": "A human-readable internet address that DNS resolves to an IP address."
    },
    {
      "terms": [
        "Load balancer"
      ],
      "title": "Load balancer",
      "topic": 6,
      "definition": "A component that distributes incoming traffic across multiple server instances to improve capacity and availability."
    },
    {
      "terms": [
        "Message broker"
      ],
      "title": "Message broker",
      "topic": 8,
      "definition": "Middleware that accepts, stores, and delivers messages between producers and consumers."
    },
    {
      "terms": [
        "Background job"
      ],
      "title": "Background job",
      "topic": 8,
      "definition": "A task executed by a separate process or worker so it does not delay the user’s request."
    },
    {
      "terms": [
        "Database index"
      ],
      "title": "Database index",
      "topic": 7,
      "definition": "An auxiliary data structure built on selected columns to locate table rows more efficiently."
    },
    {
      "terms": [
        "Static content"
      ],
      "title": "Static content",
      "topic": 1,
      "definition": "Content served as stored instead of being generated again for each request."
    },
    {
      "terms": [
        "Dynamic content"
      ],
      "title": "Dynamic content",
      "topic": 1,
      "definition": "Content generated or updated on the server or client according to a request, user, or current data."
    },
    {
      "terms": [
        "Pull Request"
      ],
      "title": "Pull Request",
      "topic": 11,
      "definition": "A collaboration record proposing that changes from one branch be reviewed and merged into another."
    },
    {
      "terms": [
        "Version Control"
      ],
      "title": "Version Control",
      "topic": 11,
      "definition": "A system that records file and code history to support comparison, recovery, and collaboration."
    },
    {
      "terms": [
        "Client-Side Rendering",
        "Client-side"
      ],
      "title": "Client-Side Rendering (CSR)",
      "topic": 2,
      "definition": "A rendering approach in which JavaScript builds most of the page interface and content in the browser."
    },
    {
      "terms": [
        "Server-Side Rendering",
        "Server-side"
      ],
      "title": "Server-Side Rendering (SSR)",
      "topic": 2,
      "definition": "A rendering approach in which the server prepares the page’s HTML before sending it to the browser."
    },
    {
      "terms": [
        "World Wide Web",
        "Web"
      ],
      "title": "Web (World Wide Web)",
      "topic": 1,
      "definition": "An information system of interlinked pages and applications that operates over Internet infrastructure."
    },
    {
      "terms": [
        "Internet"
      ],
      "title": "Internet",
      "topic": 1,
      "definition": "The global physical and logical network infrastructure that allows devices and networks to exchange data."
    },
    {
      "terms": [
        "Browser"
      ],
      "title": "Browser",
      "topic": 2,
      "definition": "A client application that requests web resources and renders the returned HTML, CSS, and JavaScript."
    },
    {
      "terms": [
        "Client"
      ],
      "title": "Client",
      "topic": 2,
      "definition": "A device, browser, or application that requests data or a service from a server."
    },
    {
      "terms": [
        "Server"
      ],
      "title": "Server",
      "topic": 2,
      "definition": "A system or program that processes client requests and produces appropriate responses."
    },
    {
      "terms": [
        "Frontend"
      ],
      "title": "Frontend",
      "topic": 2,
      "definition": "The browser-side layer of an application that users see and interact with."
    },
    {
      "terms": [
        "Backend"
      ],
      "title": "Backend",
      "topic": 2,
      "definition": "The server-side layer responsible for business rules, security, and data processing."
    },
    {
      "terms": [
        "Request"
      ],
      "title": "Request",
      "topic": 2,
      "definition": "A message sent by a client to ask a server for a resource or operation."
    },
    {
      "terms": [
        "Response"
      ],
      "title": "Response",
      "topic": 2,
      "definition": "The result and status information a server sends after processing a request."
    },
    {
      "terms": [
        "HTTP"
      ],
      "title": "HTTP",
      "topic": 3,
      "definition": "The application-layer protocol defining how clients and servers exchange requests and responses on the Web."
    },
    {
      "terms": [
        "HTTPS"
      ],
      "title": "HTTPS",
      "topic": 3,
      "definition": "The secure form of HTTP that uses TLS to protect confidentiality and data integrity."
    },
    {
      "terms": [
        "Status code"
      ],
      "title": "HTTP status code",
      "topic": 3,
      "definition": "A numeric code such as 200 or 404 that reports the outcome of an HTTP request."
    },
    {
      "terms": [
        "Header"
      ],
      "title": "HTTP Header",
      "topic": 3,
      "definition": "Metadata carried with a request or response, such as content type, authorization, or caching instructions."
    },
    {
      "terms": [
        "API"
      ],
      "title": "API",
      "topic": 4,
      "definition": "An interface that lets different software exchange data and capabilities through defined rules."
    },
    {
      "terms": [
        "Endpoint"
      ],
      "title": "Endpoint",
      "topic": 4,
      "definition": "A URL used to access a specific resource or operation exposed by an API."
    },
    {
      "terms": [
        "REST API",
        "REST"
      ],
      "title": "REST API",
      "topic": 4,
      "definition": "A common web API design style that represents resources with URLs and uses HTTP methods."
    },
    {
      "terms": [
        "JSON"
      ],
      "title": "JSON",
      "topic": 4,
      "definition": "A lightweight, human-readable data format commonly used to exchange structured information."
    },
    {
      "terms": [
        "Authentication"
      ],
      "title": "Authentication",
      "topic": 5,
      "definition": "The process of verifying that a user is who they claim to be."
    },
    {
      "terms": [
        "Authorization"
      ],
      "title": "Authorization",
      "topic": 5,
      "definition": "The process of deciding which resources and actions an authenticated user may access."
    },
    {
      "terms": [
        "Token"
      ],
      "title": "Token",
      "topic": 5,
      "definition": "A digital credential carried with later requests to prove identity or permissions."
    },
    {
      "terms": [
        "Session"
      ],
      "title": "Session",
      "topic": 5,
      "definition": "An authentication approach in which a user’s active login state is commonly maintained on the server."
    },
    {
      "terms": [
        "CORS"
      ],
      "title": "CORS",
      "topic": 6,
      "definition": "A browser security mechanism controlling when requests between different origins are allowed."
    },
    {
      "terms": [
        "Cache"
      ],
      "title": "Cache",
      "topic": 6,
      "definition": "Temporary fast storage used to serve frequently requested data more quickly."
    },
    {
      "terms": [
        "Rate Limiting"
      ],
      "title": "Rate Limiting",
      "topic": 6,
      "definition": "Limiting how many requests a client may make during a period to protect a service from abuse."
    },
    {
      "terms": [
        "Validation"
      ],
      "title": "Validation",
      "topic": 7,
      "definition": "Checking that data satisfies expected rules and formats before it is processed or stored."
    },
    {
      "terms": [
        "Pagination"
      ],
      "title": "Pagination",
      "topic": 7,
      "definition": "Fetching a large dataset in smaller pages to reduce load and response time."
    },
    {
      "terms": [
        "Database"
      ],
      "title": "Database",
      "topic": 7,
      "definition": "A system that stores application data in an organized, durable, and queryable form."
    },
    {
      "terms": [
        "Queue"
      ],
      "title": "Queue",
      "topic": 8,
      "definition": "A structure that schedules long-running tasks for reliable background processing."
    },
    {
      "terms": [
        "Webhook"
      ],
      "title": "Webhook",
      "topic": 8,
      "definition": "An automatic HTTP request sent to another system when a specific event occurs."
    },
    {
      "terms": [
        "Logging"
      ],
      "title": "Logging",
      "topic": 8,
      "definition": "Recording application events, requests, and errors for later analysis."
    },
    {
      "terms": [
        "Unit test",
        "Integration",
        "End-to-End",
        "E2E"
      ],
      "title": "Testing layers",
      "topic": 9,
      "definition": "Levels of software testing that verify behavior from an isolated unit to a complete user flow."
    },
    {
      "terms": [
        "Continuous Integration",
        "CI"
      ],
      "title": "Continuous Integration (CI)",
      "topic": 9,
      "definition": "A process that automatically runs tests, lint checks, and builds for each code change."
    },
    {
      "terms": [
        "DNS"
      ],
      "title": "DNS",
      "topic": 10,
      "definition": "The distributed naming system that translates domain names into IP addresses."
    },
    {
      "terms": [
        "Deployment"
      ],
      "title": "Deployment",
      "topic": 10,
      "definition": "The process of releasing an application version to an environment users can access."
    },
    {
      "terms": [
        "Environment variable"
      ],
      "title": "Environment variable",
      "topic": 10,
      "definition": "A runtime value used to keep configuration and secrets separate from application code."
    },
    {
      "terms": [
        "Git"
      ],
      "title": "Git",
      "topic": 11,
      "definition": "A distributed version-control system that tracks file history and supports parallel teamwork."
    },
    {
      "terms": [
        "Commit"
      ],
      "title": "Commit",
      "topic": 11,
      "definition": "A recorded group of changes accompanied by a descriptive message in version history."
    },
    {
      "terms": [
        "Branch"
      ],
      "title": "Branch",
      "topic": 11,
      "definition": "A parallel line of development that allows isolated work without changing the main code flow."
    },
    {
      "terms": [
        "Merge"
      ],
      "title": "Merge",
      "topic": 11,
      "definition": "The operation that combines changes from one branch into another."
    }
  ]
};
