---
title: 'Magento vs. OXID, Part 1, Eigene Autoloader'
description: 'Mit den Postings "Magento vs. OXID" werden wir euch jetzt öfter quälen ;)

Wie man den OXID-Modulen der WBL Konzept ansehen kann, beginnt bei uns die Modularbeit meist mit dem Autoloader, denn wir lad...'
pubDatetime: 2012-07-18T12:19:13+02:00
tags:
  - oxid
  - magento
  - autoloaders
  - modules
---

Mit den Postings "Magento vs. OXID" werden wir euch jetzt öfter quälen ;)

Wie man den OXID-Modulen der [WBL Konzept](http://wbl-konzept.de "WBL Konzept") ansehen kann, beginnt bei uns die Modularbeit meist mit dem Autoloader, denn wir laden unsere Module mit [unserem eigenen Autoloader](http://ecommerce-developer.de/unser-oxid-autoloader/ "Unser OXID Autoloader").



Wie wir in dem [Autoloader-Posting](http://ecommerce-developer.de/unser-oxid-autoloader/ "Unser OXID Autoloader") bereits ausführlich dargelegt haben, bietet OXID mit der **./modules/function.php** eine leichte Möglichkeit globale Funktionen zu überschreiben oder auch z.B. einen eigenen Autoloader zu registrieren.

```php
    require\_once realpath(dirname(\_\_FILE\_\_) . '/WBL/Modules/Autoloader.php');
    $oAutoloader = new WBL\_Modules\_Autoloader();

    spl\_autoload\_register(array(
        $oAutoloader->setAutoloaderNamespaces(array('b3nl', 'WBL')),
        'includeClass'
    ));
    unset($oAutoloader);
```

Geht es nun an das Vereinen eines OXID-Moduls mit Magento kommt uns erstmal überhaupt zu Gute, dass wir mit dem Autoloader eine Möglichkeit geschaffen haben, OXID-Module in einer Magento ähnlichen Ordner-Struktur anlegen zu können und mit **wblNew() einen Wrapper für oxNew()**für unsere Module anbieten.

Die gute Nachricht zuerst. Magento bringt aktuell bereits einen sehr umfangreichen Autoloader **Varien\_Autoloader** in Kombination mit einigen Include-Paths mit.

```php
    /**
     * Set include path
     */
    $paths[] = BP . DS . 'app' . DS . 'code' . DS . 'local';
    $paths[] = BP . DS . 'app' . DS . 'code' . DS . 'community';
    $paths[] = BP . DS . 'app' . DS . 'code' . DS . 'core';
    $paths[] = BP . DS . 'lib';

    $appPath = implode(PS, $paths);
    set\_include\_path($appPath . PS . Mage::registry('original\_include\_path'));
    include\_once "Mage/Core/functions.php";
    include\_once "Varien/Autoload.php";
```

Legt Ihr eure Modul-Dateien in den korrekten app-Ordner für Magento ab, wird Magento diese Klassen über den Namen bereits finden, wenn Ihr kein spezielles Dateisuffix nutzt. **Magento geht immer von .php als Endung aus**.

```php
    public function autoload($class)
    {
        // ... 
        $classFile.= '.php';
        //echo $classFile;die();
        return include $classFile;
    }
```

Der interessante Punkt ist also quasi noch, wie bekommt man **wblNew()** oder sogar trotzdem einen eigenen Autoloader ins System? Eine API für globale Funktionen oder ein 100%tiges [IoC](http://de.wikipedia.org/wiki/Inversion_of_Control "Inversion of Control")-Konzept wie OXID mit **oxNew()** gibt es noch nicht.

Vielleicht ist euch hier ein [Tweet](http://twitter.com/b3nl/status/221255125581307904) von mir zur Recherche dieses Artikels bereits aufgefallen. Auch wenn es in den [Magento-Foren Tipps zum Core-Hack gibt](http://www.magentocommerce.com/boards/viewthread/209903/#t277008 "How can I extend the autoloader to work with EZComponents"), läßt sich auch für mich nur eine einzige Logik als Ansatz wählen.

Man "missbraucht" das [Event-Observing](http://www.magentocommerce.com/wiki/5_-_modules_and_development/0_-_module_development_in_magento/customizing_magento_using_event-observer_method "Customize Magento using Event/Observer") dafür. Registriert man sich einen Observer für einen Event sehr früh im Dispatching von Magento, wie z.B. für der Event "**controller\_front\_init\_before**", kann man leicht das **wblNew() oder eigene Autoloader** nachimplementieren. Das [Posting "How to integrate ezComponents with magento" bei stackoverflow](http://stackoverflow.com/questions/4085967/how-to-integrate-ezcomponents-with-magento/4636662#4636662 "How to integrate ezComponents with magento") gibt dazu noch tiefere Insights.

Damit weicht Ihr aber leider immer noch leicht von Magento-Prinzipien ab. Magento lädt Helper und Models nicht immer über den Klassennamen, sondern meist über [gruppierte und refaktorierte Namen aus der Konfiguration](http://alanstorm.com/magento_models_orm "Magento Models and ORM Basics").

```php
$model = Mage::getModel('weblog/blogpost');
```

**Mage::GetModel()** könnt Ihr aber auch mit einem vollständigen Klassennamen füttern.

```php
    public function getModelInstance($modelClass='', $constructArguments=array())
    {
        $className = $this->getModelClassName($modelClass);
        if (class\_exists($className)) {
            Varien\_Profiler::start('CORE::create\_object\_of::'.$className);
            $obj = new $className($constructArguments);
            Varien\_Profiler::stop('CORE::create\_object\_of::'.$className);
            return $obj;
        } else {
            return false;
        }
    }
```

Die Möglichkeit, dass der Modul-Kunde diese Klasse überschreibt, geht damit aber nicht verloren. Denn bei den oben gezeigten [Include-Pfaden](#include-paths) steht der lokale Codepool immer noch vor dem Community-Codepool und somit könnt Ihr auch über diesen lokalen Codepool und dem Klassennamen die Modulklasse aus der Community überschreiben. **wblNew() ist bei Magento als ein Wrapper für Mage::getModel().**

Leider fehlt bei **Mage::getModel()** im Gegensatz zu OXIDs **oxNew()** die Möglichkeit, mehr als einen Parameter an den Objekt-Konstruktur zu übergeben. Da wir Entwickler in der Regel aber den Konstruktor möglichst dumm halten, sollte das kein Problem sein ;)

Die gezeigten Beispiele haben natürlich Ihr Für und Wider, aber ich persönlich möchte Codes so gut es geht wiederverwenden und das oben Gezeigte ist beim Autoloader nun einmal die Schnittmenge. Module aber entsprechend noch weiter an Magento und vice versa anzupassen, steht uns natürlich weiterhin frei.

Bis zum nächsten Mal

Björn
