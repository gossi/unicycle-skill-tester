/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/**
 * Contains some common methods available to all log appenders.
 */
qx.Class.define("qx.log.appender.Util",
{
  statics :
  {
    /**
     * Converts a single log entry to HTML
     *
     * @signature function(entry)
     * @param entry {Map} The entry to process
     */
    toHtml : function(entry)
    {
      var output = [];
      var item, msg, sub, list;

      output.push("<span class='offset'>", this.formatOffset(entry.offset, 6), "</span> ");

      if (entry.object)
      {
        var obj = entry.win.qx.core.ObjectRegistry.fromHashCode(entry.object);
        if (obj) {
          output.push("<span class='object' title='Object instance with hash code: " + obj.$$hash + "'>", obj.classname, "[" , obj.$$hash, "]</span>: ");
        }
      }
      else if (entry.clazz)
      {
        output.push("<span class='object'>" + entry.clazz.classname, "</span>: ");
      }

      var items = entry.items;
      for (var i=0, il=items.length; i<il; i++)
      {
        item = items[i];
        msg = item.text;

        if (msg instanceof Array)
        {
          var list = [];

          for (var j=0, jl=msg.length; j<jl; j++)
          {
            sub = msg[j];
            if (typeof sub === "string") {
              list.push("<span>" + this.escapeHTML(sub) + "</span>");
            } else if (sub.key) {
              list.push("<span class='type-key'>" + sub.key + "</span>:<span class='type-" + sub.type + "'>" + this.escapeHTML(sub.text) + "</span>");
            } else {
              list.push("<span class='type-" + sub.type + "'>" + this.escapeHTML(sub.text) + "</span>");
            }
          }

          output.push("<span class='type-" + item.type + "'>");

          if (item.type === "map") {
            output.push("{", list.join(", "), "}");
          } else {
            output.push("[", list.join(", "), "]");
          }

          output.push("</span>");
        }
        else
        {
          output.push("<span class='type-" + item.type + "'>" + this.escapeHTML(msg) + "</span> ");
        }
      }

      var wrapper = document.createElement("DIV");
      wrapper.innerHTML = output.join("");
      wrapper.className = "level-" + entry.level;

      return wrapper;
    },


    /**
     * Formats a numeric time offset to 6 characters.
     *
     * @param offset {Integer} Current offset value
     * @param length {Integer?6} Refine the length
     * @return {String} Padded string
     */
    formatOffset : function(offset, length)
    {
      var str = offset.toString();
      var diff = (length||6) - str.length;
      var pad = "";

      for (var i=0; i<diff; i++) {
        pad += "0";
      }

      return pad+str;
    },


    /**
     * Escapes the HTML in the given value
     *
     * @param value {String} value to escape
     * @return {String} escaped value
     */
    escapeHTML : function(value) {
      return String(value).replace(/[<>&"']/g, this.__escapeHTMLReplace);
    },


    /**
     * Internal replacement helper for HTML escape.
     *
     * @param ch {String} Single item to replace.
     * @return {String} Replaced item
     */
    __escapeHTMLReplace : function(ch)
    {
      var map =
      {
        "<" : "&lt;",
        ">" : "&gt;",
        "&" : "&amp;",
        "'" : "&#39;",
        '"' : "&quot;"
      };

      return map[ch] || "?";
    },


    /**
     * Converts a single log entry to plain text
     *
     * @param entry {Map} The entry to process
     * @return {String} the formatted log entry
     */
    toText : function(entry) {
      return this.toTextArray(entry).join(" ");
    },


    /**
     * Converts a single log entry to an array of plain text
     *
     * @param entry {Map} The entry to process
     * @return {Array} Argument list ready message array.
     */
    toTextArray : function(entry)
    {
      var output = [];

      output.push(this.formatOffset(entry.offset, 6));

      if (entry.object)
      {
        var obj = entry.win.qx.core.ObjectRegistry.fromHashCode(entry.object);
        if (obj) {
          output.push(obj.classname + "[" + obj.$$hash + "]:");
        }
      }
      else if (entry.clazz) {
        output.push(entry.clazz.classname + ":");
      }

      var items = entry.items;
      var item, msg;
      for (var i=0, il=items.length; i<il; i++)
      {
        item = items[i];
        msg = item.text;

        if (item.trace && item.trace.length > 0) {
          if (typeof(this.FORMAT_STACK) == "function") {
            qx.log.Logger.deprecatedConstantWarning(qx.log.appender.Util,
              "FORMAT_STACK",
              "Use qx.dev.StackTrace.FORMAT_STACKTRACE instead");
            msg += "\n" + this.FORMAT_STACK(item.trace);
          } else {
            msg += "\n" + item.trace;
          }
        }

        if (msg instanceof Array)
        {
          var list = [];
          for (var j=0, jl=msg.length; j<jl; j++) {
            list.push(msg[j].text);
          }

          if (item.type === "map") {
            output.push("{", list.join(", "), "}");
          } else {
            output.push("[", list.join(", "), "]");
          }
        }
        else
        {
          output.push(msg);
        }
      }

      return output;
    }
  }
});/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/* ************************************************************************

#require(qx.log.appender.Util)
#require(qx.bom.client.Html)  -- defer calls Logger.register which calls
                                 Native.process which needs "html.console"
                                 implementation

************************************************************************ */

/**
 * Processes the incoming log entry and displays it by means of the native
 * logging capabilities of the client.
 *
 * Supported browsers:
 * * Firefox <4 using FireBug (if available).
 * * Firefox >=4 using the Web Console.
 * * WebKit browsers using the Web Inspector/Developer Tools.
 * * Internet Explorer 8+ using the F12 Developer Tools.
 * * Opera >=10.60 using either the Error Console or Dragonfly
 *
 * Currently unsupported browsers:
 * * Opera <10.60
 */
qx.Class.define("qx.log.appender.Native",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Processes a single log entry
     *
     * @param entry {Map} The entry to process
     */
    process : function(entry)
    {
      if (qx.core.Environment.get("html.console")) {
        // Firefox 4's Web Console doesn't support "debug"
        var level = console[entry.level] ? entry.level : "log";
        if (console[level]) {
          var args = qx.log.appender.Util.toText(entry);
          console[level](args);
        }
      }
    }
  },




  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.log.Logger.register(statics);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Utilities for working with character codes and key identifiers
 */
qx.Bootstrap.define("qx.event.util.Keyboard", {

  statics :
  {
    /*
    ---------------------------------------------------------------------------
      KEY MAPS
    ---------------------------------------------------------------------------
    */

    /**
     * {Map} maps the charcodes of special printable keys to key identifiers
     *
     * @lint ignoreReferenceField(specialCharCodeMap)
     */
    specialCharCodeMap :
    {
      8  : "Backspace",   // The Backspace (Back) key.
      9  : "Tab",         // The Horizontal Tabulation (Tab) key.

      //   Note: This key identifier is also used for the
      //   Return (Macintosh numpad) key.
      13 : "Enter",       // The Enter key.
      27 : "Escape",      // The Escape (Esc) key.
      32 : "Space"        // The Space (Spacebar) key.
    },

    /**
     * {Map} maps the keycodes of the numpad keys to the right charcodes
     *
     * @lint ignoreReferenceField(numpadToCharCode)
     */
    numpadToCharCode :
    {
       96 : "0".charCodeAt(0),
       97 : "1".charCodeAt(0),
       98 : "2".charCodeAt(0),
       99 : "3".charCodeAt(0),
      100 : "4".charCodeAt(0),
      101 : "5".charCodeAt(0),
      102 : "6".charCodeAt(0),
      103 : "7".charCodeAt(0),
      104 : "8".charCodeAt(0),
      105 : "9".charCodeAt(0),
      106 : "*".charCodeAt(0),
      107 : "+".charCodeAt(0),
      109 : "-".charCodeAt(0),
      110 : ",".charCodeAt(0),
      111 : "/".charCodeAt(0)
    },

    /**
     * {Map} maps the keycodes of non printable keys to key identifiers
     *
     * @lint ignoreReferenceField(keyCodeToIdentifierMap)
     */
    keyCodeToIdentifierMap :
    {
       16 : "Shift",        // The Shift key.
       17 : "Control",      // The Control (Ctrl) key.
       18 : "Alt",          // The Alt (Menu) key.
       20 : "CapsLock",     // The CapsLock key
      224 : "Meta",         // The Meta key. (Apple Meta and Windows key)

       37 : "Left",         // The Left Arrow key.
       38 : "Up",           // The Up Arrow key.
       39 : "Right",        // The Right Arrow key.
       40 : "Down",         // The Down Arrow key.

       33 : "PageUp",       // The Page Up key.
       34 : "PageDown",     // The Page Down (Next) key.

       35 : "End",          // The End key.
       36 : "Home",         // The Home key.

       45 : "Insert",       // The Insert (Ins) key. (Does not fire in Opera/Win)
       46 : "Delete",       // The Delete (Del) Key.

      112 : "F1",           // The F1 key.
      113 : "F2",           // The F2 key.
      114 : "F3",           // The F3 key.
      115 : "F4",           // The F4 key.
      116 : "F5",           // The F5 key.
      117 : "F6",           // The F6 key.
      118 : "F7",           // The F7 key.
      119 : "F8",           // The F8 key.
      120 : "F9",           // The F9 key.
      121 : "F10",          // The F10 key.
      122 : "F11",          // The F11 key.
      123 : "F12",          // The F12 key.

      144 : "NumLock",      // The Num Lock key.
       44 : "PrintScreen",  // The Print Screen (PrintScrn, SnapShot) key.
      145 : "Scroll",       // The scroll lock key
       19 : "Pause",        // The pause/break key
       // The left Windows Logo key or left cmd key
       91 : qx.core.Environment.get("os.name") == "osx" ? "cmd" : "Win",
       92 : "Win",          // The right Windows Logo key or left cmd key
       // The Application key (Windows Context Menu) or right cmd key
       93 : qx.core.Environment.get("os.name") == "osx" ? "cmd" : "Apps"
    },


    /** char code for capital A */
    charCodeA : "A".charCodeAt(0),
    /** char code for capital Z */
    charCodeZ : "Z".charCodeAt(0),
    /** char code for 0 */
    charCode0 : "0".charCodeAt(0),
    /** char code for 9 */
    charCode9 : "9".charCodeAt(0),

    /**
     * converts a keyboard code to the corresponding identifier
     *
     * @param keyCode {Integer} key code
     * @return {String} key identifier
     */
    keyCodeToIdentifier : function(keyCode)
    {
      if (this.isIdentifiableKeyCode(keyCode))
      {
        var numPadKeyCode = this.numpadToCharCode[keyCode];

        if (numPadKeyCode) {
          return String.fromCharCode(numPadKeyCode);
        }

        return (this.keyCodeToIdentifierMap[keyCode] || this.specialCharCodeMap[keyCode] || String.fromCharCode(keyCode));
      }
      else
      {
        return "Unidentified";
      }
    },


    /**
     * converts a character code to the corresponding identifier
     *
     * @param charCode {String} character code
     * @return {String} key identifier
     */
    charCodeToIdentifier : function(charCode) {
      return this.specialCharCodeMap[charCode] || String.fromCharCode(charCode).toUpperCase();
    },


    /**
     * Check whether the keycode can be reliably detected in keyup/keydown events
     *
     * @param keyCode {String} key code to check.
     * @return {Boolean} Whether the keycode can be reliably detected in keyup/keydown events.
     */
    isIdentifiableKeyCode : function(keyCode)
    {
      // A-Z (TODO: is this lower or uppercase?)
      if (keyCode >= this.charCodeA && keyCode <= this.charCodeZ) {
        return true;
      }

      // 0-9
      if (keyCode >= this.charCode0 && keyCode <= this.charCode9) {
        return true;
      }

      // Enter, Space, Tab, Backspace
      if (this.specialCharCodeMap[keyCode]) {
        return true;
      }

      // Numpad
      if (this.numpadToCharCode[keyCode]) {
        return true;
      }

      // non printable keys
      if (this.isNonPrintableKeyCode(keyCode)) {
        return true;
      }

      return false;
    },


    /**
     * Checks whether the keyCode represents a non printable key
     *
     * @param keyCode {String} key code to check.
     * @return {Boolean} Whether the keyCode represents a non printable key.
     */
    isNonPrintableKeyCode : function(keyCode) {
      return this.keyCodeToIdentifierMap[keyCode] ? true : false;
    },


    /**
     * Checks whether a given string is a valid keyIdentifier
     *
     * @param keyIdentifier {String} The key identifier.
     * @return {Boolean} whether the given string is a valid keyIdentifier
     */
    isValidKeyIdentifier : function(keyIdentifier)
    {
      if (this.identifierToKeyCodeMap[keyIdentifier]) {
        return true;
      }

      if (keyIdentifier.length != 1) {
        return false;
      }

      if (keyIdentifier >= "0" && keyIdentifier <= "9") {
        return true;
      }

      if (keyIdentifier >= "A" && keyIdentifier <= "Z") {
        return true;
      }

      switch(keyIdentifier)
      {
        case "+":
        case "-":
        case "*":
        case "/":
          return true;

        default:
          return false;
      }
    },


    /**
     * Checks whether a given string is a printable keyIdentifier.
     *
     * @param keyIdentifier {String} The key identifier.
     * @return {Boolean} whether the given string is a printable keyIdentifier.
     */
    isPrintableKeyIdentifier : function(keyIdentifier)
    {
      if (keyIdentifier === "Space") {
        return true;
      } else {
        return this.identifierToKeyCodeMap[keyIdentifier] ? false : true;
      }
    }
  },

  defer : function(statics, members)
  {
    // construct inverse of keyCodeToIdentifierMap
    if (!statics.identifierToKeyCodeMap)
    {
      statics.identifierToKeyCodeMap = {};

      for (var key in statics.keyCodeToIdentifierMap) {
        statics.identifierToKeyCodeMap[statics.keyCodeToIdentifierMap[key]] = parseInt(key, 10);
      }

      for (var key in statics.specialCharCodeMap) {
        statics.identifierToKeyCodeMap[statics.specialCharCodeMap[key]] = parseInt(key, 10);
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************

#require(qx.event.handler.UserAction)

************************************************************************ */

/**
 * This class provides unified key event handler for Internet Explorer,
 * Firefox, Opera and Safari.
 */
qx.Class.define("qx.event.handler.Keyboard",
{
  extend : qx.core.Object,
  implement : qx.event.IEventHandler,





  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * Create a new instance
   *
   * @param manager {qx.event.Manager} Event manager for the window to use
   */
  construct : function(manager)
  {
    this.base(arguments);

    // Define shorthands
    this.__manager = manager;
    this.__window = manager.getWindow();

    // Gecko ignores key events when not explicitly clicked in the document.
    if ((qx.core.Environment.get("engine.name") == "gecko")) {
      this.__root = this.__window;
    } else {
      this.__root = this.__window.document.documentElement;
    }

    // Internal sequence cache
    this.__lastUpDownType = {};

    // Initialize observer
    this._initKeyObserver();
  },





  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Integer} Priority of this handler */
    PRIORITY : qx.event.Registration.PRIORITY_NORMAL,


    /** {Map} Supported event types */
    SUPPORTED_TYPES :
    {
      keyup : 1,
      keydown : 1,
      keypress : 1,
      keyinput : 1
    },


    /** {Integer} Which target check to use */
    TARGET_CHECK : qx.event.IEventHandler.TARGET_DOMNODE,


    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : true
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {

    __onKeyUpDownWrapper  : null,
    __manager : null,
    __window : null,
    __root : null,
    __lastUpDownType : null,
    __lastKeyCode : null,
    __inputListeners : null,
    __onKeyPressWrapper : null,


    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type) {},


    // interface implementation
    registerEvent : function(target, type, capture) {
      // Nothing needs to be done here
    },


    // interface implementation
    unregisterEvent : function(target, type, capture) {
      // Nothing needs to be done here
    },




    /*
    ---------------------------------------------------------------------------
      HELPER
    ---------------------------------------------------------------------------
    */


    /**
     * Fire a key input event with the given parameters
     *
     * @param domEvent {Event} DOM event
     * @param charCode {Integer} character code
     */
    _fireInputEvent : function(domEvent, charCode)
    {
      var target = this.__getEventTarget();

      // Only fire when target is defined and visible
      if (target && target.offsetWidth != 0)
      {
        var event = qx.event.Registration.createEvent("keyinput", qx.event.type.KeyInput, [domEvent, target, charCode]);
        this.__manager.dispatchEvent(target, event);
      }

      // Fire user action event
      // Needs to check if still alive first
      if (this.__window) {
        qx.event.Registration.fireEvent(this.__window, "useraction", qx.event.type.Data, ["keyinput"]);
      }
    },


    /**
     * Fire a key up/down/press event with the given parameters
     *
     * @param domEvent {Event} DOM event
     * @param type {String} type og the event
     * @param keyIdentifier {String} key identifier
     */
    _fireSequenceEvent : function(domEvent, type, keyIdentifier)
    {
      var target = this.__getEventTarget();
      var keyCode = domEvent.keyCode;

      // Fire key event
      var event = qx.event.Registration.createEvent(type, qx.event.type.KeySequence, [domEvent, target, keyIdentifier]);
      this.__manager.dispatchEvent(target, event);

      // IE and Safari suppress a "keypress" event if the "keydown" event's
      // default action was prevented. In this case we emulate the "keypress"
      if (
        qx.core.Environment.get("engine.name") == "mshtml" ||
        qx.core.Environment.get("engine.name") == "webkit"
      )
      {
        if (type == "keydown" && event.getDefaultPrevented())
        {
          // some key press events are already emulated. Ignore these events.
          if (!qx.event.util.Keyboard.isNonPrintableKeyCode(keyCode) && !this._emulateKeyPress[keyCode]) {
            this._fireSequenceEvent(domEvent, "keypress", keyIdentifier);
          }
        }
      }

      // Fire user action event
      // Needs to check if still alive first
      if (this.__window) {
        qx.event.Registration.fireEvent(this.__window, "useraction", qx.event.type.Data, [type]);
      }
    },


    /**
     * Get the target element for mouse events
     *
     * @return {Element} the event target element
     */
    __getEventTarget : function()
    {
      var focusHandler = this.__manager.getHandler(qx.event.handler.Focus);
      var target = focusHandler.getActive();

      // Fallback to focused element when active is null or invisible
      if (!target || target.offsetWidth == 0) {
        target = focusHandler.getFocus();
      }

      // Fallback to body when focused is null or invisible
      if (!target || target.offsetWidth == 0) {
        target = this.__manager.getWindow().document.body;
      }

      return target;
    },




    /*
    ---------------------------------------------------------------------------
      OBSERVER INIT/STOP
    ---------------------------------------------------------------------------
    */

    /**
     * Initializes the native key event listeners.
     *
     * @signature function()
     */
    _initKeyObserver : function()
    {
      this.__onKeyUpDownWrapper = qx.lang.Function.listener(this.__onKeyUpDown, this);
      this.__onKeyPressWrapper = qx.lang.Function.listener(this.__onKeyPress, this);

      var Event = qx.bom.Event;

      Event.addNativeListener(this.__root, "keyup", this.__onKeyUpDownWrapper);
      Event.addNativeListener(this.__root, "keydown", this.__onKeyUpDownWrapper);
      Event.addNativeListener(this.__root, "keypress", this.__onKeyPressWrapper);
    },


    /**
     * Stops the native key event listeners.
     *
     * @signature function()
     */
    _stopKeyObserver : function()
    {
      var Event = qx.bom.Event;

      Event.removeNativeListener(this.__root, "keyup", this.__onKeyUpDownWrapper);
      Event.removeNativeListener(this.__root, "keydown", this.__onKeyUpDownWrapper);
      Event.removeNativeListener(this.__root, "keypress", this.__onKeyPressWrapper);

      for (var key in (this.__inputListeners || {}))
      {
        var listener = this.__inputListeners[key];
        Event.removeNativeListener(listener.target, "keypress", listener.callback);
      }
      delete(this.__inputListeners);
    },





    /*
    ---------------------------------------------------------------------------
      NATIVE EVENT OBSERVERS
    ---------------------------------------------------------------------------
    */

    /**
     * Low level handler for "keyup" and "keydown" events
     *
     * @internal
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event object
     */
    __onKeyUpDown : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(domEvent)
      {
        domEvent = window.event || domEvent;

        var keyCode = domEvent.keyCode;
        var charCode = 0;
        var type = domEvent.type;

        // Ignore the down in such sequences dp dp dp
        if (!(this.__lastUpDownType[keyCode] == "keydown" && type == "keydown")) {
          this._idealKeyHandler(keyCode, charCode, type, domEvent);
        }

        // On non print-able character be sure to add a keypress event
        if (type == "keydown")
        {
          // non-printable, backspace or tab
          if (qx.event.util.Keyboard.isNonPrintableKeyCode(keyCode) || this._emulateKeyPress[keyCode]) {
            this._idealKeyHandler(keyCode, charCode, "keypress", domEvent);
          }
        }

        // Store last type
        this.__lastUpDownType[keyCode] = type;
      },

      "gecko" : function(domEvent)
      {
        var charCode = 0;
        var keyCode = domEvent.keyCode;
        var type = domEvent.type;
        var kbUtil = qx.event.util.Keyboard;

        // FF repeats under windows keydown events like IE
        if (qx.core.Environment.get("os.name") == "win")
        {
          var keyIdentifier = keyCode ? kbUtil.keyCodeToIdentifier(keyCode) : kbUtil.charCodeToIdentifier(charCode);

          if (!(this.__lastUpDownType[keyIdentifier] == "keydown" && type == "keydown")) {
            this._idealKeyHandler(keyCode, charCode, type, domEvent);
          }

          // Store last type
          this.__lastUpDownType[keyIdentifier] = type;
        }

        // all other OSes
        else
        {
          this._idealKeyHandler(keyCode, charCode, type, domEvent);
        }

        this.__firefoxInputFix(domEvent.target, type, keyCode);
      },

      "webkit" : function(domEvent)
      {
        var keyCode = 0;
        var charCode = 0;
        var type = domEvent.type;

        // starting with Safari 3.1 (version 525.13) Apple switched the key
        // handling to match the IE behaviour.
        if (parseFloat(qx.core.Environment.get("engine.version")) < 525.13)
        {
          if (type == "keyup" || type == "keydown")
          {
            keyCode = this._charCode2KeyCode[domEvent.charCode] || domEvent.keyCode;
          }
          else
          {
            if (this._charCode2KeyCode[domEvent.charCode]) {
              keyCode = this._charCode2KeyCode[domEvent.charCode];
            } else {
              charCode = domEvent.charCode;
            }
          }

          this._idealKeyHandler(keyCode, charCode, type, domEvent);
        }
        else
        {
          keyCode = domEvent.keyCode;

          this._idealKeyHandler(keyCode, charCode, type, domEvent);

          // On non print-able character be sure to add a keypress event
          if (type == "keydown")
          {
            // non-printable, backspace or tab
            if (qx.event.util.Keyboard.isNonPrintableKeyCode(keyCode) || this._emulateKeyPress[keyCode]) {
              this._idealKeyHandler(keyCode, charCode, "keypress", domEvent);
            }
          }

          // Store last type
          this.__lastUpDownType[keyCode] = type;
        }

      },

      "opera" : function(domEvent)
      {
        this.__lastKeyCode = domEvent.keyCode;
        this._idealKeyHandler(domEvent.keyCode, 0, domEvent.type, domEvent);
      }
    })),


    /**
     * some keys like "up", "down", "pageup", "pagedown" do not bubble a
     * "keypress" event in Firefox. To work around this bug we attach keypress
     * listeners directly to the input events.
     *
     * https://bugzilla.mozilla.org/show_bug.cgi?id=467513
     *
     * @signature function(target, type, keyCode)
     * @param target {Element} The event target
     * @param type {String} The event type
     * @param keyCode {Integer} the key code
     */
    __firefoxInputFix : qx.core.Environment.select("engine.name",
    {
      "gecko" : function(target, type, keyCode)
      {
        if (
          type === "keydown" &&
          (keyCode == 33 || keyCode == 34 || keyCode == 38 || keyCode == 40) &&
          target.type == "text" &&
          target.tagName.toLowerCase() === "input" &&
          target.getAttribute("autoComplete") !== "off"
        )
        {
          if (!this.__inputListeners) {
            this.__inputListeners = {};
          }
          var hash = qx.core.ObjectRegistry.toHashCode(target);
          if (this.__inputListeners[hash]) {
            return;
          }
          var self = this;
          this.__inputListeners[hash] = {
            target: target,
            callback : function(domEvent)
            {
              qx.bom.Event.stopPropagation(domEvent);
              self.__onKeyPress(domEvent);
            }
          };
          var listener = qx.event.GlobalError.observeMethod(this.__inputListeners[hash].callback);
          qx.bom.Event.addNativeListener(target, "keypress", listener);
        }
      },

      "default" : null
    }),


    /**
     * Low level key press handler
     *
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event object
     */
    __onKeyPress : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(domEvent)
      {
        domEvent = window.event || domEvent;

        if (this._charCode2KeyCode[domEvent.keyCode]) {
          this._idealKeyHandler(this._charCode2KeyCode[domEvent.keyCode], 0, domEvent.type, domEvent);
        } else {
          this._idealKeyHandler(0, domEvent.keyCode, domEvent.type, domEvent);
        }
      },

      "gecko" : function(domEvent)
      {
        var charCode = domEvent.charCode;
        var type = domEvent.type;

        this._idealKeyHandler(domEvent.keyCode, charCode, type, domEvent);
      },

      "webkit" : function(domEvent)
      {
        // starting with Safari 3.1 (version 525.13) Apple switched the key
        // handling to match the IE behaviour.
        if (parseFloat(qx.core.Environment.get("engine.version")) < 525.13)
        {
          var keyCode = 0;
          var charCode = 0;
          var type = domEvent.type;

          if (type == "keyup" || type == "keydown")
          {
            keyCode = this._charCode2KeyCode[domEvent.charCode] || domEvent.keyCode;
          }
          else
          {
            if (this._charCode2KeyCode[domEvent.charCode]) {
              keyCode = this._charCode2KeyCode[domEvent.charCode];
            } else {
              charCode = domEvent.charCode;
            }
          }

          this._idealKeyHandler(keyCode, charCode, type, domEvent);
        }
        else
        {
          if (this._charCode2KeyCode[domEvent.keyCode]) {
            this._idealKeyHandler(this._charCode2KeyCode[domEvent.keyCode], 0, domEvent.type, domEvent);
          } else {
            this._idealKeyHandler(0, domEvent.keyCode, domEvent.type, domEvent);
          }
        }
      },

      "opera" : function(domEvent)
      {
        var keyCode = domEvent.keyCode;
        var type = domEvent.type;

        // Some keys are identified differently for key up/down and keypress
        // (e.g. "v" gets identified as "F7").
        // So we store the last key up/down keycode and compare it to the
        // current keycode.
        // See http://bugzilla.qooxdoo.org/show_bug.cgi?id=603
        if(keyCode != this.__lastKeyCode)
        {
          this._idealKeyHandler(0, this.__lastKeyCode, type, domEvent);
        }
        else
        {
          if (qx.event.util.Keyboard.keyCodeToIdentifierMap[domEvent.keyCode]) {
            this._idealKeyHandler(domEvent.keyCode, 0, domEvent.type, domEvent);
          } else {
            this._idealKeyHandler(0, domEvent.keyCode, domEvent.type, domEvent);
          }
        }

      }
    })),





    /*
    ---------------------------------------------------------------------------
      IDEAL KEY HANDLER
    ---------------------------------------------------------------------------
    */

    /**
     * Key handler for an idealized browser.
     * Runs after the browser specific key handlers have normalized the key events.
     *
     * @param keyCode {String} keyboard code
     * @param charCode {String} character code
     * @param eventType {String} type of the event (keydown, keypress, keyup)
     * @param domEvent {Element} DomEvent
     */
    _idealKeyHandler : function(keyCode, charCode, eventType, domEvent)
    {
      var keyIdentifier;

      // Use: keyCode
      if (keyCode || (!keyCode && !charCode))
      {
        keyIdentifier = qx.event.util.Keyboard.keyCodeToIdentifier(keyCode);

        this._fireSequenceEvent(domEvent, eventType, keyIdentifier);
      }

      // Use: charCode
      else
      {
        keyIdentifier = qx.event.util.Keyboard.charCodeToIdentifier(charCode);

        this._fireSequenceEvent(domEvent, "keypress", keyIdentifier);
        this._fireInputEvent(domEvent, charCode);
      }
    },






    /*
    ---------------------------------------------------------------------------
      KEY MAPS
    ---------------------------------------------------------------------------
    */


    /**
     * {Map} maps the charcodes of special keys for key press emulation
     *
     * @lint ignoreReferenceField(_emulateKeyPress)
     */
    _emulateKeyPress : qx.core.Environment.select("engine.name",
    {
      "mshtml" : {
        8: true,
        9: true
      },

      "webkit" : {
        8: true,
        9: true,
        27: true
      },

      "default" : {}
    }),




    /*
    ---------------------------------------------------------------------------
      HELPER METHODS
    ---------------------------------------------------------------------------
    */


    /**
     * converts a key identifier back to a keycode
     *
     * @param keyIdentifier {String} The key identifier to convert
     * @return {Integer} keyboard code
     */
    _identifierToKeyCode : function(keyIdentifier) {
      return qx.event.util.Keyboard.identifierToKeyCodeMap[keyIdentifier] || keyIdentifier.charCodeAt(0);
    }
  },






  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this._stopKeyObserver();
    this.__lastKeyCode = this.__manager = this.__window = this.__root = this.__lastUpDownType = null;
  },





  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics, members)
  {
    // register at the event handler
    qx.event.Registration.addHandler(statics);

    if ((qx.core.Environment.get("engine.name") == "mshtml"))
    {
      members._charCode2KeyCode =
      {
        13 : 13,
        27 : 27
      };
    }
    else if ((qx.core.Environment.get("engine.name") == "webkit"))
    {
      // starting with Safari 3.1 (version 525.13) Apple switched the key
      // handling to match the IE behaviour.
      if (parseFloat(qx.core.Environment.get("engine.version")) < 525.13 )
      {
        members._charCode2KeyCode =
        {
          // Safari/Webkit Mappings
          63289 : members._identifierToKeyCode("NumLock"),
          63276 : members._identifierToKeyCode("PageUp"),
          63277 : members._identifierToKeyCode("PageDown"),
          63275 : members._identifierToKeyCode("End"),
          63273 : members._identifierToKeyCode("Home"),
          63234 : members._identifierToKeyCode("Left"),
          63232 : members._identifierToKeyCode("Up"),
          63235 : members._identifierToKeyCode("Right"),
          63233 : members._identifierToKeyCode("Down"),
          63272 : members._identifierToKeyCode("Delete"),
          63302 : members._identifierToKeyCode("Insert"),
          63236 : members._identifierToKeyCode("F1"),
          63237 : members._identifierToKeyCode("F2"),
          63238 : members._identifierToKeyCode("F3"),
          63239 : members._identifierToKeyCode("F4"),
          63240 : members._identifierToKeyCode("F5"),
          63241 : members._identifierToKeyCode("F6"),
          63242 : members._identifierToKeyCode("F7"),
          63243 : members._identifierToKeyCode("F8"),
          63244 : members._identifierToKeyCode("F9"),
          63245 : members._identifierToKeyCode("F10"),
          63246 : members._identifierToKeyCode("F11"),
          63247 : members._identifierToKeyCode("F12"),
          63248 : members._identifierToKeyCode("PrintScreen"),
          3     : members._identifierToKeyCode("Enter"),
          12    : members._identifierToKeyCode("NumLock"),
          13    : members._identifierToKeyCode("Enter")
        };
      }
      else
      {
        members._charCode2KeyCode =
        {
          13 : 13,
          27 : 27
        };
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Keyboard input event object.
 *
 * the interface of this class is based on the DOM Level 3 keyboard event
 * interface: http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
 */
qx.Class.define("qx.event.type.KeyInput",
{
  extend : qx.event.type.Dom,




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Initialize the fields of the event.
     *
     * @param domEvent {Event} DOM event
     * @param target {Object} The event target
     * @param charCode {Integer} the character code
     * @return {qx.event.type.KeyInput} The initialized key event instance
     */
    init : function(domEvent, target, charCode)
    {
      this.base(arguments, domEvent, target, null, true, true);

      this._charCode = charCode;

      return this;
    },


    // overridden
    clone : function(embryo)
    {
      var clone = this.base(arguments, embryo);

      clone._charCode = this._charCode;

      return clone;
    },


    /**
     * Unicode number of the pressed character.
     *
     * @return {Integer} Unicode number of the pressed character
     */
    getCharCode : function() {
      return this._charCode;
    },


    /**
     * Returns the pressed character
     *
     * @return {String} The character
     */
    getChar : function() {
      return String.fromCharCode(this._charCode);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Keyboard event object.
 *
 * the interface of this class is based on the DOM Level 3 keyboard event
 * interface: http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboardevents
 */
qx.Class.define("qx.event.type.KeySequence",
{
  extend : qx.event.type.Dom,




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Initialize the fields of the event.
     *
     * @param domEvent {Event} DOM event
     * @param target {Object} The event target
     * @param identifier {String} Key identifier
     * @return {qx.event.type.KeySequence} The initialized key event instance
     */
    init : function(domEvent, target, identifier)
    {
      this.base(arguments, domEvent, target, null, true, true);

      this._keyCode = domEvent.keyCode;
      this._identifier = identifier;

      return this;
    },


    // overridden
    clone : function(embryo)
    {
      var clone = this.base(arguments, embryo);

      clone._keyCode = this._keyCode;
      clone._identifier = this._identifier;

      return clone;
    },


    /**
     * Identifier of the pressed key. This property is modeled after the <em>KeyboardEvent.keyIdentifier</em> property
     * of the W3C DOM 3 event specification
     * (http://www.w3.org/TR/2003/NOTE-DOM-Level-3-Events-20031107/events.html#Events-KeyboardEvent-keyIdentifier).
     *
     * Printable keys are represented by an unicode string, non-printable keys
     * have one of the following values:
     *
     * <table>
     * <tr><th>Backspace</th><td>The Backspace (Back) key.</td></tr>
     * <tr><th>Tab</th><td>The Horizontal Tabulation (Tab) key.</td></tr>
     * <tr><th>Space</th><td>The Space (Spacebar) key.</td></tr>
     * <tr><th>Enter</th><td>The Enter key. Note: This key identifier is also used for the Return (Macintosh numpad) key.</td></tr>
     * <tr><th>Shift</th><td>The Shift key.</td></tr>
     * <tr><th>Control</th><td>The Control (Ctrl) key.</td></tr>
     * <tr><th>Alt</th><td>The Alt (Menu) key.</td></tr>
     * <tr><th>CapsLock</th><td>The CapsLock key</td></tr>
     * <tr><th>Meta</th><td>The Meta key. (Apple Meta and Windows key)</td></tr>
     * <tr><th>Escape</th><td>The Escape (Esc) key.</td></tr>
     * <tr><th>Left</th><td>The Left Arrow key.</td></tr>
     * <tr><th>Up</th><td>The Up Arrow key.</td></tr>
     * <tr><th>Right</th><td>The Right Arrow key.</td></tr>
     * <tr><th>Down</th><td>The Down Arrow key.</td></tr>
     * <tr><th>PageUp</th><td>The Page Up key.</td></tr>
     * <tr><th>PageDown</th><td>The Page Down (Next) key.</td></tr>
     * <tr><th>End</th><td>The End key.</td></tr>
     * <tr><th>Home</th><td>The Home key.</td></tr>
     * <tr><th>Insert</th><td>The Insert (Ins) key. (Does not fire in Opera/Win)</td></tr>
     * <tr><th>Delete</th><td>The Delete (Del) Key.</td></tr>
     * <tr><th>F1</th><td>The F1 key.</td></tr>
     * <tr><th>F2</th><td>The F2 key.</td></tr>
     * <tr><th>F3</th><td>The F3 key.</td></tr>
     * <tr><th>F4</th><td>The F4 key.</td></tr>
     * <tr><th>F5</th><td>The F5 key.</td></tr>
     * <tr><th>F6</th><td>The F6 key.</td></tr>
     * <tr><th>F7</th><td>The F7 key.</td></tr>
     * <tr><th>F8</th><td>The F8 key.</td></tr>
     * <tr><th>F9</th><td>The F9 key.</td></tr>
     * <tr><th>F10</th><td>The F10 key.</td></tr>
     * <tr><th>F11</th><td>The F11 key.</td></tr>
     * <tr><th>F12</th><td>The F12 key.</td></tr>
     * <tr><th>NumLock</th><td>The Num Lock key.</td></tr>
     * <tr><th>PrintScreen</th><td>The Print Screen (PrintScrn, SnapShot) key.</td></tr>
     * <tr><th>Scroll</th><td>The scroll lock key</td></tr>
     * <tr><th>Pause</th><td>The pause/break key</td></tr>
     * <tr><th>Win</th><td>The Windows Logo key</td></tr>
     * <tr><th>Apps</th><td>The Application key (Windows Context Menu)</td></tr>
     * </table>
     *
     * @return {String} The key identifier
     */
    getKeyIdentifier : function() {
      return this._identifier;
    },


    /**
     * Returns the native keyCode and is best used on keydown/keyup events to
     * check which physical key was pressed.
     * Don't use this on keypress events because it's erroneous and
     * inconsistent across browsers. But it can be used to detect which key is
     * exactly pressed (e.g. for num pad keys).
     * In any regular case, you should use {@link #getKeyIdentifier} which
     * takes care of all cross browser stuff.
     *
     * The key codes are not character codes, they are just ASCII codes to
     * identify the keyboard (or other input devices) keys.
     *
     * @return {Number} The key code.
     */
    getKeyCode : function() {
      return this._keyCode;
    },


    /**
     * Checks whether the pressed key is printable.
     *
     * @return {Boolean} Whether the pressed key is printable.
     */
    isPrintable : function() {
      return qx.event.util.Keyboard.isPrintableKeyIdentifier(this._identifier);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/* ************************************************************************

#use(qx.event.dispatch.DomBubbling)

************************************************************************ */

/**
 * This handler is used to normalize all focus/activation requirements
 * and normalize all cross browser quirks in this area.
 *
 * Notes:
 *
 * * Webkit and Opera (before 9.5) do not support tabIndex for all elements
 * (See also: http://bugs.webkit.org/show_bug.cgi?id=7138)
 *
 * * TabIndex is normally 0, which means all naturally focusable elements are focusable.
 * * TabIndex > 0 means that the element is focusable and tabable
 * * TabIndex < 0 means that the element, even if naturally possible, is not focusable.
 */
qx.Class.define("qx.event.handler.Focus",
{
  extend : qx.core.Object,
  implement : qx.event.IEventHandler,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * Create a new instance
   *
   * @param manager {qx.event.Manager} Event manager for the window to use
   */
  construct : function(manager)
  {
    this.base(arguments);

    // Define shorthands
    this._manager = manager;
    this._window = manager.getWindow();
    this._document = this._window.document;
    this._root = this._document.documentElement;
    this._body = this._document.body;

    // Initialize
    this._initObserver();
  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** The active DOM element */
    active :
    {
      apply : "_applyActive",
      nullable : true
    },

    /** The focussed DOM element */
    focus :
    {
      apply : "_applyFocus",
      nullable : true
    }
  },

  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Integer} Priority of this handler */
    PRIORITY : qx.event.Registration.PRIORITY_NORMAL,

    /** {Map} Supported event types */
    SUPPORTED_TYPES :
    {
      focus : 1,
      blur : 1,
      focusin : 1,
      focusout : 1,
      activate : 1,
      deactivate : 1
    },

    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : true,

    /**
     * {Map} See: http://msdn.microsoft.com/en-us/library/ms534654(VS.85).aspx
     */
    FOCUSABLE_ELEMENTS : qx.core.Environment.select("engine.name",
    {
      "mshtml|gecko" :
      {
        a : 1,
        body : 1,
        button : 1,
        frame : 1,
        iframe : 1,
        img : 1,
        input : 1,
        object : 1,
        select : 1,
        textarea : 1
      },

      "opera|webkit" :
      {
        button : 1,
        input : 1,
        select : 1,
        textarea : 1
      }
    })
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __onNativeMouseDownWrapper : null,
    __onNativeMouseUpWrapper : null,
    __onNativeFocusWrapper : null,
    __onNativeBlurWrapper : null,
    __onNativeDragGestureWrapper : null,
    __onNativeSelectStartWrapper : null,
    __onNativeFocusInWrapper : null,
    __onNativeFocusOutWrapper : null,
    __previousFocus : null,
    __previousActive : null,

    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type) {},

    // interface implementation
    registerEvent : function(target, type, capture) {
      // Nothing needs to be done here
    },

    // interface implementation
    unregisterEvent : function(target, type, capture) {
      // Nothing needs to be done here
    },

    /*
    ---------------------------------------------------------------------------
      FOCUS/BLUR USER INTERFACE
    ---------------------------------------------------------------------------
    */

    /**
     * Focuses the given DOM element
     *
     * @param element {Element} DOM element to focus
     */
    focus : function(element)
    {
      // Fixed timing issue with IE, see [BUG #3267]
      if ((qx.core.Environment.get("engine.name") == "mshtml"))
      {
        window.setTimeout(function()
        {
          try {
            // focus element before set cursor position
            element.focus();

            // Fixed cursor position issue with IE, only when nothing is selected.
            // See [BUG #3519] for details.
            var selection = qx.bom.Selection.get(element);
            if (selection.length == 0) {
              var textRange = element.createTextRange();
              textRange.moveStart('character', element.value.length);
              textRange.collapse();
              textRange.select();
            }
          } catch(ex) {};
        }, 0);
      }
      else
      {
        try {
          element.focus();
        } catch(ex) {};
      }

      this.setFocus(element);
      this.setActive(element);
    },

    /**
     * Activates the given DOM element
     *
     * @param element {Element} DOM element to activate
     */
    activate : function(element) {
      this.setActive(element);
    },

    /**
     * Blurs the given DOM element
     *
     * @param element {Element} DOM element to focus
     */
    blur : function(element)
    {
      try {
        element.blur();
      } catch(ex) {};

      if (this.getActive() === element) {
        this.resetActive();
      }

      if (this.getFocus() === element) {
        this.resetFocus();
      }
    },

    /**
     * Deactivates the given DOM element
     *
     * @param element {Element} DOM element to activate
     */
    deactivate : function(element)
    {
      if (this.getActive() === element) {
        this.resetActive();
      }
    },

    /**
     * Tries to activate the given element. This checks whether
     * the activation is allowed first.
     *
     * @param element {Element} DOM element to activate
     */
    tryActivate : function(element)
    {
      var active = this.__findActivatableElement(element);
      if (active) {
        this.setActive(active);
      }
    },

    /*
    ---------------------------------------------------------------------------
      HELPER
    ---------------------------------------------------------------------------
    */

    /**
     * Shorthand to fire events from within this class.
     *
     * @param target {Element} DOM element which is the target
     * @param related {Element} DOM element which is the related target
     * @param type {String} Name of the event to fire
     * @param bubbles {Boolean} Whether the event should bubble
     */
    __fireEvent : function(target, related, type, bubbles)
    {
      var Registration = qx.event.Registration;

      var evt = Registration.createEvent(type, qx.event.type.Focus, [target, related, bubbles]);
      Registration.dispatchEvent(target, evt);
    },

    /*
    ---------------------------------------------------------------------------
      WINDOW FOCUS/BLUR SUPPORT
    ---------------------------------------------------------------------------
    */

    /** {Boolean} Whether the window is focused currently */
    _windowFocused : true,

    /**
     * Helper for native event listeners to react on window blur
     */
    __doWindowBlur : function()
    {
      // Omit doubled blur events
      // which is a common behavior at least for gecko based clients
      if (this._windowFocused)
      {
        this._windowFocused = false;
        this.__fireEvent(this._window, null, "blur", false);
      }
    },


    /**
     * Helper for native event listeners to react on window focus
     */
    __doWindowFocus : function()
    {
      // Omit doubled focus events
      // which is a common behavior at least for gecko based clients
      if (!this._windowFocused)
      {
        this._windowFocused = true;
        this.__fireEvent(this._window, null, "focus", false);
      }
    },

    /*
    ---------------------------------------------------------------------------
      NATIVE OBSERVER
    ---------------------------------------------------------------------------
    */

    /**
     * Initializes event listeners.
     *
     * @signature function()
     */
    _initObserver : qx.core.Environment.select("engine.name",
    {
      "gecko" : function()
      {
        // Bind methods
        this.__onNativeMouseDownWrapper = qx.lang.Function.listener(this.__onNativeMouseDown, this);
        this.__onNativeMouseUpWrapper = qx.lang.Function.listener(this.__onNativeMouseUp, this);

        this.__onNativeFocusWrapper = qx.lang.Function.listener(this.__onNativeFocus, this);
        this.__onNativeBlurWrapper = qx.lang.Function.listener(this.__onNativeBlur, this);

        this.__onNativeDragGestureWrapper = qx.lang.Function.listener(this.__onNativeDragGesture, this);


        // Register events
        qx.bom.Event.addNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper, true);
        qx.bom.Event.addNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper, true);

        // Capturing is needed for gecko to correctly
        // handle focus of input and textarea fields
        qx.bom.Event.addNativeListener(this._window, "focus", this.__onNativeFocusWrapper, true);
        qx.bom.Event.addNativeListener(this._window, "blur", this.__onNativeBlurWrapper, true);

        // Capture drag events
        qx.bom.Event.addNativeListener(this._window, "draggesture", this.__onNativeDragGestureWrapper, true);
      },

      "mshtml" : function()
      {
        // Bind methods
        this.__onNativeMouseDownWrapper = qx.lang.Function.listener(this.__onNativeMouseDown, this);
        this.__onNativeMouseUpWrapper = qx.lang.Function.listener(this.__onNativeMouseUp, this);

        this.__onNativeFocusInWrapper = qx.lang.Function.listener(this.__onNativeFocusIn, this);
        this.__onNativeFocusOutWrapper = qx.lang.Function.listener(this.__onNativeFocusOut, this);

        this.__onNativeSelectStartWrapper = qx.lang.Function.listener(this.__onNativeSelectStart, this);


        // Register events
        qx.bom.Event.addNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper);
        qx.bom.Event.addNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper);

        // MSHTML supports their own focusin and focusout events
        // To detect which elements get focus the target is useful
        // The window blur can detected using focusout and look
        // for the toTarget property which is empty in this case.
        qx.bom.Event.addNativeListener(this._document, "focusin", this.__onNativeFocusInWrapper);
        qx.bom.Event.addNativeListener(this._document, "focusout", this.__onNativeFocusOutWrapper);

        // Add selectstart to prevent selection
        qx.bom.Event.addNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper);
      },

      "webkit" : function()
      {
        // Bind methods
        this.__onNativeMouseDownWrapper = qx.lang.Function.listener(this.__onNativeMouseDown, this);
        this.__onNativeMouseUpWrapper = qx.lang.Function.listener(this.__onNativeMouseUp, this);

        this.__onNativeFocusOutWrapper = qx.lang.Function.listener(this.__onNativeFocusOut, this);

        this.__onNativeFocusWrapper = qx.lang.Function.listener(this.__onNativeFocus, this);
        this.__onNativeBlurWrapper = qx.lang.Function.listener(this.__onNativeBlur, this);

        this.__onNativeSelectStartWrapper = qx.lang.Function.listener(this.__onNativeSelectStart, this);


        // Register events
        qx.bom.Event.addNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper, true);
        qx.bom.Event.addNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper, true);
        qx.bom.Event.addNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper, false);

        qx.bom.Event.addNativeListener(this._window, "DOMFocusOut", this.__onNativeFocusOutWrapper, true);

        qx.bom.Event.addNativeListener(this._window, "focus", this.__onNativeFocusWrapper, true);
        qx.bom.Event.addNativeListener(this._window, "blur", this.__onNativeBlurWrapper, true);
      },

      "opera" : function()
      {
        // Bind methods
        this.__onNativeMouseDownWrapper = qx.lang.Function.listener(this.__onNativeMouseDown, this);
        this.__onNativeMouseUpWrapper = qx.lang.Function.listener(this.__onNativeMouseUp, this);

        this.__onNativeFocusInWrapper = qx.lang.Function.listener(this.__onNativeFocusIn, this);
        this.__onNativeFocusOutWrapper = qx.lang.Function.listener(this.__onNativeFocusOut, this);


        // Register events
        qx.bom.Event.addNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper, true);
        qx.bom.Event.addNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper, true);

        qx.bom.Event.addNativeListener(this._window, "DOMFocusIn", this.__onNativeFocusInWrapper, true);
        qx.bom.Event.addNativeListener(this._window, "DOMFocusOut", this.__onNativeFocusOutWrapper, true);
      }
    }),

    /**
     * Disconnects event listeners.
     *
     * @signature function()
     */
    _stopObserver : qx.core.Environment.select("engine.name",
    {
      "gecko" : function()
      {
        qx.bom.Event.removeNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper, true);
        qx.bom.Event.removeNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper, true);

        qx.bom.Event.removeNativeListener(this._window, "focus", this.__onNativeFocusWrapper, true);
        qx.bom.Event.removeNativeListener(this._window, "blur", this.__onNativeBlurWrapper, true);

        qx.bom.Event.removeNativeListener(this._window, "draggesture", this.__onNativeDragGestureWrapper, true);
      },

      "mshtml" : function()
      {
        qx.bom.Event.removeNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper);
        qx.bom.Event.removeNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper);
        qx.bom.Event.removeNativeListener(this._document, "focusin", this.__onNativeFocusInWrapper);
        qx.bom.Event.removeNativeListener(this._document, "focusout", this.__onNativeFocusOutWrapper);
        qx.bom.Event.removeNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper);
      },

      "webkit" : function()
      {
        qx.bom.Event.removeNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper, true);
        qx.bom.Event.removeNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper, true);
        qx.bom.Event.removeNativeListener(this._document, "selectstart", this.__onNativeSelectStartWrapper, false);

        qx.bom.Event.removeNativeListener(this._window, "DOMFocusOut", this.__onNativeFocusOutWrapper, true);

        qx.bom.Event.removeNativeListener(this._window, "focus", this.__onNativeFocusWrapper, true);
        qx.bom.Event.removeNativeListener(this._window, "blur", this.__onNativeBlurWrapper, true);
      },

      "opera" : function()
      {
        qx.bom.Event.removeNativeListener(this._document, "mousedown", this.__onNativeMouseDownWrapper, true);
        qx.bom.Event.removeNativeListener(this._document, "mouseup", this.__onNativeMouseUpWrapper, true);

        qx.bom.Event.removeNativeListener(this._window, "DOMFocusIn", this.__onNativeFocusInWrapper, true);
        qx.bom.Event.removeNativeListener(this._window, "DOMFocusOut", this.__onNativeFocusOutWrapper, true);
      }
    }),

    /*
    ---------------------------------------------------------------------------
      NATIVE LISTENERS
    ---------------------------------------------------------------------------
    */

    /**
     * Native event listener for <code>draggesture</code> event
     * supported by gecko. Used to stop native drag and drop when
     * selection is disabled.
     *
     * @see http://developer.mozilla.org/en/docs/Drag_and_Drop
     * @signature function(domEvent)
     * @param domEvent {Event} Native event
     */
    __onNativeDragGesture : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "gecko" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        if (!this.__isSelectable(target)) {
          qx.bom.Event.preventDefault(domEvent);
        }
      },

      "default" : null
    })),

    /**
     * Native event listener for <code>DOMFocusIn</code> or <code>focusin</code>
     * depending on the client's engine.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} Native event
     */
    __onNativeFocusIn : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(domEvent)
      {
        // Force window focus to be the first
        this.__doWindowFocus();

        // Update internal data
        var target = qx.bom.Event.getTarget(domEvent);

        // IE focusin is also fired on elements which are not focusable at all
        // We need to look up for the next focusable element.
        var focusTarget = this.__findFocusableElement(target);
        if (focusTarget) {
          this.setFocus(focusTarget);
        }

        // Make target active
        this.tryActivate(target);
      },

      "opera" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        if (target == this._document || target == this._window)
        {
          this.__doWindowFocus();

          if (this.__previousFocus)
          {
            this.setFocus(this.__previousFocus);
            delete this.__previousFocus;
          }

          if (this.__previousActive)
          {
            this.setActive(this.__previousActive);
            delete this.__previousActive;
          }
        }
        else
        {
          this.setFocus(target);
          this.tryActivate(target);

          // Clear selection
          if (!this.__isSelectable(target))
          {
            target.selectionStart = 0;
            target.selectionEnd = 0;
          }
        }
      },

      "default" : null
    })),

    /**
     * Native event listener for <code>DOMFocusOut</code> or <code>focusout</code>
     * depending on the client's engine.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} Native event
     */
    __onNativeFocusOut : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(domEvent)
      {
        var relatedTarget = qx.bom.Event.getRelatedTarget(domEvent);

        // If the focus goes to nowhere (the document is blurred)
        if (relatedTarget == null)
        {
          // Update internal representation
          this.__doWindowBlur();

          // Reset active and focus
          this.resetFocus();
          this.resetActive();
        }
      },

      "webkit" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);

        if (target === this.getFocus()) {
          this.resetFocus();
        }

        if (target === this.getActive()) {
          this.resetActive();
        }
      },

      "opera" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        if (target == this._document)
        {
          this.__doWindowBlur();

          // Store old focus/active elements
          // Opera do not fire focus events for them
          // when refocussing the window (in my opinion an error)
          this.__previousFocus = this.getFocus();
          this.__previousActive = this.getActive();

          this.resetFocus();
          this.resetActive();
        }
        else
        {
          if (target === this.getFocus()) {
            this.resetFocus();
          }

          if (target === this.getActive()) {
            this.resetActive();
          }
        }
      },

      "default" : null
    })),

    /**
     * Native event listener for <code>blur</code>.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} Native event
     */
    __onNativeBlur : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "gecko" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        if (target === this._window || target === this._document)
        {
          this.__doWindowBlur();

          this.resetActive();
          this.resetFocus();
        }
      },

      "webkit" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        if (target === this._window || target === this._document)
        {
          this.__doWindowBlur();

          // Store old focus/active elements
          // Opera do not fire focus events for them
          // when refocussing the window (in my opinion an error)
          this.__previousFocus = this.getFocus();
          this.__previousActive = this.getActive();

          this.resetActive();
          this.resetFocus();
        }
      },

      "default" : null
    })),

    /**
     * Native event listener for <code>focus</code>.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} Native event
     */
    __onNativeFocus : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "gecko" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);

        if (target === this._window || target === this._document)
        {
          this.__doWindowFocus();

          // Always speak of the body, not the window or document
          target = this._body;
        }

        this.setFocus(target);
        this.tryActivate(target);
      },

      "webkit" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        if (target === this._window || target === this._document)
        {
          this.__doWindowFocus();

          if (this.__previousFocus)
          {
            this.setFocus(this.__previousFocus);
            delete this.__previousFocus;
          }

          if (this.__previousActive)
          {
            this.setActive(this.__previousActive);
            delete this.__previousActive;
          }
        }
        else
        {
          this.setFocus(target);
          this.tryActivate(target);
        }
      },

      "default" : null
    })),

    /**
     * Native event listener for <code>mousedown</code>.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} Native event
     */
    __onNativeMouseDown : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);

        // Stop events when no focus element available (or blocked)
        var focusTarget = this.__findFocusableElement(target);
        if (focusTarget)
        {
          // Add unselectable to keep selection
          if (!this.__isSelectable(target))
          {
            // The element is not selectable. Block selection.
            target.unselectable = "on";

            // Unselectable may keep the current selection which
            // is not what we like when changing the focus element.
            // So we clear it
            try {
              document.selection.empty();
            } catch (ex) {
              // ignore 'Unknown runtime error'
            }

            // The unselectable attribute stops focussing as well.
            // Do this manually.
            try {
              focusTarget.focus();
            } catch (ex) {
              // ignore "Can't move focus of this control" error
            }
          }
        }
        else
        {
          // Stop event for blocking support
          qx.bom.Event.preventDefault(domEvent);

          // Add unselectable to keep selection
          if (!this.__isSelectable(target)) {
            target.unselectable = "on";
          }
        }
      },

      "webkit|gecko" : function(domEvent) {
        var target = qx.bom.Event.getTarget(domEvent);
        var focusTarget = this.__findFocusableElement(target);

        if (focusTarget) {
          this.setFocus(focusTarget);
        } else {
          qx.bom.Event.preventDefault(domEvent);
        }
      },

      "opera" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        var focusTarget = this.__findFocusableElement(target);

        if (!this.__isSelectable(target)) {
          // Prevent the default action for all non-selectable
          // targets. This prevents text selection and context menu.
          qx.bom.Event.preventDefault(domEvent);

          // The stopped event keeps the selection
          // of the previously focused element.
          // We need to clear the old selection.
          if (focusTarget)
          {
            var current = this.getFocus();
            if (current && current.selectionEnd)
            {
              current.selectionStart = 0;
              current.selectionEnd = 0;
              current.blur();
            }

            // The prevented event also stop the focus, do
            // it manually if needed.
            if (focusTarget) {
              this.setFocus(focusTarget);
            }
          }
        } else if (focusTarget) {
          this.setFocus(focusTarget);
        }
      },

      "default" : null
    })),

    /**
     * Native event listener for <code>mouseup</code>.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} Native event
     */
    __onNativeMouseUp : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        if (target.unselectable) {
          target.unselectable = "off";
        }

        this.tryActivate(this.__fixFocus(target));
      },

      "gecko" : function(domEvent)
      {
        // As of Firefox 3.0:
        // Gecko fires mouseup on XUL elements
        // We only want to deal with real HTML elements
        var target = qx.bom.Event.getTarget(domEvent);
        while (target && target.offsetWidth === undefined) {
          target = target.parentNode;
        }

        if (target) {
          this.tryActivate(target);
        }

      },

      "webkit|opera" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        this.tryActivate(this.__fixFocus(target));
      },

      "default" : null
    })),

    /**
     * Fix for bug #2602.
     *
     * @signature function(target)
     * @param target {Element} target element from mouse up event
     * @return {Element} Element to activate;
     */
    __fixFocus : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "mshtml|webkit" : function(target)
      {
        var focusedElement = this.getFocus();
        if (focusedElement && target != focusedElement &&
            (focusedElement.nodeName.toLowerCase() === "input" ||
            focusedElement.nodeName.toLowerCase() === "textarea")) {
          target = focusedElement;
        }

        return target;
      },

      "default" : function(target) {
        return target;
      }
    })),

    /**
     * Native event listener for <code>selectstart</code>.
     *
     *@signature function(domEvent)
     * @param domEvent {Event} Native event
     */
    __onNativeSelectStart : qx.event.GlobalError.observeMethod(qx.core.Environment.select("engine.name",
    {
      "mshtml|webkit" : function(domEvent)
      {
        var target = qx.bom.Event.getTarget(domEvent);
        if (!this.__isSelectable(target)) {
          qx.bom.Event.preventDefault(domEvent);
        }
      },

      "default" : null
    })),

    /*
    ---------------------------------------------------------------------------
      HELPER METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Whether the given element is focusable. This is perfectly modeled to the
     * browsers behavior and this way may differ in the various clients.
     *
     * @param el {Element} DOM Element to query
     * @return {Boolean} Whether the element is focusable
     */
    __isFocusable : function(el)
    {
      var index = qx.bom.element.Attribute.get(el, "tabIndex");
      if (index >= 1) {
        return true;
      }

      var focusable = qx.event.handler.Focus.FOCUSABLE_ELEMENTS;
      if (index >= 0 && focusable[el.tagName]) {
        return true;
      }

      return false;
    },


    /**
     * Returns the next focusable parent element of an activated DOM element.
     *
     * @param el {Element} Element to start lookup with.
     * @return {Element|null} The next focusable element.
     */
    __findFocusableElement : function(el)
    {
      while (el && el.nodeType === 1)
      {
        if (el.getAttribute("qxKeepFocus") == "on") {
          return null;
        }

        if (this.__isFocusable(el)) {
          return el;
        }

        el = el.parentNode;
      }

      // This should be identical to the one which is selected when
      // clicking into an empty page area. In mshtml this must be
      // the body of the document.
      return this._body;
    },

    /**
     * Returns the next activatable element. May be the element itself.
     * Works a bit different than the method {@link #__findFocusableElement}
     * as it looks up for a parent which is has a keep focus flag. When
     * there is such a parent it returns null otherwise the original
     * incoming element.
     *
     * @param el {Element} Element to start lookup with.
     * @return {Element} The next activatable element.
     */
    __findActivatableElement : function(el)
    {
      var orig = el;

      while (el && el.nodeType === 1)
      {
        if (el.getAttribute("qxKeepActive") == "on") {
          return null;
        }

        el = el.parentNode;
      }

      return orig;
    },

    /**
     * Whether the given el (or its content) should be selectable
     * by the user.
     *
     * @param node {Element} Node to start lookup with
     * @return {Boolean} Whether the content is selectable.
     */
    __isSelectable : function(node)
    {
      while(node && node.nodeType === 1)
      {
        var attr = node.getAttribute("qxSelectable");
        if (attr != null) {
          return attr === "on";
        }

        node = node.parentNode;
      }

      return true;
    },

    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    // apply routine
    _applyActive : function(value, old)
    {
      /*
      var id = "null";
      if (value) {
        id = (value.tagName||value) + "[" + (value.$$hash || "none") + "]";
      }
      this.debug("Property Active: " + id);

      id = "null";
      if (old) {
        id = (old.tagName||old) + "[" + (old.$$hash || "none") + "]";
      }
      this.debug("Property Deactivate: " + id);
      */

      // Fire events
      if (old) {
        this.__fireEvent(old, value, "deactivate", true);
      }

      if (value) {
        this.__fireEvent(value, old, "activate", true);
      }
    },

    // apply routine
    _applyFocus : function(value, old)
    {
      /*
      var id = "null";
      if (value) {
        id = (value.tagName||value) + "[" + (value.$$hash || "none") + "]";
      }
      this.debug("Property Focus: " + id);

      id = "null";
      if (old) {
        id = (old.tagName||old) + "[" + (old.$$hash || "none") + "]";
      }
      this.debug("Property Blur: " + id);
      */

      // Fire bubbling events
      if (old) {
        this.__fireEvent(old, value, "focusout", true);
      }

      if (value) {
        this.__fireEvent(value, old, "focusin", true);
      }

      // Fire after events
      if (old) {
        this.__fireEvent(old, value, "blur", false);
      }

      if (value) {
        this.__fireEvent(value, old, "focus", false);
      }
    }
  },

  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this._stopObserver();
    this._manager = this._window = this._document = this._root = this._body =
      this.__mouseActive = null;
  },

  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics)
  {
    qx.event.Registration.addHandler(statics);

    // For faster lookups generate uppercase tag names dynamically
    var focusable = statics.FOCUSABLE_ELEMENTS;
    for (var entry in focusable) {
      focusable[entry.toUpperCase()] = 1;
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */



/**
 * Low-level selection API to select elements like input and textarea elements
 * as well as text nodes or elements which their child nodes.
 */
qx.Class.define("qx.bom.Selection",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Returns the native selection object.
     *
     * @signature function(documentNode)
     * @param documentNode {document} Document node to retrieve the connected selection from
     * @return {Selection} native selection object
     */
    getSelectionObject : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(documentNode) {
        return documentNode.selection;
      },

      // suitable for gecko, opera and webkit
      "default" : function(documentNode) {
        return qx.dom.Node.getWindow(documentNode).getSelection();
      }
    }),


    /**
     * Returns the current selected text.
     *
     * @signature function(node)
     * @param node {Node} node to retrieve the selection for
     * @return {String|null} selected text as string
     */
    get : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(node)
      {
        // to get the selected text in IE you have to work with the TextRange
        // of the selection object. So always pass the document node to the
        // Range class to get this TextRange object.
        var rng = qx.bom.Range.get(qx.dom.Node.getDocument(node));
        return rng.text;
      },

      // suitable for gecko, opera and webkit
      "default" : function(node)
      {
        if (this.__isInputOrTextarea(node)) {
          return node.value.substring(node.selectionStart, node.selectionEnd);
        } else {
          return this.getSelectionObject(qx.dom.Node.getDocument(node)).toString();
        }
      }
    }),


    /**
     * Returns the length of the selection
     *
     * @signature function(node)
     * @param node {Node} Form node or document/window to check.
     * @return {Integer|null} length of the selection or null
     */
    getLength : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(node)
      {
        var selectedValue = this.get(node);
        // get the selected part and split it by linebreaks
        var split = qx.util.StringSplit.split(selectedValue, /\r\n/);

        // return the length substracted by the count of linebreaks
        // IE counts linebreaks as two chars
        // -> harmonize this to one char per linebreak
        return selectedValue.length - (split.length - 1);
      },

      "opera" : function(node)
      {
        var selectedValue, selectedLength, split;

        if (this.__isInputOrTextarea(node))
        {
          var start = node.selectionStart;
          var end = node.selectionEnd;

          selectedValue = node.value.substring(start, end);
          selectedLength = end - start;
        }
        else
        {
          selectedValue = qx.bom.Selection.get(node);
          selectedLength = selectedValue.length;
        }

        // get the selected part and split it by linebreaks
        split = qx.util.StringSplit.split(selectedValue, /\r\n/);

        // substract the count of linebreaks
        // Opera counts each linebreak as two chars
        // -> harmonize this to one char per linebreak
        return selectedLength - (split.length - 1);
      },

      // suitable for gecko and webkit
      "default" : function(node)
      {
        if (this.__isInputOrTextarea(node)) {
          return node.selectionEnd - node.selectionStart;
        } else {
          return this.get(node).length;
        }
      }
    }),


    /**
     * Returns the start of the selection
     *
     * @signature function(node)
     * @param node {Node} node to check for
     * @return {Integer} start of current selection or "-1" if the current
     *                   selection is not within the given node
     */
    getStart : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(node)
      {
        if (this.__isInputOrTextarea(node))
        {
          var documentRange = qx.bom.Range.get();

          // Check if the document.selection is the text range inside the input element
          if (!node.contains(documentRange.parentElement())) {
            return -1;
          }

          var range = qx.bom.Range.get(node);
          var len = node.value.length;

          // Synchronize range start and end points
          range.moveToBookmark(documentRange.getBookmark());
          range.moveEnd('character', len);

          return len - range.text.length;
        }
        else
        {
          var range = qx.bom.Range.get(node);
          var parentElement = range.parentElement();

          // get a range which holds the text of the parent element
          var elementRange = qx.bom.Range.get();
          try {
            // IE throws an invalid argument error when the document has no selection
            elementRange.moveToElementText(parentElement);
          } catch(ex) {
            return 0;
          }

          // Move end points of full range so it starts at the user selection
          // and ends at the end of the element text.
          var bodyRange = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));
          bodyRange.setEndPoint("StartToStart", range);
          bodyRange.setEndPoint("EndToEnd", elementRange);

          // selection is at beginning
          if (elementRange.compareEndPoints("StartToStart", bodyRange) == 0) {
            return 0;
          }

          var moved;
          var steps = 0;
          while (true)
          {
            moved = bodyRange.moveStart("character", -1);

            // Starting points of both ranges are equal
            if (elementRange.compareEndPoints("StartToStart", bodyRange) == 0) {
              break;
            }

            // Moving had no effect -> range is at begin of body
            if (moved == 0) {
              break;
            } else {
              steps++;
            }
          }

          return ++steps;
        }
      },

      "gecko|webkit" : function(node)
      {
        if (this.__isInputOrTextarea(node)) {
          return node.selectionStart;
        }
        else
        {
          var documentElement = qx.dom.Node.getDocument(node);
          var documentSelection = this.getSelectionObject(documentElement);

          // gecko and webkit do differ how the user selected the text
          // "left-to-right" or "right-to-left"
          if (documentSelection.anchorOffset < documentSelection.focusOffset) {
            return documentSelection.anchorOffset;
          } else {
            return documentSelection.focusOffset;
          }
        }
      },

      "default" : function(node)
      {
        if (this.__isInputOrTextarea(node)) {
          return node.selectionStart;
        } else {
          return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).anchorOffset;
        }
      }
    }),


    /**
     * Returns the end of the selection
     *
     * @signature function(node)
     * @param node {Node} node to check
     * @return {Integer} end of current selection
     */
    getEnd : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(node)
      {
        if (this.__isInputOrTextarea(node))
        {
          var documentRange = qx.bom.Range.get();

          // Check if the document.selection is the text range inside the input element
          if (!node.contains(documentRange.parentElement())) {
            return -1;
          }

          var range = qx.bom.Range.get(node);
          var len = node.value.length;

          // Synchronize range start and end points
          range.moveToBookmark(documentRange.getBookmark());
          range.moveStart('character', -len);

          return range.text.length;
        }
        else
        {
          var range = qx.bom.Range.get(node);
          var parentElement = range.parentElement();

          // get a range which holds the text of the parent element
          var elementRange = qx.bom.Range.get();
          try {
            // IE throws an invalid argument error when the document has no selection
            elementRange.moveToElementText(parentElement);
          } catch(ex) {
            return 0;
          }
          var len = elementRange.text.length;

          // Move end points of full range so it ends at the user selection
          // and starts at the start of the element text.
          var bodyRange = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));
          bodyRange.setEndPoint("EndToEnd", range);
          bodyRange.setEndPoint("StartToStart", elementRange);

          // selection is at beginning
          if (elementRange.compareEndPoints("EndToEnd", bodyRange) == 0) {
            return len-1;
          }

          var moved;
          var steps = 0;
          while (true)
          {
            moved = bodyRange.moveEnd("character", 1);

            // Ending points of both ranges are equal
            if (elementRange.compareEndPoints("EndToEnd", bodyRange) == 0) {
              break;
            }

            // Moving had no effect -> range is at begin of body
            if (moved == 0) {
              break;
            } else {
              steps++;
            }
          }

          return len - (++steps);
        }
      },

      "gecko|webkit" : function(node)
      {
        if (this.__isInputOrTextarea(node)) {
          return node.selectionEnd;
        }
        else
        {
          var documentElement = qx.dom.Node.getDocument(node);
          var documentSelection = this.getSelectionObject(documentElement);

          // gecko and webkit do differ how the user selected the text
          // "left-to-right" or "right-to-left"
          if (documentSelection.focusOffset > documentSelection.anchorOffset) {
            return documentSelection.focusOffset;
          } else {
            return documentSelection.anchorOffset;
          }
        }
      },

      "default" : function(node)
      {
        if (this.__isInputOrTextarea(node)) {
          return node.selectionEnd;
        } else {
          return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).focusOffset;
        }
      }
    }),


    /**
     * Utility method to check for an input or textarea element
     *
     * @param node {Node} node to check
     * @return {Boolean} Whether the given nodt is an input or textarea element
     */
    __isInputOrTextarea : function(node) {
      return qx.dom.Node.isElement(node) &&
            (node.nodeName.toLowerCase() == "input" ||
             node.nodeName.toLowerCase() == "textarea");
    },


    /**
     * Sets a selection at the given node with the given start and end.
     * For text nodes, input and textarea elements the start and end parameters
     * set the boundaries at the text.
     * For element nodes the start and end parameters are used to select the
     * childNodes of the given element.
     *
     * @signature function(node, start, end)
     * @param node {Node} node to set the selection at
     * @param start {Integer} start of the selection
     * @param end {Integer} end of the selection
     * @return {Boolean} whether a selection is drawn
     */
    set : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(node, start, end)
      {
        var rng;

        // if the node is the document itself then work on with the body element
        if (qx.dom.Node.isDocument(node)) {
          node = node.body;
        }

        if (qx.dom.Node.isElement(node) || qx.dom.Node.isText(node))
        {
          switch(node.nodeName.toLowerCase())
          {
            case "input":
            case "textarea":
            case "button":
              if (end === undefined)
              {
                end = node.value.length;
              }

              if (start >= 0 && start <= node.value.length && end >= 0 && end <= node.value.length)
              {
                rng = qx.bom.Range.get(node);
                rng.collapse(true);

                rng.moveStart("character", start);
                rng.moveEnd("character", end - start);
                rng.select();

                return true;
              }
              break;

            case "#text":
              if (end === undefined)
              {
                end = node.nodeValue.length;
              }

              if (start >= 0 && start <= node.nodeValue.length && end >= 0 && end <= node.nodeValue.length)
              {
                // get a range of the body element
                rng = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));

                // use the parent node -> "moveToElementText" expects an element
                rng.moveToElementText(node.parentNode);
                rng.collapse(true);

                rng.moveStart("character", start);
                rng.moveEnd("character", end - start);
                rng.select();

                return true;
              }
              break;

            default:
              if (end === undefined)
              {
                end = node.childNodes.length - 1;
              }

             // check start and end -> childNodes
             if (node.childNodes[start] && node.childNodes[end])
             {
               // get the TextRange of the body element
               // IMPORTANT: only with a range of the body the method "moveElementToText" is available
               rng = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));
               // position it at the given node
               rng.moveToElementText(node.childNodes[start]);
               rng.collapse(true);

               // create helper range
               var newRng = qx.bom.Range.get(qx.dom.Node.getBodyElement(node));
               newRng.moveToElementText(node.childNodes[end]);

               // set the end of the range to the end of the helper range
               rng.setEndPoint("EndToEnd", newRng);
               rng.select();

               return true;
             }
          }
        }

        return false;
      },

      // suitable for gecko, opera and webkit
      "default" : function(node, start, end)
      {
        // special handling for input and textarea elements
        var nodeName = node.nodeName.toLowerCase();
        if (qx.dom.Node.isElement(node) && (nodeName == "input" || nodeName == "textarea"))
        {
          // if "end" is not given set it to the end
          if (end === undefined) {
            end = node.value.length;
          }

          // check boundaries
          if (start >= 0 && start <= node.value.length && end >= 0 && end <= node.value.length)
          {
            node.focus();
            node.select();
            node.setSelectionRange(start, end);
            return true;
          }
        }
        else
        {
          var validBoundaries = false;
          var sel = qx.dom.Node.getWindow(node).getSelection();

          var rng = qx.bom.Range.get(node);

          // element or text node?
          // for elements nodes the offsets are applied to childNodes
          // for text nodes the offsets are applied to the text content
          if (qx.dom.Node.isText(node))
          {
            if (end === undefined) {
              end = node.length;
            }

            if (start >= 0 && start < node.length && end >= 0 && end <= node.length) {
              validBoundaries = true;
            }
          }
          else if (qx.dom.Node.isElement(node))
          {
            if (end === undefined) {
              end = node.childNodes.length - 1;
            }

            if (start >= 0 && node.childNodes[start] && end >= 0 && node.childNodes[end]) {
              validBoundaries = true;
            }
          }
          else if (qx.dom.Node.isDocument(node))
          {
            // work on with the body element
            node = node.body;

            if (end === undefined) {
              end = node.childNodes.length - 1;
            }

            if (start >= 0 && node.childNodes[start] && end >= 0 && node.childNodes[end]) {
              validBoundaries = true;
            }
          }

          if (validBoundaries)
          {
            // collapse the selection if needed
            if (!sel.isCollapsed) {
             sel.collapseToStart();
            }

            // set start and end of the range
            rng.setStart(node, start);

            // for element nodes set the end after the childNode
            if (qx.dom.Node.isText(node)) {
              rng.setEnd(node, end);
            } else {
              rng.setEndAfter(node.childNodes[end]);
            }

            // remove all existing ranges and add the new one
            if (sel.rangeCount > 0) {
              sel.removeAllRanges();
            }

            sel.addRange(rng);

            return true;
          }
        }

        return false;
      }
    }),


    /**
     * Selects all content/childNodes of the given node
     *
     * @param node {Node} text, element or document node
     * @return {Boolean} whether a selection is drawn
     */
    setAll : function(node) {
      return qx.bom.Selection.set(node, 0);
    },


    /**
     * Clears the selection on the given node.
     *
     * @param node {Node} node to clear the selection for
     */
    clear : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(node)
      {
        var sel = qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node));
        var rng = qx.bom.Range.get(node);
        var parent = rng.parentElement();

        var documentRange = qx.bom.Range.get(qx.dom.Node.getDocument(node));

        // only collapse if the selection is really on the given node
        // -> compare the two parent elements of the ranges with each other and
        // the given node
        if (parent == documentRange.parentElement() && parent == node) {
          sel.empty();
        }
      },

      "default" : function(node)
      {
        var sel = qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node));
        var nodeName = node.nodeName.toLowerCase();

        // if the node is an input or textarea element use the specialized methods
        if (qx.dom.Node.isElement(node) && (nodeName == "input" || nodeName == "textarea"))
        {
          // TODO: this leads Webkit to also focus the input/textarea element
          // which is NOT desired.
          // Additionally there is a bug in webkit with input/textarea elements
          // concerning the native selection and range object.
          // -> getting e.g. the startContainer/endContainer of the range returns
          // the text element (as expected) but webkit does embed this text node
          // into a lonely DIV element, so there us no chance to check if the
          // selection is currently at the input/textarea element to only perform
          // the "setSelectionRange" in the case the given node is REALLY selected.
          // Webkit bugzilla: https://bugs.webkit.org/show_bug.cgi?id=15903
          // qooxdoo bugzilla: http://bugzilla.qooxdoo.org/show_bug.cgi?id=1087
          node.setSelectionRange(0, 0);
          qx.bom.Element.blur(node);
        }
        // if the given node is the body/document node -> collapse the selection
        else if (qx.dom.Node.isDocument(node) || nodeName == "body")
        {
          sel.collapse(node.body ? node.body : node, 0);
        }
        // if an element/text node is given the current selection has to
        // encompass the node. Only then the selection is cleared.
        else
        {
          var rng = qx.bom.Range.get(node);
          if (!rng.collapsed)
          {
            var compareNode;
            var commonAncestor = rng.commonAncestorContainer;

            // compare the parentNode of the textNode with the given node
            // (if this node is an element) to decide whether the selection
            // is cleared or not.
            if (qx.dom.Node.isElement(node) && qx.dom.Node.isText(commonAncestor)) {
              compareNode = commonAncestor.parentNode;
            } else {
              compareNode = commonAncestor;
            }

            if (compareNode == node) {
              sel.collapse(node,0);
            }
          }
        }
      }
    })
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Alexander Steitz (aback)

