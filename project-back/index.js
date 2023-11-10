const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const port = 6000;

app.use(express.json());

mongoose.connect('mongodb://project-mongodb:27017/admin?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion à la base de données :'));

db.once('open', () => {
  console.log('Connecté à la base de données');
});

app.get('/', (req, res) => {
  res.status(200).json({ response: 'Système de gestion de fichiers' });
});

app.use((req, res) => {
  res.status(404).json({ response: 'Page introuvable' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).json({ response: 'Erreur: ' + err.stack });
});

// Gestion du stockage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Upload d'un fichier

const upload = multer({ storage: storage });

app.post('/file/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ response: 'Fichier uploadé avec succès' });
});

// Téléchargement d'un fichier

app.get('/file/download/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(`${__dirname}/uploads/${filename}`);
});

// Enregistrement et récupération des informations des fichiers

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  // Ajoutez d'autres champs si nécessaire
});

const File = mongoose.model('File', fileSchema);

app.get('/file/get/:filename', async (req, res) => {
  const filename = req.params.filename;
  try {
    const fileInfo = await File.findOne({ filename });
    res.json({ fileInfo });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des informations du fichier' });
  }
});

app.put('/file/rename/:filename', async (req, res) => {
  const oldFilename = req.params.filename;
  const newFilename = req.body.newFilename;

  try {
    const updatedFile = await File.findOneAndUpdate(
      { filename: oldFilename },
      { filename: newFilename },
      { new: true }
    );

    if (!updatedFile) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    res.json({ response: 'Nom du fichier modifié avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification du nom du fichier' });
  }
});

app.listen(port, () => {
  console.log(`API en cours d'exécution sur le port ${port}`);
});