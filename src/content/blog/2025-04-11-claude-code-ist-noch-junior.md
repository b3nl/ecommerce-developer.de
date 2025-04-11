---
draft: true
title: Claude Code, der sehr schnelle Junior im Team
pubDatetime: 2025-04-11T14:00:00+01:00
tags:
  - Development
  - Anthropic
  - KI
  - Unit Testing
  - PHP
description: Eine kurze Betrachtung zu den Stärken und Schwächen von Claude Code im Pairprogramming bei der Erstellung von Unit Tests
---

Regelmäßig teste ich, wie sich die Top LLM/Gen AI Chatbots und Agenten mit meinen üblichen Dev-Aufgaben herumschlagen. 
Es wird jedes Mal besser.
Sie sind aber immer noch der Junior im Pair Programming, und Human-before-the-loop und Human-after-loop werden benötigt. [Vibe Coding](https://de.wikipedia.org/wiki/Vibe_Coding) mag zwar bereits bei Googlebarem Code auf der grünen Wiese funktionieren, große Projekte mit "unbekannten Problemen" leben von der Finesse ihrer menschlichen Begleiter.

Mal ein aktuelles Beispiel, und das ist ein Einfaches: Erzeugen von Unittests im Spryker-Kontext für extrem einfache Klassen: 

Um _Claude Code_ zu installieren, kann man das Tool mit dem folgenden NPM-Befehl global installieren:

```shell
npm install -g @anthropic-ai/claude-code
```

Nach der Installation kann man Claude Code mit `claude` innerhalb des jeweiligen Projektordners im Terminal starten. Mit der Option `--help` erhält man eine Übersicht aller verfügbaren Befehle. Ich empfehle das Erzeugen und Verfeinern vom Claude Memory z.B. in der Claude.md.

Und das Versprechen von Claude Code ist folgendes:

> Claude Code ist ein agentisches Coding-Tool, das in Ihrem Terminal lebt, Ihre Codebasis versteht und Ihnen hilft, durch natürlichsprachliche Befehle schneller zu programmieren. Durch die direkte Integration in Ihre Entwicklungsumgebung optimiert Claude Code Ihren Workflow, ohne zusätzliche Server oder komplexe Einrichtung zu erfordern.
>
> Die wichtigsten Fähigkeiten von Claude Code sind:
>
> - Bearbeiten von Dateien und Beheben von Bugs in Ihrer Codebasis
> - Beantworten von Fragen zur Architektur und Logik Ihres Codes
> - Ausführen und Beheben von Tests, Linting und anderen Befehlen
> - Durchsuchen der Git-Historie, Lösen von Merge-Konflikten und Erstellen von Commits und PRs
>
> <cite>https://docs.anthropic.com/de/docs/agents-and-tools/claude-code/overview</cite>

Also einfache Anweisung um diese simple Klasse mit einem Unit Test zu versehen:

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

Aber nein, daraus wird kein wirklich korrekter Unit-Test, auch wenn der erste Versuch funktioniert.

Unter anderem startet mir Claude den Unit-Test im Setup wie folgt:

```php
$this->articleListenerMock = $this->getMockBuilder(ArticleListener::class)
    ->setMethods(['getFacade'])
     ->getMock();
               
 $this->articleListenerMock->method('getFacade')
    ->willReturn($this->facadeMock);
```

Ne, ne Claude. Ich möchte nicht gegen einen Mock testen.

Aber Björn, werdet Ihr Euch fragen, was ist das Problem?

_AbstractPlugin_ benutzt das "_FacadeResolverAwareTrait_" von Spryker und das bietet mir eine Möglichkeit über eine dedizierte API die Fassade zu bestimmen. 

Claude versteht also entgegen des eigenen Versprechens so wenig vom Kontext, dass es nicht weiß, dass die Parent-Klasse die API bereitstellt, die es gerade über "Monkey Patching" per Mock bereitstellen möchte, obwohl es grundlegende Teile der Sprachsyntax sind.

Gut, also Prompt zum Beheben:

> Please don't use the listeners as a mock. You can inject the facade mock with the setter "setFacade". Save this to memory!

Und was macht Claude daraus? Funktionierenden Quatsch:

```php
$this->facadeMock = $this->createMock(FacadeInterface::class);
$this->articleListener = new ArticleListener();

$reflection = new \ReflectionClass($this->articleListener);
$facadeProperty = $reflection->getParentClass()->getProperty('facade');
$facadeProperty->setAccessible(true);
$facadeProperty->setValue($this->articleListener, $this->facadeMock);
```

OK, dann nächster Versuch:

> No, use the setFacade-Setter to inject the facade mock into the listener. 

```php
$this->facadeMock = $this->createMock(FacadeInterface::class);

$this->articleListener = new ArticleListener();
$this->articleListener->setFacade($this->facadeMock);
```

WOHO, das sieht gut und richtig aus!

```shell
[TypeError] Spryker\Zed\Kernel\Communication\AbstractPlugin::setFacade(): Argument #1 ($facade) must be of type Spryker\Zed\Kernel\Business\AbstractFacade, Mock_FacadeInterface_f000f07c given, called in /data/tests/PyzTest/Zed/Log/Communication/Plugin/Event/Listener/ArticleListenerTest.php on line 50
```

Gut, auf zum nächsten Fehler. In dem Fall folge ich dem "Vibe Coding"-Dogma und gebe der KI einfach nur den Fehler zum Selbstfixen, und siehe da, ein funktionierender Fix:

```php
$this->facadeMock = $this->getMockBuilder(Facade::class)
    ->disableOriginalConstructor()
    ->getMock();

$this->articleListener = new ArticleListener();
$this->articleListener->setFacade($this->facadeMock);
```

Und in der "Vier-Augen-Kontrolle" des menschlichen Devs müsste nun auffallen, dass der korrekte Aufruf eigentlich der Folgende wäre:

```php
$this->facadeMock = $this->createMock(Facade::class);

$this->articleListener = new ArticleListener();
$this->articleListener->setFacade($this->facadeMock);
```

Und damit laufen die Unit-Tests dann durch.

Für heute bin ich erstmal beruhigt. Eine der besten Coding KIs versteht immer noch nicht wirklich was sie tut, und geübte Menschen sind besser und schneller. Das Tempo aber mit dem KI aufholt und besonders schnell Boilerplate erzeugen kann ist rasant!

Claude Code ist definitiv ein nützliches Tool für viele Entwicklungsaufgaben, aber es zeigt sich, dass es bei spezifischen Framework-Kontexten und komplexeren Anwendungsfällen noch Schwächen hat. Die Kombination aus menschlicher Expertise und KI-Unterstützung bleibt vorerst der effektivste Weg, um qualitativ hochwertigen Code zu produzieren.

Als erfahrener Entwickler sollte man Claude Code als hilfreichen Junior im Team betrachten, der grundlegende Aufgaben übernehmen kann, aber dessen Arbeit man überprüfen sollte – besonders wenn es um komplexe Frameworks wie Spryker geht, die viele Konventionen und Besonderheiten aufweisen.

