# Sucker

Visual editor and migration tool for new or existing Squid proxy configuration files.

## Features

- **Multi-Version Support**: Works with Squid configuration files from versions 2.x through 7.x
- **Visual Configuration Editor**: Interactive web-based interface for editing Squid configurations
- **Search & Filter**: Quickly find configuration directives by searching over tags
- **Configuration Import**: Import and parse existing `squid.conf` files
- **Version Migration**: Seamlessly migrate configurations between different Squid versions
- **Configuration Preview**: View generated configuration in real-time before applying
- **Enable/Disable Directives**: Toggle configuration options on/off without deleting them
- **Context-Sensitive Help**: Built-in documentation for each configuration directive
- **Custom Templates**: Add your own Squid configuration templates
- **Organized Sections**: Configuration directives grouped by functional categories
- **Multi-line Editor**: Dedicated editor for complex multi-line configuration values

## Architecture

Sucker is a full-stack web application consisting of:

- **Frontend**: React-based UI (v17) with Semantic UI React components
- **Backend**: Python-based REST API using Bottle framework and Gunicorn server
- **Parser**: Custom Squid configuration file parser supporting multiple versions

### Technology Stack

**Frontend:**
- React 17.0.2
- Semantic UI React 2.0.3
- React Scripts 4.0.3

**Backend:**
- Python 3.12+
- Bottle 0.13.4 (web framework)
- Gunicorn 23.0.0 (WSGI server)
- simplejson 3.20.2

## Installation

### Using Docker (Recommended)

```shell
docker pull itworks99/sucker
docker run -d -p 3000:3000 itworks99/sucker
```

### Local Installation (Debian/Ubuntu)

#### Prerequisites
```shell
sudo apt-get install git python3 python3-pip nodejs yarn -y
```

#### Setup
```shell
git clone https://github.com/itworks99/sucker.git
cd sucker
```

#### Install Dependencies
```shell
# Install Python dependencies
pip3 install -e srv/

# Install Node.js dependencies
yarn install

# Build frontend (optional - pre-built version included)
yarn build
```

#### Run Application
```shell
python3 srv/sucker.py
```

The application will start on `http://localhost:3000`

## Development

### Available Scripts

```shell
# Start React development server (port 3000)
yarn start

# Build production frontend
yarn build

# Run tests
yarn test
```

### Project Structure

```
sucker/
├── src/              # React frontend source
│   ├── index.jsx     # Entry point
│   └── sucker.jsx    # Main component
├── srv/              # Python backend
│   ├── sucker.py     # Main server
│   ├── parser.py     # Config parser
│   ├── config.py     # Configuration
│   └── templates/    # Squid config templates
├── build/            # Built frontend assets
└── public/           # Static assets
```

### API Endpoints

- `GET /json` - Retrieve default configuration
- `GET /version` - Get version-specific configuration
- `POST /import` - Import existing Squid configuration
- `GET /` - Serve frontend application

## Usage

Once installed, navigate to `http://localhost:3000/` in your web browser.

### Adding Custom Squid Config Templates

1. Locate your `squid.conf` file
2. Copy it to `srv/templates/` with the naming format: `squid[version].conf`
   - Example: Squid 4.4 → `squid44.conf`
   - Example: Squid 6.13 → `squid613.conf`
3. Restart the application:
   - **Docker**: Rebuild image and restart container
   - **Local**: Restart `python3 srv/sucker.py`

## Screenshot

![Screenshot](Screenshot_Sucker.png)

## License

MIT License – See [LICENSE.TXT](LICENSE.TXT) for details

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
