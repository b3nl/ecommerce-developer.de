---
title: 'Problem mit OXID-Warenkorb-Modulen und dem WBL_Autoloader gefixt'
description: 'Es gibt bei OXID zwei mögliche Arten eine Klasse samt deren Module zu laden: Direkt über oxNew() oder über den Autoloader wenn man z.B. Klassenkonstanten aufruft oder "Modul-Erstellungstricks" anwende...'
pubDatetime: 2012-07-25T17:42:19+02:00
tags:
  - oxid
  - autoloaders
  - sessions
  - debugging
---

Es gibt bei OXID zwei mögliche Arten eine Klasse samt deren Module zu laden: Direkt über **oxNew()** oder über den Autoloader wenn man z.B. Klassenkonstanten aufruft oder "Modul-Erstellungstricks" anwendet. Also beispielsweise
* einen neuen Backend-View anlegen
* diesen View von ***\_parent** erben lassen - obwohl der Backend-View kein Modul sondern eine Ursprungsklasse ist ...
* dafür dann in der Moduleinstellung aber z.B. **oxadminview** für diesen neuen View angeben

= und OXID einfach dynamisch den neuen Backend-View von **oxAdminView** erben lassen.

Und ein weiteres Beispiel sollte nicht unerwähnt bleiben, **nämlich das Laden von Objekten, die (in der Session) serialisiert wurden,** welches beim Autoloader Probleme macht.Ist der Quellcode vor dem jeweiligen [session\_start](http://php.net/session_start)- oder [unserialize](http://php.net/unserialize) - Aufruf noch nicht vorhanden, so wird PHP eine Instanz von Typ **\_\_PHP\_Incomplete\_Class** erzeugen. Genau dieser Umstand in leicht abgewandelter Form tritt auf manchen Systemen mit meinem Autoloader auf.

Die [Session-Klasse](http://svn.oxid-esales.com/tags/CE-4.6.2-46646/eshop/core/oxsession.php) versucht in **oxSession::getBasket()** aktuell das Warenkorb zuerst über den Autoloader zu laden:

```php
    public function getBasket()
    {
        if ( $this->\_oBasket === null ) {
            $sBasket = self::getVar( $this->\_getBasketName() );

            //init oxbasketitem class first
            //#1746
            oxNew('oxbasketitem');

            $oBasket = ( $sBasket && ( $oBasket = unserialize( $sBasket ) ) ) ? $oBasket : null;

            //#3908
            $oEmptyBasket = oxNew('oxbasket');
            if ( !$oBasket || ( get\_class($oBasket) !== get\_class($oEmptyBasket) ) ) {
                $oBasket = $oEmptyBasket;
            }
```

Habt Ihr jetzt über meinen Autoloader ein Warenkorb-Objekt in der Session serialisiert, blubbert dieser Aufruf zuerst in den [WBL\_Autoloader](http://ecommerce-developer.de/wbl-autoloader-und-oxid-4-6-0/ "WBL Autoloader und OXID 4.6.0"). Der Autoloader reicht den Versuch die *\_parent-Klasse zu laden dann an den OXID-Autoloader **oxAutoload** weiter. Dieser versucht dann die gesamte Modulchain aufzubauen, aber das kann er ohne den WBL\_Autoloader leider nicht:

```php
    private function \_makeSafeModuleClassParents( $aClassChain, $sBaseModule )
    {
                // ... 

                //including original file
                if ( file\_exists( $sParentPath ) ) {
                    include\_once $sParentPath;
                } elseif ( !class\_exists( $sModuleClass ) ) {
```

**Der hier markierte class\_exists-Aufruf ist abhängig vom WBL\_Autoloader und blubbert leider auf manchen System nicht wieder zu ihm hoch, denn dies ist ein verschachtelter Aufruf.**Das entsprechende Warenkorb-Objekt gilt ab dem Moment als deaktiv und wird nicht mehr vom System genutzt.

Daher musste leider ein weiterer Core-Fix hinzu, der nichts weiter macht, als über oxNew() die Logik kontrolliert zu laden. Der Fix ist auf [Github](https://github.com/WBL-BjoernLange/WBL_Modules_Autoloader) entsprechend eingecheckt.

```php
	require\_once realpath(dirname(\_\_FILE\_\_) . '/WBL/Modules/Autoloader.php');
	$oAutoloader = new WBL\_Modules\_Autoloader();

	spl\_autoload\_register(array(
		$oAutoloader
			->addCoreOverride('oxsession',     'WBL\_Modules\_Session')
			->addCoreOverride('oxutilsobject', 'WBL\_Modules\_UtilsObject')
			->setAutoloaderNamespaces(array('RS', 'WBL')),
		'includeClass'
	));
	unset($oAutoloader);
```
Sry für dieses Problem. Es ist einfach ein Seiteneffekt, der kaum auffällt und bei üblichen Modularbeiten nicht auftritt.
