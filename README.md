# Browser Battlegorithms

Browser-based capture-the-flag programming game where students write Blockly strategies for allied runners, then watch them play out turn-by-turn against opponents.

The app runs entirely in the browser with no server. Thirty-seven scaffolded guided levels teach Blockly fundamentals through multi-ally coordination. Free play supports Player vs Player and Player vs CPU sandbox matches with configurable team size and map.

## Commands

```
npm install
npm run dev          # dev server at http://127.0.0.1:4173 by default
npm run build
npm test
npm run test:browser
```

## Dev Server Port

On a fresh clone, copy `.env.example` to `.env` to set the default dev server port.

Configured via `DEV_PORT` in `.env`. Override locally without affecting other contributors by creating a `.env.local` file (gitignored):

```
DEV_PORT=3000
```

## Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [Game Specification](./docs/GameSpecification.md)
- [Student Guide](./docs/StudentGuide.md)
- [Teacher Guide](./docs/TeacherGuide.md)
- [Testing](./docs/TESTING.md)
- [Fresh Clone Setup](./docs/FRESH_SETUP.md)
- [Development Packet Index](./docs/development/README.md)
