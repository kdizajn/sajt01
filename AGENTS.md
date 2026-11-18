# AGENTS.md

Uputstvo za rad u ovom repozitorijumu. Kratko i konkretno — dopunjuj samo onim što se ne vidi iz koda.

## Šta je ovo

Statički sajt od čistog HTML-a, CSS-a i vanilla JavaScript-a. **Nema build koraka**: nema `package.json`, nema zavisnosti, nema transpajliranja — fajlovi idu na hosting onakvi kakvi su. Hosting: Cloudflare — live na `https://sajt01.kdizajn-top.workers.dev`.

## Struktura

- `index.html` — jedina stranica, unosna tačka sajta.
- `style.css` — svi stilovi; tema definisana CSS varijablama u `:root`.
- `script.js` — vanilla JS, jedan IIFE, učitan sa `defer`.
- `favicon.svg` — ikonica; povezana u `<head>`, ne očekuj `favicon.ico`.
- Nova stranica = novi `*.html` u korenu koji preuzima isti `<head>` i relativne putanje.

## Okruženje (provereno)

- `node`, `npm`, `npx` i `wrangler` **nisu** na PATH-u. Ne predlaži `npm install`, `npx` ni `wrangler`.
- Git 2.56 je instaliran u `C:\Program Files\Git\cmd\git.exe`, ali PATH OpenCode procesa je nasleđen pre instalacije. Ako `git` nije prepoznat, koristi punu putanju ili `$env:Path += ';C:\Program Files\Git\cmd'` — ne zaključuj da git nije instaliran.
- Dostupan je Python 3.10 kao `python` — koristi se za lokalni server.
- Shell je Windows PowerShell (npr. `cmd /c dir`, ne `ls -la`).

## Lokalni pregled

```powershell
python -m http.server 8000
# zatim http://localhost:8000
```

Nema hot reload-a — posle izmene osveži stranicu ručno. Server služi koren repozitorijuma, pa sve putanje moraju biti relativne.

## Git

- `origin` → `https://github.com/kdizajn/sajt01.git`; `main` prati `origin/main`. Kredencijale čuva Git Credential Manager, pa push obično ne traži ponovnu prijavu.
- Push: `& 'C:\Program Files\Git\cmd\git.exe' -C 'C:\KRLE\GIT\sajt01' push`
- PowerShell prikaže git-ov stderr kao `NativeCommandError` i `exit code 1` **i kada je komanda uspela**. Pre nego što prijaviš grešku, proveri `git status -sb` ili `git ls-remote --heads origin`.
- `core.autocrlf=true`: blob-ovi u repozitorijumu su LF, a Git pri checkout-u vraća CRLF u radni direktorijum. To je očekivano — ne „popravljaj“ ga i ne dodaj `.gitattributes` bez potrebe. Nove fajlove piši sa LF.
- Poruke commit-a: kratko, na srpskom, u imperativu (npr. `dodaj favicon`).

## Deploy na Cloudflare

- Live URL: `https://sajt01.kdizajn-top.workers.dev` — projekat je Worker sa statičkim asset-ima, **ne** `*.pages.dev`. Ne pogađaj adresu, pročitaj je iz dashboarda.
- Repo je povezan sa Cloudflare-om: push na `main` pokreće automatski deploy.
- Postavke: Framework preset `None`, build command prazan, output directory `/`.
- Cloudflare build log pominje Wrangler — to je njihov interni alat; repo i dalje ne treba `wrangler.toml` ni `package.json`.
- Nema generisanih artefakata: ono što je u repozitorijumu je ono što se servira. Ne pravi `dist/`.

## Konvencije koje se ne vide iz koda

- Bez frameworka, bundlera, CDN-a i npm paketa. Sav JS je vanilla i živi u `script.js`.
- Putanje su isključivo relativne (`./style.css`, `#sekcija`) — sajt mora da radi i preko `file://` i iz poddirektorijuma.
- Uvek `defer` na `<script>` u `<head>`; nema inline skripti ni stilova.
- Boje, radijusi i širine samo kroz varijable u `:root`. Tema se bira atributom `data-theme` na `<html>` (`light` / `dark`), a `@media (prefers-color-scheme: dark)` pokriva sistemsko podešavanje.
- `localStorage` pristup uvek ide kroz `try/catch` — preko `file://` ume da baci `SecurityError`.
- Progresivno unapređenje: elementi koji traže JS (npr. `[data-theme-toggle]`) su u HTML-u `hidden` i otkrivaju se iz skripte. Stranica mora da bude čitljiva i bez JS-a.
- Sav vidljivi tekst je na srpskom (latinica). Nazivi fajlova: `kebab-case`.
- Pristupačnost nije opciona: semantički tagovi, `aria-*` na interaktivnim elementima, `:focus-visible` stilovi, `.visually-hidden` za tekst samo za čitače ekrana.

## Pre nego što završiš

1. `python -m http.server 8000` i proveri da `/`, `/style.css` i `/script.js` vraćaju 200.
2. Otvori stranicu i proveri da nema grešaka u konzoli.
3. `Select-String -Pattern '(href|src)="/'` — ne sme biti apsolutnih putanja.
4. Posle push-a proveri live URL: `Invoke-WebRequest` na `/`, `/style.css` i `/script.js` — deploy traje nekoliko sekundi.
5. `kontakt@example.com` i lokacija u sekciji `#kontakt` su placeholderi — ne ostavljaj ih u produkciji.

## Ne radi

- Ne dodaj `package.json`, lock fajlove, build alate ili generisan CSS bez izričitog dogovora.
- Ne uvoditi zavisnost od Node-a za bilo šta što može da ostane statički fajl.
