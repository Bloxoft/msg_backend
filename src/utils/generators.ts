export function generateId() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRST';
    var length = 6;
    var id = '';
    for (var i = 0; i <= length; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        id += chars.substring(randomNumber, randomNumber + 1);
    }
    return id;
}

const generateRawOtpCode = (length: number = 4) => {
    let amount = Number(String(1).padEnd(length, '0'))
    return Math.floor(amount + Math.random() * 90000).toString();
}

export const generateSanitizedCode = (length: number = 4) => {
    let generatedCode = Number(generateRawOtpCode(length));

    let checkForCode = generatedCode.toString().length !== length;

    while (checkForCode) {
        generatedCode = Number(generateRawOtpCode(length));
        checkForCode = generatedCode.toString().length !== length;
    }

    return generatedCode;
};