/**
 * SinhalaFlix Hub - Complete Dataset
 * Sinhala Dubbed Cartoons, Movies, Teledramas, K-Dramas & Cartoon Series
 * සිංහල හඬකැවූ කාටූන්, චිත්‍රපට, ටෙලි නාට්‍ය, කොරියන් නාට්‍ය සහ කාටූන් කතා මාලා
 */

const INITIAL_CATALOG = [
  // ==========================================
  // 1. SINHALA DUBBED CARTOONS (කාටූන්)
  // ==========================================
  {
    id: "soora-pappa",
    titleSinhala: "සූර පප්පා (ඇස්ටරික්ස් සහ ඔබෙලික්ස්)",
    titleEnglish: "Soora Pappa (Asterix & Obelix)",
    singlishKeywords: ["soora pappa", "sura pappa", "asterix", "obelix", "magic potion", "jim pappa", "wedapappa", "rupavahini", "cartoon"],
    type: "series",
    category: "cartoons",
    channel: "Rupavahini",
    year: 1993,
    rating: 9.9,
    episodesCount: 12,
    badge: "සුපිරි සම්භාව්‍ය (Masterpiece)",
    badgeColor: "amber",
    audio: "සිංහල හඬ (Sinhala Stereo 2.0)",
    poster: "assets/images/soora_pappa.jpg",
    backdrop: "assets/images/banner1.jpg",
    director: "ටයිටස් තොටවත්ත (Titus Thotawatte)",
    dubTeam: "ජාතික රූපවාහිනී හඬකැවීම් ඒකකය (National Rupavahini Dubbing Unit)",
    synopsisSinhala: "රෝම අධිරාජ්‍යයට යටත් නොවූ කුඩා ගෝල් (Gaul) ගම්මානයේ සූර පප්පා, ජිම් පප්පා, වෙද පප්පා ඇතුළු පිරිස වෙද පප්පා සාදන අද්භූත බලගතු බෙහෙත් පානය කරමින් රෝම හමුදාව සමග කරන වික්‍රමාන්විත සහ හාස්‍යජනක සටන. ශ්‍රී ලාංකීය කාටූන් ඉතිහාසයේ නොමැකෙන අමරණීය නිර්මාණයකි.",
    synopsisEnglish: "The unforgettable adventures of Asterix and Obelix in Sinhala dub! Follow Soora Pappa, Jim Pappa, and Weda Pappa as they defend their unconquered Gaulish village against the Roman Empire using their legendary magic potion.",
    tags: ["කාටූන් (Cartoon)", "හාස්‍යය (Comedy)", "වික්‍රමාන්විත (Adventure)", "රූපවාහිනී සම්භාව්‍ය (TV Classic)"],
    isFeatured: true,
    trending: true,
    views: "2.4M",
    likes: "142K",
    downloadQualities: [
      { quality: "1080p FHD", size: "650 MB / Ep", ext: "MP4", bitRate: "2500 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "380 MB / Ep", ext: "MP4", bitRate: "1400 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "180 MB / Ep", ext: "MP4", bitRate: "800 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - රෝම බලකොටුව සහ අද්භූත බෙහෙත",
        titleEnglish: "Episode 01 - The Roman Fort & Magic Potion",
        duration: "24:15",
        thumbnail: "assets/images/soora_pappa.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { server: "Server 2 (Cloud Stream)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          gdrive: "https://drive.google.com/open?id=demo_soora_pappa_ep01"
        }
      },
      {
        epNumber: 2,
        titleSinhala: "02 වන කොටස - ජුලියස් සීසර්ගේ රහස් සැලසුම",
        titleEnglish: "Episode 02 - Julius Caesar's Secret Plan",
        duration: "22:40",
        thumbnail: "assets/images/banner1.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          gdrive: "https://drive.google.com/open?id=demo_soora_pappa_ep02"
        }
      },
      {
        epNumber: 3,
        titleSinhala: "03 වන කොටස - ක්ලියෝපැට්රා රැජින සහ ගෝල්වරු",
        titleEnglish: "Episode 03 - Queen Cleopatra and the Gauls",
        duration: "25:10",
        thumbnail: "assets/images/soora_pappa.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          gdrive: "https://drive.google.com/open?id=demo_soora_pappa_ep03"
        }
      }
    ]
  },
  {
    id: "dosthara-hondahitha",
    titleSinhala: "දොස්තර හොඳහිත (ඩොක්ටර් ඩූලිට්ල්)",
    titleEnglish: "Dosthara Hondahitha (Doctor Dolittle)",
    singlishKeywords: ["dosthara hondahitha", "dostara hondahita", "doctor dolittle", "cheetah", "titus thotawatte", "rupavahini", "cartoon"],
    type: "series",
    category: "cartoons",
    channel: "Rupavahini",
    year: 1991,
    rating: 9.8,
    episodesCount: 8,
    badge: "හදවත දිනූ සම්භාව්‍ය",
    badgeColor: "amber",
    audio: "සිංහල හඬ (Sinhala Stereo)",
    poster: "assets/images/dosthara.jpg",
    backdrop: "assets/images/banner2.jpg",
    director: "ටයිටස් තොටවත්ත (Titus Thotawatte)",
    dubTeam: "ජාතික රූපවාහිනී හඬකැවීම් ඒකකය",
    synopsisSinhala: "සතුන්ගේ භාෂාව තේරුම් ගෙන ඔවුන්ගේ ලෙඩදුක් සුවපත් කරන කරුණාවන්ත දොස්තර හොඳහිත සහ ඔහුගේ සත්ව මිතුරු පිරිවරගේ විස්මිත චාරිකා සහ ආදර්ශමත් කතා පෙළ.",
    synopsisEnglish: "The legendary Doctor Dolittle Sinhala dub directed by Titus Thotawatte. A beloved veterinarian who can communicate with all animals.",
    tags: ["කාටූන් (Cartoon)", "ළමා (Kids)", "සතුන් (Animals)", "සංගීතමය (Musical)"],
    isFeatured: true,
    trending: true,
    views: "1.9M",
    likes: "118K",
    downloadQualities: [
      { quality: "1080p FHD", size: "580 MB / Ep", ext: "MP4", bitRate: "2200 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "340 MB / Ep", ext: "MP4", bitRate: "1300 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "160 MB / Ep", ext: "MP4", bitRate: "750 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - සතුන්ගේ භාෂාව ඉගෙනීම",
        titleEnglish: "Episode 01 - Learning the Animal Language",
        duration: "21:30",
        thumbnail: "assets/images/dosthara.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          gdrive: "https://drive.google.com/open?id=demo_dosthara_ep01"
        }
      }
    ]
  },
  {
    id: "pissu-poosa",
    titleSinhala: "පිස්සු පූසා (ටොප් කැට්)",
    titleEnglish: "Pissu Poosa (Top Cat Sinhala Dub)",
    singlishKeywords: ["pissu poosa", "top cat", "officer dibble", "rupavahini", "titus thotawatte", "cartoon"],
    type: "series",
    category: "cartoons",
    channel: "Rupavahini",
    year: 1994,
    rating: 9.7,
    episodesCount: 15,
    badge: "හාස්‍යයේ රජු",
    badgeColor: "amber",
    audio: "සිංහල හඬ (Sinhala Stereo)",
    poster: "assets/images/banner1.jpg",
    backdrop: "assets/images/banner1.jpg",
    director: "ටයිටස් තොටවත්ත",
    dubTeam: "ජාතික රූපවාහිනී හඬකැවීම් ඒකකය",
    synopsisSinhala: "නගරයේ වීදි පාලනය කරන කපටි බළල් කල්ලියේ නායක පිස්සු පූසා සහ ඔහුගේ සගයන් පොලිස් නිලධාරී ඩිබල් මහතා සමග කරන හාස්‍යජනක ගැටුම්.",
    synopsisEnglish: "Top Cat and his alley cats crew in the unforgettable Sinhala dub with hilarious witty dialogues and timeless Sri Lankan dubbing.",
    tags: ["කාටූන් (Cartoon)", "හාස්‍යය (Comedy)", "නගර ජීවිතය (City Life)"],
    isFeatured: false,
    trending: true,
    views: "1.6M",
    likes: "95K",
    downloadQualities: [
      { quality: "720p HD", size: "310 MB / Ep", ext: "MP4", bitRate: "1200 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "140 MB / Ep", ext: "MP4", bitRate: "650 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - වීදියේ අලුත් නීතිය",
        titleEnglish: "Episode 01 - The New Law of the Street",
        duration: "20:45",
        thumbnail: "assets/images/banner1.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
        ],
        downloads: {
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          gdrive: "https://drive.google.com/open?id=demo_pissu_poosa_ep01"
        }
      }
    ]
  },
  {
    id: "giripura-aththo",
    titleSinhala: "ගිරිපුර ඇත්තෝ (ද ෆ්ලින්ට්ස්ටෝන්ස්)",
    titleEnglish: "Giripura Aththo (The Flintstones)",
    singlishKeywords: ["giripura aththo", "flintstones", "fred flintstone", "barney rubble", "sirasa tv", "cartoon"],
    type: "series",
    category: "cartoons",
    channel: "Sirasa TV",
    year: 1997,
    rating: 9.6,
    episodesCount: 10,
    badge: "ප්‍රාග් ඓතිහාසික හාස්‍යය",
    badgeColor: "amber",
    audio: "සිංහල හඬ (Sinhala Stereo)",
    poster: "assets/images/banner2.jpg",
    backdrop: "assets/images/banner2.jpg",
    director: "සිරස TV හඬකැවීම් කණ්ඩායම",
    dubTeam: "Sirasa TV Dubbing Team",
    synopsisSinhala: "ශිලා යුගයේ ගිරිපුර ජීවත්වන ෆ්‍රෙඩ්, බාර්නි, විල්මා සහ බෙටී ඩයිනෝසරයන් සහ ගල් මෙවලම් භාවිත කරමින් ගෙවන අතිශය විනෝදාත්මක පවුල් ජීවිතය.",
    synopsisEnglish: "The prehistoric adventures of Fred and Barney in Bedrock, masterfully localized into Sinhala as Giripura Aththo.",
    tags: ["කාටූන් (Cartoon)", "හාස්‍යය (Comedy)", "ශිලා යුගය (Stone Age)"],
    isFeatured: false,
    trending: false,
    views: "1.3M",
    likes: "72K",
    downloadQualities: [
      { quality: "720p HD", size: "350 MB / Ep", ext: "MP4", bitRate: "1250 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "160 MB / Ep", ext: "MP4", bitRate: "700 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - ගල් යුගයේ නව රැකියාව",
        titleEnglish: "Episode 01 - The Stone Age Job",
        duration: "22:30",
        thumbnail: "assets/images/banner2.jpg",
        streamSources: [
          { server: "Server 1 (HD)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
        ],
        downloads: {
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          gdrive: "https://drive.google.com/open?id=demo_giripura_ep01"
        }
      }
    ]
  },

  // ==========================================
  // 2. SINHALA DUBBED K-DRAMAS (කොරියන් නාට්‍ය)
  // ==========================================
  {
    id: "sujatha-diyaniya",
    titleSinhala: "සුජාත දියණිය (දේ ජැන්ග් ගුම් / Jewel in the Palace)",
    titleEnglish: "Sujatha Diyaniya (Jewel in the Palace / Dae Jang Geum)",
    singlishKeywords: ["sujatha diyaniya", "jewel in the palace", "dae jang geum", "jang geum", "korean drama", "kdrama", "rupavahini", "royal kitchen", "min jung ho"],
    type: "series",
    category: "kdramas",
    channel: "Rupavahini",
    year: 2012,
    rating: 9.9,
    episodesCount: 54,
    badge: "ශ්‍රී ලංකාවේ අංක 1 K-Drama (Mega Hit)",
    badgeColor: "rose",
    audio: "සිංහල හඬකැවීම (Sinhala 5.1 & 2.0)",
    poster: "assets/images/sujatha_diyaniya.jpg",
    backdrop: "assets/images/sujatha_diyaniya.jpg",
    director: "ජාතික රූපවාහිනී හඬකැවීම් මණ්ඩලය",
    dubTeam: "National Rupavahini Dubbing Unit (Voice of Jang Geum)",
    synopsisSinhala: "ජොසොන් රාජ්‍ය සමයේ රාජකීය මුළුතැන්ගෙයි කෝකියෙකු ලෙස සේවයට එක්වී, විවිධ කුමන්ත්‍රණ සහ බාධක මැද ඉවසිලිවන්තව හා ඥානාන්විතව සටන් කරමින් කොරියානු ඉතිහාසයේ ප්‍රථම රාජකීය ප්‍රධාන වෛද්‍යවරිය (දේ ජැන්ග් ගුම්) බවට පත්වන ජැන්ගුමිගේ අසමසම සත්‍ය කතාව. ශ්‍රී ලංකාවේ වැඩිම පිරිසක් නැරඹූ විදේශීය නාට්‍ය මාලාව!",
    synopsisEnglish: "The iconic masterpiece historical K-Drama 'Jewel in the Palace' dubbed in Sinhala as 'Sujatha Diyaniya'. Follow Jang Geum's inspiring journey from an orphaned palace cook apprentice to the King's first female supreme royal physician.",
    tags: ["කොරියන් නාට්‍ය (K-Drama)", "ඉතිහාසය (Historical)", "රාජකීය (Royal)", "වෛද්‍ය (Medical)", "නාට්‍යමය (Drama)"],
    isFeatured: true,
    trending: true,
    views: "4.8M",
    likes: "320K",
    downloadQualities: [
      { quality: "1080p FHD", size: "850 MB / Ep", ext: "MP4", bitRate: "2800 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "450 MB / Ep", ext: "MP4", bitRate: "1600 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "220 MB / Ep", ext: "MP4", bitRate: "850 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - රහසිගත රාජකීය අණ සහ ජැන්ගුමිගේ උපත",
        titleEnglish: "Episode 01 - The Royal Secret & Birth of Jang Geum",
        duration: "52:10",
        thumbnail: "assets/images/sujatha_diyaniya.jpg",
        streamSources: [
          { server: "Server 1 (FHD High Speed)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { server: "Server 2 (Backup Stream)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          gdrive: "https://drive.google.com/open?id=demo_sujatha_diyaniya_ep01"
        }
      },
      {
        epNumber: 2,
        titleSinhala: "02 වන කොටස - රාජකීය මුළුතැන්ගෙට පිවිසීම",
        titleEnglish: "Episode 02 - Entry to the Royal Kitchen",
        duration: "50:45",
        thumbnail: "assets/images/sujatha_diyaniya.jpg",
        streamSources: [
          { server: "Server 1 (FHD High Speed)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          gdrive: "https://drive.google.com/open?id=demo_sujatha_diyaniya_ep02"
        }
      },
      {
        epNumber: 3,
        titleSinhala: "03 වන කොටස - කුළුබඩු තරගය සහ කුමන්ත්‍රණය",
        titleEnglish: "Episode 03 - The Culinary Contest & Royal Scheme",
        duration: "51:20",
        thumbnail: "assets/images/sujatha_diyaniya.jpg",
        streamSources: [
          { server: "Server 1 (FHD High Speed)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          gdrive: "https://drive.google.com/open?id=demo_sujatha_diyaniya_ep03"
        }
      }
    ]
  },
  {
    id: "abhitha-diyaniya",
    titleSinhala: "අභීත දියණිය (දොං යී / Dong Yi)",
    titleEnglish: "Abhitha Diyaniya (Dong Yi - The Inspiring Lady)",
    singlishKeywords: ["abhitha diyaniya", "dong yi", "sukjong", "korean drama", "kdrama", "rupavahini", "queen inhyun", "lady jang"],
    type: "series",
    category: "kdramas",
    channel: "Rupavahini",
    year: 2013,
    rating: 9.8,
    episodesCount: 60,
    badge: "සුවිශේෂී කොරියන් සම්ප්‍රදාය",
    badgeColor: "rose",
    audio: "සිංහල හඬකැවීම (Sinhala Stereo)",
    poster: "assets/images/sujatha_diyaniya.jpg",
    backdrop: "assets/images/sujatha_diyaniya.jpg",
    director: "ජාතික රූපවාහිනී හඬකැවීම් ඒකකය",
    dubTeam: "Rupavahini Dubbing Guild",
    synopsisSinhala: "පහත් කුලයක උපත ලබා, පසුව රාජකීය සංගීත අංශයේ සේවිකාවක් වී රජුගේ විශ්වාසය දිනාගෙන ජොසොන් රාජ්‍යයේ බලවත්ම හා දයාබරම රාජකීය බිසව බවට පත්වන දොං යී ගේ වික්‍රමාන්විත කතා ප්‍රවෘත්තිය.",
    synopsisEnglish: "Dong Yi Sinhala dubbed television series. Set during the reign of King Sukjong in the Joseon dynasty, focusing on Dong Yi who rises from a water maid to Royal Noble Consort.",
    tags: ["කොරියන් නාට්‍ය (K-Drama)", "ඉතිහාසය (Historical)", "ආදර කතා (Romance)", "කුමන්ත්‍රණ (Mystery)"],
    isFeatured: false,
    trending: true,
    views: "3.2M",
    likes: "210K",
    downloadQualities: [
      { quality: "1080p FHD", size: "820 MB / Ep", ext: "MP4", bitRate: "2600 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "420 MB / Ep", ext: "MP4", bitRate: "1500 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "200 MB / Ep", ext: "MP4", bitRate: "800 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - රහස් සංගමයේ සෙවණැල්ල",
        titleEnglish: "Episode 01 - The Shadow of the Secret Society",
        duration: "55:00",
        thumbnail: "assets/images/sujatha_diyaniya.jpg",
        streamSources: [
          { server: "Server 1 (FHD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          gdrive: "https://drive.google.com/open?id=demo_dong_yi_ep01"
        }
      }
    ]
  },
  {
    id: "sihina-kumariya",
    titleSinhala: "සිහින කුමාරිය (එම්ප්‍රස් කී / Empress Ki)",
    titleEnglish: "Sihina Kumariya (Empress Ki Sinhala Dub)",
    singlishKeywords: ["sihina kumariya", "empress ki", "ha ji won", "ji chang wook", "sirasa tv", "kdrama", "korean drama", "yuan empire"],
    type: "series",
    category: "kdramas",
    channel: "Sirasa TV",
    year: 2016,
    rating: 9.7,
    episodesCount: 51,
    badge: "සිරස K-Drama Mega Hit",
    badgeColor: "rose",
    audio: "සිංහල හඬ (Sinhala Stereo)",
    poster: "assets/images/banner1.jpg",
    backdrop: "assets/images/banner1.jpg",
    director: "සිරස TV හඬකැවීම් අංශය",
    dubTeam: "Sirasa Dubbing Division",
    synopsisSinhala: "ගෝර්යෝ දේශයේ සාමාන්‍ය දැරියක ලෙස ඉපිද, අනේක විධ දුක් ගැහැට මැද යුවාන් අධිරාජ්‍යයේ බලගතුම අධිරාජිනිය බවට පත්වන කී සුන්-න්‍යෑං ගේ යුධමය හා දේශපාලනික සටන.",
    synopsisEnglish: "The story of Empress Ki, a Goryeo-born woman who navigates the cutthroat politics and wars of the Yuan dynasty to become the supreme Empress.",
    tags: ["කොරියන් නාට්‍ය (K-Drama)", "යුධමය (Action)", "රාජකීය (Royal)", "ආදරය (Romance)"],
    isFeatured: false,
    trending: true,
    views: "2.7M",
    likes: "185K",
    downloadQualities: [
      { quality: "720p HD", size: "460 MB / Ep", ext: "MP4", bitRate: "1600 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "210 MB / Ep", ext: "MP4", bitRate: "800 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - රහස් දුනුවායා",
        titleEnglish: "Episode 01 - The Jackal Archer",
        duration: "58:15",
        thumbnail: "assets/images/banner1.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
        ],
        downloads: {
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          gdrive: "https://drive.google.com/open?id=demo_empress_ki_ep01"
        }
      }
    ]
  },

  // ==========================================
  // 3. SINHALA TELEDRAMAS (ශ්‍රී ලාංකීය ටෙලි නාට්‍ය)
  // ==========================================
  {
    id: "koombiyo",
    titleSinhala: "කූඹියෝ (Koombiyo - The Mastermind)",
    titleEnglish: "Koombiyo (The Mastermind Crime Thriller)",
    singlishKeywords: ["koombiyo", "kumbiyo", "jehan fernando", "priyantha mahaulpathagama", "lakmal dharmarathna", "crime thriller", "teledrama", "itn", "hiru tv"],
    type: "series",
    category: "teledramas",
    channel: "ITN",
    year: 2017,
    rating: 9.9,
    episodesCount: 57,
    badge: "ශ්‍රී ලාංකීය ටෙලි ඉතිහාසයේ විප්ලවය",
    badgeColor: "emerald",
    audio: "Sinhala Original HD Audio",
    poster: "assets/images/koombiyo.jpg",
    backdrop: "assets/images/koombiyo.jpg",
    director: "ලක්මාල් ධර්මරත්න (Lakmal Dharmarathna)",
    dubTeam: "Original Cast (Thumindu Dodantenna, Kalana Gunasekara)",
    synopsisSinhala: "කොළඹ නගරයේ සංකීර්ණ සමාජ හා දේශපාලන ක්‍රමවේදයන් සියුම් ලෙස උපයෝගී කරගනිමින් විවිධ අපරාධ සැලසුම් සහ වංචා සිදුකරන අතිදක්ෂ බුද්ධිමතෙකු වන ජෙහාන් ප්‍රනාන්දු සහ ඔහුට හමුවන අහිංසක ගැමි තරුණයෙකු වන ප්‍රියන්ත මහඋල්පතගම වටා ගෙතුණු සර්වකාලීන විශිෂ්ටතම සිංහල ත්‍රිලර් ටෙලි නාට්‍යය.",
    synopsisEnglish: "Sri Lanka's top-rated neo-noir crime thriller television series. Follows Jehan Fernando, a street-smart mastermind who exploits socioeconomic loopholes with meticulously crafted plans alongside innocent villager Priyantha.",
    tags: ["ටෙලි නාට්‍ය (Teledrama)", "අපරාධ (Crime)", "ත්‍රිලර් (Thriller)", "දේශපාලන (Political)", "සම්භාව්‍ය (Classic)"],
    isFeatured: true,
    trending: true,
    views: "5.1M",
    likes: "410K",
    downloadQualities: [
      { quality: "1080p FHD", size: "750 MB / Ep", ext: "MP4", bitRate: "2600 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "390 MB / Ep", ext: "MP4", bitRate: "1400 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "190 MB / Ep", ext: "MP4", bitRate: "750 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - කොළඹට පැමිණීම සහ ජෙහාන් හමුවීම",
        titleEnglish: "Episode 01 - Arrival in Colombo & Meeting Jehan",
        duration: "24:10",
        thumbnail: "assets/images/koombiyo.jpg",
        streamSources: [
          { server: "Server 1 (FHD High Speed)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { server: "Server 2 (Backup Stream)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          gdrive: "https://drive.google.com/open?id=demo_koombiyo_ep01"
        }
      },
      {
        epNumber: 2,
        titleSinhala: "02 වන කොටස - සැලසුම් සහගත කුමන්ත්‍රණය",
        titleEnglish: "Episode 02 - The Master Plan",
        duration: "23:45",
        thumbnail: "assets/images/koombiyo.jpg",
        streamSources: [
          { server: "Server 1 (FHD High Speed)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          gdrive: "https://drive.google.com/open?id=demo_koombiyo_ep02"
        }
      }
    ]
  },
  {
    id: "nadagamkarayo",
    titleSinhala: "නාඩගම්කාරයෝ (Nadagamkarayo)",
    titleEnglish: "Nadagamkarayo (The Stage Players)",
    singlishKeywords: ["nadagamkarayo", "sara", "kalan", "kukul chaminda", "swarnavahini", "teledrama", "sivagurunathan", "sadun rajakaruna"],
    type: "series",
    category: "teledramas",
    channel: "Swarnavahini",
    year: 2021,
    rating: 9.7,
    episodesCount: 120,
    badge: "ස්වර්ණවාහිනී සම්මානනීය නාට්‍යය",
    badgeColor: "emerald",
    audio: "Sinhala Original Stereo",
    poster: "assets/images/banner2.jpg",
    backdrop: "assets/images/banner2.jpg",
    director: "ජයප්‍රකාශ් සිවගුරුනාදන් (Sivagurunathan)",
    dubTeam: "Original Cast (Sajitha Anuththara, Kokila Pawan)",
    synopsisSinhala: "කුඩා ගම්මානයක ජීවත්වන සරා, කවඩියා, සුද්දා සහ මාලන් ඇතුළු දඟකාර තරුණයන් පිරිස නාඩගම් කලාව හරහා තම ජීවිතය වෙනස් කරගන්නා ආකාරය දැක්වෙන හාස්‍යය හා සංවේදී හැඟීම් පිරි අතිශය ජනප්‍රිය ටෙලි නාට්‍යය.",
    synopsisEnglish: "A widely acclaimed Sri Lankan drama about a group of wayward village youth who discover theater and nadagama folk music to transform their destiny.",
    tags: ["ටෙලි නාට්‍ය (Teledrama)", "හාස්‍යය (Comedy)", "නාට්‍ය කලාව (Arts)", "ග්‍රාමීය (Village)"],
    isFeatured: false,
    trending: true,
    views: "3.9M",
    likes: "270K",
    downloadQualities: [
      { quality: "1080p FHD", size: "700 MB / Ep", ext: "MP4", bitRate: "2500 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "360 MB / Ep", ext: "MP4", bitRate: "1350 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "170 MB / Ep", ext: "MP4", bitRate: "700 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - ගමේ චණ්ඩින් සහ නාඩගම් ගුරු",
        titleEnglish: "Episode 01 - The Village Misfits & The Master",
        duration: "25:30",
        thumbnail: "assets/images/banner2.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          gdrive: "https://drive.google.com/open?id=demo_nadagamkarayo_ep01"
        }
      }
    ]
  },
  {
    id: "dandubasnamanaya",
    titleSinhala: "දඬුබස්නාමානය (Dandubasnamanaya)",
    titleEnglish: "Dandubasnamanaya (The Angampora Legend)",
    singlishKeywords: ["dandubasnamanaya", "jayantha chandrasiri", "angampora", "martial arts", "rupavahini", "teledrama", "kamal addararachchi"],
    type: "series",
    category: "teledramas",
    channel: "Rupavahini",
    year: 1995,
    rating: 9.9,
    episodesCount: 22,
    badge: "අංගම්පොර සටන් කලා අභිමානය",
    badgeColor: "emerald",
    audio: "Sinhala Original Studio Audio",
    poster: "assets/images/banner1.jpg",
    backdrop: "assets/images/banner1.jpg",
    director: "ජයන්ත චන්ද්‍රසිරි (Jayantha Chandrasiri)",
    dubTeam: "Original Cast (Kamal Addararachchi, Sriyantha Mendis, Damitha Abeyratne)",
    synopsisSinhala: "හෙළයේ පාරම්පරික අංගම්පොර සටන් කලාවේ විස්මිත ශිල්ප ක්‍රම, රහස් මන්ත්‍ර ශාස්ත්‍රය සහ දේශීය සංස්කෘතික ගැටුම් පසුබිම් කරගනිමින් ජයන්ත චන්ද්‍රසිරි විසින් අධ්‍යක්ෂණය කළ විශිෂ්ටතම ඓතිහාසික කෘතිය.",
    synopsisEnglish: "Jayantha Chandrasiri's iconic historical masterpiece exploring the ancient indigenous martial art of Angampora, occult powers, and spiritual discipline.",
    tags: ["ටෙලි නාට්‍ය (Teledrama)", "අංගම්පොර (Angampora)", "ඉතිහාසය (History)", "සටන් කලා (Martial Arts)"],
    isFeatured: false,
    trending: false,
    views: "2.1M",
    likes: "155K",
    downloadQualities: [
      { quality: "720p HD", size: "380 MB / Ep", ext: "MP4", bitRate: "1400 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "180 MB / Ep", ext: "MP4", bitRate: "750 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - අංගම් මඩුවේ ආරම්භය",
        titleEnglish: "Episode 01 - The Origin of Angam Arena",
        duration: "26:10",
        thumbnail: "assets/images/banner1.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
        ],
        downloads: {
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          gdrive: "https://drive.google.com/open?id=demo_dandubasnamanaya_ep01"
        }
      }
    ]
  },

  // ==========================================
  // 4. SINHALA DUBBED MOVIES (සිංහල චිත්‍රපට)
  // ==========================================
  {
    id: "lion-king-sinhala",
    titleSinhala: "සිංහ රාජා (ද ලයන් කිං සිංහල හඬ)",
    titleEnglish: "The Lion King (Sinhala Dubbed Movie)",
    singlishKeywords: ["the lion king", "lion king sinhala", "sinha raja", "simba", "mufasa", "scar", "hakuna matata", "disney sinhala", "movie"],
    type: "movie",
    category: "movies",
    channel: "Sirasa TV",
    year: 1994,
    rating: 9.8,
    episodesCount: 1,
    badge: "Disney සිංහල සම්භාව්‍ය",
    badgeColor: "cyan",
    audio: "සිංහල සිනමා හඬ (Sinhala 5.1 Surround)",
    poster: "assets/images/banner1.jpg",
    backdrop: "assets/images/banner1.jpg",
    director: "සිරස TV & ස්ටුඩියෝ හඬකැවීම් කණ්ඩායම",
    dubTeam: "Sri Lanka Professional Voice Guild",
    synopsisSinhala: "සවානා තණබිමේ රජු වන මුෆාසාගේ පුත් සිම්බා, සිය දුෂ්ට මාමා වන ස්කාර්ගේ කෲර කුමන්ත්‍රණයෙන් පසුව පිටුවහල්ව ගොස්, ටිමොන් සහ පුම්බාගේ මිත්‍රත්වයෙන් නැවත පැමිණ සිය රාජධානිය දිනාගන්නා අමරණීය සිනමා කාව්‍යය.",
    synopsisEnglish: "The epic Disney animated film in full Sinhala dubbed audio. Witness Simba's heroic journey from exile back to Pride Rock to claim his rightful destiny as King.",
    tags: ["චිත්‍රපට (Movie)", "Disney (ඇනිමේෂන්)", "පවුලේ (Family)", "සංගීතමය (Musical)"],
    isFeatured: true,
    trending: true,
    views: "3.4M",
    likes: "260K",
    downloadQualities: [
      { quality: "1080p FHD", size: "2.1 GB", ext: "MP4", bitRate: "3500 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "1.2 GB", ext: "MP4", bitRate: "1800 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "580 MB", ext: "MP4", bitRate: "900 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "සම්පූර්ණ චිත්‍රපටය - සිංහල හඬ",
        titleEnglish: "Full Movie - Sinhala Dubbed 1080p",
        duration: "01:28:40",
        thumbnail: "assets/images/banner1.jpg",
        streamSources: [
          { server: "Server 1 (1080p FHD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { server: "Server 2 (720p HD Fast)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          gdrive: "https://drive.google.com/open?id=demo_lion_king_sinhala"
        }
      }
    ]
  },
  {
    id: "kung-fu-panda-sinhala",
    titleSinhala: "කුංෆු පැන්ඩා (සිංහල හඬකැවීම)",
    titleEnglish: "Kung Fu Panda (Sinhala Dubbed Movie)",
    singlishKeywords: ["kung fu panda", "po", "shifu", "tai lung", "dragon warrior", "sinhala movie", "movie"],
    type: "movie",
    category: "movies",
    channel: "Studio Dub",
    year: 2008,
    rating: 9.6,
    episodesCount: 1,
    badge: "සුපිරි සටන් හාස්‍යය",
    badgeColor: "cyan",
    audio: "සිංහල හඬ (Sinhala 5.1 & Stereo)",
    poster: "assets/images/banner2.jpg",
    backdrop: "assets/images/banner2.jpg",
    director: "Studio Dubbing Guild",
    dubTeam: "Sri Lanka Pro Animation Dub",
    synopsisSinhala: "නූඩ්ල්ස් සාප්පුවේ සේවය කරන කම්මැලි පෝ නැමැති පැන්ඩා අහම්බෙන් මහා මකර රණශූරයා ලෙස තේරීපත්ව, ශිෆු ගුරුතුමා යටතේ කුංෆු සටන් ශිල්පය ප්‍රගුණ කර තායි ලුන්ග් පරදා නිම්නය බේරාගන්නා විනෝදජනක කතාව.",
    synopsisEnglish: "Po the panda embarks on a hilarious journey to fulfill an ancient martial arts prophecy and become the revered Dragon Warrior in Sinhala dub.",
    tags: ["චිත්‍රපට (Movie)", "සටන් (Kung Fu)", "හාස්‍යය (Comedy)", "ඇනිමේෂන් (Animation)"],
    isFeatured: false,
    trending: true,
    views: "2.8M",
    likes: "198K",
    downloadQualities: [
      { quality: "1080p FHD", size: "1.9 GB", ext: "MP4", bitRate: "3200 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "1.1 GB", ext: "MP4", bitRate: "1700 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "520 MB", ext: "MP4", bitRate: "850 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "සම්පූර්ණ චිත්‍රපටය - සිංහල හඬ",
        titleEnglish: "Full Movie - Sinhala Dubbed 1080p",
        duration: "01:32:15",
        thumbnail: "assets/images/banner2.jpg",
        streamSources: [
          { server: "Server 1 (FHD High Speed)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          gdrive: "https://drive.google.com/open?id=demo_kung_fu_panda_sinhala"
        }
      }
    ]
  },

  // ==========================================
  // 5. CARTOON SERIES (කාටූන් කතා මාලා)
  // ==========================================
  {
    id: "ben-10-sinhala",
    titleSinhala: "බෙන් 10 (ඔම්නිට්‍රික්ස් පිටසක්වල බලය)",
    titleEnglish: "Ben 10 (Sinhala Dubbed Cartoon Series)",
    singlishKeywords: ["ben 10", "omnitrix", "ben tennyson", "gwen", "grandpa max", "heatblast", "four arms", "sirasa tv", "cartoon series"],
    type: "series",
    category: "cartoon_series",
    channel: "Sirasa TV",
    year: 2005,
    rating: 9.8,
    episodesCount: 20,
    badge: "පිටසක්වල සුපිරි වීරයා",
    badgeColor: "purple",
    audio: "සිංහල හඬ (Sinhala Stereo)",
    poster: "assets/images/dosthara.jpg",
    backdrop: "assets/images/banner1.jpg",
    director: "සිරස TV හඬකැවීම් ඒකකය",
    dubTeam: "Sirasa Dubbing Production",
    synopsisSinhala: "ගිම්හාන නිවාඩුව ගත කරන අතරතුර අද්භූත පිටසක්වල ඔරලෝසුවක් (Omnitrix) හමුවන බෙන් ටෙනිසන්, විවිධ බලගතු පිටසක්වල ජීවීන් බවට පරිවර්තනය වෙමින් ලෝකය විලීන කිරීමට පැමිණෙන විල්ගැක්ස් ඇතුළු දුෂ්ටයන්ගෙන් පෘථිවිය බේරාගැනීමේ වික්‍රමය.",
    synopsisEnglish: "Ben Tennyson discovers the powerful Omnitrix device which allows him to transform into 10 different alien heroes. Dubbed in Sinhala on Sirasa TV.",
    tags: ["කාටූන් කතා මාලා (Series)", "සුපිරි වීර (Superhero)", "විද්‍යා ප්‍රබන්ධ (Sci-Fi)", "ක්‍රියාදාම (Action)"],
    isFeatured: true,
    trending: true,
    views: "3.6M",
    likes: "290K",
    downloadQualities: [
      { quality: "1080p FHD", size: "520 MB / Ep", ext: "MP4", bitRate: "2400 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "290 MB / Ep", ext: "MP4", bitRate: "1300 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "140 MB / Ep", ext: "MP4", bitRate: "700 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - ඔම්නිට්‍රික්ස් ඔරලෝසුව සොයාගැනීම",
        titleEnglish: "Episode 01 - And Then There Were 10",
        duration: "22:15",
        thumbnail: "assets/images/dosthara.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          gdrive: "https://drive.google.com/open?id=demo_ben10_ep01"
        }
      },
      {
        epNumber: 2,
        titleSinhala: "02 වන කොටස - ගිනිකඳු බලය සහ විල්ගැක්ස්",
        titleEnglish: "Episode 02 - Washington B.C. & The Battle",
        duration: "21:50",
        thumbnail: "assets/images/banner1.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          gdrive: "https://drive.google.com/open?id=demo_ben10_ep02"
        }
      }
    ]
  },
  {
    id: "avatar-sinhala",
    titleSinhala: "ඇවටාර් (ද ලාස්ට් එයාර්බෙන්ඩර් සිංහල හඬ)",
    titleEnglish: "Avatar: The Last Airbender (Sinhala Dubbed Series)",
    singlishKeywords: ["avatar the last airbender", "aang", "katara", "sokka", "zuko", "fire nation", "air nomad", "sirasa tv", "cartoon series"],
    type: "series",
    category: "cartoon_series",
    channel: "Sirasa TV",
    year: 2007,
    rating: 9.9,
    episodesCount: 20,
    badge: "විශ්වයේ ශ්‍රේෂ්ඨතම ඇනිමේෂන් මාලාව",
    badgeColor: "purple",
    audio: "සිංහල හඬ (Sinhala Stereo 2.0)",
    poster: "assets/images/banner2.jpg",
    backdrop: "assets/images/banner2.jpg",
    director: "සිරස TV හඬකැවීම් මණ්ඩලය",
    dubTeam: "Sirasa Voice Unit",
    synopsisSinhala: "ජලය, පොළොව, ගින්දර සහ සුළඟ යන මූලද්‍රව්‍ය හතරම පාලනය කළ හැකි අවසන් සුළං පාලකයා වන ආං (Aang), ගිනි දේශයේ ආක්‍රමණිකයන් පරදවා ලෝක සාමය උදාකිරීම සඳහා කරන මහා වික්‍රමාන්විත ගමන.",
    synopsisEnglish: "In a war-torn world of elemental magic, a young boy named Aang reawakens to undertake a dangerous mystic quest to fulfill his destiny as the Avatar.",
    tags: ["කාටූන් කතා මාලා (Series)", "ඇනිමේ (Anime)", "වික්‍රමාන්විත (Adventure)", "ක්‍රියාදාම (Action)"],
    isFeatured: false,
    trending: true,
    views: "2.9M",
    likes: "245K",
    downloadQualities: [
      { quality: "1080p FHD", size: "600 MB / Ep", ext: "MP4", bitRate: "2500 kbps", speed: "Ultra Fast" },
      { quality: "720p HD", size: "320 MB / Ep", ext: "MP4", bitRate: "1350 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "150 MB / Ep", ext: "MP4", bitRate: "700 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - අයිස් කුට්ටියෙන් මතුවූ පිරිමි ළමයා",
        titleEnglish: "Episode 01 - The Boy in the Iceberg",
        duration: "23:40",
        thumbnail: "assets/images/banner2.jpg",
        streamSources: [
          { server: "Server 1 (HD Direct)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
        ],
        downloads: {
          fhd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          gdrive: "https://drive.google.com/open?id=demo_avatar_ep01"
        }
      }
    ]
  },
  {
    id: "tintin-sinhala",
    titleSinhala: "ටින්ටින්ගේ වික්‍රම (ද ඇඩ්වෙන්චර්ස් ඔෆ් ටින්ටින්)",
    titleEnglish: "The Adventures of Tintin (Sinhala Dubbed)",
    singlishKeywords: ["tintin", "snowy", "captain haddock", "thomson and thompson", "sirasa tv", "rupavahini", "cartoon series"],
    type: "series",
    category: "cartoon_series",
    channel: "Sirasa TV",
    year: 1992,
    rating: 9.8,
    episodesCount: 16,
    badge: "ගවේෂණාත්මක සම්භාව්‍ය",
    badgeColor: "purple",
    audio: "සිංහල හඬ (Sinhala Stereo)",
    poster: "assets/images/soora_pappa.jpg",
    backdrop: "assets/images/banner1.jpg",
    director: "සිරස TV හඬකැවීම් අංශය",
    dubTeam: "Sirasa Voice Studio",
    synopsisSinhala: "තරුණ මාධ්‍යවේදී ටින්ටින්, ඔහුගේ සුරතල් බල්ලා ස්නෝවී සහ කැප්ටන් හැඩොක් ලොව පුරා අභිරහස්, පුරාවිද්‍යා නිධාන හා අපරාධ සොයා යන අසමසම වික්‍රමාන්විත කතා මාලාව.",
    synopsisEnglish: "The world-famous Belgian comic series adapted into a magnificent animated series with Sinhala dubbing.",
    tags: ["කාටූන් කතා මාලා (Series)", "අභිරහස් (Mystery)", "වික්‍රමාන්විත (Adventure)"],
    isFeatured: false,
    trending: false,
    views: "1.7M",
    likes: "112K",
    downloadQualities: [
      { quality: "720p HD", size: "340 MB / Ep", ext: "MP4", bitRate: "1300 kbps", speed: "Recommended" },
      { quality: "480p SD", size: "160 MB / Ep", ext: "MP4", bitRate: "700 kbps", speed: "Data Saver" }
    ],
    episodes: [
      {
        epNumber: 1,
        titleSinhala: "01 වන කොටස - රන් අඬුව සහිත කකුළුවා",
        titleEnglish: "Episode 01 - The Crab with the Golden Claws",
        duration: "24:00",
        thumbnail: "assets/images/soora_pappa.jpg",
        streamSources: [
          { server: "Server 1 (HD)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
        ],
        downloads: {
          hd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          sd: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          gdrive: "https://drive.google.com/open?id=demo_tintin_ep01"
        }
      }
    ]
  }
];

const INITIAL_COMMENTS = [
  {
    contentId: "sujatha-diyaniya",
    authorName: "මල්ෂා නෙත්මි (Malsha N.)",
    avatar: "MN",
    timeAgo: "මිනිත්තු 10 කට පෙර",
    rating: 5,
    text: "සුජාත දියණිය රූපවාහිනියෙන් ගිය කාලේ මුළු ලංකාවම ගෙවල් වලට වෙලා බැලුවේ! සිංහල ඩබින් එකයි හඬකැවීම් ටිකයි තාමත් අහන්න ආසයි. 1080p එකෙන්ම බාගත්තා! ❤️🌸"
  },
  {
    contentId: "koombiyo",
    authorName: "සඳුන් විජේසිංහ (Sandun W.)",
    avatar: "SW",
    timeAgo: "මිනිත්තු 40 කට පෙර",
    rating: 5,
    text: "කූඹියෝ තරම් ලංකාවේ බුද්ධිමත් තිර රචනයක් තියෙන වෙන කිසිම ටෙලියක් නෑ. ජෙහාන්ගෙයි ප්‍රියන්තගෙයි dialogue අදටත් කටපාඩම්. සුපිරි Quality එකක්!"
  },
  {
    contentId: "soora-pappa",
    authorName: "කසුන් පෙරේරා (Kasun P.)",
    avatar: "KP",
    timeAgo: "පැය 1 කට පෙර",
    rating: 5,
    text: "සූර පප්පා තමයි අපේ ළමා කාලයේ සුපිරිම කාටූන් එක! 1080p වලින් ඩවුන්ලෝඩ් කරගත්තා, වීඩියෝ සහ හඬ සුපිරියටම තියෙනවා. ස්තූතියි මේ සයිට් එක හැදුවට! ❤️🔥"
  },
  {
    contentId: "ben-10-sinhala",
    authorName: "තරිඳු ප්‍රභාත් (Tharindu P.)",
    avatar: "TP",
    timeAgo: "පැය 3 කට පෙර",
    rating: 5,
    text: "බෙන් 10 සිරසෙන් ගිය කාලේ හැමදාම හවසට ඉස්කෝලේ ඇරිලා දුවගෙන ඇවිත් බැලුවේ. Full Episode ටික එකම තැනකින් Direct බාගන්න ලැබුණ එක ගොඩක් වටිනවා."
  },
  {
    contentId: "lion-king-sinhala",
    authorName: "ළහිරු සම්පත් (Lahiru S.)",
    avatar: "LS",
    timeAgo: "ඊයේ",
    rating: 5,
    text: "ලයන් කිං සිංහල ඩබින් එක මෙච්චර පැහැදිලි කොලිටියෙන් හොයාගන්න තිබ්බෙ නෑ. අදම ඩවුන්ලෝඩ් කරලා බැලුවා. තෑන්ක්ස් SinhalaFlix!"
  }
];
