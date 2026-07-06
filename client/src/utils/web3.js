// client/src/utils/web3.js
//
// Strat utilitar peste ethers.js v6 pentru interacțiunea cu MetaMask.
// Toate donațiile sunt transferuri directe ETH pe rețeaua de test Sepolia:
// non-custodial (banii merg direct de la donator la creator), fără smart contract.

import { BrowserProvider, parseEther } from 'ethers';

// Sepolia testnet — chainId 11155111 (0xaa36a7 în hexazecimal)
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
export const SEPOLIA_CHAIN_ID_DEC = 11155111;

// Verifică dacă MetaMask (sau alt provider EIP-1193) este disponibil în browser
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

// Cere permisiunea și returnează prima adresă conectată din MetaMask.
// Aruncă o eroare cu un cod cunoscut, mapabil la o cheie de traducere.
export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error('err_no_metamask');
  }
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error('err_no_account_selected');
  }
  return accounts[0];
}

// Returnează adresa deja conectată, dacă există, FĂRĂ a cere permisiune.
// Util pentru a afișa starea la încărcarea paginii. Returnează null dacă nu e nimic conectat.
export async function getConnectedAccount() {
  if (!isMetaMaskInstalled()) return null;
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch {
    return null;
  }
}

// Se asigură că MetaMask este pe rețeaua Sepolia; încearcă să comute automat.
// Dacă rețeaua nu e adăugată (eroare 4902), o adaugă cu parametri publici.
export async function ensureSepolia() {
  if (!isMetaMaskInstalled()) throw new Error('err_no_metamask');

  const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (currentChainId === SEPOLIA_CHAIN_ID_HEX) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
    });
  } catch (switchError) {
    // 4902 = rețeaua nu este configurată în MetaMask -> o adăugăm
    if (switchError && switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: SEPOLIA_CHAIN_ID_HEX,
          chainName: 'Sepolia',
          nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://rpc.sepolia.org'],
          blockExplorerUrls: ['https://sepolia.etherscan.io']
        }]
      });
    } else {
      // include cazul 4001 (user a refuzat comutarea) — îl lăsăm să urce
      throw switchError;
    }
  }
}

// Trimite o donație directă (transfer ETH) către o adresă, pe Sepolia.
// `amountEth` este un string sau număr, ex. "0.01". Returnează hash-ul tranzacției.
export async function sendDonation(toAddress, amountEth) {
  if (!isMetaMaskInstalled()) throw new Error('err_no_metamask');

  // 1. Ne asigurăm că suntem pe Sepolia
  await ensureSepolia();

  // 2. Construim provider + signer din MetaMask
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // 3. Convertim suma din ETH în wei (bigint în ethers v6)
  let value;
  try {
    value = parseEther(String(amountEth));
  } catch {
    throw new Error('err_invalid_amount');
  }
  if (value <= 0n) throw new Error('err_invalid_amount');

  // 4. Trimitem tranzacția — MetaMask deschide fereastra de confirmare
  const tx = await signer.sendTransaction({ to: toAddress, value });
  return tx.hash;
}

// Construiește link-ul către tranzacție pe exploratorul Sepolia
export function sepoliaTxUrl(txHash) {
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}
