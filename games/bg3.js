/* Baldur's Gate 3 · PS5 — définition du jeu.
   Même format que games/modele-jeu.json : pour ajouter un jeu, copie ce modèle
   et importe-le depuis l'onglet « Plus » de l'app, ou ajoute un fichier ici. */
import * as PARTY from "./bg3-party.js";

const CLASSES = ["Barbare","Barde","Clerc","Druide","Ensorceleur","Guerrier","Magicien","Moine","Occultiste","Paladin","Rôdeur","Roublard"];

export default {
  id: "bg3",
  name: "Baldur's Gate 3",
  platform: "PS5",
  player: "Lamia Bstn",
  platTitle: "La fierté de la Porte de Baldur",
  points: { p: 0, g: 90, s: 30, b: 15 },
  theme: {},
  cats: {
    histoire:   { l: "Histoire",          i: "book",  skill: "Histoire",     check: "Test d'Intelligence" },
    fins:       { l: "Fins",              i: "crown", skill: "Arcanes",      check: "Test d'Intelligence" },
    durge:      { l: "Sombres Pulsions",  i: "skull", skill: "Intimidation", check: "Test de Charisme" },
    boss:       { l: "Boss",              i: "helm",  skill: "Athlétisme",   check: "Test de Force" },
    compagnons: { l: "Compagnons",        i: "heart", skill: "Persuasion",   check: "Test de Charisme" },
    explo:      { l: "Exploration",       i: "chest", skill: "Perception",   check: "Test de Sagesse" },
    aventure:   { l: "Vie d'aventurier",  i: "vial",  skill: "Survie",       check: "Test de Sagesse" },
    combat:     { l: "Combat",            i: "sword", skill: "Acrobaties",   check: "Test de Dextérité" },
    difficulte: { l: "Difficulté",        i: "d20",   skill: "Constitution", check: "Jet de sauvegarde" }
  },
  acts: [
    { id: "pro", l: "Prologue", close: "Une fois le nautiloïde écrasé, impossible d'y remonter." },
    { id: "a1",  l: "Acte 1",   close: "Le passage vers les Terres maudites par l'ombre est un point de non-retour : l'Acte 1 se referme derrière toi." },
    { id: "a2",  l: "Acte 2",   close: "Quitter les Tours de Hautelune pour la Porte de Baldur ferme définitivement l'Acte 2." },
    { id: "a3",  l: "Acte 3",   close: "Lancer l'assaut final sur la ville haute verrouille le reste de l'Acte 3." },
    { id: "fin", l: "Final" }
  ],
  anyLabel: "Toute la partie",
  party: PARTY,
  run: {
    fields: [
      { id: "origin", l: "Origine", o: [["tav","Tav"],["durge","Sombres Pulsions"],["astarion","Astarion"],["gale","Gale"],["karlach","Karlach"],["laezel","Lae'zel"],["ombrecoeur","Ombrecœur"],["wyll","Wyll"]] },
      { id: "cls", l: "Classe", o: CLASSES.map(c => [c.toLowerCase(), c]) },
      { id: "diff", l: "Difficulté", o: [["explo","Explorateur"],["equi","Équilibré"],["tact","Tacticien"],["honneur","Honneur"],["perso","Personnalisée"]] }
    ]
  },
  guides: [
    { n: "Guide PSTHC", lang: "FR", d: "Feuille de route et méthode pour chaque trophée.", u: "https://www.psthc.fr/unjeu/baldur-gate3-ps5/guide-trophees.htm", feat: 1 },
    { n: "Liste et entraide PSTHC", lang: "FR", d: "Les 54 trophées avec les astuces des joueurs.", u: "https://www.psthc.fr/unjeu/baldur-gate3-ps5/liste-trophees.htm" },
    { n: "Soluce Millenium", lang: "FR", d: "Quêtes, compagnons et romances, chapitre par chapitre.", u: "https://www.millenium.org/guide/405793.html", cats: ["compagnons"] },
    { n: "Monster Soluce", lang: "FR", d: "Trophées et soluce complète.", u: "https://www.monster-soluce.com/jeux/baldurs-gate-3/succes-trophees" },
    { n: "Guide PSNProfiles", lang: "EN", d: "Roadmap détaillée et trophées manquables.", u: "https://psnprofiles.com/guide/17598-baldurs-gate-iii-trophy-guide", cats: ["durge","fins"] },
    { n: "PlayStationTrophies", lang: "EN", d: "Guide et roadmap pas à pas.", u: "https://www.playstationtrophies.org/game/baldurs-gate-iii/guide/" }
  ],
  trophies: [
    {id:"platine",n:"La fierté de la Porte de Baldur",d:"Collectionner tous les trophées de Baldur's Gate 3. Un véritable exploit !",t:"p",c:"histoire",a:"fin",r:4.45},
    {id:"avernus",n:"Fuite de l'Avernus",d:"Prendre le contrôle du nautiloïde et vous enfuir des Enfers.",t:"b",c:"histoire",a:"pro",r:99.39},
    {id:"charybde",n:"De Charybde en Scylla",d:"Quitter l'acte 1 pour vous rendre dans un lieu bien plus sombre.",t:"b",c:"histoire",a:"a1",r:50.89},
    {id:"cite",n:"La cité vous attend",d:"Quitter l'acte 2 pour rejoindre la Porte de Baldur.",t:"b",c:"histoire",a:"a2",r:40.17},
    {id:"fin",n:"Tout est bien qui finit bien",d:"Terminer le jeu (ce qui vous vaudra un immense merci de toute l'équipe de Larian Studios).",t:"g",c:"histoire",a:"fin",r:25.92},
    {id:"pouvoir-absolu",n:"Le pouvoir absolu corrompt totalement",d:"Prendre le contrôle du cerveau infernal pour instaurer un règne de terreur sur le monde.",t:"s",c:"fins",a:"fin",r:12.42},
    {id:"heros",n:"Héros des Royaumes Oubliés",d:"Tuer le cerveau infernal, détruire les larves de l'Absolue et sauver tout le monde.",t:"s",c:"fins",a:"fin",r:27.22},
    {id:"peches-pere",n:"Les péchés du père",d:"Prendre le contrôle du cerveau infernal, détruire le monde et monter sur le Trône de Sang.",t:"s",c:"fins",a:"fin",r:6.72,durge:1,req:{origin:["durge"]},tip:"Réservé à l'origine Sombres Pulsions : il faut avoir suivi la voie de Bhaal jusqu'au bout, puis prendre le contrôle du cerveau pour lui à la fin. Sauvegarde avant le choix final."},
    {id:"ceremorphose",n:"Cérémorphose",d:"Devenir un flagelleur mental, vaincre le cerveau infernal et faire le sacrifice de votre vie.",t:"s",c:"fins",a:"fin",r:13.56,tip:"Fin à choix : sauvegarde juste avant le dénouement. Une même sauvegarde permet de récupérer plusieurs fins en rechargeant."},
    {id:"jeu-role",n:"Jeu de rôle",d:"Accomplir 10 objectifs personnels en une seule partie pour ne faire qu'un avec votre personnage.",t:"b",c:"aventure",a:"any",r:57.69,goal:10,u:"objectifs"},
    {id:"paillasses",n:"Paillasses et petits-déjeuners",d:"Vous accorder quatre longs repos en une seule partie. La vie d'aventurier, c'est épuisant !",t:"b",c:"aventure",a:"any",r:67.06,goal:4,u:"repos"},
    {id:"puissance-esprit",n:"La puissance de l'esprit",d:"Absorber un parasite et débloquer un nouveau pouvoir. C'est normal qu'il continue de gigoter ?",t:"b",c:"aventure",a:"a1",r:55.78},
    {id:"richesse-sol",n:"La richesse sous le sol",d:"Déterrer 5 coffres enterrés en une seule partie. À vous les trésors !",t:"b",c:"explo",a:"any",r:61.61,goal:5,u:"coffres"},
    {id:"invasion-pensees",n:"Invasion des pensées",d:"Utiliser Détection des pensées pour lire dans l'esprit de quelqu'un d'autre.",t:"b",c:"aventure",a:"any",r:65.77},
    {id:"evasion",n:"Spécialiste de l'évasion",d:"Vous échapper de prison après vous être fait arrêter. De l'audace, toujours de l'audace !",t:"b",c:"explo",a:"any",r:38.07},
    {id:"recrutement",n:"Recrutement",d:"Recruter un serviteur, que ce soit pour vous en faire un ami ou vous en servir de chair à canon.",t:"b",c:"aventure",a:"any",r:23.48},
    {id:"touche-a-tout",n:"Touche-à-tout",d:"Vous multiclasser dans toutes les classes en une seule partie, sans demander l'aide de Flétriss.",t:"b",c:"aventure",a:"any",r:9.30,goal:12,u:"classes",steps:CLASSES,stepsDrive:1,tip:"Il y a 12 classes et le niveau maximum est 12 : le plus sûr est de monter un personnage avec un niveau dans chaque classe. Ne passe jamais par Flétriss pour changer de classe sur cette partie."},
    {id:"brassage",n:"Brassage maison",d:"Créer trois nouvelles préparations alchimiques en une seule partie. Cul sec !",t:"b",c:"aventure",a:"any",r:32.57,goal:3,u:"préparations"},
    {id:"deux-mains",n:"Deux mains, sinon rien",d:"Caresser Gratouille et l'ourson-hibou en même temps. Sont-ils pas mignons ?",t:"b",c:"compagnons",a:"a1",r:27.50},
    {id:"grossieretes",n:"Concours de grossièretés",d:"Trouver et invoquer Pelle, la quasit. À moins que son nom soit Fourchette ? Ou peut-être Panière ?",t:"b",c:"explo",a:"any",r:19.75},
    {id:"forge",n:"Forgé dans le sang et le feu",d:"Fabriquer un objet à la forge d'adamantium.",t:"b",c:"explo",a:"a1",r:38.48},
    {id:"verrous",n:"Sous les verrous",d:"Secourir tous les prisonniers des Tours de Hautelune en une seule partie.",t:"b",c:"explo",a:"a2",r:25.90},
    {id:"sazza",n:"Je refuse qu'on l'enferme !",d:"Secourir Sazza au Bosquet d'Émeraude, au camp des gobelins et aux Tours de Hautelune en une partie.",t:"b",c:"explo",a:"a1",r:8.36,goal:3,u:"sauvetages",steps:["Acte 1 · Bosquet d'Émeraude","Acte 1 · Camp des gobelins","Acte 2 · Tours de Hautelune"],stepsDrive:1,tip:"Trois sauvetages dans la même partie : au Bosquet et au camp des gobelins en Acte 1, puis aux Tours de Hautelune en Acte 2. Elle doit survivre à chaque fois, sauvegarde avant chaque étape."},
    {id:"prise-sang",n:"Prise de sang",d:"Voler le Sang de Lathandre, sous le Monastère d'Auberosée.",t:"b",c:"explo",a:"a1",r:33.54,tip:"Le monastère est sur la route du Col de montagne, en fin d'Acte 1. Sauvegarde avant de prendre la relique : la salle se défend."},
    {id:"personne",n:"On ne laisse personne",d:"Sauver tous les réfugiés tieffelins possibles en une seule partie.",t:"b",c:"explo",a:"a1",r:8.64,steps:["Acte 1 · Défendre le Bosquet d'Émeraude","Acte 2 · Libérer les tieffelins captifs","Acte 3 · Retrouver les réfugiés à la Porte de Baldur"],tip:"Le plus exigeant des trophées « une partie » : protège le Bosquet en Acte 1, puis sauve chaque tieffelin captif aux actes suivants. Garde des sauvegardes séparées à chaque étape. Ajoute tes propres étapes à la liste au fil de ta partie."},
    {id:"meurtres",n:"Meurtres en série à la Porte de Baldur",d:"Répandre le sang dans les rues de la Porte de Baldur et devenir l'assassin impie de Bhaal.",t:"b",c:"durge",a:"a3",r:13.60,durge:1,req:{origin:["durge"]}},
    {id:"amour-tete",n:"L'amour dans la tête",d:"Courtiser l'empereur.",t:"b",c:"compagnons",a:"a3",r:18.25},
    {id:"pierre-deux-coups",n:"D'une pierre deux coups",d:"Utiliser un ennemi comme arme improvisée contre un autre.",t:"b",c:"combat",a:"any",r:13.48},
    {id:"artiste",n:"Pour l'artiste !",d:"Gagner 100 pièces d'or en jouant de la musique pour les gens en une seule partie.",t:"b",c:"aventure",a:"any",r:7.61,goal:100,u:"po",tip:"Équipe un instrument et joue devant des PNJ dans les zones peuplées. Un personnage doué en Représentation (barde) gagne plus à chaque fois."},
    {id:"sursaut",n:"Sursaut d'activité",d:"Effectuer 5 attaques en un seul tour. Vos ennemis ne comprendront pas ce qui leur arrive.",t:"b",c:"combat",a:"any",r:48.84},
    {id:"mains-tueur",n:"Des mains de tueur",d:"Tuer un personnage à l'aide d'une attaque à mains nues.",t:"b",c:"combat",a:"any",r:42.77},
    {id:"zhalk",n:"Un combat des plus diaboliques",d:"Vaincre le commandant Zhalk à bord du nautiloïde.",t:"b",c:"boss",a:"pro",r:37.88},
    {id:"omelette",n:"Omelette géante",d:"Tuer la matriarche des araignées avant que ses œufs éclosent. Pourquoi y en a-t-il autant ?",t:"b",c:"boss",a:"a1",r:17.82},
    {id:"marteau",n:"Complètement marteau",d:"Détruire le golem d'adamantium sans utiliser le marteau de la forge.",t:"b",c:"boss",a:"a1",r:19.82,tip:"Le golem de la forge d'adamantium, à Malforge dans l'Outreterre (Acte 1) : bats-le avec tes propres attaques sans faire tomber le marteau de la forge sur lui."},
    {id:"chirurgien",n:"Procédure non invasive",d:"Tuer le chirurgien sans le laisser utiliser ses capacités chirurgicales au combat.",t:"b",c:"boss",a:"a2",r:24.42,tip:"Le chirurgien de la Maison de guérison, en Acte 2. Neutralise-le dès le premier tour (contrôle, silence, gros dégâts concentrés) pour qu'il n'agisse jamais."},
    {id:"sou",n:"Un sou, c'est un sou",d:"Vaincre la garde-barrière sans qu'elle utilise d'or contre vous. Excellente budgétisation !",t:"b",c:"boss",r:28.10},
    {id:"repas",n:"Aucun repas gratuit",d:"Vaincre l'apôtre de Myrkul sans lui laisser le temps d'absorber la moindre nécromite.",t:"b",c:"boss",a:"a2",r:31.78},
    {id:"gortash",n:"Joli jeu de jambes",d:"Vaincre Gortash sans déclencher le moindre piège. Plus facile à dire qu'à faire !",t:"b",c:"boss",a:"a3",r:9.33,tip:"Repère et désamorce les pièges avant d'engager le combat, puis reste hors des zones piégées. Sauvegarde juste avant."},
    {id:"orin",n:"Premier sang",d:"Tuer Orin pendant que ses cultistes sont en train d'accomplir leur rituel.",t:"b",c:"boss",a:"a3",r:24.24},
    {id:"dragon-rouge",n:"Interfectorem Draconis",d:"Tuer le dragon rouge dans la ville haute.",t:"b",c:"boss",a:"fin",r:19.53,tip:"Il apparaît pendant l'assaut final dans la ville haute. Concentre tes dégâts sur lui plutôt que de seulement avancer."},
    {id:"atterrissage",n:"Atterrissage en catastrophe",d:"Dans l'antre du dracosire, attendre que le dragon soit en vol et le faire tomber au sol.",t:"b",c:"boss",a:"a3",r:11.60},
    {id:"cul-sec",n:"Cul sec !",d:"Vous accorder un long repos rien qu'en buvant de l'alcool. Une tradition millénaire chez les nains.",t:"b",c:"aventure",a:"any",r:30.75},
    {id:"pousse-toi",n:"Pousse-toi de là",d:"Tuer une créature à l'aide de dégâts de chute.",t:"b",c:"combat",a:"any",r:45.74},
    {id:"rat-biblio",n:"Rat de bibliothèque",d:"Lire 100 livres différents dans une seule partie. Il y a d'autres façons de partir à l'aventure.",t:"b",c:"explo",a:"any",r:41.93,goal:100,u:"livres"},
    {id:"vertus-boisson",n:"Les vertus de la boisson",d:"Vaincre 20 adversaires tandis qu'un membre du groupe est saoul en une seule partie.",t:"b",c:"combat",a:"any",r:8.37,goal:20,u:"adversaires",tip:"Fais boire de l'alcool à un compagnon juste avant les combats pour qu'il soit saoul. Le compteur se cumule sur toute la partie."},
    {id:"va-chercher",n:"Va chercher !",d:"Jouer à « Va chercher ! » avec Gratouille, le plus gentil chien des royaumes.",t:"b",c:"compagnons",a:"a1",r:40.23},
    {id:"trame",n:"Reprisage de la Trame",d:"Parvenir à stabiliser l'orbe du Néthéril de Gayle.",t:"b",c:"compagnons",r:45.55},
    {id:"reine-liche",n:"Le courroux de la reine-liche",d:"Vous allier à Voss contre la reine éternelle des githyankis. Bonne chance !",t:"b",c:"compagnons",a:"a3",r:38.26},
    {id:"fleur-nuit",n:"La fleur de la nuit",d:"Offrir à Ombrecœur une orchidée nocturne, sa fleur préférée. Elle a toujours eu un côté fleur bleue.",t:"b",c:"compagnons",r:29.06},
    {id:"karlach",n:"Chaud, le rendez-vous !",d:"Aller à un rendez-vous amoureux avec Karlach. C'est ce qui s'appelle jouer avec le feu !",t:"b",c:"compagnons",a:"a3",r:9.90,tip:"Garde la romance avec Karlach jusqu'en Acte 3 et fais réparer son cœur par Dammon en lui apportant du Fer infernal : le rendez-vous se débloque ensuite."},
    {id:"astarion",n:"Juste pour goûter",d:"Laisser Astarion vous mordre. Aïe !",t:"b",c:"compagnons",a:"a1",r:53.50},
    {id:"wyll",n:"Écrit en tout petit",d:"Rompre le pacte liant Wyll à Mizora.",t:"b",c:"compagnons",a:"a3",r:26.78,tip:"Se joue au dénouement de la quête de Wyll en Acte 3, face à Mizora. Lis bien les options de dialogue et sauvegarde avant."},
    {id:"pulsions",n:"Pulsions dévorantes",d:"Devenir l'arme ultime de Bhaal et vous transformer en Ravageur.",t:"b",c:"durge",a:"a3",r:9.30,durge:1,req:{origin:["durge"]}},
    {id:"coup-critique",n:"Coup critique",d:"Terminer la partie en mode Tacticien.",t:"g",c:"difficulte",a:"any",r:7.22,req:{diff:["tact","honneur"]},tip:"Toute une partie en Tacticien. C'est l'occasion de faire en même temps les trophées « une partie » et l'origine Sombres Pulsions."},
    {id:"honneur",n:"Trophée du mode Honneur",d:"Terminer la partie en mode Honneur (contenu additionnel, ne compte pas pour le platine).",t:"g",c:"difficulte",a:"any",r:2.41,bonus:1,req:{diff:["honneur"]},tip:"Une seule sauvegarde, pas de rechargement : à garder pour après le platine."}
  ],
  /* Progression de départ (export de l'ancienne version, 29/10). Les dates exactes d'obtention sont inconnues. */
  seed: {
    done: ["amour-tete","astarion","atterrissage","avernus","brassage","charybde","cite","cul-sec","deux-mains","evasion","fin","fleur-nuit","forge","grossieretes","heros","invasion-pensees","jeu-role","mains-tueur","meurtres","omelette","orin","paillasses","pierre-deux-coups","pousse-toi","pouvoir-absolu","puissance-esprit","pulsions","rat-biblio","recrutement","reine-liche","repas","richesse-sol","sou","sursaut","trame","va-chercher","verrous","zhalk"],
    at: 1761732000000
  }
};
