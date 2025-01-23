---
title: 'Datenbankprobleme beim OXID-Unit-Testing'
description: 'Mensch, eine Stunde verbraucht mit der Fehlersuche.

Ich stolpere grad über Datenbank-Probleme beim Unit-Testing einer aktuellen OXID-Version und bin auch mit einer ausgiebigen Google-Recherche und de...'
pubDatetime: 2012-04-17T16:28:20+02:00
tags:
    - oxid
    - databases
    - unit-tests
    - debugging
---

Mensch, eine Stunde verbraucht mit der Fehlersuche.

Ich stolpere grad über Datenbank-Probleme beim Unit-Testing einer aktuellen OXID-Version und bin auch mit einer ausgiebigen Google-Recherche und dem Wühlen in der OXID-Mailingliste nicht fündig geworden. Da die [Testumgebung von OXID](http://wiki.oxidforge.org/Certification/Modules "OXID Zertifizierung") zur Modulzertifizierung leicht veraltet ist, teste ich meine Module gegen ein halbwegs aktuelles Debian 6 mit PHP 5.3 auf dem neuesten VMWare Player und irgendwann, wirklich irgendwann im Testlauf, ist plötzlich in der Connection-ID des Datenbankobjekts keine Resource mehr zu finden, sondern nur noch ein Integer-Wert.  Ab dem Moment als das Problem auftrat, trat es ab da immer an der gleichen Stelle auf.  Cacheleeren, Views neu generieren, neues Deployment ... nichts hat geholfen. Ich hab in meinen Modulen gewühlt, aber einfach kein Grund für das Problem gefunden.

```php
mysql\_query() expects parameter 2 to be resource, integer given

/var/www/oxid458/trunk/core/adodblite/adodbSQL\_drivers/mysql/mysql\_driver.inc:353
/var/www/oxid458/trunk/core/adodblite/adodb.inc.php:316

oder

mysql\_real\_escape\_string() expects parameter 2 to be resource, integer given

/var/www/oxid458/trunk/core/adodblite/adodbSQL\_drivers/mysql/mysql\_driver.inc:197
/var/www/oxid458/trunk/core/adodblite/generic\_modules/pear\_module.inc:125
/var/www/oxid458/trunk/core/oxbase.php:648
/var/www/oxid458/trunk/core/oxbase.php:615
```

Im Core gibt es auch nicht wirklich eine Stelle, die die Connection-ID überschreibt also wird es vermutlich irgendein Seiteneffekt mit dem Setup sein, welches PHPUnit forciert.[![](http://ecommerce-developer.de/wp-content/uploads/2012/04/db1.png "ConnectId im Core")](http://ecommerce-developer.de/wp-content/uploads/2012/04/db1.png)

Also flott mal einen Core-Unit-Test von OXID ausgeführt und siehe da, auch hier tritt der Fehler auf. Damit kann ich meine Logik ausschließen und schiebe es auf andere Ursachen.

Wer rein zufällig auch auf dieses Problem stolpert und kein Interesse hat den vermutlichen Seiteneffekt im Core zu fixen, hier ein schneller Workaround:

```php
<?php
    // ./core/oxdb.php

    public static function getDb( $blAssoc = false )
    {
        global $ADODB\_FETCH\_MODE;

        if ( $blAssoc ) {
            $ADODB\_FETCH\_MODE = ADODB\_FETCH\_ASSOC;
        } else {
            $ADODB\_FETCH\_MODE = ADODB\_FETCH\_NUM;
        }

        if ( defined( 'OXID\_PHP\_UNIT' ) ) {
            if ( isset( modDB::$unitMOD ) && is\_object( modDB::$unitMOD ) ) {
                return modDB::$unitMOD;
            }
        }
        // && is\_resource(self::getInstance()->\_getConnectionId()) ergaenzt
        if ( self::$\_oDB !== null && is\_resource(self::getInstance()->\_getConnectionId())) {
        // ....
?>
```

Dieser Fix führt dazu, dass jedes Mal eine neue Verbindung aufgebaut wird, wenn die Verbindung über die ConnectionID nicht mehr identifiziert werden kann. **Der Fix ist natürlich nur für Entwicklungssysteme gedacht!**

Happing Coding!

Björn
