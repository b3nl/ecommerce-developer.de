---
title: 'Neues Freifeld für den OXID WBL Multi Tracker'
description: 'Mal ein kleineres Update zum WBL_Tracker, mit dem Ihr mehrere Webtracking-Anbieter gleichzeitig in eurem OXID-Shop abbilden könnt. Im ersten Posting zu dem WBL_Tracker für OXID hatte ich euch ja berei...'
pubDatetime: 2012-07-19T11:16:28+02:00
tags:
  - oxid
  - tracking
  - ecommerce
  - github
---

Mal ein kleineres Update zum WBL\_Tracker, mit dem Ihr mehrere Webtracking-Anbieter gleichzeitig in eurem OXID-Shop abbilden könnt. Im ersten [Posting zu dem](http://ecommerce-developer.de/wbl_tracker-nun-auf-github-mit-piwik-einbindung/ "WBL_Tracker nun auf Github, mit Piwik-Einbindung (U)") WBL\_Tracker für OXID hatte ich euch ja bereits gezeigt, dass Ihr mit allen Trackern spezielle Werte mittracken könnt, die eigentlich nicht direkt vom Anbieter bedacht sind, wie z.B. wie viele Suchtreffer Ihr für welchen Suchbegriff im Shop hattet. Hier ein Beispiel aus dem mitgelieferten Piwik-Tracker:

```
// Freifeld-ID => Freifeldname|Callbacks um Wert anzugeben|Nicht nötiger Kontrollwert|Viewname
1 => searchhits|WBL\_Tracker\_Conditions\_Value\_Search\_Hits||search
2 => searchquery|WBL\_Tracker\_Conditions\_Value\_Search\_Query||search
```

Vergessen zu erwähnen hatte ich dabei, dass unser WBL\_Tracker auch bereits ein Tracking für die Zahlungsart einer Bestellung mitbringt, z.B. um diese in einem [Piwik-Freifeld](http://piwik.org/docs/custom-variables/ "Custom Variables – Get Started & Reports") zu speichern:

```
4 => orderpayment|WBL\_Tracker\_Conditions\_Value\_OrderPayment||thankyou
```

Grade eben habe ich einen weiteren Callback auf [Github](https://github.com/WBL-BjoernLange/WBL_Tracker "WBL Tracker auf Github") bereitgestellt, um auch die möglichen Zahlungsarten eines Checkouts in einem Freifeld zu speichern:

```
possiblepayments|WBL\_Tracker\_Conditions\_Value\_Search\_PossiblePayments||payment
```

Diese Einstellungen sind natürlich bereits getroffen, wenn Ihr unser Piwik-Tracker-Modul frisch installiert.

Viel Spaß damit

Björn

 
