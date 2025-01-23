---
title: 'Shopware-Sessions über Redis'
description: 'Hallo zusammen, da mich OXID eShop aktuell weniger reizt, bin ich sehr aktiv bei Shopware unterwegs. Bei Shopware fehlen mir leider einige Dinge in der Community Edition, die ich angefangen habe selbs...'
pubDatetime: 2015-04-14T08:40:28+02:00
tags:
  - shopware
  - redis
  - sessions
  - configuration
---

Hallo zusammen, da mich OXID eShop aktuell weniger reizt, bin ich sehr aktiv bei Shopware unterwegs. Bei Shopware fehlen mir leider einige Dinge in der Community Edition, die ich angefangen habe selbst nachzurüsten. Als erstes bin ich eine "fehlende" Session-Replikation über Redis angegangen. Da wir bei Shopware über einen Service-Container und entsprechende Strukturen verfügen, ist es leicht das Thema in Shopware umzusetzen. Shopware (5) selbst speichert Sessions über Zend\_DB in der Datenbank. In verteilten Umgebungen könnte mir das eigentlich schon genug sein, aber da ich Schreibzugriffe auf der Datenbank eigentlich verhinden möchte, ist das für mich keine Lösung. Also zack, n Redis für die Session angedockt und ran an die Arbeit.


Zu Beginn habe ich mich in den Core von Shopware geschraubt um den entsprechenden Session-Service auszumachen.

[gist id="c109922b700ea4e6a18f"]

Die Service-Deklaration für den Symfony Service-Container zeigt also für das Starten der Session auf **Shopware\Components\DependencyInjection\Bridge\Session**. Die entsprechende Factory-Methode ist relativ schlank und zeigt das Laden eines Datenbank-Tabellen-Treibers zum Speichern der Session.

[gist id="e7442ba636c7f4d260f6"]

Genau diese Logik überschreiben ich jetzt:
1. Service Deklaration
----------------------


Ich habe mir ein entsprechendes Klassenkonstrukt erstellt und zeige mit einer eigenen Service-Deklaration auf diese neue Klasse **[b3nl\SWRedis\DI\Bridge\Session](https://github.com/b3nl/SWRedis/blob/master/src/DI/Bridge/Session.php).**

[gist id="ea1212832e0863f521c5"]

Diese Deklaration wird als **services\_local.xml** neben die bestehende services.xml im Ordner engine/Shopware/Components/DependencyInjection/ gespeichert.
**2. Redis Session-Factory**
----------------------------


Meine eigene Session-Factory ist ein Kind der Shopware-Basis-Klasse. Sollte meine neue Factory feststellen, dass der Redis-Treiber genutzt werden soll, so registriert Sie einen eigenen [SaveHandler](https://github.com/b3nl/SWRedis/blob/master/src/Session/SaveHandler.php "Eigener Redis SaveHandler"). Dieser Save-Handler macht im Prinzip nichts anderes, als über eine einfache API einen [Predis-Client](https://github.com/nrk/predis "predis bei Github") anzusprechen. (Mehr dazu, z.B. auf [Sitepoint!](http://www.sitepoint.com/saving-php-sessions-in-redis/ "Redis Session Driver"))

[gist id="db4e87620bbf48abb0d8"]

Die Shopware Original-Logik ist hier so robust, dass kein anderer Session-Treiber mehr geladen wird, wenn die passende Config nicht gefunden wird. Wir müssen uns also im letzten Schritt nur noch um eine Config kümmern.
### 3. Redis Config


Wenn man die Session-Bridge von Shopware etwas debuggt, wird man feststellen, dass ein möglicher **"session" Key** aus der eigenen Shopware-**config.php** bis in die Session-Bridges "getragen" wird. Dies mache ich mir zu nutzen und überschreibe die Standard-Config für den **session['save\_handler']** mit einem eigenen "redis" Wert. Nur wenn dieser Wert gesetzt wird, wird meine eigene Redis-Factory genutzt! Da ich üblicherweise noch weitere Config-Optionen für eine Redis-Verbindung brauche, habe ich noch einen eigenen Config-Key "sessionredis" eingeführt. In diesem Config-Array können jetzt [alle Config-Optionen genutzt werden, die vom Predis-Client angeboten werden](https://github.com/nrk/predis/wiki/Client-Options "Config-Optionen für Predis\Client").

[gist id="4c1deecae1c650adfda4"]

So, damit kann mein Shopware Sessions über Redis persistieren.

Falls es euch gefallen hat, verpasst mir mit [b3nl/SWRedis](https://github.com/b3nl/SWRedis "Redis Driver on Github") euer Sternchen bei Github ;)

Danke Euch.

Beste Grüße
Björn
