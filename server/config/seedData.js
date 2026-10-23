// Rich seed data for Katha Yatra: Tracks, Game Levels, and Episodic Stories

export const initialTracks = [
  {
    id: 1,
    title: "The Epic Ramayana",
    category: "Religious Literature & Epics",
    description: "Embark on an epic adventure of honor, courage, brotherhood, and triumph of dharma with Prince Rama, Lakshmana, Sita, and the mighty Hanuman.",
    image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    total_levels: 6
  },
  {
    id: 2,
    title: "Mysteries of Ancient Egypt",
    category: "Ancient Civilizations & History",
    description: "Journey down the majestic Nile, decipher sacred hieroglyphs, unlock the secrets of towering pyramids, and meet legendary Pharaohs.",
    image_url: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80",
    total_levels: 6
  },
  {
    id: 3,
    title: "Myths of Ancient Greece",
    category: "Ancient Civilizations & History",
    description: "Scale Mount Olympus, face mythical beasts, learn timeless wisdom from philosophers, and explore the birth of democracy in Athens.",
    image_url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
    total_levels: 6
  },
  {
    id: 4,
    title: "Buddhist Jataka Tales",
    category: "Religious Literature & Epics",
    description: "Delightful animal fables and moral adventures illustrating compassion, selfless courage, and ancient Eastern mindfulness.",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    total_levels: 4
  },
  {
    id: 5,
    title: "Wonders of the Indus Valley",
    category: "Ancient Civilizations & History",
    description: "Discover the world's earliest planned cities, sophisticated drainage systems, mysterious unicorn seals, and the Great Bath of Mohenjo-daro.",
    image_url: "https://images.unsplash.com/photo-1599837565318-67429bde7162?auto=format&fit=crop&w=800&q=80",
    total_levels: 4
  }
];

