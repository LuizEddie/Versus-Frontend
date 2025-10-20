import { ValidationErrors } from "@angular/forms";

export function getValidationMessage(errors: ValidationErrors | null): string|null{
    if(!errors) return null;
    
    if(errors['required']) return 'Este campo é obrigatório.';
    if(errors['email']) return 'Digite um e-mail válido.';
    if(errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres (atual: ${errors['minlength'].actualLength}).`;
    if(errors['maxlength']) return `Máximo de ${errors['maxlength'].requiredLength} caracteres permitidos.`;
    if(errors['pattern']) return 'Formato inválido.';

    return "Valor inválido.";
}