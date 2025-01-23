---
title: 'Jetzt auf Github, Fortsetzung für den WBL Autoloader'
description: 'Wer Module nicht wie bei OXID normalerweise üblich pflegen möchte:
search =&gt; efifactfinder/efiFactfinderSearch
Sondern lieber auf solch einen Stil steht:
search =&gt; efi_FactFinder_Search
der ist...'
pubDatetime: 2012-06-25T09:44:22+02:00
tags:
  - oxid
  - autoloaders
  - modules
  - github
---

Wer Module nicht wie bei [OXID normalerweise](http://wiki.oxidforge.org/Features/Extension_metadata_file) üblich pflegen möchte:

```
search => efifactfinder/efiFactfinderSearch
```

Sondern lieber auf solch einen Stil steht:

```
search => efi\_FactFinder\_Search
```

der ist bei meinem [Autoloader](http://ecommerce-developer.de/wbl-autoloader-und-oxid-4-6-0/ "WBL Autoloader und OXID 4.6.0") genau richtig. Ich persönlich finde, die bisherige Modulpflege verlangt leider einige Redundanzen die auf Grund der API-Sicherheit nun seit Jahren beibehalten werden.
Warum macht man das so? OXID bietet updatesichere dynamische Modulketten - oder besser, einen [IoC-Container](http://de.wikipedia.org/wiki/Inversion_of_Control "IoC auf Wikipedia") für Module der Core-Klassen - nämlich bereits seit Jahren an. [Manch einer hatte dieses Konzept anfänglich nicht für sinnvoll erachtet](http://phpterror.wordpress.com/2009/08/26/oxid-esales-the-extend-parade/ "PHP Terror verstand die Modulketten nicht so recht") doch ich finde es toll. Ich versuche euch mit meinem Autoloader eine Möglichkeit zu bieten, den OXID-Styleguide weiter an andere berühmte Styleguides, wie dem des Zend Frameworks mit Magento, anzugleichen und so eure Projekte intern weiter zu harmonisieren.

Da die Updates für OXID 4.6 abgeschlossen sind, ist der Autoloader nun auch ein [OXID Projekt-Fork](https://github.com/OXIDprojects/WBL_Modules_Autoloader/ "WBL Modules Autoloader als OXID-Projekt") auf [Github](https://github.com/WBL-BjoernLange "Mein Github"). Hier könnt Ihr es downloaden, einsehen oder auch mit mir weiterentwickeln.

Ich benutze den Autoloader nun seit einigen Jahren nahezu unverändert und konnte auch andere großen Agenturen überzeugen, dass diese Modullogik einen gewissen Charme hat, doch [OXID 4.6 hat mit seiner neuen Modulverwaltung](http://www.oxid-esales.com/de/support-services/dokumentation-und-hilfe/neu-oxid-eshop-460.html) einige Updates erforderlich gemacht.

Um die oben gezeigten Klassennamen, die bereits den Dateipfad wiedergeben, seit OXID 4.6.0 nutzen zu können, reicht es nicht, nur den Autoloader in der functions.php zu notieren.

```
<?php
   // functions.php vor OXID 4.6

   require\_once realpath(dirname(\_\_FILE\_\_) . '/WBL/Modules/Autoloader.php');
   $oAutoloader = new WBL\_Modules\_Autoloader();

   spl\_autoload\_register(array(
       $oAutoloader->setAutoloaderNamespaces(array('WBL')),
       'includeClass'
   ));
   unset($oAutoloader);
?>
```

sondern wir müssen seit OXID 4.6 den Modullogiken aus dem Core auch mitteilen, dass Moduleinstellungen ohne Pfad vollkommen in Ordnung sind.

```
<?php
   // functions.php seit OXID 4.6 
   require\_once realpath(dirname(\_\_FILE\_\_) . '/WBL/Modules/Autoloader.php');
   $oAutoloader = new WBL\_Modules\_Autoloader();

   spl\_autoload\_register(array(
       $oAutoloader
           ->addCoreOverride('oxutilsobject', 'WBL\_Modules\_UtilsObject')
           ->setAutoloaderNamespaces(array('WBL')),
       'includeClass'
   ));
   unset($oAutoloader);
?>
```

Wie dieses Schnipsel zeigt, ist leider auch ein "Core Hack" enthalten. **oxUtilsObject** ist eine Core-Klasse die von OXID nicht über die übliche API überlagerbar ist doch mit seiner Methode **\_getActiveModuleChain(array)** dafür sorgt, dass wirklich nur Module geladen werden, die nicht in der Config **aDisabledModules** zu finden sind.

Diese Core-Klasse wird im OXID-Framework so früh geladen, dass es hier noch gar keine Chance gibt, die eigentlichen Module aus der Datenbank auszulesen. Ein Modul von dieser Klasse müsste also quasi schon von Beginn an, in der Moduleinstellung zu finden sein. Um Seiteneffekte zu vermeiden, darf die entsprechende Einstellung aber auch nicht Teil der Datenbank oder dauerhaften Modulspeicherungen werden. Da **oxUtilsObject** ein OXID-[Singleton](http://de.wikipedia.org/wiki/Singleton_%28Entwurfsmuster%29 "Singleton auf Wikipedia") ist, reicht es also, das Modul kurz vor der ersten Instanziierung in die Moduleinstellung **aModules** zu speichern, damit OXID die übliche Modullogik für das Laden der Instanz abfeuern kann, und es danach wieder zu entfernen.

Und genau dafür sorgt der Autoloader selbst. **WBL\_Modules\_Autoloader->addCoreOverride('oxutilsobject', 'WBL\_Modules\_UtilsObject')** sorgt dafür, dass OXID weiß, lade bitte eine andere Klasse, wenn oxUtilsObject angefragt wird, indem **WBL\_Modules\_Autoloader::handleCoreOverrides(string)** das registrierte Modul vor dem Laden in die Config hängt, oxUtilsObject mit dem Original-Autoloader laden läßt und die Config danach wieder auf den Zustand vor dem Laden zurücksetzt.

Die andere Seite der Medaille ist **oxModuleList**. Diese Coreklasse hilft primär beim Handling der Module im Backend. Die Modullogik von OXID erwartet, dass ein Moduleintrag mit dem Pfad anfängt. Der WBL Autoloader erwartet aber, dass der Klassenname mit dem Pfad startet, genau diesen Unterschied gleicht **WBL\_Modules\_ModuleList** aus. Praktischerweise ist der Ordner auch die entsprechende Modul-Id.

Happy Coding,

Björn
