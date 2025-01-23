---
title: 'Datenbank-Master/Slave Vorbereitung in OXID 4.6.0'
description: 'Lastverteilung ist bei großen Internetseiten ein sensitives Thema. Bei gut besuchten Shops natürlich sowieso, denn jeder von uns möchte in Geschäften an der Kasse nicht lange anstehen und sofort bedie...'
pubDatetime: 2012-05-10T08:38:28+02:00
tags:
    - oxid
    - shopware
    - replication
    - scaling
---

Lastverteilung ist bei großen Internetseiten ein sensitives Thema. Bei gut besuchten Shops natürlich sowieso, denn jeder von uns möchte in Geschäften an der Kasse nicht lange anstehen und sofort bedient werden. Aktuell ist für viele Shops eine Hochlastzeit, denn Muttertag steht vor der Tür und Muttertagsgrüße  möchten verschickt und Geschenke verteilt werden.

Bei typischen Webanwendungen gibt es mehrere Möglichkeiten und Schichten der Lastverteilung. Eine Schicht ist auf der Datenbankseite einer Webanwendung zu finden. Und mit OXID 4.6.0 hat sich hier anscheinend einiges getan.

Lastverteilung der Datenbankanfragen im OXID Core
-------------------------------------------------


OXID unterstützt im Shop-Core bisher noch keine Lastverteilung für Datenbankanfragen. Hier hat man vollkommen legitim die Entscheidung getroffen, dass der Shop gar nicht im Detail wissen kann, wie die Serverlandschaft des Betreibers aussieht. Man überlässt die Lastverteilung ähnlich zu anderen Web-Anwendungen dann konsequenterweise auch direkt dem Betreiber des Shops, aber dazu unten mehr.
Auf dem wunderbaren [eCommerce-Breakfast in Düsseldorf am Montag](https://www.xing.com/events/ecommerce-breakfast-dusseldorf-857556) habe ich dann aber mit einem TOP OXID-Hoster über dieses Thema gesprochen, und erfahren, diese Einstellung hätte sich mit der OXID 4.6.0 geändert. Wir wollen jetzt einmal schauen, wie weit OXID da jetzt ist.

[caption id="attachment\_241" align="alignleft" width="261" caption="MySQLi Treiber im OXID-Core"][![mysqli im OXID-Core](http://ecommerce-developer.de/wp-content/uploads/2012/05/mysqli.png "mysqli")](http://ecommerce-developer.de/wp-content/uploads/2012/05/mysqli.png)[/caption]

Also was auf jeden Fall feststeht, [OXID 4.6.0](http://www.oxid-esales.com/de/news/presse/pressemitteilungen/einzelansicht/article/release-oxid-eshop-460-semantisch-schnell-und-downloadbar.html) bringt nun einen Datenbanktreiber für  [MySQLi](http://php.net/mysqli "MySQL Improved Extension"), dem "verbesserten" MySQL-Treiber von PHP, mit.

Und jetzt zu zwei Nachrichten, und ganz klassisch kommt die schlechte zu erst:

Leider ist für mich im Core noch keine direkte Lastverteilung für Datenbank-Abfragen zu erkennen. Wie bisher muss man sich auf andere Techniken verlassen, die außerhalb des OXID-Systems liegen. Welche Techniken das sind, habe ich weiter unten etwas näher erklärt.

ABER, es ist ein großes Update am Datenbank-Adapter ["oxDB"](http://svn.oxid-esales.com/tags/CE-4.6.0-44406/eshop/core/oxdb.php "oxDB im OXID SVN") erkennbar und bisher "schwer" erreichbare Strukturen sind zugänglicher gemacht worden. Hier fallen mir besonders zwei Dinge auf:

1. Die Datenbank-Module, wie z.B. das [Datenbank-Admin-Log](http://svn.oxid-esales.com/trunk/eshop/core/adodblite/generic_modules/oxadminlog_module.inc), werden jetzt nicht mehr hart gekoppelt im "Fließtext" einer Methode delegiert, sondern über eine gekapselte Methode **oxDb::\_\_getModules()** angewiesen. Jetzt wird es deutlich einfacher - ohne größere Codeblöcke zu kopieren - eigene Datenbank-Erweiterung zu implementieren.

**2. Das Laden der Datenbankverbindung selbst, wurde jetzt auch tiefer in eine Methode gekapselt.**

```php
    // ./core/oxdb.php

    $oDb = oxNew( 'oxLegacyDb' );
    $oDb->setConnection( $oInst->\_getDbInstance() );

// ...

    protected function \_getDbInstance( $iInstType = false )
    {
        $oConfig = $this->getConfig();

        $sHost = $oConfig->getConfigParam( "dbHost" );
        $sUser = $oConfig->getConfigParam( "dbUser" );
        $sPwd  = $oConfig->getConfigParam( "dbPwd" );
        $sName = $oConfig->getConfigParam( "dbName" );
        $sType = $oConfig->getConfigParam( "dbType" );

        $oDb = ADONewConnection( $sType, $this->\_getModules() );

            if ( !$oDb->connect( $sHost, $sUser, $sPwd, $sName ) ) {
                $this->\_onConnectionError( $oDb );
            }

        $this->\_setUp( $oDb );

        return $oDb;
    }
```

Und der Parameter der Methode lässt hoffen, dass wir bald ein OXID-Release erhalten werden, in dem der OXID-Core seine Queries selbst auf verschiedene Server verteilen kann ohne auf weitere Software setzen zu müssen. Und für Jemanden, der bis dahin nicht warten möchte: Findige Partner, wie wir bei der [WBL Konzept](http://wbl-konzept.de "WBL Konzept Beerden und Lange GbR"), könnten aber auch jetzt schon bei diesem Thema weiterhelfen ;)
Master/Slave Replikation
------------------------


Aber nun einmal zur genauen Technik, wie es nun meistens gemacht wird und was dann möglich wäre. Hier möchte ich nur auf MySQL eingehen, da dies das Standard-System von OXID darstellt. Die am häufigsten zu findende Verteilungsart im MySQL-Umfeld wird eine Master/Slave - Replikation sein.

Bei einer Webanwendung kann davon ausgegangen werden, dass es viel mehr lesende als schreibende Datenbankabfragen gibt. Die "wenigen" schreibenden Zugriffe verursachen also im Prinzip nicht die Last, sondern die abertausenden lesenden Zugriffe, die sich zur Abarbeitung in die Warteschlange einreihen, und diese vielleicht "verstopfen". Daher versucht man, die lesenden Zugriffe auf sogenannte Slaves zu verteilen, die nichts anderes tun, als lesende Zugriffe abzuarbeiten.

Ein Master-Server wird dann aber weiterhin genutzt um Daten in die Datenbank zu schreiben. Damit seine Sklaven wissen, welche Daten auszuliefern sind, schreibt der Master seine "Daten" in eine Logdatei, über die sich die Slaves dann in definierten Intervallen aktualisieren, die sogenannte Replikation. Vereinfacht gesagt, wird der Performancevorteil dadurch erzeugt, dass die Datenbankabfragen von mehreren Server abgearbeitet werden können und die Replikation meist nicht sofort, sondern etwas zeitversetzt und dann gesammelt passiert.

OXID muss wie oben beschrieben für solche Dinge bisher auf andere Software setzen.
1. Ein MySQL-Cluster, der transparent als ein Server auftritt und die Abfragen intern verteilt.
2. Ein Proxy-Script, welches sich quasi zwischen Shop und Datenbank-Server schaltet um gemäß Abfrage-Format unterschiedliche Server anzuwählen.
3. Oder ein Shop-Modul.
In "großer" Ausfertigung, müsste der gesamte Shop erweitert werden um jede Datenbank-Operation so zu manipulieren, dass Ihr von Außen zugewiesen wird, welche Datenbank-Server sie zur Auswahl hat.
Oder man kann das Datenbankmodul mit vermutlich weniger Aufwand so gestalten, dass es intern wie das Proxy-Script aus Punkt zwei arbeitet, bloß direkt aus dem Shop heraus.


Punkt zwei (und drei) könnten mit [PHP 5.3](http://php.net/releases/5_3_0.php "PHP 5.3") mittlerweile vom [MySQL-Treiber (MySQLnd)](http://php.net/manual/en/book.mysqlnd.php "MySQL Native Driver") selbst erledigt werden.

Ich bevorzuge eine Datenbankschicht, bei der man für jeden Query zumindestens sagen kann, ob es ein Query ist, der unbedingt an den Master geschickt werden muss, oder ob er auch von Slaves bedient werden kann. Dies wäre die große Ausfertigung von Punkt drei. So ist schon von der Applikation her klar, wie die Abfragen grob aufgeteilt werden und reduziert den Aufwand von anderer ergänzender Software neben dem Shop. Genau dieses Vorgehen scheint jetzt auch bei OXID Einzug zu halten.

Happy Hacking!

Björn
