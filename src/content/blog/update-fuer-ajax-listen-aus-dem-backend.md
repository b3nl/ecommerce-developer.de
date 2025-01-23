---
title: 'OXID Update für AJAX-Listen'
description: 'Wer bei OXID in der Vergangenheit versucht hat, die AJAX-Listen des Backends zu überschreiben, wird leider gemerkt haben, dass es doch mit mehr Arbeit als sonst bei OXID üblich verbunden ist.

Mit dem...'
pubDatetime: 2012-06-27T14:44:27+02:00
tags:
  - oxid
  - updates
  - ajax
  - backend
---

Wer bei OXID in der Vergangenheit versucht hat, die AJAX-Listen des Backends zu überschreiben, wird leider gemerkt haben, dass es doch mit mehr Arbeit als sonst bei OXID üblich verbunden ist.

Mit dem heute erschienen [4.6.2 Patch](http://wiki.oxidforge.org/Downloads/4.6.2 "OXID 4.6.2") soll sich das nun erledigt haben.

[Wo bisher mit globalen Variablen und Includes "außerhalb" des OXID-Frameworks gearbeitet wurde](http://svn.oxid-esales.com/tags/CE-4.6.1-45706/eshop/admin/article_extend.php "OXID Backend 4.6.1"):

```
<?php
        // admin/article\_extend.php

        $aColumns = array();
        $iAoc = oxConfig::getParameter("aoc");
        if ( $iAoc == 1 ) {

            include\_once 'inc/'.strtolower(\_\_CLASS\_\_).'.inc.php';
            $this->\_aViewData['oxajax'] = $aColumns;
```

[Wird nun ein imho deutlicherer sauberer Include mit **oxNew** ausgeführt](http://svn.oxid-esales.com/tags/CE-4.6.2-46646/eshop/admin/article_extend.php "OXID 4.6.2"):

```
<?php
        // ./admin/article\_extend.php

        if ( $iAoc == 1 ) {
            $oArticleExtendAjax = oxNew( 'article\_extend\_ajax' );
            $this->\_aViewData['oxajax'] = $oArticleExtendAjax->getColumns();
```

Ich möchte sagen, endlich ;).

Auf der [Entwickler-Mailingliste](http://www.mail-archive.com/dev-general@lists.oxidforge.org/msg01655.html "Entsprechender Thread") - die ich nur jedem empfehlen kann - hatten wir über einen Bug diskutiert, dass die neue Modullogik kein "Modul-Include" für diese Backendfunktionalität erlauben würde.  Wie man aus meinen Kommentaren zu dem [Thread](http://www.mail-archive.com/dev-general@lists.oxidforge.org/msg01655.html) entnehmen kann, habe ich das in meiner Modulentwicklung eigentlich immer für gegeben hingenommen, daher war es für mich kein Bug. Aber die Entwickler von OXID haben das als schlechten Stil erkannt und sofort gefixt. Danke dafür!
