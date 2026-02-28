import bcrypt from 'bcrypt'

export class PasswordEncrypt {
    // Hash Password
    public static async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }

    // Compare Password
    public static async compare(
        candidatePassword: string,
        hashedPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, hashedPassword)
    }
}
