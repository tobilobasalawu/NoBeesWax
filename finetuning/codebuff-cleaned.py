import pandas as pd

# Read the CSV file with UTF-8 encoding and handle encoding errors
df = pd.read_csv('coupons_output2.csv', encoding='utf-8', encoding_errors='replace')

# Remove duplicates
df = df.drop_duplicates()

# Remove rows where any column contains 'Error', 'Invalid', or 'Timeout'
error_mask = df.apply(lambda x: ~x.astype(str).str.contains('Error|Invalid|Timeout', case=False, na=False)).all(axis=1)
df = df[error_mask]

# Clean up whitespace and special characters in string columns
def clean_text(x):
    if pd.isna(x):
        return x
    return str(x).strip().replace('┬', '').replace('ó', '')

df = df.apply(lambda x: x.map(clean_text) if x.dtype == 'object' else x)

# List of invalid discount code patterns
invalid_codes = [
    'N/A', 'NA', 'None', '-', '',
    'Not provided', 'No code provided',
    'No coupon code visible', '[No coupon code visible]',
    'Not specified', 'No specific code',
    'No code', 'Unknown', 'Blank',
    '[No code present]', '[No explicit code provided]',
    '[No coupon code or promo code visible]'
]

# Replace empty strings, 'NaN', 'None', and invalid codes with actual NaN
df = df.replace(r'^\s*$', pd.NA, regex=True)
df = df.replace(invalid_codes + ['NaN'], pd.NA)

# Drop rows where all columns are NaN
df = df.dropna(how='all')

# Drop rows where Discount Coupon is NaN or empty
df = df.dropna(subset=['Discount Coupon'])

# Drop rows where Brand or Info is completely empty
df = df.dropna(subset=['Brand', 'Info'], how='all')

# Additional filter to remove rows where discount code looks invalid
def is_valid_code(code):
    if pd.isna(code):
        return False
    code = str(code).lower()
    # Check if code contains any invalid patterns
    invalid_patterns = ['not', 'none', 'n/a', 'no ', 'invalid', 'blank', 'unknown']
    if any(pattern in code.lower() for pattern in invalid_patterns):
        return False
    # Check if code is just punctuation or special characters
    if all(c in '[](){}/\\.,- ' for c in code):
        return False
    return True

# Apply the valid code filter
df = df[df['Discount Coupon'].apply(is_valid_code)]

# Save the cleaned data with UTF-8 encoding
df.to_csv('coupons_output2_cleaned.csv', index=False, encoding='utf-8')

print(f"Original rows: {len(pd.read_csv('coupons_output2.csv', encoding='utf-8', encoding_errors='replace'))}")
print(f"Cleaned rows: {len(df)}")
