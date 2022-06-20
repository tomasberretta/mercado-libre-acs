const assert = require("assert");

const wdio = require("webdriverio");

const opts = {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
        platformName: "Android",
        platformVersion: "12",
        deviceName: "Android Emulator",
        app: "/Users/german/Dev/Facultad/mercado-libre-acs/appium/mercadolibre-10-208-2.apk",
        appPackage: "com.mercadolibre",
        automationName: "UiAutomator2"
    }
};

async function main () {
    const client = await wdio.remote(opts);

    await delay(3000);

    const skipbtn = await client.$('id=com.mercadolibre:id/home_onboarding_action_skip_text_view');
    await skipbtn.click();
    await delay(1000);

    const searchTextView = await client.$('id=com.mercadolibre:id/ui_components_action_bar_title_toolbar');
    await searchTextView.click();
    await delay(500);

    const searchEtx = await client.$('id=com.mercadolibre:id/search_input_edittext');
    await searchEtx.setValue("Macbook Pro");
    const value = await searchEtx.getText();
    assert.strictEqual(value, "Macbook Pro");
    await delay(500);
    
    const searchResult = await client.$('id=com.mercadolibre:id/search_input_cell_label');
    await searchResult.click();
    await delay(2000);

    const filterBtn = await client.$('id=com.mercadolibre:id/search_spotlight_switch');
    await filterBtn.click();
    await delay(1000);

    const itemBtn = await client.$('id=com.mercadolibre:id/search_cell_title_text_view');
    await itemBtn.click();
    await delay(1000);

    const addToCartBtn = await client.$('//android.widget.Button[@content-desc="Agregar al carrito."]');
    await addToCartBtn.click();
    await delay(20000);
    await client.deleteSession();
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

main();

