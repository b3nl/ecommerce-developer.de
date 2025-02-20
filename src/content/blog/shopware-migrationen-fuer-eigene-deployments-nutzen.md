---
title: 'Shopware Migrationen für eigene Deployments "nutzen"'
description: 'Laravel Migrations
Ich stehe ja tierisch auf die Datenbank-Migrationen von Laravel. Ein PHP-Prozess der durch einen Ordner iteriert und weiß, welchen Dateien er schon importiert hat und welche nicht....'
pubDatetime: 2015-04-22T18:56:56+02:00
tags:
  - shopware
  - migrations
  - deployment
  - laravel
---

## Laravel Migrations

Ich stehe ja tierisch auf die [Datenbank-Migrationen von Laravel](http://laravel.com/docs/5.0/migrations "Laravel Migrations"). Ein PHP-Prozess der durch einen Ordner iteriert und weiß, welchen Dateien er schon importiert hat und welche nicht. Damit aber nicht genug: Mit dabei kommt eine Konsolen-Anwendung, die uns im Release-Fall bei Migrationen unterstützt und Migrationen auch wieder resetten kann.  So mag ich das. Der Prozess ist robust und an Feinheiten wie eine konfliktfreie Namenskonvention oder an eine Boilerplatte zur Klassenerstellung wurde auch gedacht.

## Shopware Migrations

Einen ähnlichen Prozess finden wir auch im "internen" Entwickler-Deployment von Shopware. Die *build/ApplyDeltas.php* durchläuft den Ordner *\_sql/migrations* und wendet alle gefundenen Migrations auf die Datenbank an. Die Reihenfolge wird von dem numerischen Präfix im Dateinamen der jeweiligen Klasse bestimmt, wie z.B. "[101-add-extended-editor-field.php](https://github.com/shopware/shopware/blob/v5.0.0-RC3/_sql/migrations/101-add-extended-editor-field.php "Migration bei Github")". Dieses Präfix wird dann wiederum auch als ID in der Datenbank-Tabelle *s\_schema\_version*gespeichert, welche als "Historie" der Migrationen dient.

## "Probleme" und Lösung

Gerne würde ich diesen Mechanismus auch für meine eigenen Datenbank-Deployments verwenden, aber leider "traue" ich mich das nicht. ;) Ja, Shopware fängt zwar erst bei ID 101 an, aber trotzdem kann ich nicht 100%-konfliktsicher eine eigene Migration-Klasse  mit entsprechender ID einfügen, da ich nicht weiß, ob diese von Shopware selbst belegt wird. (Hier hätte ich mir eine flexiblere Namenskonvention gewünscht) Einen eigenen Ordner und entsprechende Datenbank-Historie kann ich aber leider beim *Shopware\Components\Migrations\Manager* auch nicht angeben.

Als Lösung dieses Dilemmas habe ich die Shopware-Struktur entsprechend abgeleitet und euch unter [https://github.com/b3nl/sw-migrations](https://github.com/b3nl/sw-migrations "https://github.com/b3nl/sw-migrations") und als ["Composer-Katalog"-Eintrag](https://packagist.org/packages/b3nl/sw-migrations "SWMigrations bei Packagist") bereitgestellt. **Die Struktur ist im Prinzip die Selbe wie beim Shopware-Original, nur dass Ihr als Konsolenparameter zusätzlich noch einen eigenen Migrationsordner und eine eigene Versionshistorie (per Tabellen-Suffix) angeben könnt** - den Shopware-Basis-Ordner **müsst** Ihr in dem Fall aber leider angeben, da Ihr meine Komponente ja auch außerhalb von Shopware installieren könntet.

```
php vendor/b3nl/sw-migrations/build/ApplyDeltas.php --shoppath="$PATHTOSHOPWARE" --migrationpath="$PATHTOMIGRATIONDIR" --tablesuffix="$NAMESPACEFORYOURHISTORY"
```

(Über Remote Inclusions braucht Ihr euch da eigentlich keine Sorgen machen, da der Pfad eigentlich nur per Konsole gesetzt werden kann. Bei Bedenken trotzdem bitte melden!)

Viel Spaß damit!
