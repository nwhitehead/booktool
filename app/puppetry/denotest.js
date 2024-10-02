import { WebUI } from "https://deno.land/x/webui/mod.ts";

const myWindow = new WebUI();
myWindow.show('<html><script src="webui.js"></script> Hello World! </html>');
await WebUI.wait();
