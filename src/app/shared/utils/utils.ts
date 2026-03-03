export function onImageError(e: Event): void{
    const img = e.target as HTMLImageElement;
    img.src = "profile/default.png";
}