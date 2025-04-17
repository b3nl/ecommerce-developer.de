---
title: "Interfaces on Abstracts?"
description: "Ein nostalgischer Rückblick auf die Einführung von Interfaces und abstrakten Klassen in PHP 5 und deren Einfluss auf sauberen Code, DRY-Prinzipien und das Liskovsche Substitutionsprinzip."
pubDatetime: 2025-04-17T11:00:00+01:00
tags: ["PHP", "Clean Code", "Design Patterns", "OOP", "DRY", "LSP", "SOLID", "Interfaces", "Abstracts"]
draft: false
featured: true
---

## 🎉 Als PHP mit Version 5 Interfaces und abstrakte Klassen einführte, war ich aus dem Häuschen!

🤔 Wie alt kann man sich beim Bloggen eigentlich fühlen? 😅

Heutzutage denkt man kaum noch darüber nach: Als PHP abstrakte Klassen einführte, war das für mich ein echter Meilenstein. Endlich konnte ich Teile eines Interfaces in eine abstrakte Klasse auslagern. Das bedeutete: Gemeinsame Logik zentralisieren und die konkreten Klassen nur noch das implementieren lassen, was wirklich nötig war. 🧹✨

Das führte zu einem massiven Refactoring – viele redundante Implementierungen konnten einfach verschwinden. 🪄

## 🐢🐦 Von der Tierklasse zur eleganten Abstraktion

Vorher sah mein Code etwa so aus:

```php
class Animal  {
    public function canFly() {
        return false;
    } 
    
    public function isCarnivore() {
        return false;
    }
    
    public function isFlyingMeatEater() {
        return $this->canFly() && $this->isCarnivore();
    }
} 

class TurtleDove extends Animal {
    public function canFly() {
        return true;
    } 
    
    public function isCarnivore() {
        return true;
    }    
} 
```

Nach dem Refactoring wurde daraus:

```php
interface Animal {
    public function canFly();
   
    public function isCarnivore();
    
    public function isFlyingMeatEater();
}

abstract class AbstractAnimal implements Animal {
    public function isFlyingMeatEater() {
        return $this->canFly() && $this->isCarnivore();
    }
} 

class TurtleDove extends AbstractAnimal {
    // Implementiere nur den Rest!
} 
```

"Leider" ist es mittlerweile so normal geworden, dass die PHP-Dokumentation dieses Thema auch nicht mehr wirklich aktiv andeutet, [außer in Beispiel 7 der Interfaces 😉](https://www.php.net/manual/en/language.oop5.interfaces.php#language.oop5.interfaces.examples.ex5) 

## 🤔 Also, warum sollte man Interfaces auf abstrakte Klassen anwenden?

1️⃣ Der erste Grund ist eine bekannte und grundlegende Heuristik: [DRY (Don’t Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

> Duplication is the primary enemy of a well-designed system. It represents additional work, additional risk, and additional unnecessary complexity.
>
> - <cite>- C., Martin Robert. Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin Series) (English Edition) (p. 366). (Function). Kindle Edition.</cite>

Onkel Bob geht sogar so weit, es als die Wurzel allen Übels zu bezeichnen. Und ich kenne viele Entwickler, die dies als eines der größten Probleme in Teams ansehen.

> Duplication may be the root of all evil in software.
> 
> - <cite>- C., Martin Robert. Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin Series) (English Edition) (p. 136). (Function). Kindle Edition.</cite>


Es lohnt sich also, auch nur ein paar Zeilen Code zu refaktorisieren.

> even [...] just a few lines of code.
> 
> <cite>- C., Martin Robert. Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin Series) (English Edition) (p. 366). (Function). Kindle Edition.</cite>

2️⃣ Der zweite Grund ist das [Liskovsche Substitutionsprinzip (LSP)](https://en.wikipedia.org/wiki/Liskov_substitution_principle). Klassisch und prominent wird bei der Betrachtung des LSP eine Version genutzt, die auch Wikipedia verwendet:

> an object (such as a class) may be replaced by a sub-object (such as a class that extends the first class) without breaking the program.
> 
> <cite>- https://en.wikipedia.org/wiki/Liskov_substitution_principle</cite>

Dabei wird jedoch die Quelle unterschlagen; Ausgangspunkt für dieses Gesetzt ist immer noch die Basisklasse. Und damit gilt das Prinzip umgekehrt genauso. 
Oder wie es Onkel Bob formuliert:

> SUBTYPES MUST BE SUBSTITUTABLE FOR THEIR BASE TYPES.
>
> <cite>- Martin, Robert C. Agile Software Development, Principles, Patterns, and Practices: Pearson New International Edition (English Edition) (p. 111). (Function). Kindle Edition.</cite>

3️⃣ Und der Dritte Grund: Die Kombination einer abstrakten Klasse mit einem Interface erzwingt das [TEMPLATE METHOD Pattern](https://en.wikipedia.org/wiki/Template_method_pattern) auf natürliche Weise.

Und die Entwicklung gegen ein Interface statt gegen eine Basisklasse verschafft maximale Flexibilität und sorgt für die Einhaltung des [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle), dem “D” in [SOLID](https://ecommerce-developer.de/solid-refactoring-als-technischer-leiter-einer-agentur/). 

## 💡 Mein Vorschlag

Mein Vorschlag wäre also: Wenn es sich um ein allgemeines Interface für Kindklassen mit geteilter Logik handelt, dann sollte das Interface am besten auf eine Basisklasse angewendet werden, die die Basislogik zur Verfügung stellt.

Möchte man aber anzeigen, dass die konkrete Klasse das jeweilige Interface aus speziellen Gründen im Gegensatz zu ihrer Elternklasse umsetzt, nur dann würde ich das Interface nicht auf die Basisklasse setzen. 

```php
interface FlyingRat {
    public function doesCareWhatItEats();
}

class TurtleDove extends AbstractAnimal implements FlyingRat {
    // Implementiere nur den Rest und das andere Interface!
} 
```