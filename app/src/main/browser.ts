
import puppeteer from 'puppeteer';
import { cacheFunction } from './cache.ts';

export async function initBrowser() {
    await puppeteer.launch();
}

export async function initPage() {
    const browser = await getBrowser();
    return await browser.newPage();
}

export const getBrowser = cacheFunction(initBrowser);

export const getPage = cacheFunction(initPage);
