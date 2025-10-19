import json
import logging
from rest_framework.parsers import JSONParser
from rest_framework.exceptions import ParseError
from .crypto import dec_aes_gcm

logger = logging.getLogger(__name__)

class EncryptedJSONParser(JSONParser):
    """
    Parses an encrypted JSON request body.
    Expects the body to be a JSON object with a single key "payload",
    containing the encrypted data string.
    """
    media_type = 'application/json'

    def parse(self, stream, media_type=None, parser_context=None):
        try:
            data = super().parse(stream, media_type, parser_context)
            logger.info(f"Received data keys: {data.keys() if isinstance(data, dict) else 'not a dict'}")
            
            if isinstance(data, dict) and 'payload' in data:
                encrypted_payload = data['payload']
                logger.info(f"Encrypted payload (first 100 chars): {encrypted_payload[:100]}")
                
                decrypted_string = dec_aes_gcm(encrypted_payload)
                logger.info(f"Decrypted string (first 200 chars): {decrypted_string[:200]}")
                
                decrypted_data = json.loads(decrypted_string)
                logger.info(f"Decrypted data keys: {decrypted_data.keys() if isinstance(decrypted_data, dict) else 'not a dict'}")
                
                return decrypted_data
            # If no payload, return data as is (for non-encrypted endpoints)
            logger.info("No payload field found, returning data as is")
            return data
        except (ValueError, json.JSONDecodeError) as e:
            logger.error(f"Encrypted payload parsing failed: {e}", exc_info=True)
            raise ParseError(f"Encrypted payload parsing failed: {e}")
