---
title: 'First post'
description: 'Lorem ipsum dolor sit amet'
pubDatetime: 2022-07-08T00:00:00+02:00
draft: true
featured: true
tags:
  - laravel
  - cronjobs
  - deployment
  - debugging
  - ionos  
---

laravel ist ein beeindruckendes Fullstack Framework, welches sich durch Performance und Einfachheit aber auch durch 
Feature-Fülle auszeichnet. Dazu gehört für mich auch das elegante Abstrahieren von Cronjobs.  

```php
$schedule->command(SearchAndHandleOldItemsCommand::class, [3])->daily()->withoutOverlapping();
```

Ionos hat mit "Deploy Now" auch eine GitOps Deployment Pipeline im Angebot, mit der man genauso einfach auch simple Laravel 
Applikationen deployen kann. Doch der versucht mit Deploy Now den Cronjob-Wrapper gemäß Dokumentation zu deployen und zu 
betreiben schlägt fehl.

TODO Doku und links


Und das leider ohne Logging, Fehlermeldung oder Debugging-Anzeige. 
Cronjobs failen ohne Meldung.  

schedule

commands deklaration

löst intern auf auf cli call

Failed

Fail ohne Logging, Verbosity, Mail oder Hinweis

PHP Version nicht richtig aufgelöst

PHP 4.4.9

Daher auch keine weiteren Log Einträge oder sowas, da PHP nicht im Ansatz geparst werden konnte

PHP Binary finder

Env Var

Call

Ich fand super das ionos ehemals 1und1 mit DeployNow auch endlich im GitOps Bereich angekommst ist und einen Deployment Git Workflow angeboten hat, und dabei z.B. auch auch Laravel out of the box mit seinen Cronjobs und Queues unterstützt.

Chatbot Hinweise

https://docs.ionos.space/docs/cronjobs/

https://docs.ionos.space/docs/runtime-configuration/ 

> Note that PHP versions for the runtime can be different from those for the build.
 
https://docs.ionos.space/blog/php-release/#learn-more-in-the-video -> laravel hinweis

https://github.com/ionos-deploy-now/laravel-starter/blob/main/.deploy-now/config.yaml nur "php"

deploynow-support@ionos.com

chatbot

https://docs.ionos.space/docs/deployment-configuration#example-1

