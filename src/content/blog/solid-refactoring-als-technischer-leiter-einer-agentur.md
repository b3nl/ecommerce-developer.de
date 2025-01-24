---
title: "SOLID - Wie sehe ich Refactoring als technischer Leiter einer Agentur"
description: "Eine persönliche Betrachtung zu den SOLID-Prinzipien und Refactoring, mit Fokus auf pragmatische Entscheidungen und Best Practices."
tags:
  - SOLID
  - Refactoring
  - Clean Code
  - Softwareentwicklung
  - PHP
  - Agentur
  - Spryker
pubDatetime: 2025-01-24T22:01:23+01:00
featured: true
draft: true
---


# SOLID - Wie sehe ich Refactoring als technischer Leiter einer Agentur

## Einleitung

Nachdem ich gestern über [SOLID aus dem PHP Arch](https://ecommerce-developer.de/december-2024-issue-of-php_architect/) 
geschrieben habe, habe ich ein [Posting über SOLID und Refactoring bei NCA](https://nevercodealone.de/de/php-refactoring-best-practice/solid-prinzipien-in-php-clean-code-refactoring) gefunden. 
Und hab mir gedacht, mh, interessant. Eine Chance über mein Verhältnis zu Refactoring zu sprechen. 
Die Diskussion wann und wie viel refaktoriert wird begleitet mich persönlich seit Anfang meines Berufslebens und die gesamte
Branche im Prinzip seitdem die Branche selbst existiert. 

Ich bin Agentur-Kind durch und durch. Mindestens die Hälfte meiner Zeit verbringe ich mit der Umsetzung von externen 
zielgerichteten Anforderungen und im Gegensatz zu Produkt-Entwicklung zählt dort nicht jeder mögliche spätere Use-Case 
meines Produkts, sondern die Anforderung.  

Ich halte es da dann eher mit [Kent Beck](https://de.wikipedia.org/wiki/Kent_Beck)s, der Erfinder extreme programming, "_Make It Work, Make It Right, Make It Fast._"
Oder wie wir in der IT sagen, frei nach Voltaire/Montesquieu, "_perfect is the enemy of done_". Und die Frage welche programmierung 
perfekt ist, ist schwerer zu beantworten als ob die [Hand Gottes ein reguläres Tor](https://de.wikipedia.org/wiki/Hand_Gottes_(Fußball)) war. 
Die Frage ob man mit Refactoring fertig ist gehört genauso dazu. 
Unzählige Projekte sind gescheitert, weil man nicht das Ende gefunden hat. Bevor man fertig ist, sind schon neue Sprachfeatures 
und Updates erschienen und dann muss man eigentlich halt wieder dran ...  
**NEIN! Falsch. Raus mit dem Projekt. Fertig werden!** 

Selbst Uncle Bob sagt zu diesem Thema:

> Even concepts as fundamental as elimination of duplication, code expressiveness, and the SRP can be taken too far.
>
> -- <cite>C., Martin Robert. Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin Series) (English Edition) (S.373). Pearson Education. Kindle-Version.</cite>

Damit kommen wir wieder zum Anfang zurück: Ziel ist die cleane udn zügige Umsetzung der Anforderung und nicht Perfektion. 

Und was "clean" ist, wird oft mit den [SOLID-Prinzipien](https://en.wikipedia.org/wiki/SOLID) beantwortet.

## Beispiele

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

Ich möchte Rolands Idee hier weiter führen. Ganz besonders bei einem "Order"-Beispiel würde ich hier noch nicht von 
komplettem SOLID sprechen. Roland selbst sagt, dass damit nur Single Responsibility, Open/Closed und Dependency Inversion 
umgesetzt wurde. 

Auch ich würde in der Realität bestimmt bei diesem Arbeitsergebnis - bis auf die Interfaces - aufhören oder es in einem 
Pull/Merge Request durchgehen lassen.

Würde ich aber noch mehr Zeit haben, würde ich folgende Gedanken auch noch einfließen lassen.

### Dependency Inversion Principle

Gemäß Dependency Inversion Principle würde ich also den OrderProcessor gegen Interface entwickeln.

### Zum Open/Closed Principle:

NCA schreibt "_Neue Funktionen können hinzugefügt werden, ohne den bestehenden Code zu ändern._". Hinter OCP steckt aber 
ein bisschen mehr, wie z.B. auch die theoretische Betrachtung was sonst noch passieren könnte.
Und hier überspitze ich das Beispiel einmal mal, wobei die folgenden Use-Cases für eine Order durchaus realistisch ist: 

1. Möchte ich auch das Total validieren, muss ich die Interna vom Processor für die Reihenfolge ändern. Das entspräche z.B. dem Shape Beispiel aus "PPP":

    > if we decided that all Circles should be drawn before any Squares. The DrawAllShapes  function is not closed against a change like this. To implement that change, we’ll have to go into DrawAllShapes  and scan the list first for Circles and then again for Squares.
    > 
    > -- <cite>Martin, Robert C.. Agile Software Development, Principles, Patterns, and Practices: Pearson New International Edition (English Edition) (S.104). Pearson Education. Kindle-Version.</cite> 
   
2. Oder ein weiterer möglicher Use-Case:

    Bei Orders wird in der Regel nicht nur validiert, ob die Items leer sind, sondern auch ob die Adressdaten korrekt sind. 
    Wo kommt diese Änderung nun hin? Für diesen Change muss ich vielleicht den Processor oder auch den Validator selbst 
    ändern. Und wenn ich den Validator ändern, dann verstoße ich auch plötzlich zusätzlich noch gegen das SRP.

    [Spryker](https://docs.spryker.com/docs/dg/dev/backend-development/plugins/plugins.html) hat für solche Themen an unterschiedlichsten Stellen z.B. 
    Plugin-Mechanismen mit vorgegebenen Interfaces. Möchte ich neue Funktionalität ergänzen, registriere ich "außerhalb" 
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

### Single-responsibility principle (SRP)

Auch wenn ich beim OCP das Thema SRP schon angesprochen habe, ist mir beim prozeduralen Stil innerhalb der process-Methode 
sofort eine Pipeline als Gegenbeispiel in den Sinn gekommen.
Um z.B. ein einfaches [pipeline-Beispiel von thephpleague](https://github.com/thephpleague/pipeline) zu zitieren:

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
könnte eine z.B. Stage sein und dann hätte ich keine process-Methode die für mehrere Dinge verantwortlich ist. Ich hatte 
mich beim NCA-Beispiel direkt an 

> The Employee class contains business rules and persistence  control. These two responsibilities should almost never be mixed. Business rules tend to change frequently, and  though persistence may not change as frequently, it changes for completely different reasons. Binding business  rules to the persistence subsystem is asking for trouble.
>
> -- <cite>Martin, Robert C.. Agile Software Development, Principles, Patterns, and Practices: Pearson New International Edition (English Edition) (S.98). Pearson Education. Kindle-Version.</cite>

erinnert gefühlt. Dieses Thema hätte man mit Stages dann durchaus geregelt. 

## Conclusio

Mit solch einer Stage pipeline hätten wir wahrscheinlich das maximal des SRP erreicht. Aber wie oben schon geschrieben. 
**Soll man sich diese Aufwand von Anfang an machen?**
Ich sage nein. Erst wenn wirklich antizipierbar ist, dass es für die Anforderung eine technische Schuld sein könnte.

Bleibt zu sagen: Ja, arbeitet clean. Bleibt schuldenfrei. Wiederholt Euch nicht (DRY) und hinterlasst den Campingplatz sauberer, 
als Ihr in vorgefunden habt (Boy Scout Rule).
Overengineered nicht zu früh.
Um das nochmal von Uncle Bob selbst zu hören:

> The primary goal in managing such complexity is to organize it so that a developer knows where to look to find things and need only understand the directly affected complexity at any given time. 
> 
> -- <cite>C., Martin Robert. Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin Series) (English Edition) (S.308). Pearson Education. Kindle-Version."</cite>