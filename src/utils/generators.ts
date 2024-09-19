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