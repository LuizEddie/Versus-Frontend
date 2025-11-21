export function handleErrorMessages(err: any): string{
    let errorsMessage: string = err?.error?.message || 'Ocorreu um erro inesperado';

    if (err?.error?.data) {
        const errorString = Object.entries(err?.error?.data)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
        errorsMessage = errorsMessage.concat("\n", errorString);
    }

    return errorsMessage;
}