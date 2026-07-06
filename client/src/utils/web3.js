import { BrowserProvider, parseEther } from 'ethers';

export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
export const SEPOLIA_CHAIN_ID_DEC = 11155111;

export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error('err_no_metamask');
  }
  try {
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    });
  } catch (err) {
    if (err && err.code === 4001) throw err;
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error('err_no_account_selected');
  }
  return accounts[0];
}

export async function getConnectedAccount() {
  if (!isMetaMaskInstalled()) return null;
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch {
    return null;
  }
}

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
      throw switchError;
    }
  }
}

export async function sendDonation(toAddress, amountEth) {
  if (!isMetaMaskInstalled()) throw new Error('err_no_metamask');

  await ensureSepolia();

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  let value;
  try {
    value = parseEther(String(amountEth));
  } catch {
    throw new Error('err_invalid_amount');
  }
  if (value <= 0n) throw new Error('err_invalid_amount');

  const tx = await signer.sendTransaction({ to: toAddress, value });
  return tx.hash;
}

export function sepoliaTxUrl(txHash) {
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}
