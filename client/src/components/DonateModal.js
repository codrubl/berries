import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { sendDonation, sepoliaTxUrl, isMetaMaskInstalled } from '../utils/web3';

const PRESETS = ['0.001', '0.01', '0.05'];

const ERROR_KEYS = {
  err_no_metamask: 'donate_err_no_metamask',
  err_invalid_amount: 'donate_err_invalid_amount',
  err_no_account_selected: 'donate_err_no_account'
};

export default function DonateModal({ recipientAddress, recipientUsername, onClose }) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState('0.01');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [txHash, setTxHash] = useState('');
  const [errorKey, setErrorKey] = useState('');

  const sending = status === 'sending';

  const handleDonate = async () => {
    setErrorKey('');

    if (!isMetaMaskInstalled()) {
      setStatus('error');
      setErrorKey('donate_err_no_metamask');
      return;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setStatus('error');
      setErrorKey('donate_err_invalid_amount');
      return;
    }

    setStatus('sending');
    try {
      const hash = await sendDonation(recipientAddress, amount);
      setTxHash(hash);
      setStatus('success');
    } catch (err) {
      if (err && (err.code === 4001 || err.code === 'ACTION_REJECTED')) {
        setStatus('idle');
        return;
      }
      setStatus('error');
      setErrorKey(ERROR_KEYS[err?.message] || 'donate_err_generic');
    }
  };

  const short = `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`;

  return (
    <div className="donate-overlay" onClick={sending ? undefined : onClose}>
      <div className="donate-panel card" onClick={(e) => e.stopPropagation()}>
        <div className="card__body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
              {t('donate_title', { username: recipientUsername })}
            </h3>
            <button
              onClick={onClose}
              disabled={sending}
              aria-label={t('donate_close')}
              style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: sending ? 'default' : 'pointer', color: 'var(--ink-400)' }}
            >
              ✕
            </button>
          </div>

          {status === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <div className="donate-success-icon">✓</div>
              <p style={{ marginBottom: 'var(--space-md)' }}>
                {t('donate_success', { username: recipientUsername })}
              </p>
              <a
                href={sepoliaTxUrl(txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--secondary btn--small"
              >
                {t('donate_view_tx')}
              </a>
              <button
                className="btn btn--primary"
                style={{ marginTop: 'var(--space-lg)', width: '100%' }}
                onClick={onClose}
              >
                {t('donate_close')}
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--ink-500)', marginBottom: 'var(--space-md)' }}>
                {t('donate_network_note')}
              </p>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <span className="wallet-badge">🔗 {short}</span>
              </div>

              <label className="form-label">{t('donate_amount_label')}</label>
              <div className="donate-amount-row">
                <input
                  type="number"
                  className="form-input"
                  value={amount}
                  min="0"
                  step="0.001"
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={sending}
                  style={{ flex: 1 }}
                />
                <span style={{ fontWeight: 600, color: 'var(--ink-600)' }}>ETH</span>
              </div>

              <div className="donate-presets">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => setAmount(p)}
                    disabled={sending}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {status === 'error' && errorKey && (
                <div className="alert alert--error" style={{ marginTop: 'var(--space-md)' }}>
                  {t(errorKey)}
                </div>
              )}

              <button
                className="btn btn--primary"
                style={{ marginTop: 'var(--space-lg)', width: '100%' }}
                onClick={handleDonate}
                disabled={sending}
              >
                {sending ? t('donate_sending') : t('donate_confirm')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
