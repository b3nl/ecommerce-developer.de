---
title: 'WBL_Tracker nun auf Github, mit Piwik-Einbindung (U)'
description: '"Mal eben n Webtracker einbauen" ist eine oft gestellte Aufgabe für so kleine Agenturen wie meine. Im Endeffekt ist die Aufgabe immer irgendwie die Gleiche. Jeder Besuch, nach Möglichkeit auch alle Fe...'
pubDatetime: 2012-07-16T11:08:22+02:00
tags:
  - oxid
  - tracking
  - piwik
  - github
---

"Mal eben n Webtracker einbauen" ist eine oft gestellte Aufgabe für so kleine Agenturen wie meine. Im Endeffekt ist die Aufgabe immer irgendwie die Gleiche. Jeder Besuch, nach Möglichkeit auch alle Fehlerseiten und die verschickten Mails, sollen getrackt werden.  Aber natürlich sollen auf speziellen Seiten auch spezielle Trackings ausgespielt werden ... Und die Freifelder außerhalb der Dokumentation wollen wir ja auch nicht vergessen ...

Ich habe bereits Referenzimplementierungen mit riesigen (!) Switch-Case Bäumen für jeden möglichen Seitentyp gesehen und freue mich da, wenn ich Tracker, wie den [Piwik-Tracker von Marmalade finde](http://blog.marmalade.de/2011/12/neue-version-von-marmpiwik-piwik-pulgin-fur-oxid-eshop/), die das schon in einer if-Kontrolle dynamisiert haben. Mir persönlich reicht das aber immer noch nicht. Ich nutze bereits seit Jahren einen komplett anderen Ansatz, den ich euch nun nach einem umfassenden Update [auch unter der GPL 3 freigeben möchte](https://github.com/WBL-BjoernLange/WBL_Tracker "Tracker auf Github").   Zusätzlich zu meiner Tracking-Umgebung liefere ich euch auch direkt einen Piwik-Adapter mit bei, an dem Ihr sehen könnt, wie der Tracker euch Arbeit abnimmt, indem Ihr mit Ihm unzählige Tracker mit einer einzigen Umgebung abbilden könnt und bereits eingebaute WBL\_Tracker leicht erweitern könnt.

OXID-Module
-----------


Der Tracker hängt sich als [Modul an **oxOutput**](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Output.php "oxOutput-Modul") und wird im OXID - Kontext, abgesehen von der offline.html, bei jedem Output und jeder Mail angesprochen. Ich habe diesen Ansatz gewählt, da ein Smarty-Helper meiner Ansicht nach in dem Fall Redundanzen verursacht, bei häufigen Templatearbeiten oder auch Newslettern vergessen werden kann und auch bei AJAX-Requests meist nicht zur Geltung kommt, wobei asynchrone Tracker-Implementierungen bei AJAX-Requests ihmo meistens Probleme haben.

Als zusätzliches [Modul ist noch eine **Warenkorb-Erweiterung**](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Basket.php "oxBasket-Modul") vorhanden. Im Tracker Kontext wird oft auf eine Warenkorbaktion reagiert. Möchte OXID den Warenkorb updaten wird das vermerkt und ist über  **WBL\_Tracker\_Basket::isUpdatedForWBLTracker(bool)**  abrufbar. Außerdem merkt sich das [Modul des **oxBasketItem**](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Basket/Item.php "Modul von oxBasketItem") über welche Kategorien der Artikel in den Warenkorb gelegt wurde um dies auch dauerhaft mittracken zu können.
Struktur und Erweiterungen des WBL\_Trackers
--------------------------------------------


Er basiert auf dem Prinzip, dass jedem View ein Adapter zugeordnet werden kann. Zur Rückwärtskompatibilität, oder auch wenn man einfach nicht so viele Klassen bauen will, kann ein Standard-Tracker bestimmt werden (der aber wiederum über **WBL\_Tracker\_Adapter\_Interface::isForClass(string)** für einzelne Views verboten werden kann). Die Bestimmung erfolgt pro Anbieter über Ordnerstrukturen und einer **trackerdata.php**. Der WBL\_Tracker rödelt im ungecachten Fall alle angegebenen Kindordner **WBL\_Tracker\_Adapter\_Loader::getBasePaths()** durch und sucht diese trackerdata.php. Immer wenn er diese Datei findet, wird ein weiterer Tracker identifiziert. Der Elternordner dieser Datei gibt den Namen des Trackers an, wie man z.B. am Piwik Tracker sieht. Ihr könnt selbst weitere Tracker integrieren, indem Ihr solche Ordner nachbildet. Ihr könnt auch meine Tracker ergänzen indem Ihr euch einen eigenen Ordner anlegt, über das [Loader Singleton](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Adapter/Loader.php "WBL_Tracker_Adapter_Loader") einen weiteren Basisordner registriert und die Logiken im gleichen Anbieterordner anlegt. Die Tracker Configs werden gemergt und die OXID 4.6 Modulconfig-API eingehängt . Wenn ihr aber einen einzelnen Tracker-Adapter überschreiben wollt, solltet Ihr die Modullogik von OXID verwenden.

```php
WBL\_Tracker\_Adapter\_Loader::getInstance()->addBasePath(getShopBasePath() . '/modules/WBL/Tracker/');
// ./modules/WBL/Tracker/Piwik/trackerdata.php -> Piwik

WBL\_Tracker\_Adapter\_Loader::getInstance()->addBasePath(getShopBasePath() . '/modules/speziellererKunde/Tracker/');
/*
 * ./modules/speziellererKunde/Tracker/Piwik/trackerdata.php -> Piwik-Modul für speziellererkunde 
 * auf Basis von WBL\_Tracker\_Piwik
 */
```

Freifelder und Zieltracking - Conditions
----------------------------------------


Ein weiteres Feature sind die [WBL\_Tracker\_Conditions](https://github.com/WBL-BjoernLange/WBL_Tracker/tree/master/modules/WBL/Tracker/Conditions "WBL_Tracker_Conditions"). In Trackerumsetzungen gibt es oft den Wunsch, weitere Werte oder Ziele zu kontrollieren. Für dieses Todo gibt es den Bereich der Conditions, diese Conditions können über die Konfiguration angelegt werden um bestimmte Ziele und Werte loggen zu können, also z.B. auf der Kontaktseite soll ein Ziel vermerkt werden wenn eine Kontaktaufnahme getätigt wurde:

```php
// Goal-ID => Callback der zu true validiert|View-Name|Parametername
1 => trim|contact|c\_subject
```

oder für alle Seiten soll getrackt werden, ob es sich um einen eingeloggten User handelt

```php
// Freifeld-ID => Name des Feldes, Callback der den Wert bestimmt
3 => userstatus|WBL\_Tracker\_Conditions\_Value\_UserStatus
```

oder wenn auf der Kategoriesseite eine spezielle Kategorie aufgerufen wurde.

```php
// Goal-ID => Kontrollwert des Parameters (ID der Kategorie)|Viewname|Parametername
2 => 0f4fb00809cec9aa0910aa9c8fe36751|alist|cnid
```

oder wenn sie den Suchbegriff mittracken wollen

```php
// Freifeld-ID => Freifeldname|Callbacks um Wert anzugeben|Nicht nötiger Kontrollwert|Viewname
1 => searchhits|WBL\_Tracker\_Conditions\_Value\_Search\_Hits||search
2 => searchquery|WBL\_Tracker\_Conditions\_Value\_Search\_Query||search
```

wie Ihr sehen könnt, sind in diesen Kontrollen spezielle Callback-Logiken. PHP-Funktionen oder einfach "empty"-Checks möglich.

Diese ganze Arbeit müsst Ihr mit dem WBL\_Tracker nun nicht mehr pro Tracker vornehmen. Und das Beste, Unittests liegen mit 100% Abdeckung vor. Auf OXID 4.6.2 scheint mein [Autoloader](http://ecommerce-developer.de/jetzt-auf-github-fortsetzung-fur-den-wbl-autoloader/ "Jetzt auf Github, Fortsetzung für den WBL Autoloader") kleinere Zicken zu machen, Nutzung ist aber kein Problem. **(Update: Mittlerweile habe ich das Problem auf meiner Testumgebung nachgestellt, leider ist es ein Seiteneffekt eines OXID-Fixes** <https://bugs.oxid-esales.com/view.php?id=4262>)
Piwik Tracker
-------------


Der Piwik Tracker wurde von mir in großen Teilen als [Standard-Adapter](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Piwik/Adapter.php "WBL_Tracker_Piwik_Adapter") umgesetzt. Dies führt dazu, dass er auf jeder Seite ausgespielt wird. Ich habe die asynchrone Notation verwendet, die aber leider die AJAX-Requests noch nicht korrekt mittrackt (wird natürlich noch geändert). Im Prinzip reicht das sogar schon! Kampagnen werden von [Piwik automatisch getrackt](http://de.piwik.org/dokumentation/ziel-tracking/ "Ziel Tracking") und die Goals als auch die speziellen Variablen werden über die Conditions abgefrühstückt. Das Einzige was noch ergänzt werden müsste, ist das [eCommerce Tracking](http://piwik.org/docs/ecommerce-analytics/ "Ecommerce Analytics") von Piwik, die über die speziellen Adapter [AList](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Piwik/Adapter/Alist.php), [Basket](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Piwik/Adapter/Basket.php), [Details](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Piwik/Adapter/Details.php) und [Thankyou](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Piwik/Adapter/Thankyou.php) erfüllt wurde. Das noscript Bild wird nur standardmäßig ausgespielt.
[Das schöne am Piwik Tracker ist, dass ihr sehr datenschutzkonform arbeiten könnt. Das Backend erlaubt euch, die IP -Adresse zu verschleiern, ihr könnt es auf eigenen Maschinen in Europa hosten, der "Do not Track"-Header kann beachtet werden und Piwik bringt auch die Möglichkeit, dass der User das Tracking per Cookie deaktivieren kann.](http://piwik.org/privacy/ "Web Analytics Privacy in Piwik")
Auf Github folgt noch ein Wiki auf englisch, eine Roadmap etc.

Ich hoffe euch gefällts, wenn nicht, sagts mir bitte.
