<?php

/*
 
  Main Class for Cookie Banner Menu

  Copyright 2014 Peter Featherstone <peter.featherstone@networkintellect.com>

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License, version 2, as
  published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 
 */

class CookieBanner {
    
    protected static $error = null;
    protected static $success = null;

    static function install() {

        if( is_admin()) :

            update_option( 'cookie_banner_version', CB_VER );
        
            add_option('cookie_banner_options', array(
                
                'bannerText' => 'We use Cookies - By using this site or closing this you agree to our Cookies policy.',
                'buttonText' => 'Accept Cookies',
                'mainColour' => '#636363',
                'buttonColour' => '#727272',
                'textColour' => '#ffffff',
                'buttonTextColour' => '#ffffff',
                'buttonBorderColour' => '#3f3f3f',
                'cookieBannerHeight' => '30',
                'cookieButtonHeight' => '20',
                'buttonHoverColour' => '#939393',
                'buttonTextHoverColour' => '#ffffff',
                'buttonBorderHoverColour' => '#ffffff',
                'cookieResponsiveHeight' => '700',
                'cookieBannerPosition' => 'bottom',
                
                /* Added 1.3 */
                'cookieBannerExternal' => false,
                'cookieBannerFooter' => false,
                
                /* Added 1.4 */
                'CBFade' => 1000,
                'CBDelay' => false
                
            ) );

        endif;
        
    }
    
    function menus() {

        if ( is_admin() ) :

            add_menu_page( 
                    
                    'Cookie Banner', 
                    'Cookie Banner', 
                    'manage_options', 
                    'cookie-banner', 
                    array( 'CookieBanner', 'adminPage' ), CB_BASE_IMAGES_URL . 'icon.png'
                    
            );

        endif;
        
    }

