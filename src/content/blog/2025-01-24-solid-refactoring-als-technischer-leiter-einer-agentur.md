---
slug: "solid-refactoring-als-technischer-leiter-einer-agentur"
title: "SOLID - Wie sehe ich Refactoring als technischer Leiter einer Agentur?"
description: "Eine persönliche Betrachtung zu den SOLID-Prinzipien und Refactoring, mit Fokus auf pragmatische Entscheidungen und Best Practices."
tags:
  - "php[architect]"
  - SOLID
  - Refactoring
  - Clean Code
  - Softwareentwicklung
  - PHP
  - Agentur
  - Spryker
pubDatetime: 2025-01-24T22:01:23+01:00
---

## Einleitung 📝

Nachdem ich gestern über [SOLID aus dem PHP Arch](https://ecommerce-developer.de/december-2024-issue-of-php_architect/) geschrieben habe, bin ich auf ein [Posting über SOLID und Refactoring bei Never Code Alone](https://nevercodealone.de/de/php-refactoring-best-practice/solid-prinzipien-in-php-clean-code-refactoring) gestoßen. 💡  
Ich dachte mir: *Mh, interessant.* Eine Chance, über mein Verhältnis zu Refactoring zu schreiben. 
Denn die Diskussion nämlich, wann und wie viel refactored werden sollte, begleitet mich persönlich seit Anfang meines Berufslebens – und die gesamte Branche, seitdem sie eigentlich existiert. ⚙️

Ich bin Agentur-Kind durch und durch. Mindestens die Hälfte meiner Zeit verbringe ich mit meinen Teams bei der Umsetzung 
von externen, zielgerichteten Anforderungen. 
Im Gegensatz zur Produktentwicklung zählt dort nicht jeder mögliche spätere Use Case meines Produkts, sondern die spezifische Anforderung. 🎯

Ich halte es da eher mit [Kent Beck](https://de.wikipedia.org/wiki/Kent_Beck), dem Erfinder von Extreme Programming:  
_"Make It Work, Make It Right, Make It Fast."_ 🛠️  
Oder wie wir in der IT, frei nach Voltaire/Montesquieu, sagen: _"Perfect is the enemy of done."_ ✅

Die Frage, welche Programmierung perfekt ist, ist schwerer zu beantworten als die Frage, ob die [Hand Gottes ein reguläres Tor war](https://de.wikipedia.org/wiki/Hand_Gottes_(Fußball)). ⚽  
Die Frage, ob man refactoren muss oder ob man mit Refactoring fertig ist, gehört genauso dazu. 
Unzählige Projekte sind gescheitert, weil man nicht das Ende gefunden hat. 
Bevor man fertig ist, erscheinen schon neue Sprachfeatures und Updates – und man müsste eigentlich *wieder* ran. 😅

⛔️**NEIN! Falsch. Raus mit dem Projekt. Fertig werden!** 🚀

Selbst [Uncle Bob](https://de.wikipedia.org/wiki/Robert_Cecil_Martin) schreibt in einem seiner wichtigsten Bücher zu diesem Thema:

> Even concepts as fundamental as elimination of duplication, code expressiveness, and the SRP can be taken too far.
>
> -- <cite>C., Martin Robert. Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin Series) (English Edition) (S.373). Pearson Education. Kindle-Version.</cite>

Damit kommen wir wieder zum Anfang zurück: Das Ziel ist die **cleane und zügige Umsetzung der Anforderungen** – nicht Perfektion. 💻✨

Und was "clean" ist, wird oft mit den [SOLID-Prinzipien](https://en.wikipedia.org/wiki/SOLID) beantwortet. 🧩

## Beispiele 📚

NCA's Roland gibt dafür folgendes Beispiel:

```php
class OrderProcessor {
   public function process($order) {
       // Validierung
       if (empty($order['items'])) {
           throw new Exception("Order is empty");
       }

       // Berechnung
       $total = 0;
       foreach ($order['items'] as $item) {
           $total += $item['price'] * $item['quantity'];
       }

       // Speicherung
       $this->saveToDatabase($order, $total);

       // Benachrichtigung
       $this->sendConfirmationEmail($order);
   }

   private function saveToDatabase($order, $total) {
       // Datenbanklogik
   }

   private function sendConfirmationEmail($order) {
       // E-Mail-Logik
   }
}
```

Und Roland macht gemäß SOLID daraus:

```php
class OrderValidator {
   public function validate(array $order): void {
       if (empty($order['items'])) {
           throw new Exception("Order is empty");
       }
   }
}

class OrderCalculator {
   public function calculateTotal(array $items): float {
       return array_reduce($items, fn($carry, $item) => $carry + ($item['price'] * $item['quantity']), 0);
   }
}

class OrderRepository {
   public function save(array $order, float $total): void {
       // Datenbanklogik
   }
}

class EmailService {
   public function sendConfirmation(array $order): void {
       // E-Mail-Logik
   }
}

class OrderProcessor {
   public function __construct(
       private OrderValidator $validator,
       private OrderCalculator $calculator,
       private OrderRepository $repository,
       private EmailService $emailService
   ) {}

   public function process(array $order): void {
       $this->validator->validate($order);
       $total = $this->calculator->calculateTotal($order['items']);
       $this->repository->save($order, $total);
       $this->emailService->sendConfirmation($order);
   }
}
```

## SOLID Betrachtung

Roland selbst sagt, dass er von den Prinzipien nur 3 umgesetzt hätte, nämlich das S-O-D: Single Responsibility, Open/Closed und Dependency Inversion.
Ich möchte Rolands Ideen noch ein bißchen weiter fortführen. 
Ganz besonders sein "Order"-Beispiel bietet sich dafür. Da können wir zusammen noch ein bisschen ausarten. 🤩 

Bei einer praktischen Betrachtung würde ich bei diesem Arbeitsergebnis - bis auf die Interfaces - wahrscheinlich auch aufhören 
oder es in einem Pull/Merge Request durchgehen lassen. Aber wir sind ja hier in einer Nerd-Diskussion. 😅🤙

### Dependency Inversion Principle

Gemäß [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle) würde ich dem 
OrderProcessor also normalerweise Interfaces "injecten" (und mit [Constructor property promotion](https://stitcher.io/blog/constructor-promotion-in-php-8) arbeiten 😉 ).

### Zum Open/Closed Principle:

NCA schreibt "_Neue Funktionen können hinzugefügt werden, ohne den bestehenden Code zu ändern._". Hinter [OCP](https://en.wikipedia.org/wiki/Open–closed_principle) steckt aber 
ein bisschen mehr, nämlich z.B. auch die theoretische Überprüfung und Vorrausschau was sonst noch mit dem Quellcode passieren könnte.
Und hier überspitze ich das Beispiel mal, wobei die folgenden Use-Cases für eine Order durchaus realistisch sind: 

1. Möchte ich auch das Total validieren, muss ich die Interna vom Processor für die Reihenfolge ändern. Das entspräche z.B. dem Shape Beispiel aus "PPP":

    > if we decided that all Circles should be drawn before any Squares. The DrawAllShapes  function is not closed against a change like this. To implement that change, we’ll have to go into DrawAllShapes  and scan the list first for Circles and then again for Squares.
    > 
    > -- <cite>Martin, Robert C.. Agile Software Development, Principles, Patterns, and Practices: Pearson New International Edition (English Edition) (S.104). Pearson Education. Kindle-Version.</cite> 
   
2. Oder ein weiterer möglicher Use-Case, andere Validierungen:

    Bei Orders wird in der Regel nicht nur validiert, ob die Items leer sind, sondern auch (vielleicht vorgelagert) neben Anderem ob 
    die Adressdaten der Order korrekt sind. 
    Wo kommt diese Änderung nun hin? Für diesen Change muss ich vielleicht den Processor oder auch den Validator selbst 
    ändern, und damit verstoße ich dann gegen OCP. 
    Und sollte ich den Validator selbst ändern und weitere Verantwortungen ergänzen, dann verstoße ich auch plötzlich 
    zusätzlich noch gegen das Single-responsibility principle (siehe unten).

    [Spryker](https://docs.spryker.com/docs/dg/dev/backend-development/plugins/plugins.html) hat für solche Themen an unterschiedlichsten Stellen z.B. 
    Plugin-Mechanismen mit vorgegebenen Interfaces eingefügt. Möchte ich neue Funktionalität ergänzen, registriere ich "außerhalb" 
    ein neues Plugin, statt den Processor selbst anzupassen. 

    ```php
    class CartDependencyProvider extends SprykerCartDependencyProvider
    {
        // ...
    
        protected function getCartPreCheckPlugins(Container $container): array
        {
            return [
                new ProductExistsCartPreCheckPlugin(),
                new CheckAvailabilityPlugin(),
                // ...
            ];
        }
    
        protected function getPostSavePlugins(Container $container): array
        {
            return [
                new ChangeProductOptionQuantityPlugin(),
                // ...
            ];
        }
    ```
   
    Was diese lose Koppelung z.B. auch noch möglich macht - eins der absoluten USPs von Sprkyer - ist ein von außen konfigurierbares [Order Management System mit einer State Machine](https://spryker.com/order-management-system/).

### Single-responsibility principle (SRP)

Auch wenn ich beim OCP das Thema [SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle) schon angesprochen 
habe, ist mir beim prozeduralen Stil innerhalb der process-Methode sofort eine Pipeline als Gegenbeispiel in den Sinn gekommen.
[thephpleague visualisiert eine einfache pipeline z.B. so ](https://github.com/thephpleague/pipeline):

```php
$result = $payload;

foreach ($stages as $stage) {
    $result = $stage($result);
}

return $result;
```

Jeder Schritt vom Beispiel 

```php
       $this->validator->validate($order);
       $total = $this->calculator->calculateTotal($order['items']);
       $this->repository->save($order, $total);
       $this->emailService->sendConfirmation($order);
```
könnte demnach eine Stage sein. Damit hätte ich dann keine process-Methode mehr, die für mehrere Dinge verantwortlich ist. 
Ich hatte mich beim NCA-Beispiel nämlich direkt an 

> The Employee class contains business rules and persistence control. These two responsibilities should almost never be mixed. Business rules tend to change frequently, and  though persistence may not change as frequently, it changes for completely different reasons. Binding business  rules to the persistence subsystem is asking for trouble.
>
> -- <cite>Martin, Robert C.. Agile Software Development, Principles, Patterns, and Practices: Pearson New International Edition (English Edition) (S.98). Pearson Education. Kindle-Version.</cite>

erinnert gefühlt. Dieses Thema hätte man mit Stages dann durchaus geregelt. 

## Conclusio

Mit solch einer Stage pipeline hätten wir wahrscheinlich das Maximum des SRP erreicht. 
Aber wie oben schon geschrieben: **Soll man sich diesen Aufwand von Anfang an wirklich machen?**
Ich sage "nein". Erst wenn wirklich antizipierbar ist, dass es für die Anforderung eine technische Schuld sein könnte.

Bleibt zu sagen: Ja, arbeitet clean. [Bleibt schuldenfrei](https://brainhub.eu/library/technical-debt-examples). 
[Wiederholt Euch nicht (DRY)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) und [hinterlasst den Campingplatz sauberer, 
als Ihr in vorgefunden habt (Boy Scout Rule)](https://www.informit.com/articles/article.aspx?p=1235624&seqNum=6).
[Overengineered](https://de.wikipedia.org/wiki/Overengineering) nicht zu früh.
Und um das nochmal von Uncle Bob selbst zu hören:

> The primary goal in managing such complexity is to organize it so that a developer knows where to look to find things and need only understand the directly affected complexity at any given time. 
> 
> -- <cite>C., Martin Robert. Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin Series) (English Edition) (S.308). Pearson Education. Kindle-Version."</cite>

FIN!