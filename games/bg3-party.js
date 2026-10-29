/* Journal de bord BG3 : classes (paliers 1 → 12), compagnons et repères de niveau.
   Règles BG3 (D&D 5e adaptées). Les noms de sorts et de dons sont donnés en français
   avec l'anglais entre parenthèses, pratique pour chercher un guide.
   Les caractéristiques de départ marquées « à vérifier » ou absentes se corrigent dans l'app. */

/* XP totale requise pour atteindre chaque niveau */
export const XP = { 2: 300, 3: 900, 4: 2700, 5: 6500, 6: 14000, 7: 23000, 8: 34000, 9: 48000, 10: 64000, 11: 85000, 12: 100000 };

/* Repères approximatifs : niveau du groupe en fin d'acte, pour une partie qui explore bien */
export const ACT_LEVELS = { pro: [1, 2], a1: [2, 5], a2: [5, 8], a3: [8, 12], fin: [11, 12] };

export const STATS = [["str", "FOR", "Force"], ["dex", "DEX", "Dextérité"], ["con", "CON", "Constitution"], ["int", "INT", "Intelligence"], ["wis", "SAG", "Sagesse"], ["cha", "CHA", "Charisme"]];

export const RACES = ["Humain", "Elfe", "Drow", "Demi-elfe", "Demi-orque", "Halfelin", "Nain", "Gnome", "Tieffelin", "Githyanki", "Drakéide"];

const FEAT = "Don ou amélioration de caractéristiques";

