// Fills verified tafsir & event content for surahs from TDV İslâm Ansiklopedisi
// (Diyanet Vakfı — Islamic Encyclopedia). Each entry cites the exact URL and
// the article author. Run: node scripts/fill-verified-surahs.mjs
// Idempotent — overwrites matching id entries with verified payload.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(__dirname, '../src/data/quranChronology.json');

const ACCESSED = '2026-04-23';
const src = (slug, author) => ({
  name: `TDV İslâm Ansiklopedisi — ${author}`,
  url: `https://islamansiklopedisi.org.tr/${slug}`,
  accessedAt: ACCESSED,
});

// id -> { tafsir: { tr, en }, event: { kind, tr, en }, slug, author }
const VERIFIED = {
  1: {
    slug: 'alak-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân-ı Kerîm'in 96. suresidir; Mekkî olup 19 ayettir. İlk beş ayeti Hz. Peygamber'e gelen ilk vahyi oluşturur. Adını ikinci ayetteki \"alak\" (kan pıhtısı/embriyon) kelimesinden alır. Okumanın ve ilmin önemi ile insanın yaratılışı ve Allah'a secde temalarını işler.",
      en: "The 96th sura of the Qur'an; Meccan, 19 verses. Its first five verses constitute the very first revelation to the Prophet. Named after the word 'alaq' (clinging substance/embryo) in verse 2. It highlights the importance of reading and knowledge, the creation of humankind, and prostration before God.",
    },
    event: {
      kind: 'asbab',
      tr: "Sahih rivayete göre (Buhârî, Müslim) ilk beş ayet, Ramazan'ın 27. gecesi Hira mağarasında Cebrâil aracılığıyla Hz. Peygamber'e indirilmiştir; geri kalan ayetler ise Ebû Cehil'in, Peygamber'i namazdan alıkoymaya çalışması üzerine nâzil olmuştur.",
      en: "According to authentic narrations (al-Bukhārī, Muslim), the first five verses were revealed to the Prophet via Gabriel in the Cave of Hira on the 27th night of Ramadan. The remaining verses were revealed concerning Abū Jahl's attempts to prevent the Prophet from praying.",
    },
  },
  2: {
    slug: 'kalem-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 68. suresidir; Mekke döneminin başlarında inmiş, 52 ayettir. Adını ikinci ayetteki \"kalem\" kelimesinden alır; \"Nûn\" ve \"Nûn ve'l-kalem\" adlarıyla da anılır. Hz. Peygamber'in üstün ahlakı vurgulanır; inkârcıların tutumu eleştirilir; cennet bahçesi sahiplerinin kıssasıyla gafletten sakındırılır.",
      en: "The 68th sura of the Qur'an; revealed in the early Meccan period, 52 verses. Named from the word 'qalam' (pen) in its second verse; also known as 'Nūn' or 'Nūn wa'l-Qalam'. It emphasises the Prophet's noble character, rebukes the unbelievers, and warns against heedlessness through the parable of the owners of the garden.",
    },
    event: {
      kind: 'asbab',
      tr: "Mekke'de Hz. Peygamber'e yönelik baskıların şiddetlendiği bir dönemde inmiştir. 51. ayetin, Kureyş'ten bir grubun Peygamber'e \"nazar değdirmek\" istemesi; başka bazı ayetlerin ise Velîd b. Mugīre ve Ahnes b. Şerîk gibi müşrik ileri gelenleri hakkında nâzil olduğu nakledilir.",
      en: "Revealed during an intensifying period of persecution against the Prophet in Mecca. Verse 51 is reported to have been revealed in response to a group of Quraysh attempting to cast the evil eye upon him; other verses concern Meccan notables such as al-Walīd b. al-Mughīra and al-Akhnas b. Sharīq.",
    },
  },
  3: {
    slug: 'muzzemmil-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 73. suresidir; ağırlıklı olarak Mekkî olup 3, 10 ve 20. ayetleri Medenîdir; 20 ayettir. Peygamber'in nübüvvet görevine hazırlanması, gece ibadeti ve Kur'an tilâvetinin düşünerek, tertil üzere yapılması gerektiği ana temalarıdır.",
      en: "The 73rd sura of the Qur'an; predominantly Meccan with verses 3, 10 and 20 Medinan; 20 verses. Its principal themes are the Prophet's preparation for his prophetic mission, the importance of night-time worship, and the requirement to recite the Qur'an slowly and with contemplation (tartīl).",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre sure, Hz. Peygamber'in ya Kureyş ileri gelenlerinden duyduğu incitici sözlerin ardından ya da Hira mağarasındaki ilk vahyin verdiği heyecan ve korkuyla eve dönüp örtüsüne bürünmesi üzerine indirilmiştir.",
      en: "According to the narrations, the sura was revealed after the Prophet wrapped himself in his cloak on returning home — either following hurtful remarks from Qurashī notables, or due to the awe and fear caused by his first encounter with revelation in the Cave of Hira.",
    },
  },
  4: {
    slug: 'muddessir-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 74. suresidir; Mekke döneminin ilk yıllarında inmiş, 56 ayettir. Temel amacı muhataplara sorumluluk bilinci aşılamak, dünyada yapılan eylemlerin âhirette karşılık bulacağını bildirmek ve Peygamber'i tebliğe, sabra ve arınmaya çağırmaktır.",
      en: "The 74th sura of the Qur'an; revealed in the earliest Meccan years, 56 verses. Its primary aim is to instil a sense of accountability, to affirm that worldly deeds will be requited in the Hereafter, and to summon the Prophet to proclamation, patience, and inner purification.",
    },
    event: {
      kind: 'asbab',
      tr: "İki rivayete göre: Peygamber bir ses duyup kimseyi görmeyince korkarak eve girip örtüsüne bürünmüş; yahut müşriklerin kendisine \"sihirbaz\" demelerinden duyduğu üzüntüyle örtüsüne bürünmüş, bu halde iken sure inmiştir. Makalede rivayetlerin sıhhati tartışılmaktadır.",
      en: "Two narrations are transmitted: the Prophet, having heard a voice without seeing anyone, retreated home in fear and wrapped himself in his cloak; or he withdrew and covered himself after the Meccan polytheists branded him a 'sorcerer', whereupon the sura was revealed. The article notes that the authenticity of these reports is debated.",
    },
  },
  5: {
    slug: 'fatiha-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın ilk suresidir; Mekkî olup 7 ayettir. \"Hamd Allah'a mahsustur\" diye başlar; Allah'ın rab, rahmân, rahîm, din gününün sahibi oluşu tanıtıldıktan sonra kul, \"Yalnız sana ibadet eder, yalnız senden yardım dileriz\" diyerek doğru yola iletilme duasında bulunur. Allah'ı tanıtma ve hidayet talebi ana temalarıdır.",
      en: "The opening sura of the Qur'an; Meccan, 7 verses. It begins 'Praise be to God', introduces God as Lord, the All-Merciful, the All-Compassionate, and Master of the Day of Judgement, and then voices the servant's covenant — 'You alone we worship, You alone we ask for help' — culminating in a prayer for guidance to the straight path. Its central themes are the recognition of God and the plea for guidance.",
    },
    event: {
      kind: 'general_context',
      tr: "Ansiklopediye göre Fâtiha, Mekke döneminin ilk yıllarında tamamı bir defada inmiştir; spesifik bir nüzul olayı nakledilmez. Beş vakit namazın farz kılınmasıyla birlikte, \"Fâtiha okunmadıkça hiçbir namaz sahih olmaz\" hadisi çerçevesinde namazın rüknü kılınmıştır.",
      en: "According to the encyclopedia, al-Fātiḥa was revealed in its entirety in a single instance during the early Meccan years; no specific occasion of revelation is narrated. With the prescription of the five daily prayers, the hadith 'no prayer is valid without al-Fātiḥa' made it an essential element of ritual prayer.",
    },
  },
  6: {
    slug: 'tebbet-suresi',
    author: 'Abdulhamit Birışık',
    tafsir: {
      tr: "Kur'ân'ın 111. suresidir; Mekkî ve 5 ayettir. Adını ilk kelimesi \"tebbet\" (kurudu, kahroldu) ifadesinden alır. Peygamber'e düşmanlık eden bir çift ve onların âkıbeti konu edilir; Allah'a ve Resulü'ne düşmanlığın sonucunun cehennem ateşi olduğu vurgulanır.",
      en: "The 111th sura of the Qur'an; Meccan, 5 verses. It takes its name from its opening word 'tabbat' (perished / ruined). It concerns a couple hostile to the Prophet and their ultimate fate, stressing that the outcome of enmity toward God and His Messenger is the fire of Hell.",
    },
    event: {
      kind: 'asbab',
      tr: "Hz. Peygamber, \"En yakın akrabanı uyar\" emri üzerine Safâ tepesine çıkıp Kureyş'i İslâm'a çağırınca amcası Ebû Leheb \"Kahrolası, bizi bunun için mi çağırdın?\" diyerek karşı çıkmış; bunun üzerine sure nâzil olmuştur. İlk üç ayet Ebû Leheb, son iki ayet eşi Ümmü Cemîl hakkındadır.",
      en: "When the Prophet, commanded to 'warn your nearest kin', ascended Mount Ṣafā and called the Quraysh to Islam, his uncle Abū Lahab retorted 'May you perish — is this why you gathered us?' The sura was revealed in response: its first three verses concern Abū Lahab, and the last two his wife Umm Jamīl.",
    },
  },
  7: {
    slug: 'tekvir-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 81. suresidir; Mekke'nin ilk yıllarında inmiş, 29 ayettir. Kıyametin kopmasıyla güneşin dürüleceği, yıldızların sönüp dökülüp döküleceği, dağların yürütüleceği gibi kozmik dönüşümleri anlatır. Kur'an'ın vahiy olduğu ve Hz. Peygamber'in güvenilir elçiliği vurgulanır.",
      en: "The 81st sura of the Qur'an; revealed in the early Meccan years, 29 verses. It depicts cosmic upheavals at the onset of the Hour — the folding up of the sun, the dimming and falling of the stars, the setting in motion of the mountains — and affirms that the Qur'an is revelation and that the Prophet is a trustworthy messenger.",
    },
    event: {
      kind: 'general_context',
      tr: "Makalede sureye özgü bir nüzul olayı aktarılmaz; son ayetlerdeki \"dileyen doğru yolu tutar\" ifadesine Ebû Cehil'in \"demek ki bize kalmış\" şeklinde itiraz ettiği ve bunun üzerine ilâhî iradeyi vurgulayan ayetlerin indirildiği rivayet edilir.",
      en: "The article does not cite a specific occasion for the sura as a whole; it reports that Abū Jahl objected to the closing verses ('whoever wills takes the straight path'), claiming the choice was entirely human, whereupon verses affirming the primacy of divine will were revealed.",
    },
  },
  8: {
    slug: 'ala-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 87. suresidir; Mekkî ve 19 ayettir. \"Yüce Rabbinin adını tesbih et\" emriyle başlar. Allah'ın yaratıp düzene koyduğu, takdir edip yol gösterdiği hatırlatılır; öğüt almanın gerekliliği, âhiretin dünyadan üstünlüğü ve önceki peygamberlere verilen sayfalara yapılan atıf sureyi ana hatlarıyla özetler.",
      en: "The 87th sura of the Qur'an; Meccan, 19 verses. It opens with the command 'Glorify the name of your Lord, the Most High'. It reminds that God creates and orders, decrees and guides; its main themes include the necessity of heeding reminders, the superiority of the Hereafter over this world, and a reference to the earlier scriptures revealed to previous prophets.",
    },
    event: {
      kind: 'general_context',
      tr: "Ansiklopediye göre A'lâ suresi, bir önceki Târık suresinin devamı niteliğindedir: Târık Hz. Peygamber'in Allah'ın izniyle zafere ulaşacağını müjdeler; A'lâ suresi ise \"Seni en kolay olana muvaffak kılacağız\" ifadesiyle bu müjdeyi pekiştirir. Somut bir nüzul olayı zikredilmez.",
      en: "According to the encyclopedia, Sūrat al-Aʿlā continues the theme of the preceding Sūrat al-Ṭāriq: while al-Ṭāriq heralds the Prophet's victory by God's leave, al-Aʿlā affirms that promise with 'We shall ease you toward the easiest path'. No specific occasion of revelation is recorded.",
    },
  },
  9: {
    slug: 'leyl-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 92. suresidir; Mekkî ve 21 ayettir. Geceye ve gündüze yeminle başlar; insanın çabalarının birbirinden farklı olduğunu, cömertlik ve takvâ ile cimrilik ve istiğnânın iki zıt sonuca götürdüğünü ortaya koyar. Sosyal adalet ve varlıklıların yoksullara karşı sorumluluğu belirgin temasıdır.",
      en: "The 92nd sura of the Qur'an; Meccan, 21 verses. Opening with oaths by the night and the day, it contrasts diverging human endeavours — showing how generosity and God-consciousness lead to one outcome, while avarice and self-sufficiency lead to its opposite. Social justice and the responsibility of the wealthy toward the poor are its salient themes.",
    },
    event: {
      kind: 'asbab',
      tr: "Tefsirlerde iki rivayet nakledilir: suresinin köleleri satın alıp azat eden Hz. Ebû Bekir ile malını esirgeyen Ümeyye b. Halef hakkında, yahut İbnü'd-Dahdâh adlı sahâbîye yapılan bir yardım vesilesiyle indiği rivayet edilir. Arka planda, varlıklı müşriklerin yoksullara karşı \"Allah'ın doyurmadığını biz mi doyuralım?\" tutumu vardır.",
      en: "Commentaries transmit two narrations: the sura was revealed either concerning Abū Bakr (who used to buy and free slaves) and Umayya b. Khalaf (who withheld his wealth), or regarding an act of charity by the Companion Ibn al-Daḥdāḥ. The backdrop is the stance of affluent Meccan polytheists who refused to feed the poor, saying 'Shall we feed those whom God has not fed?'",
    },
  },
  10: {
    slug: 'fecr-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 89. suresidir; Mekkî ve 30 ayettir. Adını ilk ayetteki \"fecr\" (şafak) kelimesinden alır. Zamana ve çeşitli vakitlere yeminlerle başlayıp Âd, Semûd ve Firavun gibi azgın toplulukların helâkini hatırlatır; iman edip sâlih amel işleyenleri ise \"mutmainne nefs\" olarak cennete çağıran ayetlerle biter.",
      en: "The 89th sura of the Qur'an; Meccan, 30 verses. Named after 'al-fajr' (the dawn) in its first verse, it opens with oaths by time and sacred hours, recalls the destruction of tyrannical peoples such as ʿĀd, Thamūd and Pharaoh, and closes by calling the believers — addressed as 'the tranquil soul' (al-nafs al-muṭma'inna) — into Paradise.",
    },
    event: {
      kind: 'general_context',
      tr: "Ansiklopediye göre Fecr suresi, Mekke döneminin ilk yıllarında, Müslümanlara yönelik baskıların başladığı ortamda Leyl suresinin ardından indirilmiştir; muhtemelen ilk Habeşistan hicretinden önceye aittir. Spesifik bir nüzul olayı nakledilmez.",
      en: "According to the encyclopedia, Sūrat al-Fajr was revealed in the earliest Meccan years, during the onset of persecution against Muslims, following Sūrat al-Layl — most likely prior to the first migration to Abyssinia. No specific occasion of revelation is reported.",
    },
  },
  11: {
    slug: 'duha-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 93. suresidir; Mekkî ve 11 ayettir. Adını ilk ayetteki \"duhâ\" (kuşluk vakti) kelimesinden alır. Ana teması, Hz. Peygamber'in Allah tarafından terkedilmediğinin müjdelenmesi; geçmişteki ilâhî nimetlerin hatırlatılması ve gelecekte daha büyük lütufların verileceğinin bildirilmesidir.",
      en: "The 93rd sura of the Qur'an; Meccan, 11 verses. Named after 'al-ḍuḥā' (the forenoon) in its opening verse. Its central theme is the reassurance that God has not forsaken the Prophet — recalling divine favours already bestowed and promising even greater gifts to come.",
    },
    event: {
      kind: 'asbab',
      tr: "Bir süre vahyin kesilmesi üzerine Mekke müşrikleri \"Muhammed'in Rabbi onu terketti\" diye dedikodu yaymış; Peygamber'in bu söylentilerden duyduğu üzüntü üzerine sure indirilmiştir. Vahyin kesilme süresi hakkında farklı rivayetler vardır.",
      en: "When revelation paused for a time, the Meccan polytheists taunted the Prophet, saying 'Muhammad's Lord has abandoned him.' The sura was revealed in response to the Prophet's distress at these rumours; the exact length of the interruption is reported variously in the sources.",
    },
  },
  12: {
    slug: 'insirah-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 94. suresidir; Mekkî ve 8 ayettir. Duhâ'nın hemen ardından inmiştir. Hz. Peygamber'e \"Biz senin göğsünü açıp genişletmedik mi?\" diye hitap ederek tebliğ görevindeki yükü hafifletir; \"her zorlukla beraber bir kolaylık vardır\" mesajını iki kez tekrarlayarak müminlere teselli sunar.",
      en: "The 94th sura of the Qur'an; Meccan, 8 verses. Revealed immediately after al-Ḍuḥā. Addressing the Prophet with 'Have We not expanded your breast?' it lightens the burden of his mission, and — repeating twice that 'with every hardship comes ease' — offers consolation to the believers.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, Hz. Peygamber'in tebliğin ilk yıllarında yüklendiği ağır sorumluluğu hafifletmek ve yoksullukları sebebiyle müşrikler tarafından aşağılanan Müslümanları teselli etmek üzere indirilmiştir.",
      en: "The sura was revealed to relieve the weight of the mission the Prophet bore in the early years of his calling, and to console the Muslims who were being belittled by the polytheists on account of their poverty.",
    },
  },
  13: {
    slug: 'asr-suresi',
    author: 'Muhammed Eroğlu',
    tafsir: {
      tr: "Kur'ân'ın 103. suresidir; Mekkî ve yalnızca 3 ayettir. Kısalığına rağmen Kur'an öğretisinin özü sayılır. Zamana yeminle başlar ve insanın hüsrandan kurtulması için dört esası — iman, sâlih amel, hakkı tavsiye ve sabrı tavsiye — birarada zikreder.",
      en: "The 103rd sura of the Qur'an; Meccan, only 3 verses. Despite its brevity it is regarded as a distillation of the Qur'anic message. Opening with an oath by 'al-ʿaṣr' (time), it names the four foundations by which humans escape loss: faith, righteous deeds, enjoining truth, and enjoining patience.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü bir nüzul olayı nakletmez; yalnızca sahâbeden iki kişinin karşılaştıklarında ayrılmadan önce bu sureyi birbirlerine okumayı âdet edindiklerine dair rivayete yer verir.",
      en: "The article reports no specific occasion of revelation for the sura; it only mentions a narration that two Companions, upon meeting, would customarily recite the sura to each other before parting.",
    },
  },
  14: {
    slug: 'adiyat-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 100. suresidir; Mekkî olarak kabul edilir ve 11 ayettir. İlk beş ayette nefes nefese koşan atlara yeminler edilerek bir savaş sahnesi resmedilir; ardından insanın nankör ve dünyaya düşkün tabiatı hatırlatılır ve kıyamet gününde kalplerin içindekinin ortaya çıkarılacağı bildirilir.",
      en: "The 100th sura of the Qur'an; generally held to be Meccan, 11 verses. Its opening five verses depict a battle scene through oaths by galloping horses, then turn to expose the ingratitude and worldly attachment of humankind, and close by announcing that on the Day of Judgement the contents of hearts will be laid bare.",
    },
    event: {
      kind: 'general_context',
      tr: "Makaleye göre sure Mekke döneminde Asr suresinden sonra nâzil olmuştur; Medenî olduğuna dair görüşler bulunsa da üslup ve muhteva Mekkî sureler özelliği taşır. Belirli bir nüzul olayı zikredilmez.",
      en: "According to the article, the sura was revealed in the Meccan period, after Sūrat al-ʿAṣr; although some hold it to be Medinan, its style and content bear the hallmarks of Meccan suras. No specific occasion of revelation is cited.",
    },
  },
  15: {
    slug: 'kevser-suresi',
    author: 'İlyas Üzüm',
    tafsir: {
      tr: "Kur'ân'ın 108. suresidir; Mekkî ve Kur'an'ın en kısası olup yalnızca 3 ayettir. Hz. Peygamber'e \"kevser\" adıyla verilen büyük nimet müjdelenir ve bunun şükrü olarak namaz kılıp kurban kesmesi emredilir; son ayette kendisine düşmanlık gösterenin asıl \"nesli kesik\" (ebter) olduğu bildirilir.",
      en: "The 108th sura of the Qur'an; Meccan, the shortest in the Qur'an with only 3 verses. It proclaims the great gift of 'al-kawthar' bestowed upon the Prophet and commands him, in gratitude, to pray and offer sacrifice; the closing verse declares that it is his adversary who is in truth 'cut off' (abtar) from posterity.",
    },
    event: {
      kind: 'asbab',
      tr: "Mekkeli müşriklerin — rivayete göre Âs b. Vâil ve benzerlerinin — Hz. Peygamber'i erkek evlâdının yaşamaması sebebiyle \"nesli kesik\" diye nitelemeleri üzerine sure inmiş; böylece gerçek \"ebter\"in ona düşmanlık edenler olduğu bildirilmiştir.",
      en: "The sura was revealed in response to the Meccan polytheists — notably al-ʿĀṣ b. Wāʾil in the narrations — who, because the Prophet's male children had not survived, dubbed him 'cut off' (abtar); it declares that the truly severed is the one who bears him enmity.",
    },
  },
  16: {
    slug: 'tekasur-suresi',
    author: 'İdris Şengül',
    tafsir: {
      tr: "Kur'ân'ın 102. suresidir; Mekkî ve 8 ayettir. Dünya malı ve evlâtla övünmenin insanı oyalayıp mezara kadar sürüklediği hatırlatılır; kıyamet günü nimetlerden tek tek hesaba çekileceği haber verilir. Dünyanın geçiciliği ve âhiret sorumluluğu ana temadır.",
      en: "The 102nd sura of the Qur'an; Meccan, 8 verses. It warns that rivalry in wealth and progeny distracts people until they reach the grave, and announces that on the Day of Judgement one will be questioned about every blessing. Its core theme is the transience of this world and accountability in the Hereafter.",
    },
    event: {
      kind: 'asbab',
      tr: "Âlimlerin çoğunluğuna göre sure, Kureyş'in Abdümenâf ve Sehm kollarının mensuplarının atalarıyla ve mallarıyla birbirlerine karşı övünmeleri üzerine inmiştir. Medine'de ensar kabileleri arasındaki rekabete bağlayan görüşler de vardır; fakat üslup ve muhataplar Mekkî bir nüzule işaret eder.",
      en: "According to the majority of scholars, the sura was revealed when the Meccan clans of ʿAbd Manāf and Sahm boasted against one another over their ancestors and wealth. Some traced it to rivalry among the Medinan Anṣār, but its style and addressees point to a Meccan context.",
    },
  },
  17: {
    slug: 'maun-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 107. suresidir; Mekke döneminin ilk yıllarında inmiş, 7 ayettir. \"Dini yalanlayanı gördün mü?\" sorusuyla başlar; yetime kötü davranmak, yoksulu doyurmaya önayak olmamak, namazı gafilce kılmak ve riya ile en küçük yardımı dahi esirgemek gibi davranışları dinden yoksunluğun alâmetleri olarak anar.",
      en: "The 107th sura of the Qur'an; revealed in the earliest Meccan years, 7 verses. Opening with 'Have you seen the one who denies the religion?', it lists the marks of lacking true religion: mistreating the orphan, failing to urge the feeding of the poor, praying heedlessly, showing off, and withholding even the smallest help (al-māʿūn).",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre ilk ayet, âhireti inkâr eden Mekke müşriki Âs b. Vâil hakkında nâzil olmuştur. Sure genel olarak, din konusunda iki yüzlü davranan kişilerin toplumsal ahlâksızlıklarını ifşa eder.",
      en: "Narrations relate that the opening verse was revealed concerning al-ʿĀṣ b. Wāʾil, a Meccan polytheist who denied the Hereafter. More broadly, the sura exposes the social vices of those who are insincere in religion.",
    },
  },
  18: {
    slug: 'kafirun-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 109. suresidir; Mekkî ve 6 ayettir. Tevhidi net biçimde ilan eder: \"Sizin dininiz size, benim dinim bana.\" İbadet ilkesinin paylaşılamayacağını ve din özgürlüğünün sınırını belirler.",
      en: "The 109th sura of the Qur'an; Meccan, 6 verses. It declares pure monotheism with unambiguous finality: 'Your religion is yours, and mine is mine.' It marks the inviolability of worship and the boundary of religious freedom.",
    },
    event: {
      kind: 'asbab',
      tr: "Kureyş ileri gelenleri Hz. Peygamber'e gelerek, birer yıllık dönüşümlerle kendi ilâhlarına ve O'nun Rabbine dönüşümlü olarak ibadet etmeyi teklif ettiklerinde, Peygamber \"Allah'a şirk koşmaktan O'na sığınırım\" diyerek bu teklifi reddetmiş; bunun üzerine sure indirilmiştir.",
      en: "When leaders of the Quraysh proposed to the Prophet a rotation in which each party would worship the other's deities for alternating periods, he refused, saying 'I seek refuge in God from associating partners with Him'; the sura was revealed in the wake of this rejection.",
    },
  },
  19: {
    slug: 'fil-suresi',
    author: 'Mustafa Çağrıcı',
    tafsir: {
      tr: "Kur'ân'ın 105. suresidir; Mekkî ve 5 ayettir. Hz. Peygamber'in doğduğu yıl ya da hemen öncesinde yaşanan \"Fil Vak'ası\"nı anlatır: Kâbe'yi yıkmak için Mekke üzerine yürüyen Ebrehe ordusunun, Allah'ın gönderdiği kuşların attığı taşlarla perişan edilmesi kıssası anıtlaştırılır.",
      en: "The 105th sura of the Qur'an; Meccan, 5 verses. It commemorates the 'Year of the Elephant', which occurred in or just before the year of the Prophet's birth: the army of Abraha, marching on Mecca to destroy the Kaʿba, was routed by stones hurled by birds sent by God.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, yaşayan tanıkların hâlâ bulunduğu Fil Vak'ası'nı hatırlatır; Mekkeli müşriklerin kendi tarihlerinde şahit oldukları bu ilâhî korumayı delil olarak gösterip Kâbe'nin ve Peygamber'in Rabbinin kudretine dikkat çeker.",
      en: "The sura invokes the Year of the Elephant, an event whose witnesses were still alive; it holds up this divine protection — directly attested in the Meccans' own history — as evidence of the power of the Lord of the Kaʿba and of the Prophet.",
    },
  },
  20: {
    slug: 'felak-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 113. suresidir; 5 ayettir. Nâs suresiyle birlikte \"muavvizeteyn\" olarak anılır. Yaratılanların şerrinden, karanlığın bastırdığı gecenin şerrinden, düğümlere üfleyenlerin ve hased edenlerin şerrinden \"sabahın Rabbi\"ne sığınma duasını öğretir. Mekkî/Medenî oluşu tartışılmış olsa da üslup Mekkî surelere yakındır.",
      en: "The 113th sura of the Qur'an; 5 verses. Together with Sūrat al-Nās it is known as 'al-muʿawwidhatān'. It teaches the believer to seek refuge in 'the Lord of the daybreak' from the evil of all that He has created, from the evil of descending night, from those who blow on knots, and from the envier. Its Meccan or Medinan origin is debated, though its style resembles the Meccan suras.",
    },
    event: {
      kind: 'general_context',
      tr: "Medine'de bir Yahudi tarafından Hz. Peygamber'e büyü yapılması üzerine indiğine dair rivayet zikredilir. Ancak makale yazarı bu rivayetin metodolojik açıdan sorunlu olduğunu ve sahih delillerle desteklenmediğini belirtir; bu yüzden sure için kesin bir sebeb-i nüzul olayı bağlayıcı kabul edilmez.",
      en: "It is narrated that the sura was revealed after a Jew in Medina cast a spell on the Prophet; however, the author of the article considers this report methodologically problematic and not supported by reliable evidence, so no specific occasion of revelation can be affirmed with certainty.",
    },
  },
  21: {
    slug: 'nas-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 114. ve son suresidir; 6 ayettir. Muhteva ve üslubu Mekkî karakter taşır. Felak ile birlikte \"muavvizeteyn\" olarak anılır; insanlara vesvese veren cin ve insan şeytanlarının şerrinden \"insanların Rabbi, insanların melîki, insanların ilâhı\" olan Allah'a sığınmayı öğretir.",
      en: "The 114th and final sura of the Qur'an; 6 verses. Its content and style are Meccan in character. Paired with al-Falaq as the 'muʿawwidhatān', it teaches taking refuge with God — 'Lord of humankind, King of humankind, God of humankind' — from the evil of the insidious whisperer among the jinn and among humans.",
    },
    event: {
      kind: 'general_context',
      tr: "Felak suresiyle birlikte indiği hususunda ittifak vardır; ancak Mekke'de mi Medine'de mi indirildiği konusunda farklı görüşler bulunur. Sure için spesifik bir sebeb-i nüzul olayı bağlayıcı biçimde sabit değildir; muhteva Mekkî bir nüzulü güçlendirir.",
      en: "There is agreement that it was revealed together with Sūrat al-Falaq, but scholars differ over whether the pair is Meccan or Medinan. No binding specific occasion of revelation has been established, though the content favours a Meccan setting.",
    },
  },
  22: {
    slug: 'ihlas-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 112. suresidir; 4 ayettir. Müfessirlerin çoğunluğuna göre Mekkî, bazılarına göre Medenîdir. Allah'ın birliğini, eşsizliğini ve hiçbir şeyin O'na denk olmadığını veciz biçimde ifade ederek tevhidi en özlü şekilde beyan eder; bu sebeple \"Kur'an'ın üçte biri\" olarak nitelendirilmiştir.",
      en: "The 112th sura of the Qur'an; 4 verses. Held Meccan by most commentators, Medinan by some. It declares God's oneness, absolute uniqueness, and that nothing is comparable to Him, giving the most concise formulation of tawḥīd — for which reason it is described as equivalent to 'a third of the Qur'an'.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayetlere göre sure; müşriklerin \"Rabbinin nesebini söyle\" sorusuna, Yahudilerin ulûhiyet hakkındaki sorularına ve Necran Hristiyanlarıyla girilen tartışmalara cevap olarak inmiş; Allah hakkındaki yanlış tasavvurları kökünden kaldırmayı amaçlamıştır.",
      en: "According to the narrations, the sura was revealed in response to the polytheists' challenge ('Describe the lineage of your Lord'), questions posed by Jewish interlocutors about the divine nature, and debates with the Christians of Najrān — aiming to uproot every false conception of God.",
    },
  },
  23: {
    slug: 'necm-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 53. suresidir; Mekkî olup 62 ayettir. İhlâs'tan sonra inmiştir. İslâm akaidinin üç temel ilkesi olan nübüvvet, tevhid ve âhiret esaslarını işler; ayrıca nüzul sırasına göre içinde secde ayeti bulunan ilk suredir.",
      en: "The 53rd sura of the Qur'an; Meccan, 62 verses. Revealed after al-Ikhlāṣ. It treats the three cardinal tenets of Islamic creed — prophethood, divine unity, and the Hereafter — and is the first sura, in order of revelation, to contain a verse of prostration (sajda).",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü bağlayıcı bir sebeb-i nüzul olayı aktarmaz; Mekke döneminde indiğini kaydeder. Hz. Peygamber sureyi okurken secde ayetinde kendisi secde etmiş, yanındakiler de secde etmiştir.",
      en: "The article transmits no binding specific occasion of revelation for the sura as a whole, noting only its Meccan origin. When the Prophet recited the sura, he prostrated at its verse of prostration, and those present joined him.",
    },
  },
  24: {
    slug: 'abese-suresi',
    author: 'Abdullah Aydemir',
    tafsir: {
      tr: "Kur'ân'ın 80. suresidir; Mekkî ve 42 ayettir. Peygamber'in uyarılması ile tebliğin, içten bir ilgi gösteren kalplere öncelik vermesi gerektiği vurgulanır; ardından Allah'ın kudreti, insanın yaratılışı ve âhiret sahneleri işlenir.",
      en: "The 80th sura of the Qur'an; Meccan, 42 verses. It counsels the Prophet that outreach must prioritise hearts that show earnest interest; it then turns to God's power, the creation of humankind, and scenes from the Day of Resurrection.",
    },
    event: {
      kind: 'asbab',
      tr: "Hz. Peygamber Kureyş ileri gelenlerinden Utbe b. Rebîa ve arkadaşlarıyla görüşürken âmâ sahâbî İbn Ümmü Mektûm'un gelip kendisine ayet okumasını istemesi karşısında yüzünü ekşitmesi üzerine sure nâzil olmuş; bundan sonra Peygamber onu \"Rabbimin beni kendisi hakkında uyardığı kimse\" diye anarak her görüşünde yakın ilgi göstermiştir.",
      en: "The sura was revealed after the Prophet, in the midst of a meeting with Meccan notables such as ʿUtba b. Rabīʿa, frowned when the blind Companion Ibn Umm Maktūm approached asking him to recite a verse. Thereafter the Prophet referred to him as 'the one concerning whom my Lord admonished me' and received him warmly at every encounter.",
    },
  },
  25: {
    slug: 'kadr-suresi',
    author: 'M. Sait Özervarlı',
    tafsir: {
      tr: "Kur'ân'ın 97. suresidir; çoğunluğa göre Mekkî, 5 ayettir. Kur'an'ın \"Kadir gecesi\" denilen bereketli bir gecede indirildiğini; bu gecenin bin aydan daha hayırlı olduğunu ve o gece meleklerle Rûh'un Rablerinin izniyle her işe dair indiğini bildirir.",
      en: "The 97th sura of the Qur'an; Meccan according to the majority, 5 verses. It announces that the Qur'an was sent down on the blessed 'Night of Power' (laylat al-qadr), that this night is better than a thousand months, and that on it the angels and the Spirit descend by their Lord's leave with every decreed matter.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü bağlayıcı bir sebeb-i nüzul olayı zikretmez. Sure, Kur'an'ın inişinin başladığı gecenin ve Kadir gecesinin faziletinin duyurulması amacıyla nâzil olmuştur.",
      en: "The article cites no binding specific occasion of revelation. The sura was revealed to proclaim the night on which the descent of the Qur'an began and to make known the merit of the Night of Power.",
    },
  },
  26: {
    slug: 'sems-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 91. suresidir; Mekkî ve 15 ayettir. İki bölümden oluşur: önce güneş, ay, gece ve gündüz gibi kozmik varlıklara yemin edilerek insan nefsinin hem iyiye hem kötüye yatkın kılındığı hatırlatılır; ardından azgınlığı yüzünden helâk edilen Semûd kavmi ibret olarak anlatılır.",
      en: "The 91st sura of the Qur'an; Meccan, 15 verses. It unfolds in two parts: oaths by cosmic phenomena — the sun, the moon, night and day — introduce the reminder that the human soul has been given the capacity for both good and evil; then the fate of the people of Thamūd, destroyed for their transgression, is recounted as a warning.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü spesifik bir nüzul olayı aktarmaz; nübüvvetin 5. yılı civarında indiği tahmin edilmektedir.",
      en: "The article transmits no specific occasion of revelation for the sura; it is estimated to have been revealed around the fifth year of prophethood.",
    },
  },
  27: {
    slug: 'buruc-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 85. suresidir; Mekkî ve 22 ayettir. Zulme uğrayan müminleri teselli eder, zalim yöneticilere karşı Allah'ın kudretini öne çıkarır ve inkârcıları uyarır. Ashâbü'l-uhdûd — imanları yüzünden ateş dolu hendeklere atılan mü'minler — kıssasıyla zulüm ve sabır arasındaki çizgiyi belirgin kılar.",
      en: "The 85th sura of the Qur'an; Meccan, 22 verses. It consoles persecuted believers, foregrounds God's power over tyrannical rulers, and warns the rejectors. Through the story of the 'aṣḥāb al-ukhdūd' — believers cast into trenches of fire for their faith — it sharpens the contrast between oppression and patient perseverance.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, Mekke'de müşriklerin ilk Müslümanlara işkence etmeye başladığı dönemde, \"hiçbir suç işlemedikleri halde yalnızca Allah'a inandıkları için\" eziyet gören müminlere cesaret vermek üzere inmiştir.",
      en: "The sura was revealed in the Meccan period when the polytheists began torturing the first Muslims, to fortify believers who — 'having committed no crime, but only for believing in God' — were subjected to persecution.",
    },
  },
  28: {
    slug: 'tin-suresi',
    author: 'Abdulhamit Birışık',
    tafsir: {
      tr: "Kur'ân'ın 95. suresidir; Mekkî ve 8 ayettir. İncir, zeytin, Sînâ dağı ve \"bu emîn belde\" (Mekke) üzerine edilen yeminlerin ardından, insanın \"ahsen-i takvîm\" üzere yaratıldığı; iman edip sâlih amel işlemedikçe \"aşağıların aşağısı\"na düşürüleceği bildirilir.",
      en: "The 95th sura of the Qur'an; Meccan, 8 verses. After oaths by the fig and the olive, Mount Sinai, and 'this secure land' (Mecca), it declares that humankind has been shaped in 'the fairest stature' (aḥsan taqwīm) yet will fall to 'the lowest of the low' unless believing and doing righteous deeds.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü nüzul sebebine dair bir rivayete rastlanılmadığını kaydeder; müfessirler surenin Mekke müşriklerinin inkârına karşı delilleri ortaya koymayı amaçladığı kanaatindedir.",
      en: "The article notes that no narration concerning a specific occasion of revelation has been found; commentators hold that the sura was revealed to marshal arguments against the denial of the Meccan polytheists.",
    },
  },
  29: {
    slug: 'kureys-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 106. suresidir; Mekkî ve 4 ayettir. Fîl suresinin devamı niteliğindedir. Kureyş kabilesinin yaz ve kış yolculuklarına alıştırılması, doyurulup korkudan emin kılınması gibi nimetleri sayarak onları \"bu Beyt'in Rabbine\" ibadete çağırır.",
      en: "The 106th sura of the Qur'an; Meccan, 4 verses. It continues the theme of Sūrat al-Fīl. Enumerating the blessings given to the Quraysh — their customary winter and summer caravans, being fed and made secure from fear — it calls them to worship 'the Lord of this House'.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz; sure, Fîl Vak'ası ile sağlanan ilâhî korumanın ardından Kureyş'e verilen nimetleri hatırlatıp onları şükre davet etmek üzere inmiştir.",
      en: "The article reports no specific occasion of revelation; the sura was revealed to remind the Quraysh of the favours bestowed upon them in the wake of the divine protection at the Year of the Elephant, and to summon them to gratitude.",
    },
  },
  30: {
    slug: 'karia-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 101. suresidir; Mekkî ve 11 ayettir. \"el-Kāria\" (çarpan, ansızın koparan felâket) kelimesiyle kıyametin dehşetini tasvir eder; insanların tartıları ağır gelenlerin razı olunmuş bir hayata, tartıları hafif gelenlerin ise \"kızgın bir ateş\" olan haviye'ye götürüleceğini bildirir.",
      en: "The 101st sura of the Qur'an; Meccan, 11 verses. Through the word 'al-qāriʿa' — the calamity that strikes with sudden force — it depicts the terror of the Day of Judgement, announcing that those whose scales are heavy will attain a life of acceptance, while those whose scales are light will be consigned to a 'hāwiya' — a blazing fire.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü bir sebeb-i nüzul bilgisine yer vermez. Kureyş suresinden sonra inmiş ve Âdiyât suresinin âhiret odaklı temasını sürdürmüştür.",
      en: "The article provides no information concerning a specific occasion of revelation. The sura was revealed after Sūrat Quraysh and continues the eschatological theme of Sūrat al-ʿĀdiyāt.",
    },
  },
  31: {
    slug: 'kiyame-suresi',
    author: 'İlyas Üzüm',
    tafsir: {
      tr: "Kur'ân'ın 75. suresidir; Mekkî ve 40 ayettir. Temel konusu ölümden sonra diriliştir. Sure dört ana bölümde işlenir: çürümüş kemiklerin yeniden toplanması, vahyin ezberlenip korunması, dünya hayatına kapılanların tutumu ve azaba uğrayacakların yanlış tavrı.",
      en: "The 75th sura of the Qur'an; Meccan, 40 verses. Its central theme is the resurrection after death. It unfolds in four parts: the reassembling of decayed bones, the preservation and memorisation of revelation, the attitude of those attached to this world, and the stance of those who will face punishment.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure'nin ilk bölümleri, müşriklerden Adî b. Rebîa'nın Hz. Peygamber'e gelip kıyametten bahsetmesini istemesi ve çürümüş kemiklerin yeniden toplanmasının imkânsız olduğunu iddia etmesi üzerine indirilmiştir.",
      en: "The opening portions of the sura were revealed after the polytheist ʿAdī b. Rabīʿa came to the Prophet asking him to speak about the Resurrection and claimed that the reassembly of decayed bones was impossible.",
    },
  },
  32: {
    slug: 'humeze-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 104. suresidir; Mekkî ve 9 ayettir. İnsanları arkadan çekiştirip yüzlerine karşı aşağılayan, servet biriktirip saymakla bitiremeyen kişilerin ahlâkî sapmalarını teşhir eder ve onları bekleyen cehennem azabını (huṭama) bildirir.",
      en: "The 104th sura of the Qur'an; Meccan, 9 verses. It exposes the moral corruption of those who slander behind backs and mock to the face, who hoard wealth and endlessly count it, announcing the fire of Hell (al-ḥuṭama) that awaits them.",
    },
    event: {
      kind: 'asbab',
      tr: "Nübüvvetin 3. veya 4. yılında, Mekke müşriklerinin Hz. Peygamber ile Müslümanların ileri gelenlerini kötüleyip toplum önünde küçük düşürmeye çalıştıkları ortamda, bu davranışlara karşılık olarak indirilmiştir.",
      en: "Revealed in the third or fourth year of prophethood, in the context of Meccan polytheists slandering the Prophet and leading Muslims and attempting to humiliate them publicly, the sura came as a response to that behaviour.",
    },
  },
  33: {
    slug: 'murselat-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 77. suresidir; Mekkî ve 50 ayettir, muhtemelen nübüvvetin 4. yılında inmiştir. Ard arda yeminlerle başlar; kıyametin kesin olarak gerçekleşeceğini ve inkâr edenlerin ebedî hüsrana uğrayacağını tekrar tekrar bildirerek insanda sorumluluk duygusunu güçlendirmeyi hedefler.",
      en: "The 77th sura of the Qur'an; Meccan, 50 verses, likely revealed around the fourth year of prophethood. Opening with a sequence of oaths, it repeatedly affirms the certainty of the Day of Judgement and the everlasting loss of the deniers, seeking to strengthen the sense of responsibility in the listener.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü belirli bir sebeb-i nüzul tespit edilemediğini ifade eder; nübüvvetin ilk yıllarında ilâhî vahye gösterilen inatçı direniş ortamında indirildiği değerlendirilmektedir.",
      en: "The article states that no specific occasion of revelation has been established for the sura; it is assessed as revealed in the context of stubborn resistance to the divine revelation during the early years of prophethood.",
    },
  },
  34: {
    slug: 'kaf-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 50. suresidir; Mekkî ve 45 ayettir. Mürselât'tan sonra inmiştir. Ölümden sonra dirilişi merkeze alarak bunu yalanlayanları uyarır, iman edenleri müjdeler ve peygamberlerini yalanlayan eski kavimleri ibret olarak hatırlatır.",
      en: "The 50th sura of the Qur'an; Meccan, 45 verses. Revealed after al-Mursalāt. Centring on the resurrection, it warns those who deny it, brings glad tidings to the believers, and recalls the earlier peoples who rejected their prophets as cautionary examples.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü bağlayıcı bir sebeb-i nüzul olayı zikretmez; surenin Mekke döneminde bir defada indirildiğini belirtmekle yetinir.",
      en: "The article does not cite a binding specific occasion of revelation for the sura; it notes only that the sura was revealed as a single whole in the Meccan period.",
    },
  },
  35: {
    slug: 'beled-suresi',
    author: 'Muhammed Eroğlu',
    tafsir: {
      tr: "Kur'ân'ın 90. suresidir; Mekkî ve 20 ayettir. Adını ilk ayetlerinde geçen \"el-beled\" (şehir) kelimesinden alır. İnsanın zorluklar içinde dünyaya geldiğini, önünde hayır ve şer yollarının bulunduğunu belirtir; köleyi hürriyete kavuşturmak, yoksulu ve yetimi doyurmak gibi \"sarp yokuşa tırmanmak\" olarak tanımlanan fiilleri över.",
      en: "The 90th sura of the Qur'an; Meccan, 20 verses. Named after 'al-balad' (the city) in its opening verses. It declares that the human being enters the world through hardship and faces two paths of good and evil; and praises the acts defined as 'climbing the steep ascent' — freeing a slave, feeding the poor and the orphan.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü doğrudan bir sebeb-i nüzul olayı zikretmez; sure Mekke'ye yapılan yemin ve Peygamber'in karşılaştığı güçlüklere işaret eden bir çerçevede indirilmiştir.",
      en: "The article transmits no direct specific occasion of revelation for the sura; it was revealed within a frame of oaths by Mecca and allusions to the hardships the Prophet was enduring.",
    },
  },
  36: {
    slug: 'tarik-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 86. suresidir; Mekke döneminin ilk yarısında inmiş, 17 ayettir. Yeminlerle başlar ve \"hiçbir insanın üzerinde görevli koruyucu melek bulunmadan olmadığını\" bildirir; her mükellefin Allah'ın huzurunda hesap vereceği inancını vurgular.",
      en: "The 86th sura of the Qur'an; revealed in the first half of the Meccan period, 17 verses. Opening with oaths, it announces that 'no human is without a guardian watcher appointed over him' and affirms that every responsible being will give account before God.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre Hz. Peygamber, amcası Ebû Tâlib'in yanındayken gökyüzünde bir yıldız kayması görmüş ve bunun \"Allah'ın dikkat çekici işaretlerinden biri olan salıverilmiş bir yıldız\" olduğunu söylemiş; bu olay üzerine sure indirilmiştir.",
      en: "According to the narration, while the Prophet was with his uncle Abū Ṭālib a shooting star was seen in the sky; he described it as 'one of God's striking signs — a projectile star dispatched', and the sura was revealed in the wake of that event.",
    },
  },
  37: {
    slug: 'kamer-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 54. suresidir; Mekkî ve 55 ayettir. Târık'tan sonra inmiştir; \"İkterabet\" ve \"İkterabetü's-sâa\" isimleriyle de anılır. Kıyamet sahnelerini etkileyici bir üslupla tasvir eder, müminlere güven verirken inkârcıları uyarır.",
      en: "The 54th sura of the Qur'an; Meccan, 55 verses. Revealed after al-Ṭāriq; also called 'Iqtarabat' or 'Iqtarabat al-sāʿa'. It portrays the scenes of the Last Day with commanding imagery — reassuring the believers while warning the rejectors.",
    },
    event: {
      kind: 'asbab',
      tr: "Mekkeli müşriklerin Hz. Peygamber'den bir mûcize istemeleri üzerine ayın yarılmasıyla ilgili ilk ayetler nâzil olmuştur. 45. ayet ise surenin inmesinden kısa süre sonra Bedir Gazvesi'nde Kureyş'in bozguna uğrayacağını müjdelemektedir.",
      en: "The opening verses concerning the splitting of the moon were revealed when the Meccan polytheists demanded a miracle from the Prophet. Verse 45 foretold the defeat of Quraysh at the Battle of Badr, which took place shortly after the sura's revelation.",
    },
  },
  38: {
    slug: 'sad-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 38. suresidir; Mekkî ve 88 ayettir. İslâm inancının üç temeli olan tevhid, nübüvvet ve âhiret etrafında hidayete çağırır; Hz. Dâvûd, oğlu Süleyman ve diğer peygamberlerin kıssalarını anlatarak ibret ve teselli sunar.",
      en: "The 38th sura of the Qur'an; Meccan, 88 verses. It calls to guidance around the three foundations of Islamic belief — divine unity, prophethood, and the Hereafter — and relates the accounts of David, his son Solomon, and other prophets as both admonition and consolation.",
    },
    event: {
      kind: 'asbab',
      tr: "Surenin ilk yedi-sekiz ayeti, Ebû Cehil önderliğindeki Mekke ileri gelenlerinin Ebû Tâlib'e müracaatla Hz. Peygamber'i tevhid tebliğinden vazgeçirmeye çalıştıkları olay üzerine inmiştir. Müşriklerin \"bunca ilâhın tek bir ilâha indirgenmesini\" yadırgadığı bir dönemde indirilmiştir.",
      en: "The first seven or eight verses were revealed concerning the episode in which Meccan notables led by Abū Jahl approached Abū Ṭālib to press the Prophet into abandoning his proclamation of divine unity. The sura came down at a time when the polytheists found it astonishing that 'so many gods' should be reduced to a single God.",
    },
  },
  39: {
    slug: 'araf-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 7. suresidir; Mekkî ve 206 ayettir — Mekke döneminde inen en uzun suredir. Âhirete iman, vahiy ve nübüvvet meselesini işler; âhireti inkârın asıl sebebi olarak kibir ve günaha düşkünlüğü ifşa eder ve \"a'râf\" olarak bilinen cennet-cehennem arası bölgeden bahseder.",
      en: "The 7th sura of the Qur'an; Meccan, 206 verses — the longest sura revealed in Mecca. It treats faith in the Hereafter, the status of revelation and prophethood, exposes pride and attachment to sin as the root of denial of the afterlife, and describes the 'aʿrāf' — the heights between Paradise and Hell.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü spesifik bir sebeb-i nüzul olayı aktarmaz; hicretten önce, muhtemelen En'âm suresinin ardından indirildiğini kaydeder.",
      en: "The article transmits no specific occasion of revelation for the sura, noting only that it was revealed before the Hijra, most likely after Sūrat al-Anʿām.",
    },
  },
  40: {
    slug: 'cin-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 72. suresidir; Mekkî ve 28 ayettir. Allah'ın birliği ve yüceliği, cinler hakkındaki yanlış inançların çürütülmesi ve Kur'an vahyinin cinler üzerindeki etkisi ana konularıdır. Cinlerin de mümini ve kâfiri, iyisi ve kötüsü bulunduğu; iman edenler ile inkâr edenlerin âhiret âkıbetinin farklı olacağı bildirilir.",
      en: "The 72nd sura of the Qur'an; Meccan, 28 verses. Its main themes are the oneness and majesty of God, the refutation of false beliefs about the jinn, and the impact of the Qur'anic revelation upon them. It affirms that among the jinn there are believers and disbelievers, good and evil, and that the hereafter of each will differ according to faith.",
    },
    event: {
      kind: 'asbab',
      tr: "Hicretten üç yıl önce Tâif dönüşünde, Hz. Peygamber'in sabah namazında okuduğu Kur'an'ı dinleyen bir grup cinin, semadan haberlerin kesilmesinin ne sebeple olduğunu araştırırken Kur'an'ın belâğatına kapılıp iman etmeleri üzerine sure indirilmiştir.",
      en: "Three years before the Hijra, on the Prophet's return from al-Ṭāʾif, a group of jinn — who had come out investigating why celestial tidings had been barred from them — listened to the Qur'an the Prophet was reciting at the dawn prayer, were overcome by its eloquence, and believed. The sura was revealed in the wake of this event.",
    },
  },
  41: {
    slug: 'yasin-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 36. suresidir; Mekke döneminin ortalarında inmiş, 83 ayettir. İslâm akaidinin üç temel esası — tevhid, nübüvvet ve âhiret — tabiatın düzeninden delillerle anlatılır. Dört bölüme ayrılır: Hz. Peygamber'in nübüvveti, ashâbü'l-karye kıssası, yaratılış delilleri ve kıyamet tasvirleri.",
      en: "The 36th sura of the Qur'an; Meccan, 83 verses, revealed in the middle of the Meccan period. It sets forth the three core tenets of Islamic creed — divine unity, prophethood, and the Hereafter — through signs drawn from the order of nature. It falls into four parts: the Prophet's mission, the narrative of the townspeople (aṣḥāb al-qarya), the signs of creation, and scenes of the Last Day.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz; Mekke'nin orta döneminde iman-küfür mücadelesinin kızıştığı bir bağlamda indirildiği kaydedilir.",
      en: "The article transmits no specific occasion of revelation for the sura; it notes only that it was revealed in the middle Meccan period, amid the intensifying struggle between faith and denial.",
    },
  },
  42: {
    slug: 'furkan-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 25. suresidir; Mekke döneminin sonlarına doğru, muhtemelen nübüvvetin 10. yılı civarında inmiş, 77 ayettir. Bazı rivayetlere göre 68-70. ayetler Medenî'dir. Adı \"hak ile bâtılı ayıran\" anlamındaki furkān kelimesindendir; müşriklerin Hz. Peygamber'in peygamberliğine yönelik iftira ve itirazlarına cevap verir.",
      en: "The 25th sura of the Qur'an; revealed toward the end of the Meccan period, around the 10th year of prophethood, 77 verses. Some narrations hold verses 68-70 to be Medinan. Named for 'al-furqān' ('the criterion that distinguishes truth from falsehood'), it responds to the polytheists' slanders and objections against the Prophet's mission.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü bağlayıcı tek bir sebeb-i nüzul olayı aktarmaz; vahyin niteliği, Peygamber'in insanî özellikleri ve âhiretteki büyük hesap etrafındaki müşrik itirazlarına toplu cevap olarak indirildiğini belirtir.",
      en: "The article does not cite a single binding occasion of revelation for the sura; it was revealed as a comprehensive response to polytheist objections concerning the nature of revelation, the human traits of the Prophet, and the Great Reckoning.",
    },
  },
  43: {
    slug: 'fatir-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 35. suresidir; Mekke döneminde, Habeşistan hicretinden sonra ve mi'rac olayından önce inmiş, 45 ayettir. Allah'ın varlığı ve birliği, kozmik işaretlerin O'nun kudretine delâleti, meleklerin yaratılmışlığı, nübüvvet ve âhiret inancı, hidayet-dalâlet sebepleri ile insanın Allah karşısındaki aczi ana temalarını oluşturur.",
      en: "The 35th sura of the Qur'an; Meccan, 45 verses, revealed after the migration to Abyssinia and before the Night Journey. Its major themes are God's existence and oneness, the cosmic signs pointing to His power, the created nature of the angels, prophethood and the Hereafter, the causes of guidance and misguidance, and humankind's utter need before God.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez; Habeşistan hicreti sonrası ve mi'rac öncesi bir dönemde indirildiği kaydedilir.",
      en: "The article cites no specific occasion of revelation; it notes only that the sura was revealed in the period after the emigration to Abyssinia and before the Night Journey.",
    },
  },
  44: {
    slug: 'meryem-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 19. suresidir; Mekkî ve 98 ayettir; nübüvvetin 5-6. yılında, Habeşistan hicretinden önce inmiştir. Ana temaları tevhid, peygamberlik, diriliş, amellerin karşılığı ve Allah'ın ortaksız-çocuksuz olmasıdır. Hz. Yahyâ ile Hz. Îsâ'nın doğum kıssaları ve Hz. İbrâhim'in tevhid mücadelesi geniş yer tutar.",
      en: "The 19th sura of the Qur'an; Meccan, 98 verses, revealed in the 5th-6th year of prophethood, prior to the migration to Abyssinia. Its principal themes are divine unity, prophethood, resurrection, the requital of deeds, and the denial that God has any partner or offspring. The narratives of the births of John (Yaḥyā) and Jesus (ʿĪsā), and Abraham's struggle for monotheism, feature prominently.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, Habeşistan'a hicret edecek Müslümanları hazırlamak ve bilgilendirmek amacıyla indirilmiştir. \"Ayetlerimizi inkâr edip 'bana mal ve evlat verilecek' diyen kişiyi gördün mü?\" ayetinin nüzulü, Mekkeli müşriklerle Müslümanlar arasındaki tartışmalarla ilişkilendirilir.",
      en: "The sura was revealed to prepare and instruct those Muslims about to migrate to Abyssinia. The revelation of the verse 'Have you seen him who denies Our signs and says: I shall be given wealth and children?' is associated with the disputes that arose between the Meccan polytheists and the Muslims.",
    },
  },
  45: {
    slug: 'taha-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 20. suresidir; Mekkî ve 135 ayettir; Meryem suresinden sonra inmiştir. Adını baştaki \"tâhâ\" harflerinden alır. Muhtevasının üçte ikisi Hz. Mûsâ'nın peygamberliğine, Firavun'la mücadelesine ve kavmiyle yaşadıklarına ayrılır; ayrıca Hz. Âdem'in cennetten çıkarılması ve kıyamet sahneleri işlenir.",
      en: "The 20th sura of the Qur'an; Meccan, 135 verses; revealed after Sūra Maryam. It is named for the letters 'Ṭā-Hā' at its opening. Two-thirds of its content concerns Moses's prophethood, his confrontation with Pharaoh, and his troubles with his own people; it also addresses the expulsion of Adam from the garden and scenes of the Last Day.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez; Müslümanların inanç özgürlüğü ve can-mal güvenliği bakımından ciddi sıkıntı çektiği, bir kısmının Habeşistan'a hicret ettiği bir dönemde indirildiğini kaydeder.",
      en: "The article does not cite a specific occasion of revelation; it notes that the sura was revealed in a period when Muslims faced serious threats to their freedom of belief and to life and property, and some had been forced to migrate to Abyssinia.",
    },
  },
  46: {
    slug: 'vakia-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 56. suresidir; Mekkî ve 96 ayettir. Adı \"mutlaka gerçekleşecek olan\" anlamındaki vâkıa kelimesindendir. Kıyametin kopuşu, ölümden sonra yeni bir hayatın başlaması ve insanların inanç ve amellerinin karşılığını âhirette bulması vurgulanır; inananlar ile inkârcıların farklı kaderi etkileyici biçimde resmedilir.",
      en: "The 56th sura of the Qur'an; Meccan, 96 verses. Named for 'al-wāqiʿa' — 'that which must come to pass'. It emphasises the onset of the Last Hour, the commencement of a new life after death, and the truth that humans shall find the requital of their belief and deeds in the Hereafter; the contrasting destinies of the believers and the deniers are vividly portrayed.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz; sure mufassal sureler arasında yer alır ve Hz. Peygamber'in sabah namazlarında okuduğuna dair rivayetler nakledilir.",
      en: "The article transmits no specific occasion of revelation; the sura is counted among the 'mufaṣṣal' suras, and narrations report that the Prophet used to recite it at the dawn prayer.",
    },
  },
  47: {
    slug: 'suara-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 26. suresidir; Mekke döneminin ortalarında inmiş, 227 ayettir. Peygamberlerin davet mücadelesine odaklanır. İlk bölümde Hz. Nûh'tan itibaren yedi peygamberin tebliği, özellikle Hz. Mûsâ-Hârûn'un Firavun'la mücadelesi geniş biçimde anlatılır; ikinci bölümde Hz. Peygamber'in daveti, sabrı, merhameti ve tevekkülü işlenir.",
      en: "The 26th sura of the Qur'an; Meccan, 227 verses, revealed in the middle of the Meccan period. It centres on the missionary struggles of the prophets: the first part sets forth the proclamations of seven prophets beginning with Noah — especially the extended account of Moses and Aaron against Pharaoh; the second part addresses the Prophet's own mission, his patience, mercy, and reliance upon God.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez; sure, peygamberlerin davet tecrübelerini örnek alarak Hz. Peygamber'i ve müminleri sabra çağıran bir çerçevede indirilmiştir.",
      en: "The article cites no specific occasion of revelation for the sura; it was revealed as a call — through the example of earlier prophets' missions — for the Prophet and the believers to maintain patience.",
    },
  },
  48: {
    slug: 'neml-suresi',
    author: 'İshak Yazıcı',
    tafsir: {
      tr: "Kur'ân'ın 27. suresidir; Mekkî ve 93 ayettir; Şuarâ suresinden sonra inmiştir. Adını Hz. Süleyman'ın ordusuna yol açan karıncanın zikredildiği 18. ayetten alır. Hz. Mûsâ, Süleyman, Sâlih ve Lût'un mücadelelerinden örneklerle Allah'ın birliği, âhiretin gerçekliği ve Kur'an'ın vahiy kaynağı olduğu vurgulanır.",
      en: "The 27th sura of the Qur'an; Meccan, 93 verses; revealed after Sūrat al-Shuʿarāʾ. Its name comes from verse 18, which mentions the ant that stood aside for Solomon's army. Through examples drawn from the struggles of Moses, Solomon, Ṣāliḥ, and Lot, it stresses the oneness of God, the reality of the Hereafter, and the revelational origin of the Qur'an.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz; sure Mekke döneminde Şuarâ suresinin ardından indirilmiştir.",
      en: "The article cites no specific occasion of revelation; the sura was revealed in the Meccan period following Sūrat al-Shuʿarāʾ.",
    },
  },
  49: {
    slug: 'kasas-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 28. suresidir; Mekkî ve 88 ayettir; Neml suresinden sonra inmiştir. Üç ana kıssa işlenir: Hz. Mûsâ'nın hayatı ve Firavun'la yaşananlar, Hz. Peygamber'in vahyinin doğruluğu ve Mekke müşriklerinin itirazları, ardından Kârûn'un serveti ve helâki. Dünya malının geçiciliği ve kibrin sakıncaları vurgulanır.",
      en: "The 28th sura of the Qur'an; Meccan, 88 verses; revealed after Sūrat al-Naml. It presents three principal narratives: the life of Moses and his confrontations with Pharaoh; the authenticity of the Prophet's revelation alongside the objections of the Meccan polytheists; and the fortune and destruction of Qārūn (Korah). The transience of worldly wealth and the dangers of arrogance are highlighted.",
    },
    event: {
      kind: 'asbab',
      tr: "Makaleye göre 57. ayetin, Hz. Peygamber'in amcası Ebû Tâlib hakkında indiği rivayet edilir; sure genel olarak, Hz. Peygamber'in risâletinin doğruluğuna ilişkin Mekke müşriklerinin itirazlarına cevap çerçevesinde indirilmiştir.",
      en: "According to the article, verse 57 is reported to have been revealed concerning the Prophet's uncle Abū Ṭālib; more broadly, the sura was revealed within a framework of response to Meccan polytheist objections against the authenticity of the Prophet's mission.",
    },
  },
  50: {
    slug: 'isra-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 17. suresidir; Mekkî ve çoğunluğa göre 111 ayettir; Kasas suresinden sonra inmiştir. Adını \"gece yürüyüşü\" anlamındaki isrâ kelimesinden alır; Hz. Peygamber'in Mescid-i Harâm'dan Mescid-i Aksâ'ya götürülüşünü, ayrıca İsrâiloğulları tarihi, tevhid inancı, ana-babaya iyilik, yoksula yardım, can güvenliği ve toplum düzeni gibi temel ahlâk ve hukuk ilkelerini işler.",
      en: "The 17th sura of the Qur'an; Meccan, 111 verses by the majority count; revealed after Sūrat al-Qaṣaṣ. Named for the 'night journey' (isrāʾ), it treats the Prophet's journey from al-Masjid al-Ḥarām to al-Masjid al-Aqṣā, and also the history of the Children of Israel, the doctrine of divine unity, and core ethical and legal principles — kindness to parents, aid to the poor, sanctity of life, and the ordering of society.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bağlayıcı bir sebeb-i nüzul olayı aktarmaz; sure, Hz. Peygamber'in isrâ ve mi'rac öncesi Mekke dönemi sonlarına doğru indirilmiştir.",
      en: "The article cites no binding specific occasion of revelation; the sura was revealed toward the end of the Meccan period in conjunction with the events of the Night Journey and Ascension.",
    },
  },
  51: {
    slug: 'yunus-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 10. suresidir; Mekkî, 109 ayettir; muhtemelen hicretten bir yıl önce inmiştir. Allah'ın birliği, Hz. Muhammed'in peygamberliği ve âhirete iman vurgulanır; geçmiş kavimlerin ilâhî mesajı reddetmelerinden örnekler verilir. Sure dört bölümde işlenir: ilâhî hikmetin açıklanması, şirkin reddi ve Kur'an'ın vahyîliği, Hz. Nûh ve Hz. Mûsâ'nın mücadeleleri, imanda hür iradenin rolü.",
      en: "The 10th sura of the Qur'an; Meccan, 109 verses; likely revealed about one year before the Hijra. It emphasises the oneness of God, Muhammad's prophethood, and belief in the Hereafter, with examples of past peoples rejecting the divine message. It falls into four parts: the exposition of divine wisdom, the refutation of polytheism and the divine origin of the Qur'an, the struggles of Noah and Moses, and the role of free human choice in faith.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü belirli bir sebeb-i nüzul olayı aktarmaz; sure, Mekke dönemi sonlarında inkârcıların tavrına karşı toplu bir cevap çerçevesinde indirilmiştir.",
      en: "The article cites no specific occasion of revelation; the sura was revealed toward the end of the Meccan period as a comprehensive response to the stance of the deniers.",
    },
  },
  52: {
    slug: 'hud-suresi',
    author: 'Muhammed Eroğlu',
    tafsir: {
      tr: "Kur'ân'ın 11. suresidir; Mekkî, 123 ayettir; Yûnus suresinden sonra ve İsrâ suresinden önce inmiştir. Büyük ölçüde peygamber kıssalarına ayrılır: Hz. Nûh, Hûd, Sâlih, İbrâhim, Lût, Şuayb ve Mûsâ'nın tebliğ mücadeleleri anlatılır. \"Emrolunduğun gibi dosdoğru ol\" ifadesiyle bilinen 112. ayet Hz. Peygamber'i derinden etkilemiştir.",
      en: "The 11th sura of the Qur'an; Meccan, 123 verses; revealed after Sūra Yūnus and before Sūra al-Isrāʾ. Its bulk is devoted to prophet narratives — the missions of Noah, Hūd, Ṣāliḥ, Abraham, Lot, Shuʿayb, and Moses. The 112th verse — 'Be upright as you have been commanded' — is reported to have profoundly affected the Prophet.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul açıklamasına rastlanmadığını kaydeder; müşriklerin Müslümanlar üzerindeki baskısının arttığı Mekke döneminin son yıllarında indirildiği değerlendirilir.",
      en: "The article notes that no specific occasion of revelation is attested for the sura; it is assessed as revealed during the final Meccan years, when the polytheists' pressure on the Muslims had intensified.",
    },
  },
  53: {
    slug: 'yusuf-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 12. suresidir; Mekkî, 111 ayettir; nübüvvetin 8-10. yılları arasında inmiştir. Hz. Yûsuf'un hayat hikâyesini baştan sona işler; sabır ve tevekkülle Allah'a sığınmanın değeri ile ahlâkî yüksekliğin zarureti ana öğretileri teşkil eder.",
      en: "The 12th sura of the Qur'an; Meccan, 111 verses; revealed between the 8th and 10th year of prophethood. It recounts the life story of the Prophet Joseph from beginning to end, with its core teachings being the value of seeking refuge in God through patience and reliance, and the necessity of moral elevation.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre sahâbe Hz. Peygamber'den kıssa niteliğinde ayetler okumasını talep etmiş; bu talebe cevap olarak sure indirilmiş ve aynı zamanda Resûlullah'a teselli görevi yüklenmiştir.",
      en: "According to the narration, the Companions requested that the Prophet recite verses in the form of a sustained narrative; the sura was revealed in response to that request and also served as consolation for the Messenger of God.",
    },
  },
  54: {
    slug: 'hicr-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 15. suresidir; Mekkî, 99 ayettir; muhtemelen İbrâhim suresinden sonra inmiştir. Kur'an'ın ilâhî koruma altında değişmeden kalacağı vurgulanır; Hz. Peygamber'e yöneltilen iftiralar reddedilir; Semûd, Lût kavmi ve Medyenliler gibi peygamberlerini yalanlayan toplulukların helâki hatırlatılır.",
      en: "The 15th sura of the Qur'an; Meccan, 99 verses; likely revealed after Sūrat Ibrāhīm. It affirms the divine protection of the Qur'an from any alteration, refutes the accusations directed at the Prophet, and recalls the destruction of peoples such as Thamūd, the people of Lot, and the folk of Shuʿayb who rejected their messengers.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez; Mekke'de Müslümanlara yönelik baskıların yoğunlaştığı bir dönemde indirildiği kaydedilir.",
      en: "The article cites no specific occasion of revelation; the sura is noted as revealed during an intensifying period of persecution of Muslims in Mecca.",
    },
  },
  55: {
    slug: 'enam-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 6. suresidir; Mekkî ve 165 ayettir — rivayete göre tamamı bir gecede inmiştir; bazı ayetlerinin Medenî olduğuna dair görüşler vardır. Adını ehl-i beyhi sürüler (deve, sığır, koyun, keçi) anlamındaki \"en'âm\"dan alır; tevhid, nübüvvet, yaratılış ve diriliş ile helâl-haram hükümleri işlenir. Şirke karşı ileri sürdüğü güçlü delillerden dolayı \"Hüccet Suresi\" olarak da anılır.",
      en: "The 6th sura of the Qur'an; Meccan, 165 verses — reportedly revealed in its entirety in a single night, with some narrations indicating that particular verses are Medinan. Its name derives from 'al-anʿām' (livestock: camel, cattle, sheep, goat); it treats divine unity, prophethood, creation, resurrection, and rulings on what is lawful and unlawful. For its forceful arguments against polytheism it is also called 'Sūrat al-Ḥujja'.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü tek bir sebeb-i nüzul olayı aktarmaz; sure bir bütün hâlinde, şirke karşı delilleri toplu biçimde ortaya koyan bir çerçevede indirilmiştir.",
      en: "The article does not cite a single specific occasion of revelation for the sura; it was revealed as an integral whole within a framework that marshals arguments against polytheism.",
    },
  },
  56: {
    slug: 'saffat-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 37. suresidir; Mekke'nin sonlarında inmiş, 182 ayettir. Adını ilk ayetteki \"saf saf dizilenler\" anlamındaki \"ve's-sâffât\" ifadesinden alır. Beş bölümde işlenir: melekler ve kâinat düzeni; âhiret ve cehennem; geçmiş peygamberler (Nûh, İbrâhim, Mûsâ, Hârûn, İlyâs, Lût, Yûnus); müşriklerin mantık çelişkileri; peygamberlerin ve müminlerin zaferinin kesinliği.",
      en: "The 37th sura of the Qur'an; revealed late in the Meccan period, 182 verses. Named for 'wa-ṣ-ṣāffāt' ('those ranged in ranks') in its opening verse. It unfolds in five parts: the angels and the cosmic order; the Hereafter and Hell; the earlier prophets — Noah, Abraham, Moses, Aaron, Elijah, Lot, and Jonah; the logical contradictions of the polytheists; and the certainty of the triumph of the prophets and believers.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü belirli bir sebep zikretmez; Kureyşlilerin ilâhî vahyi alaycı bir tavırla karşıladıkları bağlamda indirilmiştir.",
      en: "The article cites no specific occasion; the sura was revealed in a context in which the Quraysh were meeting the divine revelation with mockery.",
    },
  },
  57: {
    slug: 'lokman-suresi',
    author: 'İlyas Üzüm',
    tafsir: {
      tr: "Kur'ân'ın 31. suresidir; Mekkî ve 34 ayettir; Sâffât suresinden sonra inmiştir. Kur'an'ın hikmet, hidayet ve rahmet kaynağı olduğu; Lokman'ın oğluna verdiği ahlâkî öğütler (şirkten kaçınma, ana-babaya iyilik, sabır, alçakgönüllülük); Allah'ın nimetleri ve kudreti; kıyamet günü insanların durumu dört ana bölümde işlenir.",
      en: "The 31st sura of the Qur'an; Meccan, 34 verses; revealed after Sūrat al-Ṣāffāt. In four parts it treats: the Qur'an as a source of wisdom, guidance, and mercy; Luqmān's moral counsel to his son (shunning shirk, honouring parents, patience, humility); the bounties and power of God; and humankind's condition on the Day of Judgement.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez; sure, ahlâkî öğütler ve Kur'an'ın değerinin hatırlatıldığı bir çerçevede indirilmiştir.",
      en: "The article cites no specific occasion of revelation; the sura was revealed in a framework of moral counsel and the affirmation of the Qur'an's worth.",
    },
  },
  58: {
    slug: 'sebe-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 34. suresidir; Mekkî ve 54 ayettir; Lokman suresinden sonra inmiştir. Dört ana bölümde tevhid ve âhiret inancını işler: âhireti reddedenlerin tutumu; Hz. Dâvûd–Süleyman örnekleri ve Sebe halkının kıssası; tevhid ilkesi ve mal zenginliğinin kurtuluşa yetmeyeceği; Resûlullah dönemindeki müşriklere hitap.",
      en: "The 34th sura of the Qur'an; Meccan, 54 verses; revealed after Sūra Luqmān. In four parts it addresses divine unity and the Hereafter: the stance of those who deny the afterlife; the examples of David and Solomon and the story of the people of Sabaʾ; the principle of divine unity and the truth that wealth alone does not secure salvation; and direct address to the polytheists of the Prophet's own day.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale bağlayıcı bir sebeb-i nüzul olayı aktarmaz; sure, muhatapların Allah'ın birliği ve âhiret hayatını reddetmede sert bir tutum sergiledikleri bağlamda indirilmiştir.",
      en: "The article cites no binding occasion of revelation; the sura was revealed in the context of addressees who maintained a harsh stance in denying God's oneness and the reality of the Hereafter.",
    },
  },
  59: {
    slug: 'zumer-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 39. suresidir; Mekke'nin ortalarında inmiş, 75 ayettir. Adını 71 ve 73. ayetlerde geçen \"âhirette kâfir ve mümin toplulukları\" anlamındaki \"zümer\" kelimesinden alır. Üç bölümden oluşur: Kur'an'ın vahyîliği, tevhid, âhiret ve tabiatın insan psikolojisindeki yansımaları; tevhid ilkesi ve ümmet misalleri; tövbenin açık kapısı, Allah'ın yaratıcılığı ve kıyamette ceza-mükâfat.",
      en: "The 39th sura of the Qur'an; Meccan (mid-period), 75 verses. Named for 'al-zumar' in verses 71 and 73 — 'companies', denoting the believing and disbelieving throngs in the Hereafter. It is in three parts: the revelatory status of the Qur'an, divine unity, the Hereafter and the ways nature reflects on the human self; the principle of tawḥīd and examples from past communities; the open door of repentance, God's creativity, and the requital of deeds on Judgement Day.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebep zikretmez; sure, iman-inkâr mücadelesi ve tövbeye davet çerçevesinde indirilmiştir.",
      en: "The article cites no specific occasion; the sura was revealed within a framework of the struggle between faith and denial and of the call to repentance.",
    },
  },
  60: {
    slug: 'mumin-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 40. suresidir; Mekkî ve 85 ayettir. \"Gâfir\" ve \"Tavl\" isimleriyle de anılır; \"Hâ-Mîm\" harfleriyle başlayan yedi sureden birincisidir. Adını, Firavun ailesinden iman ettiğini gizleyen mümin şahıstan alır. Allah'ın mutlak kudret ve ilmi, günahların bağışlanması, tövbenin kabulü, zalimlerin cezası ve sâlihlere lütuf ana temalarıdır.",
      en: "The 40th sura of the Qur'an; Meccan, 85 verses. Also called 'Ghāfir' or 'al-Ṭawl'; the first of the seven 'Ḥā Mīm' suras. It takes its name from the believing man of Pharaoh's household who concealed his faith. Its principal themes are God's absolute power and knowledge, the forgiveness of sins, the acceptance of repentance, severe punishment for wrongdoers, and divine favour toward the righteous.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü belirli bir sebeb-i nüzul olayı zikretmez; sure, iman-küfür mücadelesinin tarih boyunca devam ettiğini ve âhirette sâlihlerle zâlimlerin farklı âkıbete çağrıldığını vurgulayan iki bölüm hâlinde indirilmiştir.",
      en: "The article cites no specific occasion of revelation; the sura was revealed in two main sections that underline the ongoing historical struggle between faith and denial and the divergent fates of the righteous and the wrongdoers in the Hereafter.",
    },
  },
  61: {
    slug: 'fussilet-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 41. suresidir; Mekkî, 54 ayettir (bazı sayımlara göre 52); Mekke'nin sonlarında, mi'rac sonrası ve hicretten az önce inmiştir. \"Hâ-Mîm\" ile başlayan yedi sureden ikincisidir. \"Kur'an uydurulmuş değil, Rahmân ve Rahîm olan Allah tarafından indirilmiştir\" mesajıyla açılır; müşrikleri uyarır, Allah'ın kudret ve azametini hatırlatır, müminlerin ihlâsını vurgular.",
      en: "The 41st sura of the Qur'an; Meccan, 54 verses (52 by some counts); revealed in the late Meccan period, after the Night Ascension and shortly before the Hijra. It is the second of the seven 'Ḥā Mīm' suras. Opening with the message that 'the Qur'an is no fabrication but a revelation from the All-Merciful, the All-Compassionate', it warns the polytheists, recalls God's might and majesty, and accentuates the sincerity of the believers.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre 22-23. ayetler, Kâbe yanında konuşan üç kişinin Allah'ın işitme kudreti hakkında yaptığı tartışma üzerine; 40. ayet ise Ebû Cehil hakkında nâzil olmuştur.",
      en: "According to the narrations, verses 22-23 were revealed concerning a discussion near the Kaʿba among three men about the extent of God's hearing, and verse 40 was revealed concerning Abū Jahl.",
    },
  },
  62: {
    slug: 'sura-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 42. suresidir; Mekkî, 53 ayettir; Fussilet suresinden sonra inmiştir. Ulûhiyet, nübüvvet ve âhiret konularında uyarıda bulunur ve dinin üç temel ilkesini vurgular. İki bölümde işlenir: ilk bölümde Allah'ın egemenliği ve Kur'an'ın vahyîliği; ikinci bölümde kıyamet ve âhiret hayatı. Üslûbu şefkat, dostluk ve yakınlığı ön plana çıkarır.",
      en: "The 42nd sura of the Qur'an; Meccan, 53 verses; revealed after Sūrat Fuṣṣilat. It admonishes with respect to divinity, prophethood, and the Hereafter and underscores the three foundations of religion. It is presented in two parts: first, God's sovereignty and the revelatory origin of the Qur'an; second, the Last Day and the life to come. Its tone foregrounds compassion, friendship, and closeness.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz; sure davetçi bir üslupla uyarı ve müjde çerçevesinde indirilmiştir.",
      en: "The article transmits no specific occasion of revelation; the sura was revealed in an inviting tone that combines warning and good tidings.",
    },
  },
  63: {
    slug: 'zuhruf-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 43. suresidir; Mekkî, 89 ayettir; Şûrâ suresinden sonra inmiştir. Üç bölümden oluşur: Kur'an'ın vahiy kaynağı olduğu ve inkârcıların helâki; Mekke müşriklerine hitap ve Firavun örneği; âhiret hayatı ile cennet-cehennem tasvirleri.",
      en: "The 43rd sura of the Qur'an; Meccan, 89 verses; revealed after Sūrat al-Shūrā. It falls into three parts: the Qur'an as revelation and the destruction of those who denied it; direct address to the Meccan polytheists with the example of Pharaoh; and scenes of the Hereafter — Paradise and Hell.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez; sure, Kur'an'ın vahyîliğine yönelik inkâra cevap ve âhiret uyarısı olarak indirilmiştir.",
      en: "The article cites no specific occasion of revelation; the sura was revealed as a response to denial of the Qur'an's revelatory status and as a warning about the Hereafter.",
    },
  },
  64: {
    slug: 'duhan-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 44. suresidir; Mekkî, Kûfe sayımına göre 59 (Hicaz sayımına göre 60) ayettir; Zuhruf'tan sonra, Câsiye'den önce inmiştir. Adını 10. ayette geçen \"duhân\" (duman) kelimesinden alır. Kitaba ve peygambere inanmanın gerekliliği, inanmayanların dünyadaki sıkıntısı ve âhiret azabı; İsrâiloğulları'nın Firavun'dan kurtuluşu ve müminlere vaat edilen cennet konularını işler.",
      en: "The 44th sura of the Qur'an; Meccan, 59 verses by the Kufan count (60 by the Hijazi); revealed after Sūrat al-Zukhruf and before Sūrat al-Jāthiya. Named after 'al-dukhān' (smoke) in verse 10, it treats the necessity of belief in the Book and the Prophet, the worldly afflictions and otherworldly punishment of the deniers, the rescue of the Children of Israel from Pharaoh, and the Paradise promised to the believers.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bağlayıcı bir sebeb-i nüzul olayı zikretmez; sure, 10. ayette zikredilen \"duhân\" alâmeti çerçevesinde uyarı olarak indirilmiştir.",
      en: "The article cites no binding specific occasion of revelation; the sura was revealed as a warning built around the sign of 'al-dukhān' mentioned in verse 10.",
    },
  },
  65: {
    slug: 'casiye-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 45. suresidir; Mekkî, 37 ayettir (bazı sayımlara göre 36); Duhân'dan sonra, Ahkāf'tan önce inmiştir. \"Hâ-Mîm\" ile başlayan yedi sureden altıncısıdır. İman-itikat, özellikle âhirete iman konusuna odaklanır. Üç bölümden oluşur: vahyin önemi; ilâhî vahyin doğruluğuna dair deliller; âhirete inanmayanların düşünce tarzının tutarsızlığı.",
      en: "The 45th sura of the Qur'an; Meccan, 37 verses (36 by some counts); revealed after Sūrat al-Dukhān and before Sūrat al-Aḥqāf. It is the sixth of the seven 'Ḥā Mīm' suras. It centres on matters of faith and creed, especially belief in the Hereafter, in three parts: the importance of revelation; the proofs of the truthfulness of divine revelation; and the inconsistency of the thinking of those who deny the Hereafter.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sebeb-i nüzul olarak herhangi bir olayın kaydedilmediğini açıkça belirtir.",
      en: "The article explicitly notes that no occasion of revelation has been recorded.",
    },
  },
  66: {
    slug: 'ahkaf-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 46. suresidir; Mekkî, 35 ayettir (bazı kaynaklarda 34); Câsiye suresinden sonra inmiştir. 15, 20 ve 35. ayetlerin Medenî olduğuna dair rivayetler vardır. Kur'an'ın Allah tarafından indirildiğini, putlara tapmanın mânasızlığını ortaya koyar; iman ve iyilik, aile ilişkileri, Hz. Hûd'un Âd kavmine uyarıları ve müşriklerin uğrayacağı hezimet işlenir.",
      en: "The 46th sura of the Qur'an; Meccan, 35 verses (34 in some counts); revealed after Sūrat al-Jāthiya. Narrations hold verses 15, 20, and 35 to be Medinan. It affirms that the Qur'an is from God and exposes the futility of worshipping idols; it treats faith and good works, family relations, Hūd's warning to the people of ʿĀd, and the rout awaiting the polytheists.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale, sureye özgü bir sebeb-i nüzul olayı belirtmez.",
      en: "The article indicates no specific occasion of revelation for the sura.",
    },
  },
  67: {
    slug: 'zariyat-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 51. suresidir; nübüvvetin ortalarında Mekke'de inmiş, 60 ayettir. İslâm akaidinin üç esasını (tevhid, âhiret, risâlet) işler; ilk bölümde âhiretin gerçekliği, ikinci bölümde tabiattaki ilâhî kudret ve insanın yaratılış amacı vurgulanır. Rüzgâr, bulut ve gemiler gibi tabii varlıklara yeminle başlar; önceki peygamberlere karşı çıkanların perişan âkıbeti hatırlatılır; son bölümde insan ve cinin yalnızca ibadet için yaratıldığı ve rızkı Allah'ın verdiği bildirilir.",
      en: "The 51st sura of the Qur'an; Meccan (mid-period), 60 verses. It treats the three tenets of Islamic creed — divine unity, the Hereafter, and prophethood. Its first part asserts the reality of the Hereafter, its second underscores God's power in nature and the purpose of human creation. It opens with oaths by natural phenomena — winds, clouds, and ships — recalls the grim end of those who opposed earlier prophets, and concludes by declaring that humans and jinn were created solely for worship and that it is God who provides for all creation.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez.",
      en: "The article cites no specific occasion of revelation.",
    },
  },
  68: {
    slug: 'gasiye-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 88. suresidir; Mekkî ve 26 ayettir. İlk bölümü cehennem ehlinin, ardından gelen dokuz ayet cennet ehlinin durumunu tasvir eder; sonrasında iman ve inkâr konusuna geçilerek Allah'ın varlık ve kudretine inanmak için tabiatın incelenmesi tavsiye edilir.",
      en: "The 88th sura of the Qur'an; Meccan, 26 verses. Its opening passage depicts the state of the people of Hell, followed by nine verses describing the state of the people of Paradise; it then turns to faith and denial, counselling reflection upon nature as the path to belief in the existence and power of God.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz.",
      en: "The article transmits no specific occasion of revelation.",
    },
  },
  69: {
    slug: 'kehf-suresi',
    author: 'İlyas Üzüm',
    tafsir: {
      tr: "Kur'ân'ın 18. suresidir; Mekkî, 110 ayettir. Adını 9-26. ayetlerde geçen \"Ashâb-ı Kehf\" (mağara ashabı) kıssasından alır. Yedi bölümde işlenir: Allah'a hamd; Ashâb-ı Kehf kıssası; dünya-âhiret karşılaştırması; İblis'in isyanı; Hz. Mûsâ-Hızır kıssası; Zülkarneyn kıssası. Allah'ın oğul edinmekten münezzeh olduğu ve iman edenlerin mükâfatı vurgulanır.",
      en: "The 18th sura of the Qur'an; Meccan, 110 verses. Named for the 'Companions of the Cave' (aṣḥāb al-kahf) whose story occupies verses 9-26. It unfolds in seven parts: praise of God; the story of the Companions of the Cave; the contrast between this world and the Hereafter; the rebellion of Iblīs; the narrative of Moses and al-Khiḍr; and the account of Dhū al-Qarnayn. Its keynote is that God is exalted above taking a son, and that the believers will be richly rewarded.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre Mekke müşrikleri, Medine'deki Yahudi âlimlerin tavsiyesiyle Hz. Peygamber'e Ashâb-ı Kehf, doğu-batıya giden şahıs ve ruh hakkında sorular yöneltmiş; Peygamber \"inşallah\" demeden ertesi gün cevap vereceğini söylediğinden vahiy on beş gün gecikmiş, ardından sure indirilmiştir.",
      en: "According to the narration, the Meccan polytheists — at the counsel of Jewish scholars in Medina — posed to the Prophet questions concerning the Companions of the Cave, a man who travelled to east and west, and the spirit. Because the Prophet promised a reply the next day without saying 'if God wills', revelation was delayed fifteen days, after which the sura came down.",
    },
  },
  70: {
    slug: 'nahl-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 16. suresidir; Mekkî, 128 ayettir; hicretten kısa süre önce inmiştir. Adını 68-69. ayetlerde geçen \"nahl\" (bal arısı) kelimesinden alır; sayısız ilâhî nimeti andığı için \"Nimetler Suresi\" olarak da anılır. Şirkin eleştirisi, kıyametin haberi ve Kur'an'ın İbrâhimî çizgide bir vahiy olduğu ana temalarıdır.",
      en: "The 16th sura of the Qur'an; Meccan, 128 verses; revealed shortly before the Hijra. It takes its name from 'al-naḥl' (the bee) in verses 68-69; for its enumeration of countless blessings it is also called 'Sūrat al-niʿam'. Its principal themes are the critique of polytheism, the announcement of the Last Hour, and the affirmation of the Qur'an as a revelation in the Abrahamic line.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü belirli bir sebeb-i nüzul olayı zikretmez; sure, Mekke müşrikleriyle Hz. Peygamber arasındaki gerginliğin yoğunlaştığı bir dönemde indirilmiş, müminlere sabır tavsiye etmiştir.",
      en: "The article cites no specific occasion of revelation; the sura was revealed during an intensifying period of tension between the Meccan polytheists and the Prophet, and counselled the believers to patience.",
    },
  },
  71: {
    slug: 'nuh-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 71. suresidir; Mekkî ve 28 ayettir. İki bölümden oluşur: ilk yirmi ayet Hz. Nûh'un kavmini tevhide daveti ve reddedilmesi; kalan ayetler Nûh'un şikâyeti ve inkârcı kavminin helâki için duası. Tevhid, Allah'a tâzim ve Nûh'un peygamberliğine itaat vurgulanır. Başka peygamber kıssaları içermeyen, tek bir peygamberin mücadelesine odaklanan nâdir surelerdendir.",
      en: "The 71st sura of the Qur'an; Meccan, 28 verses. It unfolds in two parts: the first twenty verses recount Noah's call of his people to divine unity and their rejection; the remaining verses are Noah's complaint and his prayer for the destruction of his obstinate people. It stresses tawḥīd, reverence for God, and obedience to Noah's prophethood. It is one of the rare suras focused solely on a single prophet's mission, without narratives of others.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez.",
      en: "The article cites no specific occasion of revelation.",
    },
  },
  72: {
    slug: 'ibrahim-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 14. suresidir; Mekkî ve 52 ayettir; Nûh suresinden sonra inmiştir. Tevhid, vahiy ve nübüvvet esaslarını dünyevî bağlara takılan inkârcılara karşı güçlü bir uyarı üslûbuyla işler. Beş bölümden oluşur: peygamberlerin mücadelesi, hicrete zorlanış ve ilâhî hüküm, ilâhî nimetler, Hz. İbrâhim'in duaları ve genel değerlendirme. Hz. İbrâhim'in örnek karakteri ve duası özel yer tutar.",
      en: "The 14th sura of the Qur'an; Meccan, 52 verses; revealed after Sūra Nūḥ. It treats the foundations of divine unity, revelation, and prophethood in a stern admonitory tone against deniers caught in worldly attachments. It is in five parts: the prophets' struggles, forced emigration and divine judgement, divine bounties, Abraham's prayers, and a general concluding assessment. Abraham's exemplary character and supplications occupy a distinctive place.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz; sure, Mekke'de müminlere yönelik baskıların yoğunlaştığı bir dönemde indirilmiştir.",
      en: "The article transmits no specific occasion of revelation; the sura was revealed at a period of intensified pressure on the believers in Mecca.",
    },
  },
  73: {
    slug: 'enbiya-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 21. suresidir; Mekkî ve 112 ayettir. On sekiz peygamberin hayatına atıfla \"peygamberlerin hak dini yayma uğruna her türlü zorluğa rağmen nasıl başarıya ulaştıklarını\" gösterir. Ana mesajı, peygamberler ve ümmetlerinin hak-bâtıl mücadelesinde galip gelişi ve bu mücadelede ilâhî korumanın rolüdür.",
      en: "The 21st sura of the Qur'an; Meccan, 112 verses. Drawing on the lives of eighteen prophets, it demonstrates 'how the prophets attained success in proclaiming the true religion despite every obstacle'. Its keynote is the triumph of the prophets and their communities in the struggle between truth and falsehood, and the role of divine protection within that struggle.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bağlayıcı bir sebeb-i nüzul olayı aktarmaz; sure, Mekke müşriklerinin Peygamber'i yalanladığı ve maddî mûcize talep ettiği bir bağlamda indirilmiştir.",
      en: "The article cites no binding specific occasion of revelation; the sura was revealed in a context where the Meccan polytheists were denying the Prophet and demanding material miracles.",
    },
  },
  74: {
    slug: 'muminun-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 23. suresidir; Mekke'nin sonlarında inmiş, 118 ayettir. Sure, kurtuluşa erecek müminlerin nitelikleriyle açılır: namaz, zekât, emanete riayet, boş sözden uzak durma ve iffet. Ardından yaratılış ve kâinat düzeniyle Allah'ın varlığına delil getirir; Nûh'tan itibaren peygamber tarihini tevhid-şirk ve mal-iktidar çatışması ekseninde özetler. Son bölümünde inkârcıları bekleyen âhiret azabı işlenir; Hz. Peygamber'in mağfiret ve rahmet duasıyla tamamlanır.",
      en: "The 23rd sura of the Qur'an; late Meccan, 118 verses. It opens by describing the traits of the believers who will attain salvation — prayer, alms, faithfulness to trusts, turning away from vain speech, and chastity. It then argues from creation and the cosmic order for God's existence, and traces the history of prophets from Noah onward along the axis of tawḥīd versus polytheism and wealth/power. Its closing section treats the punishment awaiting the deniers, concluding with the Prophet's prayer for forgiveness and mercy.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü belirli bir sebeb-i nüzul olayı zikretmez; sure, Peygamber döneminin inkârcılarına yönelik uyarı çerçevesinde indirilmiştir.",
      en: "The article cites no specific occasion of revelation; the sura was revealed as a warning directed at the deniers of the Prophet's own day.",
    },
  },
  75: {
    slug: 'secde-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 32. suresidir; Mekke'nin sonlarında, Mü'minûn suresinden sonra inmiş, 30 ayettir. Adını 15. ayette secde eden müminlerin nitelendirildiği \"süccedâ\" kelimesinden alır. Allah'ın varlığı ve birliği, Kur'an'ın vahyîliği, kıyamet günü hesap ve müminlerle inkârcıların âhiretteki farklı durumları ana temalarıdır; 16. ayetteki \"yatakları gecenin bir kısmında bırakıp Rablerine dua eden\" kulların tasvirinden ötürü \"Mezâdı'\" adıyla da anılır.",
      en: "The 32nd sura of the Qur'an; late Meccan, 30 verses; revealed after Sūrat al-Muʾminūn. Named from 'sujjadan' in verse 15, describing the prostrating believers. Its principal themes are God's existence and oneness, the revelatory status of the Qur'an, the Day of Reckoning, and the contrasting fates of believers and deniers in the Hereafter. On account of verse 16 — depicting those who 'leave their beds in the night to call upon their Lord' — it is also known as 'Sūrat al-Maḍājiʿ'.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz.",
      en: "The article transmits no specific occasion of revelation.",
    },
  },
  76: {
    slug: 'tur-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 52. suresidir; Mekke'nin ikinci yarısında inmiş, 49 ayettir. Bireyde ve toplumda sorumluluk duygusunu güçlendirmek için âhireti güçlü tasvirlerle resmeder; müşriklerin vahiy karşıtı iddialarını çürütür. İki bölüme ayrılır: Tûr dağı, levha, Beyt-i Ma'mûr ve gök üzerine yeminle başlayan ilk bölüm ilâhî ceza uyarısı ve kıyamet tasviri; ikinci bölüm Hz. Peygamber'in müşriklere karşı mücadelesi, sabretmesi emri ve yaratma kudretinin yalnız Allah'a ait olduğunun vurgusu.",
      en: "The 52nd sura of the Qur'an; revealed in the second half of the Meccan period, 49 verses. It strengthens the sense of responsibility in both the individual and the community by vividly portraying the Hereafter, and refutes the polytheists' claims against revelation. It falls into two parts: the first opens with oaths by Mount Ṭūr, the inscribed scripture, al-Bayt al-Maʿmūr, and the heavens, warning of divine punishment and describing the Last Day; the second addresses the Prophet's struggle with the polytheists, commanding steadfastness amid their accusations and mockery, and affirming that creative power belongs to God alone.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez.",
      en: "The article cites no specific occasion of revelation.",
    },
  },
  77: {
    slug: 'mulk-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 67. suresidir; Mekkî ve 30 ayettir. Adını ilk ayetteki \"mülk\" (hükümranlık) kelimesinden alır. Amacı Allah'ın varlığını ve birliğini, kâinatı yaratıp yönettiğini ve âhiretin gerçekliğini ispatlamaktır. İki bölüme ayrılır: evrenin yaratılış ve yönetimi ile insanın duyuları ve aklı; yeryüzü ve kuşlar gibi örneklerle ilâhî lütuf.",
      en: "The 67th sura of the Qur'an; Meccan, 30 verses. Named for 'al-mulk' (sovereignty) in its first verse. Its aim is to establish God's existence and oneness, His creation and governance of the cosmos, and the reality of the Hereafter. It is in two parts: the creation and governance of the universe alongside the senses and intellect of the human being; and the signs of divine favour through examples drawn from the earth and the birds.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre 13. ayet, müşriklerin Hz. Peygamber aleyhinde kendi aralarında gizlice konuşmaları üzerine inmiştir.",
      en: "According to the narration, verse 13 was revealed concerning the polytheists conspiring in secret against the Prophet among themselves.",
    },
  },
  78: {
    slug: 'hakka-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 69. suresidir; Mekke'nin ilk yıllarında inmiş, 52 ayettir. Semûd, Âd, Firavun ve Lût kavmi gibi helâk edilen toplulukları anarak kıyamet günü konusunda uyarır. Hz. Peygamber'e yöneltilen \"şair\" ve \"sihirbaz\" iftiralarını reddeder; Kur'an'ın sıradan bir söz olmadığını ilan eder.",
      en: "The 69th sura of the Qur'an; revealed in the earliest Meccan years, 52 verses. Recalling destroyed peoples — Thamūd, ʿĀd, Pharaoh, and the folk of Lot — it warns about the Day of Judgement. It refutes the slanders hurled at the Prophet — that he is a 'poet' or a 'magician' — and declares that the Qur'an is no ordinary speech.",
    },
    event: {
      kind: 'general_context',
      tr: "Makaleye göre sure, İslâm'ın ilk yıllarında Mekke müşriklerinin Hz. Peygamber'e yönelttikleri iftiralara toplu bir cevap olarak indirilmiştir; spesifik bir tek olay zikredilmez.",
      en: "According to the article, the sura was revealed as a comprehensive response to the slanders directed at the Prophet by the Meccan polytheists in the earliest years of Islam; no single specific event is cited.",
    },
  },
  79: {
    slug: 'mearic-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 70. suresidir; Mekke'nin ortalarında inmiş, 44 ayettir. Adını \"yükselme dereceleri\" anlamındaki \"meâric\" kelimesinden alır. Allah'ın büyüklüğü, kıyamet tasvirleri ve cennetle ödüllendirilecek müminlerin belirgin vasıfları ana temalarıdır.",
      en: "The 70th sura of the Qur'an; revealed in the middle Meccan period, 44 verses. Named for 'al-maʿārij' (the ways of ascent). Its principal themes are the majesty of God, scenes of the Last Day, and the distinctive traits of the believers who will be rewarded with Paradise.",
    },
    event: {
      kind: 'asbab',
      tr: "Tefsir kaynaklarına göre Mekkeli müşriklerden Nadr b. Hâris, Hz. Peygamber'in uyarılarına karşı \"Ey Allah, eğer bu senin tarafından gelmiş hak bir kitap ise hemen üzerimize gökten taşlar yağdır!\" diyerek hakaret etmiş; bunun üzerine sure indirilmiştir.",
      en: "According to the commentaries, al-Naḍr b. al-Ḥārith — one of the Meccan polytheists — responded to the Prophet's warnings by scoffing, 'O God, if this be a true Book from You, rain stones on us from the sky'; the sura was revealed in response to that insult.",
    },
  },
  80: {
    slug: 'nebe-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 78. suresidir; Mekke'nin sonlarında inmiş, 40 ayettir. Ana konusu ölümden sonra dirilişin gerçekliği ve âhiret hayatının tasviridir: sorumluluk bilinci, kıyamet günü, cehennem ve cennet tasvirleri öne çıkan unsurlardır.",
      en: "The 78th sura of the Qur'an; late Meccan, 40 verses. Its subject is the reality of resurrection after death and the depiction of the life to come: the foregrounded elements are the sense of accountability, the Day of Judgement, and portrayals of Hell and Paradise.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı belirtmez.",
      en: "The article indicates no specific occasion of revelation.",
    },
  },
  81: {
    slug: 'naziat-suresi',
    author: 'Abdulhamit Birışık',
    tafsir: {
      tr: "Kur'ân'ın 79. suresidir; Mekke'nin sonlarında inmiş, 46 ayettir. Ana konusu kıyametin vuku bulacağını bildirmek ve dünyada iyi ile kötü davrananların âhiretteki yerlerini haber vermektir. Üç bölümden oluşur: yeminlerle kıyametin anlatımı; Firavun'un inkârı ve cezası; kozmik düzenin bozulması ve kıyametin kopuş anı.",
      en: "The 79th sura of the Qur'an; late Meccan, 46 verses. Its subject is to announce the onset of the Last Hour and to declare the otherworldly destinations of the righteous and the wicked. It has three parts: the portrayal of the Hour through oaths; Pharaoh's denial and his punishment; and the undoing of the cosmic order at the coming of the Hour.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez; sure, sorumluluk bilincini pekiştiren bir uyarı çerçevesinde indirilmiştir.",
      en: "The article cites no specific occasion of revelation; the sura was revealed as a warning that reinforces the sense of accountability.",
    },
  },
  82: {
    slug: 'infitar-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 82. suresidir; Mekkî ve 19 ayettir; Nâziât suresinden sonra inmiştir. Kıyamet günü olaylarını tasvir eder: göğün yarılması, yıldızların saçılması, deniz sularının birbirine karışması. İnsan sorumluluğunu vurgular ve \"yazıcı melekler\"in (kirâmen kâtibîn) kişinin yaptıklarının hepsini kaydettiğini bildirir.",
      en: "The 82nd sura of the Qur'an; Meccan, 19 verses; revealed after Sūrat al-Nāziʿāt. It depicts the events of the Last Day: the heavens splitting asunder, the stars scattering, the seas overflowing together. It underlines human responsibility and declares that the recording angels (kirām kātibūn) inscribe every deed.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre ikinci bölümdeki bir ayetin Übey b. Halef veya Velîd b. Muğīre hakkında indiği kaydedilir.",
      en: "According to the narrations, a verse in the second section is reported to have been revealed concerning Ubayy b. Khalaf or al-Walīd b. al-Mughīra.",
    },
  },
  83: {
    slug: 'insikak-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 84. suresidir; erken Mekke döneminde, İnfitâr'dan sonra inmiş, 25 ayettir. Kıyamet sahneleri, göğün parçalanması, yerin dönüşümü, amellerin kaydedilmesi, âhiret hesabı ile Kur'an okunduğunda secde etme emri işlenir.",
      en: "The 84th sura of the Qur'an; early Meccan, 25 verses, revealed after Sūrat al-Infiṭār. It treats scenes of the Last Day, the splitting of the sky, the transformation of the earth, the recording of deeds, the reckoning in the Hereafter, and the command to prostrate when the Qur'an is recited.",
    },
    event: {
      kind: 'asbab',
      tr: "Hz. Peygamber Alak suresinin son ayetini okuyup secde ettiğinde sahâbe de secde etmiş; Kureyşlilerin bu secdeye olumsuz tepki göstermesi üzerine, surede \"kendilerine Kur'an okunduğunda secde etmiyorlar\" ifadesini içeren ayet indirilmiştir.",
      en: "When the Prophet recited the final verse of Sūrat al-ʿAlaq and prostrated, the Companions joined him; in response to the Quraysh's hostile reaction to that prostration, the verse 'they do not prostrate when the Qur'an is recited to them' was revealed within the sura.",
    },
  },
  84: {
    slug: 'rum-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 30. suresidir; Mekke'nin sonlarında inmiş, 60 ayettir. Bizanslılar ile İranlılar arasındaki savaş ve Bizanslıların galibiyetinin önceden haber verilmesi; Allah'ın varlığı, birliği ve kudretine dair deliller; âhiret inancı, tevhid ve şirkin reddi; insan fıtratı ile nikâh müessesesinin temelleri ana temalarıdır.",
      en: "The 30th sura of the Qur'an; late Meccan, 60 verses. Its principal themes are the war between the Byzantines and the Persians and the prior announcement of the Byzantines' victory; proofs of God's existence, oneness, and power; belief in the Hereafter, the doctrine of tawḥīd and the refutation of polytheism; and the foundations of human nature (fiṭra) and the institution of marriage.",
    },
    event: {
      kind: 'asbab',
      tr: "Mekkeli müşrikler Bizans'ın İran'a yenilmesini isterken müminler tersini ümit ediyordu. Sure, bu karşıtlığa atıfla, birkaç yıl içinde Bizanslıların İran karşısında zafer kazanacağı müjdesiyle açılır.",
      en: "The Meccan polytheists wished for the defeat of Byzantium by Persia, while the believers hoped for the opposite. The sura opens with reference to this opposition, foretelling that within a few years the Byzantines would triumph over the Persians.",
    },
  },
  85: {
    slug: 'ankebut-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 29. suresidir; Mekkî (hicretten önce) ve 69 ayettir. Adını 41. ayette geçen \"ankebût\" (örümcek) kelimesinden alır: Allah'tan başkasına güvenenler evlerin en çürüğü olan örümcek ağına benzetilir. Sadece \"iman ettik\" demenin yetmediği, müminlerin imtihanla sınanarak ayırt edildiği; Nûh, İbrâhim ve Lût gibi peygamberlerin maruz kaldığı sıkıntılar örnek verilerek inkârcıların hüsrana uğrayacağı, sâlihlerin ise Allah'ın himayesinde olduğu vurgulanır.",
      en: "The 29th sura of the Qur'an; Meccan (pre-Hijra), 69 verses. It takes its name from 'al-ʿankabūt' (the spider) in verse 41: those who put trust in other than God are likened to a spider's web — 'the frailest of houses'. Its keynote is that merely declaring 'we believe' is not enough; the believers are tested and distinguished by trial. Through the hardships borne by prophets such as Noah, Abraham, and Lot it declares that the deniers will be undone, while the righteous remain under God's protection.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz; sure, Mekke'de müminlere yapılan baskı ortamında sabır ve samimiyete çağrı olarak indirilmiştir.",
      en: "The article transmits no specific occasion of revelation; the sura was revealed as a call to patience and sincerity amid the persecution of believers in Mecca.",
    },
  },
  86: {
    slug: 'mutaffifin-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 83. suresidir; Mekkî ve 36 ayettir (ilk dört ayetinin Medenî olduğuna dair rivayet de vardır; muhteva ve üslup Mekkî karakter taşır). Adı, \"ölçü ve tartıda hile yapanlar\" anlamındaki mutaffifîn kelimesindendir. İki bölümden oluşur: hile yapanların kınanması — ölçüyü eksik vermeleri, insan onurunu çiğnemeleri ve âhireti inkâr etmeleri; müminlerin mükâfatı — sicillerinin \"illiyyîn\"de kaydedildiği ve alaycılardan ayrılan cennet hayatına kavuştukları anlatılır.",
      en: "The 83rd sura of the Qur'an; Meccan, 36 verses (some reports hold the first four to be Medinan; content and style are Meccan in character). Its name comes from 'al-muṭaffifīn' — 'those who defraud in measure and weight'. It is in two parts: the condemnation of the defrauders — their short-changing of others, their violation of human dignity, and their denial of the Day of Judgement; and the reward of the believers — whose records are inscribed in 'ʿilliyyīn' and who enter the life of Paradise, set apart from those who once mocked them.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez.",
      en: "The article cites no specific occasion of revelation.",
    },
  },
  87: {
    slug: 'bakara-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın ikinci ve en uzun suresidir; Medenî ve Kûfe sayımına göre 286 ayettir. İslâm dininin iman esasları ve tevhid akidesi; Kur'an hidayetinin mahiyeti; Müslümanların müstakil bir ümmet olduğunun ortaya konması; ibadetler, muameleler, kıblenin değişmesi, namaz, oruç, hac ve sadaka ile boşanma, nesep, nafaka gibi aile hukuku konuları geniş biçimde işlenir.",
      en: "The second and longest sura of the Qur'an; Medinan, 286 verses by the Kufan count. It sets forth in breadth the tenets of Islamic faith and the doctrine of tawḥīd; the nature of Qur'anic guidance; the establishment of the Muslims as a distinct community (umma); acts of worship, transactions, the change of the qibla, the five daily prayers, fasting, ḥajj and charity, and matters of family law such as divorce, lineage, and maintenance.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü tek bir sebeb-i nüzul olayı vermez; sure hicretten sonra inmeye başlamış ve nüzulü 9-10 yıl sürerek Medine döneminin tamamını kapsamıştır.",
      en: "The article does not offer a single specific occasion of revelation; the sura's revelation began after the Hijra and continued for 9-10 years, spanning the entire Medinan period.",
    },
  },
  88: {
    slug: 'enfal-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 8. suresidir; Medenî ve 75 ayettir. Adını ilk ayetteki \"enfâl\" (ganimetler) kelimesinden alır. Bedir Gazvesi'nde elde edilen ganimetlerin dağıtımı; Müslümanların savaş ve barış zamanında riayet edecekleri ilkeler; Allah'a ve Resûlü'ne itaatin önemi; inanç, azim ve ilâhî yardımın zaferdeki rolü ana temalarıdır.",
      en: "The 8th sura of the Qur'an; Medinan, 75 verses. Named after 'al-anfāl' (spoils of war) in its first verse. Its central themes are the distribution of the spoils from the Battle of Badr, the principles Muslims are to uphold in war and in peace, the importance of obedience to God and His Messenger, and the role of faith, resolve, and divine aid in the victory.",
    },
    event: {
      kind: 'asbab',
      tr: "Surenin büyük bölümü doğrudan Bedir Gazvesi ile ilgilidir; bu ayetler hicretin 2. yılında savaşı takip eden günlerde, ganimet paylaşımı üzerine çıkan tartışma ve genel dersler çerçevesinde nâzil olmuştur.",
      en: "The bulk of the sura is tied directly to the Battle of Badr; its verses were revealed in the days following the battle in year 2 AH, in connection with the dispute over the distribution of the spoils and the broader lessons to be drawn.",
    },
  },
  89: {
    slug: 'al-i-imran-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 3. suresidir; Medenî ve 200 ayettir. Bakara suresinin ulûhiyet ekseninden bayrağı devralarak nübüvveti her boyutuyla işler. Hz. Îsâ'nın ve annesi Meryem'in konumu; peygamberle ümmet ilişkisi; Hristiyan ve Yahudilerle yürütülen itikadî tartışmalar; Müslümanların müstakil bir ümmet olduğunun pekiştirilmesi ana konularıdır.",
      en: "The 3rd sura of the Qur'an; Medinan, 200 verses. Taking up the mantle from Sūrat al-Baqara's focus on divinity, it treats prophethood in all its dimensions. Its main themes are the status of Jesus and his mother Mary, the relationship between prophet and community, the theological disputes conducted with Christians and Jews, and the reaffirmation of the Muslims as an independent community.",
    },
    event: {
      kind: 'general_context',
      tr: "Makaleye göre surenin nüzulü Uhud Savaşı sonrasında, hicretin 3. yılında başlamış ve muhtemelen 9. yıla kadar uzamıştır; sureye özgü tek bir sebep zikretmez.",
      en: "According to the article, the sura's revelation began after the Battle of Uhud in year 3 AH and likely continued to year 9; no single specific occasion is cited for the sura.",
    },
  },
  90: {
    slug: 'ahzab-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 33. suresidir; Medenî ve 73 ayettir. Adı 20. ve 22. ayetlerde geçen \"ahzâb\" (gruplar) kelimesindendir; Medine'yi kuşatmaya gelen müttefik Mekkeli müşriklerin birleşik kuvvetlerini ifade eder. Müminlere maddî-kültürel tehditler karşısında uyarı; nesep, miras, nikâh, boşanma, giyim-kuşam, ahlâk ve hukuk konuları ele alınır.",
      en: "The 33rd sura of the Qur'an; Medinan, 73 verses. Named from 'al-aḥzāb' ('the confederates') in verses 20 and 22, denoting the combined forces of the Meccan polytheists who had come to besiege Medina. It warns believers against material and cultural threats and treats lineage, inheritance, marriage, divorce, dress, ethics, and law.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, Hendek Gazvesi'nden sonra inmiştir; bu savaşta Müslümanlar hendek stratejisiyle Medine'yi korumayı başarmışlardır.",
      en: "The sura was revealed after the Battle of the Trench, in which the Muslims succeeded in defending Medina by the strategy of the ditch.",
    },
  },
  91: {
    slug: 'mumtehine-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 60. suresidir; Medenî, 13 ayettir; Hudeybiye Antlaşması ile Mekke fethi arasında inmiştir. Cahiliye döneminden süregelen Müslüman-gayrimüslim ilişkilerini ele alır: Mekke müşrikleriyle dostluğun tehlikeleri, inanç özgürlüğü ve Mekke'den Medine'ye göç eden mümin kadınların niyetlerinin test edilmesine dair hükümler ana konularıdır.",
      en: "The 60th sura of the Qur'an; Medinan, 13 verses; revealed between the Treaty of al-Ḥudaybiya and the Conquest of Mecca. It treats the Muslim-non-Muslim relations inherited from the pre-Islamic era: the dangers of close alliance with the Meccan polytheists, religious freedom, and the rulings on testing the sincerity of believing women who migrated from Mecca to Medina.",
    },
    event: {
      kind: 'asbab',
      tr: "Surenin büyük bölümü, Hâtıb b. Ebû Beltea adlı sahâbînin, Hz. Peygamber'in Mekke'yi fethetme hazırlığını gizlice Mekkeli akrabalarına haber vermek istemesi olayı üzerine inmiştir.",
      en: "The bulk of the sura was revealed following the incident of the Companion Ḥāṭib b. Abī Baltaʿa, who attempted to secretly warn his Meccan relatives of the Prophet's preparations to conquer Mecca.",
    },
  },
  92: {
    slug: 'nisa-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 4. suresidir; Medenî ve 176 ayettir. Kadınların hukuku, mirasın taksimi, nikâh hukuku, yetimlerin korunması ve toplumsal ilişkiler odağa alınır; müşriklere, Ehl-i kitaba ve münafıklara yönelik eleştiriler de yer alır.",
      en: "The 4th sura of the Qur'an; Medinan, 176 verses. It focuses on the rights of women, the division of inheritance, marriage law, the protection of orphans, and social relations; it also contains critiques directed at polytheists, the People of the Book, and the hypocrites.",
    },
    event: {
      kind: 'general_context',
      tr: "Makaleye göre sure, Medine'de Müslüman toplumunun oluşması; Bedir, Uhud ve Hendek gibi çetin savaşlardan sonra geride yetim ve dul kadınların kalması gibi olayların ardından, muhtemelen hicretin 5. yılı (626-627) civarında indirilmiştir.",
      en: "According to the article, the sura was revealed probably around year 5 AH (626-627), in the aftermath of the formation of the Muslim community in Medina and of such trying battles as Badr, Uḥud, and the Trench, which had left behind orphans and widows.",
    },
  },
  93: {
    slug: 'zilzal-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 99. suresidir; âlimler arasında Mekkî-Medenî oluşu tartışmalıdır (Taberî, Kurtubî ve Süyûtî Medenî; İbn Âşûr Mekkî). 8 ayettir. Kıyametin kopması, yerin içindeki ağırlıkları dışarı atması ve tüm amelleri haber vermesi anlatılır; \"zerre kadar iyilik yapan da zerre kadar kötülük yapan da karşılığını bulacaktır\" mesajıyla âhiret hesabı vurgulanır.",
      en: "The 99th sura of the Qur'an; scholars differ over whether it is Meccan or Medinan (al-Ṭabarī, al-Qurṭubī, and al-Suyūṭī hold it Medinan; Ibn ʿĀshūr, Meccan); 8 verses. It recounts the shattering of the Hour, the earth casting forth its burdens and reporting every deed, emphasising the reckoning with the message that 'whoever does the weight of an atom of good or of evil will see it'.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez.",
      en: "The article cites no specific occasion of revelation.",
    },
  },
  94: {
    slug: 'hadid-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 57. suresidir; ağırlıklı olarak Medenî (ilk dokuz ayetinin Mekkî kabul edildiği rivayet vardır), 29 ayettir. Adını 25. ayette geçen \"hadîd\" (demir) kelimesinden alır; \"Müsebbihât\" olarak anılan beş tesbih suresinin ilkidir. Allah'ın sıfatları ve kudreti; iman ve infakın gerekliliği; mümin-münafık karşılaştırması; dünya hayatının geçiciliği ve Hristiyanlıktaki ruhbanlığın eleştirisi ana temalarıdır.",
      en: "The 57th sura of the Qur'an; predominantly Medinan (some hold its first nine verses to be Meccan), 29 verses. Named for 'al-ḥadīd' (iron) in verse 25; the first of the five suras known as the 'Musabbiḥāt'. Its principal themes are the attributes and power of God; the necessity of faith and almsgiving; the comparison between believers and hypocrites; the transience of worldly life; and the critique of monasticism in Christianity.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz.",
      en: "The article transmits no specific occasion of revelation.",
    },
  },
  95: {
    slug: 'muhammed-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 47. suresidir; Medenî ve 38 ayettir. Üç bölümde işlenir: kâfirler ile müminlerin karşılaştırılması; münafıkların tavrı; samimi Müslümanlardan gayret ve fedakârlığa çağrı. Müşriklerle yürütülen mücadelenin hükümleri ve münafıkların iki yüzlülüğü ele alınır.",
      en: "The 47th sura of the Qur'an; Medinan, 38 verses. It unfolds in three parts: the comparison between the disbelievers and the believers; the stance of the hypocrites; and a summons to sincere Muslims toward striving and sacrifice. It treats rulings concerning the struggle with the polytheists and exposes the duplicity of the hypocrites.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre 13. ayet, Hz. Peygamber'in Mekke'den Medine'ye hicretinin ilk gecesinde indirilmiştir.",
      en: "According to the narration, verse 13 was revealed on the first night of the Prophet's migration from Mecca to Medina.",
    },
  },
  96: {
    slug: 'rad-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 13. suresidir; ağırlıklı olarak Mekkî olup bazı bölümlerinin Medenî olduğu tartışılmıştır, 43 ayettir. Adını 13. ayette geçen \"ra'd\" (gök gürlemesi) kelimesinden alır. Allah'ın varlığı, birliği ve kudreti; nübüvvet ve âhiret; yaratılışta görülen ilâhî işaretler; şirkin reddi; maddî mûcize taleplerine cevap; Peygamber ve müminler için sabır çağrısı ana temalarıdır.",
      en: "The 13th sura of the Qur'an; predominantly Meccan, though some portions are debated as Medinan, 43 verses. Named after 'al-raʿd' (thunder) in verse 13. Its principal themes are God's existence, oneness, and power; prophethood and the Hereafter; the divine signs manifest in creation; the refutation of polytheism; the reply to demands for material miracles; and the call to patience for the Prophet and the believers.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz; sure, ilk Müslümanların Mekke'de yoğun baskıyla karşılaştığı bir dönemin üslubunu taşır.",
      en: "The article transmits no specific occasion of revelation; the sura bears the stylistic marks of a period when the first Muslims faced intense persecution in Mecca.",
    },
  },
  97: {
    slug: 'rahman-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 55. suresidir; çoğunluğun görüşüne göre Mekkî ve 78 ayettir. \"Rahmân, Kur'an'ı öğretti; insanı yarattı, ona beyanı öğretti\" ayetiyle açılır. İki bölümden oluşur: yaratılışın düzeni, tabii olaylar, insan-cin yaratılışı ve ilâhî nimetler; kıyamet günü ve müminlerin cennet hayatının tasviri. Otuz bir defa tekrarlanan \"Rabbinizin nimetlerinden hangisini yalanlayabilirsiniz?\" ifadesi surenin belirgin üslûbudur.",
      en: "The 55th sura of the Qur'an; according to the majority Meccan, 78 verses. It opens: 'The All-Merciful taught the Qur'an; He created humankind and taught it expression.' It unfolds in two parts: the order of creation, natural phenomena, the creation of humans and jinn, and the bounties of God; and scenes of the Last Day and the Paradise-life of the believers. Its distinctive refrain — 'So which of your Lord's blessings will you deny?' — is repeated thirty-one times.",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı aktarmaz.",
      en: "The article transmits no specific occasion of revelation.",
    },
  },
  98: {
    slug: 'insan-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 76. suresidir; çoğunluğun görüşüne göre Medenî (Mekkî olduğunu savunanlar da vardır), 31 ayettir. \"Dehr\" adıyla da anılır. Adını \"insanın yaratılmadan önceki hiçliğini\" ifade eden birinci ayetten alır. İmtihan için yaratılan insanın erdemli davranışlarının nitelikleri ve âhiret nimetleri işlenir. İlk bölümde yaratılış, ikinci bölümde inkârcıların cezasıyla karşılaştırılarak \"ebrâr\" (erdemli) müminlere vaat edilen cennet nimetleri ayrıntılı biçimde sıralanır.",
      en: "The 76th sura of the Qur'an; Medinan according to the majority (with some holding it Meccan), 31 verses. Also known as 'al-Dahr'. Named after its first verse, which speaks of humankind's nothingness before creation. It treats the qualities of the virtuous conduct expected of the human being created for trial, and the blessings of the Hereafter. Its first part addresses creation; the second part, in contrast with the punishment of the deniers, offers a detailed catalogue of the Paradise-blessings promised to 'the righteous' (al-abrār).",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı zikretmez.",
      en: "The article cites no specific occasion of revelation.",
    },
  },
  99: {
    slug: 'talak-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 65. suresidir; Medenî (Medine döneminin ortasında inmiş), 12 ayettir. Boşanma hükümlerini ve kadın haklarının korunmasını işler: kocaların boşamada belirlenen kurallara uyması, iddet süresince meskenin ve nafakanın sağlanması, aile işlerinde takva yolunun gözetilmesi emredilir. İbn Mes'ûd rivayetinde \"Sûretü'n-nisâ es-suğrâ\" (Kısa Nisâ suresi) olarak da anılmıştır.",
      en: "The 65th sura of the Qur'an; Medinan (revealed mid-period), 12 verses. It treats the rules of divorce and the protection of women's rights: husbands are commanded to observe the prescribed rules in divorcing, to provide housing and maintenance during the waiting period (ʿidda), and to keep to the path of godliness in family affairs. In the tradition of Ibn Masʿūd, it is also called 'Sūrat al-nisāʾ al-ṣughrā' (the shorter chapter on women).",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü bir sebeb-i nüzul olayı belirtmez.",
      en: "The article indicates no specific occasion of revelation.",
    },
  },
  100: {
    slug: 'beyyine-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 98. suresidir; Mekke devrinin sonu veya Medine devrinin başında inmiş (her iki dönemin özelliklerini taşır), 8 ayettir. İlk beş ayet Ehl-i Kitap ve müşriklerin Peygamber'in gelişinden önceki durumunu ve beklenen samimi dindarlığı (ihlâsla Allah'a kulluk, namaz, zekât) hatırlatır; son üç ayet mümin ile kâfir arasındaki farkları ve âhiretteki âkıbetlerini ortaya koyar.",
      en: "The 98th sura of the Qur'an; revealed at the end of the Meccan period or the beginning of the Medinan (bearing the features of both), 8 verses. Its first five verses recall the condition of the People of the Book and the polytheists before the Prophet's coming and set out the genuine devotion expected — sincere worship of God, prayer, and almsgiving; its final three verses lay out the differences between the believer and the disbeliever and their destinies in the Hereafter.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre Hz. Peygamber, Übey b. Ka'b'a \"Allah sana 'Lem yekün' suresini okumamı emretti\" buyurmuş; sure bu vesileyle zikredilmiş ve Übey'e okunmuştur.",
      en: "According to the narration, the Prophet said to Ubayy b. Kaʿb, 'God has commanded me to recite to you Sūrat Lam Yakun'; the sura was then mentioned on that occasion and recited to him.",
    },
  },
  101: {
    slug: 'hasr-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 59. suresidir; Medenî, 24 ayettir; Uhud Gazvesi sonrası hicretin 4. yılında inmiştir. Benî Nadîr kabilesinin Medine'den sürgünü; müminler arasında dayanışma ve kardeşlik; münafıkların ve Yahudilerin iki yüzlülüğü; Allah'ın birliği ve yüceliği ana temalarıdır.",
      en: "The 59th sura of the Qur'an; Medinan, 24 verses; revealed in year 4 AH, after the Battle of Uḥud. Its principal themes are the expulsion of the Banū al-Naḍīr from Medina, solidarity and brotherhood among the believers, the duplicity of the hypocrites and the Jews, and the oneness and majesty of God.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, Nadîroğulları'nın Hz. Peygamber ile imzaladıkları tarafsızlık antlaşmasını bozmaları üzerine indirilmiştir: Bedir zaferi ardından tavır değiştirip Mekke müşrikleriyle ittifak yapan kabile, Medine'den sürgün edilmiş ve hadiseyi değerlendiren bu sure indirilmiştir.",
      en: "The sura was revealed after the Banū al-Naḍīr broke the non-aggression pact they had signed with the Prophet: following the victory at Badr, the tribe changed their stance and allied with the Meccan polytheists; they were expelled from Medina, and the sura was revealed as a commentary on the episode.",
    },
  },
  102: {
    slug: 'nur-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 24. suresidir; Medenî, 64 ayettir; hicretin 5. yılının sonlarında (626-627), Benî Mustalik seferinin ardından inmiştir. Bireysel, ailevî ve toplumsal hayatın edep ve ahlâk ilkelerini işler: kadın-erkek ilişkilerinde adap, ev içi görgü kuralları, toplumsal ahlâk ve \"günlük hayatın dilinde iman, inkâr ve nifak\" konuları ana eksenidir. Üç ana bölümden oluşur: zina hükümleri ve Hz. Âişe'ye yönelik İfk hadisesi; ilâhî nûr mecazı ve mümin-inkârcı karşılaştırması; ev edebi ve Peygamber'e karşı davranış edebi.",
      en: "The 24th sura of the Qur'an; Medinan, 64 verses; revealed in late year 5 AH (626-627) following the campaign of Banū al-Muṣṭaliq. It treats the etiquette and ethics of individual, family, and social life: manners between women and men, household conduct, social morality, and 'faith, disbelief, and hypocrisy as manifested in everyday life' are its main axis. It falls into three parts: the rulings on fornication and the 'Ifk' affair concerning ʿĀʾisha; the parable of the divine light and the contrast between believer and denier; and the etiquette of the home and of conduct toward the Prophet.",
    },
    event: {
      kind: 'asbab',
      tr: "Surenin önemli bir bölümü, Benî Mustalik seferi dönüşünde Hz. Âişe'ye yöneltilen iftira (İfk) hadisesi üzerine inmiştir; suçsuzluğu ayetlerle açıklanmış, iftiracılar hakkında hüküm getirilmiştir.",
      en: "A significant portion of the sura was revealed concerning the 'Ifk' — the slander directed at ʿĀʾisha on the return from the campaign of Banū al-Muṣṭaliq; verses declared her innocence and laid down the ruling on those who spread the calumny.",
    },
  },
  103: {
    slug: 'hac-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 22. suresidir; genel kabule göre 78 ayettir; Mekkî ve Medenî ayetlerin karıştığı görüşü yaygındır. Allah'ın birliği, kıyametin kopması, ölümden sonra diriliş ve hesap ön plandadır; hac ibadeti tevhid inancını yaşatan ve toplum birliğini sağlayan bir ibadet olarak tanıtılır. Dört bölüme ayrılır: kıyametin dehşeti ve tevhid (1-24); hac ve kurban (25-41); peygamberlerin direniş kıssaları (42-57); müminlere cihad ve ibadet emri (58-78).",
      en: "The 22nd sura of the Qur'an; 78 verses by the common count; widely regarded as containing both Meccan and Medinan verses. It foregrounds God's oneness, the onset of the Hour, resurrection, and reckoning; it presents the ḥajj as the rite that keeps tawḥīd alive and secures communal unity. It is in four parts: the terror of the Last Day and divine unity (1-24); ḥajj and sacrifice (25-41); the narratives of the prophets' steadfastness (42-57); and commands to the believers concerning striving and worship (58-78).",
    },
    event: {
      kind: 'general_context',
      tr: "Makale sureye özgü tek bir sebeb-i nüzul olayı zikretmez; sure, müşriklerin hacci kutsal amacından saptırarak festivale dönüştürme eğilimine karşı kapsamlı bir uyarı çerçevesinde indirilmiştir.",
      en: "The article does not cite a single specific occasion of revelation; the sura was revealed as a comprehensive admonition against the polytheists' tendency to divert the ḥajj from its sacred purpose into a festival.",
    },
  },
  104: {
    slug: 'munafikun-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 63. suresidir; Medenî ve 11 ayettir. Münafıkların iki yüzlü karakteri, dış görünüşle iç dünya arasındaki çelişki; mal ve evlat sevgisinin imandan alıkoymaması ana temalardır.",
      en: "The 63rd sura of the Qur'an; Medinan, 11 verses. Its main themes are the duplicity of the hypocrites, the contradiction between their outward show and their inner reality, and the warning that love of wealth and children must not divert one from faith.",
    },
    event: {
      kind: 'asbab',
      tr: "Surenin ilk sekiz ayeti, hicretin 5-6 yılı (626-627) Benî Mustalik Gazvesi sırasında münafıkların reisi Abdullah b. Übey'in, Ensar ile Muhacirler arasında su kuyusu üzerine çıkan tartışmada Ensar'ı tutup Muhacirleri şehirden çıkaracaklarını söylemesi üzerine inmiştir.",
      en: "The first eight verses of the sura were revealed during the campaign of Banū al-Muṣṭaliq in year 5-6 AH (626-627), after the chief of the hypocrites, ʿAbd Allāh b. Ubayy, sided with the Anṣār in a quarrel over a well between the Anṣār and the Muhājirūn and declared that they would drive the Muhājirūn out of the city.",
    },
  },
  105: {
    slug: 'mucadile-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 58. suresidir; Medenî ve 22 ayettir. \"Kad semia\" ve \"Zıhâr suresi\" olarak da anılır. Ana temaları: Câhiliye'nin zıhâr uygulamasının kaldırılması ve kefaret hükümleri; Allah ve Resûlü'ne karşı gelenlere dair uyarılar; Yahudilerle gizli ilişki içindeki münafıkların ve yeminleri aldatma aracı yapanların kınanması.",
      en: "The 58th sura of the Qur'an; Medinan, 22 verses. Also known as 'Qad Samiʿa' and 'Sūrat al-Ẓihār'. Its main themes are: the abolition of the pre-Islamic practice of ẓihār and its rulings of expiation; warnings against those who oppose God and His Messenger; and the condemnation of hypocrites in secret alliance with the Jews and of those who use oaths as a tool of deceit.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, kocası Evs b. Sâmit tarafından Câhiliye âdeti olan \"zıhâr\" yoluyla annesi gibi sayılıp haram kılınan Havle bint Sa'lebe'nin Hz. Peygamber'e gelip şikâyetini sunması üzerine indirilmiş; zıhâr uygulamasını kaldıran hükümleri getirmiştir.",
      en: "The sura was revealed after Khawla bint Thaʿlaba came to the Prophet with her complaint — her husband Aws b. al-Ṣāmit had declared her unlawful to him by the pre-Islamic rite of ẓihār, likening her to his mother; the sura brought the rulings that abolished the practice.",
    },
  },
  106: {
    slug: 'hucurat-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 49. suresidir; Medenî ve 18 ayettir; muhtemelen Feth suresinden sonra, Medine döneminin son yıllarında inmiştir. İslâmî edep ve ahlâk ilkeleri; Allah ve Peygamber'e saygı; sosyal ilişkilerde dürüstlük, adalet ve barış; insanlar arasında eşitlik, kardeşlik ve takvânın üstünlüğü ana temalarıdır.",
      en: "The 49th sura of the Qur'an; Medinan, 18 verses; likely revealed after Sūrat al-Fatḥ in the final years of the Medinan period. Its principal themes are the principles of Islamic etiquette and ethics; reverence for God and the Prophet; honesty, justice, and peace in social relations; and the equality and brotherhood of humankind together with the pre-eminence of God-consciousness (taqwā).",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre sure, Temîm oğulları kabilesinden bazı bedevîlerin Medine'ye gelerek Mescid-i Nebevî dışından yüksek sesle Peygamber'i çağırmaları ve ona karşı kaba ve saygısız tavır sergilemeleri üzerine indirilmiştir.",
      en: "According to the narration, the sura was revealed after some Bedouins from the Banū Tamīm came to Medina and, calling out to the Prophet loudly from outside the Prophet's Mosque, behaved in a coarse and disrespectful manner toward him.",
    },
  },
  107: {
    slug: 'tahrim-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 66. suresidir; Medine döneminin ikinci yarısında inmiş, 12 ayettir. \"el-Muharrime\", \"en-Nisâ\" gibi isimlerle de anılır. Üç ana bölümde işlenir: Peygamber'in eşleriyle yaşanan aile ortamı; müminler için cehennem uyarısı; tarih boyunca iyi ve kötü kadın örnekleri.",
      en: "The 66th sura of the Qur'an; revealed in the second half of the Medinan period, 12 verses. Also known by names such as 'al-Muḥarrima' and 'al-Nisāʾ'. It is presented in three main parts: the Prophet's domestic setting with his wives; a warning of Hell for the believers; and examples of virtuous and unvirtuous women drawn from history.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, Hz. Peygamber'in eşleri arasındaki kıskançlık ve bunun ardından bir ay süren aile ortamının gerilmesiyle ilgili bir yemin hadisesinin çözümü için indirilmiştir.",
      en: "The sura was revealed in response to an incident of tension within the Prophet's household — involving an oath and a month of marital strain — that arose from jealousy among his wives.",
    },
  },
  108: {
    slug: 'tegabun-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 64. suresidir; Medenî (muhtemelen ilk yıllarda inmiş), 18 ayettir. Allah'ın varlığı, peygamberlerin rolü, âhiret inancı ve dünya hayatının imtihanı; müminlere ailelerine ve topluma karşı sorumlulukları ana temalarıdır.",
      en: "The 64th sura of the Qur'an; Medinan (likely revealed in the early years), 18 verses. Its main themes are God's existence, the role of the prophets, belief in the Hereafter, and the trial of worldly life; and the duties of believers toward their families and community.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre Kureyş'in baskısı altında bazı sahâbîler Medine'ye hicret etmek istemiş fakat mal ve aile bağları sebebiyle vazgeçmiş; sonradan pişmanlık duyduklarında durumlarını ele alan ayetler inmiş ve cezalandırma yerine affedicilik ve hoşgörü tavsiye edilmiştir.",
      en: "According to the narration, some Companions wished to migrate to Medina under Qurashī pressure but drew back on account of property and family ties; when they later came to regret it, the relevant verses were revealed, counselling forbearance and forgiveness rather than punishment.",
    },
  },
  109: {
    slug: 'saf-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 61. suresidir; Medenî (Uhud Gazvesi sonrası) ve 14 ayettir. Adını 4. ayetteki \"saff\" (saf, dizi) kelimesinden alır; Hz. Îsâ ve havarilerinden bahsettiği için \"Havâriler Suresi\" olarak da anılır. Söz ile fiil arasındaki tutarlılık, nifakın reddi, İslâm'ın önceki dinlere üstünlüğü ve cihada çağrıyla zafer müjdesi ana temalarıdır.",
      en: "The 61st sura of the Qur'an; Medinan (post-Uḥud), 14 verses. Named for 'al-ṣaff' (ranks) in verse 4; also called 'Sūrat al-Ḥawāriyyīn' (Disciples' Sura) for its mention of Jesus and his disciples. Its principal themes are the consistency of word and deed, the rejection of hypocrisy, the superiority of Islam over previous faiths, and the summons to striving together with tidings of victory.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre bazı sahâbîlerin \"Allah'a en sevimli amelin hangisi olduğunu bilseydik onu yapardık\" sözleri üzerine sure indirilmiştir; ikinci ayet ise Uhud'da verdikleri sözü tutamayanlara hitap eder.",
      en: "According to the narration, the sura was revealed in response to some Companions saying, 'If we only knew which deed is most beloved to God, we would perform it'; verse 2 addresses those who failed to keep the word they had given at Uḥud.",
    },
  },
  110: {
    slug: 'cuma-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 62. suresidir; Medenî ve 11 ayettir; muhtemelen hicretin ilk yılında inmiştir. Peygamber göndermenin ilâhî hikmet ve faydaları, vahyin yol gösterici etkinliği ve cuma namazına dair bazı hükümler ana konularıdır.",
      en: "The 62nd sura of the Qur'an; Medinan, 11 verses; likely revealed in the first year after the Hijra. Its main subjects are the divine wisdom and benefits in sending a prophet, the guiding efficacy of revelation, and certain rulings concerning the Friday prayer.",
    },
    event: {
      kind: 'asbab',
      tr: "Hz. Peygamber bir cuma günü hutbe okurken Şam tarafından gelen bir kervanın davul ve gürültüsü duyulmuş; birçok sahâbî hutbeyi bırakıp ses kaynağına yönelmiş ve bu durum Hz. Peygamber'i üzmüştü. İlgili ayetler bu hadise üzerine inmiştir.",
      en: "While the Prophet was delivering the Friday sermon, the drums and commotion of a caravan arriving from Syria were heard; many Companions left the sermon and hurried toward the source of the noise, which distressed the Prophet. The corresponding verses were revealed concerning this incident.",
    },
  },
  111: {
    slug: 'feth-suresi',
    author: 'Emin Işık',
    tafsir: {
      tr: "Kur'ân'ın 48. suresidir; Medenî ve 29 ayettir; Hudeybiye Antlaşması'nın (Zilkade 6/628) ardından Hz. Peygamber ve ashabı Medine'ye dönerken yolda indirilmiştir. Müminlerin Hudeybiye'deki biatı, bedevî Arapların ikircikli tutumu ve İslâm'ın evrensel üstünlüğünün ilanı ana temalarıdır; yaklaşan zaferler müjdelenir.",
      en: "The 48th sura of the Qur'an; Medinan, 29 verses; revealed on the road as the Prophet and his Companions were returning to Medina after the Treaty of al-Ḥudaybiya (Dhū l-Qaʿda 6 / 628). Its principal themes are the believers' pledge (bayʿa) at al-Ḥudaybiya, the wavering stance of the Bedouin Arabs, and the proclamation of Islam's universal supremacy; the impending victories are heralded.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, Hudeybiye Antlaşması'nın hemen ardından, bu antlaşmayı \"apaçık bir fetih\" olarak tanımlayarak ve antlaşmanın toplumun çeşitli kesimlerindeki yansımalarını değerlendirerek indirilmiştir.",
      en: "The sura was revealed immediately after the Treaty of al-Ḥudaybiya, designating it 'a clear victory' and assessing the repercussions of the treaty across various sections of the community.",
    },
  },
  112: {
    slug: 'maide-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 5. suresidir; Medine döneminin sonlarında inmiş, 120 ayettir. İnanç ve ahlâk esasları; aile ve ceza hukuku; hac uygulamaları; şahitlik, hırsızlık, içki ve kumar hükümleri; İsrâiloğulları tarihi ile Yahudi ve Hristiyan inançlarının eleştirisi ana temalarıdır.",
      en: "The 5th sura of the Qur'an; revealed late in the Medinan period, 120 verses. Its main themes are the foundations of belief and ethics; family and penal law; the rites of ḥajj; rulings on testimony, theft, wine, and gambling; the history of the Children of Israel; and critique of Jewish and Christian doctrines.",
    },
    event: {
      kind: 'asbab',
      tr: "Rivayete göre \"Bir topluluğa duyduğunuz öfke sakın aşırı gitmenize sebep olmasın\" (5/2) ayeti, Medine'de etkili olup Müslümanlara düşmanlık besleyen bazı Yahudileri dost edinen Müslümanlar hakkında indirilmiştir.",
      en: "According to the narration, the verse 'Do not let the enmity of a people incite you to exceed the bounds' (5:2) was revealed concerning Muslims who had befriended influential Jews in Medina who were hostile to the Muslims.",
    },
  },
  113: {
    slug: 'tevbe-suresi',
    author: 'Bekir Topaloğlu',
    tafsir: {
      tr: "Kur'ân'ın 9. suresidir; Medenî ve 129 ayettir (son iki ayetin Mekkî olduğu rivayeti vardır, ancak çoğunluk tamamı Medenî kabul eder). Üç bölümde işlenir: Müslüman hâkimiyetinin ilanı ve müşriklerle ilişkilerin yeniden düzenlenmesi; münafıkların tavırları ve ruh portreleri; müminlerin vasıfları ile Allah ile aralarındaki ahit.",
      en: "The 9th sura of the Qur'an; Medinan, 129 verses (with a narration that its final two verses are Meccan, though the majority hold the whole to be Medinan). It unfolds in three parts: the proclamation of Muslim sovereignty and the restructuring of relations with the polytheists; the attitudes and inner portraits of the hypocrites; and the traits of the believers and their covenant with God.",
    },
    event: {
      kind: 'asbab',
      tr: "Sure, Fetih'ten yaklaşık on dört ay sonra (9 AH / 631), Hz. Ebû Bekir'in yönetiminde ilk İslâmî haccın gerçekleştiği sırada inmiş; Hz. Peygamber, müşrikleri ilgilendiren hükümlerini tebliğ için Hz. Ali'yi göndermiştir. Ayrıca Tebük Gazvesi sırasında münafıkların davranışlarını da ele alır.",
      en: "The sura was revealed about fourteen months after the Conquest (9 AH / 631), at the time of the first Islamic ḥajj led by Abū Bakr; the Prophet dispatched ʿAlī to proclaim its rulings concerning the polytheists. It also addresses the conduct of the hypocrites during the campaign of Tabūk.",
    },
  },
  114: {
    slug: 'nasr-suresi',
    author: 'M. Kâmil Yaşaroğlu',
    tafsir: {
      tr: "Kur'ân'ın 110. suresidir; Medenî ve 3 ayettir. Adını ilk ayetteki \"nasr\" (yardım) kelimesinden alır. İlâhî yardım ve zafer, insanların toplu olarak İslâm'a girmesi, bu nimetlere karşı Allah'a hamd ve tesbih ile mağfiret dilemek ana temalarıdır.",
      en: "The 110th sura of the Qur'an; Medinan, 3 verses. Named after 'al-naṣr' (divine help) in its first verse. Its principal themes are the coming of God's help and victory, people entering the religion of God in throngs, and — in response to these blessings — glorification, praise, and the seeking of forgiveness.",
    },
    event: {
      kind: 'general_context',
      tr: "Rivayete göre sure Hz. Peygamber'in Vedâ Haccı sırasında (10 AH, Mart 632) indirilmiş ve bütün olarak indirilen son sure olmuştur. Sureye özgü bir sebep olayı değil, nübüvvet döneminin kapanışı niteliğindedir.",
      en: "According to the narration, the sura was revealed during the Prophet's Farewell Pilgrimage (10 AH, March 632) and is regarded as the last sura revealed as a complete whole. It is not tied to a specific incident but marks the closure of the prophetic mission.",
    },
  },
};

const data = JSON.parse(readFileSync(jsonPath, 'utf8'));

let updated = 0;
for (const entry of data) {
  const v = VERIFIED[entry.id];
  if (!v) continue;
  const source = src(v.slug, v.author);
  entry.tafsir = {
    text: { tr: v.tafsir.tr, en: v.tafsir.en },
    source,
    verified: true,
  };
  entry.event = {
    kind: v.event.kind,
    text: { tr: v.event.tr, en: v.event.en },
    source,
    verified: true,
  };
  updated++;
}

writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`Updated ${updated} surah entries with verified content.`);