export const initialLevels = [
  // Track 1: Ramayana
  {
    id: 1,
    track_id: 1,
    level_number: 1,
    game_type: "quiz",
    title: "The Swayamvara of Sita",
    content_payload: {
      instructions: "Answer the sacred question to prove your wisdom!",
      question: "Which legendary bow did Prince Rama string and break at King Janaka's court to win Princess Sita's hand in marriage?",
      options: [
        "Gandiva (Bow of Arjuna)",
        "Pinaka (The Shiva Dhanush)",
        "Vijaya (Bow of Karna)",
        "Sharanga (Bow of Vishnu)"
      ],
      correctAnswerIndex: 1,
      explanation: "Pinaka was the mighty divine bow of Lord Shiva kept in Mithila. Rama lifted and strung it with divine grace, breaking it in the process.",
      hints: ["It was given by Lord Shiva to King Nimi's lineage.", "Its name begins with the letter P."]
    }
  },
  {
    id: 2,
    track_id: 1,
    level_number: 2,
    game_type: "chronology",
    title: "The Forest Exile Timeline",
    content_payload: {
      instructions: "Arrange these key events from the start of the exile into the correct historical order!",
      items: [
        { id: "e1", text: "King Dasharatha promises Queen Kaikeyi two boons", order: 1 },
        { id: "e2", text: "Rama, Sita, and Lakshmana depart Ayodhya for the Dandaka Forest", order: 2 },
        { id: "e3", text: "Prince Bharata visits Chitrakoot and takes Rama's sandals to place on the throne", order: 3 },
        { id: "e4", text: "The hermits of Panchavati welcome Rama and Lakshmana creates a peaceful cottage", order: 4 }
      ]
    }
  },
  {
    id: 3,
    track_id: 1,
    level_number: 3,
    game_type: "matcher",
    title: "Guardians and Allies",
    content_payload: {
      instructions: "Pair each legendary figure with their sacred virtue or defining heroic feat!",
      pairs: [
        { id: "p1", item: "Hanuman", match: "Leaped across the ocean to find Sita in Ashoka Vatika" },
        { id: "p2", item: "Lakshmana", match: "Steadfast brother who stood guard for fourteen years without sleeping" },
        { id: "p3", item: "Jatayu", match: "Noble vulture king who fought fearlessly to rescue Sita" },
        { id: "p4", item: "Sugriva", match: "King of Kishkindha who mobilized the Vanara army" }
      ]
    }
  },
  {
    id: 4,
    track_id: 1,
    level_number: 4,
    game_type: "puzzle",
    title: "The Floating Bridge of Stones",
    content_payload: {
      instructions: "Solve the architectural riddle of the Vanara architects Nala and Nila to build the Rama Setu!",
      riddle: "I am carved of stone, heavy as iron. But when Rama's name is engraved upon my face, I float on ocean waves. What principle enables my bridge to stand?",
      options: [
        "Faith, Unity, and Collective Purpose",
        "Magnetic lodestones under the seabed",
        "Ancient rocket propulsion",
        "Volcanic pumice eruptions"
      ],
      correctAnswerIndex: 0,
      explanation: "With Rama's name inscribed and the dedicated teamwork of every creature—from giant bears to tiny squirrels—the stones floated together to form the bridge."
    }
  },
  {
    id: 5,
    track_id: 1,
    level_number: 5,
    game_type: "quiz",
    title: "The Sanjeevani Hill",
    content_payload: {
      instructions: "Test your knowledge of the Sanjeevani herb!",
      question: "When Lakshmana was wounded in battle, why did Hanuman bring an entire mountain instead of just the medicinal herb?",
      options: [
        "He forgot the name of the herb completely",
        "The herb glowed with four types, and to not lose precious time, he lifted Mount Dronagiri",
        "The mountain asked Hanuman for a ride to Lanka",
        "He wanted to use the mountain as a fortress"
      ],
      correctAnswerIndex: 1,
      explanation: "Hanuman could not distinguish the exact Sanjeevani plant among the glowing magical herbs in the dark of night, so he lifted the entire Dronagiri mountain with devotion to save Lakshmana."
    }
  },
  {
    id: 6,
    track_id: 1,
    level_number: 6,
    game_type: "chronology",
    title: "The Battle of Lanka & Return to Ayodhya",
    content_payload: {
      instructions: "Arrange the climactic events of the Ramayana in sequence!",
      items: [
        { id: "c1", text: "Vibhishana seeks refuge with Rama and advises on righteous strategy", order: 1 },
        { id: "c2", text: "Kumbhakarna awakens from deep slumber to fight for his brother", order: 2 },
        { id: "c3", text: "Rama invokes the Brahmastra to defeat Ravana on Vijayadashami", order: 3 },
        { id: "c4", text: "Rama, Sita, and Lakshmana return to Ayodhya on Pushpaka Vimana, celebrated with Diwali lamps", order: 4 }
      ]
    }
  },

  // Track 2: Ancient Egypt
  {
    id: 7,
    track_id: 2,
    level_number: 1,
    game_type: "quiz",
    title: "The River of Life",
    content_payload: {
      instructions: "Understand how the Nile shaped civilization!",
      question: "Why did the ancient Egyptians call their fertile homeland 'Kemet' (the Black Land)?",
      options: [
        "Because of the dark obsidian rocks in the desert",
        "Because of the rich, dark silt left behind by the annual flooding of the Nile",
        "Because of night-time ceremonies held under the new moon",
        "Because the Pharaoh wore a black crown"
      ],
      correctAnswerIndex: 1,
      explanation: "The annual inundation of the Nile River deposited rich, dark mineral silt on the riverbanks, allowing agriculture to flourish in the middle of the Sahara desert."
    }
  },
  {
    id: 8,
    track_id: 2,
    level_number: 2,
    game_type: "matcher",
    title: "Symbols of the Pharaohs",
    content_payload: {
      instructions: "Match each sacred Egyptian artifact or symbol with its cultural meaning!",
      pairs: [
        { id: "eg1", item: "Ankh", match: "The hieroglyphic symbol representing eternal life and vital breath" },
        { id: "eg2", item: "Eye of Horus (Wadjet)", match: "Symbol of protection, royal power, healing, and good health" },
        { id: "eg3", item: "Scarab Beetle", match: "Amulet symbolizing rebirth, morning sun, and transformation" },
        { id: "eg4", item: "Rosetta Stone", match: "Carved stele that allowed modern scholars to decipher hieroglyphs" }
      ]
    }
  },
  {
    id: 9,
    track_id: 2,
    level_number: 3,
    game_type: "chronology",
    title: "Architects of Eternity",
    content_payload: {
      instructions: "Order these monumental ancient Egyptian construction milestones!",
      items: [
        { id: "pyr1", text: "Imhotep designs the Step Pyramid of Djoser at Saqqara", order: 1 },
        { id: "pyr2", text: "Pharaoh Khufu builds the Great Pyramid of Giza", order: 2 },
        { id: "pyr3", text: "Hatshepsut builds her mortuary temple at Deir el-Bahari", order: 3 },
        { id: "pyr4", text: "Howard Carter unseals the tomb of young Pharaoh Tutankhamun", order: 4 }
      ]
    }
  },
  {
    id: 10,
    track_id: 2,
    level_number: 4,
    game_type: "puzzle",
    title: "The Weighing of the Heart",
    content_payload: {
      instructions: "Solve the ethical riddle of Anubis in the Hall of Ma'at!",
      riddle: "In the afterlife, the god Anubis places your heart on the scale of balance. On the other side sits a single white ostrich feather. What does the feather represent, and what must your heart be to pass?",
      options: [
        "Ma'at (Truth, justice, and cosmic order); heart must be as light as truth",
        "Gold and silver coins given to the temple",
        "The weight of your battle weapons",
        "The number of scarabs buried in your sarcophagus"
      ],
      correctAnswerIndex: 0,
      explanation: "Ma'at represents cosmic harmony, truth, and moral integrity. If a person lived with kindness and truth, their heart weighed no more than the feather of Ma'at."
    }
  },

  // Track 3: Ancient Greece
  {
    id: 11,
    track_id: 3,
    level_number: 1,
    game_type: "quiz",
    title: "The Cradle of Democracy",
    content_payload: {
      instructions: "Explore the ancient Agora and the birth of citizen voice!",
      question: "In 5th century BCE Athens, what political system was pioneered where citizens directly voted on laws?",
      options: [
        "Democracy (Demos = people, Kratos = power)",
        "Oligarchy (Rule by the wealthy few)",
        "Monarchy (Rule by a single king)",
        "Feudalism (Rule by landed lords)"
      ],
      correctAnswerIndex: 0,
      explanation: "Athenian democracy allowed male citizens to gather at the Pnyx and vote directly on state policies, legislation, and treaties."
    }
  },
  {
    id: 12,
    track_id: 3,
    level_number: 2,
    game_type: "matcher",
    title: "Gods and Virtues of Olympus",
    content_payload: {
      instructions: "Match the Olympian with their domain and moral symbol!",
      pairs: [
        { id: "gr1", item: "Athena", match: "Goddess of wisdom, strategic courage, crafts, and the owl" },
        { id: "gr2", item: "Apollo", match: "God of music, poetry, sunlight, and the Delphic oracle" },
        { id: "gr3", item: "Poseidon", match: "Lord of the roaring seas, earthquakes, and the trident" },
        { id: "gr4", item: "Hermes", match: "Swift messenger god, patron of travelers, merchants, and wit" }
      ]
    }
  },
  {
    id: 13,
    track_id: 3,
    level_number: 3,
    game_type: "chronology",
    title: "The Golden Age of Greece",
    content_payload: {
      instructions: "Sort these intellectual and historical milestones of Ancient Greece!",
      items: [
        { id: "g1", text: "The First Olympic Games held at Olympia to honor Zeus", order: 1 },
        { id: "g2", text: "Greeks defeat the Persian invasion at the Battle of Marathon", order: 2 },
        { id: "g3", text: "Pericles oversees the building of the Parthenon on the Acropolis", order: 3 },
        { id: "g4", text: "Socrates teaches philosophy through questions in the Athens marketplace", order: 4 }
      ]
    }
  },
  {
    id: 14,
    track_id: 3,
    level_number: 4,
    game_type: "puzzle",
    title: "The Trojan Horse Strategy",
    content_payload: {
      instructions: "Uncover the legendary stratagem of Odysseus!",
      riddle: "Ten years of siege could not breach the towering walls of Troy. What was inside the colossal wooden offering left upon the beach that turned the tide of history?",
      options: [
        "Elite Greek warriors hidden in hollow cedar ribs",
        "A treasure chest of golden Athenian drachmas",
        "A tame Macedonian lion for the King",
        "A giant clockwork catapult"
      ],
      correctAnswerIndex: 0,
      explanation: "Devised by the quick-witted Odysseus, the Greeks built a hollow wooden horse concealing thirty elite warriors, teaching the timeless lesson of strategy over brute force."
    }
  }
];