************************************************************************ */



/**
 * Low-level Range API which is used together with the low-level Selection API.
 * This is especially useful whenever a developer want to work on text level,
 * e.g. for an editor.
 */
qx.Class.define("qx.bom.Range",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Returns the range object of the given node.
     *
     * @signature function(node)
     * @param node {Node} node to get the range of
     * @return {Range} valid range of given selection
     */
    get : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(node)
      {
        // check for the type of the given node
        // for IE the nodes input, textarea, button and body
        // have access to own TextRange objects. Everything else is
        // gathered via the selection object.
        if (qx.dom.Node.isElement(node))
        {
          switch(node.nodeName.toLowerCase())
          {
            case "input":

              switch(node.type)
              {
                case "text":
                case "password":
                case "hidden":
                case "button":
                case "reset":
                case "file":
                case "submit":
                  return node.createTextRange();
                  break;

                default:
                  return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).createRange();
              }
            break;

            case "textarea":
            case "body":
            case "button":
              return node.createTextRange();
            break;

            default:
              return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).createRange();
          }
        }
        else
        {
          if (node == null) {
            node = window;
          }

          // need to pass the document node to work with multi-documents
          return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(node)).createRange();
        }
      },

      // suitable for gecko, opera and webkit
      "default" : function(node)
      {
        var doc = qx.dom.Node.getDocument(node);

        // get the selection object of the corresponding document
        var sel = qx.bom.Selection.getSelectionObject(doc);

        if (sel.rangeCount > 0)
        {
          return sel.getRangeAt(0);
        }
        else
        {
          return doc.createRange();
        }
      }
    })
  }
});/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Adrian Olaru (adrianolaru)

   ======================================================================

   This class contains code based on the following work:

   * Cross-Browser Split
     http://blog.stevenlevithan.com/archives/cross-browser-split
     Version 1.0.1

     Copyright:
       (c) 2006-2007, Steven Levithan <http://stevenlevithan.com>

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

     Authors:
       * Steven Levithan

