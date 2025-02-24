---
slug: "ionos-deploy-now-vs-laravel-commands-and-php-exe"
title: 'Wie PHP_BINARY mein Laravel IONOS Deploy Now Deployment gefixxt hat.'
description: 'Ich stellte fest, dass meine Laravel-Cronjobs bei der Verwendung von IONOS Deploy Now nicht funktionierten. Die Ursache war, dass die Standard-PHP-Exe auf eine veraltete Version zeigte, die mit Laravel nicht kompatibel ist. Hier zeige ich meine Analyse und Behebung.'
pubDatetime: 2025-01-27T18:00:00+02:00
tags:
  - laravel
  - cronjobs
  - deployment
  - debugging
  - ionos  
---

[Laravel](https://laravel.com) ist ein beeindruckendes Fullstack Framework, welches sich durch Performance, [gute Dokumentation](https://laravel.com/docs/11.x) 
und Einfachheit aber auch durch Feature-Fülle auszeichnet. Dazu gehört für mich auch das elegante [Abstrahieren von Cronjobs](https://laravel.com/docs/11.x/scheduling).  

```php
$schedule->command(IgnoreDJTCommand::class, [3])->daily()->withoutOverlapping();
```

Damit habe ich nämlich fast wörtlich einen täglichen Cronjob deklariert, ihm einen Parameter mitgegeben und Overlaps verboten.

Aber jetzt zur anderen Hälfte dieses Postings. Ionos. Vorher 1Und1, Welches damals eher als simpler Webhoster galt. 
Ionos bietet aber nun seit einiger mit "Deploy Now" auch eine GitOps Deployment Pipeline an, mit der man genauso einfach 
auch Laravel Applikationen deployen können soll ....

Fast Alles wird automatisch von Ionos erledigt, [da Laravel erkannt wird](https://docs.ionos.space/blog/php-release/#supported-static-site-generators-spa-and-php-frameworks). Cronjobs und damit der Scheduler von Laravel 
muss aber händisch eingerichtet werden. 

Also [Doku](https://docs.ionos.space/docs/runtime-configuration/#cron-jobs) geöffnet und erledigt:

```yaml
runtime:
  cron-jobs:
    - command: "php $HOME/htdocs/artisan schedule:run >> /dev/null 2>&1"
      schedule: "* * * * *"
```

Aber leider will es nicht. Es bricht einfach ab. Kein Logging. Keine Fehlermeldung. Keine Debugging-Anzeige. 
Cron schickt mir keine Mails.

Mh, was ist da los? 

Es gibt auch keine Hinweise in der Doku, außer dass die PHP-Version je nach Umgebung eine Andere sein kann.

> Deploy Now offers a wide choice of PHP versions. Note that PHP versions for the runtime can be different from those for the build.
> 
> -- <cite>https://docs.ionos.space/docs/runtime-configuration/#description</cite>

Also [Ockhams Rasiermesser](https://de.wikipedia.org/wiki/Ockhams_Rasiermesser):

- Die Doku sagt mir, dass die PHP-Version anders sein könnte.
- Der Prozess bricht ab ohne mir irgendwas zu geben.
- --> Wie passt beides zusammen? Es wirkt wie ein Compiler-Error.

OK, also IDE auf und debuggen. 

Welche PHP-Version ist denn die Exe, die ich unterm Alias "php" zur Verfügung habe?

und mit

```yaml
runtime:
  cron-jobs:
    - command: "php -r \"echo phpversion();\"  >> $HOME/htdocs/test.log"
      schedule: "* * * * *"
```

erhalte ich:

```
Usage: php [-q] [-h] [-s] [-v] [-i] [-f <file>] 
       php <file> [args...]
  -a               Run interactively
  -b <address:port>|<port> Bind Path for external FASTCGI Server mode
  -C               Do not chdir to the script's directory
  -c <path>|<file> Look for php.ini file in this directory
  -n               No php.ini file will be used
  -d foo[=bar]     Define INI entry foo with value 'bar'
  -e               Generate extended information for debugger/profiler
  -f <file>        Parse <file>.  Implies `-q'
  -h               This help
  -i               PHP information
  -l               Syntax check only (lint)
  -m               Show compiled in modules
  -q               Quiet-mode.  Suppress HTTP Header output.
  -s               Display colour syntax highlighted source.
  -v               Version number
  -w               Display source with stripped comments and whitespace.
  -z <file>        Load Zend extension <file>.
```

Wait, what?! Parameter "r" nicht verfügbar? Damit muss die PHP-Version ancient sein!

```yaml
runtime:
  cron-jobs:
    - command: "php $HOME/htdocs/test.php >> $HOME/htdocs/test.log"
      schedule: "* * * * *"
```

Gibt mir dann: 🥁Trommelwirbel ... **4.4.9** 😂 WHAT!?

🫡 Ja, ok, das kann nicht klappen. Vermutung richtig. Der PHP Code kann erst gar nicht kompiliert werden, daher keine Meldungen.

[dann testen wir mal blind und forcen eine andere Version gemäß "fremder" Doku](https://www.ionos.com/help/hosting/cron-jobs/tips-for-creating-cron-jobs/):

```yaml
runtime:
  cron-jobs:
    - command: "/usr/bin/php8.2 $HOME/htdocs/artisan schedule:run >> /dev/null 2>&1"
      schedule: "* * * * *"
```

Will aber immer noch nicht, aber wenigstens kommen meine reingeprutschten Debug-Meldungen und -Loggings des Bootstrappings 
in Logs an.
Der Cronjob ist aber trotzdem tot und gibt mir NICHTS! WHAT^2?!

Auch das Durchackern der Doku mit dem "Support Chatbot" - hier wäre mir menschlicher Support lieber - hat nichts geholfen.
Aber auch hier bin ich zu der Doku geführt worden, mit dem nicht-hilfreichen Hinweis zur Version.

--> Aber warum habe ich dann Verbosity im Bootstrapping?

1. Ok, also, wie ruft der Scheduler dieses Command auf?
2. Ok, dass Ding löst wirklich hart zu einem CLI-Kommando auf: `$ php $HOME/htdocs/artisan app:ignore-djt 3`

Sieht OK, aus. Aber failed immer noch. Natürlich ohne Verbosity. **Und wo ist meine PHP-Version? WHAT^3!?**

Zum Glück nutzt Laravel intern den
[Symfony PHPExecutableFinder](https://symfony.com/doc/current/components/process.html#finding-the-executable-php-binary).
Und dieser zeigt im Quellcode dankenswerterweise eine Konstante die ich nutzen kann, um die PHP-Version auch für Cronjobs 
zu erzwingen.

```php
class PhpExecutableFinder
{
    private ExecutableFinder $executableFinder;

    public function __construct()
    {
        $this->executableFinder = new ExecutableFinder();
    }

    /**
     * Finds The PHP executable.
     */
    public function find(bool $includeArgs = true): string|false
    {
        if ($php = getenv('PHP_BINARY')) { // <<<<<<----
            if (!is_executable($php) && !$php = $this->executableFinder->find($php)) {
                return false;
            }
```

und mit 
```yaml
runtime:
  cron-jobs:
    - command: "PHP_BINARY=\"/usr/bin/php8.2\" /usr/bin/php8.2 $HOME/htdocs/artisan schedule:run >> /dev/null 2>&1"
      schedule: "* * * * *"
```

klappt es dann auch. 

Liebes IONOS Team. Fixt bitte entweder eure Environments oder eure Dokus ;)

Danke Euch ❤️ !