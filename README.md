# 📚 Boekenzoeker
Met onze applicatie kun je boeken zoeken die jij leuk vindt. Het is natuurlijk erg vervelend als je een boek koopt, die achteraf niet zo leuk scheen te zijn. Met onze app kun je jouw eigen account maken en kun je inloggen. Vervolgens kun je jouw voorkeuren aangeven zodat je de leukste boeken kan vinden. Daarna komt het leukste, swipen! Je kunt door allerlei boeken swipen. De leukste kun  je opslaan en vervolgens halen in de boekenhandel. Ideaal voor boekenwurmen!

<img width="678" alt="Schermafbeelding 2022-04-01 om 13 41 21" src="https://user-images.githubusercontent.com/94406320/161256622-33d8bcef-0c57-47d6-80d0-0b26b7184f92.png">

# ⚙️ Instalatie 
Om ons project te kunnen gebruiken moet je het installeren. Voor het installeren van Bookbuddy heb moet je eerst een clone maken van deze repo. Dit doe je door in de terminal het volgende te typen:
```
$   git clone https://github.com/yelizerbas/boekenzoeker.git
```

Dit project maakt gebruik van een database bij MongoDB. Om je eigen database te connecten moet je een bestand .env aan maken met de volgende regel erin:

```
$   DB_USERNAME = "Jouw eigen database gebruikersnaam"
    DB_PASSWORD = "Jouw eigen database wachtwoord"
    MAIL_PASSWORD = "Jouw eigen mail wachtwoord"
```
Vervolgens is hetr tijd om te gaan installeren, dit doe je door dit te typen in je terminal:

```
$   npm install
```

Als dit allemaal is gelukt kun je het opstarten door het volgende te typen in je terminal. Nu kun je het project bekijken op jouw eigen localhost:3000. Dit typ je in in de browser. Let wel op, dit gaat elke keer als je de code wegdrukt weer uit, dus je moet dan opnieuw verbinding maken met:
```
$   npm start
```

## node installeren
In dit project maken wij gebruik van nodejs. Mocht je geen npm of nodejs hebben moet je dit eerst hebben. Dit download je heel simpel. Zet in je terminal het volgende om het te installeren.

```
 $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```

Dan sluit je je terminal af en doe je het volgende;
```
$ nvm install stable
```

Als het goed is gelukt kun je de versie van je npm en node printen met dit;
```
$ node -v # 
$ npm -v # 
```
Bij de # hoort te staan welke versie jij op jouw computer hebt staan

# 📝 Wiki
 Alle informatie over de matching app en over wat wij heb gedaan kun je lezen in de [Wiki](https://github.com/yelizerbas/boekenzoeker/wiki) . In de Wiki kun je al onze onderzoek zien die wij hebben gedaan voor dit project. Ook kun je terug vinden wat voor afspraken wij van te voren hebben gemaakt als groep.

# 🧾 Code of Conduct
Als je meer informatie wilt zien over hoe wij graag zouden willen hoe er met het project moet om worden gegaan, kun je de [Code of Conduct](https://github.com/yelizerbas/boekenzoeker/blob/main/CODE_OF_CONDUCT.md) lezen.

# 🔖 License
De license die voor Bookbuddy word gebruikt is MIT. Meer informatie over de MIT license kun je [hier](https://github.com/yelizerbas/boekenzoeker/blob/main/LICENSE.txt) lezen.

# 💌 Authors
Dit project is gemaakt door:
* [Ine](https://github.com/Inevdhoven)
* [Romy](https://github.com/romyjkk)
* [Yeliz](https://github.com/yelizerbas)
* [Yousri](https://github.com/ybouz2)
