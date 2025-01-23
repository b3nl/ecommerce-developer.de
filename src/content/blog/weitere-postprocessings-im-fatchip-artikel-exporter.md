---
title: 'Weitere PostProcessings im Fatchip Artikel Exporter'
description: 'Ich gehöre in der Regel zu den OXID-Entwicklern, die eigentlich keine verschlüsselten Module einsetzen. Meine Shops sind meistens so stark angepasst, dass ein blindes Integrieren nicht in Frage kommt....'
pubDatetime: 2014-01-19T18:49:28+01:00
tags:
  - oxid
  - exporter
  - customization
  - smarty
---

Ich gehöre in der Regel zu den OXID-Entwicklern, die eigentlich keine verschlüsselten Module einsetzen. Meine Shops sind meistens so stark angepasst, dass ein blindes Integrieren nicht in Frage kommt. Solange der Modulanbieter keinen Mist baut, interessiert mich nicht, wie der Quellcode qualitativ aussieht oder ob ich das Modul auch selbst hätte machen können. Ich möchte aber im Voraus wissen und/oder selbst kontrollieren können, welche Seiteneffekte es mit einem Modul geben könnte, wie das Modul angepasst werden kann und/oder gemergt werden muss. Und auch wenn ich Bugs vermute, möchte ich diese vorher sauber recherchieren, um Fehler bei mir auszuschließen und dass der Modulanbieter direkt ordentlich mit der Behebung starten kann.
Daher habe ich mich besonders gefreut, dass die [Fatchip GmbH alle Module seit kurzem quelloffen vertreibt](http://us7.campaign-archive1.com/?u=9d6431169ff32973cd2a350d0&id=dd009c644c&e=80248a1246 "Fatchip goes source").

Passend zu dieser Source-Meldung hatte ich nämlich auch eine Nachfrage zu diesem Modul, und zwar wie weiteres Feld-Post Processing hinzugefügt werden kann. Dieses Post Processing sorgt dafür, dass bei einem Artikel-Export Feldwerte nachträglich noch geändert werden können. In der [Dokumentation](http://wiki.fatchip.de/public/faqexporter#ist-es-moeglich-den-artikel-exporter-zu-erweitern) sind dafür leider keine Infos zu finden. Ich nutze aktuell die Version **1.12.7** des [Moduls](http://shop.fatchip.de/OXID-Modul-Artikel-Exporter.html) und hier gibt es nur zwei Callbacks zum Post-Processing, nämlich für eine [URL-Encodierung](http://php.net/urlencode) und eine nachträgliche Umwandlung in [UTF-8](http://php.net/utf8_encode), sollte der Feldwert noch nicht so codiert sein.

Ich benötige aber noch einen Callback, um Smarty-Tags z.B. in der Langbeschreibung zu evaluieren, denn ein Marketplace kann mit diesen internen Smarty-Tags eigentlich nichts anfangen. Ich hoffe euch mit diesem Posting Hilfestellung für eigene Post Processings geben zu können.
Also, ran an die Arbeit:
### 1. Auswahl im Backend


Damit das neue Post Processing im Backend überhaupt angezeigt wird, muss der entsprechende Backend-Controller angepasst werden. Da der Controller keinen Setter für diesen Wert bereitstellt, muss die Objekteigenschaft direkt angepasst werden:

[gist id="8506261" file="fccsvexport\_tab\_base.php"]
### 2. Übersetzung


Damit die Sprachvariable korrekt eingeblendet wird, sollte natürlich auch die Sprachdatei angepasst/überlagert werden:

[gist id="8506261" file="fcArticleExport\_lang.php"]
### 3. Logik


Das Ausführen der Callbacks pro Zeile übernimmt dann im Export-Modul die **fccsvexportjobs**-Klasse. Hier muss die Methode **\_fcValuePostProcessing(string, array)** entsprechend mit diesem neuen Callback versehen werden. Ich habe natürlich alles in ein sauberes Modul gekapselt und so sieht es bei mir aus:

[gist id="8506261" file="fccsvexportjobs.php"]

Sobald Ihr diese Anpassungen in euer Modul integriert habt, sollte der Exporter die Smarty-Tags mit eurem jeweiligem Theme parsen. Aktuell funktioniert dies noch nicht automatisch mit der Langbeschreibung eines Artikels (Support-Anfrage aber schon gestellt). Denkt bitte daran, dass diese Smarty-Evaluierung unabhängig von irgendwelchen speziellen Views funktionieren muss. Spezielle Detailseitenlogiken o.Ä. könnt Ihr hiermit nich aufrufen, sondern nur globale Smarty- oder OXID-Logiken. Das würde natürlich auch irgendwie funktionieren, zieht aber bestimmt einen großen Rattenschwanz hinter sich her.

Viel Spass damit, euer Björrn
