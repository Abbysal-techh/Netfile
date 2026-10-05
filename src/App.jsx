"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Globe,
  LayoutDashboard,
  Mail,
  Phone,
  Search,
  Users,
} from "lucide-react";

const services = [
  {
    icon: LayoutDashboard,
    title: "Klasor Uretimi",
    description: "Olcuye ve kurumsal kimlige ozel karton, plastik ve metal klasor cozumleri.",
  },
  {
    icon: Search,
    title: "Dosya Tasarimi",
    description: "Sunum dosyasi, branda kutusu ve kurumsal arxiv dosyalari icin ozel uretim.",
  },
  {
    icon: Globe,
    title: "Arsivleme Cozumleri",
    description: "Fiziksel ve dijital arxiv ihtiyaclari icin dayanıklı, duzenli depolama sistemleri.",
  },
  {
    icon: BadgeCheck,
    title: "Kurumsal Etiketleme",
    description: "Organizasyonu hizlandiran etiketli paketleme ve barkod destekli urun cozumleri.",
  },
];

const products = [
  {
    title: "A3 Karton Klasor",
    category: "Klasor",
    description: "Firma logolu, mat kaplamali A3 karton klasor, 50 adet minimum uretim.",
    accent: "from-brand-500 to-brand-400",
  },
  {
    title: "PVC Kapakli Sunum Dosyasi",
    category: "Dosya",
    description: "Seffaf PVC kapakli, cift cepli kurumsal sunum dosyasi.",
    accent: "from-brand-400 to-brand-500",
  },
  {
    title: "Spiral Ciltli Belge Dosyasi",
    category: "Aksesuar",
    description: "Profesyonel rapor ve kataloglar icin dayanikli spiral ciltleme.",
    accent: "from-brand-500 to-brand-600",
  },
  {
    title: "Kisisellestirilmis Arsiv Kutusu",
    category: "Klasor",
    description: "Ebati ve baskisi belirlenebilir, guclu tasima sapli arxiv kutusu.",
    accent: "from-brand-600 to-brand-700",
  },
  {
    title: "Karton Dosya Seti",
    category: "Dosya",
    description: "Ofis ici standart karton dosya seti, istege bagli renk secenekleri.",
    accent: "from-brand-500 to-brand-400",
  },
];

const testimonials = [
  {
    quote: "Siparisimizi kisa surede teslim ettiler ve sunduklari tasarim kaliteyi tam karsiladi.",
    author: "Ahmet Cetin",
    role: "Satin Alma Muduru, Metro Yatirim",
  },
  {
    quote: "Teklif sureci bastan sona cok hizli ilerledi. Ozel olcu isteyen dosya ihtiyaclarimizi eksiksiz karsiladilar.",
    author: "Sule Yildirim",
    role: "Ofis Muduru, Eksen Holding",
  },
  {
    quote: "Baski kalitesi ve paketleme cok iyiydi. Projeyi zamaninda teslim ettiler.",
    author: "Mert Aksoy",
    role: "Operasyon Yetkilisi, Atlas Sigorta",
  },
];

const faqs = [
  {
    question: "Ozel olcu ve baski talebi nasil iletilir?",
    answer: "Urun detaylarini ve adet bilgilerini teklif formuna ekleyerek bize gonderin. Ekip size tum detaylari sunacaktir.",
  },
  {
    question: "Minimum uretim adedi var mi?",
    answer: "Bazı urunlerde dusuk adetli siparis mumkundur. Sunum dosyalari ve klasorlerde kucuk miktarla baslayabilirsiniz.",
  },
  {
    question: "Teslimat suresi ne kadardir?",
    answer: "Stoklu urunlerde 3-5 is gunu, ozel uretimde 7-10 is gunu arasinda teslimat sagliyoruz.",
  },
];

