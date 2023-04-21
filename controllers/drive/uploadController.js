const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");

const { File } = require("../../models/File");

const CURRENT_DIR = path.join(process.cwd(), "controllers/drive");

const TOKEN_PATH = path.join(CURRENT_DIR, "token.json");
const CREDENTIALS_PATH = path.join(CURRENT_DIR, "credentials.json");

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.promises.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.promises.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/drive.file",
    ],
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function createFolderIfNotExists(drive, folderName) {
  const folderExists = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
    fields: "files(id)",
  });

  if (folderExists.data.files.length > 0) {
    return folderExists.data.files[0].id;
  }

  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: ["1GBWHwnG1QQj8hkOz42UwKmqi0SV7ULjn"],
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

      const client = await authorize();
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
      const client = await authorize();
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
      // const files = await File.find({ userID: userID });
      const files = await File.find({ userID: userID }).sort({ _id: -1 });

      res.json({
        success: true,
        files: files,
      });
    } catch (err) {
      return next(err);

      //   const client = await authorize();
      //   const drive = google.drive({ version: "v3", auth: client });
      //   const { userID } = req.body;

      //   const folderID = await createFolderIfNotExists(drive, userID);

      //   const files = await drive.files.list({
      //     q: `'${folderID}' in parents`,
      //     fields: "files(id, name, webViewLink, createdTime)",
      //   });

      //   files.data.files.sort((a, b) => {
      //     return new Date(b.createdTime) - new Date(a.createdTime);
      //   });

      //   res.json({
      //     success: true,
      //     files: files.data.files,
      //   });
      // } catch (err) {
      //   return next(err);
    }
  },

  async deleteFile(req, res, next) {
    try {
      const client = await authorize();
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

// const { CustomErrorHandler } = require("../../services");
// const { google } = require("googleapis");
// const fs = require("fs");
// const path = require("path");
// const process = require("process");
// const { authenticate } = require("@google-cloud/local-auth");
// const multer = require("multer");

// const dotenv = require("dotenv");
// const config = require("../../config");

// dotenv.config();

// const CURRENT_DIR = path.join(process.cwd(), "controllers/drive");

// async function loadSavedCredentialsIfExist() {
//   try {
//     return google.auth.fromJSON(config);
//   } catch (err) {
//     return null;
//   }
// }

// async function authorize() {
//   let client = await loadSavedCredentialsIfExist();
//   if (client) {
//     return client;
//   }
//   return null;
// }

// async function createFolderIfNotExists(drive, folderName) {
//   const folderExists = await drive.files.list({
//     q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
//     fields: "files(id)",
//   });

//   if (folderExists.data.files.length > 0) {
//     return folderExists.data.files[0].id;
//   }

//   const fileMetadata = {
//     name: folderName,
//     mimeType: "application/vnd.google-apps.folder",
//     parents: ["1GBWHwnG1QQj8hkOz42UwKmqi0SV7ULjn"],
//   };

//   const response = await drive.files.create({
//     requestBody: fileMetadata,
//     fields: "id",
//   });

//   return response.data.id;
// }

// const uploadController = {
//   async upload(req, res, next) {
//     try {
//       const client = await authorize();
//       const drive = google.drive({ version: "v3", auth: client });
//       const { userID, name, description, date } = req.body;

//       const folderID = await createFolderIfNotExists(drive, userID);

//       // Multer middleware
//       const upload = multer({
//         storage: multer.memoryStorage(),
//         limits: {
//           fileSize: 5 * 1024 * 1024, // 5 MB
//         },
//       }).single("file");

//       upload(req, res, async (err) => {
//         if (err) {
//           return next(new CustomErrorHandler(400, "File upload failed!"));
//         }

//         const file = req.file;
//         const fileName = file.originalname;
//         const mimeType = file.mimetype;
//         const fileContent = file.buffer;

//         fs.promises.writeFile(path.join(CURRENT_DIR, fileName), fileContent);

//         const requestBody = {
//           name: fileName,
//           fields: "id",
//           parents: [folderID],
//         };

//         const media = {
//           mimeType: mimeType,
//           body: fs.createReadStream(path.join(CURRENT_DIR, fileName)),
//         };

//         const driveResponse = await drive.files.create({
//           requestBody,
//           media: media,
//         });

//         fs.promises.unlink(path.join(CURRENT_DIR, fileName));

//         const fileID = driveResponse.data.id;

//         const fileLink = await drive.files.get({
//           fileId: fileID,
//           fields: "webViewLink",
//         });

//         res.json({
//           success: true,
//           id: fileID,
//           link: fileLink.data.webViewLink,
//         });
//       });
//     } catch (err) {
//       return next(err);
//     }
//   },

//   async getFolderLink(req, res, next) {
//     try {
//       const client = await authorize();
//       const drive = google.drive({ version: "v3", auth: client });
//       const { userID } = req.body;

//       const folderID = await createFolderIfNotExists(drive, userID);

//       const folderLink = await drive.files.get({
//         fileId: folderID,
//         fields: "webViewLink",
//       });

//       res.json({
//         success: true,
//         link: folderLink.data.webViewLink,
//       });
//     } catch (err) {
//       return next(err);
//     }
//   },

//   async getFiles(req, res, next) {
//     try {
//       const client = await authorize();
//       const drive = google.drive({ version: "v3", auth: client });
//       const { userID } = req.body;

//       const folderID = await createFolderIfNotExists(drive, userID);

//       const files = await drive.files.list({
//         q: `'${folderID}' in parents`,
//         fields: "files(id, name, webViewLink, createdTime)",
//       });

//       files.data.files.sort((a, b) => {
//         return new Date(b.createdTime) - new Date(a.createdTime);
//       });

//       res.json({
//         success: true,
//         files: files.data.files,
//       });
//     } catch (err) {
//       return next(err);
//     }
//   },

//   async deleteFile(req, res, next) {
//     try {
//       const client = await authorize();
//       const drive = google.drive({ version: "v3", auth: client });
//       const { fileID } = req.body;

//       await drive.files.delete({
//         fileId: fileID,
//       });

//       res.json({
//         success: true,
//       });
//     } catch (err) {
//       return next(err);
//     }
//   },
// };

// module.exports = uploadController;