export const initialStories = [
  // Track 1: Ramayana Stories
  {
    id: 1,
    track_id: 1,
    chapter_number: 1,
    required_level_threshold: 2, // Unlocks after level 2
    title: "Chapter 1: The Golden Deer of Panchavati",
    content: "Deep in the tranquil wilderness of Panchavati, autumn breezes whispered through the towering Sal trees. Rama, Sita, and Lakshmana had built a humble hermitage surrounded by fragrant jasmine and playful deer. One morning, a creature unlike any ever seen stepped from the emerald canopy. Its coat shone like molten gold, dotted with silver pearls that caught the morning light. Sita looked upon the magical deer with wonder and wished for Rama to capture it gently. Rama knew that things that glitter too brightly in the forest are rarely as innocent as they appear. Leaving Lakshmana to guard Sita at all costs, Rama ventured into the thick woods.\n\nDeep inside the forest, the deer eluded every trap, leaping across ravines with unnatural agility. Realizing it was Maricha, the shape-shifting sorcerer of Lanka, Rama drew his bow and struck the illusion. With its dying breath, the creature shouted in Rama's exact voice: 'O Lakshmana! O Sita! Save me!'",
    cliffhanger: "Back at the hermitage, Sita hears Rama's voice crying for help in agony. Lakshmana urges calm, warning it is a demon's deception, but Sita's fear forces Lakshmana to draw a glowing line of protection in the dust—the Lakshmana Rekha. As Lakshmana runs into the jungle, an ascetic hermit with a beggar's bowl emerges from the shadows, stepping directly towards the circle... Will Sita cross the line?",
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    track_id: 1,
    chapter_number: 2,
    required_level_threshold: 4, // Unlocks after level 4
    title: "Chapter 2: The Leap Across the Roaring Seas",
    content: "Far to the southern tip of the Indian subcontinent, the brave Vanara scout army stood paralyzed by the thunderous waves of the Indian Ocean. Hundreds of miles of churned foam and hungry sea dragons separated them from the island kingdom of Lanka. Hope seemed lost until the aged bear king, Jambavan, turned to Hanuman, who was sitting quietly in meditation. 'Why do you remain silent, O son of the Wind?' Jambavan spoke. 'You possess the speed of lightning and the heart of a lion. Awaken your true strength!'\n\nRemembering his divine blessing, Hanuman chanted Rama's holy name. He began to grow taller and taller, until his feet pressed into Mount Mahendra like pillars of iron. The mountain groaned, releasing streams of water and glowing gems under his immense momentum.",
    cliffhanger: "Hanuman coiled like a sprung arrow and launched himself skyward into the clouds, parting the storm. But suddenly, rising from the boiling depths of the ocean, the towering sea demoness Surasa opens a maw thirty miles wide directly in Hanuman's flight path! 'None pass my ocean without entering my jaws!' she roars. How will Hanuman outwit a monster bigger than a mountain?",
    image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    track_id: 1,
    chapter_number: 3,
    required_level_threshold: 6, // Unlocks after level 6
    title: "Chapter 3: The Victory of Light and the Return Home",
    content: "The battlefield of Lanka trembled as Rama faced Ravana in the final confrontation of the cosmic struggle. Ravana fought with ten heads and twenty weapons of fury, but each time a head was severed, another grew in its place. Sage Agastya whispered to Rama the sacred 'Aditya Hridaya Stotram'—harnessing the eternal energy of the Sun and unshakeable inner focus. Drawing the divine Brahmastra gifted by Sage Agastya, Rama aimed for the core of ego itself. Truth prevailed, and peace returned to the world.\n\nReunited with Sita, Lakshmana, and their faithful companions, Rama boarded the magical aerial chariot, the Pushpaka Vimana, to return to Ayodhya as the fourteen years of exile came to an end.",
    cliffhanger: "As twilight blankets Ayodhya, the citizens wait in breathless silence on the riverbanks of the Sarayu. Then, a single golden spark appears in the northern sky. Thousands of clay lamps are lit simultaneously, igniting the first celebration of Diwali. Rama steps onto the soil of his ancestors, but an unexpected royal messenger brings news of a mysterious stranger waiting at the palace gates...",
    image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
  },

  // Track 2: Ancient Egypt Stories
  {
    id: 4,
    track_id: 2,
    chapter_number: 1,
    required_level_threshold: 2,
    title: "Chapter 1: The Whispers of the Golden Scarab",
    content: "Beneath the shadow of the Great Sphinx of Giza, where hot desert sands blend into starry Egyptian skies, a young apprentice scribe named Tariq worked diligently on his papyrus rolls. During a routine survey of the limestone foundations, Tariq noticed a faint, pulsing blue glow slipping through a hairline crack in the bedrock. Brushing away thousands of years of crushed seashells and dust, his fingers brushed against a heavy lapis lazuli scarab bearing the lost royal cartouche of an unrecorded 4th Dynasty princess.\n\nAs Tariq whispered the ancient phonetic symbols inscribed along the beetle's wings, the colossal paws of the Sphinx vibrated. A concealed stone hatch beneath the bedrock swung open with a hiss of trapped desert air that had not moved since the reign of Khufu.",
    cliffhanger: "A flight of obsidian steps descends directly into darkness beneath the desert floor. As Tariq holds his flickering oil lamp forward, he hears the distant sound of rushing subterranean water and sees a silhouette standing at the base of the staircase holding a bronze ankh staff... Who is guarding the secret beneath the Sphinx?",
    image_url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    track_id: 2,
    chapter_number: 2,
    required_level_threshold: 4,
    title: "Chapter 2: The Hall of Two Truths",
    content: "Descending the obsidian steps, Tariq entered a magnificent subterranean chamber supported by twelve colossal lotus pillars. In the center of the hall stood an altar carved from pure alabaster, upon which sat a bronze scale flanked by the statues of Thoth, the ibis-headed scribe of wisdom, and Anubis, guardian of the sacred tombs. Hieroglyphic inscriptions glowing with phosphorescent paint revealed the chamber was not a tomb of gold, but an ancient archive of mathematical and astronomical records compiled before the Great Pyramids were raised.\n\nOn the wall, a detailed star map showed the constellation of Orion aligned with the Nile in a configuration that will not repeat for another three thousand years.",
    cliffhanger: "As Tariq reaches to record the astronomical formula, the bronze scale tilts on its own. An ancient stone mechanism clicks into motion, and the floor begins to slowly rotate, revealing a deep chasm lined with shimmering crystalline mirrors pointing towards the desert surface. A beam of moonlight strikes the first mirror...",
    image_url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
  },

  // Track 3: Ancient Greece Stories
  {
    id: 6,
    track_id: 3,
    chapter_number: 1,
    required_level_threshold: 2,
    title: "Chapter 1: The Labyrinth of Knossos",
    content: "Under the Aegean sun, the island of Crete rose like a fortress of white limestone against sapphire waves. Theseus, Prince of Athens, had volunteered to join the tribute sent to King Minos, determined to put an end to the terror of the Minotaur. Inside the palace of Knossos, the walls were covered with vibrant frescoes of leaping dolphins and sacred bulls. That night, Princess Ariadne approached Theseus in secret. In her hand she carried a ball of silken golden thread and a bronze sword forged with the blessings of Daedalus himself.\n\n'Tie one end to the lintel of the gate,' Ariadne whispered. 'No warrior has ever escaped the maze because every corridor shifts when the torches burn low.'",
    cliffhanger: "Theseus stepped into the damp, echoing corridors of the labyrinth, unraveling the golden thread behind him. Three turns in, the heavy stone portcullis slammed shut behind him. In the pitch black, the ground shook with heavy, cloven-hoofed footsteps, and a hot breath smelled of smoke and iron blew against the back of his neck...",
    image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    track_id: 3,
    chapter_number: 2,
    required_level_threshold: 4,
    title: "Chapter 2: The Fire of Mount Olympus",
    content: "High above the clouds where mortal eyes could not gaze, Mount Olympus sparkled with eternal light. Prometheus, the titan of foresight, looked down upon humanity shivering in cold caves, vulnerable to beasts and unable to forge tools or write poetry. His heart swelled with compassion. Defying the decree of Zeus, Prometheus climbed the southern slope of Olympus with a dry fennel stalk.\n\nApproaching the chariot of Helios as it returned from the daytime sky, Prometheus touched the pith of the fennel to the wheel of the celestial chariot, capturing a spark of eternal fire.",
    cliffhanger: "Holding the glowing ember inside the hollow stalk, Prometheus rushed down the mountain paths. But as he reached the first human settlement in Thessaly, thunder cracked across a cloudless sky, and Hermes materialized before him in winged sandals, holding Zeus's golden summons in his hand...",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  }
];