/* f : ce que la classe gagne à ce niveau · p : conseil générique · feat : niveau de don */
export const CLASSES = {
  barbare: {
    l: "Barbare", i: "axe", key: ["str", "con"],
    subs: ["Berserker", "Cœur sauvage", "Magie sauvage", "Voie des Géants"],
    lv: [
      { f: "Rage, Défense sans armure", p: "Arme à deux mains, pas d'armure lourde (elle bloque la rage)." },
      { f: "Attaque téméraire, Sens du danger" },
      { f: "Sous-classe (Voie)", p: "Berserker pour les dégâts, Cœur sauvage (Ours) pour encaisser.", sub: 1 },
      { f: FEAT, p: "Maître d'armes lourdes (Great Weapon Master).", feat: 1 },
      { f: "Attaque supplémentaire, Déplacement rapide", key: 1 },
      { f: "Aptitude de sous-classe" },
      { f: "Instinct sauvage" },
      { f: FEAT, p: "Amélioration : Force.", feat: 1 },
      { f: "Critique brutal" },
      { f: "Aptitude de sous-classe" },
      { f: "Rage implacable" },
      { f: FEAT, p: "Amélioration : Force ou Constitution.", feat: 1 }
    ]
  },
  barde: {
    l: "Barde", i: "lute", key: ["cha", "dex"],
    subs: ["Savoir", "Vaillance", "Lames", "Séduction"],
    lv: [
      { f: "Inspiration bardique, sorts", p: "Moquerie cruelle (Vicious Mockery), Mot de guérison (Healing Word), Fou rire de Tasha (Tasha's Hideous Laughter)." },
      { f: "Touche-à-tout, Chant reposant" },
      { f: "Sous-classe (Collège), Expertise, sorts de niveau 2", p: "Savoir pour la magie et le contrôle, Lames ou Vaillance pour le corps à corps.", sub: 1 },
      { f: FEAT, p: "Amélioration : Charisme.", feat: 1 },
      { f: "Source d'inspiration, sorts de niveau 3", p: "Hypnose (Hypnotic Pattern).", key: 1 },
      { f: "Contre-charme, aptitude de sous-classe", p: "Savoir : Secrets magiques. Lames/Vaillance : Attaque supplémentaire." },
      { f: "Sorts de niveau 4" },
      { f: FEAT, p: "Amélioration : Charisme, ou Mage de guerre (War Caster).", feat: 1 },
      { f: "Sorts de niveau 5" },
      { f: "Secrets magiques, Expertise", p: "Prends un sort d'une autre classe (Contresort, Hâte…)." },
      { f: "Sorts de niveau 6" },
      { f: FEAT, feat: 1 }
    ]
  },
  clerc: {
    l: "Clerc", i: "sun", key: ["wis", "con"],
    subs: ["Vie", "Lumière", "Duperie", "Savoir", "Nature", "Tempête", "Guerre", "Mort"],
    lv: [
      { f: "Sous-classe (Domaine), sorts", p: "Assistance (Guidance), Bénédiction (Bless), Mot de guérison (Healing Word).", sub: 1 },
      { f: "Conduit divin" },
      { f: "Sorts de niveau 2", p: "Arme spirituelle (Spiritual Weapon), Aide (Aid)." },
      { f: FEAT, p: "Amélioration : Sagesse, ou Mage de guerre (War Caster).", feat: 1 },
      { f: "Destruction des morts-vivants, sorts de niveau 3", p: "Esprits gardiens (Spirit Guardians) : le sort phare du clerc.", key: 1 },
      { f: "Aptitude de domaine" },
      { f: "Sorts de niveau 4" },
      { f: FEAT + ", Frappe divine ou Incantation puissante", p: "Amélioration : Sagesse.", feat: 1 },
      { f: "Sorts de niveau 5" },
      { f: "Intervention divine" },
      { f: "Sorts de niveau 6" },
      { f: FEAT, p: "Résilient (Constitution) pour garder la concentration.", feat: 1 }
    ]
  },
  druide: {
    l: "Druide", i: "leaf", key: ["wis", "con"],
    subs: ["Terre", "Lune", "Spores", "Étoiles"],
    lv: [
      { f: "Sorts de druide", p: "Assistance (Guidance), Gourdin magique (Shillelagh), Mot de guérison (Healing Word)." },
      { f: "Forme sauvage, sous-classe (Cercle)", p: "Lune pour combattre en bête, Terre ou Étoiles pour lancer des sorts.", sub: 1 },
      { f: "Sorts de niveau 2", p: "Rayon de lune (Moonbeam), Croissance d'épines (Spike Growth)." },
      { f: FEAT, p: "Amélioration : Sagesse.", feat: 1 },
      { f: "Sorts de niveau 3", p: "Appel de la foudre (Call Lightning).", key: 1 },
      { f: "Aptitude de cercle" },
      { f: "Sorts de niveau 4" },
      { f: FEAT, p: "Amélioration : Sagesse, ou Mage de guerre (War Caster).", feat: 1 },
      { f: "Sorts de niveau 5" },
      { f: "Aptitude de cercle" },
      { f: "Sorts de niveau 6" },
      { f: FEAT, feat: 1 }
    ]
  },
  ensorceleur: {
    l: "Ensorceleur", i: "flame", key: ["cha", "con"],
    subs: ["Lignée draconique", "Magie sauvage", "Tempête", "Magie de l'ombre"],
    lv: [
      { f: "Sous-classe (Origine), sorts", p: "Trait de feu (Fire Bolt), Projectile magique (Magic Missile), Bouclier (Shield).", sub: 1 },
      { f: "Points de sorcellerie" },
      { f: "Métamagie, sorts de niveau 2", p: "Sort accéléré (Quickened) et Sort jumeau (Twinned)." },
      { f: FEAT, p: "Amélioration : Charisme.", feat: 1 },
      { f: "Sorts de niveau 3", p: "Hâte (Haste) jumelé, Boule de feu (Fireball).", key: 1 },
      { f: "Aptitude d'origine" },
      { f: "Sorts de niveau 4" },
      { f: FEAT, p: "Amélioration : Charisme, ou Mage de guerre (War Caster).", feat: 1 },
      { f: "Sorts de niveau 5" },
      { f: "Métamagie supplémentaire" },
      { f: "Sorts de niveau 6", p: "Chaîne d'éclairs (Chain Lightning)." },
      { f: FEAT, feat: 1 }
    ]
  },
  guerrier: {
    l: "Guerrier", i: "sword", key: ["str", "con"],
    subs: ["Maître de guerre", "Champion", "Chevalier occulte", "Archer arcanique"],
    lv: [
      { f: "Style de combat, Second souffle", p: "Armes à deux mains, ou Archerie pour un tireur." },
      { f: "Fougue (une action de plus)" },
      { f: "Sous-classe (Archétype)", p: "Maître de guerre : polyvalent et fort tout le jeu.", sub: 1 },
      { f: FEAT, p: "Maître d'armes lourdes (Great Weapon Master) ou Tireur d'élite (Sharpshooter).", feat: 1 },
      { f: "Attaque supplémentaire", key: 1 },
      { f: FEAT, p: "Amélioration : Force (ou Dextérité).", feat: 1 },
      { f: "Aptitude d'archétype" },
      { f: FEAT, p: "Vigilant (Alert) ou Sentinelle.", feat: 1 },
      { f: "Inflexible" },
      { f: "Aptitude d'archétype" },
      { f: "Attaque supplémentaire améliorée (3 attaques)", key: 1 },
      { f: FEAT, feat: 1 }
    ]
  },
  magicien: {
    l: "Magicien", i: "hat", key: ["int", "con"],
    subs: ["Abjuration", "Invocation", "Divination", "Enchantement", "Évocation", "Illusion", "Nécromancie", "Transmutation", "Chant de la lame"],
    lv: [
      { f: "Restauration arcanique, grimoire", p: "Projectile magique (Magic Missile), Bouclier (Shield), Armure de mage (Mage Armour). Copie tous les parchemins trouvés." },
      { f: "Sous-classe (École)", p: "Évocation : tes sorts de zone épargnent tes alliés.", sub: 1 },
      { f: "Sorts de niveau 2", p: "Foulée brumeuse (Misty Step), Immobilisation de personne (Hold Person)." },
      { f: FEAT, p: "Amélioration : Intelligence.", feat: 1 },
      { f: "Sorts de niveau 3", p: "Boule de feu (Fireball), Hâte (Haste), Contresort (Counterspell).", key: 1 },
      { f: "Aptitude d'école" },
      { f: "Sorts de niveau 4", p: "Invisibilité supérieure (Greater Invisibility)." },
      { f: FEAT, p: "Résilient (Constitution) ou Mage de guerre (War Caster).", feat: 1 },
      { f: "Sorts de niveau 5", p: "Cône de froid (Cone of Cold)." },
      { f: "Aptitude d'école" },
      { f: "Sorts de niveau 6", p: "Chaîne d'éclairs (Chain Lightning), Désintégration (Disintegrate)." },
      { f: FEAT, p: "Amélioration : Intelligence.", feat: 1 }
    ]
  },
  moine: {
    l: "Moine", i: "balance", key: ["dex", "wis"],
    subs: ["Main ouverte", "Ombre", "Quatre éléments", "Maître ivre"],
    lv: [
      { f: "Arts martiaux, Défense sans armure, Déluge de coups", p: "Combat à mains nues, sans armure." },
      { f: "Ki, Déplacement sans armure" },
      { f: "Sous-classe (Tradition), Parade de projectiles", p: "Main ouverte : la plus simple et très efficace.", sub: 1 },
      { f: FEAT, p: "Amélioration : Dextérité, ou Robuste (Tough).", feat: 1 },
      { f: "Attaque supplémentaire, Frappe étourdissante", key: 1 },
      { f: "Frappes de ki, aptitude de tradition" },
      { f: "Dérobade, Tranquillité de l'esprit" },
      { f: FEAT, p: "Amélioration : Dextérité ou Sagesse.", feat: 1 },
      { f: "Déplacement sans armure amélioré" },
      { f: "Pureté du corps" },
      { f: "Aptitude de tradition" },
      { f: FEAT, feat: 1 }
    ]
  },
  occultiste: {
    l: "Occultiste", i: "eye", key: ["cha", "con"],
    subs: ["Fiélon", "Archifée", "Grand Ancien", "Lame maudite"],
    lv: [
      { f: "Sous-classe (Protecteur), Magie de pacte", p: "Décharge occulte (Eldritch Blast), Maléfice (Hex), Armure d'Agathys.", sub: 1 },
      { f: "Manifestations occultes", p: "Décharge déchirante (Agonizing Blast) et Décharge repoussante (Repelling Blast)." },
      { f: "Pacte (Lame, Chaîne ou Tome), sorts de niveau 2" },
      { f: FEAT, p: "Amélioration : Charisme.", feat: 1 },
      { f: "Sorts de niveau 3, Décharge occulte à 2 rayons", p: "Faim de Hadar (Hunger of Hadar), Contresort (Counterspell).", key: 1 },
      { f: "Aptitude de protecteur" },
      { f: "Sorts de niveau 4" },
      { f: FEAT, p: "Amélioration : Charisme, ou Mage de guerre (War Caster).", feat: 1 },
      { f: "Sorts de niveau 5" },
      { f: "Aptitude de protecteur, Décharge occulte à 3 rayons", key: 1 },
      { f: "Arcanum mystique (sort de niveau 6)" },
      { f: FEAT, feat: 1 }
    ]
  },
  paladin: {
    l: "Paladin", i: "shield", key: ["str", "cha"],
    subs: ["Dévotion", "Anciens", "Vengeance", "Couronne", "Briseur de serment"],
    lv: [
      { f: "Sous-classe (Serment), Sens divin, Imposition des mains", p: "Attention : rompre ton serment par tes choix te fait perdre tes pouvoirs.", sub: 1 },
      { f: "Style de combat, Châtiment divin, sorts", p: "Armes à deux mains. Garde tes emplacements de sort pour les châtiments sur coup critique." },
      { f: "Santé divine, Conduit divin" },
      { f: FEAT, p: "Maître d'armes lourdes (Great Weapon Master).", feat: 1 },
      { f: "Attaque supplémentaire, sorts de niveau 2", key: 1 },
      { f: "Aura de protection", p: "Ton Charisme s'ajoute aux jets de sauvegarde des alliés proches.", key: 1 },
      { f: "Aptitude de serment" },
      { f: FEAT, p: "Amélioration : Force ou Charisme.", feat: 1 },
      { f: "Sorts de niveau 3" },
      { f: "Aura de courage" },
      { f: "Châtiment divin amélioré" },
      { f: FEAT, feat: 1 }
    ]
  },
  "rôdeur": {
    l: "Rôdeur", i: "bow", key: ["dex", "wis"],
    subs: ["Chasseur", "Maître des bêtes", "Traqueur des ténèbres", "Gardien de l'essaim"],
    lv: [
      { f: "Ennemi juré, Explorateur-né" },
      { f: "Style de combat, sorts", p: "Archerie. Marque du chasseur (Hunter's Mark)." },
      { f: "Sous-classe", p: "Traqueur des ténèbres : attaque bonus au premier tour, très fort.", sub: 1 },
      { f: FEAT, p: "Tireur d'élite (Sharpshooter).", feat: 1 },
      { f: "Attaque supplémentaire, sorts de niveau 2", key: 1 },
      { f: "Ennemi juré et explorateur supplémentaires" },
      { f: "Aptitude de sous-classe" },
      { f: FEAT + ", Traversée des terrains", p: "Amélioration : Dextérité.", feat: 1 },
      { f: "Sorts de niveau 3" },
      { f: "Camouflage naturel" },
      { f: "Aptitude de sous-classe" },
      { f: FEAT, feat: 1 }
    ]
  },
  roublard: {
    l: "Roublard", i: "dagger", key: ["dex", "con"],
    subs: ["Voleur", "Assassin", "Escroc arcanique", "Bretteur"],
    lv: [
      { f: "Attaque sournoise, Expertise", p: "Expertise en Discrétion et Escamotage (crochetage)." },
      { f: "Ruse (Se cacher, Foncer, Se désengager en action bonus)" },
      { f: "Sous-classe", p: "Voleur : une action bonus supplémentaire chaque tour.", sub: 1 },
      { f: FEAT, p: "Tireur d'élite (Sharpshooter) à l'arc, ou Amélioration : Dextérité.", feat: 1 },
      { f: "Esquive instinctive", key: 1 },
      { f: "Expertise supplémentaire" },
      { f: "Dérobade" },
      { f: FEAT, p: "Amélioration : Dextérité.", feat: 1 },
      { f: "Aptitude de sous-classe" },
      { f: FEAT, p: "Vigilant (Alert).", feat: 1 },
      { f: "Talent (jets de compétence fiables)" },
      { f: FEAT, feat: 1 }
    ]
  }
};

