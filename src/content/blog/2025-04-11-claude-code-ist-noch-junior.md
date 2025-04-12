---
draft: false
featured: true
title: Claude Code, der sehr schnelle Junior im Team
pubDatetime: 2025-04-11T14:00:00+01:00
tags:
  - Development
  - Anthropic
  - KI
  - Unit Testing
  - PHP
  - Vibe Coding
  - claude
  - gen ai
  - chat gpt
description: Eine kurze Betrachtung zu den Stärken und Schwächen von Claude Code im Pairprogramming bei der Erstellung von Unit Tests
---

[Claude Code](https://docs.anthropic.com/de/docs/agents-and-tools/claude-code/overview) ist wie ein Praktikant, der nie schläft, nie jammert – und trotzdem immer wieder vergisst, wie unser Framework funktioniert.

Ich teste regelmäßig, wie sich die Top LLMs und Agenten mit meinen typischen Dev-Aufgaben schlagen. Und ja, sie werden besser. Spürbar besser.

Aber sie sind immer noch: der Junior im Pair Programming.

**[Vibe Coding](https://de.wikipedia.org/wiki/Vibe_Coding)** mag bei (einfachen) Aufgaben auf der grünen Wiese schon funktionieren. Doch komplexe Software-Projekte mit "unbekannten Problemen" leben von der Finesse ihrer menschlichen Begleiter – sowohl im Guten, als auch im Schlechten.

Ein aktuelles Beispiel: **Das Erzeugen von Unit Tests im Spryker-Kontext für extrem einfache Klassen.**

Zur Installation von Claude Code:
```shell
$ npm install -g @anthropic-ai/claude-code
```
Danach kann man Claude Code mit `claude` im Projektordner starten. Ich empfehle, ein dediziertes Memory-File wie `Claude.md` anzulegen, um die Kommunikation mit dem Tool zu verbessern.

Das Versprechen:
> Claude Code ist ein agentisches Coding-Tool, das in Ihrem Terminal lebt, Ihre Codebasis versteht und Ihnen hilft, durch natürlichsprachliche Befehle schneller zu programmieren. [...] Bearbeiten von Dateien, Ausführen und Beheben von Tests, Lösen von Merge-Konflikten u.v.m.

So weit, so gut.

Also, zum Beispiel:

```php
class ArticleListener extends AbstractPlugin implements EventBulkHandlerInterface
{
    public function handleBulk(array $eventEntityTransfers, $eventName)
    {
        $this->getFacade()
            ->writeCollectionByLogEvents($eventEntityTransfers, $eventName);
    }
}
```

Claude erzeugt einen Test, der auf den ersten Blick funktioniert, aber unter der Haube falsche Annahmen trifft. Beispiel:
```php
$this->articleListenerMock = $this->getMockBuilder(ArticleListener::class)
    ->setMethods(['getFacade'])
     ->getMock();
               
$this->articleListenerMock->method('getFacade')
    ->willReturn($this->facadeMock);
```

Ne, Claude. Ich will nicht gegen ein Mock meiner zu testenden Klasse testen. Die Parent-Klasse stellt via `setFacade` eine API bereit, um genau diesen Fall sauber zu lösen. Leider erkennt Claude die Logik ohne genauere Erklärung nicht – obwohl es Teil der Vererbungshierarchie in der nativen Sprachsyntax ist.

Also prompten wir nach:
> Please don't use the listeners as a mock. You can inject the facade mock with the setter "setFacade". Save this to memory!

Antwort:
```php
$reflection = new \ReflectionClass($this->articleListener);
$facadeProperty = $reflection->getParentClass()->getProperty('facade');
$facadeProperty->setAccessible(true);
$facadeProperty->setValue($this->articleListener, $this->facadeMock);
```

Immer noch nicht. Und passt eigentlich gar nicht zum Prompt. Nächster Versuch:
> No, use the setFacade-Setter to inject the facade mock into the listener.

Und dann:

```php
$this->facadeMock = $this->createMock(FacadeInterface::class);
$this->articleListener = new ArticleListener();
$this->articleListener->setFacade($this->facadeMock);
```

WOHOooo, das sieht gut und richtig aus! Testet man das:

```shell
[TypeError] AbstractPlugin::setFacade(): Argument #1 must be of type AbstractFacade, Mock_FacadeInterface_... given
```

Gut, auf zum nächsten Prompt. In dem Fall folge ich dem "Vibe Coding"-Dogma und gebe der KI einfach nur den Fehler, und siehe da, ein funktionierender Fix:

```php
$this->facadeMock = $this->getMockBuilder(Facade::class)
    ->disableOriginalConstructor()
    ->getMock();

$this->articleListener = new ArticleListener();
$this->articleListener->setFacade($this->facadeMock);
```

Aber erst mit dem finalen Prompt wird der richtige Quellcode erzeugt, den ein geübter Dev viel früher umgesetzt hätte:

```php
$this->facadeMock = $this->createMock(Facade::class);

$this->articleListener = new ArticleListener();
$this->articleListener->setFacade($this->facadeMock);
```

Und das ist dann korrekt. Menschliche Kontrolle bleibt aber Pflicht.

Was hier passiert, ist kein Einzelfall. Claude ist schnell, fleißig, oft hilfreich – aber er erkennt nicht den Sinn hinter dem Code. Er spielt bekannte Lösungsmuster zurück, die auf meinen Inhalt angewendet werden, ohne wirklich zu „verstehen“, was dies konkret im Kontext bedeutet. Es geht nicht um Logik, sondern um Textmuster.

Im Video ["New Research Reveals How AI 'Thinks' (It Doesn’t)"](https://www.youtube.com/watch?v=-wzOetb-D3w) von **Sabine Hossenfelder** wird eine neue Studie von **Anthropic** vorgestellt. Dort wird untersucht, wie Claude intern arbeitet. Das Ergebnis:

- Claude aktiviert beim Rechnen keine Rechenlogik, sondern statistische Muster. Die Antwort *"36 + 59 = 95"* entsteht durch Heuristiken, nicht durch echtes Addieren.
- Wird nach dem Rechenweg gefragt, liefert Claude eine plausible, aber konstruierte Erklärung – unabhängig vom internen Prozess.
- Auch Jailbreaks funktionieren, weil Claude Zeichenfolgen erkennt und kombiniert, nicht weil er semantische Bedeutung versteht.

Claude „denkt“ nicht – er **reagiert auf Wahrscheinlichkeiten**. So wie im Unit-Test-Beispiel, wo Claude kein Verständnis für das Zusammenspiel aus Vererbung, Trait und Methodennamen hat, sondern lediglich wiederholt, was statistisch aus den Trainingsdaten am Besten zum Kontext passt.

📌 Claude ist ein Tool. Kein Kollege. Noch nicht.  
⚠️ Er hilft, aber nur unter Aufsicht.  
✅ Und er zwingt uns, genauer zu erklären, was wir wollen – und was nicht.

Ich glaube daran, dass die **technologische Singularität** kommt. Vielleicht früher, als viele denken. Aber heute? Heute braucht Claude noch uns.

Also: Kontrolliert die Tools. Denkt mit. Bleibt menschlich.

