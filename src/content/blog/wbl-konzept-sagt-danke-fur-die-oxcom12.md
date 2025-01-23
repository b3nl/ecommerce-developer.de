---
title: 'WBL Konzept sagt "Danke!" für die #oxcom12'
description: 'So die OXID Commons 2012 ist am Freitag mit der Unconference zu Ende gegangen und wir möchten Danke für die gute Veranstaltung und die tolle Party danach sagen. Wir haben für euch natürlich ein paar p...'
pubDatetime: 2012-05-30T15:26:57+02:00
tags:
  - oxid
  - commons
  - performance
  - modules
---

So die [OXID Commons 2012](http://www.oxid-esales.com/de/news/oxid-commons/oxid-commons-2012.html "OXId Commons 2012") ist am Freitag mit der [Unconference](http://www.oxid-esales.com/de/news/oxid-commons/tag-2-unconference.html "OXID Unconference") zu Ende gegangen und wir möchten Danke für die gute Veranstaltung und die tolle Party danach sagen. Wir haben für euch natürlich ein [paar privatere Impressionen auf  Foto gebannt](https://www.facebook.com/media/set/?set=a.429058327119453.100612.325498400808780&type=1 "Galerie auf Facebook") und möchten mit diesem Posting auch ein paar, für uns wichtige Infos der [Sessions](http://www.oxid-esales.com/de/news/oxid-commons/streaming.html "OXID Commons 2012 Streaming") festhalten.


## SysEleven spielte das Lied vom Bottleneck

Marc Korthaus, Geschäftsführer der [SysEleven](http://syseleven.de "SysEleven"), ging zuerst auf einen vorherigen Beitrag der [Continum AG](http://www.continum.net/ "Continum AG") ein, dass [Full Page Caching](http://www.youtube.com/watch?feature=player_embedded&v=T1bMRbtaOec#t=57s) natürlich sinnvoll ist und auf jeden Fall gemacht werden sollte! [Trotz Caching wird es aber immer Seitenaufrufe geben, die größere Last verursachen, also z.B. die Checkout-Requests die bei gr0ßem Aufkommen Datenbankserver auslasten können. Man könne dieses Problem aber abschwächen, wenn man dafür sorgt, dass man zusätzlich die Datenbank entsprechend mitskaliert.](http://www.youtube.com/watch?feature=player_detailpage&v=T1bMRbtaOec#t=2053s) Datenbankabfragen aber [zwischen Servern zu verteilen](http://ecommerce-developer.de/datenbank-masterslave-vorbereitung-in-oxid-4-6-0/ "Datenbank-Master/Slave Vorbereitung in OXID 4.6.0") hilft gemäß Marc Korthaus [aber eben primär nicht bei der Perfomance, es ist einfach eine Hilfe um vertikal zu skalieren](http://www.youtube.com/watch?feature=player_detailpage&v=T1bMRbtaOec#t=2000s) und somit die mögliche Gesamtlast des Systems  zu steigern. Ich stimme aus eigener Erfahrung auch diesen Punkten zu, der einzelne Shopuser wird in einer normalen Situation nicht viel davon mitbekommen, ob das Script von einem oder mehr Servern zur Verfügung gestellt wird, in Hochlastsituation kann er dann aber hoffentlich, wie gewohnt weiter einkaufen.

## Hendrik Bahr  besprach drei Säulen der Performance

Hendrik Bahr, Geschäftsführer der [Fatchip GmbH](http://www.fatchip.de/ "FATCHIP"), [nannte drei Säulen guter Performance](http://www.youtube.com/watch?feature=player_embedded&v=T1bMRbtaOec#t=901s): Das ist zum Ersten natürlich die Hardware und zum Zweiten die Software. Aber selbst wenn man bei diesen zwei Säulen bereits gut aufgestellt sei, gibt es einen Faktor der vieles beeinflusst und mit dem vielleicht relativ kosteneffizient die Performance gesteigert werden kann, [die Datenhaltung](http://www.youtube.com/watch?feature=player_embedded&v=T1bMRbtaOec#t=1262s). In diesem Zusammenhang gibt es eine eigentlich einfache Fragestellung, welche meiner gespeicherten Daten brauche ich wirklich? Was man nicht braucht, sollte nach Möglichkeit aus dem Shop raus. Auch dem kann ich uneingeschränkt zustimmen, braucht man z.B. wirklich abermillionen Gutscheine, auch von abgelaufenen Aktionen?

## Performance-Recherche des Senior-Developers Mazvydas Skuodas

Die Performance des Shops hängt primär von den Detailfülle der Aktionen eines Shop-Views ab. [Mazvydas Skuodas hat dafür mehrere Benchmarkergebnisse gezeigt](http://www.youtube.com/watch?feature=player_detailpage&v=T1bMRbtaOec#t=2427s) und z.B. auch offen gelegt, [dass Smarty wie von einigen Entwicklern angeführt, anscheinend keinen nennenswerten Einbruch in der Performance bringt.](http://www.youtube.com/watch?feature=player_detailpage&v=T1bMRbtaOec#t=2884s) Aber die klare Ansage war, [Performance holt man raus, indem man sich klar macht, welche Features man braucht und sich wirklich auf diese beschränkt und konzentriert](http://www.youtube.com/watch?feature=player_detailpage&v=T1bMRbtaOec#t=3087s).

## Erik Kort zur Verbesserung des Cores in 4.6.0

Ein Beispiel wie sich der Core verbessert hat ist die Anzahl der Datenbankabfragen. Seit OXID 4.4.8 bis OXID 4.6.0 hat sich die Anzahl der Abfragen der gezeigten Beispiele um rund ein Drittel reduziert, indem man Abfrageergebnisse vermehrt per Cache-Datei im tmp-Ordner ablegt. Dies sei im Gegensatz zu den Includes-Pfaden von oxAutoload kein Problem, da die Dateien nicht so oft geschrieben werden würden. Die 4.5.8 sei auch schneller geworden, da man aus den 4.6.0 Betas einige Dinge zurück portieren konnte. Während der Session fand ein reger Austausch über diese Zahlen statt, so dass einige Partner wie z.B. [SysEleven und Fatchip die Idee hatten, auch einmal die OXID EE 2.7.0.3 und PE 3 mit der 4.6.0 auf der von Erik Kort genutzten Plattform zu vergleichen](http://www.youtube.com/watch?feature=player_embedded&v=iKsncD7O3Gk#t=650s), es bleibt bei diesen Themen also spannend.

## Module seit OXID 4.6.0 und Ausblick

[Rimvydas Paskevicius und Alfonsas Cirtautas haben ausgiebig über das neue Modulsystem gesprochen.](http://www.youtube.com/watch?feature=player_detailpage&v=iKsncD7O3Gk#t=3394s) Abgesehen von den Dingen die hier auch bereits von mir verlinkt wurden, wie z.B. die [vendor- und metadata.php](http://ecommerce-developer.de/wbl-autoloader-und-oxid-4-6-0/ "WBL Autoloader und OXID 4.6.0") hat man besprochen was noch ansteht. Besonderes Highlight sind hier für mich  z.B. die Installation- und Deinstallationsroutinen für Module, um z.B. Datenbankänderungen mit einem Modulsetup vorzunehmen. Erik Kort sprach hier aber leider erst von Version 5.

## Worauf man beim Unittesting achten sollte

[Rania Tarazi](http://www.youtube.com/watch?feature=player_detailpage&v=iKsncD7O3Gk#t=1967s), Project Manager von OXID eSales AG, hat gezeigt, welche [Softwaremetriken](http://wiki.oxidforge.org/Certification/Modules#Getting_code_metrics "Code Metrics for module certification") kontrolliert werden, wenn ein Modul die Zertifierung von OXID erhalten solle. Zusätzlich hat man betont, selbst wenn es imho nicht im OXID-Wiki dokumentiert ist, [dass eine Methode im Optimalfall 80 Zeilen nicht überschreiten sollte](http://www.youtube.com/watch?feature=player_detailpage&v=iKsncD7O3Gk#t=3128s). Etwas mehr ist auch noch OK, aber an dieser Zahl sollte man sich orientieren.
Worauf man gemäß OXID natürlich auch noch achten sollte, ist die Kompatiblität zwischen Modulen indem man z.B. die [oxException verwendet](http://www.youtube.com/watch?feature=player_detailpage&v=iKsncD7O3Gk#t=2800s), [ein Präfix vor Datenbankfelder stellt und nach Möglichkeit immer den parent-Aufruf ausführt.](http://www.youtube.com/watch?feature=player_detailpage&v=iKsncD7O3Gk#t=2500s)

Interessant war auch, [was man nicht testen würde und zwar ist das die eigentliche Funktion einer Methode, Bugs würden nicht kontrolliert und Frontends würden ignoriert](http://www.youtube.com/watch?feature=player_detailpage&v=iKsncD7O3Gk#t=2612s).

Mit OXID 4.6.0 hat OXID meiner Meinung nach ein tolles Produkt erhalten. Man darf dabei bloß nicht vergessen, OXID - aber auch Magento, Typo 3 und andere Systeme - sind Lösungen, die möglichst viele Wünsche befriedigen sollen, und dies auf möglichst bestem Wege. Da man per se nicht jeden möglichen Wunsch  erfüllen kann, gehen Individualwünsche manchmal unter. Aber die Community, die sich auf der OXID Commons 2012 gezeigt hat, komplettiert dieses Produkt mit Ihrer Vielfältigkeit ganz wunderbar.

Bis zum nächsten Jahr.

Danke!
