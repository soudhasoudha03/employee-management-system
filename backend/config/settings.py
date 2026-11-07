ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'employee-management-api-6jma.onrender.com',
]

# Automatically allow Render's assigned hostname
RENDER_EXTERNAL_HOSTNAME = os.getenv('RENDER_EXTERNAL_HOSTNAME')

if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)