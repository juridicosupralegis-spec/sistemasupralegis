
import os

# Target file on Desktop
file_path = r'C:\Users\migue\Desktop\antigravity\SistemaSupraLegis_V2\app_v2.js'

try:
    # Read as bytes to inspect
    with open(file_path, 'rb') as f:
        bytes_content = f.read()

    # Decode as UTF-8 (this gives us the corrupted string "Ã©")
    text_utf8 = bytes_content.decode('utf-8')
    
    # Fix: Encode "Ã©" (unicode chars) back to bytes using Latin-1.
    # "Ã" is \u00c3. "©" is \u00a9.
    # In Latin-1, \u00c3 -> byte 0xC3. \u00a9 -> byte 0xA9.
    # Together 0xC3 0xA9 forms the UTF-8 sequence for "é".
    fixed_bytes = text_utf8.encode('latin-1')
    
    # Now decode those fixed bytes as UTF-8 to get the correct string "é"
    fixed_text = fixed_bytes.decode('utf-8')
    
    print(f"Fixed content preview: {fixed_text[:50]}")
    
    # Save back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_text)
        
    print("Repair successful.")

except UnicodeEncodeError:
    print("Error: The file contains characters that cannot be mapped to Latin-1. It might already be correct or mixed encoding.")
except Exception as e:
    print(f"Error: {e}")