************************************************************************ */

/**
 * Implements an ECMA-compliant, uniform cross-browser split method
 */
qx.Class.define("qx.util.StringSplit",
{
  statics :
  {
    /**
     * ECMA-compliant, uniform cross-browser split method
     *
     * @param str {String} Incoming string to split
     * @param separator {RegExp} Specifies the character to use for separating the string.
     *   The separator is treated as a string or a  regular expression. If separator is
     *   omitted, the array returned contains one element consisting of the entire string.
     * @param limit {Integer?} Integer specifying a limit on the number of splits to be found.
     * @return {String[]} split string
     */
    split : function (str, separator, limit)
    {
      // if `separator` is not a regex, use the native `split`
      if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
        return String.prototype.split.call(str, separator, limit);
      }

      var output = [],
          lastLastIndex = 0,
          flags = (separator.ignoreCase ? "i" : "") +
                  (separator.multiline  ? "m" : "") +
                  (separator.sticky     ? "y" : ""),
          separator = RegExp(separator.source, flags + "g"), // make `global` and avoid `lastIndex` issues by working with a copy
          separator2, match, lastIndex, lastLength,
          compliantExecNpcg = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group

      str = str + ""; // type conversion

      if (!compliantExecNpcg) {
        separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
      }

      /* behavior for `limit`: if it's...
      - `undefined`: no limit.
      - `NaN` or zero: return an empty array.
      - a positive number: use `Math.floor(limit)`.
      - a negative number: no limit.
      - other: type-convert, then use the above rules. */
      if (limit === undefined || +limit < 0) {
        limit = Infinity;
      } else {
        limit = Math.floor(+limit);
        if (!limit) {
          return [];
        }
      }

      while (match = separator.exec(str))
      {
        lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser

        if (lastIndex > lastLastIndex) {
          output.push(str.slice(lastLastIndex, match.index));

          // fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
          if (!compliantExecNpcg && match.length > 1)
          {
            match[0].replace(separator2, function () {
              for (var i = 1; i < arguments.length - 2; i++)
              {
                if (arguments[i] === undefined) {
                  match[i] = undefined;
                }
              }
            });
          }

          if (match.length > 1 && match.index < str.length) {
            Array.prototype.push.apply(output, match.slice(1));
          }

          lastLength = match[0].length;
          lastLastIndex = lastIndex;

          if (output.length >= limit) {
            break;
          }
        }

        if (separator.lastIndex === match.index) {
          separator.lastIndex++; // avoid an infinite loop
        }
      }

      if (lastLastIndex === str.length)
      {
        if (lastLength || !separator.test("")) {
          output.push("");
        }
      } else {
        output.push(str.slice(lastLastIndex));
      }

      return output.length > limit ? output.slice(0, limit) : output;
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/**
 * This class supports typical DOM element inline events like scroll,
 * change, select, ...
 */
qx.Class.define("qx.event.handler.Element",
{
  extend : qx.core.Object,
  implement : qx.event.IEventHandler,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * Create a new instance
   *
   * @param manager {qx.event.Manager} Event manager for the window to use
   */
  construct : function(manager)
  {
    this.base(arguments);

    this._manager = manager;
    this._registeredEvents = {};
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Integer} Priority of this handler */
    PRIORITY : qx.event.Registration.PRIORITY_NORMAL,


    /** {Map} Supported event types */
    SUPPORTED_TYPES :
    {
      abort : true,    // Image elements
      load : true, // Image elements
      scroll : true,
      select : true,
      reset : true,    // Form Elements
      submit : true   // Form Elements
    },

    /** {MAP} Whether the event is cancelable */
    CANCELABLE :
    {
      selectstart: true
    },

    /** {Integer} Which target check to use */
    TARGET_CHECK : qx.event.IEventHandler.TARGET_DOMNODE,

    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : false
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type)
    {
      // Don't handle "load" event of Iframe. Unfortunately, both Element and
      // Iframe handler support "load" event. Should be handled by
      // qx.event.handler.Iframe only. Fixes [#BUG 4587].
      if (type === "load") {
        return target.tagName.toLowerCase() !== "iframe";
      } else {
        return true;
      }
    },


    // interface implementation
    registerEvent : function(target, type, capture)
    {
      var elementId = qx.core.ObjectRegistry.toHashCode(target);
      var eventId = elementId + "-" + type;

      var listener = qx.lang.Function.listener(this._onNative, this, eventId);
      qx.bom.Event.addNativeListener(target, type, listener);

      this._registeredEvents[eventId] =
      {
        element : target,
        type : type,
        listener : listener
      };
    },


    // interface implementation
    unregisterEvent : function(target, type, capture)
    {
      var events = this._registeredEvents;
      if (!events) {
        return;
      }

      var elementId = qx.core.ObjectRegistry.toHashCode(target);
      var eventId = elementId + "-" + type;

      var eventData = this._registeredEvents[eventId];
      if(eventData) {
        qx.bom.Event.removeNativeListener(target, type, eventData.listener);
      }

      delete this._registeredEvents[eventId];
    },



    /*
    ---------------------------------------------------------------------------
      EVENT-HANDLER
    ---------------------------------------------------------------------------
    */

    /**
     * Default event handler.
     *
     * @signature function(nativeEvent, eventId)
     * @param nativeEvent {Event} Native event
     * @param eventId {Integer} ID of the event (as stored internally)
     */
    _onNative : qx.event.GlobalError.observeMethod(function(nativeEvent, eventId)
    {
      var events = this._registeredEvents;
      if (!events) {
        return;
      }

      var eventData = events[eventId];
      var isCancelable = this.constructor.CANCELABLE[eventData.type];

      qx.event.Registration.fireNonBubblingEvent(
        eventData.element, eventData.type,
        qx.event.type.Native, [nativeEvent, undefined, undefined, undefined, isCancelable]
      );
    })
  },





  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    var entry;
    var events = this._registeredEvents;

    for (var id in events)
    {
      entry = events[id];
      qx.bom.Event.removeNativeListener(entry.element, entry.type, entry.listener);
    }

    this._manager = this._registeredEvents = null;
  },






  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.event.Registration.addHandler(statics);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/* ************************************************************************

#require(qx.event.handler.UserAction)
#ignore(qx.event.handler.DragDrop)

************************************************************************ */

/**
 * This class provides an unified mouse event handler for Internet Explorer,
 * Firefox, Opera and Safari
 */
qx.Class.define("qx.event.handler.Mouse",
{
  extend : qx.core.Object,
  implement : qx.event.IEventHandler,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * Create a new instance
   *
   * @param manager {qx.event.Manager} Event manager for the window to use
   */
  construct : function(manager)
  {
    this.base(arguments);

    // Define shorthands
    this.__manager = manager;
    this.__window = manager.getWindow();
    this.__root = this.__window.document;

    // Initialize observers
    this._initButtonObserver();
    this._initMoveObserver();
    this._initWheelObserver();
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Integer} Priority of this handler */
    PRIORITY : qx.event.Registration.PRIORITY_NORMAL,

    /** {Map} Supported event types */
    SUPPORTED_TYPES :
    {
      mousemove : 1,
      mouseover : 1,
      mouseout : 1,
      mousedown : 1,
      mouseup : 1,
      click : 1,
      dblclick : 1,
      contextmenu : 1,
      mousewheel : 1
    },

    /** {Integer} Which target check to use */
    TARGET_CHECK : qx.event.IEventHandler.TARGET_DOMNODE + qx.event.IEventHandler.TARGET_DOCUMENT + qx.event.IEventHandler.TARGET_WINDOW,

    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : true
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __onButtonEventWrapper : null,
    __onMoveEventWrapper : null,
    __onWheelEventWrapper : null,
    __lastEventType : null,
    __lastMouseDownTarget : null,
    __manager : null,
    __window : null,
    __root : null,




    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type) {},


    // interface implementation
    // The iPhone requires for attaching mouse events natively to every element which
    // should react on mouse events. As of version 3.0 it also requires to keep the
    // listeners as long as the event should work. In 2.0 it was enough to attach the
    // listener once.
    registerEvent : qx.core.Environment.get("os.name") === "ios" ?
      function(target, type, capture) {
        target["on" + type] = (function() {return null;});
      } : (function() {return null;}),


    // interface implementation
    unregisterEvent : qx.core.Environment.get("os.name") === "ios" ?
      function(target, type, capture) {
        target["on" + type] = undefined;
      } : (function() {return null;}),




    /*
    ---------------------------------------------------------------------------
      HELPER
    ---------------------------------------------------------------------------
    */


    /**
     * Fire a mouse event with the given parameters
     *
     * @param domEvent {Event} DOM event
     * @param type {String} type of the event
     * @param target {Element} event target
     */
    __fireEvent : function(domEvent, type, target)
    {
      if (!target) {
        target = qx.bom.Event.getTarget(domEvent);
      }

      // we need a true node for the fireEvent
      // e.g. when hovering over text of disabled textfields IE is returning
      // an empty object as "srcElement"
      if (target && target.nodeType)
      {
        qx.event.Registration.fireEvent(
          target,
          type||domEvent.type,
          type == "mousewheel" ? qx.event.type.MouseWheel : qx.event.type.Mouse,
          [domEvent, target, null, true, true]
        );
      }

      // Fire user action event
      qx.event.Registration.fireEvent(this.__window, "useraction", qx.event.type.Data, [type||domEvent.type]);
    },


    /**
     * Internal target for checking the target and mouse type for mouse
     * scrolling on a feature detection base.
     *
     * @return {Map} A map containing two keys, target and type.
     */
    __getMouseWheelTarget: function(){
      // Fix for bug #3234
      var targets = [this.__window, this.__root, this.__root.body];
      var target = this.__window;
      var type = "DOMMouseScroll";

      for (var i = 0; i < targets.length; i++) {
        if (qx.bom.Event.supportsEvent(targets[i], "mousewheel")) {
          type = "mousewheel";
          target = targets[i];
          break;
        }
      };

      return {type: type, target: target};
    },






    /*
    ---------------------------------------------------------------------------
      OBSERVER INIT
    ---------------------------------------------------------------------------
    */

    /**
     * Initializes the native mouse button event listeners.
     *
     * @signature function()
     */
    _initButtonObserver : function()
    {
      this.__onButtonEventWrapper = qx.lang.Function.listener(this._onButtonEvent, this);

      var Event = qx.bom.Event;

      Event.addNativeListener(this.__root, "mousedown", this.__onButtonEventWrapper);
      Event.addNativeListener(this.__root, "mouseup", this.__onButtonEventWrapper);
      Event.addNativeListener(this.__root, "click", this.__onButtonEventWrapper);
      Event.addNativeListener(this.__root, "dblclick", this.__onButtonEventWrapper);
      Event.addNativeListener(this.__root, "contextmenu", this.__onButtonEventWrapper);
    },


    /**
     * Initializes the native mouse move event listeners.
     *
     * @signature function()
     */
    _initMoveObserver : function()
    {
      this.__onMoveEventWrapper = qx.lang.Function.listener(this._onMoveEvent, this);

      var Event = qx.bom.Event;

      Event.addNativeListener(this.__root, "mousemove", this.__onMoveEventWrapper);
      Event.addNativeListener(this.__root, "mouseover", this.__onMoveEventWrapper);
      Event.addNativeListener(this.__root, "mouseout", this.__onMoveEventWrapper);
    },


    /**
     * Initializes the native mouse wheel event listeners.
     *
     * @signature function()
     */
    _initWheelObserver : function()
    {
      this.__onWheelEventWrapper = qx.lang.Function.listener(this._onWheelEvent, this);
      var data = this.__getMouseWheelTarget();
      qx.bom.Event.addNativeListener(
        data.target, data.type, this.__onWheelEventWrapper
      );
    },






    /*
    ---------------------------------------------------------------------------
      OBSERVER STOP
    ---------------------------------------------------------------------------
    */

    /**
     * Disconnects the native mouse button event listeners.
     *
     * @signature function()
     */
    _stopButtonObserver : function()
    {
      var Event = qx.bom.Event;

      Event.removeNativeListener(this.__root, "mousedown", this.__onButtonEventWrapper);
      Event.removeNativeListener(this.__root, "mouseup", this.__onButtonEventWrapper);
      Event.removeNativeListener(this.__root, "click", this.__onButtonEventWrapper);
      Event.removeNativeListener(this.__root, "dblclick", this.__onButtonEventWrapper);
      Event.removeNativeListener(this.__root, "contextmenu", this.__onButtonEventWrapper);
    },


    /**
     * Disconnects the native mouse move event listeners.
     *
     * @signature function()
     */
    _stopMoveObserver : function()
    {
      var Event = qx.bom.Event;

      Event.removeNativeListener(this.__root, "mousemove", this.__onMoveEventWrapper);
      Event.removeNativeListener(this.__root, "mouseover", this.__onMoveEventWrapper);
      Event.removeNativeListener(this.__root, "mouseout", this.__onMoveEventWrapper);
    },


    /**
     * Disconnects the native mouse wheel event listeners.
     *
     * @signature function()
     */
    _stopWheelObserver : function()
    {
      var data = this.__getMouseWheelTarget();
      qx.bom.Event.removeNativeListener(
        data.target, data.type, this.__onWheelEventWrapper
      );
    },






    /*
    ---------------------------------------------------------------------------
      NATIVE EVENT OBSERVERS
    ---------------------------------------------------------------------------
    */

    /**
     * Global handler for all mouse move related events like "mousemove",
     * "mouseout" and "mouseover".
     *
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event
     */
    _onMoveEvent : qx.event.GlobalError.observeMethod(function(domEvent) {
      this.__fireEvent(domEvent);
    }),


    /**
     * Global handler for all mouse button related events like "mouseup",
     * "mousedown", "click", "dblclick" and "contextmenu".
     *
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event
     */
    _onButtonEvent : qx.event.GlobalError.observeMethod(function(domEvent)
    {
      var type = domEvent.type;
      var target = qx.bom.Event.getTarget(domEvent);

      // Safari (and maybe gecko) takes text nodes as targets for events
      // See: http://www.quirksmode.org/js/events_properties.html
      if (
        qx.core.Environment.get("engine.name") == "gecko" ||
        qx.core.Environment.get("engine.name") == "webkit"
      ) {
        if (target && target.nodeType == 3) {
          target = target.parentNode;
        }
      }

      // prevent click events on drop during Drag&Drop [BUG #6846]
      var isDrag = qx.event.handler.DragDrop &&
        this.__manager.getHandler(qx.event.handler.DragDrop).isSessionActive();
      if (isDrag && type == "click") {
        return;
      }

      if (this.__rightClickFixPre) {
        this.__rightClickFixPre(domEvent, type, target);
      }

      if (this.__doubleClickFixPre) {
        this.__doubleClickFixPre(domEvent, type, target);
      }

      this.__fireEvent(domEvent, type, target);

      if (this.__rightClickFixPost) {
        this.__rightClickFixPost(domEvent, type, target);
      }

      if (this.__differentTargetClickFixPost && !isDrag) {
        this.__differentTargetClickFixPost(domEvent, type, target);
      }

      this.__lastEventType = type;
    }),


    /**
     * Global handler for the mouse wheel event.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event
     */
    _onWheelEvent : qx.event.GlobalError.observeMethod(function(domEvent) {
      this.__fireEvent(domEvent, "mousewheel");
    }),







    /*
    ---------------------------------------------------------------------------
      CROSS BROWSER SUPPORT FIXES
    ---------------------------------------------------------------------------
    */

    /**
     * Normalizes the click sequence of right click events in Webkit and Opera.
     * The normalized sequence is:
     *
     *  1. mousedown  <- not fired by Webkit
     *  2. mouseup  <- not fired by Webkit
     *  3. contextmenu <- not fired by Opera
     *
     * @param domEvent {Event} original DOM event
     * @param type {String} event type
     * @param target {Element} event target of the DOM event.
     *
     * @signature function(domEvent, type, target)
     */
    __rightClickFixPre : qx.core.Environment.select("engine.name",
    {
      "webkit" : function(domEvent, type, target)
      {
        // The webkit bug has been fixed in Safari 4
        if (parseFloat(qx.core.Environment.get("engine.version")) < 530)
        {
          if (type == "contextmenu") {
            this.__fireEvent(domEvent, "mouseup", target);
          }
        }
      },

      "default" : null
    }),


    /**
     * Normalizes the click sequence of right click events in Webkit and Opera.
     * The normalized sequence is:
     *
     *  1. mousedown  <- not fired by Webkit
     *  2. mouseup  <- not fired by Webkit
     *  3. contextmenu <- not fired by Opera
     *
     * @param domEvent {Event} original DOM event
     * @param type {String} event type
     * @param target {Element} event target of the DOM event.
     *
     * @signature function(domEvent, type, target)
     */
    __rightClickFixPost : qx.core.Environment.select("engine.name",
    {
      "opera" : function(domEvent, type, target)
      {
        if (type =="mouseup" && domEvent.button == 2) {
          this.__fireEvent(domEvent, "contextmenu", target);
        }
      },

      "default" : null
    }),


    /**
     * Normalizes the click sequence of double click event in the Internet
     * Explorer. The normalized sequence is:
     *
     *  1. mousedown
     *  2. mouseup
     *  3. click
     *  4. mousedown  <- not fired by IE
     *  5. mouseup
     *  6. click  <- not fired by IE
     *  7. dblclick
     *
     *  Note: This fix is only applied, when the IE event model is used, otherwise
     *  the fix is ignored.
     *
     * @param domEvent {Event} original DOM event
     * @param type {String} event type
     * @param target {Element} event target of the DOM event.
     *
     * @signature function(domEvent, type, target)
     */
    __doubleClickFixPre : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(domEvent, type, target)
      {
        // Do only apply the fix when the event is from the IE event model,
        // otherwise do not apply the fix.
        if (domEvent.target !== undefined) {
          return;
        }

        if (type == "mouseup" && this.__lastEventType == "click") {
          this.__fireEvent(domEvent, "mousedown", target);
        } else if (type == "dblclick") {
          this.__fireEvent(domEvent, "click", target);
        }
      },

      "default" : null
    }),


    /**
     * If the mouseup event happens on a different target than the corresponding
     * mousedown event the internet explorer dispatches a click event on the
     * first common ancestor of both targets. The presence of this click event
     * is essential for the qooxdoo widget system. All other browsers don't fire
     * the click event so it must be emulated.
     *
     * @param domEvent {Event} original DOM event
     * @param type {String} event type
     * @param target {Element} event target of the DOM event.
     *
     * @signature function(domEvent, type, target)
     */
    __differentTargetClickFixPost : qx.core.Environment.select("engine.name",
    {
      "mshtml" : null,

      "default" : function(domEvent, type, target)
      {
        switch (type)
        {
          case "mousedown":
            this.__lastMouseDownTarget = target;
            break;

          case "mouseup":
            if (target !== this.__lastMouseDownTarget)
            {
              var commonParent = qx.dom.Hierarchy.getCommonParent(target, this.__lastMouseDownTarget);
              if (commonParent) {
                this.__fireEvent(domEvent, "click", commonParent);
              }
            }
        }
      }
    })
  },





  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this._stopButtonObserver();
    this._stopMoveObserver();
    this._stopWheelObserver();

    this.__manager = this.__window = this.__root =
      this.__lastMouseDownTarget = null;
  },





  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.event.Registration.addHandler(statics);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * Mouse event object.
 *
 * the interface of this class is based on the DOM Level 2 mouse event
 * interface: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents
 */
