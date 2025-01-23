---
title: 'Tracking der OXID User-ID im WBL Multitracker'
description: 'Heute mal wieder ein kleines Modul-Update.  Soeben habe ich auf Github einen Callback eingecheckt, mit dem Ihr die ID des aktuellen OXID-Users mittracken könnt. Kann kein User identifiziert werden, wi...'
pubDatetime: 2012-07-23T15:01:23+02:00
tags:
  - oxid
  - tracking
  - user-data
  - github
---

Heute mal wieder ein kleines Modul-Update.  Soeben habe ich auf [Github](https://github.com/WBL-BjoernLange/WBL_Tracker "WBL Tracker auf Github") einen [Callback](https://github.com/WBL-BjoernLange/WBL_Tracker/blob/master/modules/WBL/Tracker/Conditions/Value/User/Id.php) eingecheckt, mit dem Ihr die ID des aktuellen OXID-Users mittracken könnt. Kann kein User identifiziert werden, wird "-" mitgetrackt. Dies ist z.B. hilfreich, wenn Ihr bei einem User nachhaken wollt, ob es ein Problem beim Checkout gab, sollte der User seinen Warenkorb nicht abgeschlossen haben.

Da dies datenschutztechnisch schon relativ sensibel betrachtet werden muss, ist dies **kein Teil von unserem Standard-Setup** des WBL\_Trackers. Solltet Ihr aber z.B. [Piwik](http://Piwik.org "Piwik") auf eurem eigenen Server betreiben, sind euch die Informationen ja eigentlich sowieso bekannt, daher hier also z.B. das Beispiel, wie Ihr die ID des Users in eurem WBL\_Tracker - Piwik-Setup erfassen könnt:

```php
// Freifeld-ID => Name des Feldes, Callback der den Wert bestimmt
3 => userstatus|WBL\_Tracker\_Conditions\_Value\_User\_Id
```

Happy Hacking!

Björn
