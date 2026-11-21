// The `validate` functions of /field/validation (spec/field.md).

export function validateUsername(value: unknown): string | null {
    const text = String(value ?? "");
    return text.length > 0 && text.length < 3 ? "At least 3 characters." : null;
}

export function validatePassword(value: unknown): string[] {
    const text = String(value ?? "");
    const errors: string[] = [];
    if (!/\d/.test(text)) {
        errors.push("Include a number.");
    }
    if (text.length < 8) {
        errors.push("At least 8 characters.");
    }
    return errors;
}

export function validateCode(value: unknown): string | null {
    return value === "AAA" ? "This code is taken." : null;
}
