import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

// 设置存储策略
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // 保存到 uploads 文件夹
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // 自定义文件名
  }
});

function checkFileType(file, cb) {
    //检查文件扩展名是否匹配（例如 .jpg、.png）用 Multer 接收上传的文件时，file.mimetype 就是表示该文件的类型。
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({ storage }); // 创建上传实例

router.post('/', upload.single('image'), (req, res) => { 
    res.send({
        message: 'Image Uploaded',
        image: `/${req.file.path}`
    });
})

export default router;// ✅ 正确导出路由器

