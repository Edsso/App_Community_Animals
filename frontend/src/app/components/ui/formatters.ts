export const formatPhoneDisplay = (phone: string): string => {
    if (!phone) return '';

    const number = phone.replace(/\D/g, '');

    if (number.length === 11) {
        // Formato para celular: (XX) XXXXX-XXXX
        return number.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (number.length === 10) {
        // Formato para telefone fixo: (XX) XXXX-XXXX
        return number.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (number.length === 9) {
        // Formato para telefone sem DDD: XXXXX-XXXX
        return number.replace(/(\d{5})(\d{4})/, '$1-$2');
    } else if (number.length === 8) {
        // Formato para telefone fixo sem DDD: XXXX-XXXX
        return number.replace(/(\d{4})(\d{4})/, '$1-$2');
    }
    return phone;
};

export const formatPhoneInput = (value: string): string => {
    if (!value) return '';

    const number = value.replace(/\D/g, '');

    // Limita a 11 dígitos (DDD + número)
    const limited = number.slice(0, 11);

    // Formata conforme o número de dígitos
    if (limited.length <= 2) {
        return limited;
    } else if (limited.length <= 7) {
        // (11) 23456
        return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else {
        // (11) 23456-7890
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
    }
};

export const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/\D/g, '');
};