    public function adminPage() {

        if ( is_admin() ) :

            if ( isset( $_POST[ 'cookieBannerSubmit' ] ) ) :

                self::validate();

            endif;

            $options = self::getOptions();
            
            ?>

            <script>

                jQuery(document).ready(function($) {

                    $('#cookieBannerText').on('keyup', function() {

                        $('.cookieBannerText').html($(this).val());

                    });

                    $('#cookieBannerRemove').on('keyup', function() {

                        $('.cookieBannerRemove').html($(this).val());

                    });

                    $('#cookieBannerHeight').on('keyup', function() {

                        $('.cookieBannerContainer').css('height', $(this).val() + 'px');

                        $('.cookieBannerContainer').css('lineHeight', $(this).val() + 'px');

                        $('.cookieBannerRemoveContainer').css('lineHeight', $(this).val() + 'px');

                        $('.cookieBannerRemove').css('marginTop', (((($(this).val() - $('#cookieButtonHeight').val()) - 2) / 2) - 1) + 'px');

                    });

                    $('#cookieButtonHeight').on('keyup', function() {

                        $('.cookieBannerRemove').css('height', $(this).val() + 'px');

                        $('.cookieBannerRemove').css('lineHeight', $(this).val() + 'px');

                        $('.cookieBannerRemove').css('marginTop', (((($('#cookieBannerHeight').val() - $(this).val()) - 2) / 2) - 1) + 'px');

                    });

                    $('#cookieBannerPosition').on('change', function() {

                        $('.cookieBannerContainer').css('top', 'auto');

                        $('.cookieBannerContainer').css('bottom', 'auto');

                        $('.cookieBannerContainer').css('marginTop', '');

                        $('.cookieBannerContainer').css($(this).val(), '0px');

                        if ($(this).val() == 'top') {

                            $('.cookieBannerContainer').css('marginTop', '32px');

                        }

                    });

                    function updateColours(id, val) {
                        
                        if (id == 'cookieBannerMainColour') {

                            $('.cookieBannerContainer').css('background', val);

                        } else if (id == 'cookieBannerButtonColour') {

                            $('.cookieBannerRemove').css('background', val);

                        } else if (id == 'cookieBannerMainTextColour') {

                            $('.cookieBannerText').css('color', val);

                        } else if (id == 'cookieBannerButtonTextColour') {

                            $('.cookieBannerRemove').css('color', val);

                        }

                        else if (id == 'cookieBannerButtonBorderColour') {

                            $('.cookieBannerRemove').css('borderColor', val);

                        }

                        else if (id == 'cookieBannerButtonHoverColour') {

                            $('.cookieBannerRemove').mouseenter(function() {
                                $(this).css('background', val)
                            });

                            $('.cookieBannerRemove').mouseleave(function() {
                                $(this).css('background', $('#cookieBannerButtonColour').val())
                            });

                        }

                        else if (id == 'cookieBannerButtonTextHoverColour') {

                            $('.cookieBannerRemove').mouseenter(function() {
                                $(this).css('color', val)
                            });

                            $('.cookieBannerRemove').mouseleave(function() {
                                $(this).css('color', $('#cookieBannerButtonTextColour').val())
                            });

                        }

                        else if (id == 'cookieBannerButtonBorderHoverColour') {

                            $('.cookieBannerRemove').mouseenter(function() {
                                $(this).css('borderColor', val)
                            });

                            $('.cookieBannerRemove').mouseleave(function() {
                                $(this).css('borderColor', $('#cookieBannerButtonBorderColour').val())
                            });

                        }

                    }
                    
                    colourOptions = {change: function() {
                            updateColours($(this).attr('id'), $(this).val());
                        }, };

                    $('.cookieBannerColour').wpColorPicker(colourOptions);

                });

            </script>

            <style>

                .cookieBannerInput
                {
                    width: 100% !important;
                    margin: 10px 0px !important;
                }

                .cookieBannerInputSmall
                {
                    width: 50px !important;
                }

                .cookieBannerSuccess
                {
                    margin-left: 0px !important;
                    margin-bottom: 10px !important;
                }

                .cookieBannerDescription
                {
                    font-size: 11px;
                }

                .cookieBannerContainer
                {
                    padding: 0px 5%;
                    height: <?php echo stripslashes(strip_tags($options['cookieBannerHeight'])); ?>px;
                    line-height: <?php echo stripslashes(strip_tags($options['cookieBannerHeight'])); ?>px;
                    background: <?php echo stripslashes(strip_tags($options['mainColour'])); ?>;
                    color: <?php echo stripslashes(strip_tags($options['textColour'])); ?>;
                    z-index: 9999;
                    font-size: 11px;
                    opacity: 0.8;
                    position: fixed;
                    text-align: right;
                    left: 0px;
                    right: 0px;
            <?php echo stripslashes(strip_tags($options['cookieBannerPosition'])); ?>: 0px;

            <?php
            if (stripslashes(strip_tags($options['cookieBannerPosition']) == 'top')) :

                echo "margin-top: 32px;";

            endif;
            
            ?>

                }

                .cookieBannerText
                {
                    text-align: left;
                    display: inline-block;
                    float: left;
                }

                .cookieBannerText a,
                .cookieBannerText a:link,
                .cookieBannerText a:visited,
                .cookieBannerText a:hover,
                .cookieBannerText a:active,
                .cookieBannerText a:focus
                {
                    color: <?php echo stripslashes(strip_tags($options['textColour'])); ?>;
                }        

                .cookieBannerRemoveContainer
                {
                    line-height: <?php echo stripslashes(strip_tags($options['cookieBannerHeight'])); ?>px;
                    height: <?php echo stripslashes(strip_tags($options['cookieBannerHeight'])); ?>px;
                }

                .cookieBannerRemove
                {
                    display: inline-block;
                    float: right;
                    border: 1px solid <?php echo stripslashes(strip_tags($options['buttonBorderColour'])); ?>;
                    height: <?php echo intval($options['cookieButtonHeight']); ?>px;
                    line-height: <?php echo intval($options['cookieButtonHeight']); ?>px;
                    background: <?php echo stripslashes(strip_tags($options['buttonColour'])); ?>;
                    padding: 1px 5px;
                    cursor: pointer;
                    color: <?php echo stripslashes(strip_tags($options['buttonTextColour'])); ?>;
                    margin-top: <?php echo intval(( ( $options['cookieBannerHeight'] - $options['cookieButtonHeight'] - 2 ) / 2 ) - 1); ?>px;
                }

                .cookieBannerRemove:hover
                {
                    background: <?php echo self::filterInput( $options['buttonHoverColour'] ); ?>;
                    color: <?php echo self::filterInput( $options['buttonTextHoverColour'] ); ?>;
                    border-color: <?php echo self::filterInput( $options['buttonBorderHoverColour'] ); ?>;
                }                       

                .cookieBannerRemoveResponsive
                {
                    display: none;
                    float: right;     
                    cursor: pointer;
                    color: <?php echo self::filterInput( $options['textColour'] ); ?>;
                    position: absolute;
                    top: 0px;
                    right: 5%;
                }

                table,
                table tr
                {
                    width: 100%;
                }
                
                table td
                {
                    width: 50%;
                }
                
                table.cookieBannerTriTable td
                {
                    width: 33%;
                }
                
                @media only screen and (min-width : 0px) and (max-width : 600px ) {
                
                    table,
                    table tr,
                    table td,
                    table.cookieBannerTriTable td
                    {
                        width: 100%;
                        display: block;
                    }
                
                }
                
                
                @media only screen and (min-width : 0px) and (max-width : <?php echo intval( $options['cookieResponsiveHeight'] ); ?>px ) { 
                    
                    .cookieBannerRemove
                    {
                        display: none;
                    }

                    .cookieBannerRemoveResponsive
                    {
                        display: inline-block;
                        right: 2%;
                    }

                    .cookieBannerContainer
                    {
                        padding: 0px 2%;
                    }

                    .cookieBannerText
                    {
                        font-size: 9px;
                        width: 95%;
                    }

                }
                
            </style>

            <div class="wrap">

                <h2>Cookie Banner Options</h2>
                
            <?php if ( self::$success ) : ?>

                    <div class="updated below-h2 cookieBannerSuccess" id="message"><p><?php echo self::$success; ?></p></div>
                    
            <?php elseif ( self::$error ) : ?>
                    
                    <div class="error below-h2 cookieBannerError" id="message"><p><?php echo self::$error; ?></p></div>
                    
            <?php endif; ?>

                <form method="post" action="">

                    <h3>Text Options</h3>

                    <strong>Cookie Banner Message:</strong> 

                    <div class='cookieBannerDescription'>
                        This is the main banner message displayed along the banner. &lta&gt tags are allowed for links but remember to use single quotes (') instead of double quotes (") to stop these being stripped out.
                    </div>

                    <input 
                        type="text" 
                        name="cookieBannerText" 
                        id="cookieBannerText" 
                        class="cookieBannerInput" 
                        value="<?php echo stripslashes( strip_tags( $options['bannerText'], '<a>' ) ); ?>" 
                        />

                    <strong>Remove Banner Button Text:</strong> 

                    <div class='cookieBannerDescription'>
                        This is the text that goes inside the button that can be clicked to remove the banner.
                    </div>
                    
                    <input 
                        type="text" 
                        name="cookieBannerRemove" 
                        id="cookieBannerRemove" 
                        class="cookieBannerInput" 
                        value="<?php echo self::filterInput( $options['buttonText'] ); ?>" 
                        />

                    <hr />

                    <h3>Colour Options</h3>

                    <table class="cookieBannerTriTable">
                        <tr>
                            <td>

                                <strong>Main Background Colour:</strong> 

                                <div class='cookieBannerDescription'>This is the main banner background colour.</div>                       

                                <input 
                                    type="text" 
                                    name="cookieBannerMainColour" 
                                    id="cookieBannerMainColour" 
                                    class="cookieBannerColour" 
                                    value="<?php echo self::filterInput( $options['mainColour'] ); ?>" 
                                    />

                            </td>
                            <td>  

                                <strong>Main Text Colour:</strong> 

                                <div class='cookieBannerDescription'>This is the main text colour.</div>                       

                                <input 
                                    type="text" 
                                    name="cookieBannerMainTextColour" 
                                    id="cookieBannerMainTextColour" 
                                    class="cookieBannerColour" 
                                    value="<?php echo self::filterInput( $options['textColour'] ); ?>" 
                                    />

                            </td>
                            <td></td>
                        </tr>
                        
                        <tr>
                            <td colspan='3'>
                                
                                <hr />
                                
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <h3>Button Colours</h3>
                            </td>
                            
                        </tr>
                        <tr>
                            <td>

                                <strong>Button Background Colour:</strong> 

                                <div class='cookieBannerDescription'>This is the main background colour of the button.</div>                       
                                <input 
                                    type="text" 
                                    name="cookieBannerButtonColour" 
                                    id="cookieBannerButtonColour" 
                                    class="cookieBannerColour" 
                                    value="<?php echo self::filterInput( $options['buttonColour'] ); ?>" 
                                    />
                                
                            </td>
                            <td>

                                <strong>Button Text Colour:</strong> 

                                <div class='cookieBannerDescription'>This is the button text colour.</div>                       

                                <input 
                                    type="text" 
                                    name="cookieBannerButtonTextColour" 
                                    id="cookieBannerButtonTextColour" 
                                    class="cookieBannerColour" 
                                    value="<?php echo self::filterInput( $options['buttonTextColour'] ); ?>" 
                                    />

                            </td>
                            <td>

                                <strong>Button Border Colour:</strong> 

                                <div class='cookieBannerDescription'>This is the button border colour.</div>                       

                                <input 
                                    type="text" 
                                    name="cookieBannerButtonBorderColour" 
                                    id="cookieBannerButtonBorderColour" 
                                    class="cookieBannerColour" 
                                    value="<?php echo self::filterInput( $options['buttonBorderColour'] ); ?>" 
                                    />

                            </td>
                        </tr>

                        <tr>
                            <td colspan="3">
                            <hr />
                                <h3>Button Hover Colours</h3>
                            </td>
                            
                        </tr>
                        <tr>
                            <td>

                                <strong>Button Background Hover Colour:</strong> 

                                <div class='cookieBannerDescription'>This is the button hover colour.</div>                       

                                <input 
                                    type="text" 
                                    name="cookieBannerButtonHoverColour" 
                                    id="cookieBannerButtonHoverColour" 
                                    class="cookieBannerColour" 
                                    value="<?php echo self::filterInput( $options['buttonHoverColour'] ); ?>" 
                                    />

                            </td>
                            <td>

                                <strong>Button Text Hover Colour:</strong> 

                                <div class='cookieBannerDescription'>This is the button text hover colour.</div>                       

                                <input 
                                    type="text" 
                                    name="cookieBannerButtonTextHoverColour" 
                                    id="cookieBannerButtonTextHoverColour" 
                                    class="cookieBannerColour" 
                                    value="<?php echo self::filterInput( $options['buttonTextHoverColour'] ); ?>" 
                                    />

                            </td>
                            <td>

                                <strong>Button Border Hover Colour:</strong> 

                                <div class='cookieBannerDescription'>This is the button border hover colour.</div>                       

                                <input 
                                    type="text" 
                                    name="cookieBannerButtonBorderHoverColour" 
                                    id="cookieBannerButtonBorderHoverColour" 
                                    class="cookieBannerColour" 
                                    value="<?php echo self::filterInput( $options['buttonBorderHoverColour'] ); ?>" 
                                    />

                            </td>
                        </tr>

                    </table>

                    <hr />

                    <h3>Style Options</h3>

                    <table>
                    
                        <tr>
                            <td><strong>Banner Height:</strong> 

                    <div class='cookieBannerDescription'>This is the total banner height in pixels, enter only a number.</div>                       
                    <input 
                        type="text" 
                        name="cookieBannerHeight" 
                        id="cookieBannerHeight" 
                        class="cookieBannerInputSmall" 
                        value="<?php echo intval( $options['cookieBannerHeight'] ); ?>" 
                        /> px</td>
                            <td><strong>Button Height:</strong> 

                    <div class='cookieBannerDescription'>This is the total button height in pixels.</div>                       
                    <input 
                        type="text" 
                        name="cookieButtonHeight" 
                        id="cookieButtonHeight" 
                        class="cookieBannerInputSmall" 
                        value="<?php echo intval( $options['cookieButtonHeight'] ); ?>" 
                        /> px</td>
                        </tr>
                    
                        <tr>
                            <td><strong>Responsive Width Break Point:</strong> 

                    <div class='cookieBannerDescription'>
                        This is the window width in pixels at which the button is removed.<br />
                        It is replaced with an x and the font size is reduced.
                    </div>

                    <input 
                        type="text" 
                        name="cookieResponsiveHeight" 
                        id="cookieResponsiveHeight" 
                        class="cookieBannerInputSmall" 
                        value="<?php echo intval( $options['cookieResponsiveHeight'] ); ?>" 
                        /> px</td>
                            <td><strong>Banner Position:</strong> 

                    <div class='cookieBannerDescription'>This is where the banner will be displayed on the site.</div>

                    <select 
                        name="cookieBannerPosition" 
                        id="cookieBannerPosition" 
                        class="cookieBannerSelect" 
                        >

                        <option <?php echo $options['cookieBannerPosition'] == 'top' ? "selected='selected' " : ""; ?>value='top'>Top</option>
                        <option <?php echo $options['cookieBannerPosition'] == 'bottom' ? "selected='selected' " : ""; ?>value='bottom'>Bottom</option>

                    </select></td>
                        </tr>
                        
                    </table>

                    <hr />

                    <h3><?php _e( 'Animation Options', 'cookie-banner' ); ?></h3>
                    
                    <table>
                        <tr>
                            <td>
                                
                                                    <strong>Fade Out Delay:</strong> 

                    <div class='cookieBannerDescription'>
                        This is the delay in seconds that it will take for the banner to fade out. <br />
                        Leave as 0 or empty for it to not fade out.
                    </div>

                    <input 
                        type="text" 
                        name="CBDelay" 
                        id="CBDelay" 
                        class="cookieBannerInputSmall" 
                        value="<?php echo floatval( $options['CBDelay'] ); ?>" 
                        /> seconds
                    
                            </td>
                            <td>
                                
                                                    <strong>Fade Out Time:</strong> 

                    <div class='cookieBannerDescription'>
                        This is the time in seconds that it will take for the banner to fade out.
                    </div>

                    <input 
                        type="text" 
                        name="CBFade" 
                        id="CBFade" 
                        class="cookieBannerInputSmall" 
                        value="<?php echo floatval( $options['CBFade'] ); ?>" 
                        /> seconds
                    
                            </td>
                        </tr>
                        
                    </table>
                    
                    <hr />

                    <h3><?php _e( 'Format Options', 'cookie-banner' ); ?></h3>
                    
                    <table>
                        <tr>
                            <td>
                                <strong><?php _e( 'Include CSS/JS as external files', 'cookie-banner' ); ?></strong> 

                    <div class='cookieBannerDescription'><?php _e( 'Tick if you would like to include CSS and jQuery as external files', 'cookie-banner' ); ?></div>

                        <input 
                            type="checkbox" 
                            name="cookieBannerExternal" 
                            id="cookieBannerExternal"
                            value="external"
                            <?php echo isset( $options['cookieBannerExternal'] ) && $options['cookieBannerExternal'] == 'external' ? ' checked="checked" ' : ''; ?>
                            />
                            </td>
                            <td>
                                <strong><?php _e( 'Include JS files in footer?', 'cookie-banner' ); ?></strong> 

                    <div class='cookieBannerDescription'><?php _e( 'Tick if you would like to include the JS script in footer', 'cookie-banner' ); ?></div>

                        <input 
                            type="checkbox" 
                            name="cookieBannerFooter" 
                            id="cookieBannerFooter"
                            value="footer"
                            <?php echo isset( $options['cookieBannerFooter'] ) && $options['cookieBannerFooter'] == 'footer' ? ' checked="checked" ' : ''; ?>
                            />
                            </td>
                        </tr>
                    </table>

                    <hr />
                        
                    <br />

                    <input 
                        type="submit" 
                        name="cookieBannerSubmit" 
                        id="cookieBannerSubmit" 
                        class="cookieBannerSubmit button button-primary" 
                        value="Update Options" 
                        />
                        
                </form>

                <br />

                <h2>Banner Preview</h2>

                <strong>You can see a preview of your banner and how it will be displayed on the front end based on your settings on this page.</strong>

                <br /><br />

                <div class='cookieBannerContainer'>

                    <div class='cookieBannerText'><?php echo stripslashes( strip_tags( $options['bannerText'], '<a>' ) ); ?></div>

                    <div class='cookieBannerRemoveContainer'>

                        <div class='cookieBannerRemove'><?php echo self::filterInput( $options['buttonText'] ); ?></div>

                        <div class='cookieBannerRemoveResponsive'>x</div>

                    </div>

                </div>

            </div>

            <?php
            
        endif;
        
    }

    private static function validate() {

        if( is_admin() ) :

            if( isset( $_POST['cookieBannerText'] ) && isset( $_POST['cookieBannerRemove'] ) ) :

                update_option( 'cookie_banner_options', array(
                    
                    'bannerText' => stripslashes(strip_tags( $_POST['cookieBannerText'], '<a>')),
                    'buttonText' => self::filterInput( $_POST['cookieBannerRemove'] ),
                    'mainColour' => self::filterInput( $_POST['cookieBannerMainColour'] ),
                    'buttonColour' => self::filterInput( $_POST['cookieBannerButtonColour'] ),
                    'textColour' => self::filterInput( $_POST['cookieBannerMainTextColour'] ),
                    'buttonTextColour' => self::filterInput( $_POST['cookieBannerButtonTextColour'] ),
                    'buttonBorderColour' => self::filterInput( $_POST['cookieBannerButtonBorderColour'] ),
                    'cookieBannerHeight' => intval( $_POST['cookieBannerHeight'] ),
                    'cookieButtonHeight' => intval( $_POST['cookieButtonHeight'] ),
                    'buttonHoverColour' => self::filterInput( $_POST['cookieBannerButtonHoverColour'] ),
                    'buttonTextHoverColour' => self::filterInput( $_POST['cookieBannerButtonTextHoverColour'] ),
                    'cookieResponsiveHeight' => intval( $_POST['cookieResponsiveHeight'] ),
                    'cookieBannerPosition' => self::filterInput( $_POST['cookieBannerPosition'] ),
                    'buttonBorderHoverColour' => self::filterInput( $_POST['cookieBannerButtonBorderHoverColour'] ),
                    
                    /* Added 1.3 */
                    'cookieBannerExternal' => self::filterInput( $_POST['cookieBannerExternal'] ),
                    'cookieBannerFooter' => self::filterInput( $_POST['cookieBannerFooter'] ),
                    
                    /* Added 1.4 */
                    'CBFade' => floatval( $_POST['CBFade'] ),
                    'CBDelay' => floatval( $_POST['CBDelay'] )
                    
                 ) );

            /* Create Css & JS Files If Required */
            if( $_POST['cookieBannerExternal'] == 'external' ) :
                
                self::createDataFolders();
            
                $css = self::getCSS( true );             
                $css = self::Minify( $css );
                $cssFile = self::createCSSFile( $css );
                
                $js = self::getJavascript( true );
                $js = self::Minify( $js );
                $jsFile = self::createJSFile( $js );
                
                if( $cssFile === false || $jsFile === false ) :
                    
                    return self::$error = 'There was a problem writing the CSS and JS files, please check the WP plugins folder/file permissions';
                
                else :
                    
                    return self::$success = 'Your Cookie Banner Options and CSS/JS files have been updated successfully';
                
                endif;
                
            else :
            
                return self::$success = 'Your Cookie Banner Options have been updated';
            
            endif;
            
                return self::$success = 'Your Cookie Banner Options have been updated';

            else :
                
                return self::$error = 'There was a problem saving your Cookie Banner settings';

            endif;

        endif;
        
    }

    static function getJavaScript( $external = false ) {
     
        $js = null;
        $fadeOut = null;
        $options = self::getOptions();
        $fadeTime = $options['CBFade'] ? $options['CBFade'] * 1000 : 1000;
        
        if( !$external ) : 
            
            $js .= '<script>';
        
        endif;
                
        if( $options['CBDelay'] ) :
            
            $delayTime = $options['CBDelay'] * 1000;
        
            $fadeOut = "setTimeout( function() { fadeOutCookieBanner( setCookieBannerCookie() ); }, $delayTime );";

        endif;
        
        $js .= "
            
            jQuery( document ).ready( function( $ ) {

                function fadeOutCookieBanner( callback ) {

                    $( '.cookieBannerContainer' ).fadeOut( $fadeTime, function() { callback } );

                }

                function setCookieBannerCookie() {
                
                    $.cookie( 'cookie_banner', false, { expires: 31, path: '/' } ); 
                    
                }

                $( '.cookieBannerRemove, .cookieBannerRemoveResponsive' ).on( 'click', function() {

                    fadeOutCookieBanner( setCookieBannerCookie() );
                    
                });

                $fadeOut

            });
            
        ";

        if( !$external ) : 
            
            $js .= '</script>';
        
        endif;
        
        return $js;
        
    }
    
    static function getCSS( $external = false) {
        
        $options = self::getOptions();
        $css = null;
        
        /* Get Specific Options */
        $marginTop = intval( ( ( $options['cookieBannerHeight'] - $options['cookieButtonHeight'] - 2 ) / 2 ) - 1);
        
        if( !$external ) : 
            
            $css .= '<style>';
        
        endif;

        
        $css .= "
            
            .cookieBannerContainer
            {
                padding: 0px 5%;
                position: fixed;
                {$options['cookieBannerPosition']}: 0px;
                height: {$options['cookieBannerHeight']}px;
                line-height: {$options['cookieBannerHeight']}px;
                background: {$options['mainColour']};
                color: {$options['textColour']};
                z-index: 9999;
                font-size: 11px;
                opacity: 0.8;
                text-align: right;
                left: 0px;
                right: 0px;
            }

            .cookieBannerText
            {
                text-align: left;
                display: inline-block;
                float: left;
            }

            .cookieBannerText a,
            .cookieBannerText a:link,
            .cookieBannerText a:visited,
            .cookieBannerText a:hover,
            .cookieBannerText a:active,
            .cookieBannerText a:focus
            {
                color: {$options['textColour']};
            }  

            .cookieBannerRemove
            {
                display: inline-block;
                float: right;
                border: 1px solid {$options['buttonBorderColour']};
                height: {$options['cookieButtonHeight']}px;
                line-height: {$options['cookieButtonHeight']}px;
                background: {$options['buttonColour']};
                padding: 1px 5px;
                cursor: pointer;
                color: {$options['buttonTextColour']};
                margin-top: {$marginTop}px;
            }

            .cookieBannerRemove:hover
            {
                background: {$options['buttonHoverColour']};
                color: {$options['buttonTextHoverColour']};
                border-color: {$options['buttonBorderHoverColour']};
            }

            .cookieBannerRemoveContainer
            {
                line-height: {$options['cookieBannerHeight']}px;
                height: {$options['cookieBannerHeight']}px;
            }

            .cookieBannerRemoveResponsive
            {
                display: none;
                float: right;     
                cursor: pointer;
                color: {$options['textColour']};
                position: absolute;
                top: 0px;
                right: 5%;
            }

            @media only screen and (min-width : 0px) and ( max-width : {$options['cookieResponsiveHeight']}px ) { 

                .cookieBannerRemove
                {
                    display: none;
                }

                .cookieBannerRemoveResponsive
                {
                    display: inline-block;
                    right: 2%;
                }

                .cookieBannerContainer
                {
                    padding: 0px 2%;
                }

                .cookieBannerText
                {
                    font-size: 9px;
                    width: 95%;
                }

            }";
        
        if( !$external ) : 
            
            $css .= '</style>';
        
        endif;
        
        return $css;
        
    }
    
    public static function displayBannerHtml() {

        $options = self::getOptions();

        if ( !isset( $_COOKIE['cookie_banner'] ) ) : ?>

            <div class='cookieBannerContainer'>

                <div class='cookieBannerText'><?php echo stripslashes( strip_tags( $options['bannerText'], '<a>' ) ); ?></div>

                <div class='cookieBannerRemoveContainer'>

                    <div class='cookieBannerRemove'><?php echo self::filterInput( $options['buttonText'] ); ?></div>

                    <div class='cookieBannerRemoveResponsive'>x</div>

                </div>

            </div>

        <?php endif;
        
    }
    
    public static function ExternalScripts() {
    
        $options = self::getOptions();
        
        $inFooter = isset( $options['cookieBannerFooter'] ) && $options[ 'cookieBannerFooter' ] == 'footer' ? true : false;
        
        wp_enqueue_style( 'cookie-banner', CB_DATA_CSS_URL . 'cookie-banner-' . get_current_blog_id() . '.css', array(), '1.0', 'all' );
        wp_enqueue_script( 'cookie-banner', CB_DATA_JS_URL . 'cookie-banner-' . get_current_blog_id() . '.js', 'jquery', '1.0', $inFooter );
        
    }
    
    public static function InternalScripts() {
            
        echo self::getJavascript();
        echo self::getCSS();
        
    }
    
    private static function filterInput( $input ) {

        return stripslashes( strip_tags( trim( $input ) ) );
        
    }
    
    public static function getOptions() {
        
        $options = !is_array( get_option( 'cookie_banner_options' ) ) ? unserialize( get_option( 'cookie_banner_options' ) ) :  get_option( 'cookie_banner_options' );

        return $options;
        
    }

    public static function Internationalise() {
    
        load_plugin_textdomain( 'cookie-banner', false, CB_BASE_PATH . '/translations/' );

    }
    
    public static function jQuery() { 
    
        wp_enqueue_script( 'jquery' );
  
    }
    
    public static function ColorPicker() {
        
        wp_enqueue_style( 'wp-color-picker' );
        wp_enqueue_script( 'wp-color-picker' );
    
    }
    
    /* Added 1.4 *
     * Function to minify outputted JavaScript and CSS Files
     * Parts taken from
     * http://castlesblog.com/2010/august/14/php-javascript-css-minification
     * @param string $input
     * @param string $type [css, js]
     */
    
    static function Minify( $input ) {

        /* remove comments */
        $output = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $input);
        /* remove tabs, spaces, newlines, etc. */
        $output = str_replace(array("\r\n","\r","\n","\t",'  ','    ','     '), '', $output);
        /* remove other spaces before/after ; */
        $output = preg_replace(array('(( )+{)','({( )+)'), '{', $output);
        $output = preg_replace(array('(( )+})','(}( )+)','(;( )*})'), '}', $output);
        $output = preg_replace(array('(;( )+)','(( )+;)'), ';', $output);

        return $output;
        
    }
    
    /* Added 1.4 */
    static function createDataFolders() {
        
        if( !file_exists( CB_DATA_PATH ) ) mkdir( CB_DATA_PATH, 0777 );
        if( !file_exists( CB_DATA_CSS_PATH ) ) mkdir( CB_DATA_CSS_PATH, 0777 );
        if( !file_exists( CB_DATA_JS_PATH ) ) mkdir( CB_DATA_JS_PATH, 0777 ); 
                
    }
    
    /* Added 1.4 */
    static function createCSSFile( $css ) {
        
        $file = fopen( CB_DATA_CSS_PATH . 'cookie-banner-' . get_current_blog_id() . '.css', 'w' );
        $cssFile = fwrite( $file, $css );
        fclose( $file );
        
        return $cssFile;
        
    }
    
    /* Added 1.4 */
    static function createJSFile( $js ) {

        $file = fopen( CB_DATA_JS_PATH . 'cookie-banner-' . get_current_blog_id() . '.js', 'w' );
        $jsFile = fwrite( $file, $js  );
        fclose( $file );
        
        return $jsFile;
        
    }
    
}
