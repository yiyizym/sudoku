First generate the bundled data by
```bash
cd backend/dao && npx tsx save_bundled-data.ts
```

Then handle the rest by

```bash
node build.js
```

Finally, commit and push the changes.

```bash
cd ../sudoku_release_version && git add . && git commit -m "update" && git push
```