qx.Class.define("qx.event.type.Mouse",
{
  extend : qx.event.type.Dom,




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // overridden
    _cloneNativeEvent : function(nativeEvent, clone)
    {
      var clone = this.base(arguments, nativeEvent, clone);

      clone.button = nativeEvent.button;
      clone.clientX = nativeEvent.clientX;
      clone.clientY = nativeEvent.clientY;
      clone.pageX = nativeEvent.pageX;
      clone.pageY = nativeEvent.pageY;
      clone.screenX = nativeEvent.screenX;
      clone.screenY = nativeEvent.screenY;
      clone.wheelDelta = nativeEvent.wheelDelta;
      clone.wheelDeltaX = nativeEvent.wheelDeltaX;
      clone.wheelDeltaY = nativeEvent.wheelDeltaY;
      clone.detail = nativeEvent.detail;
      clone.axis = nativeEvent.axis;
      clone.wheelX = nativeEvent.wheelX;
      clone.wheelY = nativeEvent.wheelY;
      clone.HORIZONTAL_AXIS = nativeEvent.HORIZONTAL_AXIS;
      clone.srcElement = nativeEvent.srcElement;
      clone.target = nativeEvent.target;

      return clone;
    },


    /**
     * {Map} Contains the button ID to identifier data.
     *
     * @lint ignoreReferenceField(__buttonsDom2EventModel)
     */
    __buttonsDom2EventModel :
    {
      0 : "left",
      2 : "right",
      1 : "middle"
    },


    /**
     * {Map} Contains the button ID to identifier data.
     *
     * @lint ignoreReferenceField(__buttonsMshtmlEventModel)
     */
    __buttonsMshtmlEventModel :
    {
      1 : "left",
      2 : "right",
      4 : "middle"
    },


    // overridden
    stop : function() {
      this.stopPropagation();
    },


    /**
     * During mouse events caused by the depression or release of a mouse button,
     * this method can be used to check which mouse button changed state.
     *
     * Only internet explorer can compute the button during mouse move events. For
     * all other browsers the button only contains sensible data during
     * "click" events like "click", "dblclick", "mousedown", "mouseup" or "contextmenu".
     *
     * But still, browsers act different on click:
     * <pre>
     * <- = left mouse button
     * -> = right mouse button
     * ^  = middle mouse button
     *
     * Browser | click, dblclick | contextmenu
     * ---------------------------------------
     * Firefox | <- ^ ->         | ->
     * Chrome  | <- ^            | ->
     * Safari  | <- ^            | ->
     * IE      | <- (^ is <-)    | ->
     * Opera   | <-              | -> (twice)
     * </pre>
     *
     * @return {String} One of "left", "right", "middle" or "none"
     */
    getButton : function()
    {
      switch(this._type)
      {
        case "contextmenu":
          return "right";

        case "click":
          // IE does not support buttons on click --> assume left button
          if (qx.core.Environment.get("browser.name") === "ie" &&
          qx.core.Environment.get("browser.documentmode") < 9)
          {
            return "left";
          }

        default:
          if (this._native.target !== undefined) {
            return this.__buttonsDom2EventModel[this._native.button] || "none";
          } else {
            return this.__buttonsMshtmlEventModel[this._native.button] || "none";
          }
      }
    },


    /**
     * Whether the left button is pressed
     *
     * @return {Boolean} true when the left button is pressed
     */
    isLeftPressed : function() {
      return this.getButton() === "left";
    },


    /**
     * Whether the middle button is pressed
     *
     * @return {Boolean} true when the middle button is pressed
     */
    isMiddlePressed : function() {
      return this.getButton() === "middle";
    },


    /**
     * Whether the right button is pressed
     *
     * @return {Boolean} true when the right button is pressed
     */
    isRightPressed : function() {
      return this.getButton() === "right";
    },


    /**
     * Get a secondary event target related to an UI event. This attribute is
     * used with the mouseover event to indicate the event target which the
     * pointing device exited and with the mouseout event to indicate the
     * event target which the pointing device entered.
     *
     * @return {Element} The secondary event target.
     * @signature function()
     */
    getRelatedTarget : function() {
      return this._relatedTarget;
    },


    /**
     * Get the he horizontal coordinate at which the event occurred relative
     * to the viewport.
     *
     * @return {Integer} The horizontal mouse position
     */
    getViewportLeft : function() {
      return this._native.clientX;
    },


    /**
     * Get the vertical coordinate at which the event occurred relative
     * to the viewport.
     *
     * @return {Integer} The vertical mouse position
     * @signature function()
     */
    getViewportTop : function() {
      return this._native.clientY;
    },


    /**
     * Get the horizontal position at which the event occurred relative to the
     * left of the document. This property takes into account any scrolling of
     * the page.
     *
     * @return {Integer} The horizontal mouse position in the document.
     */
    getDocumentLeft : function()
    {
      if (this._native.pageX !== undefined) {
        return this._native.pageX;
      } else {
        var win = qx.dom.Node.getWindow(this._native.srcElement);
        return this._native.clientX + qx.bom.Viewport.getScrollLeft(win);
      }
    },


    /**
     * Get the vertical position at which the event occurred relative to the
     * top of the document. This property takes into account any scrolling of
     * the page.
     *
     * @return {Integer} The vertical mouse position in the document.
     */
    getDocumentTop : function()
    {
      if (this._native.pageY !== undefined) {
        return this._native.pageY;
      } else {
        var win = qx.dom.Node.getWindow(this._native.srcElement);
        return this._native.clientY + qx.bom.Viewport.getScrollTop(win);
      }
    },


    /**
     * Get the horizontal coordinate at which the event occurred relative to
     * the origin of the screen coordinate system.
     *
     * Note: This value is usually not very useful unless you want to
     * position a native popup window at this coordinate.
     *
     * @return {Integer} The horizontal mouse position on the screen.
     */
    getScreenLeft : function() {
      return this._native.screenX;
    },


    /**
     * Get the vertical coordinate at which the event occurred relative to
     * the origin of the screen coordinate system.
     *
     * Note: This value is usually not very useful unless you want to
     * position a native popup window at this coordinate.
     *
     * @return {Integer} The vertical mouse position on the screen.
     */
    getScreenTop : function() {
      return this._native.screenY;
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Mouse wheel event object.
 */
qx.Class.define("qx.event.type.MouseWheel",
{
  extend : qx.event.type.Mouse,

  statics : {
    /**
     * The maximal mesured scroll wheel delta.
     * @internal
     */
    MAXSCROLL : null,

    /**
     * The minimal mesured scroll wheel delta.
     * @internal
     */
    MINSCROLL : null,

    /**
     * The normalization factor for the speed calculation.
     * @internal
     */
    FACTOR : 1
  },

  members :
  {
    // overridden
    stop : function()
    {
      this.stopPropagation();
      this.preventDefault();
    },


    /**
     * Normalizer for the mouse wheel data.
     *
     * @param delta {Number} The mouse delta.
     * @return {Number} The normalized delta value
     */
    __normalize : function(delta) {
      var absDelta = Math.abs(delta);

      // store the min value
      if (
        qx.event.type.MouseWheel.MINSCROLL == null ||
        qx.event.type.MouseWheel.MINSCROLL > absDelta
      ) {
        qx.event.type.MouseWheel.MINSCROLL = absDelta;
        this.__recalculateMultiplicator();
      }

      // store the max value
      if (
        qx.event.type.MouseWheel.MAXSCROLL == null ||
        qx.event.type.MouseWheel.MAXSCROLL < absDelta
      ) {
        qx.event.type.MouseWheel.MAXSCROLL = absDelta;
        this.__recalculateMultiplicator();
      }

      // special case for systems not speeding up
      if (
        qx.event.type.MouseWheel.MAXSCROLL === absDelta &&
        qx.event.type.MouseWheel.MINSCROLL === absDelta
      ) {
        return 2 * (delta / absDelta);
      }

      var range =
        qx.event.type.MouseWheel.MAXSCROLL - qx.event.type.MouseWheel.MINSCROLL;
      var ret = (delta / range) * Math.log(range) * qx.event.type.MouseWheel.FACTOR;

      // return at least 1 or -1
      return ret < 0 ? Math.min(ret, -1) : Math.max(ret, 1);
    },


    /**
     * Recalculates the factor with which the calculated delta is normalized.
     */
    __recalculateMultiplicator : function() {
      var max = qx.event.type.MouseWheel.MAXSCROLL || 0;
      var min = qx.event.type.MouseWheel.MINSCROLL || max;
      if (max <= min) {
        return;
      }
      var range = max - min;
      var maxRet = (max / range) * Math.log(range);
      if (maxRet == 0) {
        maxRet = 1;
      }
      qx.event.type.MouseWheel.FACTOR = 6 / maxRet;
    },


    /**
     * Get the amount the wheel has been scrolled
     *
     * @param axis {String?} Optional parameter which definex the scroll axis.
     *   The value can either be <code>"x"</code> or <code>"y"</code>.
     * @return {Integer} Scroll wheel movement for the given axis. If no axis
     *   is given, the y axis is used.
     */
    getWheelDelta : function(axis) {
      var e = this._native;

      // default case
      if (axis === undefined) {
        if (delta === undefined) {
          // default case
          var delta = -e.wheelDelta;
          if (e.wheelDelta === undefined) {
            delta = e.detail;
          }
        }
        return this.__convertWheelDelta(delta);
      }

      // get the x scroll delta
      if (axis === "x") {
        var x = 0;
        if (e.wheelDelta !== undefined) {
          if (e.wheelDeltaX !== undefined) {
            x = e.wheelDeltaX ? this.__convertWheelDelta(-e.wheelDeltaX) : 0;
          }
        } else {
          if (e.axis && e.axis == e.HORIZONTAL_AXIS) {
            x = this.__convertWheelDelta(e.detail);
          }
        }
        return x;
      }

      // get the y scroll delta
      if (axis === "y") {
        var y = 0;
        if (e.wheelDelta !== undefined) {
          if (e.wheelDeltaY !== undefined) {
            y = e.wheelDeltaY ? this.__convertWheelDelta(-e.wheelDeltaY) : 0;
          } else {
            y = this.__convertWheelDelta(-e.wheelDelta);
          }
        } else {
          if (!(e.axis && e.axis == e.HORIZONTAL_AXIS)) {
            y = this.__convertWheelDelta(e.detail);
          }
        }
        return y;
      }

      // default case, return 0
      return 0;
    },


    /**
     * Get the amount the wheel has been scrolled
     *
     * @param delta {Integer} The delta which is given by the mouse event.
     * @return {Integer} Scroll wheel movement
     */
    __convertWheelDelta : function(delta) {
      // new feature detectiong behavior
      if (qx.core.Environment.get("qx.dynamicmousewheel")) {
        return this.__normalize(delta);

      // old, browser detecting behavior
      } else {
        var handler = qx.core.Environment.select("engine.name", {
          "default" : function() {
            return delta / 40;
          },

          "gecko" : function() {
            return delta;
          },

          "webkit" : function()
          {
            if (qx.core.Environment.get("browser.name") == "chrome") {
              // mac has a much higher sppedup during scrolling
              if (qx.core.Environment.get("os.name") == "osx") {
                return delta / 60;
              } else {
                return delta / 120;
              }

            } else {
              // windows safaris behave different than on OSX
              if (qx.core.Environment.get("os.name") == "win") {
                var factor = 120;
                // safari 5.0 and not 5.0.1
                if (parseFloat(qx.core.Environment.get("engine.version")) == 533.16) {
                  factor = 1200;
                }
              } else {
                factor = 40;
                // Safari 5.0 or 5.0.1
                if (
                  parseFloat(qx.core.Environment.get("engine.version")) == 533.16 ||
                  parseFloat(qx.core.Environment.get("engine.version")) == 533.17 ||
                  parseFloat(qx.core.Environment.get("engine.version")) == 533.18
                ) {
                  factor = 1200;
                }
              }
              return delta / factor;
            }
          }
        });
        return handler.call(this);
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

   ======================================================================

   This class contains code based on the following work:

   * Prototype JS
     http://www.prototypejs.org/
     Version 1.5

     Copyright:
       (c) 2006-2007, Prototype Core Team

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

     Authors:
       * Prototype Core Team

   ----------------------------------------------------------------------

     Copyright (c) 2005-2008 Sam Stephenson

     Permission is hereby granted, free of charge, to any person
     obtaining a copy of this software and associated documentation
     files (the "Software"), to deal in the Software without restriction,
     including without limitation the rights to use, copy, modify, merge,
     publish, distribute, sublicense, and/or sell copies of the Software,
     and to permit persons to whom the Software is furnished to do so,
     subject to the following conditions:

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
     DEALINGS IN THE SOFTWARE.

************************************************************************ */

/**
 * Methods to operate on nodes and elements on a DOM tree. This contains
 * special getters to query for child nodes, siblings, etc. This class also
 * supports to operate on one element and reorganize the content with
 * the insertion of new HTML or nodes.
 */
qx.Bootstrap.define("qx.dom.Hierarchy",
{
  statics :
  {
    /**
     * Returns the DOM index of the given node
     *
     * @param node {Node} Node to look for
     * @return {Integer} The DOM index
     */
    getNodeIndex : function(node)
    {
      var index = 0;

      while (node && (node = node.previousSibling)) {
        index++;
      }

      return index;
    },


    /**
     * Returns the DOM index of the given element (ignoring non-elements)
     *
     * @param element {Element} Element to look for
     * @return {Integer} The DOM index
     */
    getElementIndex : function(element)
    {
      var index = 0;
      var type = qx.dom.Node.ELEMENT;

      while (element && (element = element.previousSibling))
      {
        if (element.nodeType == type) {
          index++;
        }
      }

      return index;
    },


    /**
     * Return the next element to the supplied element
     *
     * "nextSibling" is not good enough as it might return a text or comment element
     *
     * @param element {Element} Starting element node
     * @return {Element | null} Next element node
     */
    getNextElementSibling : function(element)
    {
      while (element && (element = element.nextSibling) && !qx.dom.Node.isElement(element)) {
        continue;
      }

      return element || null;
    },


    /**
     * Return the previous element to the supplied element
     *
     * "previousSibling" is not good enough as it might return a text or comment element
     *
     * @param element {Element} Starting element node
     * @return {Element | null} Previous element node
     */
    getPreviousElementSibling : function(element)
    {
      while (element && (element = element.previousSibling) && !qx.dom.Node.isElement(element)) {
        continue;
      }

      return element || null;
    },


    /**
     * Whether the first element contains the second one
     *
     * Uses native non-standard contains() in Internet Explorer,
     * Opera and Webkit (supported since Safari 3.0 beta)
     *
     * @param element {Element} Parent element
     * @param target {Node} Child node
     * @return {Boolean}
     */
    contains : function(element, target)
    {
      if (qx.core.Environment.get("html.element.contains")) {
        if (qx.dom.Node.isDocument(element))
        {
          var doc = qx.dom.Node.getDocument(target);
          return element && doc == element;
        }
        else if (qx.dom.Node.isDocument(target))
        {
          return false;
        }
        else
        {
          return element.contains(target);
        }
      }
      else if (qx.core.Environment.get("html.element.compareDocumentPosition")) {
        // http://developer.mozilla.org/en/docs/DOM:Node.compareDocumentPosition
        return !!(element.compareDocumentPosition(target) & 16);
      }
      else {
        while(target)
        {
          if (element == target) {
            return true;
          }

          target = target.parentNode;
        }

        return false;
      }
    },

    /**
     * Whether the element is inserted into the document
     * for which it was created.
     *
     * @param element {Element} DOM element to check
     * @return {Boolean} <code>true</code> when the element is inserted
     *    into the document.
     */
    isRendered : function(element)
    {
      var doc = element.ownerDocument || element.document;

      if (qx.core.Environment.get("html.element.contains")) {
        // Fast check for all elements which are not in the DOM
        if (!element.parentNode || !element.offsetParent) {
          return false;
        }

        return doc.body.contains(element);
      }
      else if (qx.core.Environment.get("html.element.compareDocumentPosition")) {
        // Gecko way, DOM3 method
        return !!(doc.compareDocumentPosition(element) & 16);
      }
      else {
        while(element)
        {
          if (element == doc.body) {
            return true;
          }

          element = element.parentNode;
        }

        return false;
      }
    },


    /**
     * Checks if <code>element</code> is a descendant of <code>ancestor</code>.
     *
     * @param element {Element} first element
     * @param ancestor {Element} second element
     * @return {Boolean} Element is a descendant of ancestor
     */
    isDescendantOf : function(element, ancestor) {
      return this.contains(ancestor, element);
    },


    /**
     * Get the common parent element of two given elements. Returns
     * <code>null</code> when no common element has been found.
     *
     * Uses native non-standard contains() in Opera and Internet Explorer
     *
     * @param element1 {Element} First element
     * @param element2 {Element} Second element
     * @return {Element} the found parent, if none was found <code>null</code>
     */
    getCommonParent : function(element1, element2)
    {
      if (element1 === element2) {
        return element1;
      }

      if (qx.core.Environment.get("html.element.contains")) {
        while (element1 && qx.dom.Node.isElement(element1))
        {
          if (element1.contains(element2)) {
            return element1;
          }

          element1 = element1.parentNode;
        }

        return null;
      }
      else {
        var known = [];

        while (element1 || element2)
        {
          if (element1)
          {
            if (qx.lang.Array.contains(known, element1)) {
              return element1;
            }

            known.push(element1);
            element1 = element1.parentNode;
          }

          if (element2)
          {
            if (qx.lang.Array.contains(known, element2)) {
              return element2;
            }

            known.push(element2);
            element2 = element2.parentNode;
          }
        }

        return null;
      }
    },


    /**
     * Collects all of element's ancestors and returns them as an array of
     * elements.
     *
     * @param element {Element} DOM element to query for ancestors
     * @return {Array} list of all parents
     */
    getAncestors : function(element) {
      return this._recursivelyCollect(element, "parentNode");
    },


    /**
     * Returns element's children.
     *
     * @param element {Element} DOM element to query for child elements
     * @return {Array} list of all child elements
     */
    getChildElements : function(element)
    {
      element = element.firstChild;

      if (!element) {
        return [];
      }

      var arr = this.getNextSiblings(element);

      if (element.nodeType === 1) {
        arr.unshift(element);
      }

      return arr;
    },


    /**
     * Collects all of element's descendants (deep) and returns them as an array
     * of elements.
     *
     * @param element {Element} DOM element to query for child elements
     * @return {Array} list of all found elements
     */
    getDescendants : function(element) {
      return qx.lang.Array.fromCollection(element.getElementsByTagName("*"));
    },


    /**
     * Returns the first child that is an element. This is opposed to firstChild DOM
     * property which will return any node (whitespace in most usual cases).
     *
     * @param element {Element} DOM element to query for first descendant
     * @return {Element} the first descendant
     */
    getFirstDescendant : function(element)
    {
      element = element.firstChild;

      while (element && element.nodeType != 1) {
        element = element.nextSibling;
      }

      return element;
    },


    /**
     * Returns the last child that is an element. This is opposed to lastChild DOM
     * property which will return any node (whitespace in most usual cases).
     *
     * @param element {Element} DOM element to query for last descendant
     * @return {Element} the last descendant
     */
    getLastDescendant : function(element)
    {
      element = element.lastChild;

      while (element && element.nodeType != 1) {
        element = element.previousSibling;
      }

      return element;
    },


    /**
     * Collects all of element's previous siblings and returns them as an array of elements.
     *
     * @param element {Element} DOM element to query for previous siblings
     * @return {Array} list of found DOM elements
     */
    getPreviousSiblings : function(element) {
      return this._recursivelyCollect(element, "previousSibling");
    },


    /**
     * Collects all of element's next siblings and returns them as an array of
     * elements.
     *
     * @param element {Element} DOM element to query for next siblings
     * @return {Array} list of found DOM elements
     */
    getNextSiblings : function(element) {
      return this._recursivelyCollect(element, "nextSibling");
    },


    /**
     * Recursively collects elements whose relationship is specified by
     * property.  <code>property</code> has to be a property (a method won't
     * do!) of element that points to a single DOM node. Returns an array of
     * elements.
     *
     * @param element {Element} DOM element to start with
     * @param property {String} property to look for
     * @return {Array} result list
     */
    _recursivelyCollect : function(element, property)
    {
      var list = [];

      while (element = element[property])
      {
        if (element.nodeType == 1) {
          list.push(element);
        }
      }

      return list;
    },


    /**
     * Collects all of element's siblings and returns them as an array of elements.
     *
     * @param element {var} DOM element to start with
     * @return {Array} list of all found siblings
     */
    getSiblings : function(element) {
      return this.getPreviousSiblings(element).reverse().concat(this.getNextSiblings(element));
    },


    /**
     * Whether the given element is empty.
     * Inspired by Base2 (Dean Edwards)
     *
     * @param element {Element} The element to check
     * @return {Boolean} true when the element is empty
     */
    isEmpty : function(element)
    {
      element = element.firstChild;

      while (element)
      {
        if (element.nodeType === qx.dom.Node.ELEMENT || element.nodeType === qx.dom.Node.TEXT) {
          return false;
        }

        element = element.nextSibling;
      }

      return true;
    },


    /**
     * Removes all of element's text nodes which contain only whitespace
     *
     * @param element {Element} Element to cleanup
     */
    cleanWhitespace : function(element)
    {
      var node = element.firstChild;

      while (node)
      {
        var nextNode = node.nextSibling;

        if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {
          element.removeChild(node);
        }

        node = nextNode;
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

// Original behavior:
// ================================================================
// Normally a "change" event should occour on blur of the element
// (http://www.w3.org/TR/DOM-Level-2-Events/events.html)

// However this is not true for "file" upload fields

// And this is also not true for checkboxes and radiofields (all non mshtml)
// And this is also not true for select boxes where the selections
// happens in the opened popup (Gecko + Webkit)

// Normalized behavior:
// ================================================================
// Change on blur for textfields, textareas and file
// Instant change event on checkboxes, radiobuttons

// Select field fires on select (when using popup or size>1)
// but differs when using keyboard:
// mshtml+opera=keypress; mozilla+safari=blur

// Input event for textareas does not work in Safari 3 beta (WIN)
// Safari 3 beta (WIN) repeats change event for select box on blur when selected using popup

// Opera fires "change" on radio buttons two times for each change

/**
 * This handler provides an "change" event for all form fields and an
 * "input" event for form fields of type "text" and "textarea".
 *
 * To let these events work it is needed to create the elements using
 * {@link qx.bom.Input}
 */
qx.Class.define("qx.event.handler.Input",
{
  extend : qx.core.Object,
  implement : qx.event.IEventHandler,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    this._onChangeCheckedWrapper = qx.lang.Function.listener(this._onChangeChecked, this);
    this._onChangeValueWrapper = qx.lang.Function.listener(this._onChangeValue, this);
    this._onInputWrapper = qx.lang.Function.listener(this._onInput, this);
    this._onPropertyWrapper = qx.lang.Function.listener(this._onProperty, this);

    // special event handler for opera
    if ((qx.core.Environment.get("engine.name") == "opera")) {
      this._onKeyDownWrapper = qx.lang.Function.listener(this._onKeyDown, this);
      this._onKeyUpWrapper = qx.lang.Function.listener(this._onKeyUp, this);
      this._onBlurWrapper = qx.lang.Function.listener(this._onBlur, this);
    }
  },






  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Integer} Priority of this handler */
    PRIORITY : qx.event.Registration.PRIORITY_NORMAL,

    /** {Map} Supported event types */
    SUPPORTED_TYPES :
    {
      input : 1,
      change : 1
    },

    /** {Integer} Which target check to use */
    TARGET_CHECK : qx.event.IEventHandler.TARGET_DOMNODE,

    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : false
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // special handling for opera
    __enter : false,
    __onInputTimeoutId : null,

    // stores the former set value for opera and IE
    __oldValue : null,

    // stores the former set value for IE
    __oldInputValue : null,

    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type)
    {
      var lower = target.tagName.toLowerCase();

      if (type === "input" && (lower === "input" || lower === "textarea")) {
        return true;
      }

      if (type === "change" && (lower === "input" || lower === "textarea" || lower === "select")) {
        return true;
      }

      return false;
    },


    // interface implementation
    registerEvent : function(target, type, capture)
    {
      if (
        qx.core.Environment.get("engine.name") == "mshtml" &&
        (qx.core.Environment.get("engine.version") < 9 ||
        (qx.core.Environment.get("engine.version") >= 9 && qx.core.Environment.get("browser.documentmode") < 9))
      )
      {
        if (!target.__inputHandlerAttached)
        {
          var tag = target.tagName.toLowerCase();
          var elementType = target.type;

          if (elementType === "text" || elementType === "password" || tag === "textarea" || elementType === "checkbox" || elementType === "radio") {
            qx.bom.Event.addNativeListener(target, "propertychange", this._onPropertyWrapper);
          }

          if (elementType !== "checkbox" && elementType !== "radio") {
            qx.bom.Event.addNativeListener(target, "change", this._onChangeValueWrapper);
          }

          if (elementType === "text" || elementType === "password") {
            this._onKeyPressWrapped = qx.lang.Function.listener(this._onKeyPress, this, target);
            qx.bom.Event.addNativeListener(target, "keypress", this._onKeyPressWrapped);
          }

          target.__inputHandlerAttached = true;
        }
      }
      else
      {
        if (type === "input")
        {
          this.__registerInputListener(target);
        }
        else if (type === "change")
        {
          if (target.type === "radio" || target.type === "checkbox") {
            qx.bom.Event.addNativeListener(target, "change", this._onChangeCheckedWrapper);
          } else {
            qx.bom.Event.addNativeListener(target, "change", this._onChangeValueWrapper);
          }

          // special enter bugfix for opera
          if ((qx.core.Environment.get("engine.name") == "opera") || (qx.core.Environment.get("engine.name") == "mshtml")) {
            if (target.type === "text" || target.type === "password") {
              this._onKeyPressWrapped = qx.lang.Function.listener(this._onKeyPress, this, target);
              qx.bom.Event.addNativeListener(target, "keypress", this._onKeyPressWrapped);
            }
          }
        }
      }
    },


    __registerInputListener : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(target)
      {
        if (
          qx.core.Environment.get("engine.version") >= 9 &&
          qx.core.Environment.get("browser.documentmode") >= 9
        ) {
          qx.bom.Event.addNativeListener(target, "input", this._onInputWrapper);

          if (target.type === "text" || target.type === "password" || target.type === "textarea")
          {
            // Fixed input for delete and backspace key
            this._inputFixWrapper = qx.lang.Function.listener(this._inputFix, this, target);
            qx.bom.Event.addNativeListener(target, "keyup", this._inputFixWrapper);
          }
        }
      },

      "webkit" : function(target)
      {
        // TODO: remove listener
        var tag = target.tagName.toLowerCase();

        // the change event is not fired while typing
        // this has been fixed in the latest nightlies
        if (parseFloat(qx.core.Environment.get("engine.version")) < 532 && tag == "textarea") {
          qx.bom.Event.addNativeListener(target, "keypress", this._onInputWrapper);
        }
        qx.bom.Event.addNativeListener(target, "input", this._onInputWrapper);
      },

      "opera" : function(target) {
        // register key events for filtering "enter" on input events
        qx.bom.Event.addNativeListener(target, "keyup", this._onKeyUpWrapper);
        qx.bom.Event.addNativeListener(target, "keydown", this._onKeyDownWrapper);
        // register an blur event for preventing the input event on blur
        qx.bom.Event.addNativeListener(target, "blur", this._onBlurWrapper);

        qx.bom.Event.addNativeListener(target, "input", this._onInputWrapper);
      },

      "default" : function(target) {
        qx.bom.Event.addNativeListener(target, "input", this._onInputWrapper);
      }
    }),


    // interface implementation
    unregisterEvent : function(target, type)
    {
      if (
        qx.core.Environment.get("engine.name") == "mshtml" &&
        qx.core.Environment.get("engine.version") < 9 &&
        qx.core.Environment.get("browser.documentmode") < 9
      )
      {
        if (target.__inputHandlerAttached)
        {
          var tag = target.tagName.toLowerCase();
          var elementType = target.type;

          if (elementType === "text" || elementType === "password" || tag === "textarea" || elementType === "checkbox" || elementType === "radio") {
            qx.bom.Event.removeNativeListener(target, "propertychange", this._onPropertyWrapper);
          }

          if (elementType !== "checkbox" && elementType !== "radio") {
            qx.bom.Event.removeNativeListener(target, "change", this._onChangeValueWrapper);
          }

          if (elementType === "text" || elementType === "password") {
            qx.bom.Event.removeNativeListener(target, "keypress", this._onKeyPressWrapped);
          }

          try {
            delete target.__inputHandlerAttached;
          } catch(ex) {
            target.__inputHandlerAttached = null;
          }
        }
      }
      else
      {
        if (type === "input")
        {
          this.__unregisterInputListener(target);
        }
        else if (type === "change")
        {
          if (target.type === "radio" || target.type === "checkbox")
          {
            qx.bom.Event.removeNativeListener(target, "change", this._onChangeCheckedWrapper);
          }
          else
          {
            qx.bom.Event.removeNativeListener(target, "change", this._onChangeValueWrapper);
          }
        }

        if ((qx.core.Environment.get("engine.name") == "opera") || (qx.core.Environment.get("engine.name") == "mshtml")) {
          if (target.type === "text" || target.type === "password") {
            qx.bom.Event.removeNativeListener(target, "keypress", this._onKeyPressWrapped);
          }
        }
      }
    },


    __unregisterInputListener : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(target)
      {
        if (
          qx.core.Environment.get("engine.version") >= 9 &&
          qx.core.Environment.get("browser.documentmode") >= 9
        ) {
          qx.bom.Event.removeNativeListener(target, "input", this._onInputWrapper);

          if (target.type === "text" || target.type === "password" || target.type === "textarea") {
            // Fixed input for delete and backspace key
            qx.bom.Event.removeNativeListener(target, "keyup", this._inputFixWrapper);
          }
        }
      },

      "webkit" : function(target)
      {
        // TODO: remove listener
        var tag = target.tagName.toLowerCase();

        // the change event is not fired while typing
        // this has been fixed in the latest nightlies
        if (parseFloat(qx.core.Environment.get("engine.version")) < 532 && tag == "textarea") {
          qx.bom.Event.removeNativeListener(target, "keypress", this._onInputWrapper);
        }
        qx.bom.Event.removeNativeListener(target, "input", this._onInputWrapper);
      },

      "opera" : function(target) {
        // unregister key events for filtering "enter" on input events
        qx.bom.Event.removeNativeListener(target, "keyup", this._onKeyUpWrapper);
        qx.bom.Event.removeNativeListener(target, "keydown", this._onKeyDownWrapper);
        // unregister the blur event (needed for preventing input event on blur)
        qx.bom.Event.removeNativeListener(target, "blur", this._onBlurWrapper);


        qx.bom.Event.removeNativeListener(target, "input", this._onInputWrapper);
      },

      "default" : function(target) {
        qx.bom.Event.removeNativeListener(target, "input", this._onInputWrapper);
      }
    }),


    /*
    ---------------------------------------------------------------------------
      FOR OPERA AND IE (KEYPRESS TO SIMULATE CHANGE EVENT)
    ---------------------------------------------------------------------------
    */
    /**
     * Handler for fixing the different behavior when pressing the enter key.
     *
     * FF and Safari fire a "change" event if the user presses the enter key.
     * IE and Opera fire the event only if the focus is changed.
     *
     * @signature function(e, target)
     * @param e {Event} DOM event object
     * @param target {Element} The event target
     */
    _onKeyPress : qx.core.Environment.select("engine.name",
    {
      "mshtml|opera" : function(e, target)
      {
        if (e.keyCode === 13) {
          if (target.value !== this.__oldValue) {
            this.__oldValue = target.value;
            qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.value]);
          }
        }
      },

      "default" : null
    }),


    /*
    ---------------------------------------------------------------------------
      FOR IE (KEYUP TO SIMULATE INPUT EVENT)
    ---------------------------------------------------------------------------
    */
    /**
     * Handler for fixing the different behavior when pressing the backspace or
     * delete key.
     *
     * The other browsers fire a "input" event if the user presses the backspace
     * or delete key.
     * IE fire the event only for other keys.
     *
     * @signature function(e, target)
     * @param e {Event} DOM event object
     * @param target {Element} The event target
     */
    _inputFix : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(e, target)
      {
        if (e.keyCode === 46 || e.keyCode === 8)
        {
          if (target.value !== this.__oldInputValue)
          {
            this.__oldInputValue = target.value;
            qx.event.Registration.fireEvent(target, "input", qx.event.type.Data, [target.value]);
          }
        }
      },

      "default" : null
    }),


    /*
    ---------------------------------------------------------------------------
      FOR OPERA ONLY LISTENER (KEY AND BLUR)
    ---------------------------------------------------------------------------
    */
    /**
     * Key event listener for opera which recognizes if the enter key has been
     * pressed.
     *
     * @signature function(e)
     * @param e {Event} DOM event object
     */
    _onKeyDown : qx.core.Environment.select("engine.name",
    {
      "opera" : function(e)
      {
        // enter is pressed
        if (e.keyCode === 13) {
          this.__enter = true;
        }
      },

      "default" : null
    }),


    /**
     * Key event listener for opera which recognizes if the enter key has been
     * pressed.
     *
     * @signature function(e)
     * @param e {Event} DOM event object
     */
    _onKeyUp : qx.core.Environment.select("engine.name",
    {
      "opera" : function(e)
      {
        // enter is pressed
        if (e.keyCode === 13) {
          this.__enter = false;
        }
      },

      "default" : null
    }),


    /**
     * Blur event listener for opera cancels the timeout of the input event.
     *
     * @signature function(e)
     * @param e {Event} DOM event object
     */
    _onBlur : qx.core.Environment.select("engine.name",
    {
      "opera" : function(e)
      {
        if (this.__onInputTimeoutId && qx.core.Environment.get("browser.version") < 10.6) {
          window.clearTimeout(this.__onInputTimeoutId);
        }
      },

      "default" : null
    }),


    /*
    ---------------------------------------------------------------------------
      NATIVE EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /**
     * Internal function called by input elements created using {@link qx.bom.Input}.
     *
     * @signature function(e)
     * @param e {Event} Native DOM event
     */
    _onInput : qx.event.GlobalError.observeMethod(function(e)
    {
      var target = qx.bom.Event.getTarget(e);
      var tag = target.tagName.toLowerCase();
      // ignore native input event when triggered by return in input element
      if (!this.__enter || tag !== "input") {
        // opera lower 10.6 needs a special treatment for input events because
        // they are also fired on blur
        if ((qx.core.Environment.get("engine.name") == "opera") &&
            qx.core.Environment.get("browser.version") < 10.6) {
          this.__onInputTimeoutId = window.setTimeout(function() {
            qx.event.Registration.fireEvent(target, "input", qx.event.type.Data, [target.value]);
          }, 0);
        } else {
          qx.event.Registration.fireEvent(target, "input", qx.event.type.Data, [target.value]);
        }
      }
    }),


    /**
     * Internal function called by input elements created using {@link qx.bom.Input}.
     *
     * @signature function(e)
     * @param e {Event} Native DOM event
     */
    _onChangeValue : qx.event.GlobalError.observeMethod(function(e)
    {
      var target = qx.bom.Event.getTarget(e);
      var data = target.value;

      if (target.type === "select-multiple")
      {
        var data = [];
        for (var i=0, o=target.options, l=o.length; i<l; i++)
        {
          if (o[i].selected) {
            data.push(o[i].value);
          }
        }
      }

      qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [data]);
    }),


    /**
     * Internal function called by input elements created using {@link qx.bom.Input}.
     *
     * @signature function(e)
     * @param e {Event} Native DOM event
     */
    _onChangeChecked : qx.event.GlobalError.observeMethod(function(e)
    {
      var target = qx.bom.Event.getTarget(e);

      if (target.type === "radio")
      {
        if (target.checked) {
          qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.value]);
        }
      }
      else
      {
        qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.checked]);
      }
    }),


    /**
     * Internal function called by input elements created using {@link qx.bom.Input}.
     *
     * @signature function(e)
     * @param e {Event} Native DOM event
     */
    _onProperty : qx.core.Environment.select("engine.name",
    {
      "mshtml" : qx.event.GlobalError.observeMethod(function(e)
      {
        var target = qx.bom.Event.getTarget(e);
        var prop = e.propertyName;

        if (prop === "value" && (target.type === "text" || target.type === "password" || target.tagName.toLowerCase() === "textarea"))
        {
          if (!target.$$inValueSet) {
            qx.event.Registration.fireEvent(target, "input", qx.event.type.Data, [target.value]);
          }
        }
        else if (prop === "checked")
        {
          if (target.type === "checkbox") {
            qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.checked]);
          } else if (target.checked) {
            qx.event.Registration.fireEvent(target, "change", qx.event.type.Data, [target.value]);
          }
        }
      }),

      "default" : function() {}
    })
  },





  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.event.Registration.addHandler(statics);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Sebastian Werner (wpbasti)

************************************************************************ */

/**
 * This class provides capture event support at DOM level.
 */
qx.Class.define("qx.event.handler.Capture",
{
  extend : qx.core.Object,
  implement : qx.event.IEventHandler,





  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Integer} Priority of this handler */
    PRIORITY : qx.event.Registration.PRIORITY_NORMAL,


    /** {Map} Supported event types */
    SUPPORTED_TYPES :
    {
      capture : true,
      losecapture : true
    },


    /** {Integer} Which target check to use */
    TARGET_CHECK : qx.event.IEventHandler.TARGET_DOMNODE,


    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : true
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type) {},


    // interface implementation
    registerEvent : function(target, type, capture) {
      // Nothing needs to be done here
    },


    // interface implementation
    unregisterEvent : function(target, type, capture) {
      // Nothing needs to be done here
    }
  },






  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.event.Registration.addHandler(statics);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************

#require(qx.event.handler.Mouse)
#require(qx.event.handler.Keyboard)
#require(qx.event.handler.Capture)

************************************************************************ */

/**
 * Event handler, which supports drag events on DOM elements.
 */
