import fs from "node:fs";
import path from "node:path";
import config from "../config/storage.js";

const StorageMap = {
  public: config.publicPath,
  assets: config.assetsPath
}

const createFolder = (type, folder) => {
  const prefix = StorageMap[type] || config.publicPath;
  const folderPath = path.join(process.cwd(), prefix, folder);
  return new Promise((resolve, reject) => {
    fs.access(folderPath, fs.constants.F_OK, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) {
              console.error("ERROR fs.mkdir", err);
              reject(err);
            } else {
              resolve(folderPath);
            }
          });
        } else {
          console.error("ERROR fs.access", err);
          reject(err);
        }
      } else {
        resolve(folderPath);
      }
    });
  });
}

export const getFileUrl = (type, folder, fileName) => {
  const prefix = StorageMap[type] || config.publicPath;
  return `/${path.join(prefix, folder, fileName)}`;
}

export const putObjects = async (files, type, folder) =>{
  const bashPath = await createFolder(type, folder);
  const promises = files.map(file => {
    const fileName = file.filename;
    const dest = path.join(bashPath, fileName);
    const originalPath = file.path;
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(originalPath);
      const writeStream = fs.createWriteStream(dest);
      readStream.on("error", reject);
      writeStream
        .on("error", reject)
        .on("finish", () => {
          resolve(getFileUrl(type, folder, fileName));
        });
      readStream.pipe(writeStream);
    });
  });
  const results = await Promise.all(promises);
  return results;
};

export const deleteObjects = async (keys) => {
  if (!keys?.length) return Promise.resolve();
  console.log("START storage.deleteObjects", keys);
  const promises = keys.map(key => {
    return new Promise((resolve) => {
      fs.unlink(key, (err) => {
        if (err) console.error("ERROR fs.unlink", key);
        resolve();
      })
    });
  });
  return Promise.all(promises);
};