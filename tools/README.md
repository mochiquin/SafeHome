# SafeHome Development Tools

This directory contains auxiliary tools for SafeHome project development.

## generate-keys.py

A script for generating the encryption keys required by the project.

### Purpose
Generates the following three keys:
- **DJANGO_SECRET_KEY**: Django framework security key
- **FERNET_KEY**: For encrypting sensitive data (such as address, phone number)
- **JWT_SIGNING_KEY**: For JWT token signing

### Usage

```bash
# Generate keys and copy to clipboard
python tools/generate-keys.py

# Or specify the full path
python "E:\SafeHome\tools\generate-keys.py"
```

### Output Example

```
SafeHome Key Generation Script
==================================================

Keys generated successfully!

DJANGO_SECRET_KEY=eYdo6KkGa6CUcHk1tybya3OSDOnLvySCp8aChtjb3TFNrdURPN12fJV01fQ69XEPnVM
FERNET_KEY=CCQM5kRGxJIMrR8hmxz9X-aJzqSGX_T1AA6GZYdTscI=
JWT_SIGNING_KEY=3Ov1s4ZVRGI4wxRjsodZAUfSvOoGDO9j0LUQwVJTaO4=

All keys have been copied to clipboard!
You can now paste them into your .env file.
```

### Next Steps

1. Create `compose/.env` file (copy from `compose/.env.example`)
2. Fill in the generated keys in the corresponding positions
3. Add other environment variables (Stripe keys, etc.)

### Security Reminders
- These keys have high security, please keep them properly
- Do not commit files containing keys to version control system
- Replace these keys regularly in production environment

## Usage Instructions

These tools are designed to help developers quickly set up the development environment and ensure secure key generation and management.
