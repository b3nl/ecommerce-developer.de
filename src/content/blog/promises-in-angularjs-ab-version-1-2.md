---
title: 'Promises in AngularJS ab Version 1.2'
description: 'Ich habe gerade eine etwas ältere SPA von uns getestet und mir ist leider schmerzlich aufgefallen, dass manche asynchronen Logiken für AJAX-Requests und Web SQL-Callbacks nicht mehr richtig funktionie...'
pubDatetime: 2014-01-29T22:27:39+01:00
tags:
  - angularjs
  - promises
  - async
  - debugging
---

Ich habe gerade eine etwas ältere SPA von uns getestet und mir ist leider schmerzlich aufgefallen, dass manche asynchronen Logiken für AJAX-Requests und Web SQL-Callbacks nicht mehr richtig funktionieren. Ich fand die Art und Weise wie man damals mit Angular asynchrone Logiken in eigentlich synchrone Logiken einfügen konnte richtig bombe, um nicht zu sagen **+1**.
Im [Tutorial für eigene AJAX/REST-Aufrufe](http://docs.angularjs.org/tutorial/step_11) wird dieser Eindruck immer noch impliziert. Um es kurz zu machen, anstatt das man irgendwelche Callbacks registriert, weist man einfach das Ergebnis von einem Promise einer Variablen zu und Angular macht den Rest, ohne den eigentlichen Programmierablauf durch einen Callback zu "unterbrechen".

Ich habe mir die Finger wund gegoogelt und Treffer wie diesen gefunden: <http://markdalgleish.com/2013/06/using-promises-in-angularjs-views/>. Die meisten Suchtreffer erklären Promises immer noch genau so, wie ich sie angewendet habe. Nach einer Iteration unterschiedlichster Keywords bin ich dann doch zum Glück noch auf einen Eintrag beim [stackoverflow](http://stackoverflow.com/questions/19472017/angularjs-promise-not-binding-to-template-in-1-2 "Angularjs promise not binding to template in 1.2") gestoßen, der mich auf den Changelog von angular.js hinwies, und folgenden Punkt: Promises müssen seit Angular 1.2 händisch aufgelöst werden. Wir müssen also doch wieder irgendwie Callbacks einbauen.

Also, falls Ihr auch über dies Problem stoplert, vielleicht hilft euch der folgende Gist. Gemäß Angular müssen wir nun wieder ganz normal zu "[then()](http://docs.angularjs.org/api/ng.$q#description_the-promise-api)" greifen:

[gist id="8697564"]
