<?php

/*
Plugin Name: Cookie Banner
Plugin URI: http://www.networkintellect.com
Description: Highly Customisable Cookie Banner Plugin Created By Peter Featherstone @ Network Intellect.
Version: 1.4
Author: Peter Featherstone
Text Domain: cookie-banner
Author URI: http://www.networkintellect.com
License: GPL2
Tags: cookies, cookie, banner, themes, cookie banner, customisable, customisable cookie banner, customizable, customizable cookie banner

    Copyright 2014  Peter Featherstone <peter.featherstone@networkintellect.com>

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
	
*/

/* ====================
   1. Initial Setup
   =================== */

/* 1.1 Include Main Class File ============= */
require_once( 'classes/class.cookieBanner.php' );

/* 1.2 Define Our Plugins Folder Constant ============= */

/* Base WP Plugins Folder */
define( 'PLUGINS_BASE', dirname( plugin_dir_path( __FILE__ ) ) );

/* 1.3 Define Our Cookie Banner Plugin Folder Constants ============= */

/* Base Plugin Path */
define( 'CB_BASE_PATH', plugin_dir_path( __FILE__ ) );

/* Base Plugin URL */
define( 'CB_BASE_URL', plugin_dir_url( __FILE__ ) );

/* Base Path for Images Folder */
define( 'CB_BASE_IMAGES_PATH', CB_BASE_PATH . 'imgs/' );

/* Base Path for Images Folder */
define( 'CB_BASE_IMAGES_URL', CB_BASE_URL . 'imgs/' );

/* Base Path for JS Folder */
define( 'CB_BASE_JS_PATH', CB_BASE_PATH . 'js/' );

/* Base URL for JS Folder */
define( 'CB_BASE_JS_URL', CB_BASE_URL . 'js/' );

/* 1.4 Define Our Cookie Banner Data Folder Constants ============= */

/* Base Data Path */
define( 'CB_DATA_PATH', PLUGINS_BASE . '/cookie-banner-data/' );

/* Base Data URL */
define( 'CB_DATA_URL', plugin_dir_url( dirname( __FILE__ ) ) . 'cookie-banner-data/' );

/* JS and CSS Data Paths */
define( 'CB_DATA_JS_PATH', CB_DATA_PATH . 'js/' );
define( 'CB_DATA_CSS_PATH', CB_DATA_PATH . 'css/' );

/* JS and CSS Data URLs */
define( 'CB_DATA_JS_URL', CB_DATA_URL . 'js/' );
define( 'CB_DATA_CSS_URL', CB_DATA_URL . 'css/' );

/* 1.5 Define Our Version Constant ============= */

/* Current Plugin Version */
define( 'CB_VER', '1.4' );

/* 1.6 Grab Plugin Options Early ============= */
$options = CookieBanner::getOptions();

/* 1.7 Make Sure We Have jQuery ============= */
add_action( 'wp_enqueue_scripts', array( 'CookieBanner', 'jQuery' ) );

/* ====================
   2. Installation
   =================== */
   
register_activation_hook( __FILE__, array( 'CookieBanner', 'install' ) );

/* ====================
   3. Admin Menu Registrations
   =================== */

add_action( 'admin_menu', array( 'CookieBanner', 'menus' ) );

/* ====================
   4. Display
   =================== */

/* 4.1 Display Cookie Banner on Site ============= */
if( !isset( $_COOKIE['cookie_banner'] ) && !is_admin() ) :

    if( isset( $options['cookieBannerExternal'] ) && $options['cookieBannerExternal'] == 'external' ) :
        
        add_action( 'wp_enqueue_scripts', array( 'CookieBanner', 'ExternalScripts' ) );
    
    else :
        
        add_action( 'wp_head', array( 'CookieBanner', 'InternalScripts' ) ); 
    
    endif;
    
    add_action( 'wp_footer', array( 'CookieBanner', 'displayBannerHtml' ) );

    wp_register_script( 'cookie-banner-cookies', CB_BASE_JS_URL . 'jquery-cookie-master/jquery.cookie.js', array( 'jquery' ) );
    wp_enqueue_script( 'cookie-banner-cookies' );

endif;

/* 4.2 Add Colour Picker to Admin Pages ============= */
if( is_admin() && $_GET['page'] == 'cookie-banner' ) :

    add_action( 'admin_enqueue_scripts', array( 'CookieBanner', 'Colorpicker' ) );
    
endif;

/* ====================
   5. Internationalise
   =================== */

/* 5.1 Set our internationalisation locations ============= */
add_action( 'plugins_loaded', array( 'CookieBanner', 'Internationalise' ) );

/* ====================
   6. Upgrade Functions
   =================== */

/* 6.1 If upgrade, check version and then create files if necessary */
if( get_option( 'cookie_banner_version' ) != CB_VER ) :
    
    if( $options['RMExternal'] ) :
        
        CookieBanner::createDataFolders();
                
        $css = CookieBanner::getCSS( true );
        $css = ResponsiveMenu::Minify( $css );
        
        CookieBanner::createCSSFile( $css );

        $js = CookieBanner::getJavascript( true );
        $js = ResponsiveMenu::Minify( $js );

        CookieBanner::createJSFile( $js );
        
    endif;
    
    /* Update option version so this doesn't get called again */
    update_option( 'cookie_banner_version', CB_VER );
    
endif;