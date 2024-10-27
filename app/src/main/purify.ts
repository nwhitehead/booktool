
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { cacheFunction } from './cache.ts';

export async function initPurify() {
    return await DOMPurify(new JSDOM('').window);
}

export const getPurify = cacheFunction(initPurify);

export async function sanitize(source) {
    const purify = await getPurify(initPurify);
    return purify.sanitize(source);
}
