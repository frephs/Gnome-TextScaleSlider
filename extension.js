const {Gio, GLib, GObject, St} = imports.gi;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;

const Me = imports.misc.extensionUtils.getCurrentExtension();

// Get running panel instance
const {panel} = imports.ui.main;


function getSettings() {
  let GioSSS = Gio.SettingsSchemaSource;
  let schemaSource = GioSSS.new_from_directory(
    "/usr/share/glib-2.0/schemas",
    GioSSS.get_default(),
    false
  );
  let schemaObj = schemaSource.lookup(
    'org.gnome.desktop.interface', true);
  if (!schemaObj) {
    throw new Error('cannot find schemas');
  }
  return new Gio.Settings({ settings_schema : schemaObj });
}

function init() {

  let settings = getSettings();
  

}

function enable() {	
    let settings = getSettings();
    settings.set_double('text-scaling-factor', 1.2);
    log( "my double:" + settings.get_double('text-scaling-factor').toString() );
  
}

function disable() {
    let settings = getSettings();
    settings.set_double('text-scaling-factor', 1.0);

}