qx.Class.define("qx.event.handler.DragDrop",
{
  extend : qx.core.Object,
  implement : qx.event.IEventHandler,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param manager {qx.event.Manager} Event manager for the window to use
   */
  construct : function(manager)
  {
    this.base(arguments);

    // Define shorthands
    this.__manager = manager;
    this.__root = manager.getWindow().document.documentElement;

    // Initialize mousedown listener
    this.__manager.addListener(this.__root, "mousedown", this._onMouseDown, this);

    // Initialize data structures
    this.__rebuildStructures();
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Integer} Priority of this handler */
    PRIORITY : qx.event.Registration.PRIORITY_NORMAL,

    /** {Map} Supported event types */
    SUPPORTED_TYPES :
    {
      dragstart : 1,
      dragend : 1,
      dragover : 1,
      dragleave : 1,
      drop : 1,
      drag : 1,
      dragchange : 1,
      droprequest : 1
    },

    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : true
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __manager : null,
    __root : null,
    __dropTarget : null,
    __dragTarget : null,
    __types : null,
    __actions : null,
    __keys : null,
    __cache : null,
    __currentType : null,
    __currentAction : null,
    __sessionActive : false,
    __startLeft : 0,
    __startTop : 0,

    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type) {},


    // interface implementation
    registerEvent : function(target, type, capture) {
      // Nothing needs to be done here
    },


    // interface implementation
    unregisterEvent : function(target, type, capture) {
      // Nothing needs to be done here
    },





    /*
    ---------------------------------------------------------------------------
      PUBLIC METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Registers a supported type
     *
     * @param type {String} The type to add
     */
    addType : function(type) {
      this.__types[type] = true;
    },

    /**
     * Registers a supported action. One of <code>move</code>,
     * <code>copy</code> or <code>alias</code>.
     *
     * @param action {String} The action to add
     */
    addAction : function(action) {
      this.__actions[action] = true;
    },


    /**
     * Whether the current drag target supports the given type
     *
     * @param type {String} Any type
     * @return {Boolean} Whether the type is supported
     */
    supportsType : function(type) {
      return !!this.__types[type];
    },


    /**
     * Whether the current drag target supports the given action
     *
     * @param type {String} Any type
     * @return {Boolean} Whether the action is supported
     */
    supportsAction : function(type) {
      return !!this.__actions[type];
    },


    /**
     * Returns the data of the given type during the <code>drop</code> event
     * on the drop target. This method fires a <code>droprequest</code> at
     * the drag target which should be answered by calls to {@link #addData}.
     *
     * @param type {String} Any supported type
     * @return {var} The result data
     */
    getData : function(type)
    {
      if (!this.__validDrop || !this.__dropTarget) {
        throw new Error("This method must not be used outside the drop event listener!");
      }

      if (!this.__types[type]) {
        throw new Error("Unsupported data type: " + type + "!");
      }

      if (!this.__cache[type])
      {
        this.__currentType = type;
        this.__fireEvent("droprequest", this.__dragTarget, this.__dropTarget, false);
      }

      if (!this.__cache[type]) {
        throw new Error("Please use a droprequest listener to the drag source to fill the manager with data!");
      }

      return this.__cache[type] || null;
    },


    /**
     * Returns the currently selected action (by user keyboard modifiers)
     *
     * @return {String} One of <code>move</code>, <code>copy</code> or
     *    <code>alias</code>
     */
    getCurrentAction : function() {
      return this.__currentAction;
    },


    /**
     * Adds data of the given type to the internal storage. The data
     * is available until the <code>dragend</code> event is fired.
     *
     * @param type {String} Any valid type
     * @param data {var} Any data to store
     */
    addData : function(type, data) {
      this.__cache[type] = data;
    },


    /**
     * Returns the type which was requested last.
     *
     * @return {String} The last requested data type
     */
    getCurrentType : function() {
      return this.__currentType;
    },


    /**
     * Returns if a drag session is currently active
     *
     * @return {Boolean} active drag session
     */
    isSessionActive : function() {
      return this.__sessionActive;
    },


    /*
    ---------------------------------------------------------------------------
      INTERNAL UTILS
    ---------------------------------------------------------------------------
    */

    /**
     * Rebuilds the internal data storage used during a drag&drop session
     */
    __rebuildStructures : function()
    {
      this.__types = {};
      this.__actions = {};
      this.__keys = {};
      this.__cache = {};
    },


    /**
     * Detects the current action and stores it under the private
     * field <code>__currentAction</code>. Also fires the event
     * <code>dragchange</code> on every modification.
     */
    __detectAction : function()
    {
      if (this.__dragTarget == null) {
        return;
      }

      var actions = this.__actions;
      var keys = this.__keys;
      var current = null;

      if (this.__validDrop)
      {
        if (keys.Shift && keys.Control && actions.alias) {
          current = "alias";
        } else if (keys.Shift && keys.Alt && actions.copy) {
          current = "copy";
        } else if (keys.Shift && actions.move) {
          current = "move";
        } else if (keys.Alt && actions.alias) {
          current = "alias";
        } else if (keys.Control && actions.copy) {
          current = "copy";
        } else if (actions.move) {
          current = "move";
        } else if (actions.copy) {
          current = "copy";
        } else if (actions.alias) {
          current = "alias";
        }
      }

      var old = this.__currentAction;
      if (current != old) {

        if (this.__dropTarget) {
          this.__currentAction = current;
          this.__validAction = this.__fireEvent("dragchange", this.__dropTarget, this.__dragTarget, true);
          if (!this.__validAction) {
            current = null;
          }
        }

        if (current != old) {
          this.__currentAction = current;
          this.__fireEvent("dragchange", this.__dragTarget, this.__dropTarget, false);
        }
      }
    },


    /**
     * Wrapper for {@link qx.event.Registration#fireEvent} for drag&drop events
     * needed in this class.
     *
     * @param type {String} Event type
     * @param target {Object} Target to fire on
     * @param relatedTarget {Object} Related target, i.e. drag or drop target
     *    depending on the drag event
     * @param cancelable {Boolean} Whether the event is cancelable
     * @param original {qx.event.type.Mouse} Original mouse event
     * @return {Boolean} <code>true</code> if the event's default behavior was
     * not prevented
     */
    __fireEvent : function(type, target, relatedTarget, cancelable, original)
    {
      var Registration = qx.event.Registration;
      var dragEvent = Registration.createEvent(type, qx.event.type.Drag, [ cancelable, original ]);

      if (target !== relatedTarget) {
        dragEvent.setRelatedTarget(relatedTarget);
      }

      return Registration.dispatchEvent(target, dragEvent);
    },


    /**
     * Finds next draggable parent of the given element. Maybe the element itself as well.
     *
     * Looks for the attribute <code>qxDraggable</code> with the value <code>on</code>.
     *
     * @param elem {Element} The element to query
     * @return {Element} The next parent element which is draggable. May also be <code>null</code>
     */
    __findDraggable : function(elem)
    {
      while (elem && elem.nodeType == 1)
      {
        if (elem.getAttribute("qxDraggable") == "on") {
          return elem;
        }

        elem = elem.parentNode;
      }

      return null;
    },


    /**
     * Finds next droppable parent of the given element. Maybe the element itself as well.
     *
     * Looks for the attribute <code>qxDroppable</code> with the value <code>on</code>.
     *
     * @param elem {Element} The element to query
     * @return {Element} The next parent element which is droppable. May also be <code>null</code>
     */
    __findDroppable : function(elem)
    {
      while (elem && elem.nodeType == 1)
      {
        if (elem.getAttribute("qxDroppable") == "on") {
          return elem;
        }

        elem = elem.parentNode;
      }

      return null;
    },


    /**
     * Clean up event listener and structures when a drag was ended without ever starting into session mode
     * (e.g. not reaching the required offset before)
     */
    __clearInit : function()
    {
      // Clear drag target
      this.__dragTarget = null;

      // Deregister from root events
      this.__manager.removeListener(this.__root, "mousemove", this._onMouseMove, this, true);
      this.__manager.removeListener(this.__root, "mouseup", this._onMouseUp, this, true);

      // Deregister from window's blur
      qx.event.Registration.removeListener(window, "blur", this._onWindowBlur, this);

      // Clear structures
      this.__rebuildStructures();
    },


    /**
     * Cleans up a drag&drop session when <code>dragstart</code> was fired before.
     */
    clearSession : function()
    {
      if (this.__sessionActive)
      {
        // Deregister from root events
        this.__manager.removeListener(this.__root, "mouseover", this._onMouseOver, this, true);
        this.__manager.removeListener(this.__root, "mouseout", this._onMouseOut, this, true);
        this.__manager.removeListener(this.__root, "keydown", this._onKeyDown, this, true);
        this.__manager.removeListener(this.__root, "keyup", this._onKeyUp, this, true);
        this.__manager.removeListener(this.__root, "keypress", this._onKeyPress, this, true);

        // Fire dragend event
        this.__fireEvent("dragend", this.__dragTarget, this.__dropTarget, false);

        // Clear flag
        this.__sessionActive = false;
      }

      // Cleanup
      this.__validDrop = false;
      this.__dropTarget = null;

      // Clear init
      this.__clearInit();
    },


    /** {Boolean} Whether a valid drop object / action exists */
    __validDrop : false,
    __validAction : false,







    /*
    ---------------------------------------------------------------------------
      EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /**
     * Event listener for window's <code>blur</code> event
     *
     * @param e {qx.event.type.Event} Event object
     */
    _onWindowBlur : function(e) {
      this.clearSession();
    },


    /**
     * Event listener for root's <code>keydown</code> event
     *
     * @param e {qx.event.type.KeySequence} Event object
     */
    _onKeyDown : function(e)
    {
      var iden = e.getKeyIdentifier();
      switch(iden)
      {
        case "Alt":
        case "Control":
        case "Shift":
          if (!this.__keys[iden])
          {
            this.__keys[iden] = true;
            this.__detectAction();
          }
      }
    },


    /**
     * Event listener for root's <code>keyup</code> event
     *
     * @param e {qx.event.type.KeySequence} Event object
     */
    _onKeyUp : function(e)
    {
      var iden = e.getKeyIdentifier();
      switch(iden)
      {
        case "Alt":
        case "Control":
        case "Shift":
          if (this.__keys[iden])
          {
            this.__keys[iden] = false;
            this.__detectAction();
          }
      }
    },


    /**
     * Event listener for root's <code>keypress</code> event
     *
     * @param e {qx.event.type.KeySequence} Event object
     */
    _onKeyPress : function(e)
    {
      var iden = e.getKeyIdentifier();
      switch(iden)
      {
        case "Escape":
          this.clearSession();
      }
    },


    /**
     * Event listener for root's <code>mousedown</code> event
     *
     * @param e {qx.event.type.Mouse} Event object
     */
    _onMouseDown : function(e)
    {
      if (this.__sessionActive || e.getButton() !== "left") {
        return;
      }

      var dragable = this.__findDraggable(e.getTarget());
      if (dragable)
      {
        // Cache coordinates for offset calculation
        this.__startLeft = e.getDocumentLeft();
        this.__startTop = e.getDocumentTop();

        // This is the source target
        this.__dragTarget = dragable;

        // Register move event to manager
        this.__manager.addListener(this.__root, "mousemove", this._onMouseMove, this, true);
        this.__manager.addListener(this.__root, "mouseup", this._onMouseUp, this, true);

        // Register window blur listener
        qx.event.Registration.addListener(window, "blur", this._onWindowBlur, this);
      }
    },


    /**
     * Event listener for root's <code>mouseup</code> event
     *
     * @param e {qx.event.type.Mouse} Event object
     */
    _onMouseUp : function(e)
    {
      // Fire drop event in success case
      if (this.__validDrop && this.__validAction) {
        this.__fireEvent("drop", this.__dropTarget, this.__dragTarget, false, e);
      }

      // Stop event
      if (this.__sessionActive) {
        e.stopPropagation();
      }

      // Clean up
      this.clearSession();
    },


    /**
     * Event listener for root's <code>mousemove</code> event
     *
     * @param e {qx.event.type.Mouse} Event object
     */
    _onMouseMove : function(e)
    {
      // Whether the session is already active
      if (this.__sessionActive)
      {
        // Fire specialized move event
        if (!this.__fireEvent("drag", this.__dragTarget, this.__dropTarget, true, e)) {
          this.clearSession();
        }
      }
      else
      {
        if (Math.abs(e.getDocumentLeft()-this.__startLeft) > 3 || Math.abs(e.getDocumentTop()-this.__startTop) > 3)
        {
          if (this.__fireEvent("dragstart", this.__dragTarget, this.__dropTarget, true, e))
          {
            // Flag session as active
            this.__sessionActive = true;

            // Register to root events
            this.__manager.addListener(this.__root, "mouseover", this._onMouseOver, this, true);
            this.__manager.addListener(this.__root, "mouseout", this._onMouseOut, this, true);
            this.__manager.addListener(this.__root, "keydown", this._onKeyDown, this, true);
            this.__manager.addListener(this.__root, "keyup", this._onKeyUp, this, true);
            this.__manager.addListener(this.__root, "keypress", this._onKeyPress, this, true);

            // Reevaluate current action
            var keys = this.__keys;
            keys.Control = e.isCtrlPressed();
            keys.Shift = e.isShiftPressed();
            keys.Alt = e.isAltPressed();
            this.__detectAction();
          }
          else
          {
            // Fire dragend event
            this.__fireEvent("dragend", this.__dragTarget, this.__dropTarget, false);

            // Clean up
            this.__clearInit();
          }
        }
      }
    },


    /**
     * Event listener for root's <code>mouseover</code> event
     *
     * @param e {qx.event.type.Mouse} Event object
     */
    _onMouseOver : function(e)
    {
      var target = e.getTarget();
      var dropable = this.__findDroppable(target);

      if (dropable && dropable != this.__dropTarget)
      {
        this.__validDrop = this.__fireEvent("dragover", dropable, this.__dragTarget, true, e);
        this.__dropTarget = dropable;

        this.__detectAction();
      }
    },


    /**
     * Event listener for root's <code>mouseout</code> event
     *
     * @param e {qx.event.type.Mouse} Event object
     */
    _onMouseOut : function(e)
    {
      var dropable = this.__findDroppable(e.getTarget());
      var newDropable = this.__findDroppable(e.getRelatedTarget());

      if (dropable && dropable !== newDropable && dropable == this.__dropTarget)
      {
        this.__fireEvent("dragleave", this.__dropTarget, newDropable, false, e);
        this.__dropTarget = null;
        this.__validDrop = false;

        qx.event.Timer.once(this.__detectAction, this, 0);
      }
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    // Clear fields
    this.__dragTarget = this.__dropTarget = this.__manager = this.__root =
      this.__types = this.__actions = this.__keys = this.__cache = null;
  },




  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.event.Registration.addHandler(statics);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * Event object class for drag events
 */
qx.Class.define("qx.event.type.Drag",
{
  extend : qx.event.type.Event,


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Initialize the fields of the event. The event must be initialized before
     * it can be dispatched.
     *
     * @param cancelable {Boolean?false} Whether or not an event can have its default
     *     action prevented. The default action can either be the browser's
     *     default action of a native event (e.g. open the context menu on a
     *     right click) or the default action of a qooxdoo class (e.g. close
     *     the window widget). The default action can be prevented by calling
     *     {@link qx.event.type.Event#preventDefault}
     * @param originalEvent {qx.event.type.Mouse} The original (mouse) event to use
     * @return {qx.event.type.Event} The initialized event instance
     */
    init : function(cancelable, originalEvent)
    {
      this.base(arguments, true, cancelable);

      if (originalEvent)
      {
        this._native = originalEvent.getNativeEvent() || null;
        this._originalTarget = originalEvent.getTarget() || null;
      }
      else
      {
        this._native = null;
        this._originalTarget = null;
      }

      return this;
    },


    // overridden
    clone : function(embryo)
    {
      var clone = this.base(arguments, embryo);

      clone._native = this._native;

      return clone;
    },


    /**
     * Get the horizontal position at which the event occurred relative to the
     * left of the document. This property takes into account any scrolling of
     * the page.
     *
     * @return {Integer} The horizontal mouse position in the document.
     */
    getDocumentLeft : function()
    {
      if (this._native == null) {
        return 0;
      }

      if (this._native.pageX !== undefined) {
        return this._native.pageX;
      } else {
        var win = qx.dom.Node.getWindow(this._native.srcElement);
        return this._native.clientX + qx.bom.Viewport.getScrollLeft(win);
      }
    },


    /**
     * Get the vertical position at which the event occurred relative to the
     * top of the document. This property takes into account any scrolling of
     * the page.
     *
     * @return {Integer} The vertical mouse position in the document.
     */
    getDocumentTop : function()
    {
      if (this._native == null) {
        return 0;
      }

      if (this._native.pageY !== undefined) {
        return this._native.pageY;
      } else {
        var win = qx.dom.Node.getWindow(this._native.srcElement);
        return this._native.clientY + qx.bom.Viewport.getScrollTop(win);
      }
    },


    /**
     * Returns the drag&drop event handler responsible for the target
     *
     * @return {qx.event.handler.DragDrop} The drag&drop handler
     */
    getManager : function() {
      return qx.event.Registration.getManager(this.getTarget()).getHandler(qx.event.handler.DragDrop);
    },


    /**
     * Used during <code>dragstart</code> listener to
     * inform the manager about supported data types.
     *
     * @param type {String} Data type to add to list of supported types
     */
    addType : function(type) {
      this.getManager().addType(type);
    },


    /**
     * Used during <code>dragstart</code> listener to
     * inform the manager about supported drop actions.
     *
     * @param action {String} Action to add to the list of supported actions
     */
    addAction : function(action) {
      this.getManager().addAction(action);
    },


    /**
     * Whether the given type is supported by the drag
     * target (source target).
     *
     * This is used in the event listeners for <code>dragover</code>
     * or <code>dragdrop</code>.
     *
     * @param type {String} The type to look for
     * @return {Boolean} Whether the given type is supported
     */
    supportsType : function(type) {
      return this.getManager().supportsType(type);
    },


    /**
     * Whether the given action is supported by the drag
     * target (source target).
     *
     * This is used in the event listeners for <code>dragover</code>
     * or <code>dragdrop</code>.
     *
     * @param action {String} The action to look for
     * @return {Boolean} Whether the given action is supported
     */
    supportsAction : function(action) {
      return this.getManager().supportsAction(action);
    },


    /**
     * Adds data of the given type to the internal storage. The data
     * is available until the <code>dragend</code> event is fired.
     *
     * @param type {String} Any valid type
     * @param data {var} Any data to store
     */
    addData : function(type, data) {
      this.getManager().addData(type, data);
    },


    /**
     * Returns the data of the given type. Used in the <code>drop</code> listener.
     *
     * @param type {String} Any of the supported types.
     * @return {var} The data for the given type
     */
    getData : function(type) {
      return this.getManager().getData(type);
    },


    /**
     * Returns the type which was requested last, to be used
     * in the <code>droprequest</code> listener.
     *
     * @return {String} The last requested data type
     */
    getCurrentType : function() {
      return this.getManager().getCurrentType();
    },


    /**
     * Returns the currently selected action. Depends on the
     * supported actions of the source target and the modification
     * keys pressed by the user.
     *
     * Used in the <code>droprequest</code> listener.
     *
     * @return {String} The action. May be one of <code>move</code>,
     *    <code>copy</code> or <code>alias</code>.
     */
    getCurrentAction : function() {
      return this.getManager().getCurrentAction();
    },


    /**
     * Stops the drag&drop session and fires a <code>dragend</code> event.
     */
    stopSession : function() {
      this.getManager().clearSession();
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/**
 * Global timer support.
 *
 * This class can be used to periodically fire an event. This event can be
 * used to simulate e.g. a background task. The static method
 * {@link #once} is a special case. It will call a function deferred after a
 * given timeout.
 */
qx.Class.define("qx.event.Timer",
{
  extend : qx.core.Object,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param interval {Number} initial interval in milliseconds of the timer.
   */
  construct : function(interval)
  {
    this.base(arguments);

    this.setEnabled(false);

    if (interval != null) {
      this.setInterval(interval);
    }

    // don't use qx.lang.Function.bind because this function would add a
    // disposed check, which could break the functionality. In IE the handler
    // may get called after "clearInterval" (i.e. after the timer is disposed)
    // and we must be able to handle this.
    var self = this;
    this.__oninterval = function() {
      self._oninterval.call(self);
    }
  },




  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** This event if fired each time the interval time has elapsed */
    "interval" : "qx.event.type.Event"
  },





  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Start a function after a given timeout.
     *
     * @param func {Function} Function to call
     * @param obj {Object} context (this), the function is called with
     * @param timeout {Number} Number of milliseconds to wait before the
     *   function is called.
     * @return {qx.event.Timer} The timer object used for the timeout. This
     *    object can be used to cancel the timeout. Note that the timer is
     *    only valid until the timer has been executed.
     */
    once : function(func, obj, timeout)
    {
      if (qx.core.Environment.get("qx.debug")) {
        // check the given parameter
        qx.core.Assert.assertFunction(func, "func is not a function");
        qx.core.Assert.assertNotUndefined(timeout, "No timeout given");
      }

      // Create time instance
      var timer = new qx.event.Timer(timeout);

      // Bug #3481: append original function to timer instance so it can be
      // read by a debugger
      timer.__onceFunc = func;

      // Add event listener to interval
      timer.addListener("interval", function(e)
      {
        timer.stop();
        func.call(obj, e);
        timer.dispose();

        obj = null;
      },
      obj);

      // Directly start timer
      timer.start();
      return timer;
    }
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * With the enabled property the Timer can be started and suspended.
     * Setting it to "true" is equivalent to {@link #start}, setting it
     * to "false" is equivalent to {@link #stop}.
     */
    enabled :
    {
      init : true,
      check : "Boolean",
      apply : "_applyEnabled"
    },

    /**
     * Time in milliseconds between two callback calls.
     * This property can be set to modify the interval of
     * a running timer.
     */
    interval :
    {
      check : "Integer",
      init : 1000,
      apply : "_applyInterval"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __intervalHandler : null,
    __oninterval : null,



    /*
    ---------------------------------------------------------------------------
      APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    /**
     * Apply the interval of the timer.
     *
     * @param value {var} Current value
     * @param old {var} Previous value
     */
    _applyInterval : function(value, old)
    {
      if (this.getEnabled()) {
        this.restart();
      }
    },


    /**
     * Apply the enabled state of the timer.
     *
     * @param value {var} Current value
     * @param old {var} Previous value
     */
    _applyEnabled : function(value, old)
    {
      if (old)
      {
        window.clearInterval(this.__intervalHandler);
        this.__intervalHandler = null;
      }
      else if (value)
      {
        this.__intervalHandler = window.setInterval(this.__oninterval, this.getInterval());
      }
    },




    /*
    ---------------------------------------------------------------------------
      USER-ACCESS
    ---------------------------------------------------------------------------
    */

    /**
     * Start the timer
     *
     */
    start : function() {
      this.setEnabled(true);
    },


    /**
     * Start the timer with a given interval
     *
     * @param interval {Integer} Time in milliseconds between two callback calls.
     */
    startWith : function(interval)
    {
      this.setInterval(interval);
      this.start();
    },


    /**
     * Stop the timer.
     *
     */
    stop : function() {
      this.setEnabled(false);
    },


    /**
     * Restart the timer.
     * This makes it possible to change the interval of a running timer.
     *
     */
    restart : function()
    {
      this.stop();
      this.start();
    },


    /**
     * Restart the timer. with a given interval.
     *
     * @param interval {Integer} Time in milliseconds between two callback calls.
     */
    restartWith : function(interval)
    {
      this.stop();
      this.startWith(interval);
    },




    /*
    ---------------------------------------------------------------------------
      EVENT-MAPPER
    ---------------------------------------------------------------------------
    */

    /**
     * timer callback
     *
     * @signature function()
     */
    _oninterval : qx.event.GlobalError.observeMethod(function()
    {
      if (this.$$disposed) {
        return;
      }

      if (this.getEnabled()) {
        this.fireEvent("interval");
      }
    })
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    if (this.__intervalHandler) {
      window.clearInterval(this.__intervalHandler);
    }

    this.__intervalHandler = this.__oninterval = null;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * This class provides a handler for the online event.
 */
qx.Class.define("qx.event.handler.Offline",
{
  extend : qx.core.Object,
  implement : qx.event.IEventHandler,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * Create a new instance
   *
   * @param manager {qx.event.Manager} Event manager for the window to use
   */
  construct : function(manager)
  {
    this.base(arguments);

    this.__manager = manager;
    this.__window = manager.getWindow();

    this._initObserver();
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Integer} Priority of this handler */
    PRIORITY : qx.event.Registration.PRIORITY_NORMAL,


    /** {Map} Supported event types */
    SUPPORTED_TYPES :
    {
      online : true,
      offline : true
    },


    /** {Integer} Which target check to use */
    TARGET_CHECK : qx.event.IEventHandler.TARGET_WINDOW,


    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : true
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __manager : null,
    __window : null,
    __onNativeWrapper : null,


    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type) {},


    // interface implementation
    registerEvent : function(target, type, capture) {
      // Nothing needs to be done here
    },


    // interface implementation
    unregisterEvent : function(target, type, capture) {
      // Nothing needs to be done here
    },


    /**
     * Connects the native online and offline event listeners.
     */
    _initObserver : function() {
      this.__onNativeWrapper = qx.lang.Function.listener(this._onNative, this);

      qx.bom.Event.addNativeListener(this.__window, "offline", this.__onNativeWrapper);
      qx.bom.Event.addNativeListener(this.__window, "online", this.__onNativeWrapper);
    },


    /**
     * Disconnects the native online and offline event listeners.
     */
    _stopObserver : function() {
      qx.bom.Event.removeNativeListener(this.__window, "offline", this.__onNativeWrapper);
      qx.bom.Event.removeNativeListener(this.__window, "online", this.__onNativeWrapper);
    },


    /**
     * Native handler function which fires a qooxdoo event.
     * @signature function(domEvent)
     * @param domEvent {Event} Native DOM event
     */
    _onNative : qx.event.GlobalError.observeMethod(function(domEvent) {
      qx.event.Registration.fireEvent(
          this.__window,
          domEvent.type,
          qx.event.type.Event,
          []
      );
    }),


    /*
    ---------------------------------------------------------------------------
      USER ACCESS
    ---------------------------------------------------------------------------
    */


    /**
     * Returns whether the current window thinks its online or not.
     * @return {Boolean} <code>true</code> if its online
     */
    isOnline : function() {
      return !!this.__window.navigator.onLine;
    }
  },





  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this.__manager = null;
    this._stopObserver();

    // Deregister
    delete qx.event.handler.Appear.__instances[this.$$hash];
  },




  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.event.Registration.addHandler(statics);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/* ************************************************************************

#require(qx.event.dispatch.Direct)
#require(qx.event.dispatch.DomBubbling)
#require(qx.event.handler.Keyboard)
#require(qx.event.handler.Mouse)
#require(qx.event.handler.DragDrop)
#require(qx.event.handler.Element)
#require(qx.event.handler.Appear)
#require(qx.event.handler.Touch)
#require(qx.event.handler.Offline)
#require(qx.event.handler.Input)

************************************************************************ */

/**
 * This class is mainly a convenience wrapper for DOM elements to
 * qooxdoo's event system.
 */
qx.Class.define("qx.bom.Element",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /*
    ---------------------------------------------------------------------------
      EVENTS
    ---------------------------------------------------------------------------
    */

    /**
     * Add an event listener to a DOM element. The event listener is passed an
     * instance of {@link Event} containing all relevant information
     * about the event as parameter.
     *
     * @param element {Element} DOM element to attach the event on.
     * @param type {String} Name of the event e.g. "click", "keydown", ...
     * @param listener {Function} Event listener function
     * @param self {Object ? null} Reference to the 'this' variable inside
     *         the event listener. When not given, the corresponding dispatcher
     *         usually falls back to a default, which is the target
     *         by convention. Note this is not a strict requirement, i.e.
     *         custom dispatchers can follow a different strategy.
     * @param capture {Boolean} Whether to attach the event to the
     *       capturing phase or the bubbling phase of the event. The default is
     *       to attach the event handler to the bubbling phase.
     * @return {String} An opaque id, which can be used to remove the event listener
     *       using the {@link #removeListenerById} method.
     */
    addListener : function(element, type, listener, self, capture) {
      return qx.event.Registration.addListener(element, type, listener, self, capture);
    },


    /**
     * Remove an event listener from a from DOM node.
     *
     * Note: All registered event listeners will automatically be removed from
     *   the DOM at page unload so it is not necessary to detach events yourself.
     *
     * @param element {Element} DOM Element
     * @param type {String} Name of the event
     * @param listener {Function} The pointer to the event listener
     * @param self {Object ? null} Reference to the 'this' variable inside
     *         the event listener.
     * @param capture {Boolean} Whether to remove the event listener of
     *       the bubbling or of the capturing phase.
     * @return {Boolean} <code>true</code> if the listener was removed
     */
    removeListener : function(element, type, listener, self, capture) {
      return qx.event.Registration.removeListener(element, type, listener, self, capture);
    },


    /**
     * Removes an event listener from an event target by an id returned by
     * {@link #addListener}
     *
     * @param target {Object} The event target
     * @param id {String} The id returned by {@link #addListener}
     * @return {Boolean} <code>true</code> if the listener was removed
     */
    removeListenerById : function(target, id) {
      return qx.event.Registration.removeListenerById(target, id);
    },


    /**
     * Check whether there are one or more listeners for an event type
     * registered at the element.
     *
     * @param element {Element} DOM element
     * @param type {String} The event type
     * @param capture {Boolean ? false} Whether to check for listeners of
     *       the bubbling or of the capturing phase.
     * @return {Boolean} Whether the element has event listeners of the given type.
     */
    hasListener : function(element, type, capture) {
      return qx.event.Registration.hasListener(element, type, capture);
    },


    /**
     * Focuses the given element. The element needs to have a positive <code>tabIndex</code> value.
     *
     * @param element {Element} DOM element to focus
     */
    focus : function(element) {
      qx.event.Registration.getManager(element).getHandler(qx.event.handler.Focus).focus(element);
    },


    /**
     * Blurs the given element
     *
     * @param element {Element} DOM element to blur
     */
    blur : function(element) {
      qx.event.Registration.getManager(element).getHandler(qx.event.handler.Focus).blur(element);
    },


    /**
     * Activates the given element. The active element receives all key board events.
     *
     * @param element {Element} DOM element to focus
     */
    activate : function(element) {
      qx.event.Registration.getManager(element).getHandler(qx.event.handler.Focus).activate(element);
    },


    /**
     * Deactivates the given element. The active element receives all key board events.
     *
     * @param element {Element} DOM element to focus
     */
    deactivate : function(element) {
      qx.event.Registration.getManager(element).getHandler(qx.event.handler.Focus).deactivate(element);
    },


    /**
     * Captures the given element
     *
     * @param element {Element} DOM element to capture
     * @param containerCapture {Boolean?true} If true all events originating in
     *   the container are captured. If false events originating in the container
     *   are not captured.
     */
    capture : function(element, containerCapture) {
      qx.event.Registration.getManager(element).getDispatcher(qx.event.dispatch.MouseCapture).activateCapture(element, containerCapture);
    },


    /**
     * Releases the given element (from a previous {@link #capture} call)
     *
     * @param element {Element} DOM element to release
     */
    releaseCapture : function(element) {
      qx.event.Registration.getManager(element).getDispatcher(qx.event.dispatch.MouseCapture).releaseCapture(element);
    },


    /*
    ---------------------------------------------------------------------------
      UTILS
    ---------------------------------------------------------------------------
    */

    /**
     * Clone given DOM element. May optionally clone all attached
     * events (recursively) as well.
     *
     * @param element {Element} Element to clone
     * @param events {Boolean?false} Whether events should be copied as well
     * @return {Element} The copied element
     */
    clone : function(element, events)
    {
      var clone;

      if (events || ((qx.core.Environment.get("engine.name") == "mshtml") && !qx.xml.Document.isXmlDocument(element)))
      {
        var mgr = qx.event.Registration.getManager(element);
        var all = qx.dom.Hierarchy.getDescendants(element);
        all.push(element);
      }

      // IE copies events bound via attachEvent() when
      // using cloneNode(). Calling detachEvent() on the
      // clone will also remove the events from the orignal.
      //
      // In order to get around this, we detach all locally
      // attached events first, do the cloning and recover
      // them afterwards again.
      if ((qx.core.Environment.get("engine.name") == "mshtml"))
      {
        for (var i=0, l=all.length; i<l; i++) {
          mgr.toggleAttachedEvents(all[i], false);
        }
      }

      // Do the native cloning
      var clone = element.cloneNode(true);

      // Recover events on original elements
      if ((qx.core.Environment.get("engine.name") == "mshtml"))
      {
        for (var i=0, l=all.length; i<l; i++) {
          mgr.toggleAttachedEvents(all[i], true);
        }
      }

      // Attach events from original element
      if (events === true)
      {
        // Produce recursive list of elements in the clone
        var cloneAll = qx.dom.Hierarchy.getDescendants(clone);
        cloneAll.push(clone);

        // Process all elements and copy over listeners
        var eventList, cloneElem, origElem, eventEntry;
        for (var i=0, il=all.length; i<il; i++)
        {
          origElem = all[i];
          eventList = mgr.serializeListeners(origElem);

          if (eventList.length > 0)
          {
            cloneElem = cloneAll[i];

            for (var j=0, jl=eventList.length; j<jl; j++)
            {
              eventEntry = eventList[j];
              mgr.addListener(cloneElem, eventEntry.type, eventEntry.handler, eventEntry.self, eventEntry.capture);
            }
          }
        }
      }

      // Finally return the clone
      return clone;
    }
  }
});
 /* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/* ************************************************************************

#use(qx.event.handler.Focus)
#use(qx.event.handler.Window)
#use(qx.event.handler.Capture)

************************************************************************ */

/**
 * Implementation of the Internet Explorer specific event capturing mode for
 * mouse events http://msdn2.microsoft.com/en-us/library/ms536742.aspx.
 *
 * This class is used internally by {@link qx.event.Manager} to do mouse event
 * capturing.
 */
qx.Class.define("qx.event.dispatch.MouseCapture",
{
  extend : qx.event.dispatch.AbstractBubbling,


  /**
   * @param manager {qx.event.Manager} Event manager for the window to use
   * @param registration {qx.event.Registration} The event registration to use
   */
  construct : function(manager, registration)
  {
    this.base(arguments, manager);
    this.__window = manager.getWindow();
    this.__registration = registration;

    manager.addListener(this.__window, "blur", this.releaseCapture, this);
    manager.addListener(this.__window, "focus", this.releaseCapture, this);
    manager.addListener(this.__window, "scroll", this.releaseCapture, this);
  },


  statics :
  {
    /** {Integer} Priority of this dispatcher */
    PRIORITY : qx.event.Registration.PRIORITY_FIRST
  },


  members:
  {
    __registration : null,
    __captureElement : null,
    __containerCapture : true,
    __window : null,


    // overridden
    _getParent : function(target) {
      return target.parentNode;
    },


    /*
    ---------------------------------------------------------------------------
      EVENT DISPATCHER INTERFACE
    ---------------------------------------------------------------------------
    */

    // overridden
    canDispatchEvent : function(target, event, type)
    {
      return !!(
        this.__captureElement &&
        this.__captureEvents[type]
      );
    },


    // overridden
    dispatchEvent : function(target, event, type)
    {
      // Conforming to the MS implementation a mouse click will stop mouse
      // capturing. The event is "eaten" by the capturing handler.
      if (type == "click")
      {
        event.stopPropagation();

        this.releaseCapture();
        return;
      }

      if (
        this.__containerCapture ||
        !qx.dom.Hierarchy.contains(this.__captureElement, target)
      ) {
        target = this.__captureElement;
      }

      this.base(arguments, target, event, type);
    },


    /*
    ---------------------------------------------------------------------------
      HELPER
    ---------------------------------------------------------------------------
    */

    /**
     * @lint ignoreReferenceField(__captureEvents)
     */
    __captureEvents :
    {
      "mouseup": 1,
      "mousedown": 1,
      "click": 1,
      "dblclick": 1,
      "mousemove": 1,
      "mouseout": 1,
      "mouseover": 1
    },


    /*
    ---------------------------------------------------------------------------
      USER ACCESS
    ---------------------------------------------------------------------------
    */

    /**
     * Set the given element as target for event
     *
     * @param element {Element} The element which should capture the mouse events.
     * @param containerCapture {Boolean?true} If true all events originating in
     *   the container are captured. IF false events originating in the container
     *   are not captured.
     */
    activateCapture : function(element, containerCapture)
    {
      var containerCapture = containerCapture !== false;

      if (
        this.__captureElement === element &&
        this.__containerCapture == containerCapture
      ) {
        return;
      }


      if (this.__captureElement) {
        this.releaseCapture();
      }

      // turn on native mouse capturing if the browser supports it
      this.nativeSetCapture(element, containerCapture);
      if (this.hasNativeCapture)
      {
        var self = this;
        qx.bom.Event.addNativeListener(element, "losecapture", function()
        {
          qx.bom.Event.removeNativeListener(element, "losecapture", arguments.callee);
          self.releaseCapture();
        });
      }

      this.__containerCapture = containerCapture;
      this.__captureElement = element;
      this.__registration.fireEvent(element, "capture", qx.event.type.Event, [true, false]);
    },


    /**
     * Get the element currently capturing events.
     *
     * @return {Element|null} The current capture element. This value may be
     *    null.
     */
    getCaptureElement : function() {
      return this.__captureElement;
    },


    /**
     * Stop capturing of mouse events.
     */
    releaseCapture : function()
    {
      var element = this.__captureElement;

      if (!element) {
        return;
      }

      this.__captureElement = null;
      this.__registration.fireEvent(element, "losecapture", qx.event.type.Event, [true, false]);

      // turn off native mouse capturing if the browser supports it
      this.nativeReleaseCapture(element);
    },


    /** Whether the browser has native mouse capture support */
    hasNativeCapture : qx.core.Environment.get("engine.name") == "mshtml",


    /**
     * If the browser supports native mouse capturing, sets the mouse capture to
     * the object that belongs to the current document.
     *
     * @param element {Element} The capture DOM element
     * @param containerCapture {Boolean?true} If true all events originating in
     *   the container are captured. If false events originating in the container
     *   are not captured.
     * @signature function(element, containerCapture)
     */
    nativeSetCapture : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(element, containerCapture) {
        element.setCapture(containerCapture !== false);
      },

      "default" : (function() {})
    }),


    /**
     * If the browser supports native mouse capturing, removes mouse capture
     * from the object in the current document.
     *
     * @param element {Element} The DOM element to release the capture for
     * @signature function(element)
     */
    nativeReleaseCapture : qx.core.Environment.select("engine.name",
    {
      "mshtml" : function(element) {
        element.releaseCapture();
      },

      "default" : (function() {})
    })
  },


  destruct : function() {
    this.__captureElement = this.__window = this.__registration = null;
  },


  defer : function(statics) {
    qx.event.Registration.addDispatcher(statics);
  }
});/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * Contains detection for QuickTime, Windows Media, DivX, Silverlight adn gears.
 * If no version could be detected the version is set to an empty string as
 * default.
 *
 * This class is used by {@link qx.core.Environment} and should not be used
 * directly. Please check its class comment for details how to use it.
 *
 * @internal
 */
qx.Bootstrap.define("qx.bom.client.Plugin",
{
  statics :
  {
    /**
     * Checkes for the availability of google gears plugin.
     *
     * @internal
     * @return {Boolean} <code>true</code> if gears is available
     */
    getGears : function() {
      return !!(window.google && window.google.gears);
    },


    /**
     * Checks for ActiveX availability.
     *
     * @internal
     * @return {Boolean} <code>true</code> if ActiveX is available
     */
    getActiveX : function()
    {
      return (typeof window.ActiveXObject === "function");
    },

    /**
     * Checks for Skypes 'Click to call' availability.
     *
     * @internal
     * @return {Boolean} <code>true</code> if the plugin is available.
     */
    getSkype : function()
    {
      // IE Support
      if (qx.bom.client.Plugin.getActiveX()) {
       try {
         new ActiveXObject("Skype.Detection");
         return true;
       } catch (e) {}
      }

      var mimeTypes = navigator.mimeTypes;
      if (mimeTypes) {
        // FF support
        if ("application/x-skype" in mimeTypes) {
          return true;
        }
        // webkit support
        for (var i=0; i < mimeTypes.length; i++) {
          var desc = mimeTypes[i];
          if (desc.type.indexOf("skype.click2call") != -1) {
            return true;
          }
        };
      }

      return false;
    },


    /**
     * Database of supported features.
     * Filled with additional data at initialization
     */
    __db :
    {
      quicktime :
      {
        plugin : [ "QuickTime" ],
        control : "QuickTimeCheckObject.QuickTimeCheck.1"
        // call returns boolean: instance.IsQuickTimeAvailable(0)
      },

      wmv :
      {
        plugin : [ "Windows Media" ],
        control : "WMPlayer.OCX.7"
        // version string in: instance.versionInfo
      },

      divx :
      {
        plugin : [ "DivX Web Player" ],
        control : "npdivx.DivXBrowserPlugin.1"
      },

      silverlight :
      {
        plugin : [ "Silverlight" ],
        control : "AgControl.AgControl"
        // version string in: instance.version (Silverlight 1.0)
        // version string in: instance.settings.version (Silverlight 1.1)
        // version check possible using instance.IsVersionSupported
      },

      pdf :
      {
        plugin : [ "Chrome PDF Viewer", "Adobe Acrobat" ],
        control : "AcroPDF.PDF"
        // this is detecting Acrobat PDF version > 7 and Chrome PDF Viewer
      }
    },


    /**
     * Fetches the version of the quicktime plugin.
     * @return {String} The version of the plugin, if available,
     *   an empty string otherwise
     * @internal
     */
    getQuicktimeVersion : function() {
      var entry = qx.bom.client.Plugin.__db["quicktime"];
      return qx.bom.client.Plugin.__getVersion(entry.control, entry.plugin);
    },


    /**
     * Fetches the version of the windows media plugin.
     * @return {String} The version of the plugin, if available,
     *   an empty string otherwise
     * @internal
     */
    getWindowsMediaVersion : function() {
      var entry = qx.bom.client.Plugin.__db["wmv"];
      return qx.bom.client.Plugin.__getVersion(entry.control, entry.plugin);
    },


    /**
     * Fetches the version of the divx plugin.
     * @return {String} The version of the plugin, if available,
     *   an empty string otherwise
     * @internal
     */
    getDivXVersion : function() {
      var entry = qx.bom.client.Plugin.__db["divx"];
      return qx.bom.client.Plugin.__getVersion(entry.control, entry.plugin);
    },


    /**
     * Fetches the version of the silverlight plugin.
     * @return {String} The version of the plugin, if available,
     *   an empty string otherwise
     * @internal
     */
    getSilverlightVersion : function() {
      var entry = qx.bom.client.Plugin.__db["silverlight"];
      return qx.bom.client.Plugin.__getVersion(entry.control, entry.plugin);
    },


    /**
     * Fetches the version of the pdf plugin.
     * @return {String} The version of the plugin, if available,
     *  an empty string otherwise
     * @internal
     */
    getPdfVersion : function() {
      var entry = qx.bom.client.Plugin.__db["pdf"];
      return qx.bom.client.Plugin.__getVersion(entry.control, entry.plugin);
    },


    /**
     * Checks if the quicktime plugin is available.
     * @return {Boolean} <code>true</code> if the plugin is available
     * @internal
     */
    getQuicktime : function() {
      var entry = qx.bom.client.Plugin.__db["quicktime"];
      return qx.bom.client.Plugin.__isAvailable(entry.control, entry.plugin);
    },


    /**
     * Checks if the windows media plugin is available.
     * @return {Boolean} <code>true</code> if the plugin is available
     * @internal
     */
    getWindowsMedia : function() {
      var entry = qx.bom.client.Plugin.__db["wmv"];
      return qx.bom.client.Plugin.__isAvailable(entry.control, entry.plugin);
    },


    /**
     * Checks if the divx plugin is available.
     * @return {Boolean} <code>true</code> if the plugin is available
     * @internal
     */
    getDivX : function() {
      var entry = qx.bom.client.Plugin.__db["divx"];
      return qx.bom.client.Plugin.__isAvailable(entry.control, entry.plugin);
    },


    /**
     * Checks if the silverlight plugin is available.
     * @return {Boolean} <code>true</code> if the plugin is available
     * @internal
     */
    getSilverlight : function() {
      var entry = qx.bom.client.Plugin.__db["silverlight"];
      return qx.bom.client.Plugin.__isAvailable(entry.control, entry.plugin);
    },


    /**
     * Checks if the pdf plugin is available.
     * @return {Boolean} <code>true</code> if the plugin is available
     * @internal
     */
    getPdf : function() {
      var entry = qx.bom.client.Plugin.__db["pdf"];
      return qx.bom.client.Plugin.__isAvailable(entry.control, entry.plugin);
    },


    /**
     * Internal helper for getting the version of a given plugin.
     *
     * @param activeXName {String} The name which should be used to generate
     *   the test ActiveX Object.
     * @param pluginNames {Array} The names with which the plugins are listed in
     *   the navigator.plugins list.
     * @return {String} The version of the plugin as string.
     */
    __getVersion : function(activeXName, pluginNames) {
      var available = qx.bom.client.Plugin.__isAvailable(
        activeXName, pluginNames
      );
      // don't check if the plugin is not available
      if (!available) {
        return "";
      }

      // IE checks
      if (qx.bom.client.Engine.getName() == "mshtml") {
        var obj = new ActiveXObject(activeXName);

        try {
          var version = obj.versionInfo;
          if (version != undefined) {
            return version;
          }

          version = obj.version;
          if (version != undefined) {
            return version;
          }

          version = obj.settings.version;
          if (version != undefined) {
            return version;
          }
        } catch (ex) {
          return "";
        }

        return "";

      // all other browsers
      } else {
        var plugins = navigator.plugins;

        var verreg = /([0-9]\.[0-9])/g;
        for (var i = 0; i < plugins.length; i++)
        {
          var plugin = plugins[i];

          for (var j = 0; j < pluginNames.length; j++)
          {
            if (plugin.name.indexOf(pluginNames[j]) !== -1)
            {
              if (verreg.test(plugin.name) || verreg.test(plugin.description)) {
                return RegExp.$1;
              }
            }
          }
        }

        return "";
      }
    },


    /**
     * Internal helper for getting the availability of a given plugin.
     *
     * @param activeXName {String} The name which should be used to generate
     *   the test ActiveX Object.
     * @param pluginNames {Array} The names with which the plugins are listed in
     *   the navigator.plugins list.
     * @return {Boolean} <code>true</code>, if the plugin available
     */
    __isAvailable : function(activeXName, pluginNames) {
      // IE checks
      if (qx.bom.client.Engine.getName() == "mshtml") {

        var control = window.ActiveXObject;
        if (!control) {
          return false;
        }

        try {
          new ActiveXObject(activeXName);
        } catch(ex) {
          return false;
        }

        return true;
      // all other
      } else {

        var plugins = navigator.plugins;
        if (!plugins) {
          return false;
        }

        var name;
        for (var i = 0; i < plugins.length; i++)
        {
          name = plugins[i].name;

          for (var j = 0; j < pluginNames.length; j++)
          {
            if (name.indexOf(pluginNames[j]) !== -1) {
              return true;
            }
          }
        }

        return false;
      }
    }
  },

  defer : function(statics) {
    qx.core.Environment.add("plugin.gears", statics.getGears);
    qx.core.Environment.add("plugin.quicktime", statics.getQuicktime);
    qx.core.Environment.add("plugin.quicktime.version", statics.getQuicktimeVersion);
    qx.core.Environment.add("plugin.windowsmedia", statics.getWindowsMedia);
    qx.core.Environment.add("plugin.windowsmedia.version", statics.getWindowsMediaVersion);
    qx.core.Environment.add("plugin.divx", statics.getDivX);
    qx.core.Environment.add("plugin.divx.version", statics.getDivXVersion);
    qx.core.Environment.add("plugin.silverlight", statics.getSilverlight);
    qx.core.Environment.add("plugin.silverlight.version", statics.getSilverlightVersion);
    qx.core.Environment.add("plugin.pdf", statics.getPdf);
    qx.core.Environment.add("plugin.pdf.version", statics.getPdfVersion);
    qx.core.Environment.add("plugin.activex", statics.getActiveX);
    qx.core.Environment.add("plugin.skype", statics.getSkype);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Cross browser XML document creation API
 *
 * The main purpose of this class is to allow you to create XML document objects in a
 * cross-browser fashion. Use <code>create</code> to create an empty document,
 * <code>fromString</code> to create one from an existing XML text. Both methods
 * return a *native DOM object*. That means you use standard DOM methods on such
 * an object (e.g. <code>createElement</code>).
 *
 * The following links provide further information on XML documents:
 *
 * * <a href="http://www.w3.org/TR/DOM-Level-2-Core/core.html#i-Document">W3C Interface Specification</a>
 * * <a href="http://msdn2.microsoft.com/en-us/library/ms535918.aspx">MS xml Object</a>
 * * <a href="http://msdn2.microsoft.com/en-us/library/ms764622.aspx">MSXML GUIDs and ProgIDs</a>
 * * <a href="http://developer.mozilla.org/en/docs/Parsing_and_serializing_XML">MDN Parsing and Serializing XML</a>
 */
qx.Class.define("qx.xml.Document",
{
  statics :
  {
    /** {String} ActiveX class name of DOMDocument (IE specific) */
    DOMDOC : null,

    /** {String} ActiveX class name of XMLHttpRequest (IE specific) */
    XMLHTTP : null,


    /**
     * Whether the given element is a XML document or element
     * which is part of a XML document.
     *
     * @param elem {Document|Element} Any DOM Document or Element
     * @return {Boolean} Whether the document is a XML document
     */
    isXmlDocument : function(elem)
    {
      if (elem.nodeType === 9) {
        return elem.documentElement.nodeName !== "HTML";
      } else if (elem.ownerDocument) {
        return this.isXmlDocument(elem.ownerDocument);
      } else {
        return false;
      }
    },


    /**
     * Create an XML document.
     *
     * Returns a native DOM document object, set up for XML.
     *
     * @param namespaceUri {String ? null} The namespace URI of the document element to create or null.
     * @param qualifiedName {String ? null} The qualified name of the document element to be created or null.
     * @return {Document} empty XML object
     */
    create : function(namespaceUri, qualifiedName)
    {
      // ActiveX - This is the preferred way for IE9 as well since it has no XPath
      // support when using the native implementation.createDocument
      if (qx.core.Environment.get("plugin.activex")) {
        var obj = new ActiveXObject(this.DOMDOC);
        //The SelectionLanguage property is no longer needed in MSXML 6; trying
        // to set it causes an exception in IE9.
        if (this.DOMDOC == "MSXML2.DOMDocument.3.0") {
          obj.setProperty("SelectionLanguage", "XPath");
        }

        if (qualifiedName)
        {
          var str = '<\?xml version="1.0" encoding="utf-8"?>\n<';

          str += qualifiedName;

          if (namespaceUri) {
            str += " xmlns='" + namespaceUri + "'";
          }

          str += " />";
          obj.loadXML(str);
        }

        return obj;
      }

      if (qx.core.Environment.get("xml.implementation")) {
        return document.implementation.createDocument(namespaceUri || "", qualifiedName || "", null);
      }

      throw new Error("No XML implementation available!");
    },


    /**
     * The string passed in is parsed into a DOM document.
     *
     * @param str {String} the string to be parsed
     * @return {Document} XML document with given content
     * @signature function(str)
     */
    fromString : function(str)
    {
      // Legacy IE/ActiveX
      if (qx.core.Environment.get("plugin.activex")) {
        var dom = qx.xml.Document.create();
        dom.loadXML(str);
        return dom;
      }

      if (qx.core.Environment.get("xml.domparser")) {
        var parser = new DOMParser();
        return parser.parseFromString(str, "text/xml");
      }

      throw new Error("No XML implementation available!");
    }
  },




  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics)
  {
    // Detecting available ActiveX implementations.
    if (qx.core.Environment.get("plugin.activex"))
    {
      // According to information on the Microsoft XML Team's WebLog
      // it is recommended to check for availability of MSXML versions 6.0 and 3.0.
      // http://blogs.msdn.com/xmlteam/archive/2006/10/23/using-the-right-version-of-msxml-in-internet-explorer.aspx
      var domDoc = [ "MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.3.0" ];
      var httpReq = [ "MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0" ];

      for (var i=0, l=domDoc.length; i<l; i++)
      {
        try
        {
          // Keep both objects in sync with the same version.
          // This is important as there were compatibility issues detected.
          new ActiveXObject(domDoc[i]);
          new ActiveXObject(httpReq[i]);
        }
        catch(ex) {
          continue;
        }

        // Update static constants
        statics.DOMDOC = domDoc[i];
        statics.XMLHTTP = httpReq[i];

        // Stop loop here
        break;
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Daniel Wagner (d_wagner)

************************************************************************ */
/**
 * Internal class which contains the checks used by {@link qx.core.Environment}.
 * All checks in here are marked as internal which means you should never use
 * them directly.
 *
 * This class should contain all XML-related checks
 *
 * @internal
 */
qx.Bootstrap.define("qx.bom.client.Xml",
{
  statics:
  {
    /**
     * Checks if XML is supported
     *
     * @internal
     * @return {Boolean} <code>true</code> if XML is supported
     */
    getImplementation : function() {
      return document.implementation && document.implementation.hasFeature &&
        document.implementation.hasFeature("XML", "1.0");
    },


    /**
     * Checks if an XML DOMParser is available
     *
     * @internal
     * @return {Boolean} <code>true</code> if DOMParser is supported
     */
    getDomParser : function() {
      return typeof window.DOMParser !== "undefined";
    },


    /**
     * Checks if the proprietary selectSingleNode method is available on XML DOM
     * nodes.
     *
     * @internal
     * @return {Boolean} <code>true</code> if selectSingleNode is available
     */
    getSelectSingleNode : function()
    {
      return typeof qx.xml.Document.create().selectSingleNode !== "undefined";
    },


    /**
     * Checks if the proprietary selectNodes method is available on XML DOM
     * nodes.
     *
     * @internal
     * @return {Boolean} <code>true</code> if selectSingleNode is available
     */
    getSelectNodes : function()
    {
      return typeof qx.xml.Document.create().selectNodes !== "undefined";
    },


    /**
     * Checks availablity of the getElementsByTagNameNS XML DOM method.
     *
     * @internal
     * @return {Boolean} <code>true</code> if getElementsByTagNameNS is available
     */
    getElementsByTagNameNS : function()
    {
      return typeof qx.xml.Document.create().getElementsByTagNameNS !== "undefined";
    },


    /**
     * Checks if MSXML-style DOM Level 2 properties are supported.
     *
     * @internal
     * @return {Boolean} <code>true</code> if DOM Level 2 properties are supported
     */
    getDomProperties : function()
    {
      var doc = qx.xml.Document.create();
      return ("getProperty" in doc && typeof doc.getProperty("SelectionLanguage") === "string");
    },


    /**
     * Checks if the getAttributeNS and setAttributeNS methods are supported on
     * XML DOM elements
     *
     * @internal
     * @return {Boolean} <code>true</code> if get/setAttributeNS is supported
     */
    getAttributeNS : function()
    {
      var docElem = qx.xml.Document.fromString("<a></a>").documentElement;
      return typeof docElem.getAttributeNS === "function" &&
        typeof docElem.setAttributeNS === "function";
    },


    /**
     * Checks if the createElementNS method is supported on XML DOM documents
     *
     * @internal
     * @return {Boolean} <code>true</code> if createElementNS is supported
     */
    getCreateElementNS : function()
    {
      return typeof qx.xml.Document.create().createElementNS === "function";
    },


    /**
     * Checks if the proprietary createNode method is supported on XML DOM
     * documents
     *
     * @internal
     * @return {Boolean} <code>true</code> if DOM Level 2 properties are supported
     */
    getCreateNode : function()
    {
      return typeof qx.xml.Document.create().createNode !== "undefined";
    },


    /**
     * Checks if the proprietary getQualifiedItem method is supported for XML
     * element attributes
     *
     * @internal
     * @return {Boolean} <code>true</code> if DOM Level 2 properties are supported
     */
    getQualifiedItem : function()
    {
      var docElem = qx.xml.Document.fromString("<a></a>").documentElement;
      return typeof docElem.attributes.getQualifiedItem !== "undefined";
    }
  },

  defer : function(statics)
  {
    qx.core.Environment.add("xml.implementation", statics.getImplementation);
    qx.core.Environment.add("xml.domparser", statics.getDomParser);
    qx.core.Environment.add("xml.selectsinglenode", statics.getSelectSingleNode);
    qx.core.Environment.add("xml.selectnodes", statics.getSelectNodes);
    qx.core.Environment.add("xml.getelementsbytagnamens", statics.getElementsByTagNameNS);
    qx.core.Environment.add("xml.domproperties", statics.getDomProperties);
    qx.core.Environment.add("xml.attributens", statics.getAttributeNS);
    qx.core.Environment.add("xml.createelementns", statics.getCreateElementNS);
    qx.core.Environment.add("xml.createnode", statics.getCreateNode);
    qx.core.Environment.add("xml.getqualifieditem", statics.getQualifiedItem);
  }
});/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/**
 * Common base class for all focus events.
 */
qx.Class.define("qx.event.type.Focus",
{
  extend : qx.event.type.Event,

  members :
  {
    /**
     * Initialize the fields of the event. The event must be initialized before
     * it can be dispatched.
     *
     * @param target {Object} Any possible event target
     * @param relatedTarget {Object} Any possible event target
     * @param canBubble {Boolean?false} Whether or not the event is a bubbling event.
     *     If the event is bubbling, the bubbling can be stopped using
     *     {@link qx.event.type.Event#stopPropagation}
     * @return {qx.event.type.Event} The initialized event instance
     */
    init : function(target, relatedTarget, canBubble)
    {
      this.base(arguments, canBubble, false);

      this._target = target;
      this._relatedTarget = relatedTarget;

      return this;
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/* ************************************************************************

#require(qx.event.handler.Window)
#require(qx.event.handler.Keyboard)

************************************************************************ */

/**
 * Feature-rich console appender for the qooxdoo logging system.
 *
 * Creates a small inline element which is placed in the top-right corner
 * of the window. Prints all messages with a nice color highlighting.
 *
 * * Allows user command inputs.
 * * Command history enabled by default (Keyboard up/down arrows).
 * * Lazy creation on first open.
 * * Clearing the console using a button.
 * * Display of offset (time after loading) of each message
 * * Supports keyboard shortcuts F7 or Ctrl+D to toggle the visibility
 */
qx.Class.define("qx.log.appender.Console",
{
  statics :
  {
    /*
    ---------------------------------------------------------------------------
      INITIALIZATION AND SHUTDOWN
    ---------------------------------------------------------------------------
    */

   __main : null,

   __log : null,

   __cmd : null,

   __lastCommand : null,

    /**
     * Initializes the console, building HTML and pushing last
     * log messages to the output window.
     *
     */
    init : function()
    {
      // Build style sheet content
      var style =
      [
        '.qxconsole{z-index:10000;width:600px;height:300px;top:0px;right:0px;position:absolute;border-left:1px solid black;color:black;border-bottom:1px solid black;color:black;font-family:Consolas,Monaco,monospace;font-size:11px;line-height:1.2;}',

        '.qxconsole .control{background:#cdcdcd;border-bottom:1px solid black;padding:4px 8px;}',
        '.qxconsole .control a{text-decoration:none;color:black;}',

        '.qxconsole .messages{background:white;height:100%;width:100%;overflow:auto;}',
        '.qxconsole .messages div{padding:0px 4px;}',

        '.qxconsole .messages .user-command{color:blue}',
        '.qxconsole .messages .user-result{background:white}',
        '.qxconsole .messages .user-error{background:#FFE2D5}',
        '.qxconsole .messages .level-debug{background:white}',
        '.qxconsole .messages .level-info{background:#DEEDFA}',
        '.qxconsole .messages .level-warn{background:#FFF7D5}',
        '.qxconsole .messages .level-error{background:#FFE2D5}',
        '.qxconsole .messages .level-user{background:#E3EFE9}',
        '.qxconsole .messages .type-string{color:black;font-weight:normal;}',
        '.qxconsole .messages .type-number{color:#155791;font-weight:normal;}',
        '.qxconsole .messages .type-boolean{color:#15BC91;font-weight:normal;}',
        '.qxconsole .messages .type-array{color:#CC3E8A;font-weight:bold;}',
        '.qxconsole .messages .type-map{color:#CC3E8A;font-weight:bold;}',
        '.qxconsole .messages .type-key{color:#565656;font-style:italic}',
        '.qxconsole .messages .type-class{color:#5F3E8A;font-weight:bold}',
        '.qxconsole .messages .type-instance{color:#565656;font-weight:bold}',
        '.qxconsole .messages .type-stringify{color:#565656;font-weight:bold}',

        '.qxconsole .command{background:white;padding:2px 4px;border-top:1px solid black;}',
        '.qxconsole .command input{width:100%;border:0 none;font-family:Consolas,Monaco,monospace;font-size:11px;line-height:1.2;}',
        '.qxconsole .command input:focus{outline:none;}'
      ];

      // Include stylesheet
      qx.bom.Stylesheet.createElement(style.join(""));

      // Build markup
      var markup =
      [
        '<div class="qxconsole">',
        '<div class="control"><a href="javascript:qx.log.appender.Console.clear()">Clear</a> | <a href="javascript:qx.log.appender.Console.toggle()">Hide</a></div>',
        '<div class="messages">',
        '</div>',
        '<div class="command">',
        '<input type="text"/>',
        '</div>',
        '</div>'
      ];

      // Insert HTML to access DOM node
      var wrapper = document.createElement("DIV");
      wrapper.innerHTML = markup.join("");
      var main = wrapper.firstChild;
      document.body.appendChild(wrapper.firstChild);

      // Make important DOM nodes available
      this.__main = main;
      this.__log = main.childNodes[1];
      this.__cmd = main.childNodes[2].firstChild;

      // Correct height of messages frame
      this.__onResize();

      // Finally register to log engine
      qx.log.Logger.register(this);

      // Register to object manager
      qx.core.ObjectRegistry.register(this);
    },


    /**
     * Used by the object registry to dispose this instance e.g. remove listeners etc.
     *
     */
    dispose : function()
    {
      qx.event.Registration.removeListener(document.documentElement, "keypress", this.__onKeyPress, this);
      qx.log.Logger.unregister(this);
    },





    /*
    ---------------------------------------------------------------------------
      INSERT & CLEAR
    ---------------------------------------------------------------------------
    */

    /**
     * Clears the current console output.
     *
     */
    clear : function()
    {
      // Remove all messages
      this.__log.innerHTML = "";
    },


    /**
     * Processes a single log entry
     *
     * @signature function(entry)
     * @param entry {Map} The entry to process
     */
    process : function(entry)
    {
      // Append new content
      this.__log.appendChild(qx.log.appender.Util.toHtml(entry));

      // Scroll down
      this.__scrollDown();
    },


    /**
     * Automatically scroll down to the last line
     */
    __scrollDown : function() {
      this.__log.scrollTop = this.__log.scrollHeight;
    },





    /*
    ---------------------------------------------------------------------------
      VISIBILITY TOGGLING
    ---------------------------------------------------------------------------
    */

    /** {Boolean} Flag to store last visibility status */
    __visible : true,


    /**
     * Toggles the visibility of the console between visible and hidden.
     *
     */
    toggle : function()
    {
      if (!this.__main)
      {
        this.init();
      }
      else if (this.__main.style.display == "none")
      {
        this.show();
      }
      else
      {
        this.__main.style.display = "none";
      }
    },


    /**
     * Shows the console.
     *
     */
    show : function()
    {
      if (!this.__main) {
        this.init();
      } else {
        this.__main.style.display = "block";
        this.__log.scrollTop = this.__log.scrollHeight;
      }
    },


    /*
    ---------------------------------------------------------------------------
      COMMAND LINE SUPPORT
    ---------------------------------------------------------------------------
    */

    /** {Array} List of all previous commands. */
    __history : [],


    /**
     * Executes the currently given command
     *
     */
    execute : function()
    {
      var value = this.__cmd.value;
      if (value == "") {
        return;
      }

      if (value == "clear") {
        this.clear();
        return;
      }

      var command = document.createElement("div");
      command.innerHTML = qx.log.appender.Util.escapeHTML(">>> " + value);
      command.className = "user-command";

      this.__history.push(value);
      this.__lastCommand = this.__history.length;
      this.__log.appendChild(command);
      this.__scrollDown();

      try {
        var ret = window.eval(value);
      }
      catch (ex) {
        qx.log.Logger.error(ex);
      }

      if (ret !== undefined) {
        qx.log.Logger.debug(ret);
      }
    },




    /*
    ---------------------------------------------------------------------------
      EVENT LISTENERS
    ---------------------------------------------------------------------------
    */

    /**
     * Event handler for resize listener
     *
     * @param e {Event} Event object
     */
    __onResize : function(e) {
      this.__log.style.height = (this.__main.clientHeight - this.__main.firstChild.offsetHeight - this.__main.lastChild.offsetHeight) + "px";
    },


    /**
     * Event handler for keydown listener
     *
     * @param e {Event} Event object
     */
    __onKeyPress : function(e)
    {
      var iden = e.getKeyIdentifier();

      // Console toggling
      if ((iden == "F7") || (iden == "D" && e.isCtrlPressed()))
      {
        this.toggle();
        e.preventDefault();
      }

      // Not yet created
      if (!this.__main) {
        return;
      }

      // Active element not in console
      if (!qx.dom.Hierarchy.contains(this.__main, e.getTarget())) {
        return;
      }

      // Command execution
      if (iden == "Enter" && this.__cmd.value != "")
      {
        this.execute();
        this.__cmd.value = "";
      }

      // History managment
      if (iden == "Up" || iden == "Down")
      {
        this.__lastCommand += iden == "Up" ? -1 : 1;
        this.__lastCommand = Math.min(Math.max(0, this.__lastCommand), this.__history.length);

        var entry = this.__history[this.__lastCommand];
        this.__cmd.value = entry || "";
        this.__cmd.select();
      }
    }
  },




  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.event.Registration.addListener(document.documentElement, "keypress", statics.__onKeyPress, statics);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
     2006 STZ-IDA, Germany, http://www.stz-ida.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Andreas Junghans (lucidcake)

************************************************************************ */

/**
 * Cross-browser wrapper to work with CSS stylesheets.
 */
qx.Bootstrap.define("qx.bom.Stylesheet",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Include a CSS file
     *
     * <em>Note:</em> Using a resource ID as the <code>href</code> parameter
     * will no longer be supported. Call
     * <code>qx.util.ResourceManager.getInstance().toUri(href)</code> to get
     * valid URI to be used with this method.
     *
     * @param href {String} Href value
     * @param doc {Document?} Document to modify
     */
    includeFile : function(href, doc)
    {
      if (!doc) {
        doc = document;
      }

      var el = doc.createElement("link");
      el.type = "text/css";
      el.rel = "stylesheet";
      el.href = href;

      var head = doc.getElementsByTagName("head")[0];
      head.appendChild(el);
    },


    /**
     * Create a new Stylesheet node and append it to the document
     *
     * @param text {String?} optional string of css rules
     * @return {Stylesheet} the generates stylesheet element
     */
    createElement : function(text)
    {
      if (qx.core.Environment.get("html.stylesheet.createstylesheet")) {
        var sheet = document.createStyleSheet();

        if (text) {
          sheet.cssText = text;
        }

        return sheet;
      }
      else {
        var elem = document.createElement("style");
        elem.type = "text/css";

        if (text) {
          elem.appendChild(document.createTextNode(text));
        }

        document.getElementsByTagName("head")[0].appendChild(elem);
        return elem.sheet;
      }
    },

    /**
     * Insert a new CSS rule into a given Stylesheet
     *
     * @param sheet {Object} the target Stylesheet object
     * @param selector {String} the selector
     * @param entry {String} style rule
     */
    addRule : function(sheet, selector, entry)
    {
      if (qx.core.Environment.get("html.stylesheet.insertrule")) {
        sheet.insertRule(selector + "{" + entry + "}", sheet.cssRules.length);
      }
      else {
        sheet.addRule(selector, entry);
      }
    },


    /**
     * Remove a CSS rule from a stylesheet
     *
     * @param sheet {Object} the Stylesheet
     * @param selector {String} the Selector of the rule to remove
     */
    removeRule : function(sheet, selector)
    {
      if (qx.core.Environment.get("html.stylesheet.deleterule")) {
        var rules = sheet.cssRules;
        var len = rules.length;

        for (var i=len-1; i>=0; --i)
        {
          if (rules[i].selectorText == selector) {
            sheet.deleteRule(i);
          }
        }
      }
      else {
        var rules = sheet.rules;
        var len = rules.length;

        for (var i=len-1; i>=0; --i)
        {
          if (rules[i].selectorText == selector) {
            sheet.removeRule(i);
          }
        }
      }
    },


    /**
     * Remove the given sheet from its owner.
     * @param sheet {Object} the stylesheet object
     */
    removeSheet : function(sheet) {
      var owner = sheet.ownerNode ? sheet.ownerNode : sheet.owningElement;
      qx.dom.Element.removeChild(owner, owner.parentNode);
    },


    /**
     * Remove all CSS rules from a stylesheet
     *
     * @param sheet {Object} the stylesheet object
     */
    removeAllRules : function(sheet)
    {
      if (qx.core.Environment.get("html.stylesheet.deleterule")) {
        var rules = sheet.cssRules;
        var len = rules.length;

        for (var i=len-1; i>=0; i--) {
          sheet.deleteRule(i);
        }
      } else {
        var rules = sheet.rules;
        var len = rules.length;

        for (var i=len-1; i>=0; i--) {
          sheet.removeRule(i);
        }
      }
    },


    /**
     * Add an import of an external CSS file to a stylesheet
     *
     * @param sheet {Object} the stylesheet object
     * @param url {String} URL of the external stylesheet file
     */
    addImport : function(sheet, url)
    {
      if (qx.core.Environment.get("html.stylesheet.addimport")) {
        sheet.addImport(url);
      }
      else {
        sheet.insertRule('@import "' + url + '";', sheet.cssRules.length);
      }
    },


    /**
     * Removes an import from a stylesheet
     *
     * @param sheet {Object} the stylesheet object
     * @param url {String} URL of the imported CSS file
     */
    removeImport : function(sheet, url)
    {
      if (qx.core.Environment.get("html.stylesheet.removeimport")) {
        var imports = sheet.imports;
        var len = imports.length;

        for (var i=len-1; i>=0; i--)
        {
          if (imports[i].href == url ||
          imports[i].href == qx.util.Uri.getAbsolute(url))
          {
            sheet.removeImport(i);
          }
        }
      }
      else {
        var rules = sheet.cssRules;
        var len = rules.length;

        for (var i=len-1; i>=0; i--)
        {
          if (rules[i].href == url) {
            sheet.deleteRule(i);
          }
        }
      }
    },


    /**
     * Remove all imports from a stylesheet
     *
     * @param sheet {Object} the stylesheet object
     */
    removeAllImports : function(sheet)
    {
      if (qx.core.Environment.get("html.stylesheet.removeimport")) {
        var imports = sheet.imports;
        var len = imports.length;

        for (var i=len-1; i>=0; i--) {
          sheet.removeImport(i);
        }
      }
      else {
        var rules = sheet.cssRules;
        var len = rules.length;

        for (var i=len-1; i>=0; i--)
        {
          if (rules[i].type == rules[i].IMPORT_RULE) {
            sheet.deleteRule(i);
          }
        }
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Daniel Wagner (d_wagner)

************************************************************************ */
/**
 * Internal class which contains the checks used by {@link qx.core.Environment}.
 * All checks in here are marked as internal which means you should never use
 * them directly.
 *
 * This class contains checks related to Stylesheet objects.
 *
 * @internal
 */
qx.Bootstrap.define("qx.bom.client.Stylesheet",
{
  statics:
  {
    /**
     * Returns a stylesheet to be used for feature checks
     *
     * @return {Stylesheet} Stylesheet element
     */
    __getStylesheet : function()
    {
      if (!qx.bom.client.Stylesheet.__stylesheet) {
        qx.bom.client.Stylesheet.__stylesheet = qx.bom.Stylesheet.createElement();
      }
      return qx.bom.client.Stylesheet.__stylesheet;
    },


    /**
     * Check for IE's non-standard document.createStyleSheet function.
     * In IE9 (standards mode), the typeof check returns "function" so false is
     * returned. This is intended since IE9 supports the DOM-standard
     * createElement("style") which should be used instead.
     *
     * @internal
     * @return {Boolean} <code>true</code> if the browser supports
     * document.createStyleSheet
     */
    getCreateStyleSheet : function()
    {
      return typeof document.createStyleSheet === "object";
    },


    /**
     * Check for stylesheet.insertRule. Legacy IEs do not support this.
     *
     * @internal
     * @return {Boolean} <code>true</code> if insertRule is supported
     */
    getInsertRule : function()
    {
      return typeof qx.bom.client.Stylesheet.__getStylesheet().insertRule === "function";
    },


    /**
     * Check for stylesheet.deleteRule. Legacy IEs do not support this.
     *
     * @internal
     * @return {Boolean} <code>true</code> if deleteRule is supported
     */
    getDeleteRule : function()
    {
      return typeof qx.bom.client.Stylesheet.__getStylesheet().deleteRule === "function";
    },


    /**
     * Decides whether to use the legacy IE-only stylesheet.addImport or the
     * DOM-standard stylesheet.insertRule('@import [...]')
     *
     * @internal
     * @return {Boolean} <code>true</code> if stylesheet.addImport is supported
     */
    getAddImport : function()
    {
      return (typeof qx.bom.client.Stylesheet.__getStylesheet().addImport === "object");
    },


    /**
     * Decides whether to use the legacy IE-only stylesheet.removeImport or the
     * DOM-standard stylesheet.deleteRule('@import [...]')
     *
     * @internal
     * @return {Boolean} <code>true</code> if stylesheet.removeImport is supported
     */
    getRemoveImport : function()
    {
      return (typeof qx.bom.client.Stylesheet.__getStylesheet().removeImport === "object");
    }
  },



  defer : function (statics) {
    qx.core.Environment.add("html.stylesheet.createstylesheet", statics.getCreateStyleSheet);
    qx.core.Environment.add("html.stylesheet.insertrule", statics.getInsertRule);
    qx.core.Environment.add("html.stylesheet.deleterule", statics.getDeleteRule);
    qx.core.Environment.add("html.stylesheet.addimport", statics.getAddImport);
    qx.core.Environment.add("html.stylesheet.removeimport", statics.getRemoveImport);
  }
});/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * The purpose of this class is to contain all checks for PhoneGap/Cordova.
 *
 * This class is used by {@link qx.core.Environment} and should not be used
 * directly. Please check its class comment for details how to use it.
 *
 * @internal
 */
qx.Bootstrap.define("qx.bom.client.PhoneGap",
{
  statics :
  {
    /**
     * Checks if PhoneGap/Cordova is available.
     * @return {Boolean} <code>true</code>, if it could be used.
     * @internal
     */
    getPhoneGap : function() {
      return ("cordova" in window || "Cordova" in window || "PhoneGap" in window);
    },


    /**
     * Checks if notifications can be displayed.
     * @return {Boolean} <code>true</code>, if it could be used.
     * @internal
     */
    getNotification : function() {
      return "notification" in navigator;
    }
  },

  defer : function(statics) {
    qx.core.Environment.add("phonegap", statics.getPhoneGap);
    qx.core.Environment.add("phonegap.notification", statics.getNotification);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * This mixin resizes the container element to the height of the parent element.
 * Use this when the height can not be set by CSS.
 *
 */
qx.Mixin.define("qx.ui.mobile.core.MResize",
{
  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** Whether the resize should fire the "domupdated" event. Set this to "true"
     *  whenever other elements should react on this size change (e.g. when the size
     *  change does not infect the size of the application, but other widgets should
     *  react).
     */
    fireDomUpdatedOnResize : {
      check : "Boolean",
      init : false
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __lastHeight : null,
    __lastWidth : null,


    /**
     * Removes fixed size from container.
     */
    releaseFixedSize : function() {
      var parent = this.getLayoutParent();

      if (parent && parent.getContainerElement()) {
          var element = this.getContainerElement();
          qx.bom.element.Style.set(element, "height", "auto");
          qx.bom.element.Style.set(element, "width", "auto");
      }
    },


    /**
     * Resizes the container element to the height of the parent element.
     */
    fixSize : function()
    {
      var parent = this.getLayoutParent();

      if (parent && parent.getContainerElement()) {
        var height = parent.getContainerElement().offsetHeight;
        var width = parent.getContainerElement().offsetWidth;

        // Only fix size, when value are above zero.
        if(height == 0 || width == 0) {
          return;
        }

        if (!this.getFireDomUpdatedOnResize()) {
          this._setHeight(height);
          this._setWidth(width);
        } else if (this.__lastHeight != height && this.__lastWidth != width) {
          this._setHeight(height);
          this._setWidth(width);
          this.__lastWidth = width;
          this.__lastHeight = height;
          this._domUpdated();
        }
      }
    },


    /**
     * Sets the height of the container element.
     *
     * @param height {Integer} The height to set
     */
    _setHeight : function(height)
    {
      var element = this.getContainerElement();
      if (qx.core.Environment.get("qx.mobile.nativescroll"))
      {
        qx.bom.element.Style.set(element, "minHeight", height + "px");
      } else {
        qx.bom.element.Style.set(element, "height", height + "px");
      }
    },



    /**
     * Sets the width of the container element.
     *
     * @param width {Integer} The width to set
     */
    _setWidth : function(width)
    {
      var element = this.getContainerElement();
      if (qx.core.Environment.get("qx.mobile.nativescroll"))
      {
        qx.bom.element.Style.set(element, "minWidth", width + "px");
      } else {
        qx.bom.element.Style.set(element, "width", width + "px");
      }
    }
  }


})/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * A page is a widget which provides a screen with which users
 * can interact in order to do something. Most times a page provides a single task
 * or a group of related tasks.
 *
 * A qooxdoo mobile application is usually composed of one or more loosely bound
 * pages. Typically there is one page that presents the "main" view.
 *
 * Pages can have one or more child widgets from the {@link qx.ui.mobile}
 * namespace. Normally a page provides a {@link qx.ui.mobile.navigationbar.NavigationBar}
 * for the navigation between pages.
 *
 * To navigate between two pages, just call the {@link #show} method of the page
 * that should be shown. Depending on the used page manager a page transition will be animated.
 * There are several animations available. Have
 * a look at the {@link qx.ui.mobile.page.Manager} manager or {@link qx.ui.mobile.layout.Card} card layout for more information.
 *
 * A page has predefined lifecycle methods that get called by the used page manager
 * when a page gets shown. Each time another page is requested to be shown the currently shown page
 * is stopped. The other page, will be, if shown for the first time, initialized and started
 * afterwards. For all called lifecycle methods an event is fired.
 *
 * Call of the {@link #show} method triggers the following lifecycle methods:
 *
 * * <strong>initialize</strong>: Initializes the page to show
 * * <strong>start</strong>: Gets called when the page to show is started
 * * <strong>stop</strong>:  Stops the current page
 *
 * IMPORTANT: Define all child widgets of a page when the {@link #initialize} lifecycle
 * method is called, either by listening to the {@link #initialize} event or overriding
 * the {@link #_initialize} method. This is because a page can be instanced during
 * application startup and would then decrease performance when the widgets would be
 * added during constructor call. The <code>initialize</code> event and the
 * {@link #_initialize} lifecycle method are only called when the page is shown
 * for the first time.
 *
 */
qx.Class.define("qx.ui.mobile.page.Page",
{
  extend : qx.ui.mobile.container.Composite,
  include : qx.ui.mobile.core.MResize,

 /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function(layout)
  {
    this.base(arguments, layout || new qx.ui.mobile.layout.VBox());
  },



 /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics : {
    _currentPage : null,

    /**
     * Event handler. Called when the device is ready.
     */
    _onDeviceReady : function() {
      qx.bom.Event.addNativeListener(document, "backbutton", qx.ui.mobile.page.Page._onBackButton);
      qx.bom.Event.addNativeListener(document, "menubutton", qx.ui.mobile.page.Page._onMenuButton);
    },


    /**
     * Event handler. Called when the back button of the device was pressed.
     */
    _onBackButton : function()
    {
      if (qx.core.Environment.get("phonegap") && qx.core.Environment.get("os.name") == "android")
      {
        var exit = true;
        if (qx.ui.mobile.page.Page._currentPage) {
          exit = qx.ui.mobile.page.Page._currentPage.back(true);
        }
        if (exit) {
          navigator.app.exitApp();
        }
      }
    },


    /**
     * Event handler. Called when the menu button of the device was pressed.
     */
    _onMenuButton : function()
    {
      if (qx.core.Environment.get("phonegap") && qx.core.Environment.get("os.name") == "android")
      {
        if (qx.ui.mobile.page.Page._currentPage) {
          qx.ui.mobile.page.Page._currentPage.menu();
        }
      }
    }
  },


 /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired when the lifecycle method {@link #initialize} is called */
    "initialize" : "qx.event.type.Event",

    /** Fired when the lifecycle method {@link #start} is called */
    "start" : "qx.event.type.Event",

    /** Fired when the lifecycle method {@link #stop} is called */
    "stop" : "qx.event.type.Event",

    /** Fired when the lifecycle method {@link #pause} is called */
    "pause" : "qx.event.type.Event",

    /** Fired when the lifecycle method {@link #resume} is called */
    "resume" : "qx.event.type.Event",

    /** Fired when the method {@link #back} is called. Data indicating
     *  whether the action was triggered by a key event or not.
     */
    "back" : "qx.event.type.Data",

    /** Fired when the method {@link #menu} is called */
    "menu" : "qx.event.type.Event"
  },




 /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      refine : true,
      init : "page"
    }
  },


 /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __initialized : false,

    // overridden
    show : function(properties)
    {
      qx.ui.mobile.page.Page._currentPage = this;
      this.initialize();
      this.start();
      this.base(arguments, properties);
    },


    // overridden
    exclude : function(properties)
    {
      this.stop();
      this.base(arguments, properties);
    },


    /**
     * Fires the <code>back</code> event. Call this method if you want to request
     * a back action. For Android PhoneGap applications this method gets called
     * by the used page manager when the back button was pressed. Return <code>true</code>
     * to exit the application.
     *
     * @param triggeredByKeyEvent {Boolean} Whether the back action was triggered by a key event.
     * @return {Boolean} Whether the exit should be exit or not. Return <code>true</code
     *     to exit the application. Only needed for Android PhoneGap applications.
     */
    back : function(triggeredByKeyEvent)
    {
      this.fireDataEvent("back", triggeredByKeyEvent);
      var value = this._back(triggeredByKeyEvent);
      return value || false;
    },


    /**
     * Override this method if you want to perform a certain action when back
     * is called.
     *
     * @param triggeredByKeyEvent {Boolean} Whether the back action was triggered by a key event.
     * @return {Boolean} Whether the exit should be exit or not. Return <code>true</code
     *     to exit the application. Only needed for Android PhoneGap applications.
     * @see #back
     * @abstract
     */
    _back : function(triggeredByKeyEvent)
    {

    },


    /**
     * Only used by Android PhoneGap applications. Called by the used page manager
     * when the menu button was pressed. Fires the <code>menu</code> event.
     */
    menu : function() {
      this.fireEvent("menu");
    },


    /*
    ---------------------------------------------------------------------------
      Lifecycle Methods
    ---------------------------------------------------------------------------
    */

    /**
     * Lifecycle method. Called by the page manager when the page is shown.
     * Fires the <code>initialize</code> event. You should create and add all your
     * child widgets of the view,  either by listening to the {@link #initialize} event or overriding
     * the {@link #_initialize} method. This is because a page can be instanced during
     * application startup and would then decrease performance when the widgets would be
     * added during constructor call. The {@link #_initialize} lifecycle method and the
     * <code>initialize</code> are only called once when the page is shown for the first time.
     */
    initialize : function()
    {
      if (!this.isInitialized())
      {
        this._initialize();
        this.__initialized = true;
        this.fireEvent("initialize");
      }
    },


    /**
     * Override this method if you would like to perform a certain action when initialize
     * is called.
     *
     * @see #initialize
     */
    _initialize : function()
    {

    },


    /**
     * Returns the status of the initialization of the page.
     *
     * @return {Boolean} Whether the page is already initialized or not
     */
    isInitialized : function()
    {
      return this.__initialized;
    },


    /**
     * Lifecycle method. Called by the page manager after the {@link #initialize}
     * method when the page is shown. Fires the <code>start</code> event. You should
     * register all your event listener when this event occurs, so that no page
     * updates are down when page is not shown.
     */
    start : function() {
      this._start();
      this.fireEvent("start");
    },


    /**
     * Override this method if you would like to perform a certain action when start
     * is called.
     *
     * @see #start
     */
    _start : function()
    {

    },


    /**
     * Lifecycle method. Called by the page manager when another page is shown.
     * Fires the <code>stop</code> event. You should unregister all your event
     * listener when this event occurs, so that no page updates are down when page is not shown.
     */
    stop : function()
    {
      this._stop();
      this.fireEvent("stop");
    },


    /**
     * Override this method if you would like to perform a certain action when stop
     * is called.
     *
     * @see #stop
     */
    _stop : function()
    {

    },


    /**
     * Lifecycle method. Not used right now. Should be called when the current page
     * is interrupted, e.g. by a dialog, so that page view updates can be interrupted.
     * Fires the <code>pause</code> event.
     */
    pause : function() {
      this._pause();
      this.fireEvent("pause");
    },


    /**
     * Override this method if you would like to perform a certain action when pause
     * is called.
     *
     * @see #pause
     */
    _pause : function()
    {

    },


    /**
     * Lifecycle method. Not used right now. Should be called when the current page
     * is resuming from a interruption, e.g. when a dialog is closed, so that page
     * can resume updating the view.
     * Fires the <code>resume</code> event.
     */
    resume : function() {
      this._resume();
      this.fireEvent("resume");
    },


    /**
     * Override this method if you would like to perform a certain action when resume
     * is called.
     *
     * @see #resume
     */
    _resume : function()
    {

    }
  },



 /*
  *****************************************************************************
      DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    if (qx.core.Environment.get("phonegap") && qx.core.Environment.get("os.name") == "android")
    {
      qx.bom.Event.addNativeListener(document, "deviceready", statics._onDeviceReady);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * All widgets that are added to the navigation container should implement this interface.
 */
qx.Interface.define("qx.ui.mobile.container.INavigation",
{
  members :
  {
    /**
     * Returns the title widget that is merged into the navigation bar.
     *
     * @return {qx.ui.mobile.navigationbar.Title} The title of the navigation bar
     */
    getTitleWidget : function() {},


    /**
     * Returns the left container that is merged into the navigation bar.
     *
     * @return {qx.ui.mobile.container.Composite} The left container of the navigation bar
     */
    getLeftContainer : function() {},


    /**
     * Returns the right container that is merged into the navigation bar.
     *
     * @return {qx.ui.mobile.container.Composite} The right container of the navigation bar
     */
    getRightContainer : function() {}
  }
});/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * Specialized page. This page includes already a {@link qx.ui.mobile.navigationbar.NavigationBar}
 * and and a {@link qx.ui.mobile.container.Scroll} container.
 * The NavigationPage can only be used with a page manager {@link qx.ui.mobile.page.Manager}.

 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *
 *  var manager = new qx.ui.mobile.page.Manager();
 *  var page = new qx.ui.mobile.page.NavigationPage();
 *  page.setTitle("Page Title");
 *  page.setShowBackButton(true);
 *  page.setBackButtonText("Back")
 *  page.addListener("initialize", function()
 *  {
 *    var button = new qx.ui.mobile.form.Button("Next Page");
 *    page.getContent().add(button);
 *  },this);
 *
 *  page.addListener("back", function()
 *  {
 *    otherPage.show({animation:"cube", reverse:true});
 *  },this);
 *
 *  manager.addDetail(page);
 *  page.show();
 * </pre>
 *
 * This example creates a NavigationPage with a title and a back button. In the
 * <code>initialize</code> lifecycle method a button is added.
 */
qx.Class.define("qx.ui.mobile.page.NavigationPage",
{
  extend : qx.ui.mobile.page.Page,
  implement : qx.ui.mobile.container.INavigation,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param wrapContentByGroup {Boolean} Defines whether a group box should wrap the content. This can be used for defining a page margin.
   * @param layout {qx.ui.mobile.layout.Abstract} The layout of this page.
   */
  construct : function(wrapContentByGroup, layout)
  {
    this.base(arguments);

    if(wrapContentByGroup != null) {
      this._wrapContentByGroup = wrapContentByGroup;
    }
  },

  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired when the user tapped on the navigation button */
    action : "qx.event.type.Event",

    /** Fired when parent portrait container should hide. **/
    hidePortraitContainer : "qx.event.type.Event"
  },


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** The title of the page */
    title :
    {
      check : "String",
      init : "",
      event : "changeTitle",
      apply : "_applyTitle"
    },


    /** The back button text */
    backButtonText :
    {
      check : "String",
      init : "",
      apply : "_applyBackButtonText"
    },


    /** The action button text */
    buttonText :
    {
      check : "String",
      init : "",
      apply : "_applyButtonText"
    },


    /**
     * Whether to show the back button.
     */
    showBackButton:
    {
      check : "Boolean",
      init : false,
      apply : "_applyShowBackButton"
    },


    /**
     * Indicates whether the back button should be shown on tablet.
     */
    showBackButtonOnTablet:
    {
      check : "Boolean",
      init : false
    },


    /**
     * Whether to show the action button.
     */
    showButton:
    {
      check : "Boolean",
      init : false,
      apply : "_applyShowButton"
    },


    /**
     * Toggles visibility of NavigationBar in
     * wrapping container {@link qx.ui.mobile.container.Navigation}
     */
    navigationBarHidden:
    {
      check : "Boolean",
      init : false
    },


    /**
     * Sets the transition duration (in seconds) for the effect when hiding/showing
     * the NavigationBar through boolean property navigationBarHidden.
     */
    navigationBarToggleDuration:
    {
      check : "Number",
      init : 0.8
    },


    /**
     * The CSS class to add to the content per default.
     */
    contentCssClass :
    {
      check : "String",
      init : "content",
      nullable : true,
      apply : "_applyContentCssClass"
    }
  },


 /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    _isTablet : false,
    _wrapContentByGroup : true,
    __backButton : null,
    __button : null,
    __content : null,
    __scrollContainer : null,
    __title : null,
    __leftContainer : null,
    __rightContainer : null,


    // interface implementation
    getTitleWidget : function() {
      if (!this.__title) {
        this.__title = this._createTitleWidget();
      }
      return this.__title;
    },


    /**
     * Creates the navigation bar title.
     *
     * @return {qx.ui.mobile.navigationbar.Title} The created title widget
     */
    _createTitleWidget : function()
    {
      return new qx.ui.mobile.navigationbar.Title(this.getTitle());
    },


    // property apply
    _applyTitle : function(value, old) {
      if (this.__title) {
        this.__title.setValue(value);
      }
    },


    // interface implementation
    getLeftContainer : function() {
      if (!this.__leftContainer) {
        this.__leftContainer = this._createLeftContainer();
      }
      return this.__leftContainer;
    },


    // interface implementation
    getRightContainer : function() {
      if (!this.__rightContainer) {
        this.__rightContainer = this._createRightContainer();
      }
      return this.__rightContainer;
    },


    /**
     * Creates the left container for the navigation bar.
     *
     * @return {qx.ui.mobile.container.Composite} Creates the left container for the navigation bar.
     */
    _createLeftContainer : function() {
      var layout =new qx.ui.mobile.layout.HBox();
      var container = new qx.ui.mobile.container.Composite(layout);
      container.addCssClass("left-container");
      this.__backButton = this._createBackButton();
      this.__backButton.addListener("tap", this._onBackButtonTap, this);
      this._showBackButton();
      container.add(this.__backButton);
      return container;
    },


    /**
     * Creates the right container for the navigation bar.
     *
     * @return {qx.ui.mobile.container.Composite} Creates the right container for the navigation bar.
     */
    _createRightContainer : function() {
      var layout = new qx.ui.mobile.layout.HBox();
      var container = new qx.ui.mobile.container.Composite(layout);
      container.addCssClass("right-container");
      this.__button = this._createButton();
      this.__button.addListener("tap", this._onButtonTap, this);
      this._showButton();
      container.add(this.__button);
      return container;
    },


    /**
      * Creates the navigation bar back button.
      * Creates the scroll container.
      *
      * @return {qx.ui.mobile.navigationbar.BackButton} The created back button widget
      * @return {qx.ui.mobile.container.Scroll} The created scroll container
      */
    _createBackButton : function() {
      return new qx.ui.mobile.navigationbar.BackButton(this.getBackButtonText());
    },



    /**
      * Creates the navigation bar button.
      * Creates the content container.
      *
      * @return {qx.ui.mobile.navigationbar.Button} The created button widget
      * @return {qx.ui.mobile.container.Composite} The created content container
      */
    _createButton : function() {
     return new qx.ui.mobile.navigationbar.Button(this.getButtonText());
    },


    /**
    * Scrolls the wrapper contents to the x/y coordinates in a given
    * period.
    *
    * @param x {Integer} X coordinate to scroll to.
    * @param y {Integer} Y coordinate to scroll to.
    * @param time {Integer} Time slice in which scrolling should
    *              be done.
    *
    */
    scrollTo : function(x, y, time)
    {
      this.__scrollContainer.scrollTo(x, y, time);
    },


    /**
    * Scrolls the wrapper contents to the widgets coordinates in a given
    * period.
    *
    * @param widget {qx.ui.mobile.core.Widget} the widget, the scroll container should scroll to.
    * @param time {Integer} Time slice in which scrolling should
    *              be done.
    *
    */
    scrollToWidget : function(widget, time)
    {
      if(widget) {
        var widgetId = "#"+widget.getId();
        this.__scrollContainer.scrollToElement(widgetId, time);
      }
    },


    /**
     * Returns the content container. Add all your widgets to this container.
     *
     * @return {qx.ui.mobile.container.Composite} The content container
     */
    getContent : function()
    {
      return this.__content;
    },


    /**
     * Returns the back button widget.
     *
     * @return {qx.ui.mobile.navigationbar.BackButton} The back button widget
     */
    _getBackButton : function()
    {
      return this.__backButton;
    },


    /**
     * Returns the action button widget.
     *
     * @return {qx.ui.mobile.navigationbar.Button} The action button widget
     */
    _getButton : function()
    {
      return this.__button;
    },


    /**
     * Sets the isTablet flag.
     * @param isTablet {Boolean} value of the isTablet flag.
     */
    setIsTablet : function (isTablet) {
      this._isTablet = isTablet
    },


    /**
     * Returns the isTablet flag.
     * @return {Boolean} the isTablet flag of this page.
     */
    isTablet : function() {
      return this._isTablet;
    },


    /**
     * Returns the scroll container.
     *
     * @return {qx.ui.mobile.container.Scroll} The scroll container
     */
    _getScrollContainer : function()
    {
      return this.__scrollContainer;
    },


    /**
     * Adds a widget, below the NavigationBar.
     *
     * @param widget {qx.ui.mobile.core.Widget} The widget to add, after NavigationBar.
     */
    addAfterNavigationBar : function(widget) {
      if(widget && this.__scrollContainer) {
        this.addBefore(widget, this.__scrollContainer);
      }
    },


    // property apply
    _applyBackButtonText : function(value, old)
    {
      if (this.__backButton) {
        this.__backButton.setValue(value);
      }
    },


    // property apply
    _applyButtonText : function(value, old)
    {
      if (this.__button) {
        this.__button.setValue(value);
      }
    },


    // property apply
    _applyShowBackButton : function(value, old)
    {
      this._showBackButton();
    },


    // property apply
    _applyShowButton : function(value, old)
    {
      this._showButton();
    },


    // property apply
    _applyContentCssClass : function(value, old)
    {
      if (this.__content) {
        this.__content.setDefaultCssClass(value);
      }
    },


    /**
     * Helper method to show the back button.
     */
    _showBackButton : function()
    {
      if (this.__backButton)
      {
        if (this.getShowBackButton()) {
          this.__backButton.show();
        } else {
          this.__backButton.exclude();
        }
      }
    },


    /**
     * Helper method to show the button.
     */
    _showButton : function()
    {
      if (this.__button)
      {
        if (this.getShowButton()) {
          this.__button.show();
        } else {
          this.__button.exclude();
        }
      }
    },


    // overridden
    _initialize : function()
    {
      this.base(arguments);

      this.__scrollContainer = this._createScrollContainer();
      this.__content = this._createContent();

      if (this.__content) {
        this.__scrollContainer.add(this.__content, {flex :1});
      }
      if (this.__scrollContainer) {
        this.add(this.__scrollContainer, {flex:1});
      }
    },


    /**
     * Creates the scroll container.
     *
     * @return {qx.ui.mobile.container.Scroll} The created scroll container
     */
    _createScrollContainer : function()
    {
      // If OS < Android 4.1,
      // quirks mode for Android should be active.
      // This means that iScroll does not use transform3d, because
      // this causes layout problems with input fields.
      var osName = qx.core.Environment.get("os.name");
      var osVersion = qx.core.Environment.get("os.version");

      var osVersionParts = osVersion.split(".");

      // If OS is Android, and version is below 4.1 >> quirksmode active
      var isAndroidQuirksMode = (osName == "android")
        && ((parseInt(osVersionParts[0]) < 4) || (parseInt(osVersionParts[0]) == 4 && parseInt(osVersionParts[1]) < 1));

      if(isAndroidQuirksMode == true) {
        return new qx.ui.mobile.container.Scroll(false);
      } else {
        return new qx.ui.mobile.container.Scroll();
      }
    },


    /**
     * Creates the content container.
     *
     * @return {qx.ui.mobile.container.Composite} The created content container
     */
    _createContent : function()
    {
      var content = new qx.ui.mobile.container.Composite();
      content.setDefaultCssClass(this.getContentCssClass());

      if(this._wrapContentByGroup==true) {
        content.addCssClass("group");
      }

      return content;
    },


    /**
     * Event handler. Called when the tap event occurs on the back button.
     *
     * @param evt {qx.event.type.Tap} The tap event
     */
    _onBackButtonTap : function(evt)
    {
      this.back();
    },


    /**
     * Event handler. Called when the tap event occurs on the button.
     *
     * @param evt {qx.event.type.Tap} The tap event
     */
    _onButtonTap : function(evt)
    {
      this.fireEvent("action");
    }
  },


  destruct : function()
  {
    this._disposeObjects("__leftContainer", "__rightContainer", "__backButton",
      "__button", "__title");
    this.__leftContainer = this.__rightContainer = this.__backButton = this.__button = null;
    this.__title = this.__content = this.__scrollContainer = null;
    this._isTablet = null;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * The label widget displays a text or HTML content.
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var label = new qx.ui.mobile.basic.Label("Hello World");
 *
 *   this.getRoot().add(label);
 * </pre>
 *
 * This example create a widget to display the label.
 *
 */
qx.Class.define("qx.ui.mobile.basic.Label",
{
  extend : qx.ui.mobile.core.Widget,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param value {String?null} Text or HTML content to display
   */
  construct : function(value)
  {
    this.base(arguments);
    if (value) {
      this.setValue(value);
    }
    this.initWrap();
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      refine : true,
      init : "label"
    },


    /**
     * Text or HTML content to display
     */
    value :
    {
      nullable : true,
      init : null,
      check : "String",
      apply : "_applyValue",
      event : "changeValue"
    },


    // overridden
    anonymous :
    {
      refine : true,
      init : true
    },


    /**
     * Controls whether text wrap is activated or not.
     */
    wrap :
    {
      check : "Boolean",
      init : true,
      apply : "_applyWrap"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // property apply
    _applyValue : function(value, old)
    {
      this._setHtml(value);
    },


    // property apply
    _applyWrap : function(value, old)
    {
      if (value) {
        this.removeCssClass("no-wrap")
      } else {
        this.addCssClass("no-wrap");
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * A navigation bar title widget.
 */
qx.Class.define("qx.ui.mobile.navigationbar.Title",
{
  extend : qx.ui.mobile.basic.Label,

  properties :
  {
    wrap :
    {
      refine : true,
      init : false
    }
  },


 /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // overridden
    _getTagName : function()
    {
      return "h1";
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * A horizontal box layout.
 *
 * The horizontal box layout lays out widgets in a horizontal row, from left
 * to right.
 *
 * *Item Properties*
 *
 * <ul>
 * <li><strong>flex</strong> <em>(Integer)</em>: The flex property determines how the container
 *   distributes remaining empty space among its children. If items are made
 *   flexible, they can grow or shrink accordingly. Their relative flex values
 *   determine how the items are being resized, i.e. the larger the flex ratio
 *   of two items, the larger the resizing of the first item compared to the
 *   second.
 * </li>
 * </ul>
 *
 * *Example*
 *
 * Here is a little example of how to use the HBox layout.
 *
 * <pre class="javascript">
 * var layout = new qx.ui.mobile.layout.HBox().set({alignX:"center"});
 *
 * var container = new qx.ui.mobile.container.Composite(layout);
 *
 * container.add(new qx.ui.mobile.basic.Label("1"));
 * container.add(new qx.ui.mobile.basic.Label("2"), {flex:1});
 * container.add(new qx.ui.mobile.basic.Label("3"));
 * </pre>
 */
qx.Class.define("qx.ui.mobile.layout.HBox",
{
  extend : qx.ui.mobile.layout.AbstractBox,


 /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // overridden
    _getCssClasses : function(){
      return ["hbox"];
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Gabriel Munteanu (gabios)
     * Christopher Zuendorf (czuendorf)

************************************************************************ */

/**
 * A multi-purpose widget, which combines a label with an icon.
 *
 * The intended purpose of qx.ui.mobile.basic.Atom is to easily align the common icon-text
 * combination in different ways.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var atom = new qx.ui.mobile.basic.Atom("Icon Right", "icon/32/actions/go-next.png");
 *   this.getRoot().add(atom);
 * </pre>
 *
 * This example creates an atom with the label "Icon Right" and an icon.
 */
qx.Class.define("qx.ui.mobile.basic.Atom",
{
  extend : qx.ui.mobile.core.Widget,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param label {String} Label to use
   * @param icon {String?null} Icon to use
   */
  construct : function(label, icon)
  {
    this.base(arguments);
    this.__createChildren(label, icon);
    this.__updateGap(this.getIconPosition(),4);
  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      refine : true,
      init : "atom"
    },

    /** The label/caption/text of the qx.ui.mobile.basic.Atom instance */
    label :
    {
      apply : "_applyLabel",
      nullable : true,
      check : "String",
      event : "changeLabel"
    },

    /** Any URI String supported by qx.ui.mobile.basic.Image to display an icon */
    icon :
    {
      check : "String",
      apply : "_applyIcon",
      nullable : true,
      event : "changeIcon"
    },


    /**
     * The space between the icon and the label
     */
    gap :
    {
      check : "Integer",
      nullable : false,
      apply : "_applyGap",
      init : 4
    },


    /**
     * Configure the visibility of the sub elements/widgets.
     * Possible values: both, text, icon
     */
    show :
    {
      init : "both",
      check : [ "both", "label", "icon" ],
      inheritable : true,
      apply : "_applyShow"
    },


    /**
     * The position of the icon in relation to the text.
     * Only useful/needed if text and icon is configured and 'show' is configured as 'both' (default)
     */
    iconPosition :
    {
      init   : "left",
      check : [ "top", "right", "bottom", "left" ],
      apply : "_applyIconPosition"
    }
  },

  members :
  {
    __label : null,
    __icon : null,
    __childrenContainer : null,


        // property apply
    _applyIconPosition : function(value, old) {
        var targetLayout;
        var verticalLayout = ["top", "bottom"].indexOf(value) != -1;

        if(verticalLayout) {
           targetLayout = new qx.ui.mobile.layout.VBox();
        } else {
           targetLayout = new qx.ui.mobile.layout.HBox();
        }

        var isReverse = ["right", "bottom"].indexOf(value) != -1;
        targetLayout.setReversed(isReverse);

        this.__childrenContainer.setLayout(targetLayout);

        this.__updateGap(old, null);
        this.__updateGap(value,this.getGap());

        this._domUpdated();
    },


    // property apply
    _applyShow : function(value, old)
    {
        if(this.__label) {
            if(value === 'both' || value === 'label') {
                this.__label.show();
            } else if(value === 'icon') {
                this.__label.exclude();
            }
        }
        if(this.__icon) {
            if(value === 'both' || value === 'icon') {
                this.__icon.show();
            } else if(value === 'label') {
                this.__icon.exclude();
            }
        }
    },

    // property apply
    _applyGap : function(value, old)
    {
      this.__updateGap(this.getIconPosition(),value);
    },


    /**
     * Updates the gap between icon and label text.
     * @param iconPosition {String} position of the icon: "left", "bottom", "right", "top".
     * @param value {Integer} size of the gap.
     */
    __updateGap : function (iconPosition, value) {

      if(this.__icon)
      {
        // Then set new margin gap.
        var newMarginPosition = this.__getOpposedPosition(iconPosition);
        var newPropKey = 'margin'+qx.lang.String.firstUp(newMarginPosition);

        if(value) {
          this.__icon._setStyle(newPropKey, value + 'px');
        } else {
          this.__icon._setStyle(newPropKey, null);
        }

      }
    },

    /**
     * Returns the opposed position for a given position.
     * @param position {String} "left", "right", "bottom", "right" position.
     * @return {String} opposed position.
     */
    __getOpposedPosition : function(position)
    {
      var opposedPosition = 'left';
      switch(position)
      {
        case 'top':
          opposedPosition = 'bottom';
          break;
        case 'bottom':
          opposedPosition = 'top';
          break;
        case 'left':
          opposedPosition = 'right';
          break;
      }
      return opposedPosition;
    },


    // property apply
    _applyLabel : function(value, old)
    {
      if(this.__label)
      {
        this.__label.setValue(value);
      }
      else
      {
        this.__label = this._createLabelWidget(value);
      }
    },


    // property apply
    _applyIcon : function(value, old)
    {
      if(this.__icon)
      {
        this.__icon.setSource(value);
      }
      else
      {
        this.__icon = this._createIconWidget(value);
      }
    },


    /**
     * Returns the icon widget.
     *
     * @return {qx.ui.mobile.basic.Image} The icon widget.
     */
    getIconWidget: function() {
      return this.__icon;
    },


    /**
     * Returns the label widget.
     *
     * @return {qx.ui.mobile.basic.Label} The label widget.
     */
    getLabelWidget : function() {
      return this.__label;
    },


    /**
     * Creates the icon widget.
     *
     * @param iconUrl {String} The icon url.
     * @return {qx.ui.mobile.basic.Image} The created icon widget.
     */
    _createIconWidget : function(iconUrl)
    {
      var iconWidget = new qx.ui.mobile.basic.Image(iconUrl);
      iconWidget.setAnonymous(true);

      return iconWidget;
    },


    /**
     * Creates the label widget.
     *
     * @param label {String} The text that should be displayed.
     * @return {qx.ui.mobile.basic.Label} The created label widget.
     */
    _createLabelWidget : function(label)
    {
      var labelWidget = new qx.ui.mobile.basic.Label(label);
      labelWidget.setAnonymous(true);
      labelWidget.setWrap(false);

      return labelWidget;
    },


    /**
     * This function is responsible for creating and adding 2 children controls to the Button widget.
     * A label and an icon.
     * @param label {String} the text of the button
     * @param icon {String} A path to an image resource
     *
     */
    __createChildren : function(label, icon) {

      this.__label = this._createLabelWidget(label);
      if(label)
      {
        this.setLabel(label);
      }

      this.__icon = this._createIconWidget(icon);
      if(icon)
      {
        this.setIcon(icon);
      } else {
        this.__icon.exclude();
      }

      var layout;
      var verticalLayout = [ "top", "bottom" ].indexOf(this.getIconPosition()) != -1;
      // If Atom has no Label, only Icon is shown, and should vertically centered.
      var hasNoLabel = !this.__label;

      if(verticalLayout || hasNoLabel){
        layout = new qx.ui.mobile.layout.VBox();
      } else {
        layout = new qx.ui.mobile.layout.HBox();
      }

      this.__childrenContainer = new qx.ui.mobile.container.Composite(layout);
      this.__childrenContainer.addCssClass("box-centered");
      this.__childrenContainer.setAnonymous(true);

      if(this.__icon) {
        this.__childrenContainer.add(this.__icon, {flex : 0});
      }

      if(this.__label) {
        this.__label.addCssClass("box-centered");
        this.__childrenContainer.add(this.__label, {flex : 0});
      }

      // Show/Hide Label/Icon
      if(this.getShow() === 'icon' && this.__label) {
        this.__label.exclude();
      }
      if(this.getShow() === 'label' && this.__icon) {
        this.__icon.exclude();
      }

      this._add(this.__childrenContainer);
    }
  },


  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
      this._disposeObjects("__label", "__icon", "__childrenContainer");
  }

});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * The image widget displays an image file.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var image = new qx.ui.mobile.basic.Image("path/to/icon.png");
 *
 *   this.getRoot().add(image);
 * </pre>
 *
 * This example create a widget to display the image
 * <code>path/to/icon.png</code>.
 *
 */
qx.Class.define("qx.ui.mobile.basic.Image",
{
  extend : qx.ui.mobile.core.Widget,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param source {String?null} The URL of the image to display.
   */
  construct : function(source)
  {
    this.base(arguments);
    if (source) {
      this.setSource(source);
    } else {
      this.initSource();
    }
  },




  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /**
     * Fired if the image source can not be loaded.
     */
    loadingFailed : "qx.event.type.Event",


    /**
     * Fired if the image has been loaded.
     */
    loaded : "qx.event.type.Event"
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * The URL of the image to display.
     */
    source :
    {
      check : "String",
      nullable : true,
      init : null,
      apply : "_applySource"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // overridden
    _getTagName : function() {
      return "img";
    },


    // property apply
    _applySource : function(value, old)
    {
      var source = value;
      if (source && source.indexOf('data:')!=0)
      {
        source = qx.util.ResourceManager.getInstance().toUri(source);
        var ImageLoader = qx.io.ImageLoader;
        if(!ImageLoader.isFailed(source) && !ImageLoader.isLoaded(source)) {
          ImageLoader.load(source, this.__loaderCallback, this);
        }
      }
      this._setSource(source);
    },


    /**
     * Event handler fired after the preloader has finished loading the icon
     *
     * @param source {String} Image source which was loaded
     * @param imageInfo {Map} Dimensions of the loaded image
     */
    __loaderCallback : function(source, imageInfo)
    {
      // Ignore the callback on already disposed images
      if (this.$$disposed === true) {
        return;
      }

      // Output a warning if the image could not loaded and quit
      if (imageInfo.failed)
      {
        this.warn("Image could not be loaded: " + source);
        this.fireEvent("loadingFailed");
      }
      else if (imageInfo.aborted)
      {
        // ignore the rest because it is aborted
        return;
      }
      else
      {
        this.fireEvent("loaded");
      }
      this._domUpdated();
    },


    /**
     * Sets the source attribute of the image tag.
     *
     * @param source {String} Image source which was loaded
     */
    _setSource : function(source)
    {
      this._setAttribute("src", source);
    },


    /**
     * Sets the attribute draggable to the given value "isDraggable".
     * @param isDraggable {Boolean} target value.
     */
    setDraggable : function(isDraggable) {
      if(isDraggable){
        this._setAttribute("draggable", "true");
      } else {
        this._setAttribute("draggable", "false");
      }
    }
  }
});/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Author:
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * Provides read/write access to library-specific information such as
 * source/resource URIs.
 */
qx.Class.define("qx.util.LibraryManager", {

  extend : qx.core.Object,

  type : "singleton",

  statics :
  {
    /** {Map} The libraries used by this application */
    __libs : qx.$$libraries || {}
  },

  members :
  {
    /**
     * Checks whether the library with the given namespace is known to the
     * application.
     * @param namespace {String} The library's namespace
     * @return {Boolean} <code>true</code> if the given library is known
     */
    has : function(namespace)
    {
      return !!this.self(arguments).__libs[namespace];
    },


    /**
     * Returns the value of an attribute of the given library
     * @param namespace {String} The library's namespace
     * @param key {String} Name of the attribute
     * @return {var|null} The attribute's value or <code>null</code> if it's not defined
     */
    get : function(namespace, key)
    {
      return this.self(arguments).__libs[namespace][key] ?
        this.self(arguments).__libs[namespace][key] : null;
    },


    /**
     * Sets an attribute on the given library.
     *
     * @param namespace {String} The library's namespace
     * @param key {String} Name of the attribute
     * @param value {var} Value of the attribute
     */
    set : function(namespace, key, value)
    {
      this.self(arguments).__libs[namespace][key] = value;
    }
  }
});/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Carsten Lergenmueller (carstenl)
     * Fabian Jakobs (fbjakobs)
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Determines browser-dependent information about the transport layer.
 *
 * This class is used by {@link qx.core.Environment} and should not be used
 * directly. Please check its class comment for details how to use it.
 *
 * @internal
 */
qx.Bootstrap.define("qx.bom.client.Transport",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Returns the maximum number of parallel requests the current browser
     * supports per host addressed.
     *
     * Note that this assumes one connection can support one request at a time
     * only. Technically, this is not correct when pipelining is enabled (which
     * it currently is only for IE 8 and Opera). In this case, the number
     * returned will be too low, as one connection supports multiple pipelined
     * requests. This is accepted for now because pipelining cannot be
     * detected from JavaScript and because modern browsers have enough
     * parallel connections already - it's unlikely an app will require more
     * than 4 parallel XMLHttpRequests to one server at a time.
     *
     * @internal
     * @return {Integer} Maximum number of parallel requests
     */
    getMaxConcurrentRequestCount: function()
    {
      var maxConcurrentRequestCount;

      // Parse version numbers.
      var versionParts = qx.bom.client.Engine.getVersion().split(".");
      var versionMain = 0;
      var versionMajor = 0;
      var versionMinor = 0;

      // Main number
      if (versionParts[0]) {
        versionMain = versionParts[0];
      }

      // Major number
      if (versionParts[1]) {
        versionMajor = versionParts[1];
      }

      // Minor number
      if (versionParts[2]) {
        versionMinor = versionParts[2];
      }

      // IE 8 gives the max number of connections in a property
      // see http://msdn.microsoft.com/en-us/library/cc197013(VS.85).aspx
      if (window.maxConnectionsPerServer){
        maxConcurrentRequestCount = window.maxConnectionsPerServer;

      } else if (qx.bom.client.Engine.getName() == "opera") {
        // Opera: 8 total
        // see http://operawiki.info/HttpProtocol
        maxConcurrentRequestCount = 8;

      } else if (qx.bom.client.Engine.getName() == "webkit") {
        // Safari: 4
        // http://www.stevesouders.com/blog/2008/03/20/roundup-on-parallel-connections/

        // Bug #6917: Distinguish Chrome from Safari, Chrome has 6 connections
        //       according to
        //      http://stackoverflow.com/questions/561046/how-many-concurrent-ajax-xmlhttprequest-requests-are-allowed-in-popular-browser

        maxConcurrentRequestCount = 4;

      } else if (qx.bom.client.Engine.getName() == "gecko"
                 && ( (versionMain >1)
                      || ((versionMain == 1) && (versionMajor > 9))
                      || ((versionMain == 1) && (versionMajor == 9) && (versionMinor >= 1)))){
          // FF 3.5 (== Gecko 1.9.1): 6 Connections.
          // see  http://gemal.dk/blog/2008/03/18/firefox_3_beta_5_will_have_improved_connection_parallelism/
          maxConcurrentRequestCount = 6;

      } else {
        // Default is 2, as demanded by RFC 2616
        // see http://blogs.msdn.com/ie/archive/2005/04/11/407189.aspx
        maxConcurrentRequestCount = 2;
      }

      return maxConcurrentRequestCount;
    },


    /**
     * Checks whether the app is loaded with SSL enabled which means via https.
     *
     * @internal
     * @return {Boolean} <code>true</code>, if the app runs on https
     */
    getSsl : function() {
      return window.location.protocol === "https:";
    },

    /**
     * Checks what kind of XMLHttpRequest object the browser supports
     * for the current protocol, if any.
     *
     * The standard XMLHttpRequest is preferred over ActiveX XMLHTTP.
     *
     * @internal
     * @return {String}
     *  <code>"xhr"</code>, if the browser provides standard XMLHttpRequest.<br/>
     *  <code>"activex"</code>, if the browser provides ActiveX XMLHTTP.<br/>
     *  <code>""</code>, if there is not XHR support at all.
     */
    getXmlHttpRequest : function() {
      // Standard XHR can be disabled in IE's security settings,
      // therefore provide ActiveX as fallback. Additionaly,
      // standard XHR in IE7 is broken for file protocol.
      var supports = window.ActiveXObject ?
        (function() {
          if ( window.location.protocol !== "file:" ) {
            try {
              new window.XMLHttpRequest();
              return "xhr";
            } catch(noXhr) {}
          }

          try {
            new window.ActiveXObject("Microsoft.XMLHTTP");
            return "activex";
          } catch(noActiveX) {}
        })()
        :
        (function() {
          try {
            new window.XMLHttpRequest();
            return "xhr";
          } catch(noXhr) {}
        })();

      return supports || "";
    }
  },

  defer : function(statics) {
    qx.core.Environment.add("io.maxrequests", statics.getMaxConcurrentRequestCount);
    qx.core.Environment.add("io.ssl", statics.getSsl);
    qx.core.Environment.add("io.xhr", statics.getXmlHttpRequest);
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Contains information about images (size, format, clipping, ...) and
 * other resources like CSS files, local data, ...
 */
qx.Class.define("qx.util.ResourceManager",
{
  extend  : qx.core.Object,
  type    : "singleton",

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);
  },

  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Map} the shared image registry */
    __registry : qx.$$resources || {},

    /** {Map} prefix per library used in HTTPS mode for IE */
    __urlPrefix : {}
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {

    /**
     * Whether the registry has information about the given resource.
     *
     * @param id {String} The resource to get the information for
     * @return {Boolean} <code>true</code> when the resource is known.
     */
    has : function(id) {
      return !!this.self(arguments).__registry[id];
    },


    /**
     * Get information about an resource.
     *
     * @param id {String} The resource to get the information for
     * @return {Array} Registered data or <code>null</code>
     */
    getData : function(id) {
      return this.self(arguments).__registry[id] || null;
    },


    /**
     * Returns the width of the given resource ID,
     * when it is not a known image <code>0</code> is
     * returned.
     *
     * @param id {String} Resource identifier
     * @return {Integer} The image width, maybe <code>null</code> when the width is unknown
     */
    getImageWidth : function(id)
    {
      var entry = this.self(arguments).__registry[id];
      return entry ? entry[0] : null;
    },


    /**
     * Returns the height of the given resource ID,
     * when it is not a known image <code>0</code> is
     * returned.
     *
     * @param id {String} Resource identifier
     * @return {Integer} The image height, maybe <code>null</code> when the height is unknown
     */
    getImageHeight : function(id)
    {
      var entry = this.self(arguments).__registry[id];
      return entry ? entry[1] : null;
    },


    /**
     * Returns the format of the given resource ID,
     * when it is not a known image <code>null</code>
     * is returned.
     *
     * @param id {String} Resource identifier
     * @return {String} File format of the image
     */
    getImageFormat : function(id)
    {
      var entry = this.self(arguments).__registry[id];
      return entry ? entry[2] : null;
    },

    /**
     * Returns the format of the combined image (png, gif, ...), if the given
     * resource identifier is an image contained in one, or the empty string
     * otherwise.
     *
     * @param id {String} Resource identifier
     * @return {String} The type of the combined image containing id
     */
    getCombinedFormat : function(id)
    {
      var clippedtype = "";
      var entry = this.self(arguments).__registry[id];
      var isclipped = entry && entry.length > 4 && typeof(entry[4]) == "string"
        && this.constructor.__registry[entry[4]];
      if (isclipped){
        var combId  = entry[4];
        var combImg = this.constructor.__registry[combId];
        clippedtype = combImg[2];
      }
      return clippedtype;
    },


    /**
     * Converts the given resource ID to a full qualified URI
     *
     * @param id {String} Resource ID
     * @return {String} Resulting URI
     */
    toUri : function(id)
    {
      if (id == null) {
        return id;
      }

      var entry = this.self(arguments).__registry[id];
      if (!entry) {
        return id;
      }

      if (typeof entry === "string") {
        var lib = entry;
      }
      else
      {
        var lib = entry[3];

        // no lib reference
        // may mean that the image has been registered dynamically
        if (!lib) {
          return id;
        }
      }

      var urlPrefix = "";
      if ((qx.core.Environment.get("engine.name") == "mshtml") &&
          qx.core.Environment.get("io.ssl")) {
        urlPrefix = this.self(arguments).__urlPrefix[lib];
      }

      return urlPrefix + qx.util.LibraryManager.getInstance().get(lib, "resourceUri") + "/" + id;
    },

    /**
     * Construct a data: URI for an image resource.
     *
     * Constructs a data: URI for a given resource id, if this resource is
     * contained in a base64 combined image. If this is not the case (e.g.
     * because the combined image has not been loaded yet), returns the direct
     * URI to the image file itself.
     *
     * @param resid {String} resource id of the image
     * @return {String} "data:" or "http:" URI
     */
    toDataUri : function (resid)
    {
      var resentry = this.constructor.__registry[resid];
      var combined = this.constructor.__registry[resentry[4]];
      var uri;
      if (combined) {
        var resstruct = combined[4][resid];
        uri = "data:image/" + resstruct["type"] + ";" + resstruct["encoding"] +
              "," + resstruct["data"];
      }
      else {
        uri = this.toUri(resid);
      }
      return uri;
    }
  },


  defer : function(statics)
  {
    if ((qx.core.Environment.get("engine.name") == "mshtml"))
    {
      // To avoid a "mixed content" warning in IE when the application is
      // delivered via HTTPS a prefix has to be added. This will transform the
      // relative URL to an absolute one in IE.
      // Though this warning is only displayed in conjunction with images which
      // are referenced as a CSS "background-image", every resource path is
      // changed when the application is served with HTTPS.
      if (qx.core.Environment.get("io.ssl"))
      {
        for (var lib in qx.$$libraries)
        {
          var resourceUri;
          if (qx.util.LibraryManager.getInstance().get(lib, "resourceUri")) {
            resourceUri = qx.util.LibraryManager.getInstance().get(lib, "resourceUri");
          }
          else
          {
            // default for libraries without a resourceUri set
            statics.__urlPrefix[lib] = "";
            continue;
          }

          // It is valid to to begin a URL with "//" so this case has to
          // be considered. If the to resolved URL begins with "//" the
          // manager prefixes it with "https:" to avoid any problems for IE
          if (resourceUri.match(/^\/\//) != null) {
            statics.__urlPrefix[lib] = window.location.protocol;
          }
          // If the resourceUri begins with a single slash, include the current
          // hostname
          else if (resourceUri.match(/^\//) != null) {
            statics.__urlPrefix[lib] = window.location.protocol + "//" + window.location.host;
          }
          // If the resolved URL begins with "./" the final URL has to be
          // put together using the document.URL property.
          // IMPORTANT: this is only applicable for the source version
          else if (resourceUri.match(/^\.\//) != null)
          {
            var url = document.URL;
            statics.__urlPrefix[lib] = url.substring(0, url.lastIndexOf("/") + 1);
          } else if (resourceUri.match(/^http/) != null) {
            // Let absolute URLs pass through
            statics.__urlPrefix[lib] = "";
          }
          else
          {
            // check for parameters with URLs as value
            var index = window.location.href.indexOf("?");
            var href;
            if (index == -1) {
              href = window.location.href;
            } else {
              href = window.location.href.substring(0, index);
            }

            statics.__urlPrefix[lib] = href.substring(0, href.lastIndexOf("/") + 1);
          }
        }
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)

************************************************************************ */

/**
 * The ImageLoader can preload and manage loaded image resources. It easily
 * handles multiple requests and supports callbacks for successful and failed
 * requests.
 *
 * After loading of an image the dimension of the image is stored as long
 * as the application is running. This is quite useful for in-memory layouting.
 *
 * Use {@link #load} to preload your own images.
 */
qx.Bootstrap.define("qx.io.ImageLoader",
{
  statics :
  {
    /** {Map} Internal data structure to cache image sizes */
    __data : {},


    /** {Map} Default image size */
    __defaultSize :
    {
      width : null,
      height : null
    },

    /** {RegExp} Known image types */
    __knownImageTypesRegExp : /\.(png|gif|jpg|jpeg|bmp)\b/i,

    /** {RegExp} Image types of a data URL */
    __dataUrlRegExp : /^data:image\/(png|gif|jpg|jpeg|bmp)\b/i,

    /**
     * Whether the given image has previously been loaded using the
     * {@link #load} method.
     *
     * @param source {String} Image source to query
     * @return {Boolean} <code>true</code> when the image is loaded
     */
    isLoaded : function(source)
    {
      var entry = this.__data[source];
      return !!(entry && entry.loaded);
    },


    /**
     * Whether the given image has previously been requested using the
     * {@link #load} method but failed.
     *
     * @param source {String} Image source to query
     * @return {Boolean} <code>true</code> when the image loading failed
     */
    isFailed : function(source)
    {
      var entry = this.__data[source];
      return !!(entry && entry.failed);
    },


    /**
     * Whether the given image is currently loading.
     *
     * @param source {String} Image source to query
     * @return {Boolean} <code>true</code> when the image is loading in the moment.
     */
    isLoading : function(source)
    {
      var entry = this.__data[source];
      return !!(entry && entry.loading);
    },


    /**
     * Returns the format of a previously loaded image
     *
     * @param source {String} Image source to query
     * @return {String ? null} The format of the image or <code>null</code>
     */
    getFormat : function(source)
    {
      var entry = this.__data[source];

      if (! entry || ! entry.format)
      {
        var result = this.__dataUrlRegExp.exec(source);
        if (result != null)
        {
          // If width and height aren't defined, provide some defaults
          var width =
            (entry && qx.lang.Type.isNumber(entry.width)
             ? entry.width
             : this.__defaultSize.width);

          var height =
            (entry && qx.lang.Type.isNumber(entry.height)
             ? entry.height
             : this.__defaultSize.height);

          entry =
            {
              loaded : true,
              format : result[1],
              width  : width,
              height : height
            };
        }
      }
      return entry ? entry.format : null;
    },


    /**
     * Returns the size of a previously loaded image
     *
     * @param source {String} Image source to query
     * @return {Map} The dimension of the image (<code>width</code> and
     *    <code>height</code> as key). If the image is not yet loaded, the
     *    dimensions are given as <code>null</code> for width and height.
     */
    getSize : function(source) {
      var entry = this.__data[source];
      return entry ? { width: entry.width, height: entry.height } : this.__defaultSize;
    },


    /**
     * Returns the image width
     *
     * @param source {String} Image source to query
     * @return {Integer} The width or <code>null</code> when the image is not loaded
     */
    getWidth : function(source)
    {
      var entry = this.__data[source];
      return entry ? entry.width : null;
    },


    /**
     * Returns the image height
     *
     * @param source {String} Image source to query
     * @return {Integer} The height or <code>null</code> when the image is not loaded
     */
    getHeight : function(source)
    {
      var entry = this.__data[source];
      return entry ? entry.height : null;
    },


    /**
     * Loads the given image. Supports a callback which is
     * executed when the image is loaded.
     *
     * This method works asychronous.
     *
     * @param source {String} Image source to load
     * @param callback {Function} Callback function to execute
     *   The first parameter of the callback is the given source url, the
     *   second parameter is the data entry which contains additional
     *   information about the image.
     * @param context {Object} Context in which the given callback should be executed
     */
    load : function(source, callback, context)
    {
      // Shorthand
      var entry = this.__data[source];

      if (!entry) {
        entry = this.__data[source] = {};
      }

      // Normalize context
      if (callback && !context) {
        context = window;
      }

      // Already known image source
      if (entry.loaded || entry.loading || entry.failed)
      {
        if (callback)
        {
          if (entry.loading) {
            entry.callbacks.push(callback, context);
          } else {
            callback.call(context, source, entry);
          }
        }
      }
      else
      {
        // Updating entry
        entry.loading = true;
        entry.callbacks = [];

        if (callback) {
          entry.callbacks.push(callback, context);
        }

        // Create image element
        var el = new Image();

        // Create common callback routine
        var boundCallback = qx.lang.Function.listener(this.__onload, this, el, source);

        // Assign callback to element
        el.onload = boundCallback;
        el.onerror = boundCallback;

        // Start loading of image
        el.src = source;

        // save the element for aborting
        entry.element = el;
      }
    },


    /**
     * Abort the loading for the given url.
     *
     * @param source {String} URL of the image to abort its loading.
     */
    abort : function (source)
    {
      var entry = this.__data[source];

      if (entry && !entry.loaded)
      {
        entry.aborted = true;

        var callbacks = entry.callbacks;
        var element = entry.element;

        // Cleanup listeners
        element.onload = element.onerror = null;

        // Cleanup entry
        delete entry.callbacks;
        delete entry.element;
        delete entry.loading;

        for (var i=0, l=callbacks.length; i<l; i+=2) {
          callbacks[i].call(callbacks[i+1], source, entry);
        }
      }

      this.__data[source] = null;
    },


    /**
     * Internal event listener for all load/error events.
     *
     * @signature function(event, element, source)
     *
     * @param event {Event} Native event object
     * @param element {Element} DOM element which represents the image
     * @param source {String} The image source loaded
     */
    __onload : qx.event.GlobalError.observeMethod(function(event, element, source)
    {
      // Shorthand
      var entry = this.__data[source];

      // Store dimensions
      if (event.type === "load")
      {
        entry.loaded = true;
        entry.width = this.__getWidth(element);
        entry.height = this.__getHeight(element);

        // try to determine the image format
        var result = this.__knownImageTypesRegExp.exec(source);
        if (result != null)
        {
          entry.format = result[1];
        }
      }
      else
      {
        entry.failed = true;
      }

      // Cleanup listeners
      element.onload = element.onerror = null;

      // Cache callbacks
      var callbacks = entry.callbacks;

      // Cleanup entry
      delete entry.loading;
      delete entry.callbacks;
      delete entry.element;

      // Execute callbacks
      for (var i=0, l=callbacks.length; i<l; i+=2) {
        callbacks[i].call(callbacks[i+1], source, entry);
      }
    }),


    /**
     * Returns the natural width of the given image element.
     *
     * @param element {Element} DOM element which represents the image
     * @return {Integer} Image width
     */
    __getWidth : function(element)
    {
      return qx.core.Environment.get("html.image.naturaldimensions") ?
        element.naturalWidth : element.width;
    },


    /**
     * Returns the natural height of the given image element.
     *
     * @param element {Element} DOM element which represents the image
     * @return {Integer} Image height
     */
    __getHeight : function(element)
    {
      return qx.core.Environment.get("html.image.naturaldimensions") ?
        element.naturalHeight : element.height;
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * A Button widget.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   var button = new qx.ui.mobile.form.Button("Hello World");
 *
 *   button.addListener("tap", function(e) {
 *     alert("Button was clicked");
 *   }, this);
 *
 *   this.getRoot.add(button);
 * </pre>
 *
 * This example creates a button with the label "Hello World" and attaches an
 * event listener to the {@link qx.ui.mobile.core.Widget#tap} event.
 */
qx.Class.define("qx.ui.mobile.form.Button",
{
  extend : qx.ui.mobile.basic.Atom,

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      refine : true,
      init : "button"
    },

    // overridden
    activatable :
    {
      refine :true,
      init : true
    }
  },

  members :
  {
    /**
     * Sets the value.
     *
     * @param value {String} The value to set
     */
    setValue : function(value) {
      this.setLabel(value);
    },


    /**
     * Returns the set value.
     *
     * @return {String} The set value
     */
    getValue : function() {
      return this.getLabel();
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * A navigation bar button widget.
 */
qx.Class.define("qx.ui.mobile.navigationbar.Button",
{
  extend : qx.ui.mobile.form.Button,


 /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      refine : true,
      init : "navigationbar-button"
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * A navigation bar back button widget.
 */
qx.Class.define("qx.ui.mobile.navigationbar.BackButton",
{
  extend : qx.ui.mobile.navigationbar.Button,


 /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      refine : true,
      init : "navigationbar-backbutton"
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */


/* ************************************************************************

#asset(qx/mobile/js/iscroll*.js)
#ignore(iScroll)

************************************************************************ */

/**
 * Mixin for the {@link Scroll} container. Used when the variant
 * <code>qx.mobile.nativescroll</code> is set to "off". Uses the iScroll script to simulate
 * the CSS position:fixed style. Position fixed is not available in iOS and
 * Android < 2.2.
 */
qx.Mixin.define("qx.ui.mobile.container.MIScroll",
{

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param useTransform {Boolean} Whether iScroll should use transforms or not. Set this to false
   *    when input fields are used inside the scroll container.
   */
  construct : function(useTransform)
  {
    this.__useTransform = useTransform !== false ?  true : false;
    this.__initScroll();
    this.__registerEventListeners();
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __scroll : null,
    __useTransform : null,

    /**
     * Mixin method. Creates the scroll element.
     *
     * @return {Element} The scroll element
     */
    _createScrollElement : function()
    {
      var scroll = qx.dom.Element.create("div");
      qx.bom.element.Class.add(scroll,"iscroll");
      return scroll;
    },


    /**
     * Mixin method. Returns the scroll content element..
     *
     * @return {Element} The scroll content element
     */
    _getScrollContentElement : function()
    {
      return this.getContainerElement().childNodes[0];
    },


   /**
    * Scrolls the wrapper contents to the x/y coordinates in a given period.
    *
    * @param x {Integer} X coordinate to scroll to.
    * @param y {Integer} Y coordinate to scroll to.
    * @param time {Integer} Time slice in which scrolling should
    *              be done.
    */
    _scrollTo : function(x, y, time)
    {
      if (this.__scroll) {
        this.__scroll.scrollTo(x, y, time);
      }
    },


    /**
    * Scrolls the wrapper contents to the widgets coordinates in a given
    * period.
    *
    * @param elementId {String} the elementId, the scroll container should scroll to.
    * @param time {Integer} Time slice in which scrolling should be done (in seconds).
    *
    */
    _scrollToElement : function(elementId, time)
    {
      if (this.__scroll) {
        this.__scroll.scrollToElement(elementId, time);
      }
    },


    /**
     * Loads and inits the iScroll instance.
     *
     * @lint ignoreUndefined(iScroll)
     */
    __initScroll : function()
    {
      if (!window.iScroll)
      {
        if (qx.core.Environment.get("qx.debug"))
        {
          var resource = "qx/mobile/js/iscroll.js";
        } else {
          var resource = "qx/mobile/js/iscroll.min.js";
        }
        var path = qx.util.ResourceManager.getInstance().toUri(resource);
        if (qx.core.Environment.get("qx.debug"))
        {
          path += "?" + new Date().getTime();
        }
        var loader = new qx.bom.request.Script();
        loader.on("load", this.__onScrollLoaded, this);
        loader.open("GET", path);
        loader.send();
      } else {
        this._setScroll(this.__createScrollInstance());
      }
    },


    /**
     * Creates the iScroll instance.
     *
     * @return {Object} The iScroll instance
     * @lint ignoreUndefined(iScroll)
     */
    __createScrollInstance : function()
    {
      var scroll = new iScroll(this.getContainerElement(), {
        hideScrollbar:true,
        fadeScrollbar:true,
        hScrollbar : false,
        scrollbarClass:"scrollbar",
        useTransform: this.__useTransform,
        onBeforeScrollStart : function(e) {
          // QOOXDOO ENHANCEMENT: Do not prevent default for form elements
          /* When updating iScroll, please check out that doubleTapTimer is not active (commented out)
           * in code. DoubleTapTimer creates a fake click event. Android 4.1. and newer
           * is able to fire native events, which  create side effect with the fake event of iScroll. */
          var target = e.target;
          while (target.nodeType != 1) {
            target = target.parentNode;
          }

          if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.tagName != 'LABEL') {
            // Remove focus from input elements, so that the keyboard and the mouse cursor is hidden
            var elements = [];
            var inputElements = qx.lang.Array.cast(document.getElementsByTagName("input"), Array);
            var textAreaElements = qx.lang.Array.cast(document.getElementsByTagName("textarea"), Array);
            elements = elements.concat(inputElements);
            elements = elements.concat(textAreaElements);

            for (var i=0, length = elements.length; i < length; i++) {
              elements[i].blur();
            }

            e.preventDefault();
          }

          // we also want to alert interested parties that we are starting scrolling
          if (qx.core.Environment.get("qx.mobile.nativescroll") == false)
          {
            var iScrollStartEvent = new qx.event.message.Message('iscrollstart');
            qx.event.message.Bus.getInstance().dispatch(iScrollStartEvent);
          }
        }
      });
      return scroll;
    },


    /**
     * Registers all needed event listener.
     */
    __registerEventListeners : function()
    {
      qx.event.Registration.addListener(window, "orientationchange", this._refresh, this);
      qx.event.Registration.addListener(window, "resize", this._refresh, this);
      this.addListener("domupdated", this._refresh, this);
    },


    /**
     * Unregisters all needed event listener.
     */
    __unregisterEventListeners : function()
    {
      qx.event.Registration.removeListener(window, "orientationchange", this._refresh, this);
      qx.event.Registration.removeListener(window, "resize", this._refresh, this);
      this.removeListener("domupdated", this._refresh, this);
    },


    /**
     * Load callback. Called when the iScroll script is loaded.
     *
     * @param request {qx.bom.request.Script} The Script request object
     */
    __onScrollLoaded : function(request)
    {
      if (request.status < 400)
      {
        this._setScroll(this.__createScrollInstance());
      } else {
        if (qx.core.Environment.get("qx.debug"))
        {
          this.error("Could not load iScroll");
        }
      }
    },


    /**
     * Setter for the scroll instance.
     *
     * @param scroll {Object} iScroll instance.
     */
    _setScroll : function(scroll)
    {
      this.__scroll = scroll;
    },


    /**
     * Delegation method for iScroll. Disabled the iScroll objects.
     * Prevents any further scrolling of this container.
     */
    disable : function() {
      if(this.__scroll) {
        this.__scroll.disable();
      }
    },


    /**
     * Delegation method for iScroll. Enables the iScroll object.
     */
    enable : function() {
      if(this.__scroll) {
        this.__scroll.enable();
      }
    },


    /**
     * Calls the refresh function of iScroll. Needed to recalculate the
     * scrolling container.
     */
    _refresh : function()
    {
      if (this.__scroll) {
        this.__scroll.refresh();
      }
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this.__unregisterEventListeners();

    // Cleanup iScroll
    if (this.__scroll) {
      this.__scroll.destroy();
    }
    this.__scroll;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tristan Koch (tristankoch)

************************************************************************ */

/**
 * Script loader with interface similar to
 * <a href="http://www.w3.org/TR/XMLHttpRequest/">XmlHttpRequest</a>.
 *
 * The script loader can be used to load scripts from arbitrary sources.
 * <span class="desktop">
 * For JSONP requests, consider the {@link qx.bom.request.Jsonp} transport
 * that derives from the script loader.
 * </span>
 *
 * <div class="desktop">
 * Example:
 *
 * <pre class="javascript">
 *  var req = new qx.bom.request.Script();
 *  req.onload = function() {
 *    // Script is loaded and parsed and
 *    // globals set are available
 *  }
 *
 *  req.open("GET", url);
 *  req.send();
 * </pre>
 * </div>
 */

/* ************************************************************************
#ignore(qx.core.Environment)
#require(qx.bom.request.Script#_success)
#require(qx.bom.request.Script#abort)
#require(qx.bom.request.Script#dispose)
#require(qx.bom.request.Script#getAllResponseHeaders)
#require(qx.bom.request.Script#getResponseHeader)
#require(qx.bom.request.Script#setDetermineSuccess)
#require(qx.bom.request.Script#setRequestHeader)
************************************************************************ */

qx.Bootstrap.define("qx.bom.request.Script",
{

  construct : function()
  {
    this.__initXhrProperties();

    this.__onNativeLoadBound = qx.Bootstrap.bind(this._onNativeLoad, this);
    this.__onNativeErrorBound = qx.Bootstrap.bind(this._onNativeError, this);
    this.__onTimeoutBound = qx.Bootstrap.bind(this._onTimeout, this);

    this.__headElement = document.head || document.getElementsByTagName( "head" )[0] ||
                         document.documentElement;

    this._emitter = new qx.event.Emitter();

    // BUGFIX: Browsers not supporting error handler
    // Set default timeout to capture network errors
    //
    // Note: The script is parsed and executed, before a "load" is fired.
    this.timeout = this.__supportsErrorHandler() ? 0 : 15000;
  },


  events : {
    /** Fired at ready state changes. */
    "readystatechange" : "qx.bom.request.Script",

    /** Fired on error. */
    "error" : "qx.bom.request.Script",

    /** Fired at loadend. */
    "loadend" : "qx.bom.request.Script",

    /** Fired on timeouts. */
    "timeout" : "qx.bom.request.Script",

    /** Fired when the request is aborted. */
    "abort" : "qx.bom.request.Script",

    /** Fired on successful retrieval. */
    "load" : "qx.bom.request.Script"
  },


  members :
  {

    /**
     * {Number} Ready state.
     *
     * States can be:
     * UNSENT:           0,
     * OPENED:           1,
     * LOADING:          2,
     * LOADING:          3,
     * DONE:             4
     *
     * Contrary to {@link qx.bom.request.Xhr#readyState}, the script transport
     * does not receive response headers. For compatibility, another LOADING
     * state is implemented that replaces the HEADERS_RECEIVED state.
     */
    readyState: null,

    /**
     * {Number} The status code.
     *
     * Note: The script transport cannot determine the HTTP status code.
     */
    status: null,

    /**
     * {String} The status text.
     *
     * The script transport does not receive response headers. For compatibility,
     * the statusText property is set to the status casted to string.
     */
    statusText: null,

    /**
     * {Number} Timeout limit in milliseconds.
     *
     * 0 (default) means no timeout.
     */
    timeout: null,

    /**
     * {Function} Function that is executed once the script was loaded.
     */
    __determineSuccess: null,


    /**
     * Add an event listener for the given event name.
     *
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function to execute when the event is fired
     * @param ctx {var?} The context of the listener.
     * @return {qx.bom.request.Script} Self for chaining.
     */
    on: function(name, listener, ctx) {
      this._emitter.on(name, listener, ctx);
      return this;
    },


    /**
     * Initializes (prepares) request.
     *
     * @param method {String}
     *   The HTTP method to use.
     *   This parameter exists for compatibility reasons. The script transport
     *   does not support methods other than GET.
     * @param url {String}
     *   The URL to which to send the request.
     */
    open: function(method, url) {
      if (this.__disposed) {
        return;
      }

      // Reset XHR properties that may have been set by previous request
      this.__initXhrProperties();

      this.__abort = null;
      this.__url = url;

      if (this.__environmentGet("qx.debug.io")) {
        qx.Bootstrap.debug(qx.bom.request.Script, "Open native request with " +
          "url: " + url);
      }

      this._readyStateChange(1);
    },

    /**
     * Appends a query parameter to URL.
     *
     * This method exists for compatibility reasons. The script transport
     * does not support request headers. However, many services parse query
     * parameters like request headers.
     *
     * Note: The request must be initialized before using this method.
     *
     * @param key {String}
     *  The name of the header whose value is to be set.
     * @param value {String}
     *  The value to set as the body of the header.
     * @return {qx.bom.request.Script} Self for chaining.
     */
    setRequestHeader: function(key, value) {
      if (this.__disposed) {
        return null;
      }

      var param = {};

      if (this.readyState !== 1) {
        throw new Error("Invalid state");
      }

      param[key] = value;
      this.__url = qx.util.Uri.appendParamsToUrl(this.__url, param);
      return this;
    },

    /**
     * Sends request.
     * @return {qx.bom.request.Script} Self for chaining.
     */
    send: function() {
      if (this.__disposed) {
        return null;
      }

      var script = this.__createScriptElement(),
          head = this.__headElement,
          that = this;

      if (this.timeout > 0) {
        this.__timeoutId = window.setTimeout(this.__onTimeoutBound, this.timeout);
      }

      if (this.__environmentGet("qx.debug.io")) {
        qx.Bootstrap.debug(qx.bom.request.Script, "Send native request");
      }

      // Attach script to DOM
      head.insertBefore(script, head.firstChild);

      // The resource is loaded once the script is in DOM.
      // Assume HEADERS_RECEIVED and LOADING and dispatch async.
      window.setTimeout(function() {
        that._readyStateChange(2);
        that._readyStateChange(3);
      });
      return this;
    },

    /**
     * Aborts request.
     * @return {qx.bom.request.Script} Self for chaining.
     */
    abort: function() {
      if (this.__disposed) {
        return null;
      }

      this.__abort = true;
      this.__disposeScriptElement();
      this._emit("abort");
      return this;
    },


    /**
     * Helper to emit events and call the callback methods.
     * @param event {String} The name of the event.
     */
    _emit: function(event) {
      this["on" + event]();
      this._emitter.emit(event, this);
    },


    /**
     * Event handler for an event that fires at every state change.
     *
     * Replace with custom method to get informed about the communication progress.
     */
    onreadystatechange: function() {},

    /**
     * Event handler for XHR event "load" that is fired on successful retrieval.
     *
     * Note: This handler is called even when an invalid script is returned.
     *
     * Warning: Internet Explorer < 9 receives a false "load" for invalid URLs.
     * This "load" is fired about 2 seconds after sending the request. To
     * distinguish from a real "load", consider defining a custom check
     * function using {@link #setDetermineSuccess} and query the status
     * property. However, the script loaded needs to have a known impact on
     * the global namespace. If this does not work for you, you may be able
     * to set a timeout lower than 2 seconds, depending on script size,
     * complexity and execution time.
     *
     * Replace with custom method to listen to the "load" event.
     */
    onload: function() {},

    /**
     * Event handler for XHR event "loadend" that is fired on retrieval.
     *
     * Note: This handler is called even when a network error (or similar)
     * occurred.
     *
     * Replace with custom method to listen to the "loadend" event.
     */
    onloadend: function() {},

    /**
     * Event handler for XHR event "error" that is fired on a network error.
     *
     * Note: Some browsers do not support the "error" event.
     *
     * Replace with custom method to listen to the "error" event.
     */
    onerror: function() {},

    /**
    * Event handler for XHR event "abort" that is fired when request
    * is aborted.
    *
    * Replace with custom method to listen to the "abort" event.
    */
    onabort: function() {},

    /**
    * Event handler for XHR event "timeout" that is fired when timeout
    * interval has passed.
    *
    * Replace with custom method to listen to the "timeout" event.
    */
    ontimeout: function() {},

    /**
     * Get a single response header from response.
     *
     * Note: This method exists for compatibility reasons. The script
     * transport does not receive response headers.
     *
     * @param key {String}
     *  Key of the header to get the value from.
     * @return {String|null} Warning message or <code>null</code> if the request
     * is disposed
     */
    getResponseHeader: function(key) {
      if (this.__disposed) {
        return null;
      }

      if (this.__environmentGet("qx.debug")) {
        qx.Bootstrap.debug("Response header cannot be determined for " +
          "requests made with script transport.");
      }
      return "unknown";
    },

    /**
     * Get all response headers from response.
     *
     * Note: This method exists for compatibility reasons. The script
     * transport does not receive response headers.
     * @return {String|null} Warning message or <code>null</code> if the request
     * is disposed
     */
    getAllResponseHeaders: function() {
      if (this.__disposed) {
        return null;
      }

      if (this.__environmentGet("qx.debug")) {
        qx.Bootstrap.debug("Response headers cannot be determined for" +
          "requests made with script transport.");
      }

      return "Unknown response headers";
    },

    /**
     * Determine if loaded script has expected impact on global namespace.
     *
     * The function is called once the script was loaded and must return a
     * boolean indicating if the response is to be considered successful.
     *
     * @param check {Function} Function executed once the script was loaded.
     *
     */
    setDetermineSuccess: function(check) {
      this.__determineSuccess = check;
    },

    /**
     * Dispose object.
     */
    dispose: function() {
      var script = this.__scriptElement;

      if (!this.__disposed) {

        // Prevent memory leaks
        if (script) {
          script.onload = script.onreadystatechange = null;
          this.__disposeScriptElement();
        }

        if (this.__timeoutId) {
          window.clearTimeout(this.__timeoutId);
        }

        this.__disposed = true;
      }
    },

    /*
    ---------------------------------------------------------------------------
      PROTECTED
    ---------------------------------------------------------------------------
    */

    /**
     * Get URL of request.
     *
     * @return {String} URL of request.
     */
    _getUrl: function() {
      return this.__url;
    },

    /**
     * Get script element used for request.
     *
     * @return {Element} Script element.
     */
    _getScriptElement: function() {
      return this.__scriptElement;
    },

    /**
     * Handle timeout.
     */
    _onTimeout: function() {
      this.__failure();

      if (!this.__supportsErrorHandler()) {
        this._emit("error");
      }

      this._emit("timeout");

      if (!this.__supportsErrorHandler()) {
        this._emit("loadend");
      }
    },

    /**
     * Handle native load.
     */
    _onNativeLoad: function() {
      var script = this.__scriptElement,
          determineSuccess = this.__determineSuccess,
          that = this;

      // Aborted request must not fire load
      if (this.__abort) {
        return;
      }

      // BUGFIX: IE < 9
      // When handling "readystatechange" event, skip if readyState
      // does not signal loaded script
      if (this.__environmentGet("engine.name") === "mshtml" &&
          this.__environmentGet("browser.documentmode") < 9) {
        if (!(/loaded|complete/).test(script.readyState)) {
          return;
        } else {
          if (this.__environmentGet("qx.debug.io")) {
            qx.Bootstrap.debug(qx.bom.request.Script, "Received native readyState: loaded");
          }
        }
      }

      if (this.__environmentGet("qx.debug.io")) {
        qx.Bootstrap.debug(qx.bom.request.Script, "Received native load");
      }

      // Determine status by calling user-provided check function
      if (determineSuccess) {

        // Status set before has higher precedence
        if (!this.status) {
          this.status = determineSuccess() ? 200 : 500;
        }

      }

      if (this.status === 500) {
        if (this.__environmentGet("qx.debug.io")) {
          qx.Bootstrap.debug(qx.bom.request.Script, "Detected error");
        }
      }

      if (this.__timeoutId) {
        window.clearTimeout(this.__timeoutId);
      }

      window.setTimeout(function() {
        that._success();
        that._readyStateChange(4);
        that._emit("load");
        that._emit("loadend");
      });
    },

    /**
     * Handle native error.
     */
    _onNativeError: function() {
      this.__failure();
      this._emit("error");
      this._emit("loadend");
    },

    /*
    ---------------------------------------------------------------------------
      PRIVATE
    ---------------------------------------------------------------------------
    */

    /**
     * {Element} Script element
     */
    __scriptElement: null,

    /**
     * {Element} Head element
     */
    __headElement: null,

    /**
     * {String} URL
     */
    __url: "",

    /**
     * {Function} Bound _onNativeLoad handler.
     */
    __onNativeLoadBound: null,

    /**
     * {Function} Bound _onNativeError handler.
     */
    __onNativeErrorBound: null,

    /**
     * {Function} Bound _onTimeout handler.
     */
    __onTimeoutBound: null,

    /**
     * {Number} Timeout timer iD.
     */
    __timeoutId: null,

    /**
     * {Boolean} Whether request was aborted.
     */
    __abort: null,

    /**
     * {Boolean} Whether request was disposed.
     */
    __disposed: null,

    /*
    ---------------------------------------------------------------------------
      HELPER
    ---------------------------------------------------------------------------
    */

    /**
     * Initialize properties.
     */
    __initXhrProperties: function() {
      this.readyState = 0;
      this.status = 0;
      this.statusText = "";
    },

    /**
     * Change readyState.
     *
     * @param readyState {Number} The desired readyState
     */
    _readyStateChange: function(readyState) {
      this.readyState = readyState;
      this._emit("readystatechange");
    },

    /**
     * Handle success.
     */
    _success: function() {
      this.__disposeScriptElement();
      this.readyState = 4;

      // By default, load is considered successful
      if (!this.status) {
        this.status = 200;
      }

      this.statusText = "" + this.status;
    },

    /**
     * Handle failure.
     */
    __failure: function() {
      this.__disposeScriptElement();
      this.readyState = 4;
      this.status = 0;
      this.statusText = null;
    },

    /**
     * Looks up whether browser supports error handler.
     *
     * @return {Boolean} Whether browser supports error handler.
     */
    __supportsErrorHandler: function() {
      var isLegacyIe = this.__environmentGet("engine.name") === "mshtml" &&
        this.__environmentGet("browser.documentmode") < 9;

      var isOpera = this.__environmentGet("engine.name") === "opera";

      return !(isLegacyIe || isOpera);
    },

    /**
     * Create and configure script element.
     *
     * @return {Element} Configured script element.
     */
    __createScriptElement: function() {
      var script = this.__scriptElement = document.createElement("script");

      script.src = this.__url;
      script.onerror = this.__onNativeErrorBound;
      script.onload = this.__onNativeLoadBound;

      // BUGFIX: IE < 9
      // Legacy IEs do not fire the "load" event for script elements.
      // Instead, they support the "readystatechange" event
      if (this.__environmentGet("engine.name") === "mshtml" &&
          this.__environmentGet("browser.documentmode") < 9) {
        script.onreadystatechange = this.__onNativeLoadBound;
      }

      return script;
    },

    /**
     * Remove script element from DOM.
     */
    __disposeScriptElement: function() {
      var script = this.__scriptElement;

      if (script && script.parentNode) {
        this.__headElement.removeChild(script);
      }
    },

    /**
     * Proxy Environment.get to guard against env not being present yet.
     *
     * @param key {String} Environment key.
     * @return {var} Value of the queried environment key
     * @lint environmentNonLiteralKey(key)
     */
    __environmentGet: function(key) {
      if (qx && qx.core && qx.core.Environment) {
        return qx.core.Environment.get(key);
      } else {
        if (key === "engine.name") {
          return qx.bom.client.Engine.getName();
        }

        if (key === "browser.documentmode") {
          return qx.bom.client.Browser.getDocumentMode();
        }

        if (key == "qx.debug.io") {
          return false;
        }

        throw new Error("Unknown environment key at this phase");
      }
    }
  },

  defer: function() {
    if (qx && qx.core && qx.core.Environment) {
      qx.core.Environment.add("qx.debug.io", false);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/**
 * EXPERIMENTAL - NOT READY FOR PRODUCTION
 *
 * Basic implementation for an event emitter. This supplies a basic and
 * minimalistic event mechanism.
 */
qx.Bootstrap.define("qx.event.Emitter",
{
  extend : Object,
  statics : {
    /** Static storage for all event listener */
    __storage : []
  },

  members :
  {
    __listener : null,
    __any : null,


    /**
     * Attach a listener to the event emitter. The given <code>name</code>
     * will define the type of event. Handing in a <code>'*'</code> will
     * listen to all events emitted by the event emitter.
     *
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function execute on {@link #emit}.
     * @param ctx {var?Window} The context of the listener.
     * @return {Integer} An unique <code>id</code> for the attached listener.
     */
    on : function(name, listener, ctx) {
      var id = qx.event.Emitter.__storage.length;
      this.__getStorage(name).push({listener: listener, ctx: ctx, id: id});
      qx.event.Emitter.__storage.push({name: name, listener: listener, ctx: ctx});
      return id;
    },


    /**
     * Attach a listener to the event emitter which will be executed only once.
     * The given <code>name</code> will define the type of event. Handing in a
     * <code>'*'</code> will listen to all events emitted by the event emitter.
     *
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function execute on {@link #emit}.
     * @param ctx {var?Window} The context of the listener.
     * @return {Integer} An unique <code>id</code> for the attached listener.
     */
    once : function(name, listener, ctx) {
      var id = qx.event.Emitter.__storage.length;
      this.__getStorage(name).push({listener: listener, ctx: ctx, once: true, id: id});
      qx.event.Emitter.__storage.push({name: name, listener: listener, ctx: ctx});
      return id;
    },


    /**
     * Remove a listener from the event emitter. The given <code>name</code>
     * will define the type of event.
     *
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function execute on {@link #emit}.
     * @param ctx {var?Window} The context of the listener.
     * @return {Integer|null} The listener's id if it was removed or
     * <code>null</code> if it wasn't found
     */
    off : function(name, listener, ctx) {
      var storage = this.__getStorage(name);
      for (var i = storage.length - 1; i >= 0; i--) {
        var entry = storage[i];
        if (entry.listener == listener && entry.ctx == ctx) {
          storage.splice(i, 1);
          qx.event.Emitter.__storage[entry.id] = null;
          return entry.id;
        }
      };
      return null;
    },


    /**
     * Removes the listener identified by the given <code>id</code>. The id
     * will be return on attaching the listener and can be stored for removing.
     *
     * @param id {Integer} The id of the listener.
     */
    offById : function(id) {
      var entry = qx.event.Emitter.__storage[id];
      this.off(entry.name, entry.listener, entry.ctx);
    },




    /**
     * Alternative for {@link #on}.
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function execute on {@link #emit}.
     * @param ctx {var?Window} The context of the listener.
     * @return {Integer} An unique <code>id</code> for the attached listener.
     */
    addListener : function(name, listener, ctx) {
      return this.on(name, listener, ctx);
    },


    /**
     * Alternative for {@link #once}.
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function execute on {@link #emit}.
     * @param ctx {var?Window} The context of the listener.
     * @return {Integer} An unique <code>id</code> for the attached listener.
     */
    addListenerOnce : function(name, listener, ctx) {
      return this.once(name, listener, ctx);
    },


    /**
     * Alternative for {@link #off}.
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function execute on {@link #emit}.
     * @param ctx {var?Window} The context of the listener.
     */
    removeListener : function(name, listener, ctx) {
      this.off(name, listener, ctx);
    },


    /**
     * Alternative for {@link #offById}.
     * @param id {Integer} The id of the listener.
     */
    removeListenerById : function(id) {
     this.offById(id);
    },




    /**
     * Emits an event with the given name. The data will be passed
     * to the listener.
     * @param name {String} The name of the event to emit.
     * @param data {var?undefined} The data which should be passed to the listener.
     */
    emit : function(name, data) {
      var storage = this.__getStorage(name);
      for (var i = 0; i < storage.length; i++) {
        var entry = storage[i];
        entry.listener.call(entry.ctx, data);
        if (entry.once) {
          storage.splice(i, 1);
          i--;
        }
      };
      // call on any
      storage = this.__getStorage("*");
      for (var i = storage.length - 1; i >= 0; i--) {
        var entry = storage[i];
        entry.listener.call(entry.ctx, data);
      };
    },



    /**
     * Returns the internal attached listener.
     * @internal
     * @return {Map} A map which has the event name as key. The values are
     *   arrays containing a map with 'listener' and 'ctx'.
     */
    getListeners : function() {
      return this.__listener;
    },


    /**
     * Internal helper which will return the storage for the given name.
     * @param name {String} The name of the event.
     * @return {Array} An array which is the storage for the listener and
     *   the given event name.
     */
    __getStorage : function(name) {
      if (this.__listener == null) {
        this.__listener = {};
      }
      if (this.__listener[name] == null) {
        this.__listener[name] = [];
      }
      return this.__listener[name];
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Christian Boulanger

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Boulanger

************************************************************************ */

/**
 * A message to be dispatched on the message bus.
 */
qx.Class.define("qx.event.message.Message",
{
  extend : qx.core.Object,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param name {String} The name of the message
   * @param data {var} Any type of data to attach
   */
  construct : function(name, data)
  {
    this.base(arguments);

    if (name != null) {
      this.setName(name);
    }

    if (data != null) {
      this.setData(data);
    }
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * Event name of the message. Based on this name the message is dispatched
     * to the event listeners.
     */
    name :
    {
      check       : "String"
    },

    /**
     * Any data the sender wants to pass with the event.
     */
    data :
    {
      init        : null,
      nullable    : true
    },

    /**
     * A reference to the sending object.
     */
    sender :
    {
      check       : "Object"
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Christian Boulanger

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Boulanger

************************************************************************ */

/**
 * A simple message bus singleton.
 * The message bus registers subscriptions and notifies subscribers when
 * a matching message is dispatched
 */
qx.Class.define("qx.event.message.Bus",
{
  type : "singleton",

  extend : qx.core.Object,

  statics :
  {

    /**
     * gets the hash map of message subscriptions
     *
     * @return {Map} with registered subscriptions. The key is the
     *    <code>message</code> and the value is a map with <code>{subscriber: {Function},
     *    context: {Object|null}}</code>.
     */
    getSubscriptions : function() {
      return this.getInstance().getSubscriptions();
    },


    /**
     * subscribes to a message
     *
     * @param message {String} name of message, can be truncated by *
     * @param subscriber {Function} subscribing callback function
     * @param context {Object} The execution context of the callback (i.e. "this")
     * @return {Boolean} Success
     */
    subscribe : function(message, subscriber, context)
    {
      return this.getInstance().subscribe(message, subscriber, context);

    },

    /**
     * checks if subscription is already present
     * if you supply the callback function, match only the exact message monitor
     * otherwise match all monitors that have the given message
     *
     * @param message {String} Name of message, can be truncated by *
     * @param subscriber {Function} Callback Function
     * @param context {Object} execution context
     * @return {Boolean} Whether monitor is present or not
     */
    checkSubscription : function(message, subscriber, context)
    {
      return this.getInstance().checkSubscription(message, subscriber, context);
    },

    /**
     * unsubscribe a listening method
     * if you supply the callback function and execution context,
     * remove only this exact subscription
     * otherwise remove all subscriptions
     *
     * @param message {String} Name of message, can be truncated by *
     * @param subscriber {Function} Callback Function
     * @param context {Object} execution context
     * @return {Boolean} Whether monitor was removed or not
     */
    unsubscribe : function(message, subscriber, context)
    {
      return this.getInstance().unsubscribe(message, subscriber, context)
    },

    /**
     * dispatch message and call subscribed functions
     *
     * @param msg {qx.event.message.Message} message which is being dispatched
     * @return {Boolean} <code>true</code> if the message was dispatched,
     *    <code>false</code> otherwise.
     */
    dispatch : function(msg)
    {
      return this.getInstance().dispatch.apply(this.getInstance(), arguments);
    },

    /**
     * Dispatches a new message by supplying the name of the
     * message and its data.
     *
     * @param name {String} name of the message
     * @param data {var} Any type of data to attach
     *
     * @return {Boolean} <code>true</code> if the message was dispatched,
     *    <code>false</code> otherwise.
     */
    dispatchByName : function(name, data)
    {
      return this.getInstance().dispatchByName.apply(this.getInstance(), arguments);
    }
  },

  /**
   * constructor
   */
  construct : function()
  {
    /*
     * message subscriptions database
     */
    this.__subscriptions = {};
  },

  members :
  {
    __subscriptions : null,


    /**
     * gets the hash map of message subscriptions
     *
     * @return {Map} with registered subscriptions. The key is the
     *    <code>message</code> and the value is a map with <code>{subscriber: {Function},
     *    context: {Object|null}}</code>.
     */
    getSubscriptions : function() {
      return this.__subscriptions;
    },


    /**
     * subscribes to a message
     *
     * @param message {String} name of message, can be truncated by *
     * @param subscriber {Function} subscribing callback function
     * @param context {Object} The execution context of the callback (i.e. "this")
     * @return {Boolean} Success
     */
    subscribe : function(message, subscriber, context)
    {
      if (!message || typeof subscriber != "function")
      {
        this.error("Invalid parameters! "+ [message, subscriber, context]);

        return false;
      }

      var sub = this.getSubscriptions();

      if (this.checkSubscription(message))
      {
        if (this.checkSubscription(message, subscriber, context))
        {
          this.warn("Object method already subscribed to " + message);
          return false;
        }

        // add a subscription
        sub[message].push(
        {
          subscriber : subscriber,
          context    : context || null
        });

        return true;
      }
      else
      {
        // create a subscription
        sub[message] = [ {
          subscriber : subscriber,
          context    : context || null
        } ];

        return true;
      }
    },


    /**
     * checks if subscription is already present
     * if you supply the callback function, match only the exact message monitor
     * otherwise match all monitors that have the given message
     *
     * @param message {String} Name of message, can be truncated by *
     * @param subscriber {Function} Callback Function
     * @param context {Object} execution context
     * @return {Boolean} Whether monitor is present or not
     */
    checkSubscription : function(message, subscriber, context)
    {
      var sub = this.getSubscriptions();

      if (!sub[message] || sub[message].length === 0) {
        return false;
      }

      if (subscriber)
      {
        for (var i=0; i<sub[message].length; i++)
        {
          if (sub[message][i].subscriber === subscriber && sub[message][i].context === (context || null)) {
            return true;
          }
        }

        return false;
      }

      return true;
    },


    /**
     * unsubscribe a listening method
     * if you supply the callback function and execution context,
     * remove only this exact subscription
     * otherwise remove all subscriptions
     *
     * @param message {String} Name of message, can be truncated by *
     * @param subscriber {Function} Callback Function
     * @param context {Object} execution context
     * @return {Boolean} Whether monitor was removed or not
     */
    unsubscribe : function(message, subscriber, context)
    {
       var sub = this.getSubscriptions();
       var subscrList = sub[message];
       if (subscrList) {
         if (!subscriber) {
           sub[message] = null;
           delete sub[message];
           return true;
         } else {
           if (! context) {
             context = null;
           }
           var i = subscrList.length;
           var subscription;
           do {
             subscription = subscrList[--i];
             if (subscription.subscriber === subscriber && subscription.context === context) {
               subscrList.splice(i, 1);
               if (subscrList.length === 0) {
                 sub[message] = null;
                 delete sub[message];
               }
               return true;
             }
           } while (i);
         }
       }
       return false;
    },

    /**
     * dispatch message and call subscribed functions
     *
     * @param msg {qx.event.message.Message} message which is being dispatched
     * @return {Boolean} <code>true</code> if the message was dispatched,
     *    <code>false</code> otherwise.
     */
    dispatch : function(msg)
    {
      var sub = this.getSubscriptions();
      var msgName = msg.getName();
      var dispatched = false;

      for (var key in sub)
      {
        var pos = key.indexOf("*");

        if (pos > -1)
        {
          // use of wildcard
          if (pos === 0 || key.substr(0, pos) === msgName.substr(0, pos))
          {
            this.__callSubscribers(sub[key], msg);
            dispatched = true;
          }
        }
        else
        {
          // exact match
          if (key === msgName)
          {
            this.__callSubscribers(sub[msgName], msg);
            dispatched = true;
          }
        }
      }

      return dispatched;
    },

    /**
     * Dispatches a new message by supplying the name of the
     * message and its data.
     *
     * @param name {String} name of the message
     * @param data {var} Any type of data to attach
     *
     * @return {Boolean} <code>true</code> if the message was dispatched,
     *    <code>false</code> otherwise.
     */
    dispatchByName : function(name, data)
    {
      var message = new qx.event.message.Message(name, data);
      return this.dispatch(message);
    },


    /**
     * Call subscribers with passed message.
     *
     * @param subscribers {Map} subscribers to call
     * @param msg {qx.event.message.Message} message for subscribers
     */
    __callSubscribers : function(subscribers, msg)
    {
      for (var i=0; i<subscribers.length; i++)
      {
        var subscriber = subscribers[i].subscriber;
        var context = subscribers[i].context;

        // call message monitor subscriber
        if (context && context.isDisposed)
        {
          if (context.isDisposed())
          {
            subscribers.splice(i, 1);
            i--;
          }
          else
          {
            subscriber.call(context, msg);
          }
        }
        else
        {
          subscriber.call(context, msg);
        }
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * Mixin for the {@link Scroll} container. Used when the variant
 * <code>qx.mobile.nativescroll</code> is set to "on".
 */
qx.Mixin.define("qx.ui.mobile.container.MNativeScroll",
{

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Mixin method. Creates the scroll element.
     *
     * @return {Element} The scroll element
     */
    _createScrollElement : function()
    {
      return null
    },


    /**
     * Mixin method. Returns the scroll content element.
     *
     * @return {Element} The scroll content element
     */
    _getScrollContentElement : function()
    {
      return null
    },


   /**
    * Scrolls the wrapper contents to the x/y coordinates in a given period.
    *
    * @param x {Integer} X coordinate to scroll to.
    * @param y {Integer} Y coordinate to scroll to.
    * @param time {Integer} Time slice in which scrolling should
    *              be done.
    */
    _scrollTo : function(x, y, time)
    {
      scrollTo(x,y);
    },


    /**
    * Scrolls the wrapper contents to the widgets coordinates in a given
    * period.
    *
    * @param elementId {String} the elementId, the scroll container should scroll to.
    * @param time {Integer} Time slice in which scrolling should
    *              be done (in seconds).
    */
    _scrollToElement : function(elementId, time)
    {
      // TODO
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * Container, which allows, depending on the set variant <code>qx.mobile.nativescroll</code>,
 * vertical and horizontal scrolling if the contents is larger than the container.
 *
 * Note that this class can only have one child widget. This container has a
 * fixed layout, which cannot be changed.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   // create the scroll widget
 *   var scroll = new qx.ui.mobile.container.Scroll()
 *
 *   // add a children
 *   scroll.add(new qx.ui.mobile.basic.Label("Name: "));
 *
 *   this.getRoot().add(scroll);
 * </pre>
 *
 * This example creates a scroll container and adds a label to it.
 */
qx.Class.define("qx.ui.mobile.container.Scroll",
{
  extend : qx.ui.mobile.container.Composite,


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    // overridden
    defaultCssClass :
    {
      refine : true,
      init : "scroll"
    }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // overridden
    _createContainerElement : function()
    {
      var element = this.base(arguments);
      var scrollElement = this._createScrollElement();
      if (scrollElement) {
        element.appendChild(scrollElement);
      }
      return element;
    },


    // overridden
    _getContentElement : function()
    {
      var contentElement = this.base(arguments);
      var scrollContentElement = this._getScrollContentElement();
      return scrollContentElement || contentElement;
    },


    /**
     * Calls the refresh function the used scrolling method. Needed to recalculate the
     * scrolling container.
     */
    refresh : function() {
      if (qx.core.Environment.get("qx.mobile.nativescroll") == false)
      {
        this._refresh();
      }
    },


    /**
     * Scrolls the wrapper contents to the x/y coordinates in a given period.
     *
     * @param x {Integer} X coordinate to scroll to.
     * @param y {Integer} Y coordinate to scroll to.
     * @param time {Integer} Time slice in which scrolling should
     *              be done.
     */
     scrollTo : function(x, y, time)
     {
       this._scrollTo(x, y, time);
     },


    /**
      * Scrolls the wrapper contents to the widgets coordinates in a given
      * period.
      *
      * @param elementId {String} the elementId, the scroll container should scroll to.
      * @param time {Integer} Time slice in which scrolling should
      *              be done (in seconds).
      *
      */
     scrollToElement : function(elementId, time)
     {
       this._scrollToElement(elementId, time);
     }
  },

  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics)
  {
    if (qx.core.Environment.get("qx.mobile.nativescroll") == false)
    {
      qx.Class.include(statics, qx.ui.mobile.container.MIScroll);
    } else {
      qx.Class.include(statics, qx.ui.mobile.container.MNativeScroll);
    }
  }
});
