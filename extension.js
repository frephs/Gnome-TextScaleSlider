//resources
// https://github.com/neumann-d/ShutdownTimer/blob/master/src/extension.js

//imports
const {Gio, GLib, GObject, St} = imports.gi;

// screen and main functionality
const Main = imports.ui.main;
const Clutter = imports.gi.Clutter;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;

const Me = imports.misc.extensionUtils.getCurrentExtension();

// Get running panel instance
const {panel} = imports.ui.main;


function _getGnomeSettings() {
  let GioSSS = Gio.SettingsSchemaSource;
  let schemaSource = GioSSS.new_from_directory("/usr/share/glib-2.0/schemas", GioSSS.get_default(), false);
  let schemaObj = schemaSource.lookup('org.gnome.desktop.interface', true);
  
  if (!schemaObj) {
    throw new Error('cannot find schemas');
  }
  return new Gio.Settings({ settings_schema : schemaObj });
}


function _getInitialSliderValue() {
	return gnomeSettings.get_double('text-scaling-factor').toString() 
}


function _onSliderChanged() {
	gnomeSettings.set_double('text-scaling-factor', (slider.value + 50) / 100);

    // gnomeSettings.set_int('slider-value', (slider.value));
    // const [hours, minutes] = timer.convertTime(_getTimerStartValue())
    // switcher.label.text = hours + ' ' +_("h : ") + minutes + ' min';
    
    // if (settings.get_boolean('root-mode-value')) {
    //     switcher.label.text = hours + ' ' +_("h : ") + minutes + ' min (root)'; 
    // }
}

function _createSliderItem() {
    let sliderValue =  _getInitialSliderValue()
    let sliderItem = new PopupMenu.PopupMenuItem('');
    let sliderIcon = new St.Icon({  icon_name: 'preferences-system-time-symbolic',  /*TODO: Change icons*/
                                    style_class: 'popup-menu-icon' });
    sliderItem.actor.add(sliderIcon);
    slider = new Slider.Slider(sliderValue * 100 - 50); /*TODO: check arguments */
    slider.connect('notify::value', _onSliderChanged);
    sliderItem.add_actor(slider);
    return sliderItem;
}

function render() {
    // submenu in status area menu with slider and toggle button
    let sliderItem = _createSliderItem();    
    submenu = new PopupMenu.PopupSubMenuMenuItem(_("Text Scaling Factor"), true);
    submenu.icon.icon_name = 'system-shutdown-symbolic';
    submenu.menu.addMenuItem(switcher);
    submenu.menu.addMenuItem(sliderItem);
    timer.setMenuLabel(submenu.label);

    // add separator line and submenu in status area menu
    separator = new PopupMenu.PopupSeparatorMenuItem();
    let statusMenu = Main.panel.statusArea['aggregateMenu'];
    statusMenu.menu.addMenuItem(separator);
    statusMenu.menu.addMenuItem(submenu);
}





function init() {

}

function enable() {	
    let gnomeSettings = _getGnomeSettings();
	render()
	settingsSignals.push(settings.connect('changed::slider-value', _onSettingsChanged));
    log( "my double:" + settings.get_double('text-scaling-factor').toString() );
  
}

function disable() {
	submenu.destroy(); // destroys switcher and sliderItem as children too
    separator.destroy();
	settings.set_double('text-scaling-factor', 1.0);

}

