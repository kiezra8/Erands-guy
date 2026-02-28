import base64, os

src = r'C:\Users\Jolly\.gemini\antigravity\brain\454fb43e-5a77-4d1b-9ff0-fe6819910bf8\erands_hero_image_1772275304716.png'
dst = r'C:\Users\Jolly\Erands guy\src\heroImage.js'

with open(src, 'rb') as f:
    data = f.read()

b64 = base64.b64encode(data).decode('ascii')
uri = 'data:image/png;base64,' + b64

with open(dst, 'w', encoding='utf-8') as f:
    f.write('// Auto-generated — hero image embedded as base64\n')
    f.write('const heroImage = "' + uri + '";\n')
    f.write('export default heroImage;\n')

print('Done! File written to:', dst)
print('Base64 length:', len(b64))
