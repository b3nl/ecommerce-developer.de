---
title: 'Neues Major-Release von OXID erschienen (4.7, 5.0)'
description: 'Breaking News. Nach dem OXID-Partnertag 2012 letzte Woche, bei dem wir als Aussteller vertreten waren, hat OXID das dort versprochene Release Datum für die neue große OXID-Version gehalten.

Ihr werde...'
pubDatetime: 2012-11-05T18:07:32+01:00
tags:
  - oxid
  - release
  - updates
  - ecommerce
---

Breaking News. Nach dem OXID-Partnertag 2012 letzte Woche, bei dem wir als Aussteller vertreten waren, hat OXID das dort versprochene Release Datum für die neue große OXID-Version gehalten.

Ihr werdet wahrscheinlich noch keine offiziellen Infos zum Release erhalten haben, aber die Demo-Webs sind bereits aktualisiert. Im Backend der [Community-Edition](http://demoshop.oxid-esales.com/community-edition/  "Community Edition Demo") seht Ihr die neue Revision 4.7.0\_51243 im Header und auch im SVN kann die neue Version heruntergeladen werden, z.B. die CE mit [http://svn.oxid-esales.com/tags/CE-4.7.0-51243](http://svn.oxid-esales.com/tags/CE-4.7.0-51243 "http://svn.oxid-esales.com/tags/CE-4.7.0-51243").

OXID hat strukturell einiges  aufgeräumt  (sich etwas an [Magento](http://www.magentocommerce.com/de/ "Magento") angenähert), geupdatet und  ergänzt darunter z.B. die neue [Cookie-Richtlinien der EU](http://www.golem.de/news/datenschutz-neue-eu-regeln-zu-cookies-treten-in-kraft-1205-92094.html "Neue EU-Regeln zu Cookies treten in Kraft") oder auch die sagenumwobene "[Button-Lösung](http://www.golem.de/news/onlineshops-button-loesung-muss-bis-31-juli-2012-umgesetzt-werden-1207-93261.html "Button Lösung")" ;)  weiter verbessert ... Der Core ist immer noch nahezu identisch mit der Enterprise Edition, aber hier hat OXID einen deutlicheren Versionssprung nach oben gemacht und titelt daher mit einer neuen Hauptversionsnummer.

Die [Enterprise Edition von OXID](http://www.oxid-esales.com/de/produkte/facts/oxid-eshop-enterprise-edition/produktinformationen.html "OXID Enterprise Edition") liegt jetzt in Version 5.0 vor, da man hier nun eine [Hochlast-Option mit einer Datenbanklast-Verteilung der Datenbank](http://ecommerce-developer.de/datenbank-masterslave-vorbereitung-in-oxid-4-6-0/ "Datenbank-Master/Slave Vorbereitung in OXID 4.6.0") out of the Box anbietet und außerdem den [Reverse Proxy](http://en.wikipedia.org/wiki/Reverse_proxy "Reverse Proxy bei Wikipedia") [Varnish](https://www.varnish-cache.org/ "Varnish") "[Edge Side Include](http://de.wikipedia.org/wiki/Edge_Side_Includes "ESI bei Wikipedia")"-basiert (ESI) bereits von Haus aus anbindet. OXID liefert dazu auch eine Standard-Konfiguration für euren Varnish-Server mit.

Ein komplett eingestellte Enterprise Edition sollte jetzt alles deutlich wegrocken, was Ihr bisher standardmäßig von OXID gesehen habt!

(Und davon ab, es freut mich besonders, die [Unittests](http://wiki.oxidforge.org/Certification/Modules "Modul Certification") wurden auch geupdatet und bieten nun eine leichtere Ergänzung von z.B. [Autoloadern](http://ecommerce-developer.de/wbl-autoloader-und-oxid-4-6-0/ "WBL Autoloader und OXID 4.6.0") in den Testumgebungen).

Viel Spaß damit!
