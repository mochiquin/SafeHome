"""
Tests for core.crypto: Fernet encryption at rest and AES-GCM payload decryption.
"""
import pytest

from core.crypto import dec, dec_aes_gcm, enc
from tests.conftest import encrypt_payload


@pytest.mark.parametrize('plaintext', [
    '123 Main Street, Adelaide SA 5000',
    '+61 400 000 000',
    'unicode: 北京市 · café',
    '',
])
def test_roundtrip(plaintext):
    assert dec(enc(plaintext)) == plaintext


def test_ciphertext_hides_plaintext():
    ciphertext = enc('secret address')
    assert 'secret address' not in ciphertext


def test_same_input_gives_different_ciphertext():
    assert enc('same') != enc('same')


def test_enc_rejects_non_string():
    with pytest.raises(TypeError):
        enc(12345)


def test_dec_rejects_tampered_data():
    with pytest.raises(ValueError):
        dec('not-valid-ciphertext')


def test_missing_key_is_an_error(monkeypatch):
    monkeypatch.delenv('FERNET_KEY')
    with pytest.raises(ValueError, match='FERNET_KEY'):
        enc('data')


def test_wrong_key_cannot_decrypt(monkeypatch):
    ciphertext = enc('data')
    monkeypatch.setenv('FERNET_KEY', 'a-different-key')
    with pytest.raises(ValueError):
        dec(ciphertext)


def test_aes_gcm_payload_from_frontend_decrypts():
    payload = encrypt_payload({'hello': 'world'})['payload']
    assert dec_aes_gcm(payload) == '{"hello": "world"}'


def test_aes_gcm_rejects_tampered_tag():
    iv, ciphertext, tag = encrypt_payload({'a': 1})['payload'].split(':')
    tampered = f'{iv}:{ciphertext}:{"00" * 16}'
    with pytest.raises(ValueError):
        dec_aes_gcm(tampered)
