/* « En jeu » : guide lieu par lieu de Baldur's Gate 3.
   Une action par ligne. Rédigé d'après les guides de trophées (PSNProfiles, PlayStationTrophies, bg3.wiki) ;
   les noms anglais des lieux sont entre parenthèses pour retrouver facilement un guide.
   todo : à faire ici · miss : à ne pas rater avant de partir · save : sauvegarde conseillée */
export const ZONES = [
  {
    id: "nautiloide", a: "pro", n: "Nautiloïde", en: "Nautiloid",
    todo: ["Ouvre la capsule d'Ombrecœur pour la libérer.", "Fais équipe avec Lae'zel.", "Rejoins la salle de commandes pour prendre le contrôle du vaisseau."],
    miss: ["Tu ne pourras jamais revenir ici.", "Zhalk : c'est ton groupe qui doit porter le coup fatal. Si le flagelleur l'achève, recharge."],
    save: "Avant d'affronter le commandant Zhalk. Il est très résistant : tu peux aussi fuir et le garder pour une autre partie.",
    trophies: ["zhalk", "avernus"], comps: ["ombrecoeur", "laezel"]
  },
  {
    id: "plage", a: "a1", n: "Plage du crash", en: "Ravaged Beach",
    todo: ["Retrouve Ombrecœur près des débris.", "Recrute Astarion sur la plage.", "Touche la rune lumineuse pour sortir Gale du portail.", "Libère Lae'zel, prisonnière de deux tieffelins non loin."],
    miss: [],
    save: "Avant de parler à Astarion : la rencontre commence par une embuscade.",
    trophies: [], comps: ["astarion", "gale", "ombrecoeur", "laezel"]
  },
  {
    id: "bosquet", a: "a1", n: "Bosquet d'Émeraude", en: "Emerald Grove",
    todo: ["Repousse l'attaque gobeline à l'entrée et recrute Wyll.", "Convaincs Arka de ne pas tuer Sazza (Persuasion ou Intimidation).", "Aide Sazza à s'évader de sa cellule.", "Empêche le Rite des épines (quête de Kagha).", "Accepte la quête de Wyll : elle te mène à Karlach."],
    miss: ["Si Arka tue Sazza, « Je refuse qu'on l'enferme ! » est perdu pour cette partie.", "Le Rite des épines chasse les tieffelins : empêche-le pour « On ne laisse personne »."],
    save: "Avant de parler à Arka, puis avant de parler à Kagha.",
    trophies: ["sazza", "personne"], comps: ["wyll"]
  },
  {
    id: "environs", a: "a1", n: "Route et forêt", en: "Risen Road, Forest",
    todo: ["Trouve Karlach grâce à la quête de Wyll : parle-lui au lieu de l'attaquer.", "Recrute Gratouille, le chien qui veille son maître dans la forêt.", "Grotte de l'ourson-hibou : ne tue surtout pas le petit.", "Au camp, joue à « Va chercher ! » avec Gratouille.", "Au camp, caresse Gratouille et l'ourson en même temps."],
    miss: ["Tuer l'ourson rend « Deux mains, sinon rien » impossible."],
    save: "Avant d'entrer dans la grotte de l'ourson-hibou.",
    trophies: ["va-chercher", "deux-mains"], comps: ["karlach"]
  },
  {
    id: "village", a: "a1", n: "Village abandonné", en: "Blighted Village",
    todo: ["Sous le village (Whispering Depths) : tue la matriarche des araignées avant que ses œufs éclosent.", "Dans la cave du nécromancien, trouve le parchemin rangé dans un cercueil.", "Lis le parchemin hors combat pour invoquer Pelle la quasit."],
    miss: [],
    save: "Avant de descendre affronter la matriarche des araignées.",
    trophies: ["omelette", "grossieretes"], comps: []
  },
  {
    id: "campgob", a: "a1", n: "Camp gobelin", en: "Shattered Sanctum",
    todo: ["Libère Halsin, retenu dans le temple.", "Sauve Sazza avant de t'en prendre aux chefs.", "Vaincs les trois chefs : Minthara, Dror Ragzlin et Gut.", "Pour recruter Minthara sans trahir le Bosquet : assomme-la à mains nues, attaques non létales activées."],
    miss: ["Ne tue pas les chefs avant d'avoir sauvé Sazza : elle se battrait avec les gobelins.", "Aider les gobelins à attaquer le Bosquet fait partir Wyll, Karlach et Halsin, et rend « On ne laisse personne » impossible."],
    save: "Avant d'entrer dans le temple, puis avant chaque chef.",
    trophies: ["sazza", "personne"], comps: ["halsin", "minthara"]
  },
  {
    id: "outreterre", a: "a1", n: "Outreterre et Malforge", en: "Underdark, Grymforge",
    todo: ["Sur la plage de l'Outreterre, prends le bateau duergar vers Malforge.", "Récupère les moules et le minerai de mithral.", "Fabrique un objet à la forge d'adamantium.", "Bats le golem Grym sans faire tomber le marteau de la forge sur lui."],
    miss: ["Il n'existe que deux minerais de mithral : choisis bien tes deux objets.", "Le marteau de la forge rend le combat facile, mais il annule « Complètement marteau »."],
    save: "Avant le combat contre Grym.",
    trophies: ["forge", "marteau"], comps: []
  },
  {
    id: "col", a: "a1", n: "Col de montagne", en: "Mountain Pass, Rosymorn Monastery",
    todo: ["Au monastère d'Auberosée, place le blason du Maître de l'aube dans le panneau pour libérer le Sang de Lathandre.", "Accompagne Lae'zel à la crèche githyanki.", "Garde Gale avec toi : Elminster peut venir stabiliser son orbe en fin d'acte."],
    miss: ["Passer aux Terres maudites par l'ombre ferme l'Acte 1 : vérifie tes manquables avant."],
    save: "Avant de prendre le Sang de Lathandre : la salle se défend.",
    trophies: ["prise-sang", "trame", "charybde"], comps: ["laezel", "gale"]
  },
  {
    id: "terres", a: "a2", n: "Terres maudites par l'ombre", en: "Shadow-Cursed Lands",
    todo: ["Reste près d'une source de lumière : l'ombre blesse sans protection.", "Cueille une orchidée nocturne et offre-la à Ombrecœur.", "Si tu es passé par l'Outreterre, Elminster vient ici pour l'orbe de Gale."],
    miss: [],
    save: "Avant de t'éloigner d'une zone éclairée.",
    trophies: ["fleur-nuit", "trame"], comps: []
  },
  {
    id: "refuge", a: "a2", n: "Auberge du Dernier Refuge", en: "Last Light Inn",
    todo: ["Rencontre Jaheira et les Ménestrels.", "Fais réparer le cœur de Karlach par Dammon avec du Fer infernal.", "Protège le refuge et les tieffelins réfugiés.", "Aide Art Cullagh et retrouve son luth abîmé : c'est ce qui permet de recruter Halsin."],
    miss: ["Jaheira doit survivre jusqu'à son recrutement définitif.", "Sans l'aide à Art Cullagh, Halsin reste dans les Terres maudites."],
    save: "Avant de défendre le portail de Halsin (5 tours à tenir).",
    trophies: ["personne", "karlach"], comps: ["jaheira", "halsin"]
  },
  {
    id: "reithwin", a: "a2", n: "Ville de Reithwin", en: "Reithwin Town",
    todo: ["Maison de guérison : neutralise le chirurgien dès le premier tour, avant qu'il n'opère.", "Maison du péage, 2e étage : convaincs Gerringothe Thorm pour qu'elle explose sans combat."],
    miss: [],
    save: "Avant chacun de ces deux combats.",
    trophies: ["chirurgien", "sou"], comps: []
  },
  {
    id: "gantelet", a: "a2", n: "Gantelet de Shar", en: "Gauntlet of Shar",
    todo: ["Accompagne Ombrecœur dans ses épreuves.", "Prends le temps de réfléchir avant son choix final : il change sa classe et son histoire."],
    miss: [],
    save: "Juste avant la décision finale d'Ombrecœur.",
    trophies: [], comps: ["ombrecoeur"]
  },
  {
    id: "hautelune", a: "a2", n: "Tours de Hautelune", en: "Moonrise Towers",
    todo: ["Au jugement des gobelins, ordonne aux gardes de libérer Sazza.", "Libère tous les prisonniers de la prison, tieffelins compris.", "Si tu as assommé Minthara, sauve-la de son procès.", "Fin d'acte : bats l'apôtre de Myrkul avant qu'il n'absorbe la moindre nécromite."],
    miss: ["Quitter Hautelune pour la Porte de Baldur ferme l'Acte 2."],
    save: "Avant d'entrer dans la prison, puis avant le combat final de l'acte.",
    trophies: ["sazza", "verrous", "personne", "repas", "cite"], comps: ["minthara"]
  },
  {
    id: "rivington", a: "a3", n: "Rivington", en: "Rivington, Wyrm's Crossing",
    todo: ["Retrouve les réfugiés tieffelins arrivés en ville.", "Traverse le Pont du Ver pour entrer dans la ville."],
    miss: [],
    save: "En arrivant, avant de lancer les grandes quêtes.",
    trophies: ["personne"], comps: []
  },
  {
    id: "villebasse", a: "a3", n: "Ville basse", en: "Lower City",
    todo: ["Au camp, accepte le rendez-vous de Karlach.", "Palais de Cazador : quête d'Astarion, le choix sur le rituel est décisif.", "Quête de Jaheira : retrouve Minsc.", "Temple de Bhaal : tue Orin pendant le rituel de ses fidèles.", "Sombres Pulsions : meurtres pour Bhaal, puis transformation en Ravageur."],
    miss: [],
    save: "Avant le palais de Cazador et avant le temple de Bhaal.",
    trophies: ["karlach", "orin", "meurtres", "pulsions"], comps: ["minsc", "astarion", "karlach"]
  },
  {
    id: "rocher", a: "a3", n: "Rocher du Ver", en: "Wyrm's Rock",
    todo: ["Laisse le couronnement de Gortash se terminer : ne l'attaque pas à ce moment-là.", "Désactive le Guet d'acier à la fonderie avant d'affronter Gortash.", "Combat Gortash : casse les pièges de la première salle, puis attire-le loin d'eux.", "Sous la prison, dans le Chemin du Ver : fais tomber le dragon Ansur quand il vole."],
    miss: [],
    save: "Avant Gortash, puis avant Ansur.",
    trophies: ["gortash", "atterrissage"], comps: []
  },
  {
    id: "quetes3", a: "a3", n: "Quêtes des compagnons", en: "Act 3 companion quests",
    todo: ["Wyll : rompre son pacte avec Mizora.", "Lae'zel : allie-toi à Voss contre la reine-liche.", "Romance avec l'empereur.", "Karlach : le rendez-vous, une fois son cœur réparé."],
    miss: [],
    save: "Avant chaque grande conversation de fin de quête.",
    trophies: ["wyll", "reine-liche", "amour-tete", "karlach"], comps: ["wyll", "laezel", "karlach"]
  },
  {
    id: "villehaute", a: "fin", n: "Ville haute, assaut final", en: "Upper City",
    todo: ["Pendant l'assaut, concentre tes dégâts sur le dragon rouge.", "Sauvegarde juste avant le choix final face au cerveau.", "Recharge cette sauvegarde pour obtenir plusieurs fins."],
    miss: [],
    save: "Juste avant le choix final : une seule sauvegarde peut donner plusieurs trophées de fin.",
    trophies: ["dragon-rouge", "fin", "heros", "pouvoir-absolu", "ceremorphose", "peches-pere"], comps: []
  }
];
