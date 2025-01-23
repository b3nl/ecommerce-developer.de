---
title: 'Datenbankverbindung beim Unittesting reloaded'
description: 'Ich musste in meinem Posting Datenbankprobleme beim OXID-Unit-Testing ja bereits von kleinen Komplikationen mit meiner Testumgebung berichten. Bei OXID 4.6.0 ist es nach Tagen ohne Probleme hier plö...'
pubDatetime: 2012-05-06T09:57:33+02:00
tags:
  - oxid
  - databases
  - unit-tests
  - debugging
---



Ich musste in meinem Posting [Datenbankprobleme beim OXID-Unit-Testing](http://ecommerce-developer.de/datenbankprobleme-beim-unit-testing/ "Datenbankprobleme beim OXID-Unit-Testing") ja bereits von kleinen Komplikationen mit meiner Testumgebung berichten. Bei OXID 4.6.0 ist es nach Tagen ohne Probleme hier plötzlich auch aufgetreten. Irgendwo verschluckt sich meine VMWare.

Mein alter oxDB::getDb() - Fix ist bei OXID 4.6.0 tot und führt zu einer Endlosschleife, daher sieht meine Empfehlung für OXID 4.6.0 diesmal so aus:

```php
<?php
    // oxdb.php

    public static function getDb( $iFetchMode = oxDb::FETCH\_MODE\_NUM )
    {
        //Added for 0003480 bug; needed as backward compatibility; @deprecated in 4.6 since 2012-01-15; must be removed;
        if ( $iFetchMode === true ) {
            $iFetchMode = oxDb::FETCH\_MODE\_ASSOC;
        } elseif ( $iFetchMode === false ) {
            $iFetchMode = oxDb::FETCH\_MODE\_NUM;
        }

        if ( defined( 'OXID\_PHP\_UNIT' ) ) {
            if ( isset( modDB::$unitMOD ) && is\_object( modDB::$unitMOD ) ) {
                return modDB::$unitMOD;
            }
        }
        //  || (!is\_resource(self::$\_oDB->getDb()->connectionId)) ergaenzt
        if ( self::$\_oDB === null || (!is\_resource(self::$\_oDB->getDb()->connectionId))) {
```

Beste Grüße
Björn


