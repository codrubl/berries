# Berries

**O platformă socială diferită, cu donații prin blockchain.**

> **Lucrare de licență** — *„Integrarea tehnologiei blockchain într-o aplicație web”*
> Universitatea de Vest din Timișoara, Facultatea de Informatică

---

## Cuprins

- [Despre proiect](#despre-proiect)
- [Funcționalități](#funcționalități)
- [Stack tehnologic](#stack-tehnologic)
- [Structura proiectului](#structura-proiectului)
- [Dependențe](#dependențe)
- [Instalare](#instalare)
- [Utilizare](#utilizare)
- [Donații prin blockchain](#donații-prin-blockchain)

---

## Despre proiect

Berries este o aplicație web full-stack construită pe stack-ul **MERN** (MongoDB, Express, React, Node.js). Ideea centrală este eliminarea mecanismelor de manipulare a atenției întâlnite în rețelele sociale clasice: nu există algoritm de recomandare a postărilor, nu există like-uri și nu se contorizează vizualizările unei postări. Conținutul de pe platformă apare în ordine strict cronologică, iar singura formă de „apreciere” a unui creator este o donație directă prin intermediul blockchain.

---

## Funcționalități

- **Feed cronologic** — postările apar de la cel mai nou la cel mai vechi, fără nicio prioritizare algoritmică bazată pe popularitate.
- **Postări și comentarii** — creare, citire, ștergere (cu ștergere în cascadă a comentariilor la ștergerea postării).
- **Autentificare** — înregistrare și login cu JWT; parolele sunt criptate cu bcrypt.
- **Avatar** — încărcare și ștergere imagine de profil.
- **Categorii și tag-uri** — sistem de categorii pentru organizarea conținutului.
- **Personalizarea feed-ului** — un chatbot simplu care răspunde pe baza intereselor/cuvintelor-cheie.
- **Dark mode** — comutare temă întunecată, persistentă.
- **Interfață bilingvă RO / EN** — schimbarea limbii la nivel de UI.
- **Profiluri publice** — pagini de profil vizibile pentru fiecare utilizator.
- **Sistem de administrare** — conturile de admin pot șterge orice conținut.
- **Donații blockchain** — transfer direct de cryptocurrentcy între utilizatori prin MetaMask.

---

## Stack tehnologic

**Frontend**
- React
- React Router
- ethers.js (pentru interacțiune cu MetaMask / blockchain)
- CSS

**Backend**
- Node.js + Express
- Mongoose
- JSON Web Token (`jsonwebtoken`) pentru autentificare
- `bcryptjs` pentru hashing-ul parolelor
- `multer` pentru upload de fișiere

**Bază de date**
- MongoDB

**Blockchain**
- MetaMask (extensie de browser)
- Rețeaua de test Ethereum **Sepolia** (Chain ID `11155111`)

---

## Structura proiectului

```
berries/
├── client/               # Aplicația React (frontend)
│   ├── src/
│   │   └── context/      # Sistem autentificare/schimbare limbaj
│   └── package.json
├── server/               # API REST (backend)
│   ├── config/
│   │   └── db.js          # conexiunea la MongoDB
│   ├── routes/
│   │   ├── auth.js        # /api/auth
│   │   ├── posts.js       # /api/posts
│   │   └── comments.js    # /api/comments
│   ├── uploads/           # fișiere încărcate
│   └── index.js           # punctul de intrare al serverului
├── .env                  # variabile de mediu
└── package.json          # scripturi + dependențe backend
```

---

## Dependențe

Ai nevoie de:

- **Node.js** — recomandat v24
- **npm** — vine împreună cu Node.js
- **MetaMask** — extensie de browser, necesară doar pentru donații (pe rețeaua de test Sepolia).

---

## Instalare

### 1. Instalează Node.js și Git

Descarcă și instalează Node.js de pe <https://nodejs.org>, apoi verifică instalările:

```bash
node -v
npm -v
```

### 2. Descarcă codul sursă Berries

Dezarhivează fișierele și intră în folderul `berries` din terminal (Command Prompt) folosind comanda:

```bash
cd berries
```
Atenție: în functie de unde este salvat folderul `berries`, comanda poate fii de exemplu `cd C:\Users\User\Downloads\berries`

### 3. Instalează dependențele (pentru backend/frontend)

Rulează în același terminal:

```bash
npm run install-all
```

### 4. Pornește aplicația

Rulează în același terminal:

```bash
npm run dev
```

Comanda pornește simultan serverul (pe `:5000`) și clientul (pe `:3000`). Aplicația ar trebui sa fie deschisă automat în browser, dacă nu, se poate deschide manual la:

```
http://localhost:3000
```

### 5. Configurează MetaMask (pentru sistemul de donații blockchain)

1. Instalează extensia MetaMask și creează sau importă un portofel.
2. Alege rețeaua de test Ethereum Sepolia (Chain ID `11155111`).
3. Obține ETH de test dintr-un faucet Sepolia (vezi secțiunea [Donații](#donații-cryptomonede-folosind-sepolia-testnet)).
4. Leagă adresa portofelului de profilul tău Berries.

---

## Utilizare

1. Creează un cont sau autentifică-te (email, parolă).
2. Publică postări și comentează la postările altora.
3. Personalizează-ți profilul cu poză de profil sau interese care influențează ordinea în cadrul categoriilor din feed.
4. Testează asistentul pentru sugestii pe baza cuvintelor-cheie.
5. Pentru a primi donații: conectează-ți portofelul MetaMask la profil.
6. Pentru a dona: vezi secțiunea de mai jos.

---

## Donații prin blockchain

Funcția de donații rulează pe rețeaua de test Ethereum Sepolia.

**Pași:**

1. Instalează extensia MetaMask în browser.
2. Creeaza un cont nou sau intră intr-un cont existent.
3. Selectează un portofel in rețeaua Sepolia (Chain ID `11155111`).
4. Obține ETH de test dintr-un faucet Sepolia (de exemplu [Google Cloud Web 3 Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia') ).
5. Conectează adresa MetaMask la profilul Berries.
6. Un utilizator autentificat vede butonul „Donează” pe postările oricărui utilizator cu portofel crypto conectat.
7. La apăsarea butonului pentru a dona, MetaMask va deschide selectorul de cont și va cere confirmarea pentru un transfer Peer2Peer direct către portofelul crypto al celuilalt utilizator.