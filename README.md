# K-52-AI-game
 "Mākslīgais intelekts" 1. praktiskais darbs (komanda 52) 

# Papildu prasības programmatūrai
Spēles sākumā cilvēks-spēlētājs norāda spēlē izmantojamas skaitļu virknes garumu, kas var būt diapazonā no 15 līdz 25 skaitļiem. Spēles programmatūra gadījuma ceļā saģenerē skaitļu virkni atbilstoši uzdotajam garumam, tajā iekļaujot skaitļus no 1 līdz 9.

Spēles sākumā ir dota ģenerētā skaitļu virkne. Katram spēlētājam ir 0 punktu. Spēlētāji izpilda gājienus secīgi. Gājiena laikā spēlētājs aizvieto jebkuru skaitļu pāri (divus blakus stāvošus skaitļus), pamatojoties uz šādiem principiem:  

•	ja divu blakus stāvošu skaitļu summa ir lielāka par 7, tad skaitļu pāri aizvieto ar 1 un savam punktu skaitam pieskaita 2 punktus;
•	ja divu blakus stāvošu skaitļu summa ir mazāka par 7, tad skaitļu pāri aizvieto ar 3 un no pretinieka punktu skaita atņem 1 punktu;
•	ja divu blakus stāvošu skaitļu summa ir vienāda ar 7, tad skaitļu pāri aizvieto ar 2 un no sava punktu skaita atņem 1 punktu.
Spēle beidzas, kad skaitļu virknē paliek tikai viens skaitlis. Uzvar spēlētājs, kam ir vairāk punktu.

# Programmatūrā ir jānodrošina šādas iespējas lietotājam: 

•	izvēlēties, kurš uzsāk spēli: lietotājs vai dators;
•	izvēlēties, kuru algoritmu izmantos dators: Minimaksa algoritmu vai Alfa-beta algoritmu;
•	izpildīt gājienus un redzēt izmaiņas spēles laukumā pēc gājienu (gan lietotāja, gan datora) izpildes;
•	uzsākt spēli atkārtoti pēc kārtējās spēles pabeigšanas.
•	Programmatūrai ir jānodrošina grafiskā lietotāja saskarne 

# Izstrādājot programmatūru, studentu komandai obligāti ir jārealizē:

•	spēles koka vai tā daļas ģenerēšana atkarībā no spēles sarežģītības un studentu komandai pieejamiem skaitļošanas resursiem;
•	heiristiskā novērtējuma funkcijas izstrāde;
•	Minimaksa algoritms un Alfa-beta algoritms (kas abi var būt realizēti kā Pārlūkošana uz priekšu pār n-gājieniem);
•	10 eksperimenti ar katru no algoritmiem, fiksējot datora un cilvēka uzvaru skaitu, datora apmeklēto virsotņu skaitu, datora vidējo laiku gājiena izpildei.

# Punktu skaits:     15 punkti

•	Vērtējums par atskaiti – 3 punkti
•	Vērtējums par izstrādāto programmatūru – 3 punkti
•	Vērtējums par praktiskā darba aizstāvēšanu – 5 punkti
•	Vidējais vērtējums studentam savstarpējā vērtēšanā – 4 punkti

# Darbs automātiski netiks izskatīts, un aizstāvēšana netiks nozīmēta, ja:

•	komanda nav iesniegusi darba atskaiti, bet piesakās darba aizstāvēšanai;
•	komanda iesniedza komandrindiņas programmatūru;
•	iesniegtajā darbā spēles koks netiek ģenerēts, bet ir predefinēts vai glabāts failā;
•	iesniegtajā darbā netiek realizēti studiju kursā apskatītie algoritmi (Minimaksa algoritms un Alfa-beta), bet •	•	dators izpilda gājienus gadījuma ceļā, vai gājieni ir predefinēti kodā, u.c.;
•	ir konstatēts akadēmiskā godīguma pārkāpums;
•	studentu komanda uz atskaites titullapas nav norādījusi saiti uz kodu publiskajā vietnē;
•	studentu komanda kodu pievienoja atskaitei attēlu veidā.