/* Compagnons. stats : valeurs de départ connues ; statsCheck : à vérifier en jeu ; null : à renseigner.
   build.p : conseils qui remplacent ceux de la classe, par niveau. */
export const COMPANIONS = [
  {
    id: "astarion", n: "Astarion", race: "Haut-elfe", cls: "roublard",
    stats: { str: 8, dex: 17, con: 14, int: 13, wis: 13, cha: 10 },
    recruit: "Prologue · sur la plage, près de l'épave du nautiloïde.", act: "pro",
    build: {
      n: "Voleur archer", sub: "Voleur",
      d: "Il tire à l'arc depuis les hauteurs et profite de deux actions bonus par tour. Son rôle hors combat : crochetage, pièges, discrétion.",
      prio: ["dex", "con", "wis"],
      alt: ["Assassin : énormes dégâts sur les ennemis surpris.", "Traqueur des ténèbres 5 / Roublard 7 en multiclasse : excellent premier tour."],
      p: { 1: "Expertise : Discrétion et Escamotage.", 3: "Voleur.", 4: "Tireur d'élite (Sharpshooter).", 8: "Amélioration : Dextérité.", 10: "Vigilant (Alert)." }
    },
    tips: ["Laisse-le te mordre une nuit au camp : trophée « Juste pour goûter ».", "Sa quête contre Cazador se joue en Acte 3 : le choix final sur le rituel le transforme radicalement. Sauvegarde avant."],
    trophies: ["astarion"]
  },
  {
    id: "ombrecoeur", n: "Ombrecœur", race: "Demi-elfe", cls: "clerc",
    stats: { str: 13, dex: 13, con: 14, int: 10, wis: 17, cha: 8 },
    recruit: "Prologue · libère-la de sa capsule sur le nautiloïde, puis retrouve-la près du site du crash.", act: "pro",
    build: {
      n: "Soigneuse et contrôle", sub: "Duperie (par défaut)",
      d: "Ta soigneuse principale. Ses buffs (Bénédiction, Esprits gardiens) changent tout. Tu peux la faire changer de domaine chez Flétriss.",
      prio: ["wis", "con", "str"],
      alt: ["Domaine de la Vie : soins renforcés et armure lourde.", "Domaine de la Lumière : Boule de feu et protection contre les attaques."],
      p: { 1: "Bénédiction (Bless), Mot de guérison (Healing Word), Assistance (Guidance).", 4: "Amélioration : Sagesse (17 → 19).", 8: "Mage de guerre (War Caster)." }
    },
    tips: ["Offre-lui une orchidée nocturne : trophée « La fleur de la nuit ».", "En Acte 2, son choix au Gantelet de Shar change sa classe et son histoire. Sauvegarde avant."],
    trophies: ["fleur-nuit"]
  },
  {
    id: "gale", n: "Gale", race: "Humain", cls: "magicien",
    stats: { str: 8, dex: 13, con: 15, int: 17, wis: 10, cha: 12 },
    recruit: "Acte 1 · près du site du crash : touche la rune lumineuse pour le sortir du portail.", act: "a1",
    build: {
      n: "Évocateur", sub: "Évocation",
      d: "Ta grosse artillerie : Boule de feu et Chaîne d'éclairs sans brûler tes alliés. Garde-le à distance, derrière la ligne de front.",
      prio: ["int", "con", "dex"],
      alt: ["Abjuration : très résistant grâce à sa protection arcanique.", "Chant de la lame : un mage de corps à corps."],
      p: { 2: "Évocation.", 4: "Amélioration : +1 Intelligence, +1 Constitution.", 8: "Résilient (Constitution).", 12: "Amélioration : Intelligence." }
    },
    tips: ["Il te demandera des objets magiques à absorber : garde un objet peu utile pour lui en donner.", "Son orbe du Néthéril est au cœur de sa quête : trophée « Reprisage de la Trame »."],
    trophies: ["trame"]
  },
  {
    id: "laezel", n: "Lae'zel", race: "Githyanki", cls: "guerrier",
    stats: { str: 17, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
    recruit: "Acte 1 · non loin du site du crash, aux prises avec deux tieffelins.", act: "a1",
    build: {
      n: "Maître de guerre à deux mains", sub: "Maître de guerre",
      d: "Ta ligne de front. Avec Fougue et Maître d'armes lourdes, elle finit un combat en un tour.",
      prio: ["str", "con", "dex"],
      alt: ["Champion : plus de coups critiques, zéro gestion.", "Chevalier occulte : Bouclier et sorts de soutien."],
      p: { 1: "Style : Armes à deux mains.", 3: "Maître de guerre. Manœuvres : Riposte, Attaque de précision, Attaque menaçante.", 4: "Maître d'armes lourdes (Great Weapon Master).", 6: "Amélioration : Force.", 8: "Vigilant (Alert)." }
    },
    tips: ["Elle veut aller à la Crèche githyanki en Acte 1 : tes choix là-bas peuvent la faire partir.", "En Acte 3, allie-toi à Voss contre Vlaakith : trophée « Le courroux de la reine-liche »."],
    trophies: ["reine-liche"]
  },
  {
    id: "wyll", n: "Wyll", race: "Humain", cls: "occultiste",
    stats: { str: 9, dex: 13, con: 15, int: 14, wis: 8, cha: 16 }, statsCheck: 1,
    recruit: "Acte 1 · au Bosquet d'Émeraude, en repoussant l'attaque des gobelins à l'entrée.", act: "a1",
    build: {
      n: "Lame de décharge", sub: "Fiélon (imposé)",
      d: "Décharge occulte à chaque tour, renforcée par ses manifestations. Le Pacte de la lame lui permet aussi de frapper au contact.",
      prio: ["cha", "con", "dex"],
      alt: ["Pacte de la chaîne : un familier utile pour les éclaireurs.", "Multiclasse Paladin pour les châtiments avec les emplacements de pacte."],
      p: { 2: "Décharge déchirante (Agonizing Blast) + Décharge repoussante (Repelling Blast).", 3: "Pacte de la lame.", 4: "Amélioration : Charisme." }
    },
    tips: ["Sa quête l'envoie traquer Karlach : parle-lui au lieu de la combattre pour la recruter aussi.", "En Acte 3, rompre son pacte avec Mizora donne le trophée « Écrit en tout petit »."],
    trophies: ["wyll"]
  },
  {
    id: "karlach", n: "Karlach", race: "Tieffelin", cls: "barbare",
    stats: { str: 17, dex: 13, con: 15, int: 8, wis: 12, cha: 10 },
    recruit: "Acte 1 · pendant la quête de Wyll qui te demande de traquer une « diablesse » : écoute-la plutôt que de l'attaquer.", act: "a1",
    build: {
      n: "Berserker à deux mains", sub: "Cœur sauvage (par défaut)",
      d: "Ta plus grosse cogneuse. Attaque téméraire + Maître d'armes lourdes, et la rage pour encaisser.",
      prio: ["str", "con", "dex"],
      alt: ["Cœur sauvage (Ours) : résiste à presque tout pendant la rage.", "Voie des Géants : lancers d'ennemis spectaculaires."],
      p: { 3: "Berserker (ou garde Cœur sauvage, Ours).", 4: "Maître d'armes lourdes (Great Weapon Master).", 8: "Amélioration : Force." }
    },
    tips: ["Son cœur infernal se répare auprès de Dammon avec du Fer infernal (Actes 2 et 3).", "Garde sa romance jusqu'en Acte 3 : trophée « Chaud, le rendez-vous ! »."],
    trophies: ["karlach"]
  },
  {
    id: "halsin", n: "Halsin", race: "Elfe des bois", cls: "druide", stats: null,
    recruit: "Acte 1 · retenu dans le temple du camp gobelin ; il rejoint ton camp une fois les chefs gobelins vaincus.", act: "a1",
    build: {
      n: "Ours du Cercle de la Lune", sub: "Lune",
      d: "Il combat en forme d'ours ou de bête : un second tank qui se soigne en changeant de forme.",
      prio: ["wis", "con", "str"],
      alt: ["Cercle des Étoiles : soins et sorts depuis l'arrière."],
      p: { 4: "Amélioration : Sagesse.", 10: "Formes élémentaires : très puissantes." }
    },
    tips: ["Sa quête en Acte 2 vise à lever la malédiction de l'ombre : il faut du temps et de l'aide."],
    trophies: []
  },
  {
    id: "minthara", n: "Minthara", race: "Drow", cls: "paladin", stats: null,
    recruit: "Acte 1 · cheffe du camp gobelin. Elle rejoint si tu attaques le Bosquet avec les gobelins, ou si tu l'assommes (dégâts non létaux) puis la libères à Hautelune en Acte 2.", act: "a1",
    build: {
      n: "Vengeance à deux mains", sub: "Vengeance",
      d: "Une paladine d'attaque : châtiments divins et Vœu d'inimitié pour toucher à coup sûr.",
      prio: ["str", "cha", "con"],
      alt: ["Multiclasse Occultiste ou Ensorceleur pour plus d'emplacements de châtiment."],
      p: { 2: "Style : Armes à deux mains.", 4: "Maître d'armes lourdes (Great Weapon Master).", 8: "Amélioration : Charisme." }
    },
    tips: ["Attention : le raid sur le Bosquet fait partir Wyll, Karlach et Halsin, et rend impossible « On ne laisse personne ». Préfère l'assommer."],
    trophies: []
  },
  {
    id: "jaheira", n: "Jaheira", race: "Demi-elfe", cls: "druide", stats: null,
    recruit: "Acte 2 · à l'auberge du Dernier Refuge, avec les Ménestrels.", act: "a2",
    build: {
      n: "Druide de la Terre", sub: "Terre",
      d: "Une vétérane solide : contrôle de zone et soins. Elle arrive à un niveau élevé.",
      prio: ["wis", "con", "dex"],
      alt: ["Multiclasse Guerrier pour une combattante polyvalente."],
      p: {}
    },
    tips: ["Si elle tombe au combat, elle ne revient pas : garde un parchemin de résurrection sous la main.", "Sa quête en Acte 3 mène à Minsc."],
    trophies: []
  },
  {
    id: "minsc", n: "Minsc", race: "Humain", cls: "rôdeur", stats: null,
    recruit: "Acte 3 · pendant la quête de Jaheira à la Porte de Baldur.", act: "a3",
    build: {
      n: "Rôdeur de mêlée", sub: "",
      d: "Arrive tard, mais très efficace en corps à corps. Et Bouh l'accompagne.",
      prio: ["str", "con", "wis"],
      alt: ["Multiclasse Guerrier pour plus d'attaques."],
      p: {}
    },
    tips: ["Comme Jaheira, s'il tombe au combat, il ne revient pas."],
    trophies: []
  }
];
