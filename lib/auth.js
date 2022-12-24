import bcrypt from 'bcrypt';

export async function hashPassword(password) {
    let saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export async function comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}