const sanitizeText = (value) =>
  value
    .replace(/[<>&"'\/]/g, (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
      }[char])
    )
    .trim();

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("Tumu");
  const [loading, setLoading] = useState(true);
  const [quoteBasket, setQuoteBasket] = useState([]);
  const [quoteForm, setQuoteForm] = useState({ name: "", company: "", email: "", message: "" });
  const [submitState, setSubmitState] = useState({ success: false, error: "" });
  const [newItemAdded, setNewItemAdded] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("dosyahane-quote-basket");
      if (saved) {
        setQuoteBasket(JSON.parse(saved));
      }
    } catch (error) {
      console.warn("LocalStorage okunamadi", error);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("dosyahane-quote-basket", JSON.stringify(quoteBasket));
  }, [quoteBasket]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "Tumu") return products;
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  const handleAddQuote = (product) => {
    if (quoteBasket.some((item) => item.title === product.title)) return;
    setQuoteBasket((prev) => [...prev, product]);
    setNewItemAdded(true);
    window.setTimeout(() => setNewItemAdded(false), 350);
  };

  const handleRemoveQuote = (title) => {
    setQuoteBasket((prev) => prev.filter((item) => item.title !== title));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const sanitizedData = {
      name: sanitizeText(quoteForm.name),
      company: sanitizeText(quoteForm.company),
      email: sanitizeText(quoteForm.email),
      message: sanitizeText(quoteForm.message),
    };

    if (!sanitizedData.name || !sanitizedData.email) {
      setSubmitState({ success: false, error: "Lutfen isim ve e-posta adresinizi giriniz." });
      return;
    }

    setSubmitState({ success: true, error: "" });
    setQuoteForm({ name: "", company: "", email: "", message: "" });
    window.setTimeout(() => setSubmitState({ success: false, error: "" }), 4200);
  };

  return (
    <main className="min-h-screen bg-brand-900 text-brand-200">
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </motion.div>
      )}

      <header className="sticky top-0 z-30 border-b border-brand-700/50 bg-brand-900/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#hero" className="flex items-center gap-3 text-brand-200">
            <div className="rounded-2xl bg-brand-500 p-3 shadow-soft">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-400">DOSYAHANE</p>
              <span className="text-xl font-semibold text-brand-200">Kurumsal Dosya Cozumleri</span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-brand-200/80 md:flex" aria-label="Ana navigasyon">
            <a href="#about" className="transition hover:text-brand-400">Hakkimizda</a>
            <a href="#products" className="transition hover:text-brand-400">Urunler</a>
            <a href="#quote" className="transition hover:text-brand-400">Teklif</a>
            <a href="#contact" className="transition hover:text-brand-400">Iletisim</a>
          </nav>

          <div className="flex items-center gap-4">
            <motion.button
              type="button"
              animate={newItemAdded ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-700/60 bg-brand-900/80 px-4 py-2 text-sm text-brand-200 transition hover:border-brand-500 hover:text-brand-100"
              aria-label={`Teklif sepetinde ${quoteBasket.length} urun bulunuyor`}
            >
              <BadgeCheck className="h-4 w-4" />
              <span>{quoteBasket.length}</span>
            </motion.button>
            <a href="#quote" className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-400">Teklif Al</a>
          </div>
        </div>
      </header>

      <section id="hero" className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div className="space-y-8">
            <p className="inline-flex rounded-full border border-brand-500/30 bg-brand-700/60 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand-400">
              Dosya • Klasor • Arsiv
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-brand-200 sm:text-6xl lg:text-7xl">
              Kurumsal Arsiv ve Sunum Icin Profesyonel Cozumler
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-brand-200/80 sm:text-xl">
              Kuruma ozel dosya, klasor ve arxiv urunleriyle is akisinizi duzenli, sik ve guvenli hale getiriyoruz.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#products" className="rounded-full bg-brand-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-400">Urunleri Kesfet</a>
              <a href="#about" className="rounded-full border border-brand-500/30 bg-brand-900/80 px-8 py-3 text-sm font-semibold text-brand-200 transition hover:border-brand-400">Hakkimizda</a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-brand-700/70 bg-brand-800/70 p-8 shadow-soft backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between rounded-3xl bg-brand-900/60 px-4 py-3 text-sm text-brand-400">
              <span>Teklif Yonetimi</span>
              <span className="rounded-full bg-brand-700 px-3 py-1 text-xs text-brand-200">Hizli</span>
            </div>
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-900/80 p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="rounded-3xl bg-brand-500/15 p-3 text-brand-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Katalog</p>
                    <h3 className="text-2xl font-semibold text-brand-200">Urun secimini kolaylastirin</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 rounded-full bg-brand-700/70">
                    <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-brand-500 to-brand-400" />
                  </div>
                  <div className="h-2 rounded-full bg-brand-700/70">
                    <div className="h-2 w-[76%] rounded-full bg-gradient-to-r from-brand-500 to-brand-400" />
                  </div>
                  <div className="h-2 rounded-full bg-brand-700/70">
                    <div className="h-2 w-[88%] rounded-full bg-gradient-to-r from-brand-500 to-brand-400" />
                  </div>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-gradient-to-br from-brand-800/80 to-brand-700/80 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-400">Uretim</p>
                <h2 className="mt-3 text-3xl font-semibold text-brand-200">Duzgun paketleme ve guvenli teslimat</h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-200/80">
                  Sectiginiz urunler profesyonel ambalaj ve hizli lojistik ile hazirlanir.
                </p>
                <div className="mt-6 flex items-center gap-3 text-brand-200">
                  <div className="rounded-full bg-brand-500/20 p-3 text-brand-400">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Kurumsal teslimata uygun</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-400">Hakkimizda</p>
            <h2 className="text-4xl font-semibold text-brand-200 sm:text-5xl">Ofisinize uygun dosya ve arxiv cozumleri</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-brand-200/80">
              200+ kurumsal musterilere ozel dosya, klasor ve arxivleme urunleri sunduk. Tasarim, uretim ve teslimat sureclerini kurumunuza ozel yonetiyoruz.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-900/70 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Vizyon</p>
                <p className="mt-3 text-brand-200/80">Kurumsal arxiv yonetimini sik, dayanıklı ve islevsel hale getirmek.</p>
              </div>
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-900/70 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Misyon</p>
                <p className="mt-3 text-brand-200/80">Her olcu ve adette dosya ihtiyacina hizli, guvenilir ve esnek cozum saglamak.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-brand-700/60 bg-brand-900/70 p-10 shadow-soft">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-brand-200">Neden DosyaHane?</h3>
                <p className="mt-4 text-brand-200/80">Kurumsal dosya, klasor ve arxiv cozumlerinde kalite, hiz ve kesin teslimat vaat ediyoruz.</p>
              </div>
              <div className="space-y-4">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div key={service.title} className="flex gap-4 rounded-3xl border border-brand-700/60 bg-brand-900/80 p-5">
                      <div className="rounded-3xl bg-brand-500/15 p-3 text-brand-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-brand-200">{service.title}</p>
                        <p className="text-sm text-brand-200/80">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-400">Urun Katalogu</p>
          <h2 className="mt-4 text-3xl font-semibold text-brand-200 sm:text-4xl">Dosya ve Klasor Urunlerimiz</h2>
          <p className="mt-4 max-w-2xl text-lg text-brand-200/80">Kurumsal ihtiyaclara uygun, dayanıklı ve estetik urun seceneklerini kesfedin.</p>
        </div>
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {["Tumu", "Klasor", "Dosya", "Aksesuar"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                activeFilter === tab
                  ? "bg-brand-500 text-white"
                  : "border border-brand-700/40 bg-brand-900/80 text-brand-200 hover:border-brand-500 hover:bg-brand-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {filteredProducts.map((product, index) => (
            <motion.article
              key={product.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.01 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group overflow-hidden rounded-[1.75rem] border border-brand-700/60 bg-brand-900/70 shadow-soft transition hover:shadow-md"
            >
              <div className={`h-40 bg-gradient-to-r ${product.accent}`} />
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand-200">{product.title}</h3>
                  <span className="rounded-full border border-brand-500/30 bg-brand-800/80 px-3 py-1 text-sm text-brand-200/70">{product.category}</span>
                </div>
                <p className="text-sm leading-relaxed text-brand-200/80">{product.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleAddQuote(product)}
                    className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
                  >
                    Teklif Sepetine Ekle
                  </button>
                  <a href="#quote" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 transition group-hover:gap-3">
                    Teklif Al <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="quote" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] border border-brand-700/60 bg-brand-900/70 p-8 shadow-soft">
            <div className="mb-6 flex items-center justify-between rounded-3xl bg-brand-900/60 px-4 py-3 text-sm text-brand-400">
              <span>Teklif Sepeti</span>
              <span className="rounded-full bg-brand-700 px-3 py-1 text-xs text-brand-200">Kaydedildi</span>
            </div>
            <div className="space-y-4">
              {quoteBasket.length > 0 ? (
                quoteBasket.map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-3xl border border-brand-700/60 bg-brand-800/80 p-4">
                    <div>
                      <p className="font-semibold text-brand-200">{item.title}</p>
                      <p className="text-sm text-brand-400">{item.category} cozumu</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuote(item.title)}
                      className="rounded-full bg-brand-500/15 px-3 py-2 text-xs font-semibold text-brand-200 transition hover:bg-brand-500/30"
                    >
                      Kaldir
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-brand-700/60 bg-brand-900/80 p-6 text-sm text-brand-200/80">
                  Teklif listesine henuz urun eklemediniz. Urunler bolumunden hizlica ekleyebilirsiniz.
                </div>
              )}
            </div>
          </aside>

          <div className="rounded-[2rem] border border-brand-700/60 bg-brand-900/70 p-8 shadow-soft">
            <h2 className="text-3xl font-semibold text-brand-200 sm:text-4xl">Teklif Talebi Olusturun</h2>
            <p className="mt-4 text-lg text-brand-200/80">Siparisiniz ve ihtiyaclariniz icin bize hemen mesaj gonderin. Sizin icin ozel fiyat teklifi hazirlayalim.</p>
            <form className="mt-10 space-y-5" aria-label="Teklif formu" onSubmit={handleSubmit}>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-brand-200">Ad Soyad</span>
                  <input
                    type="text"
                    name="name"
                    value={quoteForm.name}
                    onChange={handleFormChange}
                    className="w-full rounded-3xl border border-brand-700/60 bg-brand-900/80 px-4 py-3 text-brand-200 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                    placeholder="Isminiz"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-brand-200">Sirket</span>
                  <input
                    type="text"
                    name="company"
                    value={quoteForm.company}
                    onChange={handleFormChange}
                    className="w-full rounded-3xl border border-brand-700/60 bg-brand-900/80 px-4 py-3 text-brand-200 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                    placeholder="Sirket adiniz"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-200">E-posta</span>
                <input
                  type="email"
                  name="email"
                  value={quoteForm.email}
                  onChange={handleFormChange}
                  className="w-full rounded-3xl border border-brand-700/60 bg-brand-900/80 px-4 py-3 text-brand-200 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                  placeholder="mail@firma.com"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-200">Mesajiniz</span>
                <textarea
                  name="message"
                  value={quoteForm.message}
                  onChange={handleFormChange}
                  className="min-h-[150px] w-full rounded-[2rem] border border-brand-700/60 bg-brand-900/80 px-4 py-4 text-brand-200 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                  placeholder="Adet, olcu ve urun detaylarini paylasabilirsiniz."
                />
              </label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-brand-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
                >
                  Teklif Gonder
                </button>
                <div aria-live="polite" className="min-h-[1.25rem] text-sm text-brand-200/80">
                  {submitState.error && <span className="text-red-400">{submitState.error}</span>}
                  {submitState.success && (
                    <span className="inline-flex items-center gap-2 text-brand-400">
                      <BadgeCheck className="h-4 w-4 text-brand-400" /> Teklif isteginiz kaydedildi. En kisa surede donus yapacagiz.
                    </span>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-brand-200 sm:text-4xl">Sikca Sorulan Sorular</h2>
          <p className="mt-4 max-w-2xl text-lg text-brand-200/80">Urun secimi ve teklif sureci hakkinda merak ettikleriniz.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div key={item.question} className="overflow-hidden rounded-[1.75rem] border border-brand-700/60 bg-brand-900/70">
              <button
                type="button"
                aria-expanded={activeFaq === index}
                aria-controls={`faq-panel-${index}`}
                onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left text-lg font-semibold text-brand-200 transition hover:bg-brand-900/80"
              >
                <span>{item.question}</span>
                <span className="text-brand-400">{activeFaq === index ? '−' : '+'}</span>
              </button>
              <div id={`faq-panel-${index}`} className={`${activeFaq === index ? 'px-6 pb-6' : 'hidden'} transition-all duration-300`}>
                <p className="text-sm leading-relaxed text-brand-200/80">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-400">Iletisim</p>
            <h2 className="text-4xl font-semibold text-brand-200 sm:text-5xl">Siparis ve teklif talepleriniz icin buradayiz</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-brand-200/80">
              Formu doldurun veya dogrudan iletisime gecin. Siparis hazirlama ve teslimat planini sizinle hizlica paylasalim.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-900/70 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-3xl bg-brand-500/15 p-3 text-brand-400">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Adres</p>
                    <p className="mt-3 text-brand-200/80">Maslak, Istanbul</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-900/70 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-3xl bg-brand-500/15 p-3 text-brand-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Telefon</p>
                    <p className="mt-3 text-brand-200/80">+90 212 000 00 00</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-900/70 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-3xl bg-brand-500/15 p-3 text-brand-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-400">E-posta</p>
                    <p className="mt-3 text-brand-200/80">info@dosyahane.com</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-900/70 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-3xl bg-brand-500/15 p-3 text-brand-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Calisma Saatleri</p>
                    <p className="mt-3 text-brand-200/80">Hafta ici 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] border border-brand-700/60 bg-brand-900/70 p-10 shadow-soft">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-800/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Destek</p>
                <p className="mt-3 text-brand-200/80">Siparis takibi, numune talepleri ve ozel olcu ihtiyaclari icin bize yazabilirsiniz.</p>
              </div>
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-800/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Kurumsal Hizmet</p>
                <p className="mt-3 text-brand-200/80">Buyuk hacimli projeler icin ozel fiyatlandirma ve teslimat plani sunuyoruz.</p>
              </div>
              <div className="rounded-[1.75rem] border border-brand-700/60 bg-brand-800/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Teklif Takip</p>
                <p className="mt-3 text-brand-200/80">Teklif sepetinizdeki ogeleri kaydederek formdan hemen gonderin.</p>
              </div>
            </div>
          </div>
        </div>
        <footer className="mt-12 flex flex-col gap-4 border-t border-brand-700/50 pt-8 text-sm text-brand-200/70 md:flex-row md:items-center md:justify-between">
          <p>© 2026 DosyaHane. Kurumsal dosyalama ve arxiv cozumleriniz icin guvenilir ortak.</p>
          <div className="flex gap-6">
            <a href="#hero" className="transition hover:text-brand-400">Ana Sayfa</a>
            <a href="#about" className="transition hover:text-brand-400">Hakkimizda</a>
            <a href="#products" className="transition hover:text-brand-400">Urunler</a>
          </div>
        </footer>
      </section>
    </main>
  );
}
