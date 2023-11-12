const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const port = 6000;
const fs = require('fs');
const path = require('path');

app.use(express.json());

mongoose.connect('mongodb://project-mongodb:27017/Files?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false');

const db = mongoose.connection;

const FileModel = require('./models/fileModel.js');

db.on('error', console.error.bind(console, 'Erreur de connexion à la base de données :'));

db.once('open', () => {
  console.log('Connecté à la base de données');
});

app.get('/', (req, res) => {
  res.status(200).json({ response: 'Système de gestion de fichiers' });
});

// Gestion du stockage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/files');
  },
  filename: function (req, file, cb) {
    const filename = `${file.originalname}`;
    cb(null, filename);
  },
});

// Upload d'un fichier

const upload = multer({ storage: storage });

app.post('/file/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const uniqueId = Date.now();

  if (!file) {
    return res.status(400).json({ error: 'Aucun fichier trouvé' });
  }

  const newFile = new FileModel({
    name: file.filename,
    id: uniqueId,
    path: file.path,
  });

  try {
    await newFile.save();
    res.status(200).json({ response: 'Fichier uploadé avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement des informations du fichier' });
  }
});

// Téléchargement d'un fichier

app.get('/file/download/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const fileInfo = await FileModel.findOne({ id: fileId });

    if (!fileInfo) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    const filePath = fileInfo.path;
    res.download(`${filePath}`, path.basename(`${filePath}`), (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement du fichier :', err);
        res.status(500).send('Erreur lors du téléchargement du fichier.');
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la recherche du fichier dans la base de données' });
  }
});

// Suppression d'un fichier

app.delete('/file/remove/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const fileInfo = await FileModel.findOne({ id: fileId });

    if (!fileInfo) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    const filePath = fileInfo.path;

    fs.unlinkSync(filePath);

    await FileModel.deleteOne({ id: fileId });

    res.json({ response: 'Fichier supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
  }
});

// Rename du fichier

app.put('/file/rename/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  const newFilename = req.body.newFilename;

  try {
    const fileInfo = await FileModel.findOne({ id: fileId });

    if (!fileInfo) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    const oldFilePath = fileInfo.path;
    const fileExtension = path.extname(oldFilePath);

    const newFilePath = path.join(path.dirname(oldFilePath), `${newFilename}${fileExtension}`);

    fs.renameSync(oldFilePath, newFilePath);

    await FileModel.updateOne({ id: fileId }, { name: `${newFilename}${fileExtension}`, path: newFilePath });

    res.json({ response: 'Nom du fichier modifié avec succès' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Erreur lors de la modification du nom du fichier' });
  }
});


// Obtenir la liste de tous les fichiers
app.get('/file/all', async (req, res) => {
  try {
    const allFiles = await FileModel.find();
    res.json({ files: allFiles });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la liste des fichiers' });
  }
});




app.use((req, res) => {
  res.status(404).json({ response: 'Page introuvable' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).json({ response: 'Erreur: ' + err.stack });
});



app.listen(port, () => {
  console.log(`API en cours d'exécution sur le port ${port}`);
});