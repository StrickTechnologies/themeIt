/*
   themeIt v1.0.0
   Easily manage light/dark themes with Pico CSS and Bootstrap 5.30+.

   Copyright (c) 2026 Strick Technologies, LLC.
   Licensed under the MIT License. See LICENSE file in the project root for details.
*/


var themeIt = new class
{
	#libName = "themeIt";
	#version = "1.0.0";
	#copyright = "Copyright (c) 2026 Strick Technologies, LLC. Licensed under the MIT License.";

	#themes = ['light', 'dark'];
	#alwaysSetTheme = false;
	#listenForOSChange = true;
	#reloadOnThemeChange = false;

	#switcherAttributeName = "data-theme-switcher";
	#localStorageKey = "preferredColorScheme";
	#themeAttrib = "data-theme";

	//#region Config Attributes

	/**
	 * The framework: 
	 *   'bs' for Bootstrap
	 *   'pico' for Pico CSS
	*/
	#caFw = "data-framework";

	//whether or not to reload the page when the theme is changed
	#caReloadOnChange = "data-reload-on-change";

	//whether or not to listen for browser or O/S theme changes and automatically switch the theme
	#caOsChange = "data-listen-os-change";

	//#endregion Config Attributes


	constructor()
	{
		this.#setFramework(document.currentScript.getAttribute(this.#caFw));
		this.#readOptions();

		let pref = this.#getThemePref();
		if (pref != null)
		{ this.#setTheme(pref); }
		else if (this.#alwaysSetTheme)
		{
			//No stored preference.
			//  If we always need to set the theme, check user's preference via media query
			this.#setTheme(this.#getBrowserTheme());
		}

		if (this.#listenForOSChange)
		{
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event =>
			{
				// console.log("On O/S change");
				if (!this.#hasThemePref())
				{
					const newColorScheme = event.matches ? this.#setTheme(this.#themes[1], false) : this.#setTheme(this.#themes[0], false);
					//console.log("On O/S change, setting to " + newColorScheme);
					this.#reload();
				}
				//else
				//{ console.log("On O/S change, NOT overriding saved preference"); }
			});
		}

		document.addEventListener("DOMContentLoaded", () =>
		{ this.#addSwitcherListeners(this.#getSwitchers(this.#switcherAttributeName)); });
	}

	about()
	{
		return `${this.#libName} v${this.#version} - ${this.#copyright}`;
	}


	#readOptions()
	{
		let opt = document.currentScript.getAttribute(this.#caReloadOnChange)
		if (opt)
		{
			this.#reloadOnThemeChange = opt.toLowerCase() === "true";
			//	(`set #reloadOnThemeChange to ${opt}`);
		}

		opt = document.currentScript.getAttribute(this.#caOsChange)
		if (opt)
		{
			this.#listenForOSChange = opt.toLowerCase() === "true";
			// console.log(`set #listenForOSChange to ${opt}`);
		}
	}


	switchTheme(theme)
	{
		if (theme === 'default')
		{
			this.#setDefaultTheme();
			return;
		}


		if (theme === 'toggle')
		{ theme = this.#toggleTheme(this.#getCurrentTheme()); }

		if (this.#isValidTheme(theme))
		{
			this.#setTheme(theme);
			this.#saveThemePref(theme);
		}
		//else
		//{ console.log("switchTheme: invalid theme: " + theme); }
	}


	//#region Switchers

	#getSwitchers(switcherAttributeName)
	{
		return document.querySelectorAll(`[${this.#switcherAttributeName}]`);
	}

	#addSwitcherListeners(themeSwitchers, event)
	{
		if (event == null)
		{ event = "click"; }

		themeSwitchers.forEach(el =>
		{
			el.addEventListener(event, (event) =>
			{
				// console.log("switch " + event.currentTarget)
				this.switchTheme(event.currentTarget.getAttribute(this.#switcherAttributeName));
			});
		});
	}

	//#endregion Switchers


	#toggleTheme(theme)
	{
		return (theme === this.#themes[0]) ? this.#themes[1] : this.#themes[0];
	}

	#getCurrentTheme()
	{
		let theme = this.#getThemeAttribute();
		// console.log(theme);

		if (theme != null)
		{
			return theme;
		}

		return this.#getBrowserTheme();
	}

	#getBrowserTheme()
	{
		// Check current theme via media query
		return (window.matchMedia("(prefers-color-scheme: dark)").matches) ? this.#themes[1] : this.#themes[0];
	}

	#setTheme(theme)
	{
		// console.log("themeIt.setTheme " + theme);
		if (!this.#isValidTheme(theme))
		{ return; }

		this.#setThemeAttribute(theme);
		this.#raiseChangeEvent(theme);
	}

	#setDefaultTheme()
	{
		//clear any existing theme preference
		this.#clearThemePref();

		if (this.#alwaysSetTheme)
		{ this.#setThemeAttribute(this.#getBrowserTheme()); }
		else
		{ this.#removeThemeAttribute(); }

		this.#raiseChangeEvent(this.#getCurrentTheme());
		this.#reload();
	}

	#isValidTheme(theme)
	{ return this.#themes.includes(theme); }

	#raiseChangeEvent(theme)
	{
		//console.log("raising theme-change event " + theme);
		document.documentElement.dispatchEvent(new CustomEvent('theme-change', {
			bubbles: true,
			detail: { theme: theme }
		}));
	}

	#reload()
	{
		if (this.#reloadOnThemeChange)
		{
			// console.log("reloading page");
			location.reload();
		}
		// else
		// { console.log("NOT reloading page"); }
	}


	//#region Document Theme Attribute

	#getThemeAttribute()
	{ return document.documentElement.getAttribute(this.#themeAttrib); }

	#setThemeAttribute(value)
	{ document.documentElement.setAttribute(this.#themeAttrib, value); }

	#removeThemeAttribute()
	{ document.documentElement.removeAttribute(this.#themeAttrib); }

	//#endregion Document Theme Attribute


	//#region Framework

	#setFramework(fw)
	{
		if (!fw)
		{ return; }

		fw = fw.toLowerCase();

		if (fw === "bs")
		{ this.#setBs(); }

		if (fw === "pico")
		{ this.#setPico(); }
	}

	#setPico()
	{
		this.#themeAttrib = "data-theme";
		this.#alwaysSetTheme = true;
		this.#listenForOSChange = true;
		this.#reloadOnThemeChange = false;
	}

	#setBs()
	{
		this.#themeAttrib = "data-bs-theme";
		this.#alwaysSetTheme = true;
		this.#listenForOSChange = true;
		this.#reloadOnThemeChange = false;
	}

	//#endregion Framework


	//#region Local Storage

	#getThemePref()
	{ return localStorage.getItem(this.#localStorageKey); }

	#hasThemePref()
	{ return this.#getThemePref() != null; }

	#saveThemePref(theme)
	{ localStorage.setItem(this.#localStorageKey, theme); }

	#clearThemePref()
	{ localStorage.removeItem(this.#localStorageKey); }

	//#endregion Local Storage
}
