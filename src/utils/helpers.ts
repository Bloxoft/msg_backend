import * as R from 'ramda';
import * as argon2 from "argon2";
import { PromisePool } from '@supercharge/promise-pool/dist';
import * as CryptoJS from 'crypto-js'
import * as currencyConverter from 'currency-exchanger-js'

import {
    PhoneNumberFormat as PNF,
    PhoneNumberUtil,
} from 'google-libphonenumber';
import { ENCRYPTION_KEY } from 'src/config/env.config';


const phoneUtil = PhoneNumberUtil.getInstance();

export function normalizePhoneNumber(phoneNumber: string, countryCode: string) {
    const number = phoneUtil.parseAndKeepRawInput(
        phoneNumber,
        countryCode || 'NG',
    );
    return phoneUtil.format(number, PNF.E164);
}

export function extractPhoneNumberInfo(phoneNumber: string) {
    if (phoneNumber) {
        const phoneNumberUtil = PhoneNumberUtil.getInstance();
        const parsedNumber = phoneNumberUtil.parse(phoneNumber, 'ZZ'); // 'ZZ' means unknown region

        const countryCode = phoneNumberUtil.getRegionCodeForNumber(parsedNumber);
        const nationalNumber = phoneNumberUtil.format(parsedNumber, PNF.NATIONAL);

        return {
            countryCode,
            nationalNumber,
        };
    }
    return {
        countryCode: '',
        nationalNumber: '',
    };
}

export class Hasher {
    async hash(text: string) {
        return await argon2.hash(text)
    }
    async verify(hash: string, textToVerify: string) {
        return await argon2.verify(hash, textToVerify)
    }
}

export class Encryptor {
    decrypt(cipher: string, key: string = ENCRYPTION_KEY) {
        const bytes = CryptoJS.AES.decrypt(cipher, key);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        return originalText;
    }
    encryptor(text: string, key: string = ENCRYPTION_KEY) {
        const ciphertext = CryptoJS.AES.encrypt(text, key);
        return ciphertext;
    }
}

export class CurrencyManager {
    format(currency: string = 'NGN', amount: number = 0) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount)
    }
    async convert(amount: number, from: string, to: string) {
        try {
            const convert = await currencyConverter.convert(amount, from, to);

            return {
                base: from.toUpperCase(),
                amount: amount,
                result: {
                    [to]: Number(convert),
                    rate: Number(convert) / amount,
                },
            };
        } catch (error) {
            return {
                base: from.toUpperCase(),
                amount: amount,
                result: {
                    [to]: Number(amount),
                    rate: 1,
                },
            };
        }
    }
}

export const getRandomItem = <T>(list: T[]) => {
    const randomIndex = Math.floor(Math.random() * R.length(list));
    return R.nth(randomIndex, list);
};

export function prettyPrintArray<T>(arr: T[]) {
    return arr.length > 1
        ? arr
            .map((a) => (typeof a === 'object' ? JSON.stringify(a) : a))
            .slice(0, arr.length - 1)
            .join(', ') +
        ' and ' +
        arr[arr.length - 1]
        : arr[0];
}
export function roundToNearestDecimal(value: number, decimals: number): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

export function roundToNearestHalf(value: number): number {
    return Math.round(value * 2) / 2;
}

export async function runConcurrently<T>(
    data: T[],
    concurrentCount: number,
    process: (each: T) => any,
) {
    return await new PromisePool(data)
        .withConcurrency(concurrentCount)
        .process(process);
}