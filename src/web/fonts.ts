// Inject @font-face rules so the browser maps the same family strings the RN
// tokens use (resolveFont() -> "HankenGrotesk-Bold" etc.). Vite returns a URL
// for each .ttf import.
import HankenRegular from '../../assets/fonts/HankenGrotesk-Regular.ttf';
import HankenMedium from '../../assets/fonts/HankenGrotesk-Medium.ttf';
import HankenSemiBold from '../../assets/fonts/HankenGrotesk-SemiBold.ttf';
import HankenBold from '../../assets/fonts/HankenGrotesk-Bold.ttf';
import HankenExtraBold from '../../assets/fonts/HankenGrotesk-ExtraBold.ttf';
import MonoRegular from '../../assets/fonts/JetBrainsMono-Regular.ttf';
import MonoMedium from '../../assets/fonts/JetBrainsMono-Medium.ttf';
import MonoBold from '../../assets/fonts/JetBrainsMono-Bold.ttf';
import MonoExtraBold from '../../assets/fonts/JetBrainsMono-ExtraBold.ttf';

const FACES: ReadonlyArray<[string, string]> = [
  ['HankenGrotesk-Regular', HankenRegular],
  ['HankenGrotesk-Medium', HankenMedium],
  ['HankenGrotesk-SemiBold', HankenSemiBold],
  ['HankenGrotesk-Bold', HankenBold],
  ['HankenGrotesk-ExtraBold', HankenExtraBold],
  ['JetBrainsMono-Regular', MonoRegular],
  ['JetBrainsMono-Medium', MonoMedium],
  ['JetBrainsMono-Bold', MonoBold],
  ['JetBrainsMono-ExtraBold', MonoExtraBold],
];

export function installFonts(): void {
  if (typeof document === 'undefined') return;
  const css = FACES.map(
    ([family, url]) =>
      `@font-face{font-family:'${family}';src:url(${url}) format('truetype');font-weight:normal;font-style:normal;font-display:swap;}`,
  ).join('\n');
  const style = document.createElement('style');
  style.setAttribute('data-tickmate-fonts', '');
  style.textContent = css;
  document.head.appendChild(style);
}
