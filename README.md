# 🧟‍♂️ CoD Zombies Easter Egg Tools

A collection of tools to help complete **Call of Duty Zombies** story Easter Eggs, starting with **Gorod Krovi** from Black Ops 3. Whether you're defusing bombs or solving valve puzzles, this app gives you everything you need in one place.

## 🔧 Current Features

### 🧨 Bomb Step Tool

* Use **voice recognition** to record the bomb defusal order.
* Playback the order easily when you're ready to defuse.
* Designed to speed up coordination and reduce mistakes.

### 🔧 Valve Step Tool

* Input in-game values to get the correct valve positions.
* Guides you step-by-step through this part of the Easter egg.

More maps and tools coming soon!

---

## 🚀 Running the App Locally (Web Version)

1. **Clone the repo**:

   ```bash
   git clone https://github.com/yourusername/zombies-easter-egg-tools.git
   cd zombies-easter-egg-tools
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the app**:

   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:3000`.

---

## 🖥️ Building the Portable App (Electron)

We’re working on an Electron build so you can use the app locally as a standalone executable.

### ⚙️ Planned Setup

1. After running `npm install`, build the frontend:

   ```bash
   npm run build
   ```

2. Package it with Electron:

   ```bash
   npm run electron:build
   ```

> A full setup script and build instructions will be added soon.

---

## 🌐 Hosting on a Web Server

You can host the app anywhere that supports static file serving.

### Build for production:

```bash
npm run build
```

Then, host the output directory (`.next` or `out` depending on your config) using:

* **Vercel** (recommended)
* **Netlify**
* **GitHub Pages** (if using `next export`)
* Your own NGINX/Apache server

---

## 💡 Roadmap

* Add more tools for other maps (Origins, Der Eisendrache, etc.)
* Offline voice recognition support for better performance
* Game overlay integration (if possible)

---

## 🤝 Contributions

Pull requests, ideas, and feature requests are welcome. Let’s make this the ultimate Zombies companion app!

---

## 📜 License

MIT — feel free to use, modify, and share.

---

Let me know if you want badges (like MIT license, stars, issues, etc.) or want to auto-generate screenshots/previews in the README.
