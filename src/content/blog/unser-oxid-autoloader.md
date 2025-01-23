---
title: 'Unser OXID Autoloader'
description: 'Jeder von uns Programmierern ist eigentlich bestrebt, wenig zu wiederholen und viel wiederzuverwenden. Wir überlegen uns meistens möglichst schöne Klassenstrukturen in denen wir unsere Logiken so kaps...'
pubDatetime: 2012-04-30T11:54:58+02:00
tags:
  - oxid
  - autoloaders
  - modules
  - php
---

Jeder von uns Programmierern ist eigentlich bestrebt, wenig zu wiederholen und viel wiederzuverwenden. Wir überlegen uns meistens möglichst schöne Klassenstrukturen in denen wir unsere Logiken so kapseln, dass wir sie hoffentlich wiederverwenden können. In letzter Zeit springe ich zwischen einigen OXID Todos und stehe gefühlt jedes Mal vor dem Schritt bestehende Strukturen zu kombinieren oder Strukturen auf der grünen Wiese neu zu pflanzen. Und jedes Mal ist der OXID-Autoloader auch wieder ein Thema.

In "älteren" Strukturen, musste man sich meist "selbst" darum kümmern wie Strukturen geladen werden und hat dementsprechend die Quellcodes händisch nach bestem Wissen und Gewissen mit Includes versehen. Die Ausgabe 3.2012 des PHP-Magazins hat dafür z.B. Phing genannt, wobei manche Dinge trotz Deklaration noch händisch inkludiert werden müssen.
[Zitat der Phing-Doku](http://www.phing.info/docs/guide/stable/chapters/ExtendingPhing.html#Includes "Includes for Extending Phing "):

> 
>  Always include/require all the classes needed for this task in full written notation. Furthermore you should always include phing/Task.php at the very top of your include block. Then include all other required system or proprietary classes.



Diese händischen Includes sind aber alles harte Aufrufe und schränken die Wiederverwendbarkeit etwas ein indem sie wahrscheinlich saubere Quellcodes "verschmutzen". Und jedes Mal macht man sich Gedanken um die Verfügbarkeit von Logiken. Steigt man in ein Projekt neu ein, erhöht dies auch die Lernkurve denn man weiß nicht auf Anhieb ob und wo man mal eben eine Klassenkonstante aufrufen kann.

Die PHP-Community hat dies erkannt und steuert mit einem [Autoloader seit PHP5](http://php.net/autoload "PHP Autoloader") nach. Zusätzlich dazu kann mit der [SPL](http://php.net/manual/en/book.spl.php "SPL") der PHP-Autoloader nützlich erweitert werden, indem der einzelne [Standard-Autoloader \_\_autoload()](http://php.net/__autoload "Standard-Autoloader") durch einen [ganzen Stapel von Autoloadern erweitert werden kann](http:php.net/spl-autoload-register "SPL Autoloader Stack"). Ein Autoloader wird beim Aufrufen von bisher nicht inkludierten Klassen und Interfaces automatisch mit dem entsprechenden voll qualifizierten Interface- oder Klassennamen aufgerufen und erlaubt dem Entwickler so, fehlende Logiken erst on Demand nachzuladen.
Ein weiterer Vorteil eines Autoloaders ist meiner Meinung nach auch, dass autoloadbare Strukturen meistens selbsterklärender sind.

Autoloadbare Strukturen zeigen sich heutzutage eigentlich in allen großen Frameworks. Im Zend Framework werden zum Beispiel alle Klassen und Interfaces  mit dem Präfix Zend als oberster Namespace eingeleitet. Der Klassennamen wird dann automatisch in den Ordnernnamen umgemünzt, indem man vom Zend-Ordner ausgehend alle Namespace-Trenner nutzt um damit Ordner und Dateien zu identifizieren.

Oft wird ein Software-Core wie der des Zend Frameworks in großen Projekten nicht direkt genutzt sondern an bestimmten Stellen erweitert.
Um dann Namenskonflikte zwischen Originallogik und Erweiterung zu vermeiden, hat es sich als Best Practice erwiesen, die Erweiterungen in einen eigenen Namespace, bzw. Ordner im Autoloader-Kontext, zu kapseln.
[Magento](http://www.magentocommerce.com/svn "Magento SVN") als Kind vom [Zend Framework](http://framework.zend.com/) kann hierfür als Beispiel dienen.


```php
./lib/Mage/
./lib/Varien/
./lib/Zend/
```

Im Core des [OXID Shopsystems](http://www.oxid-esales.com/de/startseite) sind solche Strukturen vorhanden. Geht es dann aber an die tiefe Modulentwicklung, fehlt es an manchen Details.


Mittlerweile denkt man bei OXID an Version 4.6, wenn nicht sogar Version 5, aber die grobe Ordnerstruktur für Logiken hat sich API-safe schon länger nicht mehr verändert. Seit mindestens Version 2 von OXID lässt sich fast jede Core-Klasse über "oxNew" und entsprechenden Strukturen im "modules" Ordner erweitern ([Mehr dazu bei OXID selbst](http://www.oxid-esales.com/de/news/blog/howto-extend-oxid-eshop-modules-part-1)).  "oxNew" sorgt für eine lose Kopplung des eigentlichen "new" Aufrufs und erlaubt über das Backend für fast jede Core-Klassen eine Vererbungshierachie zu bestimmen. Genau diese Struktur kann heutzutage von einem Autoloader beeinflusst werden.

Die entsprechende Moduleinstellung wird seit Jahren von OXID so ausgewertet, dass der entsprechende Entrag im "modules"-Ordner gesucht wird. Im Backend kann für jede Datei ein Pfad und ein Klassenname eingetragen werden. Der Klassenname sollte aber gemäß Core-Logik auch dem Dateinamen entsprechen. Mit OXID 4 ist zwar ein Autoloader eingeführt worden, ist aber vom jeweiligen Integrationspartner noch nicht wirklich direkt beeinflussbar gewesen, denn es wurde ausschließlich der Standard-Autoloader deklariert.
Man musste also seit Jahren Redundanzen in saubere Kapselungen einführen.
Zum Einen hat man zur sauberen Kapselungen selbstverständlich die Dateien in Ordner gepackt. Man hatte aber - und musste natürlich sogar -  auch die Klassen so zu benennen, dass sie einzigartig waren.


```php
<?php
    // oxUtilsObject::\_makeSafeModuleClassParents( $aClassChain, $sBaseModule )
            if ( !class\_exists( $sModuleClass, false ) ) {
                $sParentClass = basename($sParent);
                //P
                //$sInitClass = "class ".$sModuleClass."\_parent extends $sParentClass { function ".$sModuleClass."\_parent(){ return ".$sParentClass."::".$sParentClass."();} }";
                $sInitClass = "class ".$sModuleClass."\_parent extends $sParentClass {}";
```


Hier tritt bereits die erste Redundanz auf, muss dann diese Redundanz aber auch noch zusätzlich im Backend von OXID spiegeln.
[Zitat von OXID](http://www.oxid-esales.com/de/news/blog/howto-extend-oxid-eshop-modules-part-1):

> 
> There we enter in the modules form field **„oxarticle => ourmodule/extendedarticlerating“** and save that entry. Now the module is registered and loaded.


Mit OXID 4.3.0 hat man sich hier deutlich geöffnet und den erweiterbaren SPL Stack eingeführt. Ab jetzt war es über die functions.php möglich einfach eigene Autoloader einzuführen und so die oben beschriebene Redundanz aufzulösen.


```php
<?php
	require\_once realpath(dirname(\_\_FILE\_\_) . '/WBL/Modules/Autoloader.php');
	$oAutoloader = new WBL\_Modules\_Autoloader();

	spl\_autoload\_register(array(
		$oAutoloader->setAutoloaderNamespaces(array('b3nl', 'WBL')),
		'includeClass'
	));
	unseT($oAutoloader);
```


Folgenden Autoloader, den ich immer für meine Freizeit-Projekte und nun für meine Firma [WBL-Konzept](http://wbl-konzept.de "WBL Konzept Beerden und Lange GbR") verwende, möchte ich euch unter der MIT Lizenz öffentlich freigeben.

```php
<?php
	/**
	 * ./modules/WBL/Modules/Autoloader.php
	 * @author blange <code@wbl-konzept.de>
	 * @category modules
	 * @package WBL\_Modules
	 * @version $id$
	 */

	if (!function\_exists('wblNew')) {
		/**
		 * Adapter um das strtolower im OXID-Kern auszugleichen.
		 * @author blange <code@wbl-konzept.de>
		 * @param string $sFullClassName Der vollqualifizierte Klassenname.
		 * @return object
		 * @throws oxSystemComponentException Falls die Klasse nicht gefunden wurde.
		 */
		function wblNew($sFullClassName) {
			if (!class\_exists($sFullClassName, false)) {
				spl\_autoload\_call($sFullClassName);
			} // if

			return call\_user\_func\_array('oxNew', func\_get\_args());
		} // function
	} // if

	/**
	 * Autoloader for module classes.
	 * @author blange <code@wbl-konzept.de>
	 * @category modules
	 * @package WBL\_Modules
	 * @version $id$
	 */
	class WBL\_Modules\_Autoloader {
		/**
		 * Die Standard-Dateiendung.
		 * @var string
		 */
		const DEFAULT\_FILE\_ENDING = '.php';

		/**
		 * Mit diesem Dateicache-Key speichert OXID im Autoloader die Pfade.
		 * @var string
		 */
		const FILE\_CACHE\_KEY = 'aWBLAutoloaderFilePaths';

		/**
		 * Lazy Loading fuer den Pfad-Cache von OXID.
		 * @var void|array
		 */
		protected $mFilePaths = null;

		/**
		 * Die moeglichen Dateiendungen einer Klassen/Interface-Datei (FIFO).
		 * @var array
		 */
		protected $aFileEndings = array();

		/**
		 * Die Namespaces die gecheckt werden sollen.
		 * @var array
		 */
		private $aNamespaces = array();

		/**
		 * Sollen die Pfade in einer Datei gecacht werden?
		 * @var bool
		 */
		protected $bWithFileCache = true;

		/**
		 * Der Basis-Ordner fuer die Includes.
		 * @var string
		 */
		protected $sBaseDir = '';

		/**
		 * Fuegt einen Eintrag zum OXID-Cache fuer die Klasssenpfade hinzu.
		 * @param  string $sClass Der vollqualifizierte Klassenname.
		 * @param  string $sPath  Der volle Klassenpfad.
		 * @return WBL\_Modules\_Autoloader
		 * @author blange <code@wbl-konzept.de>
		 */
		protected function addToFileCache($sClass, $sPath) {
			$this->mFilePaths[$sClass] = $sPath;

			if ($this->withFileCaching()) {
				oxUtils::getInstance()->toPhpFileCache(
					self::FILE\_CACHE\_KEY,
					array\_merge(
						$this->getCachedClassPaths(),
						array($sClass => $sPath)
					)
				);
			} // if

			return $this;
		} // function

		/**
		 * Returnt die Namespaces die inkludiert werden sollen.
		 * @return array
		 * @author blange <code@wbl-konzept.de>
		 */
		protected function getAutoloaderNamespaces() {
			return $this->aNamespaces;
		} // function

		/**
		 * Returnt den Basis-Ordner fuer die Includes.
		 * @author blange <code@wbl-konzept.de>
		 * @return string
		 */
		protected function getBaseDir() {
			if (!$this->sBaseDir) {
				$this->setBaseDir(realpath(DIRNAME(\_\_FILE\_\_) . '/../..') . DIRECTORY\_SEPARATOR);
			} // if

			return $this->sBaseDir;
		} // function

		/**
		 * Returnt die von OXID gecachten Dateipfade fuer Klassen.
		 * @return array
		 * @author blange <code@wbl-konzept.de>
		 */
		protected function getCachedClassPaths() {
			if ($this->mFilePaths !== null) {
				return $this->mFilePaths;
			} // if

			$this->mFilePaths = array();

			if (($this->withFileCaching()) &&
				($mTemp = oxUtils::getInstance()->fromPhpFileCache(self::FILE\_CACHE\_KEY)) &&
				(is\_array($mTemp)))
			{
				$this->mFilePaths = $mTemp;
			} // if

			return $this->mFilePaths;
		} // function

		/**
		 * Returnt die moeglichen Dateiendungen (FIFO).
		 * @return array
		 * @author b.lange <b.lange@wbl-konzept.de>
		 */
		protected function getFileEndings() {
			if (!$this->aFileEndings) {
				$this->aFileEndings[] = self::DEFAULT\_FILE\_ENDING;
			} // if

			return $this->aFileEndings;
		} // function

		/**
		 * Inkludiert die angeforderte Klasse wenn moeglich.
		 * @author blange <code@wbl-konzept.de>
		 * @param  string $sClass Der vollqualifizierte Klassenname.
		 * @return bool
		 */
		public function includeClass($sClass) {
			if (!$this->isIncludeAllowed($sClass)) {
				return false;
			} // if

			if ($this->includeClassFromCache($sClass)) {
				return true;
			} // if

			startProfile($sMethod = \_\_METHOD\_\_);
			$aEndings   = $this->getFileEndings();
			$sBaseDir   = $this->getBaseDir();
			$sClassPart = trim(str\_replace(array('\_', '\\'), DIRECTORY\_SEPARATOR, $sClass));

			/*
			 * foreach und file\_exists ist genauso schnell wie ein glob-Aufruf fuer unterschiedliche
			 * Dateienden.
			 */
			foreach ($aEndings as $sEnding) {
				if (is\_readable($sPath = $sBaseDir . $sClassPart . $sEnding)) {
					$this->addToFileCache($sClass, $sPath);
					stopProfile($sMethod);
					return (bool) require\_once $sPath;
				} // if
			} // foreach

			return false;
		} // function

		/**
		 * Liest den Pfad-Cache von OXID aus und inkludiert falls moeglich die entsprechende Datei.
		 * @param  string $sClass Der vollqualifizierte Klassenname.
		 * @return bool
		 * @author blange <code@wbl-konzept.de>
		 */
		protected function includeClassFromCache($sClass) {
			if (!$this->withFileCaching()) {
				return false;
			} // if

			if (!$aPaths = $this->getCachedClassPaths()) {
				return false;
			} // if

			return array\_key\_exists($sClass, $aPaths)
				? (bool) require\_once $aPaths[$sClass]
				: false;
		} // function

		/**
		 * Darf der Autoloader fuer diese Datei verwendete werden?
		 * @param  string $sClass Der volle Klassenname.
		 * @return bool
		 * @author blange <code@wbl-konzept.de>
		 */
		protected function isIncludeAllowed($sClass) {
			return ($aNamespaces = $this->getAutoloaderNamespaces()) &&
				// Ueberspringe *\_parent-Classes
				(strpos($sClass, '\_parent') === false) &&
				/*
				 * Ueberspringe die Klasse, wenn der Namespace nicht stimmt. Normalerweise fuehrt
				 * diese Kontrolle auch dazu, dass z.B. keine relativen Pfade erlaubt sind, auszer
				 * der Admin konfiguriert den Admin-Loader entsprechend.
				 */
				(preg\_match('/^(\\\\)?(' . implode('|', $aNamespaces) . ')(\_|\\\\)/', $sClass));
		} // function

		/**
		 * Laedt die Namespaces, die mit diesem Autoloader beachtet werden sollen.
		 * @param  array $aNames Die Namespaces die beachtet werden sollen.
		 * @return WBL\_Modules\_Autoloader
		 * @author blange <code@wbl-konzept.de>
		 */
		public function setAutoloaderNamespaces(array $aNames) {
			$this->aNamespaces = $aNames;

			return $this;
		} // function

		/**
		 * Wechselt den Basis-Ordner fuer die Includes.
		 * @author blange <code@wbl-konzept.de>
		 * @param  string $sDir Der entsprechende Ordner, Existenz wird nicht kontrolliert.
		 * @return WBL\_Modules\_Autoloader
		 */
		public function setBaseDir($sDir) {
			$this->sBaseDir = realpath($sDir) . DIRECTORY\_SEPARATOR;

			return $this;
		} // function

		/**
		 * Setzt die Dateiendungen die (FIFO) beachten werden sollen.
		 * @param  array $aEndings Die moeglichen Dateiendungen.
		 * @return WBL\_Modules\_Autoloader
		 * @author blange <code@wbl-konzept.de>
		 */
		public function setFileEndings(array $aEndings) {
			$this->aFileEndings = $aEndings;

			return $this;
		} // function

		/**
		 * Sollen die Pfade in einer Datei gecacht werden?
		 * @param  bool $bNewState Der neue Status.
		 * @return bool Der alte Status.
		 * @author blange <code@wbl-konzept.de>
		 */
		public function withFileCaching($bNewState = false) {
			$bOldState = $this->bWithFileCache;

			if (func\_num\_args()) {
				$this->bWithFileCache = $bNewState;
			} // if

			return $bOldState;
		} // function
	} // class
```

[Alternativ könnt Ihr ihn mit Unittests auch hier runterladen](http://ecommerce-developer.de/wp-content/uploads/2012/04/autoloader.rar "WBL_Modules_Autoloader als Archiv").


Unser Autoloader sucht ausgehend von "modules" Ordner im Zend Framework Stil die Interface- und Klassendateien, indem er den PHP-Namespace-Trenner "\" oder den Unterstrich "\_" nutzt um eine Ordnerhierarchie aufzubauen.

```php
<?php
		/**
		 * Inkludiert die angeforderte Klasse wenn moeglich.
		 * @author blange <b.lange@wbl-konzept.de>
		 * @param  string $sClass Der vollqualifizierte Klassenname.
		 * @return bool
		 */
		public function includeClass($sClass) {
			if (!$this->isIncludeAllowed($sClass)) {
				return false;
			} // if

			if ($this->includeClassFromCache($sClass)) {
				return true;
			} // if

			startProfile($sMethod = \_\_METHOD\_\_);
			$aEndings   = $this->getFileEndings();
			$sBaseDir   = $this->getBaseDir();
			$sClassPart = trim(str\_replace(array('\_', '\\'), DIRECTORY\_SEPARATOR, $sClass));

			/*
			 * foreach und file\_exists ist genauso schnell wie ein glob-Aufruf fuer unterschiedliche
			 * Dateienden.
			 */
			foreach ($aEndings as $sEnding) {
				if (is\_readable($sPath = $sBaseDir . $sClassPart . $sEnding)) {
					$this->addToFileCache($sClass, $sPath);
					stopProfile($sMethod);
					return (bool) require\_once $sPath;
				} // if
			} // foreach

			return false;
		} // function
```


Damit dieser Modulautoloader die OXID-Core-Logik nicht beeinflusst und wir somit möglichst Upate-Safe weil API-sicher bleiben, versucht er Klassen nur zu laden, wenn ihm mitgeteilt wird, für welche Namespaces er gilt.

Der Autoloader geht von einer Standarddateiendung ".php" aus. Jedoch hat mein Agenturalltag gezeigt, dass trotz harmonisierter Strukturen eigene, spezielle Stilmittel beibehalten werden. So findet man zum Beispiel Ordnerstrukturen, bei denen Klassendateien mit ".class.php" oder Interfaces mit "iface.php" enden. Um dies abzudecken erlaubt der Setter, dass der Autoloader auch andere Dateiendungen beachten kann.

```php
<?php
		/**
		 * Setzt die Dateiendungen die (FIFO) beachten werden sollen.
		 * @param  array $aEndings Die moeglichen Dateiendungen.
		 * @return WBL\_Modules\_Autoloader
		 * @author blange <b.lange@wbl-konzept.de>
		 */
		public function setFileEndings(array $aEndings) {
			$this->aFileEndings = $aEndings;

			return $this;
		} // function
```


Hierbei ist zu beachten,  dass die Endungen die im Array vorne stehen, auch als erstes bearbeitet werden, denn die Iteration über die Dateiendungen erfolgt mit einer foreach-Schleife. Intern hätte man dies mit einem glob-Aufruf vielleicht eleganter lösen können, aber meine Benchmarks haben gezeigt, dass dies keinen Unterschied macht.
Eigene Klassen außerhalb der Modulchain
---------------------------------------




Geht es an eigene Klassen die mit "oxNew" geladen werden sollen, scheitert dieser Autoloader. "oxNew" wandelt mit strtolower die Klassennamen intern zu Kleinbuchstaben um und deaktiviert somit das direkte Mapping von Klassennamen zu Dateinamen. Jeder folgende Autoloader-Aufruf erhält dann nur noch kleingeschriebene Klassennamen.

```php
<?php
    public function oxNew( $sClassName )
    {
        $aArgs = func\_get\_args();
        array\_shift( $aArgs );
        $iArgCnt = count( $aArgs );
        $blCacheObj = $iArgCnt < 2;
        $sClassName = strtolower( $sClassName );
```

Unser Autoloader versucht dies auszugleichen, indem er **"wblNew"** bietet. Ein einfacher Wrapper für "oxNew".

```php
<?php
	if (!function\_exists('wblNew')) {
		/**
		 * Adapter um das strtolower im OXID-Kern auszugleichen.
		 * @author blange <b.lange@wbl-konzept.de>
		 * @param string $sFullClassName Der vollqualifizierte Klassenname.
		 * @return object
		 * @throws oxSystemComponentException Falls die Klasse nicht gefunden wurde.
		 */
		function wblNew($sFullClassName) {
			if (!class\_exists($sFullClassName, false)) {
				spl\_autoload\_call($sFullClassName);
			} // if

			return call\_user\_func\_array('oxNew', func\_get\_args());
		} // function
	} // if
```


"aModuleFiles" bei OXID 4.6.0
-----------------------------




Mit OXID 4.6.0 ist ein weiterer Hook in den Autoloader eingebunden worden. Deklariert man in seiner [metadata.php eines Moduls ein "files"-Array](http://wiki.oxidforge.org/Features/Extension_metadata_file#files), werden diese Dateien vom Autoloader beachtet.

```php
'files' => array(
        'oePayPalException'                 => 'oepaypal/core/exception/oepaypalexception.php',
        'oePayPalCheckoutService'           => 'oepaypal/core/oepaypalcheckoutservice.php',
        'oePayPalLogger'                    => 'oepaypal/core/oepaypallogger.php',
        'oePayPalPortlet'                   => 'oepaypal/core/oepaypalportlet.php',
        'oePayPalDispatcher'                => 'oepaypal/views/oepaypaldispatcher.php',
        'oePayPalExpressCheckoutDispatcher' => 'oepaypal/views/oepaypalexpresscheckoutdispatcher.php',
        'oePayPalStandardDispatcher'        => 'oepaypal/views/oepaypalstandarddispatcher.php',
        'oePaypal\_EblLogger'                => 'oepaypal/core/oeebl/oepaypal\_ebllogger.php',
        'oePaypal\_EblPortlet'               => 'oepaypal/core/oeebl/oepaypal\_eblportlet.php',
        'oePaypal\_EblSoapClient'            => 'oepaypal/core/oeebl/oepaypal\_eblsoapclient.php',
    )
```


 Ich möchte diese Technik nicht einsetzen, da sie meiner Ansicht nach eine weitere Redundanz darstellt, aber eines meiner nächsten Postings wird sicher sein, wie sich dieser OXID-Autoloader im OXID 4.6.0 Kontext verhält. Ich empfehle in der neuen Moduleinstellung jetzt einmal auf  "nein" zu klicken ;). Dazu aber später mehr.
Ausblick auf nächstes Posting(**oxblocks, OXID 4.6.0)**
-------------------------------------------------------


Bis OXID 4.6.0 gab es eigentlich nur eine weitere Logik die wirklich abhängig von dem Modulordner war. Und das ist das Feature der ["oxblocks"](http://wiki.oxidforge.org/Tutorials/Customize_OXID_eShop_With_oxBlocks).  Über die Datenbanktabelle "oxtplblocks" konnten Templates überlagert werden, indem man einen Speicherort und ein Modul eines anderen Templates angegeben hat. Die einfachste Möglichkeit war dann, den entsprechenden Modulordner als Ganzes anzugeben. Nun hat sich das Verhalten in Abhängigkeit zur neuen OXID-Modulverwaltung aber etwas geändert. Dazu wie gesagt aber ein anderes Mal mehr.
UPDATE 06.05.12
---------------


[Unser Autoloader nach dem Upate auf OXID 4.6.0](http://ecommerce-developer.de/wp-content/uploads/2012/05/wbl_modules_autoloader_100.zip)
