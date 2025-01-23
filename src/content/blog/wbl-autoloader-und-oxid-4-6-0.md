---
title: 'WBL Autoloader und OXID 4.6.0'
description: '[caption id="attachment_182" align="alignleft" width="150" caption="Falsche Modulansicht"][/caption]

Vor OXID 4.6.0 musste man sich seine Modulketten im Backend selbst zusammenstellen. Nun hilft eine...'
pubDatetime: 2012-05-06T10:36:31+02:00
tags:
  - oxid
  - autoloaders
  - updates
  - metadata
---

[caption id="attachment\_182" align="alignleft" width="150" caption="Falsche Modulansicht"][![Falsche Modulansicht](http://ecommerce-developer.de/wp-content/uploads/2012/05/wrong_modules-150x150.png "wrong_modules")](http://ecommerce-developer.de/wp-content/uploads/2012/05/wrong_modules.png)[/caption]

Vor [OXID 4.6.0](http://www.oxid-esales.com/de/news/presse/pressemitteilungen/einzelansicht/article/release-oxid-eshop-460-semantisch-schnell-und-downloadbar.html "Release: OXID eShop 4.6.0 – semantisch, schnell und downloadbar") musste man sich seine Modulketten im Backend selbst zusammenstellen. Nun hilft einem das Backend dabei. Unser [Autoloader](http://ecommerce-developer.de/unser-oxid-autoloader/ "Unser OXID Autoloader") durchkreuzte da ein bisschen die Pläne seitens OXID. Er funktionierte weiterhin wunderbar, aber die Aussage im Backend waren für den Benutzer nicht einleuchtend.
* Module werden unter unserem Kürzel in der Liste gruppiert.
* Warnmeldung im unteren Frame zur Deaktivierung.


Diese "Probleme" haben wir nun behoben:
---------------------------------------


1. Wir haben die [metadata.php](http://wiki.oxidforge.org/Features/Extension_metadata_file) für den WBL\_Modules -Ordner angelegt.
2. Das Modul WBL\_Modules\_ModuleList sorgt dafür, dass der Autoloader in der Liste als aktiv angezeigt wird und die "Entfernen"-Warnmeldung im unteren Frame nicht mehr erscheint. (Leider auf den ersten Blick n kleineren [OXID-Bug](https://bugs.oxid-esales.com/view.php?id=4001) gefunden.)
3. Und die [vendormetadata.php](http://wiki.oxidforge.org/Features/Extension_metadata_file) im WBL-Ordner sorgt dafür, dass der WBL-Ordner nicht mehr als direkter Modulordner verstanden wird. OXID schachtelt jetzt noch eine Ebene tiefer und versteht den WBL-Ordner nur noch als Hersteller-Ordner. Dies muss für alle "Hersteller"-Ordner gemacht werden, wobei die  [vendormetadata.php](http://wiki.oxidforge.org/Features/Extension_metadata_file) dabei noch leer sein darf.
4. Unittests sind auch aktualisiert worden. Unser Modul für die oxModuleList schließt natürlich auch mit 100% Codeabdeckung ab.



[caption id="attachment\_202" align="aligncenter" width="595" caption="Korrekte Moduldarstellung nach 4.6.0 Update"][![Moduldarstellung](http://ecommerce-developer.de/wp-content/uploads/2012/05/modules.png "modules")](http://ecommerce-developer.de/wp-content/uploads/2012/05/modules.png)[/caption]

[>> Unseren Autoloader downloaden](http://ecommerce-developer.de/wp-content/uploads/2012/05/wbl_modules_autoloader_100.zip)
