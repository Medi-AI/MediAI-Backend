const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
} = require("../../config");

const { File } = require("../../models/File");

const CURRENT_DIR = path.join(process.cwd(), "controllers/drive");

async function loadSavedCredentials() {
  try {
    const credentials = {
      type: "authorized_user",
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
    };
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function createFolderIfNotExists(drive, folderName) {
  const folderExists = await drive.files.list({
    q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
  });

  if (folderExists.data.files.length > 0) {
    return folderExists.data.files[0].id;
  }

  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: ["1ht6tmoKPYUnpE5kuHrvJQG2lAwPjJLRR"],
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    fields: "id",
  });

  return response.data.id;
}

const uploadController = {
  async upload(req, res, next) {
    try {
      const { userID, documentName, documentDescription } = req.body;
      const file = req.file;

      const client = await loadSavedCredentials();
      const drive = google.drive({ version: "v3", auth: client });

      const folderID = await createFolderIfNotExists(drive, userID);

      const fileName = file.originalname;
      const mimeType = file.mimetype;
      const fileContent = file.buffer;

      fs.promises.writeFile(path.join(CURRENT_DIR, fileName), fileContent);

      const requestBody = {
        name: fileName,
        fields: "id",
        parents: [folderID],
      };

      const media = {
        mimeType: mimeType,
        body: fs.createReadStream(path.join(CURRENT_DIR, fileName)),
      };

      const driveResponse = await drive.files.create({
        requestBody,
        media: media,
      });

      fs.promises.unlink(path.join(CURRENT_DIR, fileName));

      const fileID = driveResponse.data.id;

      const fileLink = await drive.files.get({
        fileId: fileID,
        fields: "webViewLink",
      });

      const fileData = {
        userID,
        documentName,
        documentDescription,
        documentLink: fileLink.data.webViewLink,
      };

      const newFile = new File(fileData);
      await newFile.save();

      res.json({
        message: "File uploaded successfully!",
        id: fileID,
        link: fileLink.data.webViewLink,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getFolderLink(req, res, next) {
    try {
      const client = await loadSavedCredentials();
      const drive = google.drive({ version: "v3", auth: client });
      const { userID } = req.body;

      const folderID = await createFolderIfNotExists(drive, userID);

      const folderLink = await drive.files.get({
        fileId: folderID,
        fields: "webViewLink",
      });

      res.json({
        success: true,
        link: folderLink.data.webViewLink,
      });
    } catch (err) {
      return next(err);
    }
  },

  async getFiles(req, res, next) {
    try {
      const { userID } = req.body;
      const files = await File.find({ userID: userID }).sort({ _id: -1 });

      res.json({
        success: true,
        files: files,
      });
    } catch (err) {
      return next(err);
    }
  },

  async deleteFile(req, res, next) {
    try {
      const client = await loadSavedCredentials();
      const drive = google.drive({ version: "v3", auth: client });
      const { fileID } = req.body;

      await drive.files.delete({
        fileId: fileID,
      });

      res.json({
        success: true,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = uploadController;
